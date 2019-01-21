vchart.creator.sunburstchart = function () {
    var _ = vchart._;
    var $ = vchart.$;
    var res = _('svg.sunburst-chart.base-chart');
    res.$content = _('g').addTo(res);
    res.eventHandler = absol.OOP.bindFunctions();
    res.sync = res.afterAttached();
    return res;
};

vchart.creator.sunburstchart.eventHandler = {};


vchart.creator.sunburstchart.prototype.updateSize = vchart.creator.basechart.prototype.updateSize;


vchart.creator.sunburstchart.prototype.getHighContrastColor = function (h0, s0, l0) {
    var h = h0 + 0.5;
    if (h > 1) h -= 1;
    var s = s0 > 0.5 ? 0 : 1;
    var l = l0 > 0.5 ? 0 : 1;
    var rgba = vchart.hslaToRGBA([h, s, l, 1]);
    return 'rgba(' + rgba.map((x, i) => i < 3 ? x * 255 : x).join(',') + ')';

};
vchart.creator.sunburstchart.prototype.update = function () {
    this.updateSize();
    this.updateBackComp();
    this.updateComp();
};



vchart.creator.sunburstchart.prototype.initRoot = function () {
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

    this.$root = vchart._('g.base-chart-title').addTo(this.$content);
    this.$root.$circle = vchart.circle(0, 0, 0).addTo(this.$root);
    this.$root.$lines = lines.map(function (line, i, arr) {
        return vchart.text(line.join(' '), 0, -(arr.length * this.titleLineHeight) / 2 + 15 + this.titleLineHeight * i).attr('text-anchor', 'middle').addTo(this.$root);
    }.bind(this));

    this.sync = this.sync.then(function () {
        var box = this.$root.getBBox();
        var r = Math.sqrt(box.width * box.width + box.height * box.height) / 2 + this.titleCirclePadding;
        this.$root.$circle.attr('r', r + '');
        this.radiuses = [r];
    }.bind(this));
};

vchart.creator.sunburstchart.prototype.initBackComp = function () {
    this.initRoot();
};





vchart.creator.sunburstchart.prototype.updateBackComp = function () {
    this.cx = this.canvasWidth / 2;
    this.cy = this.canvasHeight / 2;
    this.cr = Math.min(this.canvasHeight, this.canvasWidth) / 2 - this.paddingContent;
    this.$content.attr('transform', vchart.tl.translate(this.cx, this.cy));
};


vchart.creator.sunburstchart.prototype.initChartNode = function ($node) {
    var sum = $node.chartDataNode.value;
    if (!$node.chartDataNode.child || !($node.chartDataNode.child.length > 0)) return;

    $node.$childNodes = $node.chartDataNode.child.map(function (chartDataNode) {

        var res = vchart._({
            tag: 'g', class: 'sunburst-chart-node',
            props: {
                chartDataNode: chartDataNode,
                level: $node.level + ($node.chartDataNode.span || 1),
                chartFillColor: chartDataNode.fillColor || $node.chartFillColor
            }
        });
        res.$title = vchart._('<title>' + chartDataNode.name + ': ' + chartDataNode.value + '</title>').addTo(res);

        res.$shape =
            vchart._({
                tag: 'shape',
                class: 'sunburst-chart-node-shape',
                style: {
                    //todo
                    fill: res.chartFillColor || 'white'

                }

            }).addTo(res);
        res.$nameCotainer = vchart._('g').addTo(res);
        // res.$name = vchart.text(chartDataNode.name, 0, 5, 'sunburst-chart-node-name').attr('text-anchor', 'middle').addTo(res.$nameCotainer);
        return res.addTo(this.$content);
    }.bind(this));

    $node.$childNodes.reduce(function (offset, $childNode) {
        $childNode.chartAngle = [
            Math.map(offset, 0, sum, $node.chartAngle[0], $node.chartAngle[1]),
            Math.map(offset + $childNode.chartDataNode.value, 0, sum, $node.chartAngle[0], $node.chartAngle[1])
        ];
        this.initChartNode($childNode);
        return offset += $childNode.chartDataNode.value;
    }.bind(this), 0);
};

vchart.creator.sunburstchart.prototype.calDepth = function (node) {
    if (node.child && node.child.length > 0) {
        return 1 + Math.max.apply(Math, node.child.map(this.calDepth.bind(this)));
    }
    else
        return 1;

};

vchart.creator.sunburstchart.prototype.initComp = function () {
    this.$root.chartDataNode = this.root;
    this.$root.chartAngle = [-Math.PI / 2, Math.PI * 3 / 2];
    this.$root.level = 0;
    this.depth = this.calDepth(this.root);
    this.initChartNode(this.$root)

};



vchart.creator.sunburstchart.prototype.updateNode = function ($node) {
    if ($node.$childNodes)
        $node.$childNodes.forEach(this.updateNode.bind(this));
    if ($node.level > 0) {
        var r0 = this.radiuses[0] + ($node.level - 1) * this.segmentLength;
        var r1 = r0 + this.segmentLength * ($node.chartDataNode.span || 1);
        var isLeftPath = ($node.chartAngle[1] + $node.chartAngle[0]) / 2 > Math.PI / 2;
        $node.$nameCotainer.attr('transform', vchart.tl.rotate(($node.chartAngle[1] + $node.chartAngle[0]) / 2 / Math.PI * 180 + (isLeftPath ? 180 : 0)));
        // $node.$name.attr('x', (isLeftPath ? -1 : 1) * (r0 + r1) / 2);
        var textX = (isLeftPath ? -1 : 1) * (r0 + r1) / 2;
        if ((r0 + r1) / 2 * Math.abs($node.chartAngle[1] - $node.chartAngle[0]) < 15) {
            $node.$nameCotainer.addStyle('visibility', 'hidden');
        }
        else {
            //todo:
            var text = $node.chartDataNode.name;
            var words = text.trim().split(/\s+/);
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
                    $node.$nameCotainer.addChild(vchart.text(lineText, textX, y, 'sunburst-chart-node-name').attr('text-anchor', 'middle'));
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

vchart.creator.sunburstchart.prototype.updateComp = function () {
    this.segmentLength = (this.cr - this.radiuses[0]) / ((this.depth - 1) + 0.000001);
    this.updateNodeSession = new Date().getTime();
    this.updateNode(this.$root);
};


vchart.creator.sunburstchart.prototype.preInit = function (props) {
    this.canvasWidth = 300;
    this.canvasHeight = 300;
    this.paddingContent = 40;
    this.titleLineHeight = 22;
    this.titleCirclePadding = 4;
    this.segmentLength = 100;

};


vchart.creator.sunburstchart.prototype.init = function (props) {
    this.preInit();
    this.super(props);
    this.initBackComp();
    this.initComp();
    this.sync = this.sync.then(this.update.bind(this));
};

