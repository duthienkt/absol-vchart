import VCore, {_, $} from "./VCore";
import BChart, {ChartResizeController, ChartTitleController} from "./BChart";
import OOP, {mixClass} from "absol/src/HTML5/OOP";
import {isNaturalNumber, isRealNumber} from "absol-acomp/js/utils";
import {DEFAULT_CHART_COLOR_SCHEMES} from "absol-acomp/js/colorpicker/SelectColorSchemeMenu";
import SvgCanvas from "absol-svg/js/svg/SvgCanvas";
import {KeyNoteGroup} from "./KeyNote";
import AElement from "absol/src/HTML5/AElement";
import Turtle from "absol/src/Math/Turtle";
import {numberToString} from "absol/src/Math/int";
import {calBeautySegment, map, measureArial14TextWidth} from "./helper";

/**
 * @extends SvgCanvas
 * @constructor
 */
function HorizontalRangeChart() {
    this.resizeCtrl = new ChartResizeController(this);
    this.titleCtrl = new ChartTitleController(this);
    this.$attachhook.once('attached', this.updateContent.bind(this));
    /**
     *
     * @type {KeyNoteGroup}
     */
    this.$keyNoteGroup = $(KeyNoteGroup.tag, this);
    this.$title = $('.vc-title', this);
    this.$body = $('.vc-body', this);
    this.$axis = $('.vchart-axis', this);
    this.$oxy = $('#oxy', this);
    this.$oxArrow = $('#ox-arrow', this);
    this.$oyLabelCtn = $('.vc-oy-label-ctn', this);
    this.$oxLabelCtn = $('.vc-ox-label-ctn', this);
    this.$rangeCtn = $('.vc-range-ctn', this);
    this.$grid = $('.vc-grid', this);
    this.$valueName = $('.vc-value-name', this);

    setTimeout(() => {
        console.log(Object.assign({}, this))
    }, 100);

    /**
     * @name ranges
     * @type {[]}
     * @memberof HorizontalRangeChart#
     */
    /**
     * @name maxText
     * @type {string}
     * @memberof HorizontalRangeChart#
     */
    /**
     * @name valueName
     * @type {string}
     * @memberof HorizontalRangeChart#
     */
    /**
     * @name minText
     * @type {string}
     * @memberof HorizontalRangeChart#
     */
    /**
     * @name midText
     * @type {string}
     * @memberof HorizontalRangeChart#
     */

    /**
     * @name normalText
     * @type {string}
     * @memberof HorizontalRangeChart#
     */

    /**
     * @name zeroOY
     * @type {boolean}
     * @memberof HorizontalRangeChart
     */
}

mixClass(HorizontalRangeChart, BChart);

HorizontalRangeChart.tag = 'HorizontalRangeChart'.toLowerCase();


HorizontalRangeChart.render = function (data, o, dom) {
    var res = _({
        tag: SvgCanvas,
        class: ['vc-chart', 'vc-horizontal-range-chart', 'as-height-auto'],
        style: {},
        child: [
            {
                tag: 'text',
                class: 'vc-title',
                attr: {
                    'alignment-baseline': "hanging"
                },
                child: {text: ''}
            },
            {
                tag: KeyNoteGroup
            },

            {
                tag: 'gcontainer',
                class: 'vc-body',
                child: [
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
                    {
                        tag: 'gcontainer',
                        class: 'vc-oy-label-ctn'
                    },
                    {
                        tag: 'text',
                        class: 'vc-value-name',
                        child: {text: ''}
                    },
                    {
                        tag: 'gcontainer',
                        class: 'vc-ox-label-ctn'
                    },
                    {
                        tag: 'gcontainer',
                        class: 'vc-range-ctn'
                    },

                ]
            },

        ]
    });

    var colorScheme = o && o.props && o.props.colorScheme;
    if (isNaturalNumber(colorScheme)) {
        colorScheme = Math.max(0, Math.min(DEFAULT_CHART_COLOR_SCHEMES.length, colorScheme));
        res.attr('data-color-scheme', colorScheme + '');
    }
    return res;
};

HorizontalRangeChart.prototype.numberToString = function () {
    return numberToString.apply(this, arguments);
};


HorizontalRangeChart.prototype.addStyle = function (arg0, arg1) {
    if (arg0 === 'height') {
        if (arg1 === 'auto') {
            this.addClass('as-height-auto');
        }
    } else {
        this.removeClass('as-height-auto');
        AElement.prototype.addStyle.apply(this, arguments);
    }
    return this;
};


