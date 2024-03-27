import VCore, {_, $} from "./VCore";
import BChart from "./BChart";
import OOP from "absol/src/HTML5/OOP";
import {isNaturalNumber} from "absol-acomp/js/utils";
import {generatorColorScheme} from "absol-acomp/js/colorpicker/SelectColorSchemeMenu";
import {generateBackgroundColors, map} from "./helper";
import Color from "absol/src/Color/Color";

/**
 * @extends BChart
 * @constructor
 */
function SimpleColumnChart() {
    BChart.apply(this, arguments);
    this.keys = [];
    this.values = [];
    this.texts = [];
    this.fillColors = [];
    this.$columns = [];
    this.$texts = [];
}

OOP.mixClass(SimpleColumnChart, BChart);

SimpleColumnChart.tag = 'SimpleColumnChart'.toLowerCase();


SimpleColumnChart.render = function () {
    return BChart.render.apply(this, arguments).addClass('vc-simple-column-chart');
};


SimpleColumnChart.prototype.computeNotes = function () {
    return this.keys.map((key, i) => {
        return {
            color: this.fillColors[i],
            text: key,
            type: 'rect',
            idx: i
        };
    });
};

SimpleColumnChart.prototype.normalizeData = function () {
    var colorScheme = this.colorScheme;
    var blockColors = isNaturalNumber(colorScheme) ? generatorColorScheme(colorScheme, this.values.length) : generateBackgroundColors(this.values.length);
    this.fillColors = this.fillColors || [];
    while (this.fillColors.length < this.values.length) {
        this.fillColors.push(blockColors[this.fillColors.length]);
    }
    this._maxValue = Math.max(...this.values);
    if (!this.texts || this.values.length !== this.texts.length) {
        // this.texts = this.values.map(value=> this.nu);
    }
};

SimpleColumnChart.prototype._createColumns = function () {
    this.$columns.forEach(e => e.remove());
    this.$texts.forEach(e => e.remove());
    this.$columns = this.values.map((value, i) => {
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
    this.$body.addChild(this.$columns);

    this.$texts = this.texts.map((key, i) => {
        var color = this.fillColors[i];
        color = (typeof color === "string") ? Color.parse(color) : color;
        color = color.getContrastYIQ();
        return _({
            tag: 'text',
            class: 'vc-value-text',
            attr: {
                x: 10, y: 10
            },
            style: {
                color: color + ''
            },
            child: {text: key}
        })
    });
    this.$body.addChild(this.$texts);
};


SimpleColumnChart.prototype._updateRowPosition = function () {
    var width = this.$body.box.width;
    var height = this.$body.box.height;
    if (height === 0) return;
    var colWidth = Math.min(150, width / this.$columns.length);
    var x0 = (width - colWidth * this.$columns.length) / 2;
    var maxValue =this._maxValue?this._maxValue: 1;

    this.$columns.forEach((colElt, i) => {
        var colHeight = map(this.values[i], 0, maxValue, 0, height);
        colElt.attr({
            width: colWidth,
            y: height - colHeight,
            height: colHeight,
            x: x0 + i * colWidth
        });
    });
    this.$texts.forEach((textElt, i) => {
        var colHeight = map(this.values[i], 0, maxValue, 0, height);
        var y = height - colHeight;
        if (colHeight > 20) {
            y += 14;
            textElt.removeStyle('fill');
        } else {
            y -= 5;
            textElt.addStyle('fill', 'black');
        }
        textElt.attr({
            y: y,
            x: x0 + (i + 0.5) * colWidth
        });
    });

};

SimpleColumnChart.prototype.createContent = function () {
    BChart.prototype.createContent.call(this);
    this._createColumns();
};


SimpleColumnChart.prototype.updateBodyPosition = function () {
    BChart.prototype.updateBodyPosition.call(this);
    this._updateRowPosition();
};


VCore.install(SimpleColumnChart);


export default SimpleColumnChart;