import Vcore from "./VCore";
import {rect, text, isNumber} from "./helper";
import {translate} from "./template";

var _ = Vcore._;
var $ = Vcore.$;


function ColumnChart() {
    return _('basechart.column-chart', true);
};


ColumnChart.prototype._createColumn = function (value, i, color) {
    var res = _('g.column-chart-column');
    res.$rect = rect(-this.columnWidth / 2, 0, this.columnWidth, 10).addTo(res);
    res.$value = text(this.numberToString(value) + '', 0, 0).attr('text-anchor', 'middle').addTo(res);
    if (color) {
        res.$rect.addStyle('fill', color);
    }
    return res;
};

ColumnChart.prototype.processMinMax = function () {
    this.minValue = this.values.filter(isNumber).reduce(function (ac, cr) {
        return Math.min(ac, cr);
    }, 1000000000);

    this.maxValue = this.values.filter(isNumber).reduce(function (ac, cr) {
        return Math.max(ac, cr);
    }, -1000000000);
};

ColumnChart.prototype.initBackComp = function () {
    this.super();
    this.$keys = this.keys.map(function (key) {
        return text(key, 0, 20).attr('text-anchor', 'middle').addTo(this.$content);
    }.bind(this));

};


ColumnChart.prototype.updateBackComp = function () {
    this.oxLength = this.canvasWidth - this.oxyLeft - 50;

    this.oxSegmentLength = Math.max(this.columnWidth + this.columnMarginH * 2, this.oxLength / (this.keys.length));

    this.oxSegmentLength = this.$keys.reduce(function (maxLength, $key) {
        return Math.max(maxLength, $key.getBBox().width + this.columnMarginH * 2)
    }.bind(this), this.oxSegmentLength);

    this.oxContentLength = this.oxSegmentLength * this.keys.length - this.columnMarginH;
    this.$keys.forEach(function ($key, i) {
        $key.attr('x', (i + 0.5) * this.oxSegmentLength);
    }.bind(this));
    this.super();
};

ColumnChart.prototype.initComp = function () {
    this.$columes = this.values.map(function (value, i) {
        return this._createColumn(value, i, this.columnColors && this.columnColors[i]).addTo(this.$content);
    }.bind(this));

};

ColumnChart.prototype.updateComp = function () {
    this.$columes.forEach(function ($colume, i) {
        if (isNumber(this.values[i])) {
            $colume.removeStyle('display');
            var height = -this.mapOYValue(this.values[i]);
            // x: (i + 0.5) * this.oxSegmentLength - this.columnWidth / 2
            $colume.$rect.attr({
                height: height,
                y: -height
            });
            $colume.$value.attr('y', -height - 4);
            $colume.attr({
                transform: translate((i + 0.5) * this.oxSegmentLength, 0)
            });
        }
        else {
            $colume.addStyle('display', 'none');
        }

    }.bind(this));
};


ColumnChart.prototype.preInit = function () {
    this.super();
    this.columnMarginH = 5;
    this.columnWidth = 25;
};


Vcore.creator.columnchart = ColumnChart;

export default ColumnChart;