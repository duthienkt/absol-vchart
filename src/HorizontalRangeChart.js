import VCore, {_, $} from "./VCore";
import BChart, {ChartResizeController, ChartTitleController} from "./BChart";
import OOP, {mixClass} from "absol/src/HTML5/OOP";
import {findMaxZIndex, isNaturalNumber, isRealNumber} from "absol-acomp/js/utils";
import {DEFAULT_CHART_COLOR_SCHEMES} from "absol-acomp/js/colorpicker/SelectColorSchemeMenu";
import SvgCanvas from "absol-svg/js/svg/SvgCanvas";
import {KeyNoteGroup} from "./KeyNote";
import AElement from "absol/src/HTML5/AElement";
import Turtle from "absol/src/Math/Turtle";
import {numberToString} from "absol/src/Math/int";
import {calBeautySegment, map, measureArial14TextWidth} from "./helper";
import DelaySignal from "absol/src/HTML5/DelaySignal";
import {observePropertyChanges} from "absol/src/DataStructure/Object";
import GContainer from "absol-svg/js/svg/GContainer";
import noop from "absol/src/Code/noop";
import {traceOutBoundingClientRect} from "absol/src/HTML5/Dom";

/**
 * @extends SvgCanvas
 * @constructor
 */
function HorizontalRangeChart() {
    this.resizeCtrl = new ChartResizeController(this);
    this.titleCtrl = new ChartTitleController(this);
    this.fixedAxisCtrl = new HRCFixedAxisController(this);
    this.$attachhook.once('attached', () => {
        this.updateContent.bind(this);
        this.fixedAxisCtrl.start();
    });
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
    this.domSignal = new DelaySignal();
    this.$fixedContentRef = $('.vc-fixed-content-ref', this);

    this.domSignal.on({
        updateContent: () => {
            if (this.isDescendantOf(document.body)) {
                this.updateContent();
            }
        }
    });

    observePropertyChanges(this, this.dataKeys, () => {
        if (this.domSignal) this.domSignal.emit('updateContent');
    });


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
                tag: 'rect',
                class: 'vc-fixed-content-ref',
                attr: {
                    width: '10px',
                    height: '10px'
                },
                style: {
                    fill: 'transparent',
                    stroke: 'none'
                }
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


HorizontalRangeChart.prototype.rowSpacing = 40;
HorizontalRangeChart.prototype.plotRadius = 8;
HorizontalRangeChart.prototype.rangeHeight = 20;
HorizontalRangeChart.prototype.rangeWidth = 3;
HorizontalRangeChart.prototype.rangeMaxColor = '#86aeea';
HorizontalRangeChart.prototype.rangeMinColor = '#7ebd3b';
HorizontalRangeChart.prototype.rangeMidColor = 'red';
HorizontalRangeChart.prototype.rangeMidHeight = 26;
HorizontalRangeChart.prototype.rangeMidWidth = 5;

HorizontalRangeChart.prototype.normalColor = 'rgb(247, 148, 29)';


HorizontalRangeChart.prototype.dataKeys = BChart.prototype.dataKeys
    .concat(['rowSpacing', 'plotRadius', 'rangeHeight', 'ranges', 'rangeWidth', 'rangeMaxColor', 'rangeMinColor', 'rangeMidHeight', 'rangeMidWidth']);

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
        {noteType: 'line', text: this.minText || 'Minimum', key: 'min', color: this.rangeMinColor},
        {noteType: 'line', text: this.midText || 'Medium', key: 'mid', color: this.rangeMidColor},
        {noteType: 'line', text: this.maxText || 'Maximum', key: 'max', color: this.rangeMaxColor},
        {noteType: 'point', text: this.normalText || 'Normal', key: 'normal', color: this.normalColor}
    ];
    this.$keyNoteGroup.items = items;
};