HorizontalRangeChart.prototype.createNote = function () {
    var items = [
        {noteType: 'line', text: this.minText || 'Minimum', key: 'min', color: '#ED1C24'},
        {noteType: 'line', text: this.midText || 'Medium', key: 'mid', color: '#58EBF4'},
        {noteType: 'line', text: this.maxText || 'Maximum', key: 'max', color: '#2C82FF'},
        {noteType: 'point', text: this.normalText || 'Normal', key: 'normal', color: '#f7941d'}
    ];
    this.$keyNoteGroup.items = items;
};


HorizontalRangeChart.prototype.createOYLabel = function () {
    var ranges = this.ranges;
    if (!Array.isArray(ranges)) ranges = [];
    this.$oyLabels = ranges.map(it => {
        return _({
            tag: 'text',
            attr: {
                'alignment-baseline': "middle"
            },
            child: {text: it.name}
        });
    });
    this.$oyLabelCtn.addChild(this.$oyLabels);
};

HorizontalRangeChart.prototype.createRanges = function () {
    var ranges = this.ranges;
    if (!Array.isArray(ranges)) ranges = [];
    this.$ranges = ranges.map(range => {
        var elt = _({
            tag: 'gcontainer',
            child: []
        });
        elt.$line = _({
            tag: 'path',
            style: {
                stroke: 'rgb(124,124,147)',
                strokeWidth: 3
            }
        });

        elt.addChild(elt.$line);
        elt.$min = _({
            tag: 'rect',
            attr: {
                x: -2.5,
                y: -15,
                width: 5, height: 30,
                title: this.numberToString(range.min)
            },
            style: {
                fill: '#ED1C24',
                stroke: 'none'
            }
        });
        elt.addChild(elt.$min);
        if (isRealNumber(range.mid)) {
            elt.$mid = _({
                tag: 'rect',
                style: {
                    fill: '#58EBF4',
                    stroke: 'none'
                },
                attr: {
                    x: -2.5,
                    y: -15,
                    width: 5, height: 30,
                    title: this.numberToString(range.mid)
                }
            });
            elt.addChild(elt.$mid);
        }
        elt.$max = _({
            tag: 'rect',
            style: {
                fill: '#2C82FF',
                stroke: 'none'
            },
            attr: {
                x: -2.5,
                y: -15,
                width: 5, height: 30,
                title: this.numberToString(range.max)
            }
        });
        elt.addChild(elt.$max);
        if (isRealNumber(range.normal)) {
            elt.$normal = _({
                tag: 'circle',
                attr: {
                    cx: 0, cy: 0, r: 10,
                    title: this.numberToString(range.normal)
                },
                style: {
                    fill: "rgb(247, 148, 29)"
                }
            });
            elt.addChild(elt.$normal);
        }
        return elt;
    });
    this.$rangeCtn.clearChild()
        .addChild(this.$ranges);

}


HorizontalRangeChart.prototype.updateSize = function () {
    SvgCanvas.prototype.updateSize.call(this);
    this.updateContentPosition();
};

