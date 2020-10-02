import BChart from "./BChart";
import Vcore from "./VCore";
import OOP from "absol/src/HTML5/OOP";
import {calBeautySegment} from "./helper";
import Axis from "./Axis";

var _ = Vcore._;
var $ = Vcore.$;

/**
 * @extends BChart
 * @constructor
 */
function VerticalChart() {
    BChart.call(this);
    this.oxColMargin = 10;
    this.oxColWidth = 17;
    this.computedData.min = 0;
    this.computedData.max = 10;
    this.computedData.oyUpdated = false;
    this.computedData.oy = {};
    this.computedData.numberToFixed = 0;
    this.integerOnly = false;
    this.zeroOY = false;
    /**
     *
     * @type {string[]}
     */
    this.keys = [];
    this.$oxLabelCtn = _('gcontainer.vc-ox-label-ctn');
    this.$oyValueCtn = _('gcontainer.vc-oy-value-ctn');
    this.$axisCtn = _('gcontainer.vc-axis-ctn');
    this.$whiteMask = _({
        tag: 'path',
        class: 'vc-white-mask',
        attr: {
            fill: 'white',
            stroke: 'white',
            'fill-rule': 'evenodd',
            d: 'M0,0  0,2000 2000,2000 2000,0zM100,0  0,200 200,200 200,0z'
        }
    });


    /**
     *
     * @type {Axis}
     */
    this.$axis = _('axis');
    this.$oxySpace = _('gcontainer.vc-oxy-space');

    /***
     *
     * @type {HSC}
     */
    this.$hscrollbar = _('hscrollbar').on('scroll', this.eventHandler.scrollOxySpace);
    this.$hscrollbar.height = 12;
    this.$oxySpace.addChild(this.$oxLabelCtn);
    this.$axisCtn.addChild(this.$oxySpace);
    this.$axisCtn.addChild(this.$whiteMask);
    this.$axisCtn.addChild(this.$axis);
    this.$axisCtn.addChild(this.$hscrollbar);

    this.$oxLabels = [];
    this.$oyValues = [];
    this.$body.addChild(this.$axisCtn);
    this.$body.addChild(this.$oyValueCtn);
}

OOP.mixClass(VerticalChart, BChart);

VerticalChart.property = Object.assign({}, BChart.property);
VerticalChart.eventHandler = Object.assign({}, BChart.eventHandler);

VerticalChart.tag = 'VerticalChart'.toLowerCase();

VerticalChart.render = function () {
    return BChart.render();
};

VerticalChart.prototype.computeMinMax = function () {
    this.computedData.min = 0;
    this.computedData.max = 10;
};

/***
 *
 * @param {Number}number
 * @returns {string}
 */
VerticalChart.prototype.numberToText = function (number) {
    return number.toFixed(this.computedData.numberToFixed);
};


VerticalChart.prototype.computeData = function () {
    BChart.prototype.computeData.call(this);
    this.computeMinMax();
    if (this.zeroOY) this.computedData.min = Math.min(this.computedData.min, 0);
};

VerticalChart.prototype._computeOYSegment = function () {
    var oyLength = this.$body.box.height - 20 - 10;
    var segment = calBeautySegment(Math.floor(oyLength / 50), this.computedData.min, this.computedData.max, this.integerOnly);
    if (segment.step !== this.computedData.oy.step || segment.segmentCount !== this.computedData.oy.segmentCount
        || segment.maxValue !== this.computedData.oy.maxValue || segment.minValue !== this.computedData.oy.minValue) {
        this.computedData.oy = segment;
        this.computedData.oyUpdated = false;
        this.computedData.numberToFixed = 0;
        if (segment.step < 1) this.computedData.numberToFixed++;
        if (segment.step < 0.1) this.computedData.numberToFixed++;
        if (segment.step < 0.01) this.computedData.numberToFixed++;
        if (segment.step < 0.001) this.computedData.numberToFixed++;
        if (segment.step < 0.0001) this.computedData.numberToFixed++;
    }
    this.computedData.oyLength = oyLength;
    this.computedData.oySegmentLength = oyLength / segment.segmentCount;
};

VerticalChart.prototype._createOxLabel = function () {
    var thisC = this;
    this.$oxLabelCtn.clearChild();
    this.$oxLabels = this.keys.map(function (key) {
        var labelElt = _({
            tag: 'text',
            class: 'vc-ox-label',
            attr: {
                y: 15
            },
            child: {
                text: key
            }
        });
        thisC.$oxLabelCtn.addChild(labelElt);
        return labelElt;
    });
    this.computedData.oxLabelMaxWidth = this.$oxLabels.reduce(function (ac, elt) {
        return Math.max(ac, elt.getBBox().width);
    }, 0);
};

