import Vcore from "./VCore";
import BaseChart from "./BaseChart";
import { circle, text, generateBackgroundColors, map } from "./helper";
import Color from "absol/src/Color/Color";
import { translate, rotate } from "./template";

var _ = Vcore._;
var $ = Vcore.$;

function SunburstChart() {
    this.$title = $('.base-chart-title', this);
    this.$content = $('.sunburst-chart-content', this);
    this.$attachhook = _('attachhook').addTo(this);
    var thisChart = this;
    this.sync = new Promise(function (rs) {
        thisChart.$attachhook.on('error', rs);
    });
};


SunburstChart.render = function () {
    return _({
        tag: 'svg',
        class: ['sunburst-chart', 'base-chart'],
        child: [{
            tag: 'text',
            class: 'base-chart-title',
            attr:{
                'text-anchor':'middle',
                y: 20
            }
        },
        {
            class: 'sunburst-chart-content'
        }]
    });
};


SunburstChart.prototype.updateSize = BaseChart.prototype.updateSize;

SunburstChart.prototype.acceptNode = function (node, visitFunction, content) {
    visitFunction(node, content);
    if (node.child) {
        node.child.forEach(function (cNode) {
            this.acceptNode(cNode, visitFunction, content);
        }.bind(this));
    }
};



SunburstChart.prototype.update = function () {
    this.updateSize();
    this.updateBackComp();
    this.updateComp();
};



SunburstChart.prototype.initRoot = function () {
    var rootWords = this.root.name.trim().split(/\s+/);
    var rectsPerLine = Math.ceil(Math.sqrt(rootWords.length) * Math.log10(7));
    var lines = rootWords.reduce(function (ac, cr) {
        if (ac.top.length == 0) {
            ac.result.push(ac.top);
        }
        ac.top.push(cr);
        if (ac.top.length >= rectsPerLine) ac.top = [];
        return ac;
    }, { result: [], top: [] }).result;

    this.$root = _('g.base-chart-title').addTo(this.$content);
    this.$root.$circle = circle(0, 0, 0).addTo(this.$root);
    var textColor;
    if (this.root.fillColor) {
        var fillColor = this.root.fillColor;
        if (this.root.fillColor == 'auto') {
            fillColor = this.autoFillColors.pop().toString('rgb');
        }
        textColor = Color.parse(fillColor).getContrastYIQ().toString('rgb');

        this.$root.$circle.addStyle('fill', fillColor);
    }
    this.$root.$lines = lines.map(function (line, i, arr) {
        return text(line.join(' '), 0, -(arr.length * this.titleLineHeight) / 2 + 15 + this.titleLineHeight * i).attr('text-anchor', 'middle').addTo(this.$root);
    }.bind(this));
    if (textColor) {
        this.$root.$lines.forEach(function (l) {
            l.addStyle('fill', textColor);
        })
    }

    this.sync = this.sync.then(function () {
        var box = this.$root.getBBox();
        var r = Math.sqrt(box.width * box.width + box.height * box.height) / 2 + this.titleCirclePadding;
        this.$root.$circle.attr('r', r + '');
        this.radiuses = [r];
    }.bind(this));
};

SunburstChart.prototype.initBackComp = function () {
    this.autoColorCount = 0;
    this.acceptNode(this.root, function (node, content) {
        if (node.fillColor == 'auto') {
            content.autoColorCount++;
        }
    }, this);

    this.autoFillColors = generateBackgroundColors(this.autoColorCount + 1);
    this.initRoot();
};





SunburstChart.prototype.updateBackComp = function () {
    this.$title.attr({
        x: this.canvasWidth/2
    })
    this.$content.attr('transform', translate(0, 0));
};


