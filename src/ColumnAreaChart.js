import VCore from "./VCore";
import {getSubNumberArray, isNumber} from "./helper";
import DualChart from "./DualChart";
import {translate} from "./template";
import OOP from "absol/src/HTML5/OOP";
import ColumnChart from "./ColumnChart";
import Core from "absol-svg/js/svg/Core";
import VerticalChart from "./VerticalChart";

var _ = VCore._;
var $ = VCore.$;


/***
 * @extends  ColumnChart
 * @constructor
 */
function ColumnAreaChart() {
    ColumnChart.call(this);
    this.$areaCtn = _('gcontainer.vc-area-ctn');
    this.$oxySpace.addChildBefore(this.$areaCtn, this.$columnCtn)
    this.areas = [];
}

OOP.mixClass(ColumnAreaChart, ColumnChart);
ColumnAreaChart.property = Object.assign({}, ColumnChart.property);
ColumnAreaChart.eventHandler = Object.assign({}, ColumnChart.eventHandler);

ColumnAreaChart.tag = 'ColumnAreaChart'.toLowerCase();
ColumnAreaChart.render = function () {
    return ColumnChart.render().addClass('vc-column-area-chart');
};

ColumnAreaChart.prototype.dataKeys = ColumnChart.prototype.dataKeys.concat(['areas']);

ColumnAreaChart.prototype.computeMinMax = function () {
  ColumnChart.prototype.computeMinMax.call(this);
    this.computedData.min = this.areas.reduce(function (minValue, area) {
        return area.values.filter(isNumber).reduce(function (minValue, value) {
            if (!isNumber(value)) return minValue;
            return Math.min(minValue, value);
        }, minValue);
    }, this.computedData.min);
    this.computedData.max = this.areas.reduce(function (maxValue, area) {
        return area.values.filter(isNumber).reduce(function (maxValue, value) {
            if (!isNumber(value)) return maxValue;
            return Math.max(maxValue, value);
        }, maxValue);
    }, this.computedData.max);
};


ColumnAreaChart.prototype.computeNotes = function () {
    return this.areas.map(function (area) {
        return {
            text: area.name,
            type: 'rect',
            color: area.color
        }
    });
};



ColumnAreaChart.prototype._createArea = DualChart.prototype._createArea;
ColumnAreaChart.prototype._createAreaNote = DualChart.prototype._createAreaNote;

ColumnAreaChart.prototype._createAreas = function (){
    this.$areaCtn.clearChild();
    this.$areas = this.areas.map(function (area, i) {
        return this._createArea(area, area.color).addTo(this.$areaCtn);
    }.bind(this));
};


ColumnAreaChart.prototype.createContent = function (){
    ColumnChart.prototype.createContent.call(this);
    this._createAreas();
}


ColumnAreaChart.prototype._updateAreaPosition = function (){

};

ColumnAreaChart.prototype.updateBodyPosition = function () {
    ColumnChart.prototype.updateBodyPosition.call(this);
    this._updateAreaPosition();
    this._updateAreaPosition();
};

ColumnAreaChart.prototype._updateAreaPosition  = function () {
    var oxSegmentLength = this.computedData.oxSegmentLength;
    this.$areas.map(function ($area, i) {
        var values = this.areas[i].values;
        var subAreas = getSubNumberArray(values);

        $area.begin();
        subAreas.forEach(function (subArea) {
            var start = subArea.start;
            var values = subArea.values;

            if (values.length > 1) {
                $area.moveTo(oxSegmentLength * (start + 0.5), -1);
                for (var xi = 0; xi < values.length; ++xi) {
                    $area.lineTo(oxSegmentLength * (start + xi + 0.5), -this.mapOYValue(values[xi]));
                }

                $area.lineTo(oxSegmentLength * (start + values.length - 1 + 0.5), -1);
                $area.closePath();
            }
            else {
                $area.moveTo(oxSegmentLength * (start + 0.25), -1);

                $area.lineTo(oxSegmentLength * (start + 0.25), -this.mapOYValue(values[0]));
                $area.lineTo(oxSegmentLength * (start + 0.75), -this.mapOYValue(values[0]));

                $area.lineTo(oxSegmentLength * (start + 0.75), -1);
                $area.closePath();
            }

        }.bind(this));
        $area.end();
    }.bind(this));
};

Core.install(ColumnAreaChart);

export default ColumnAreaChart;