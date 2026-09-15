import SvgCanvas from "absol-svg/js/svg/SvgCanvas";
import './style/base.css';
import VCore, {_, $} from "./VCore";
import {isRealNumber} from "absol-acomp/js/utils";
import Rectangle from "absol/src/Math/Rectangle";
import GContainer from "absol-svg/js/svg/GContainer";
import './style/stackedhorizontalbarchart.css'
import TextMeasure from "absol-acomp/js/TextMeasure";
import {ChartResizeController, ChartTitleController} from "./BChart";
import Turtle from "absol/src/Math/Turtle";
import {calBeautySegment, map, measureArial14TextWidth} from "./helper";
import {numberToString} from "absol/src/Math/int";
import {generatorColorScheme} from "absol-acomp/js/colorpicker/SelectColorSchemeMenu";
import Color from "absol/src/Color/Color";
import {KeyNoteGroup} from "./KeyNote";

/**
 * @extends SvgCanvas
 * @constructor
 */
function StackedHorizontalBarChart() {
    this.resizeCtrl = new ChartResizeController(this);
    this.titleCtrl = new ChartTitleController(this);

    this.computedData = {
        max: 0,
    };

    this.$title = $('text.vc-title', this);
    /**
     *
     * @type {GContainer}
     */
    this.$keysCtn = $('g.vc-stacked-horizontal-keys-ctn', this);
    /**
     *
     * @type {GContainer}
     */
    this.$body = $('.vc-body', this);
    this.$keys = [];
    this.$oxy = $('#oxy', this);
    this.$oxArrow = $('#ox-arrow', this);
    this.$grid = $('path.vc-grid', this);
    this.$rects = [];
    /**
     *
     * @type {KeyNoteGroup}
     */
    this.$keyNoteGroup = $(KeyNoteGroup.tag, this);

    /**
     * y axis keys
     * @name keys
     * @type {string[]}
     * @memberOf StackedHorizontalBarChart#
     */
    /**
     * series data
     * @name series
     * @type {Array<{name: string, values: number[]}>}
     * @memberOf StackedHorizontalBarChart#
     */
}

StackedHorizontalBarChart.tag = 'StackedHorizontalBarChart'.toLowerCase();

StackedHorizontalBarChart.prototype.rowSpacing = 40;
StackedHorizontalBarChart.prototype.paddingContent = 10;

StackedHorizontalBarChart.prototype.numberToString = function () {
    return numberToString.apply(this, arguments);
};


StackedHorizontalBarChart.render = function () {
    return _({
        tag: SvgCanvas,
        class: ['vc-chart', 'vc-stacked-horizontal-bar-chart', 'as-height-auto'],
        child: [
            {
                tag: 'text',
                class: 'vc-title',
                attr: {
                    y: 15
                },
                child: {text: ''}
            },
            {tag: KeyNoteGroup},
            {
                tag: GContainer,
                class: 'vc-body',
                child: [
                    {
                        tag: GContainer,
                        class: 'vc-stacked-horizontal-keys-ctn',
                    },
                    {
                        tag: 'path',
                        class: 'vc-grid'
                    },
                    {
                        tag: 'gcontainer',
                        class: 'vchart-axis',
                        child: [
                            {
                                tag: 'path',
                                id: 'oxy',
                                attr: {
                                    d: 'm0 -1v1 h1',
                                    fill: 'none'
                                }
                            },
                            {
                                tag: 'path',
                                id: "ox-arrow",
                                attr: {
                                    d: 'm0 -5v10l6.8 -5z'
                                }
                            },
                        ]
                    },
                ]
            }
        ]
    });
};

StackedHorizontalBarChart.prototype.computeData = function () {
    var cpData = this.computedData;
    cpData.max = this.keys.reduce((ac, cr, i) => {
        var s = this.series.reduce((ac2, cr2) => {
            var value = cr2.values[i];
            if (!isRealNumber(value)) value = 0;
            return ac2 + value;
        }, 0);
        return Math.max(ac, s);
    }, 0);
    if (cpData.max === 0) {
        cpData.max = 1; // prevent division by zero
    }
    cpData.min = 0;
    cpData.requiredWidth = 0;
    cpData.requiredWidth = Math.max(cpData.requiredWidth, cpData.titleWidth);
    cpData.colors = generatorColorScheme(1, this.series.length || 10)
    this.addStyle('--vc-required-width', cpData.requiredWidth + 'px');
};