SunburstChart.prototype.initChartNode = function ($node) {
    var sum = $node.chartDataNode.value;
    if (!$node.chartDataNode.child || !($node.chartDataNode.child.length > 0)) return;

    $node.$childNodes = $node.chartDataNode.child.map(function (chartDataNode) {
        var fillColor = chartDataNode.fillColor || $node.chartFillColor;
        if (fillColor == 'auto') fillColor = this.autoFillColors.pop().toString('rgb');
        var res = _({
            tag: 'g', class: 'sunburst-chart-node',
            props: {
                chartDataNode: chartDataNode,
                level: $node.level + ($node.chartDataNode.span || 1),
                chartFillColor: fillColor,
                textColor: Color.parse(fillColor).getContrastYIQ().toString('rgb')
            }
        });
        res.$title = _('<title>' + chartDataNode.name + ': ' + chartDataNode.value + '</title>').addTo(res);
        res.$shape =
            _({
                tag: 'shape',
                class: 'sunburst-chart-node-shape',
                style: {
                    //todo
                    fill: res.chartFillColor || 'white'

                }

            }).addTo(res);
        res.$nameCotainer = _('g').addTo(res);
        // res.$name = vchart.text(chartDataNode.name, 0, 5, 'sunburst-chart-node-name').attr('text-anchor', 'middle').addTo(res.$nameCotainer);
        return res.addTo(this.$content);
    }.bind(this));

    $node.$childNodes.reduce(function (offset, $childNode) {
        $childNode.chartAngle = [
            map(offset, 0, sum, $node.chartAngle[0], $node.chartAngle[1]),
            map(offset + $childNode.chartDataNode.value, 0, sum, $node.chartAngle[0], $node.chartAngle[1])
        ];
        this.initChartNode($childNode);
        return offset += $childNode.chartDataNode.value;
    }.bind(this), 0);
};

SunburstChart.prototype.calDepth = function (node) {
    if (node.child && node.child.length > 0) {
        return 1 + Math.max.apply(Math, node.child.map(this.calDepth.bind(this)));
    }
    else
        return 1;

};

SunburstChart.prototype.initComp = function () {
    this.$root.chartDataNode = this.root;
    this.$root.chartAngle = [-Math.PI / 2, Math.PI * 3 / 2];
    this.$root.level = 0;
    this.depth = this.calDepth(this.root);
    this.$title.clearChild().addChild(_({ text: this.title || '' }))
    this.initChartNode(this.$root);
};



SunburstChart.prototype.updateNode = function ($node) {
    if ($node.$childNodes)
        $node.$childNodes.forEach(this.updateNode.bind(this));
    if ($node.level > 0) {
        var r0 = this.radiuses[0] + ($node.level - 1) * this.segmentLength;
        var r1 = r0 + this.segmentLength * ($node.chartDataNode.span || 1);
        var isLeftPath = ($node.chartAngle[1] + $node.chartAngle[0]) / 2 > Math.PI / 2;
        $node.$nameCotainer.attr('transform', rotate(($node.chartAngle[1] + $node.chartAngle[0]) / 2 / Math.PI * 180 + (isLeftPath ? 180 : 0)));
        // $node.$name.attr('x', (isLeftPath ? -1 : 1) * (r0 + r1) / 2);
        var textX = (isLeftPath ? -1 : 1) * (r0 + r1) / 2;
        if ((r0 + r1) / 2 * Math.abs($node.chartAngle[1] - $node.chartAngle[0]) < 15) {
            $node.$nameCotainer.addStyle('visibility', 'hidden');
        }
        else {
            //todo:
            var nodeText = $node.chartDataNode.name;
            var textColor = $node.textColor;

            var words = nodeText.trim().split(/\s+/);
            var updateNodeSession = this.updateNodeSession;

            var tryText = function (nLine) {
                $node.$nameCotainer.clearChild();
                var wordPerLine = Math.ceil(words.length / nLine);
                var lines = words.reduce(function (ac, cr) {
                    if (ac.top.length == 0) {
                        ac.result.push(ac.top);
                    }
                    ac.top.push(cr);
                    if (ac.top.length >= wordPerLine) ac.top = [];
                    return ac;
                }, { result: [], top: [] }).result;

                lines.reduce(function (y, line) {
                    var lineText = line.join(' ');
                    $node.$nameCotainer.addChild(text(lineText, textX, y, 'sunburst-chart-node-name').attr('text-anchor', 'middle').addStyle('fill', textColor));
                    return y + 20;
                }, 5 - (nLine - 1) * 20 / 2);
                // requestAnimationFrame(function () {
                if (updateNodeSession != this.updateNodeSession) return;
                var box = $node.$nameCotainer.getBBox();
                var out = box.width + 8 > r1 - r0 || box.height > (r0 + r1) / 2 * Math.abs($node.chartAngle[1] - $node.chartAngle[0]);
                if (nLine < words.length && out) {
                    tryText(nLine + 1);
                }
                else if (out) {
                    $node.$nameCotainer.addStyle('visibility', 'hidden')
                }
                else {
                    $node.$nameCotainer.removeStyle('visibility', 'hidden')

                }
                // }.bind(this))

            }.bind(this);

            tryText(1);
        }
        $node.$shape.begin()
            .moveTo(r0 * Math.cos($node.chartAngle[0]), r0 * Math.sin($node.chartAngle[0]))
            .arcTo(r0 * Math.cos($node.chartAngle[1]), r0 * Math.sin($node.chartAngle[1]),
                r0, r0,
                $node.chartAngle[1] - $node.chartAngle[0] > Math.PI ? 1 : 0, 1)
            .lineTo(r1 * Math.cos($node.chartAngle[1]), r1 * Math.sin($node.chartAngle[1]))
            .arcTo(r1 * Math.cos($node.chartAngle[0]), r1 * Math.sin($node.chartAngle[0]),
                r1, r1,
                $node.chartAngle[1] - $node.chartAngle[0] > Math.PI ? 1 : 0, 0)
            .closePath()
            .end();
    }
};