VerticalChart.prototype._createOyValue = function () {
    this.computedData.oyUpdated = true;
    var segment = this.computedData.oy;
    var textElt;
    while (this.$oyValues.length < segment.segmentCount + 1) {
        textElt = _({
            tag: 'text',
            class: 'vc-oy-value',
            child: { text: '0' }
        });
        this.$oyValues.push(textElt);
        this.$oyValueCtn.addChild(textElt);
    }

    while (this.$oyValues.length > segment.segmentCount + 1) {
        textElt = this.$oyValues.pop();
        textElt.remove();
    }

    for (var i = 0; i < this.$oyValues.length; ++i) {
        this.$oyValues[i].firstChild.data = this.numberToText(segment.minValue + i * segment.step);
    }
};

VerticalChart.prototype.createContent = function () {
    BChart.prototype.createContent.call(this);
    this._createOxLabel();
};

VerticalChart.prototype._updateLabelPosition = function () {
    this.$oxLabelCtn.box.y = this.$body.box.height = 15;
};


VerticalChart.prototype._updateOYValuePosition = function () {
    this._computeOYSegment();
    if (!this.computedData.oyUpdated) {
        this._createOyValue();
    }

    var y = this.$body.box.height - 20 + 7;
    var valueElt;
    for (var i = 0; i < this.$oyValues.length; ++i) {
        valueElt = this.$oyValues[i];
        valueElt.attr({
            y: y,
            x: -10
        });
        y -= this.computedData.oySegmentLength;
    }
    var box = this.$oyValueCtn.getBBox();
    this.$oyValueCtn.box.x = box.width + 10;
};

VerticalChart.prototype.updateAxis = function () {
    this.$axisCtn.box.setPosition(this.$oyValueCtn.box.x, 0);
    this.$axisCtn.box.setSize(this.$body.box.width - this.$oyValueCtn.box.x, this.$body.box.height - 20);
    this.$whiteMask.attr('d', 'M-300 -300 H' + (this.$axisCtn.box.width + 100) + ' V' + (this.$axisCtn.box.height + 600) + 'H -300z'
        + 'M0 0 H ' + (this.$axisCtn.box.width - 5) + ' V ' + (this.$axisCtn.box.height + 300) + ' H 0z');
    this.$axis.box.setPosition(0, this.$axisCtn.box.height);
    this.$axis.resize(this.$axisCtn.box.width - 5, this.$axisCtn.box.height - 5);
    this.$oxySpace.box.setPosition(0, this.$axisCtn.box.height);
    this.computedData.oxLength = this.$axisCtn.box.width - 15;
    this.computedData.oyLength = this.$axisCtn.box.height - 15;
    this.$hscrollbar.box.y = this.$axisCtn.box.height - this.$hscrollbar.height;
};

VerticalChart.prototype._updateOxLabelPosition = function () {
    this.computedData.oxSegmentLength = this.computedData.oxLength / this.$oxLabels.length;
    this.computedData.oxSegmentLength = Math.max(this.oxColMargin + Math.max(this.oxColWidth, this.computedData.oxLabelMaxWidth), this.computedData.oxSegmentLength);
    var dx = this.computedData.oxSegmentLength;
    var x = this.computedData.oxSegmentLength / 2;
    for (var i = 0; i < this.$oxLabels.length; ++i) {
        this.$oxLabels[i].attr('x', x);
        x += dx;
    }
    this.computedData.oxScrollWidth = dx * this.$oxLabels.length - 1;
    this.computedData.oxOverFlow = this.computedData.oxScrollWidth > this.computedData.oxLength;
    this.$hscrollbar.outterWidth = this.computedData.oxLength;
    this.$hscrollbar.innerWidth = this.computedData.oxScrollWidth;
    this.$hscrollbar.width = this.computedData.oxLength;
    this.$hscrollbar.scrollLeft = Math.max(0, Math.min(this.$hscrollbar.scrollLeft, this.computedData.oxScrollWidth - this.computedData.oxLength));
    this.$oxySpace.box.x = -this.$hscrollbar.scrollLeft;
};


VerticalChart.prototype.updateBodyPosition = function () {
    BChart.prototype.updateBodyPosition.call(this);
    this._updateOYValuePosition();
    this.updateAxis();
    this._updateOxLabelPosition();
};


VerticalChart.eventHandler.scrollOxySpace = function (){
    this.$oxySpace.box.x = -this.$hscrollbar.scrollLeft;
};

Vcore.install(VerticalChart);

export default VerticalChart;