HorizontalRangeChart.prototype.createOYLabel = function () {
    var ranges = this.ranges;
    if (!Array.isArray(ranges)) ranges = [];
    if (this.$oyLabels) this.$oyLabels.forEach(e => e.remove());
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
        if (isRealNumber(range.normal)) {
            elt.$normal = _({
                tag: 'circle',
                attr: {
                    cx: 0, cy: 0, r: this.plotRadius,
                    title: this.numberToString(range.normal)
                },
                style: {
                    fill: this.normalColor,
                    stroke: 'rgb(92, 92, 95)'
                }
            });
            elt.addChild(elt.$normal);
        }
        elt.$min = _({
            tag: 'rect',
            attr: {
                x: -this.rangeWidth / 2,
                y: -this.rangeHeight / 2,
                width: this.rangeWidth, height: this.rangeHeight,
                title: this.numberToString(range.min)
            },
            style: {
                fill: this.rangeMinColor,
                // fill:'black',
                // fill: 'rgb(72, 72, 75)',
                stroke: 'none'
            }
        });
        elt.addChild(elt.$min);
        if (isRealNumber(range.mid)) {
            elt.$mid = _({
                tag: GContainer,
                child: {
                    tag: 'rect',
                    style: {
                        // fill: '#58EBF4',
                        fill: 'red',
                        stroke: 'none'
                    },
                    attr: {
                        // x: -this.plotRadius / 1.4,
                        // y: -this.plotRadius / 1.4,
                        // width: this.plotRadius / 0.7, height: this.plotRadius / 0.7,
                        width: this.rangeMidWidth,
                        height: this.rangeMidHeight,
                        x: -this.rangeMidWidth / 2,
                        y: -this.rangeMidHeight / 2,
                        title: this.numberToString(range.mid),
                        // transform:'rotate(45)'
                    }
                }
            });
            elt.addChild(elt.$mid);
        }
        elt.$max = _({
            tag: 'rect',
            style: {
                fill: this.rangeMaxColor,
                // fill: 'rgb(72, 72, 75)',
                stroke: 'none'
            },
            attr: {
                x: -this.rangeWidth / 2,
                y: -this.rangeHeight / 2,
                width: this.rangeWidth, height: this.rangeHeight,
                title: this.numberToString(range.max)
            }
        });
        elt.addChild(elt.$max);

        return elt;
    });
    this.$rangeCtn.clearChild()
        .addChild(this.$ranges);

}


HorizontalRangeChart.prototype.updateSize = function () {
    SvgCanvas.prototype.updateSize.call(this);
    this.updateContentPosition();
    this.fixedAxisCtrl.updateContentPosition();
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
    this.$keyNoteGroup.box.x = width / 2 - this.$keyNoteGroup.getBBox().width / 2;
    y += (this.$keyNoteGroup.box.height || 0) + 20;
    this.$body.box.y = y + 24;

    var oyLabelWidth = this.$oyLabels.reduce((ac, cr) => Math.max(ac, cr.getBBox().width), 0);
    oyLabelWidth = Math.ceil(oyLabelWidth);
    var spacing = this.rowSpacing;
    this.$body.box.x = oyLabelWidth + 10;
    this.$body.box.width = width - this.$body.box.x - 10;
    this.$fixedContentRef.attr('y', this.$body.box.y - 24);
    this.$fixedContentRef.attr('width', this.$body.box.width + this.$body.box.x + 8);
    this.$fixedContentRef.attr('height', 33);

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
    this.computedData.sm = sm;
    dx = Math.floor((this.$axis.box.width - valueNameWidth - 10 - dx / 2) / sm.segmentCount);
    var dv = (sm.maxValue - sm.minValue) / sm.segmentCount;
    this.computedData.dx = dx;//for fixed content
    this.computedData.dv = dv;
    turtle.moveTo(0, 2);
    for (i = 0; i < sm.segmentCount; ++i) {
        turtle.moveBy(dx, -4);
        turtle.vLineBy(4);
    }


    this.$oxy.attr('d', turtle.getPath());
    this.$oyLabels.forEach((elt, i) => {
        elt.attr('y', i * spacing + spacing / 2);
    });

    while (this.$oxLabelCtn.childNodes.length > sm.segmentCount + 1 && this.$oxLabelCtn.lastChild)
        this.$oxLabelCtn.lastChild.remove();
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
        elt.$min.attr('x', map(range.min - sm.minValue, 0, dv, 0, dx) - this.rangeWidth / 2);
        if (elt.$mid) elt.$mid.box.x = map(range.mid - sm.minValue, 0, dv, 0, dx);
        elt.$max.attr('x', map(range.max - sm.minValue, 0, dv, 0, dx) - this.rangeWidth / 2);
        elt.$line.attr('d', `M${map(range.min - sm.minValue, 0, dv, 0, dx)} 0 l${map(range.max - range.min, 0, dv, 0, dx)} 0`)
        if (elt.$normal) elt.$normal.attr('cx', map(range.normal - sm.minValue, 0, dv, 0, dx));
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
    this.fixedAxisCtrl.updateContent();
};

VCore.install(HorizontalRangeChart);

export default HorizontalRangeChart;

/**
 *
 * @param {HorizontalRangeChart}elt
 * @constructor
 */
function HRCFixedAxisController(elt) {
    this.elt = elt;
    this.state = 'PENDING';
    this.listenningElementList = [];
    this.ev_scroll = this.ev_scroll.bind(this);
    this.$canvas = null;

}