SunburstChart.prototype.tryDrawNode = function ($node) {
    if ($node.$childNodes)
        $node.$childNodes.forEach(this.updateNode.bind(this));
    if ($node.level > 0) {
        var r0 = this.radiuses[0] + ($node.level - 1) * this.segmentLength;
        var r1 = r0 + this.segmentLength * ($node.chartDataNode.span || 1);
        $node.$shape.begin()
            .moveTo(r0 * Math.cos($node.chartAngle[0]), r0 * Math.sin($node.chartAngle[0]))
            .arcTo(r0 * Math.cos($node.chartAngle[1]), r0 * Math.sin($node.chartAngle[1]),
                r0, r0,
                $node.chartAngle[1] - $node.chartAngle[0] > Math.PI ? 1 : 0, 1)
            .lineTo(r1 * Math.cos($node.chartAngle[1]), r1 * Math.sin($node.chartAngle[1]))
            .arcTo(r1 * Math.cos($node.chartAngle[0]), r1 * Math.sin($node.chartAngle[0]),
                r1, r1,
                $node.chartAngle[1] - $node.chartAngle[0] > Math.PI ? 1 : 0, 0)
            .closePath()
            .end();
    }
};

SunburstChart.prototype.meansure = function () {
    this.$content.attr('transform', translate(0, 0));
    var rootBox = this.$root.getBBox();
    this.segmentLength = rootBox.width / 2;// (Math.min(this.canvasHeight, this.canvasWidth) - this.paddingContent * 2) / (this.depth * 2);
    this.tryDrawNode(this.$root);
    var contentBox = this.$content.getBBox();
    var availableWidth = this.canvasWidth - this.paddingContent * 2 - rootBox.width;
    var availableHeight = this.canvasHeight - this.paddingContent * 2 - rootBox.height - 30;
    var outHeight = contentBox.height - rootBox.height;
    var outWidth = contentBox.width - rootBox.width;
    this.segmentLength = Math.min(this.segmentLength / outHeight * availableHeight, this.segmentLength / outWidth * availableWidth);

};

SunburstChart.prototype.updateComp = function () {
    this.meansure();
    this.updateNodeSession = new Date().getTime();
    this.updateNode(this.$root);
    var contentBox = this.$content.getBBox();
    var titleBox = this.$title.getBBox();

    var cx = contentBox.width / 2 + contentBox.x;
    var cy = (contentBox.height - 30) / 2 + contentBox.y;

    this.$content.attr('transform', translate(this.canvasWidth / 2 - cx, this.canvasHeight / 2 - cy));
};


SunburstChart.prototype.preInit = function (props) {
    this.canvasWidth = 300;
    this.canvasHeight = 300;
    this.paddingContent = 5;
    this.titleLineHeight = 22;
    this.titleCirclePadding = 4;
    this.segmentLength = 100;
};


SunburstChart.prototype.init = function (props) {
    this.preInit();
    this.super(props);
    this.initBackComp();
    this.initComp();
    this.sync = this.sync.then(this.update.bind(this));
};

Vcore.creator.sunburstchart = SunburstChart;

export default SunburstChart;