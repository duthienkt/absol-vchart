import Vcore from "./VCore";
import {circle, text, generateBackgroundColors, map, getGlobalBBox} from "./helper";
import Color from "absol/src/Color/Color";
import {translate, rotate} from "./template";
import BChart from "./BChart";
import OOP from "absol/src/HTML5/OOP";
import Rectangle from "absol/src/Math/Rectangle";

var _ = Vcore._;
var $ = Vcore.$;

/***
 * @extends BChart
 * @constructor
 */
function SunburstChart() {
    BChart.call(this);
    this.$sunbirstCtn = _('gcontainer.vc-sunburst-ctn');
    this.$body.addChild(this.$sunbirstCtn);
    this.root = {};

}

SunburstChart.property = Object.assign({}, BChart.property);
SunburstChart.eventHandler = Object.assign({}, BChart.eventHandler);

OOP.mixClass(SunburstChart, BChart)


SunburstChart.tag = 'SunburstChart'.toLowerCase();

SunburstChart.render = function () {
    return BChart.render().addClass('vc-sunburst-chart');
};

SunburstChart.prototype._normalizeColorData = function () {
    var needAutoColor = [];
    this.acceptNode(this.root, function (node) {
        try {
            if (node.fillColor.rgba) return;
            var c = Color.parse(node.fillColor + '');
            if (!node.fillColor.rgba) node.fillColor = c;
        } catch (error) {
            needAutoColor.push(node);
        }
    });
    var aColors = generateBackgroundColors(needAutoColor.length);
    needAutoColor.forEach(function (node, i) {
        node.fillColor = aColors[i];
    });

    this.acceptNode(this.root, function (node) {
        try {
            if (node.textColor.rgba) return;
            var c = Color.parse(node.textColor + '');
            if (!node.textColor.rgba) node.textColor = c;
        } catch (error) {
            node.textColor = node.fillColor.getContrastYIQ();
        }
    });
};

SunburstChart.prototype.computeData = function () {
    this.computedData.depth = this.calDepth(this.root);
}

SunburstChart.prototype._measureFan = function (r, R, as, ae) {
    var dn = 0;
    if (as < 0) {
        dn = Math.ceil(-as / (Math.PI * 2));
    }
    else if (as >= Math.PI * 2) {
        dn = -Math.floor(as / (Math.PI * 2));
    }

    as += (Math.PI * 2) * dn;
    ae += (Math.PI * 2) * dn;

    var cosS = Math.cos(as);
    var sinS = Math.sin(as);
    var cosE = Math.cos(ae);
    var sinE = Math.sin(ae);
    var A = new Rectangle(r * cosS, r * sinS, 0, 0);
    var B = new Rectangle(R * cosS, R * sinS, 0, 0);
    var C = new Rectangle(R * cosE, R * sinE, 0, 0);
    var D = new Rectangle(r * cosE, r * sinE, 0, 0);
    var points = [A, B, C, D];
    var e90, cosE90, sinE90;
    for (var k = 0; k < 4; ++k) {
        e90 = k * Math.PI / 2;
        cosE90 = Math.cos(e90);
        sinE90 = Math.sin(e90);
        if (e90 > as && e90 < ae) {
            points.push(new Rectangle(r * cosE90, r * sinE90, 0, 0));
            points.push(new Rectangle(R * cosE90, R * sinE90, 0, 0));
        }
    }

    return points.reduce(function (ac, cr) {
        return ac.merge(cr);
    });
};


SunburstChart.prototype._measureSunburst = function (rFan) {
    var r0 = this.computedData.rootR;
    var rects = [new Rectangle(-r0, -r0, 2 * r0, 2 * r0)];

    function visit($node) {
        var level = $node.level
        var r = r0 + rFan * (level - 1);
        var R = r + rFan * $node.span;
        var fanRect = this._measureFan(r, R, $node.chartAngle[0], $node.chartAngle[1]);
        rects.push(fanRect);

        if ($node.$child)
            $node.$child.forEach(visit.bind(this));
    }

    if (this.$root.$child)
        this.$root.$child.forEach(visit.bind(this));

    return rects.reduce(function (ac, cr) {
        return ac.merge(cr);
    });

};


