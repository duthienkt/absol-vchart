import VCore, {_, $} from "./VCore";
import BChart from "./BChart";
import OOP from "absol/src/HTML5/OOP";
import {isNaturalNumber} from "absol-acomp/js/utils";
import {generatorColorScheme} from "absol-acomp/js/colorpicker/SelectColorSchemeMenu";
import {generateBackgroundColors, line, map} from "./helper";
import Turtle from "absol-svg/js/controller/Turtle";
import {translate} from "./template";
import {closeTooltip, showTooltip} from "./ToolTip";

/**
 * @extends BChart
 * @constructor
 */
function SimpleLineChart() {
    BChart.apply(this, arguments);
    this.keys = [];
    this.values = [];
    this.texts = [];
    this.fillColors = [];
    this.$points = [];
    this.$texts = [];
    this.$bgRects = [];
}

OOP.mixClass(SimpleLineChart, BChart);

SimpleLineChart.tag = 'SimpleLineChart'.toLowerCase();


SimpleLineChart.render = function () {
    return BChart.render.apply(this, arguments).addClass('vc-simple-column-chart');
};


SimpleLineChart.prototype.computeNotes = function () {
    return this.keys.map( (key, i)=> {
        return {
            color: this.fillColors[i]|| 'black',
            text: key,
            type: 'point',
            idx: i
        };
    });
};
SimpleLineChart.prototype.normalizeData = function () {
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

SimpleLineChart.prototype._createPoints = function () {
    this.$bgRects.forEach(elt => elt.remove());
    this.$bgRects = this.values.map((u, i) => {
        return _({
            tag: 'rect',
            class: ['vc-simple-background'],
            style: {
                fill: i % 2 ? 'rgba(132, 132, 132, 0.07)' : 'rgba(132, 132, 132, 0.2)'
            },
            on: {
                mouseenter: event => {
                    this.eventHandler.mouseEnterNote(i, event)
                },
                mouseleave: event => {
                    this.eventHandler.mouseLeaveNote(i, event)
                },
            }
        });
    });
    this.$body.addChild(this.$bgRects);
    this.$ox = this.$ox || _({
        tag: 'path',
        class: ['vc-simple-ox', 'vchart-axis']
    });
    this.$oxArrow = this.$oxArrow || _({
        tag: 'path',
        class: ['vchart-axis'],
        attr: {
            d: 'm0 -5v10l6.8 -5z'
        }
    });
    this.$body.addChild(this.$ox);
    this.$body.addChild(this.$oxArrow);

    this.$points.forEach(e => e.remove());
    this.$texts.forEach(e => e.remove());
    this.$points = this.values.map((value, i) => {
        return _({
            tag: 'circle',
            attr: {
                cx: 0, cy: 0, r: 8
            },
            style: {
                stroke: 'white',
                strokeWidth: 2,
                fill: this.fillColors[i],
                pointerEvents: 'none'
            }
        });
    });
    this.$line = _({
        tag: 'path',
        style: {
            strokeWidth: 2, stroke: 'rgb(100, 100, 150)',
            fill: 'none',
            pointerEvents: 'none'
        }
    })
    this.$body.addChild(this.$line);
    this.$body.addChild(this.$points);

};


SimpleLineChart.prototype._updatePointPosition = function () {
    var width = this.$body.box.width;
    var height = this.$body.box.height;
    if (height === 0) return;
    var aHeight = height - 10;
    var aWidth = width - 25;

    var colWidth = aWidth / this.$points.length;
    var x0 = 10;
    var maxValue = this._maxValue ? this._maxValue : 1;
    this.$ox.attr('d', new Turtle().moveTo(0, height).hLineBy(width).getPath());
    this.$oxArrow.attr('transform', translate(width - 3, height));


    this.$bgRects.forEach((elt, i) => {
        elt.attr({
            width: colWidth,
            height: height,
            x: x0 + i * colWidth,
            y: 0
        });
    });


    var linePath = this.values.reduce((ac, value, i) => {
        var colHeight = map(this.values[i], 0, maxValue, 0, aHeight);
        if (i) {
            ac.lineTo(x0 + (i + 0.5) * colWidth, height - colHeight)
        } else {
            ac.moveTo(x0 + (i + 0.5) * colWidth, height - colHeight)
        }
        return ac;
    }, new Turtle()).getPath();
    this.$line.attr('d', linePath);
    this.$points.forEach((colElt, i) => {
        var colHeight = map(this.values[i], 0, maxValue, 0, aHeight);
        colElt.attr({
            cy: height - colHeight,
            cx: x0 + (i + 0.5) * colWidth
        });
    });
    // this.$texts.forEach((textElt, i) => {
    //     var colHeight = map(this.values[i], 0, maxValue, 0, height);
    //     var y = height - colHeight;
    //     if (colHeight > 20) {
    //         y += 14;
    //         textElt.removeStyle('fill');
    //     } else {
    //         y -= 5;
    //         textElt.addStyle('fill', 'black');
    //     }
    //     textElt.attr({
    //         y: y,
    //         x: x0 + (i + 0.5) * colWidth
    //     });
    // });

};

SimpleLineChart.prototype.createContent = function () {
    BChart.prototype.createContent.call(this);
    this._createPoints();
};


SimpleLineChart.prototype.updateBodyPosition = function () {
    BChart.prototype.updateBodyPosition.call(this);
    this._updatePointPosition();
};


SimpleLineChart.eventHandler = {};

SimpleLineChart.eventHandler.mouseEnterNote = function (idx, event) {
    var bound = this.$points[idx].getBoundingClientRect();
    this.tooltipToken = showTooltip(this.keys[idx]+': '+ this.texts[idx],bound.right, bound.top);
};

SimpleLineChart.eventHandler.mouseLeaveNote = function (idx, event) {
    var token = this.tooltipToken;
    if (!token) return;
    setTimeout(() => {
        closeTooltip(token);
    }, 1000);
};


VCore.install(SimpleLineChart);


export default SimpleLineChart;