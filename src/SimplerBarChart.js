import VCore, {_, $} from "./VCore";
import BChart from "./BChart";
import OOP from "absol/src/HTML5/OOP";
import {isNaturalNumber} from "absol-acomp/js/utils";
import {generatorColorScheme} from "absol-acomp/js/colorpicker/SelectColorSchemeMenu";
import {generateBackgroundColors, map} from "./helper";
import Color from "absol/src/Color/Color";
import SimpleColumnChart from "./SimpleColumnChart";

/**
 * @extends BChart
 * @constructor
 */
function SimpleBarChart() {
    BChart.apply(this, arguments);
    this.keys = [];
    this.values = [];
    this.texts = [];
    this.fillColors = [];
    this.$rows = [];
    this.$texts = [];
}

OOP.mixClass(SimpleBarChart, BChart);

SimpleBarChart.tag = 'SimpleBarChart'.toLowerCase();


SimpleBarChart.render = function () {
    return BChart.render.apply(this, arguments).addClass('vc-simple-bar-chart');
};


SimpleBarChart.prototype.computeNotes = SimpleColumnChart.prototype.computeNotes;
SimpleBarChart.prototype.normalizeData = SimpleColumnChart.prototype.normalizeData;


SimpleBarChart.prototype._createRows = function () {
    this.$rows.forEach(e => e.remove());
    this.$texts.forEach(e => e.remove());
    this.$rows = this.values.map((value, i) => {
        return _({
            tag: 'rect',
            attr: {
                x: 0, y: 0
            },
            style: {
                fill: this.fillColors[i]
            }
        });
    });
    this.$body.addChild(this.$rows);

    this.$texts = this.texts.map((key, i) => {
        var color = this.fillColors[i];
        color = (typeof color === "string") ? Color.parse(color) : color;
        color = color.getContrastYIQ().toString('hex6');
        var res = _({
            tag: 'text',
            class: 'vc-value-text',
            attr: {
                x: 10, y: 10
            },
            style: {
                color: color
            },
            child: {text: key}
        });
        return res;
    });
    this.$body.addChild(this.$texts);
};


SimpleBarChart.prototype._updateRowPosition = function () {
    var width = this.$body.box.width;
    var height = this.$body.box.height;
    if (width === 0) return;
    var rowHeight = Math.min(150, height / this.$rows.length);
    var y0 = (height - rowHeight * this.$rows.length) / 2;
    var maxValue = this._maxValue ? this._maxValue : 1;


    this.$rows.forEach((colElt, i) => {
        var rowWidth = map(this.values[i], 0, maxValue, 0, width);
        colElt.attr({
            width: rowWidth,
            x: 0,
            height: rowHeight,
            y: y0 + i * rowHeight
        });
    });
    this.$texts.forEach((textElt, i) => {
        var rowWidth = map(this.values[i], 0, maxValue, 0, width);
        var box = textElt.getBBox();
        var y = y0 + (i + 0.5) * rowHeight + box.height / 2;
        var x = rowWidth;
        if (rowWidth > box.width + 10) {
            textElt.removeStyle('fill');
            x -= 5;
            textElt.addStyle('text-anchor', 'end');
        } else {
            x += 5;
            textElt.addStyle('text-anchor', 'start');
            textElt.addStyle('fill', 'black');
        }
        textElt.attr({
            x: x,
            y: y
        });
    });

};

SimpleBarChart.prototype.createContent = function () {
    BChart.prototype.createContent.call(this);
    this._createRows();
};


SimpleBarChart.prototype.updateBodyPosition = function () {
    BChart.prototype.updateBodyPosition.call(this);
    this._updateRowPosition();
};


VCore.install(SimpleBarChart);


export default SimpleBarChart;