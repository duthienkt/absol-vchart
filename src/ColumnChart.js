import Vcore from "./VCore";
import {rect, text, isNumber} from "./helper";
import {translate} from "./template";
import AElementNS from "absol/src/HTML5/AElementNS";
import OOP from "absol/src/HTML5/OOP";
import VerticalChart from "./VerticalChart";

var _ = Vcore._;
var $ = Vcore.$;


/***
 *
 * @returns {VerticalChart}
 * @constructor
 */
function ColumnChart() {
    VerticalChart.call(this);
    this.values = [];
    this.$columnCtn = _('gcontainer.vc-column-ctn');
    this.$oxySpace.addChild(this.$columnCtn);
}

ColumnChart.property = Object.assign({}, VerticalChart.property);
ColumnChart.eventHandler = Object.assign({}, VerticalChart.eventHandler);
OOP.mixClass(ColumnChart, VerticalChart);

ColumnChart.tag = 'ColumnChart'.toLowerCase();

ColumnChart.render = function () {
    return VerticalChart.render().addClass('vc-column-chart');
};

ColumnChart.prototype.computeMinMax = function () {
    this.computedData.min = this.values.filter(isNumber).reduce(function (ac, cr) {
        return Math.min(ac, cr);
    }, 1000000000);
    this.computedData.max = this.values.filter(isNumber).reduce(function (ac, cr) {
        return Math.max(ac, cr);
    }, -1000000000);
    if (this.computedData.min > this.computedData.max) {
        this.computedData.min = 0;
        this.computedData.max = 10;
    }
};


ColumnChart.prototype.createContent = function () {
    VerticalChart.prototype.createContent.call(this);
    this._createColumns();
};


ColumnChart.prototype._createColumn = function (value, i, color) {
    var res = _('gcontainer.vc-column-chart-column');
    res.$rect = rect(-this.oxColWidth / 2, 0, this.oxColWidth, 10).addTo(res);
    res.$value = text(this.numberToString(value) + '', 0, 0).attr('text-anchor', 'middle').addTo(res);
    if (color) {
        res.$rect.addStyle('fill', color);
    }
    return res;
};

ColumnChart.prototype._createColumns = function (){
    this.$columes = this.values.map(function (value, i) {
        return this._createColumn(value, i, this.columnColors && this.columnColors[i]).addTo(this.$columnCtn);
    }.bind(this));
};




ColumnChart.prototype.updateBodyPosition = function () {
    VerticalChart.prototype.updateBodyPosition.call(this);
    this._updateColumnPosition();
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
//
//
// ColumnChart.prototype.preInit = function () {
//     this.super();
//     this.columnMarginH = 5;
//     this.columnWidth = 25;
// };


Vcore.creator.columnchart = ColumnChart;

export default ColumnChart;