StackedHorizontalBarChart.prototype.updateKeys = function () {
    var keys = this.keys || [];
    this.$keysCtn.clearChild();
    this.$keys = this.keys.map(key => {
        return _({
            tag: 'text',
            child: {
                text: key
            }
        });
    });
    this.$keysCtn.addChild(this.$keys);
};

StackedHorizontalBarChart.prototype.updateNotes = function () {
    this.$keyNoteGroup.items = this.series.map((it, i) => {
        return {
            noteType: 'rect',
            text: it.name,
            color: it.color || this.computedData.colors[i],
        };
    })
}


StackedHorizontalBarChart.prototype.updateKeysPosition = function () {
    this.$keys.forEach((elt, i) => {
        elt.attr('y', this.rowSpacing * (0.5 + i) + 7);
    });
    this.$keysCtn.box.width = this.$keysCtn.getBBox().width;
    this.$keysCtn.box.x = -this.$keysCtn.box.width - 10;
};

StackedHorizontalBarChart.prototype.updateAxisPosition = function () {
    var turtle = new Turtle();
    turtle.moveTo(this.$body.box.width + 10, 0)
        .hLineBy(-this.$body.box.width - 10)
        .vLineBy(this.$body.box.height);
    this.$oxy.attr('d', turtle.getPath());
    this.$oxArrow.attr('d', 'M' + (this.$body.box.width + 10) + ' 0 m0 -5v10l6.8 -5z');

    turtle = new Turtle();
    var i;
    var n = this.keys.length;
    var spacing = this.rowSpacing;
    var width = this.$body.box.width;
    var height = this.$body.box.height;
    for (i = 1; i <= n; ++i) {
        turtle.moveTo(0, i * spacing)
            .hLineBy(width)
    }

    var valueWidth = 30;
    var dx = Math.max(100, Math.floor(20 + measureArial14TextWidth(this.numberToString(this.computedData.max))));
    var sm = calBeautySegment(Math.floor((this.$body.box.width - valueWidth - 10 - dx / 2) / dx),
        this.computedData.min, this.computedData.max + 1);
    this.computedData.sm = sm;
    dx = Math.floor((width - valueWidth - 10 - dx / 2) / sm.segmentCount);
    n = sm.segmentCount;
    for (i = 1; i <= n; ++i) {
        turtle.moveTo(i * dx, 0)
            .vLineBy(height);
    }
    this.$grid.attr('d', turtle.getPath());
};

StackedHorizontalBarChart.prototype.makeRect = function (value, color, borderColor) {
    color = Color.parse(color + '');
    var hsla;
    if (!borderColor) {
        hsla = color.toHSLA();
        hsla[2] -= 0.2;
        hsla[1] -= 0.2;
        if (hsla[1] < 0) hsla[1] = 0;
        if (hsla[2] < 0) hsla[2] = 0;
        borderColor = Color.fromHSL(hsla[0], hsla[1], hsla[2]);
    }
    var height = Math.min(20, this.rowSpacing - 10);
    var valueText = this.numberToString(value);
    var rectElt = _({
        tag: GContainer,
        child: [
            {
                tag: 'rect',
                attr: {
                    x: 0,
                    y: -height / 2,
                    height: height,
                    width: 40
                },
                style: {
                    strokeWidth: 1,
                    strokeColor: 'black',
                    fill: color,
                    stroke: borderColor.toString('hex6')
                }
            },
            {
                tag: 'text',
                style: {
                    fill: color.getContrastYIQ()
                },
                attr: {
                    x: 0,
                    y: 0,
                    "text-anchor": "middle",
                    'dominant-baseline': "middle"
                },
                child: {
                    text: valueText
                }
            }
        ]

    });
    rectElt.$rect = $('rect', rectElt);
    rectElt.$value = $('text', rectElt);
    rectElt.textWidth = TextMeasure.measureWidth(valueText, TextMeasure.FONT_ARIAL, 14);
    return rectElt;
};