SunburstChart.prototype._findBestFanRadius = function () {
    var mid;
    var bound;
    var exi = 1;
    var aWidth = this.$body.box.width - 4;
    var aHeight = this.$body.box.height - 4;
    var h = (Math.max(aWidth, aHeight) - this.computedData.rootR - 2) / this.computedData.depth;
    var l = (Math.min(aWidth, aHeight) - this.computedData.rootR - 2) / this.computedData.depth / 2;
    mid = (l + h) / 2;
    while (l + exi < h) {
        bound = this._measureSunburst(mid);
        if (bound.width > aWidth || bound.height > aHeight) {
            h = mid;
        }
        else {
            l = mid;
        }
        mid = (l + h) / 2;
    }

    this.computedData.fanR = mid;
};


SunburstChart.prototype.normalizeData = function () {
    BChart.prototype.normalizeData.call(this);
    this._normalizeColorData();
};

// SunburstChart.prototype.updateSize = BaseChart.prototype.updateSize;

SunburstChart.prototype.acceptNode = function (node, visitFunction, content) {
    visitFunction(node, content);
    if (node.child) {
        node.child.forEach(function (cNode) {
            this.acceptNode(cNode, visitFunction, content);
        }.bind(this));
    }
};


SunburstChart.prototype._updateNodePosition = function () {
    var rootR = this.computedData.rootR;
    var fanR = this.computedData.fanR;

    function visit($node) {
        var r0 = rootR + ($node.level - 1) * fanR;
        var r1 = r0 + fanR * $node.span;
        var isLeftPath = ($node.chartAngle[1] + $node.chartAngle[0]) / 2 > Math.PI / 2;
        $node.$nameCtn.attr('transform', rotate(($node.chartAngle[1] + $node.chartAngle[0]) / 2 / Math.PI * 180 + (isLeftPath ? 180 : 0)));
        var textX = (isLeftPath ? -1 : 1) * (r0 + r1) / 2;
        if ((r0 + r1) / 2 * Math.abs($node.chartAngle[1] - $node.chartAngle[0]) < 15) {
            $node.$nameCtn.addStyle('visibility', 'hidden');
        }
        else {
            //     //todo:
            var nodeText = $node.data.name;
            var textColor = $node.textColor;
            //
            var words = nodeText.trim().split(/\s+/);
            var updateNodeSession = this.updateNodeSession;
            var tryText = function (nLine) {
                $node.$nameCtn.clearChild();
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
                    $node.$nameCtn.addChild(text(lineText, textX, y, 'vc-sunburst-node-name').attr('text-anchor', 'middle').addStyle('fill', textColor));
                    return y + 20;
                }, 5 - (nLine - 1) * 20 / 2);
                var box = $node.$nameCtn.getBBox();
                var out = box.width + 8 > r1 - r0 || box.height > (r0 + r1) / 2 * Math.abs($node.chartAngle[1] - $node.chartAngle[0]);
                if (nLine < words.length && out) {
                    tryText(nLine + 1);
                }
                else if (out) {
                    $node.$nameCtn.addStyle('visibility', 'hidden')
                }
                else {
                    $node.$nameCtn.removeStyle('visibility', 'hidden')

                }
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
        if ($node.$child && $node.$child.length > 0) {
            $node.$child.forEach(visit.bind(this));
        }
    }

    if (this.$root.$child && this.$root.$child.length > 0) {
        this.$root.$child.forEach(visit.bind(this));
    }
};

SunburstChart.prototype._updateSunburstPosition = function () {
    var ctnBox = this.$sunbirstCtn.getBBox();
    var rootBox = this.$root.getBBox();
    var x = this.$body.box.width / 2;
    var y = this.$body.box.height / 2;
    x -= (ctnBox.x + ctnBox.width / 2) - (rootBox.x + rootBox.width / 2);
    y -= (ctnBox.y + ctnBox.height / 2) - (rootBox.y + rootBox.height / 2);
    this.$sunbirstCtn.box.setPosition(x, y);
}