HRCFixedAxisController.prototype.start = function () {
    if (this.state !== 'PENDING') return;
    this.state = "RUNNING";
    var elt = this.elt.parentElement;
    while (elt) {
        elt.addEventListener('scroll', this.ev_scroll);
        elt = elt.parentElement;
        this.listenningElementList.push(elt);
    }
    elt = document;
    elt.addEventListener('scroll', this.ev_scroll);
    this.listenningElementList.push(elt);
    this.$canvas = _({
        tag: SvgCanvas.tag,
        class:'vc-chart',
        style: {
            pointerEvents:'none',
            minHeight: 'unset',
            position: 'fixed',
            zIndex: findMaxZIndex(this.elt) + 100,
            left: 0,
            top: 0
        },
        child: [
            {
                tag:'path',
                class:'vc-fixed-axis-bg',
                style:{
                    pointerEvents:'all',
                    fill: 'white',
                    stroke:'none'
                }
            },
            {
                tag: 'gcontainer',
                class: 'vc-body',
                child: [
                    {
                        tag: 'gcontainer',
                        class: 'vc-ox-label-ctn'
                    },
                    {
                        tag: 'text',
                        class: 'vc-value-name',
                        child: {text: ''}
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
                    }
                ]
            },

        ]
    }).addTo(this.elt.parentElement);
    this.$bg = $('.vc-fixed-axis-bg', this.$canvas);
    this.$body = $('.vc-body', this.$canvas);
    this.$axis = $('.vchart-axis', this.$canvas);
    this.$oxy = $('#oxy', this.$canvas);
    this.$oxArrow = $('#ox-arrow', this.$canvas);
    this.$body.box.y = 24;
    this.$oxLabelCtn = $('.vc-ox-label-ctn', this.$canvas);
    this.$valueName = $('.vc-value-name', this.$canvas);

};

HRCFixedAxisController.prototype.stop = function () {
    if (this.state !== 'RUNNING') return;
    this.state = "STOPPED";
    var elt;
    while (this.listenningElementList.length > 0) {
        elt = this.listenningElementList.pop();
        elt.removeEventListener('scroll', this.ev_scroll);
    }
    this.$canvas.remove();
};

HRCFixedAxisController.prototype.revokeResource = function () {
    this.revokeResource = noop;
    this.stop();
    this.elt = null;
};

HRCFixedAxisController.prototype.updateContent = function () {
    this.$valueName.firstChild.data = this.elt.valueName || '';

};


HRCFixedAxisController.prototype.updateContentPosition = function () {
    if (this.state !== "RUNNING") return;
    var i;
    if (!this.elt.computedData) return;
    var sm = this.elt.computedData.sm;
    var dx = this.elt.computedData.dx;
    var dv = this.elt.computedData.dv;
    var width = parseFloat(this.elt.$fixedContentRef.attr('width'))
    var height = parseFloat(this.elt.$fixedContentRef.attr('height'))
    this.$canvas.addStyle({
        width: width + 'px',
        height: height + 1 + 'px'
    });
    this.$canvas.box.setSize(width, height);
    this.$body.box.x =  this.elt.$body.box.x;
    this.$axis.box.x = this.elt.$axis.box.x;
    this.$oxArrow.attr('d', 'M' + (this.elt.$axis.box.width) + ' 0 m0 -5v10l6.8 -5z');
    this.$valueName.attr('x', this.elt.$axis.box.width)
        .attr('y', -8);

    var turtle = new Turtle()
        .moveTo(this.elt.$axis.box.width, 0)
        .hLineTo(0)
        .vLineTo(10);
    turtle.moveTo(0, 2);
    for (i = 0; i < sm.segmentCount; ++i) {
        turtle.moveBy(dx, -4);
        turtle.vLineBy(4);
    }
    this.$oxy.attr('d', turtle.getPath());

    while (this.$oxLabelCtn.childNodes.length > sm.segmentCount + 1 && this.$oxLabelCtn.lastChild)
        this.$oxLabelCtn.lastChild.remove();
    while (this.$oxLabelCtn.childNodes.length < sm.segmentCount + 1)
        this.$oxLabelCtn.addChild(_({tag: 'text', style: {textAnchor: 'middle'}, attr: {y: -8}, child: {text: ''}}));

    Array.prototype.forEach.call(this.$oxLabelCtn.childNodes, (elt, i) => {
        elt.firstChild.data = this.elt.numberToString(sm.minValue + i * dv);
        elt.attr('x', dx * i);
    });

    turtle = new Turtle();
    turtle.moveTo(width, 0 )
        .vLineTo(height)
        .hLineBy(-8)
        .vLineBy(-5)
        .hLineTo(0)
        .vLineTo(0)
        .closePath();

    this.$bg.attr('d', turtle.getPath());

    this.updateDomPosition();
};

HRCFixedAxisController.prototype.updateDomPosition = function () {
    var outBound = traceOutBoundingClientRect(this.elt);
    var refBound = this.elt.$fixedContentRef.getBoundingClientRect();
    var bound = this.elt.getBoundingClientRect();
    var hidden = false;
    hidden = hidden || bound.bottom < outBound.top + refBound.height + 5;
    hidden = hidden || refBound.top  > outBound.top;
    if (hidden) {
        this.$canvas.addStyle('visibility', 'hidden');
    }
    else {
        this.$canvas.removeStyle('visibility');
        this.$canvas.addStyle({
            left: refBound.left - 0.5 + 'px',
            top: Math.max(refBound.top, outBound.top) - 0.5 + 'px',
        });
    }

}

HRCFixedAxisController.prototype.ev_scroll = function () {
    this.updateDomPosition();
};