StackedHorizontalBarChart.prototype.updateRectangles = function () {
    this.$rects.forEach(elt => elt.remove());
    this.$rects = [];
    var keys = this.keys || [];
    var series = this.series || [];
    var rectElt;
    var i, j
    for (i = 0; i < keys.length; ++i) {
        for (j = 0; j < series.length; ++j) {
            rectElt = this.makeRect(series[j].values[i], series[i].color || this.computedData.colors[j]);
            this.$rects.push(rectElt);
        }
    }
    this.$body.addChild(this.$rects);
};

StackedHorizontalBarChart.prototype.updateRectanglePositions = function () {
    var sm = this.computedData.sm;
    var keys = this.keys || [];
    var series = this.series || [];
    var rectElt;
    var i, j, k;
    k = 0;
    var value, rectWidth;
    var width = this.$body.box.width;
    var s;
    for (i = 0; i < keys.length; ++i) {
        s = 0;
        for (j = 0; j < series.length; ++j) {
            value = series[j].values[i];
            rectWidth = map(value, sm.minValue, sm.maxValue, 0, width);
            rectElt = this.$rects[k];
            k++;

            if (!rectElt) continue;
            rectElt.$rect.attr('width', rectWidth);
            rectElt.$value.attr('x', rectWidth / 2);
            rectElt.box.x = map(s, sm.minValue, sm.maxValue, 0, width);
            rectElt.box.y = this.rowSpacing * (0.5 + i);
            if (rectElt.textWidth > rectWidth - 4) {
                rectElt.$value.addStyle('display', 'none');
                rectElt.attr('title', this.numberToString(value));
            } else {
                rectElt.$value.removeStyle('display');
            }
            s += value;
        }
    }
};

StackedHorizontalBarChart.prototype.updateContent = function () {
    this.pendingUpdate = false;
    this.computeData();
    this.updateKeys();
    this.updateNotes();
    this.updateRectangles();

};


StackedHorizontalBarChart.prototype.requestUpdate = function () {
    if (this.pendingUpdate) return;
    this.pendingUpdate = true;
    setTimeout(() => {
        this.updateContent();
        this.updateContentPosition();
    }, 1);
};

StackedHorizontalBarChart.prototype.updateContentPosition = function () {
    this.$title.attr('y', this.paddingContent + 17 + '');
    this.$title.attr('x', this.box.width / 2 + '');
    this.updateKeysPosition()

    this.$body.box.x = this.$keysCtn.box.width + this.paddingContent + 10;
    this.$body.box.width = this.box.width - this.paddingContent - this.$body.box.x - 20;//10 for arrow
    this.$keyNoteGroup.box.y = 20 + 10 + this.paddingContent;
    this.$keyNoteGroup.box.width = this.$body.box.width - 20;
    this.$keyNoteGroup.updateSize();
    this.$body.box.y = this.$keyNoteGroup.box.y + this.$keyNoteGroup.box.height + 10;
    this.$body.box.height = this.rowSpacing * this.keys.length;
    this.updateAxisPosition();
    this.updateRectanglePositions();
    this.box.height = this.$body.box.height + this.$body.box.y + this.paddingContent;
    this.addStyle('--vc-require-height', this.box.height);
};


StackedHorizontalBarChart.prototype.updateSize = function () {
    SvgCanvas.prototype.updateSize.call(this);
    this.updateContentPosition();
};

StackedHorizontalBarChart.property = {};

StackedHorizontalBarChart.property.title = {
    set: function (value) {
        this.$title.firstChild.data = (value || '') + '';
        this.computedData.titleWidth = TextMeasure.measureWidth(this.$title.firstChild.data, TextMeasure.FONT_ARIAL, 14);
    },
    get: function () {
        return this.$title.firstChild.data;
    }
};

StackedHorizontalBarChart.property.series = {
    set: function (value) {
        this._series = value || [];
        this.requestUpdate();
    },
    get: function () {
        return this._series || [];
    }
};

StackedHorizontalBarChart.property.keys = {
    set: function (value) {
        this._keys = value || [];
        this.requestUpdate();
    },
    get: function () {
        return this._keys || [];
    }
};


VCore.install(StackedHorizontalBarChart);


export default StackedHorizontalBarChart;