SunburstChart.prototype._updatePrintViewport = function () {
    var children = Array.prototype.slice.call(this.childNodes);
    var bound = children.reduce((ac, cr) => {
        var bbox = cr.getBBox();
        if (bbox.width === 0 || bbox.height === 0) return ac;
        var rect = getGlobalBBox(cr);
        if (!ac) return rect;
        return ac.merge(rect);
    }, null);
    if (bound) {
        this.attr('data-print-view-box', (Math.floor(bound.x) - 0.5) + ' ' + (Math.floor(bound.y) - 0.5) + ' ' + Math.ceil(bound.width + 1) + ' ' + Math.ceil(bound.height + 1));
    }
    else this.attr('data-print-view-box', null);
};

SunburstChart.prototype.updateBodyPosition = function () {
    BChart.prototype.updateBodyPosition.call(this);
    this._findBestFanRadius();
    this._updateNodePosition();
    this._updateSunburstPosition();
    this._updatePrintViewport();
};

SunburstChart.prototype._createRoot = function () {
    var rootWords = this.root.name.trim().split(/\s+/);
    var rectsPerLine = Math.ceil(Math.sqrt(rootWords.length) * Math.log10(7));
    var lines = rootWords.reduce(function (ac, cr) {
        if (ac.top.length === 0) {
            ac.result.push(ac.top);
        }
        ac.top.push(cr);
        if (ac.top.length >= rectsPerLine) ac.top = [];
        return ac;
    }, { result: [], top: [] }).result;

    this.$root = _('g.vc-title').addTo(this.$sunbirstCtn);
    this.$root.$circle = circle(0, 0, 1).addTo(this.$root);
    this.$root.$circle.addStyle('fill', this.root.fillColor.toString('hex8'));
    this.$root.$lines = lines.map(function (line, i, arr) {
        return text(line.join(' '), 0, -(arr.length * 15) / 2 + 12 + 15 * i).attr('text-anchor', 'middle').addTo(this.$root);
    }.bind(this));
    var rootBox = this.$root.getBBox();
    this.computedData.rootR = Math.sqrt(rootBox.width * rootBox.width + rootBox.height * rootBox.height) / 2 + 5
    this.$root.$circle.attr('r', this.computedData.rootR);
    this.$root.data = this.root;
    this.$root.level = 0;
    this.$root.span = 1;
    this.$root.chartAngle = [-Math.PI/2,-Math.PI/2 + Math.PI * 2];
};

SunburstChart.prototype._createChild = function (fromElt) {
    var sum = fromElt.data.value;
    if (!fromElt.data.child || !(fromElt.data.child.length > 0)) return;
    fromElt.$child = fromElt.data.child.map(function (childData) {
        var fillColor = childData.fillColor;
        var res = _({
            tag: 'g',
            class: 'sunburst-chart-node',
            props: {
                data: childData,
                level: fromElt.level + (fromElt.data.span || 1),
                span: childData.span || 1,
                textColor: Color.parse(fillColor).getContrastYIQ().toString('rgb')
            }
        });
        res.$title = _('<title>' + childData.name + ': ' + childData.value + '</title>').addTo(res);
        res.$shape = _({
            tag: 'shape',
            class: 'sunburst-chart-node-shape',
            style: {
                fill: fillColor
            }

        }).addTo(res);
        res.$nameCtn = _('g').addTo(res);
        return res.addTo(this.$sunbirstCtn);
    }.bind(this));

    fromElt.$child.reduce(function (offset, $childNode) {
        $childNode.chartAngle = [
            map(offset, 0, sum, fromElt.chartAngle[0], fromElt.chartAngle[1]),
            map(offset + $childNode.data.value, 0, sum, fromElt.chartAngle[0], fromElt.chartAngle[1])
        ];
        this._createChild($childNode);
        return offset += $childNode.data.value;
    }.bind(this), 0);
};

SunburstChart.prototype._createSunburst = function () {
    this.$sunbirstCtn.clearChild();
    this._createRoot();
    this._createChild(this.$root);

};

SunburstChart.prototype.createContent = function () {
    BChart.prototype.createContent.call(this);
    this._createSunburst();

};


SunburstChart.prototype.calDepth = function (node) {
    if (node.child && node.child.length > 0) {
        return (node.span || 1) + Math.max.apply(Math, node.child.map(this.calDepth.bind(this)));
    }
    else
        return (node.span || 1);

};


Vcore.creator.sunburstchart = SunburstChart;

export default SunburstChart;