HorizontalRangeChart.prototype.updateContentPosition = function () {
    if (!this.$oyLabels) return;
    var ranges = this.ranges;
    if (!Array.isArray(ranges)) ranges = [];
    var i, j;
    var width = this.box.width || 0;
    var y = 5;
    this.$title.attr('x', width / 2).attr('y', y);
    y += 30;
    this.$keyNoteGroup.box.width = width - 20;
    this.$keyNoteGroup.box.x = 10;
    this.$keyNoteGroup.box.y = y;
    this.$keyNoteGroup.updateSize();
    y += (this.$keyNoteGroup.box.height || 0) + 20;
    this.$body.box.y = y + 24;

    var oyLabelWidth = this.$oyLabels.reduce((ac, cr) => Math.max(ac, cr.getBBox().width), 0);
    oyLabelWidth = Math.ceil(oyLabelWidth);
    var spacing = 80;
    this.$body.box.x = oyLabelWidth + 10;
    this.$body.box.width = width - this.$body.box.x - 10;

    this.$oyLabelCtn.box.x = -this.$body.box.x;

    this.$axis.box.width = this.$body.box.width;
    this.$oxArrow.attr('d', 'M' + (this.$axis.box.width) + ' 0 m0 -5v10l6.8 -5z');
    this.$axis.box.height = spacing * this.$oyLabels.length;
    /**
     *
     * @type {Turtle}
     */
    var turtle = new Turtle()
        .moveTo(this.$axis.box.width, 0)
        .hLineTo(0)
        .vLineTo(this.$axis.box.height);

    var valueNameWidth = this.$valueName.getBBox().width;
    this.$valueName.attr('x', this.$axis.box.width)
        .attr('y', -8);

    var dx = Math.max(100, Math.floor(20 + measureArial14TextWidth(this.numberToString(this.computedData.max))));
    var sm = calBeautySegment(Math.floor((this.$axis.box.width - valueNameWidth - 10 - dx / 2) / dx),
        this.computedData.min, this.computedData.max + 1);
    dx = Math.floor((this.$axis.box.width - valueNameWidth - 10 - dx / 2) / sm.segmentCount);
    var dv = (sm.maxValue - sm.minValue) / sm.segmentCount;
    turtle.moveTo(0, 2);
    for (i = 0; i < sm.segmentCount; ++i) {
        turtle.moveBy(dx, -4);
        turtle.vLineBy(4);
    }


    this.$oxy.attr('d', turtle.getPath());
    this.$oyLabels.forEach((elt, i) => {
        elt.attr('y', i * spacing + spacing / 2);
    });

    while (this.$oxLabelCtn.childNodes.length > sm.segmentCount + 1) this.$oxLabelCtn.lastChild.remove();
    while (this.$oxLabelCtn.childNodes.length < sm.segmentCount + 1)
        this.$oxLabelCtn.addChild(_({tag: 'text', style: {textAnchor: 'middle'}, attr: {y: -8}, child: {text: ''}}));

    Array.prototype.forEach.call(this.$oxLabelCtn.childNodes, (elt, i) => {
        elt.firstChild.data = this.numberToString(sm.minValue + i * dv);
        elt.attr('x', dx * i);
    });

    turtle = new Turtle();
    var oxLength = this.$axis.box.width - 5;
    turtle.moveTo(oxLength, 0);
    for (i = 0; i < ranges.length; ++i) {
        turtle.moveBy(-oxLength, spacing)
            .hLineBy(oxLength);
    }

    turtle.moveTo(0, spacing * ranges.length, 0);
    for (i = 0; i < sm.segmentCount; ++i) {
        turtle.moveBy(dx, -spacing * ranges.length)
            .vLineBy(spacing * ranges.length);
    }

    this.$grid.attr('d', turtle.getPath());

    this.$ranges.forEach((elt, i) => {
        elt.box.y = i * spacing + spacing / 2;
        var range = ranges[i];
        elt.$min.attr('x', map(range.min, 0, dv, 0, dx) - 2.5);
        if (elt.$mid) elt.$mid.attr('x', map(range.mid, 0, dv, 0, dx) - 2.5);
        elt.$max.attr('x', map(range.max, 0, dv, 0, dx) - 2.5);
        elt.$line.attr('d', `M${map(range.min, 0, dv, 0, dx)} 0 l${map(range.max - range.min, 0, dv, 0, dx)} 0`)
        if (elt.$normal) elt.$normal.attr('cx', map(range.normal, 0, dv, 0, dx));
    });

    this.$body.box.height = this.$axis.box.height + 10;//10px : padding bottom

    this.box.height = this.$body.box.y + this.$body.box.height;
};

HorizontalRangeChart.prototype.computeData = function () {
    var ranges = Array.isArray(this.ranges) ? this.ranges : [];
    this.computedData = {};
    this.computedData.max = ranges.reduce((ac, cr) => Math.max(ac, cr.min, cr.max, cr.mid), -Infinity);
    this.computedData.min = ranges.reduce((ac, cr) => Math.min(ac, cr.min, cr.max, cr.mid), Infinity);
    if (this.zeroOY) this.computedData.min = Math.min(this.computedData.min, 0);

};

HorizontalRangeChart.prototype.updateContent = function () {
    this.computeData();
    this.$title.firstChild.data = this.title;
    this.$valueName.firstChild.data = this.valueName || '';
    this.createNote();
    this.createOYLabel();
    this.createRanges();
    this.updateContentPosition();
};

VCore.install(HorizontalRangeChart);

export default HorizontalRangeChart;

