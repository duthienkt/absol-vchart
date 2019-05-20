import Vcore from "./VCore";
import { isNumber } from "./helper";
import DualChart from "./DualChart";
import { translate } from "./template";

var _ = Vcore._;
var $ = Vcore.$;

function ColumnAreaChart() {
    var res = _('columnchart.colunm-area-chart', true);

    return res;
};


ColumnAreaChart.prototype.processMinMax = function () {
    this.super();
    this.minValue = this.areas.reduce(function (minValue, area) {
        return area.values.filter(isNumber).reduce(function (minValue, value) {
            if (!isNumber(value)) return minValue;
            return Math.min(minValue, value);
        }, minValue);
    }, this.minValue);

    this.maxValue = this.areas.reduce(function (maxValue, area) {
        return area.values.filter(isNumber).reduce(function (maxValue, value) {
            if (!isNumber(value)) return maxValue;
            return Math.max(maxValue, value);
        }, maxValue);
    }, this.maxValue);

};

ColumnAreaChart.prototype._createArea = DualChart.prototype._createArea;
ColumnAreaChart.prototype._createAreaNote = DualChart.prototype._createAreaNote;

ColumnAreaChart.prototype.initBackComp = function () {
    this.super();
    this.colors = this.areas.map(function (items, i, arr) {
        if (items.color) return items.color;
        return i < this.lines.length ? this.colorTable[Math.floor(this.colorTable.length * i / arr.length)] :
            this.colorTable[Math.floor(this.colorTable.length * i / arr.length)].replace(/#/, '#80');
    }.bind(this));

    this.$arealNotes = this.areas.map(function (area, i) {
        return this._createAreaNote(area, this.colors[i]).addTo(this);
    }.bind(this));
    //todo: user color
    this.$columnNote = this._createAreaNote({ name: this.colName }, 'rgb(123, 192, 247)').addTo(this).addTo(this);
};


ColumnAreaChart.prototype.updateBackComp = function () {
    this.oxyBottom = this.canvasHeight - 3;
    var noteWidth = [this.$columnNote].concat(this.$arealNotes).reduce(function (width, cr) {
        return 40 + width + cr.getBBox().width;
    }.bind(this), -40);

    [this.$columnNote].concat(this.$arealNotes).reduce(function (pos, cr, arr) {
        cr.attr('transform', translate(pos.x, pos.y));
        pos.x += cr.getBBox().width + 16;
        return pos;
    }.bind(this), { x: this.canvasWidth / 2 - noteWidth / 2, y: this.oxyBottom });

    this.oxyBottom -= 50;
    //todo:    
    this.super();
}

ColumnAreaChart.prototype.initComp = function () {
    this.$areas = this.areas.map(function (line, i) {
        return this._createArea(line, this.colors[i]).addTo(this.$content);
    }.bind(this));
    this.super();
};
ColumnAreaChart.prototype.updateComp = function () {
    this.super();
    this.$areas.map(function ($area, i) {
        var values = this.areas[i].values;
        $area.begin();

        $area
            .moveTo(this.oxSegmentLength * (values.length - (this.keys.length == 1 ? 0.25 : 0.5)), -1)
            .lineTo(this.oxSegmentLength * (this.keys.length == 1 ? 0.25 : 0.5), -1);
        if (this.keys.length == 1) {
            $area.lineTo(this.oxSegmentLength * 0.25, isNumber(values[0]) ? this.mapOYValue(values[0]) : 0);
        }
        for (var i = 0; i < values.length; ++i) {
            $area.lineTo(this.oxSegmentLength * (i + 0.5), isNumber(values[i]) ? this.mapOYValue(values[i]) : 0);
        }

        if (this.keys.length == 1) {
            $area.lineTo(this.oxSegmentLength * 0.75, isNumber(values[0]) ? this.mapOYValue(values[0]) : 0);
        }
        $area.closePath().end();
    }.bind(this));
};


ColumnAreaChart.prototype.preInit = function () {
    this.super();
    this.areas = [];
};




ColumnAreaChart.eventHandler = {};

Vcore.creator.columnareachart = ColumnAreaChart;

export default ColumnAreaChart;