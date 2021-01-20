import './style/rangechart.css';
import Vcore from "./VCore";
import {hline, vline, circle, text, isNumber, moveHLine, moveVLine, calBeautySegment, map, wrapToLines} from "./helper";
import GContainer from "absol-svg/js/svg/GContainer";
import BChart from "./BChart";
import OOP from "absol/src/HTML5/OOP";
import VerticalChart from "./VerticalChart";

var _ = Vcore._;
var $ = Vcore.$;

/***
 * @extends BChart
 * @constructor
 */
function RangeChart() {
    /** default config**/
    this.valuePlotRadius = 5;
    this.minKeyWidth = 90;
    this.maxKeyWidthRatio = 1.5;
    this.limitLineLength = 30;
    this.lineHeight = 22;
    BChart.call(this);
    this.contentPadding = 0;
    /** data **/
    this.integerOnly = false;
    this.zeroOY = false;
    this.ranges = [];
    this.valueName = '';
    this.keyName = '';
    this.maxText = 'Maximum';
    this.minText = 'Minimum';
    this.midText = 'Median';
    this.normalText = 'Normal';
    this.numberToString = null;
    this.$debugRect = this.$debugRect || _({
        tag: 'rect',
        style: {
            fill: 'rgba(255, 0, 0,0.5)'
        },
        attr: { x: 0, y: 0 }
    });
    this.createStatic();
    this.$oyValueCtn = $('gcontainer.vc-oy-value-ctn', this);
    this.$rangeCtn = $('.vc-range-ctn', this);
    this.$whiteMask = $('.vc-white-mask', this);
    this.$axisCtn = $('gcontainer.vc-axis-ctn', this);
    this.$axis = $('axis', this);
    this.$oxTable = $('gcontainer.vc-ox-table', this);
    this.$oxLabelCtn = $('gcontainer.vc-ox-label-ctn', this);
    this.$oxValueCtn = $('gcontainer.vc-ox-value-ctn', this);

    this.$valueName = $('text.vc-value-name', this);
    this.$keyName = $('text.vc-key-name', this);
    this.$oxySpace = $('.vc-oxy-space', this);
    this.$oyValues = [];
    /***
     *
     * @type {ScrollArrow}
     */
    this.$scrollArrow = $('scrollarrow', this)
        .on('pressleft', this.eventHandler.scrollArrowsPressLeft)
        .on('pressright', this.eventHandler.scrollArrowsPressRight);
    this.$hscrollbar = $('hscrollbar', this)
        .on('scroll', this.eventHandler.scrollOxySpace);
    this.$hscrollbar.height = 12;
    this.$hscrollbar.box.y = -11;
    this.sync = new Promise(function (resolve) {
        this.$attachhook.once('attached', resolve);
    }.bind(this));
}

OOP.mixClass(RangeChart, BChart);
RangeChart.property = Object.assign({}, VerticalChart.property);
RangeChart.eventHandler = Object.assign({}, VerticalChart.eventHandler);


RangeChart.tag = 'RangeChart'.toLowerCase();

RangeChart.render = function () {
    return BChart.render()
        .addClass('range-chart')
        .addClass('vc-range-chart');
};

RangeChart.prototype.createStatic = function () {
    _({
        elt: this.$body,
        child: [

            {
                tag: 'gcontainer',
                class: 'vc-axis-ctn',
                child: [
                    this.$debugRect,
                    {
                        tag: 'gcontainer',
                        class: 'vc-oxy-space',
                        child: [
                            {
                                tag: 'gcontainer',
                                class: 'vc-ox-table',
                                child: [
                                    'gcontainer.vc-ox-label-ctn',
                                    'gcontainer.vc-ox-value-ctn'
                                ]
                            },
                            {
                                tag: 'gcontainer',
                                class: 'vc-range-ctn',
                            }
                        ]
                    },
                    {
                        tag: 'path',
                        class: 'vc-white-mask',
                        attr: {
                            fill: 'white',
                            stroke: 'white',
                            'fill-rule': 'evenodd',
                            d: 'M0,0  0,2000 2000,2000 2000,0zM100,0  0,200 200,200 200,0z'
                        }
                    },
                    'gcontainer.vc-oy-value-ctn',
                    'axis',
                    {
                        tag: 'text',
                        class: 'vc-value-name',
                        attr: {
                            y: 14,
                            x: 5
                        },
                        child: { text: '' }
                    },
                    {
                        tag: 'text',
                        class: 'vc-key-name',
                        attr: {
                            y: 14,
                            x: 5
                        },
                        child: { text: '' }
                    },
                    'scrollarrow',
                    'hscrollbar'
                ]
            }
        ]
    })
};

RangeChart.prototype.normalizeData = function () {

};

RangeChart.prototype.computeData = function () {
    // this.computedData
    this.computedData.hasMidValue = this.ranges.some(function (range) {
        return isNumber(range.mid);
    });
    this.computedData.hasNormalValue = this.ranges.some(function (range) {
        return isNumber(range.normal);
    });

    this.computedData.max = this.ranges.reduce(function (ac, range) {
        if (isNumber(range.max)) ac = Math.max(ac, range.max);
        if (isNumber(range.mid)) ac = Math.max(ac, range.mid);
        if (isNumber(range.min)) ac = Math.max(ac, range.min);
        if (isNumber(range.normal)) ac = Math.max(ac, range.normal);
        return ac;
    }, -Infinity);

    this.computedData.min = this.ranges.reduce(function (ac, range) {
        if (isNumber(range.max)) ac = Math.min(ac, range.max);
        if (isNumber(range.mid)) ac = Math.min(ac, range.mid);
        if (isNumber(range.min)) ac = Math.min(ac, range.min);
        if (isNumber(range.normal)) ac = Math.min(ac, range.normal);
        return ac;
    }, Infinity);
    if (this.computedData.min > this.computedData.max) {
        this.computedData.min = 0;
        this.computedData.max = 10;
    }

    if (this.zeroOY) {
        this.computedData.min = 0;
    }

    if (this.computedData.min === this.computedData.max) {
        this.computedData.max += 1;
    }
};

RangeChart.prototype.mapOYValue = VerticalChart.prototype.mapOYValue;

RangeChart.prototype._computeOYSegment = function () {
    var segment = calBeautySegment(Math.floor(this.$axisCtn.box.height / 50), this.computedData.min, this.computedData.max, this.integerOnly);
    if (!this.computedData.oy || segment.step !== this.computedData.oy.step || segment.segmentCount !== this.computedData.oy.segmentCount
        || segment.maxValue !== this.computedData.oy.maxValue || segment.minValue !== this.computedData.oy.minValue) {
        this.computedData.oy = segment;
        this.computedData.oyUpdated = false;
        this.computedData.numberToFixed = 0;
        if (segment.step < 1) this.computedData.numberToFixed++;
        if (segment.step < 0.1) this.computedData.numberToFixed++;
        if (segment.step < 0.01) this.computedData.numberToFixed++;
        if (segment.step < 0.001) this.computedData.numberToFixed++;
        if (segment.step < 0.0001) this.computedData.numberToFixed++;
        this.computedData.oySegmentLength = this.$axisCtn.box.height / segment.segmentCount;
        return true;
    }
    return false;
};

RangeChart.prototype._createNote = function () {
    var ctn = this.$noteCtn.clearChild();
    var y0 = this.lineHeight / 2 + 1;
    var labelX = this.limitLineLength + 10;
    ctn.$maxLine = this._createLimitLine(0, y0, this.limitLineLength, 'max').addTo(ctn);
    ctn.$maxText = text(this.maxText, labelX, y0 + 5).addTo(ctn);
    y0 += this.lineHeight;
    if (this.computedData.hasMidValue) {
        this._createLimitLine(0, y0, this.limitLineLength, 'mid').addTo(ctn);
        text(this.midText, labelX, y0 + 5).addTo(ctn);
        y0 += this.lineHeight;
    }
    ctn.$minLine = this._createLimitLine(0, y0, this.limitLineLength, 'min').addTo(ctn);
    ctn.$minText = text(this.minText, labelX, y0 + 5).addTo(ctn);
    if (this.computedData.hasNormalValue) {
        y0 += this.lineHeight;
        if (this.ranges[0].normal !== undefined) {
            circle(this.limitLineLength / 2, y0, this.valuePlotRadius, 'range-chart-value-plot').addTo(ctn);
            text(this.normalText, labelX, y0 + 5).addTo(ctn);
        }
    }
    y0 += this.lineHeight / 2;
    ctn.box.setSize(ctn.getBBox().width + 7, y0)
};

RangeChart.prototype._updateNotesPosition = function () {
    var box = this.$noteCtn.box;
    this.$noteCtn.box.setPosition(this.contentPadding, this.box.height - box.height - this.contentPadding)
};

RangeChart.prototype.createOxTable = function () {
    var thisC = this;
    this.$oxValueCtn.clearChild();
    var hasMidValue = this.computedData.hasMidValue;
    var hasNormalValue = this.computedData.hasNormalValue;
    var maxValueWidth = 0;
    this.$oxRangeCols = this.ranges.map(function (range, i, arr) {
        var ctn = _({
            tag: GContainer.tag,
        });
        thisC.$oxValueCtn.addChild(ctn);
        var maxText = '"';
        var midText = '"';
        var minText = '"';
        var normalText = '"';
        var y0 = 17;
        if (isNumber(range.max))
            maxText = thisC.numberToText(range.max);
        ctn.$maxText = _({
            tag: 'text',
            attr: {
                x: 0,
                y: y0
            },
            child: { text: maxText }
        });
        ctn.addChild(ctn.$maxText);
        y0 += thisC.lineHeight;
        if (hasMidValue) {
            if (isNumber(range.mid))
                midText = thisC.numberToText(range.mid);
            ctn.$midText = _({
                tag: 'text',
                attr: {
                    x: 0,
                    y: y0
                },
                child: { text: midText }
            });
            ctn.addChild(ctn.$midText);
            y0 += thisC.lineHeight;
        }
        if (isNumber(range.min))
            minText = thisC.numberToText(range.min);

        ctn.$minText = _({
            tag: 'text',
            attr: {
                x: 0,
                y: y0
            },
            child: { text: minText }
        });
        ctn.addChild(ctn.$minText);
        if (hasNormalValue) {
            y0 += thisC.lineHeight;
            if (isNumber(range.normal))
                normalText = thisC.numberToText(range.normal);
            ctn.$normalText = _({
                tag: 'text',
                attr: {
                    x: 0,
                    y: y0
                },
                child: { text: normalText }
            });
            ctn.addChild(ctn.$normalText);
        }
        y0 += thisC.lineHeight / 2 - 5;
        var textWidth = ctn.getBBox().width;
        ctn.box.setSize(textWidth, y0);
        maxValueWidth = Math.max(maxValueWidth, textWidth);
        return ctn;
    });
    this.computedData.maxValueWidth = maxValueWidth;
    if (this.$oxRangeCols.length > 0)
        this.$oxValueCtn.box.height = this.$oxRangeCols[0].box.height;
};

RangeChart.prototype.createOxLabel = function () {
    var lineHeight = this.lineHeight;
    var ctn = this.$oxLabelCtn;
    var keyLimitWidth = Math.max(this.minKeyWidth, this.computedData.maxValueWidth * this.maxKeyWidthRatio);
    var keyMaxWidth = 0;
    ctn.clearChild();
    this.$oxLabels = this.ranges.map(function (range) {
        var lines = wrapToLines(range.name, 14, keyLimitWidth);
        if (lines.length < 2) lines = [];
        else lines = lines.map(function (line, i) {
            return {
                tag: 'text',
                class: 'vc-range-chart-label-line',
                attr: {
                    x: '0',
                    y: 17 + i * lineHeight + ''
                },
                child: { text: line }
            }
        });
        var labelBlock = _({
            tag: GContainer.tag,
            child: [
                {
                    tag: 'text',
                    attr: {
                        x: '0',
                        y: 17
                    },
                    class: lines.length >= 2 ? 'vc-range-chart-label-full' : 'vc-range-chart-label',
                    child: { text: range.name }
                }
            ].concat(lines)
        }).addTo(ctn);
        keyMaxWidth = Math.max(keyMaxWidth, labelBlock.getBBox().width);
        return labelBlock;
    });
    this.computedData.keyMaxWidth = keyMaxWidth;
};

RangeChart.prototype.createAxisName = function () {
    this.$valueName.firstChild.data = this.valueName;
    this.computedData.valueNameWidth = this.$valueName.getBBox().width;
    this.$keyName.firstChild.data = this.keyName;
    this.computedData.keyNameWidth = this.$keyName.getBBox().width;

};

RangeChart.prototype.updateAxisX = function () {
    this.$axisCtn.box.x = Math.max(this.computedData.valueNameWidth, this.computedData.maxValueWidth + 5, this.$noteCtn.box.width);
    this.$axisCtn.box.width = this.$body.box.width - this.$axisCtn.box.x - 7 - this.computedData.keyNameWidth;
    this.$axis.resize(this.$axisCtn.box.width + this.computedData.keyNameWidth, 10);
    this.$keyName.attr('x', this.$axisCtn.box.width + 7 + this.computedData.keyNameWidth);
    this.$hscrollbar.width = this.$axisCtn.box.width;
    this.$hscrollbar.outterWidth = this.$axisCtn.box.width;
};

RangeChart.prototype.updateOxTablePosition = function () {
    var requireMinWidth = (Math.max(this.computedData.keyMaxWidth, this.computedData.maxValueWidth) + 10) * this.ranges.length;
    var colWidth = Math.max(this.computedData.maxValueWidth + 10, this.$axisCtn.box.width / this.ranges.length);
    console.log("init ", this.computedData.maxValueWidth + 10, this.$axisCtn.box.width / this.ranges.length)
    this.computedData.oxLabelWrap = requireMinWidth > this.$axisCtn.box.width;
    if (this.computedData.oxLabelWrap) {
        this.addClass('vc-ox-label-wrap');
    }
    else {
        this.removeClass('vc-ox-label-wrap');
    }
    colWidth = this.$oxLabels.reduce(function (ac, labelBlock) {
        return Math.max(ac, labelBlock.getBBox().width + 10);
    }, colWidth);
    console.log(colWidth)
    this.$oxLabelCtn.box.height = this.$oxLabelCtn.getBBox().height + 5;
    this.$oxValueCtn.box.y = this.$oxLabelCtn.box.height;
    this.$oxValueCtn.box.height = this.$noteCtn.box.height;


    this.$oxLabels.forEach(function (labelBlock, i) {
        labelBlock.box.x = colWidth * (i + 0.5);
    }, 0);

    this.$oxRangeCols.forEach(function (colElt, i) {
        colElt.box.x = colWidth * (i + 0.5) + colElt.box.width / 2;
    }, 0);
    this.$oxTable.box.width = colWidth * this.ranges.length;
    this.$oxTable.box.height = this.$oxLabelCtn.box.height + this.$oxValueCtn.box.height;

    this.$axisCtn.box.y = this.$noteCtn.box.y - this.$body.box.y - this.$oxLabelCtn.box.height;
    this.$axisCtn.box.height = this.$axisCtn.box.y - 20;
    this.$scrollArrow.width = this.$axisCtn.box.width - 10;
    this.$scrollArrow.box.setPosition(5, -this.$axisCtn.box.height / 2);
    this.computedData.collWidth = colWidth;
    this.computedData.oyLength = this.$axisCtn.box.height;

    this.$hscrollbar.innerWidth = this.$oxTable.box.width;
    this._updateScrollArrowBtb();
};

RangeChart.prototype.updateAxisY = function () {
    this.$debugRect.addTo(this.$axisCtn);
    this.$debugRect.attr({
        x: 0,
        y: 0,
        width: 10,
        height: 10
    });
    this.$axis.resize(this.$axisCtn.box.width + this.computedData.keyNameWidth, this.$axisCtn.box.height + 10);
    this.$valueName.attr('y', -this.$axisCtn.box.height - 22);

    this.$whiteMask.attr('d',
        'M' + (-this.$axisCtn.box.x - this.$body.box.x - 1) + ' ' + (-this.$axisCtn.box.y - this.$body.box.y)
        + ' h' + (this.box.width + 2)
        + 'v' + (this.box.height)
        + 'h' + (-this.box.width - 2)
        + 'z'
        + 'M0 ' + (-this.$axisCtn.box.height)
        + 'h ' + (this.$axisCtn.box.width) +
        'v' + (this.$axisCtn.box.height + this.$oxTable.box.height) + ' H 0z'
    );
};


RangeChart.prototype._updateScrollArrowBtb = VerticalChart.prototype._updateScrollArrowBtb;
RangeChart.prototype._createOyValue = VerticalChart.prototype._createOyValue;

RangeChart.prototype._updateOYValuePosition = function () {
    this._computeOYSegment();
    if (!this.computedData.oyUpdated) {
        this._createOyValue();
    }
    var y = 0;
    var valueElt;
    for (var i = 0; i < this.$oyValues.length; ++i) {
        valueElt = this.$oyValues[i];
        valueElt.attr({
            y: y + 5,
            x: -10
        });
        y -= this.computedData.oySegmentLength;
    }

    this.$axis.oyDivision = this.computedData.oySegmentLength;
    this.$axis.updateOyDivision();
};

RangeChart.prototype.createRanges = function () {
    this.$ranges = this.ranges.map(function (range) {
        return this._createRange(range).addTo(this.$rangeCtn);
    }.bind(this));
};

RangeChart.prototype.updateRangesPosition = function () {
    var colWidth = this.computedData.collWidth;
    this.$ranges.forEach(function (range, i) {
        range.box.x = colWidth * (i + 0.5);
    });
};

RangeChart.prototype.createContent = function () {
    BChart.prototype.createContent.call(this);
    this.createOxTable();
    this.createOxLabel();
    this.createAxisName();
    this.createRanges();
};


RangeChart.prototype.updateBodyPosition = function () {
    BChart.prototype.updateBodyPosition.call(this);
    this.updateAxisX();
    this.updateOxTablePosition();
    this.updateAxisY();
    this._updateOYValuePosition();
    this.updateRangesPosition();
};


RangeChart.prototype._createLimitLine = function (x, y, length, eClss) {
    return hline(x, y, length, ['range-chart-limit-line'].concat(eClss ? [eClss] : []))
};

RangeChart.prototype.numberToText = VerticalChart.prototype.numberToText;

/***
 *
 * @param range
 * @return {GContainer}
 * @private
 */
RangeChart.prototype._createRange = function (range) {
    var res = _({ tag: GContainer.tag });
    res.$rangeLine = vline(0, 0, -1, 'range-chart-range-line').addTo(res);
    res.$dashLine = vline(0, 0, 0, 'range-chart-range-line').attr('stroke-dasharray', '2').addTo(res);
    res.$maxLine = this._createLimitLine(-this.limitLineLength / 2, 0, this.limitLineLength, 'max').addTo(res);
    res.$midLine = this._createLimitLine(-this.limitLineLength / 2, 0, this.limitLineLength, 'mid').addTo(res);
    res.$minLine = this._createLimitLine(-this.limitLineLength / 2, 0, this.limitLineLength, 'min').addTo(res);
    res.$plot = circle(0, 0, this.valuePlotRadius, 'range-chart-value-plot').addTo(res);
    res.$maxText = text(this.numberToText(range.max), 0, 0, 'range-chart-inline-value').attr('text-anchor', 'middle').addTo(res);
    res.$minText = text(this.numberToText(range.min), 0, 0, 'range-chart-inline-value').attr('text-anchor', 'middle').addTo(res);
    return res;
};

RangeChart.prototype._createScrollArrow = function () {
    var res = _('g.vchart-scroll-arrow');
    res.defineEvent(['pressleft', 'pressright']);

    res.$leftArrow = _(
        [
            '<g>',
            '<g class="vchart-scroll-arrow-left" transform="translate(0,-270)">',
            '<g transform="matrix(-.26164 0 0 .26164 20.762 218.56)" style="fill:#00a5d6">',
            '<path d="m0.99976 198 49.214 48.519-49.213 49.481v-14.201l35.215-35.079-35.164-34.611z" style="fill:#00a5d6"/>',
            '<path d="m28.531 198.44v13.96l35.057 34.608-35.057 34.963v13.555l48.91-48.844z" style="fill:#00a5d6"/>',
            '</g>',
            '</g>',
            '</g>'
        ].join('')
    ).addTo(res)
        .on('pointerdown', function (event) {
            event.preventDefault();
            var iv = setInterval(function () {
                res.emit('pressleft', event, res);
            }, 30);

            function finish(event) {
                clearInterval(iv);
                this.off('pointerleave', finish);
                this.off('pointerup', finish);
            };
            this.on('pointerleave', finish);
            this.on('pointerup', finish);
        });

    res.$hitBoxLeft = _({
        tag: 'rect',
        attr: {
            x: -5,
            y: -5,
            width: 30,
            height: 37,
            rx: 5,
            ry: 5
        },
        style: {
            fill: 'rgba(0, 0, 255, 0.1)'
        }
    }).addTo(res.$leftArrow);


    res.$rightArrow = _(
        [
            '<g>',
            '<g transform="translate(0,-270)">',
            '<g transform="matrix(.26164 0 0 .26164 .23843 218.56)" style="fill:#00a5d6">',
            '<path d="m0.99976 198 49.214 48.519-49.213 49.481v-14.201l35.215-35.079-35.164-34.611z" style="fill:#00a5d6"/>',
            '<path d="m28.531 198.44v13.96l35.057 34.608-35.057 34.963v13.555l48.91-48.844z" style="fill:#00a5d6"/>',
            '</g>',
            '</g>',
            '</g>'
        ].join('')
    ).addTo(res)
        .on('pointerdown', function (event) {
            event.preventDefault();
            var iv = setInterval(function () {
                res.emit('pressright', event, res);
            }, 30);

            function finish(event) {
                clearInterval(iv);
                this.off('pointerleave', finish);
                this.off('pointerup', finish);
            };
            this.on('pointerleave', finish);
            this.on('pointerup', finish);
        });

    res.$hitBoxRight = _({
        tag: 'rect',
        attr: {
            x: -5,
            y: -5,
            width: 30,
            height: 37,
            rx: 5,
            ry: 5
        },
        style: {
            fill: 'rgba(0, 0, 255, 0.1)'
        }
    }).addTo(res.$rightArrow);

    return res;
};


RangeChart.prototype._createRangeNote = function (range) {

    var res = _('g');
    var y0 = 0;
    text(range.name, 0, y0).addStyle('text-anchor', 'middle').addTo(res);
    y0 += 22;
    text(this.numberToText(range.max), 0, y0, 'range-char-note-value').addTo(res);
    y0 += 22;
    if (this.ranges[0].mid !== undefined) {
        text(this.numberToText(range.mid), 0, y0, 'range-char-note-value').addTo(res);
        y0 += 22;
    }

    text(this.numberToText(range.min), 0, y0, 'range-char-note-value').addTo(res);
    y0 += 22;

    if (this.ranges[0].normal !== undefined)
        text(this.numberToText(range.normal), 0, y0, 'range-char-note-value').addTo(res);

    return res;
};

RangeChart.prototype._createOYSegmentLines = function (n) {
    var res = _({
        tag: 'g',
        child: Array(n).fill('path.vchart-segment-line')
    });
    return res;
}

//
// RangeChart.prototype._createNote = function () {
//     var res = _('g.range-chart-note');
//
//     var y0 = 12;
//     res.$maxLine = this._createLimitLine(10, y0, this.limitLineLength, 'max').addTo(res);
//     res.$maxText = text(this.maxText, 50, y0 + 5).addTo(res);
//     y0 += 22;
//     if (this.ranges[0].mid != undefined) {
//         this._createLimitLine(10, y0, this.limitLineLength, 'mid').addTo(res);
//         text(this.midText, 50, y0 + 5).addTo(res);
//         y0 += 22;
//     }
//     res.$minLine = this._createLimitLine(10, y0, this.limitLineLength, 'min').addTo(res);
//     res.$minText = text(this.minText, 50, y0 + 5).addTo(res);
//     y0 += 22;
//     if (this.ranges[0].normal !== undefined) {
//         circle(this.limitLineLength / 2 + 10, y0, this.valuePlotRadius, 'range-chart-value-plot').addTo(res);
//         text(this.normalText, 50, y0 + 5).addTo(res);
//     }
//
//     return res;
// };

RangeChart.prototype._createOyValues = function (minValue, step, segmentCount, extendOY) {
    var child = Array(segmentCount + 1 + (extendOY ? 1 : 0)).fill(0).map(function (u, i) {
        var value;
        if (extendOY) {
            if (i == 0) {
                value = 0;
            }
            else {
                value = minValue + (i - 1) * step;
            }

        }
        else {
            value = minValue + i * step;
        }
        return {
            tag: 'text',
            attr: {
                x: '0',
                y: '0'
            },
            props: {
                innerHTML: this.numberToText(value)
            }
        }
    }.bind(this));


    return _({
        tag: 'g',
        child: child
    });

};


RangeChart.prototype.updateNote = function () {
    var noteBox = this.$note.getBBox();
    if (this.containsClass('show-inline-value')) {
        this.notePositionTop = this.canvasHeight - 12 - 14;
        var dx = 0;
        var maxTextBBox = this.$note.$maxText.getBBox();
        dx += 40 + maxTextBBox.width + maxTextBBox.x - this.$note.$maxLine.getBBox().x;
        this.$note.$minLine.attr('transform', 'translate(' + dx + ', -30)');
        this.$note.$minText.attr('transform', 'translate(' + dx + ', -30)');
        this.oxyLeft = this.$oyName.getBBox().width;//init with oy name

    }
    else {
        this.notePositionTop = this.canvasHeight - noteBox.height - 12;
        this.oxyLeft = noteBox.width + 14;
    }

    this.$note.attr(
        'transform',
        'translate(' + 0 + ', ' + this.notePositionTop + ')'
    );
    this.oxyBottom = this.notePositionTop - 22;
};


RangeChart.prototype.updateOyValues = function () {

    this.oyLength = this.oxyBottom - 70;
    this.oySegmentLength = this.oyLength / (this.oySegmentCount + (this.extendOY ? 1 : 0));
    Array.prototype.forEach.call(this.$oyValues.childNodes, function (e, i) {
        var eBBox = e.getBBox();
        e.attr({
            y: -i * this.oySegmentLength + 5,
            x: -eBBox.width - 10
        });
    }.bind(this));

    var oyValuesBox = this.$oyValues.getBBox();
    this.oxyLeft = Math.max(this.oxyLeft, oyValuesBox.width + 14);
    this.oxLength = this.canvasWidth - this.oxyLeft - 24;
    this.oxSegmentLength = this.oxLength / (this.ranges.length);
    this.$oyValues.attr('transform', 'translate(' + this.oxyLeft + ',' + this.oxyBottom + ')');
};

RangeChart.prototype.updateAxis = function () {
    this.$axis.moveTo(this.oxyLeft, this.oxyBottom);
    this.$axis.resize(this.oxLength + 14, this.oyLength + 14);
    this.$whiteBoxMask.attr('d', 'M0,0  0,cvh cvw,cvh cvw,0zMleft,top  left,bottom right,bottom right,topz'
        .replace(/cvh/g, this.canvasHeight)
        .replace(/cvw/g, this.canvasWidth)
        .replace(/left/g, this.oxyLeft)
        .replace(/top/g, 1)
        .replace(/bottom/g, this.canvasHeight)
        .replace(/right/g, this.canvasWidth - 10)
    )

    this.$content.attr('transform', 'translate(' + this.oxyLeft + ',' + this.oxyBottom + ')');
    this.$oyName.attr({ x: this.oxyLeft - this.$oyName.getBBox().width / 2, y: 40 });
    this.$oxName.attr({ x: this.canvasWidth - this.$oxName.getBBox().width - 3, y: this.oxyBottom - 9 });

    this.$hscrollbar.resize(this.oxLength, 10);
    this.$hscrollbar.moveTo(this.oxyLeft, this.oxyBottom - 10);
    this.$hscrollbar.outterWidth = this.oxLength;

};

RangeChart.prototype.updateRangeNotes = function () {

    var requireOxSegmentLenth = this.$rangeNotes.reduce(function (ac, cr) {
        return Math.max(ac, cr.getBBox().width);
    }, 0) + 20;

    this.oxSegmentLength = Math.max(this.oxSegmentLength, requireOxSegmentLenth);


    this.$rangeNotes.forEach(function (e, i) {
        e.attr('transform',
            'translate(' + (i * this.oxSegmentLength + this.oxSegmentLength / 2) + ', ' + (this.notePositionTop - 5 - this.oxyBottom) + ')');


        var numWidth = Array.prototype.reduce.call(e.childNodes, function (ac, e1, i) {
            if (i == 0) return ac;
            return Math.max(e1.getBBox().width, ac);
        }, 0);

        Array.prototype.forEach.call(e.childNodes, function (e1, i) {
            if (i == 0) return;
            e1.attr('x', numWidth / 2 - e1.getBBox().width);
        });
    }.bind(this));
};

RangeChart.prototype._calYOfValue = function (val) {
    return (this.extendOY ? -this.oySegmentLength : 0) - map(val, this.oyMinValue, this.oyMaxValue, 0, this.oyLength - (this.extendOY ? this.oySegmentLength : 0));
}

RangeChart.prototype.updateRanges = function () {
    this.$ranges.forEach(function (e, i) {
        var range = this.ranges[i];
        e.attr('transform', 'translate(' + this.oxSegmentLength * (i + 0.5) + ',' + 0 + ')');
        if (!isNumber(range.normal)) {
            e.$plot.addStyle('display', 'none');
        }
        else {
            e.$plot.removeStyle('display');
            e.$plot.attr('cy', this._calYOfValue(range.normal) + '');
        }
        if (isNumber(range.max)) {
            e.$maxLine.removeStyle('display');
            e.$maxText.removeStyle('display');
            moveHLine(e.$maxLine,
                -this.limitLineLength / 2,
                this._calYOfValue(range.max), this.limitLineLength);
            e.$maxText.attr('y', this._calYOfValue(range.max) - 5);
        }
        else {
            e.$maxLine.addStyle('display', 'none');
            e.$maxText.addStyle('display', 'none');
        }

        if (isNumber(range.min)) {
            e.$minLine.removeStyle('display');
            e.$minText.removeStyle('display');
            moveHLine(e.$minLine,
                -this.limitLineLength / 2,
                this._calYOfValue(range.min), this.limitLineLength);
            e.$minText.attr('y', this._calYOfValue(range.min) + 15);
        }
        else {
            e.$minLine.addStyle('display', 'none');
            e.$minText.addStyle('display', 'none');
        }

        if (!isNumber(range.mid)) {
            e.$midLine.attr('display', 'none');
        }
        else {
            e.$midLine.removeStyle('display');
            moveHLine(e.$midLine,
                -this.limitLineLength / 2,
                this._calYOfValue(range.mid), this.limitLineLength);
        }

        if (isNumber(range.min) && isNumber(range.max)) {
            e.$rangeLine.removeStyle('display');
            moveVLine(e.$rangeLine,
                0, this._calYOfValue((range.min)),
                -map(range.max - range.min, 0, this.oyMaxValue - this.oyMinValue, 0, this.oyLength - (this.extendOY ? this.oySegmentLength : 0))
            );
        }
        else {
            e.$rangeLine.addStyle('display', 'none');
        }


        if (range.mid > range.max) {
            e.$rangeLine.removeStyle('display');
            moveVLine(e.$dashLine,
                0, this._calYOfValue((range.mid)),
                -map(range.max - range.mid, 0, this.oyMaxValue - this.oyMinValue, 0, this.oyLength - (this.extendOY ? this.oySegmentLength : 0))
            );
        }
        else if (range.mid < range.min) {
            e.$rangeLine.removeStyle('display');
            moveVLine(e.$dashLine,
                0, this._calYOfValue((range.mid)),
                -map(range.min - range.mid, 0, this.oyMaxValue - this.oyMinValue, 0, this.oyLength - (this.extendOY ? this.oySegmentLength : 0))
            );

        }
        else {
            e.$rangeLine.removeStyle('display', 'none');
        }

    }.bind(this));
};

RangeChart.prototype.updateScrollArrows = function () {
    this.$scrollArrows.attr('transform', 'translate(' + (this.oxyLeft + 7) + ', ' + (this.oxyBottom - this.oyLength / 2) + ')');
    this.$scrollArrows.$rightArrow.attr('transform', 'translate(' + (this.oxLength - 15) + ', 0)');
    this.scrollLeft = this.scrollLeft;//update
    this.$hscrollbar.innerWidth = this.oxSegmentLength * this.ranges.length;
    this.$hscrollbar.scrollLeft = this.scrollLeft;//update

};


RangeChart.prototype.updateOYSegmentLines = function () {

    this.$oySegmentLines.attr('transform', 'translate(' + this.oxyLeft + ',' + this.oxyBottom + ')');
    Array.prototype.forEach.call(this.$oySegmentLines.childNodes, function (e, i) {
        moveHLine(e, -2, -(i + 1) * this.oySegmentLength, 4);

    }.bind(this));
};


RangeChart.prototype.update = function () {
    if (!this.ranges || this.ranges.length <= 0) return;
    if (typeof this.canvasWidth != 'number') {
        this.canvasWidth = 300;
        this.autoWidth = true;
    }
    this.updateSize();
    this.updateNote();
    this.updateOyValues();
    this.updateAxis();
    this.updateRangeNotes();
    this.updateRanges();
    this.updateScrollArrows();
    this.updateOYSegmentLines();

    requestAnimationFrame(function () {
        if (this.autoWidth) {
            var requireWidth = this.canvasWidth + this.overflowOX;
            var proviceWidth = this.parentElement.getBoundingClientRect().width;
            this.canvasWidth = Math.max(Math.min(requireWidth, proviceWidth), 300);
            this.update();
            this.autoWidth = false;
        }
    }.bind(this));
};


RangeChart.prototype.initComp = function () {
    if (this.maxValue == 'auto' || this.maxValue === undefined) {
        this.maxValue = this.ranges.reduce(function (ac, cr) {
            return Math.max(ac, cr.max,
                isNumber(cr.normal) ? cr.normal : -10000000000,
                isNumber(cr.mid) ? cr.mid : -10000000000);
        }, -1000000000);
    }
    if (this.minValue == 'auto' || this.minValue === undefined) {
        this.minValue = this.ranges.reduce(function (ac, cr) {
            return Math.min(ac, cr.min, isNumber(cr.normal) ? cr.normal : 10000000000,
                isNumber(cr.mid) ? cr.mid : 10000000000);
        }, 1000000000);
    }

    if (!(this.maxValue >= this.minValue)) {
        this.maxValue = 0;
        this.minValue = 0;
    }

    if (this.maxValue == this.minValue) this.maxValue += this.maxSegment * 2;

    if (this.ranges && this.ranges.length > 0 && this.ranges[0].mid === undefined && this.ranges[0].normal === undefined && this.showInlineValue) {
        this.addClass('show-inline-value');
    }

    this.$note = this._createNote().addTo(this);

    var btSgmt = calBeautySegment(this.maxSegment, this.minValue, this.maxValue);
    this.oySegmentCount = btSgmt.segmentCount;
    this.oyMinValue = btSgmt.minValue;
    this.oyMaxValue = btSgmt.maxValue;
    this.extendOY = !!(this.zeroOY && (this.oyMinValue > 0));
    this.oyStep = btSgmt.step;
    this.$oyValues = this._createOyValues(this.oyMinValue, this.oyStep, this.oySegmentCount, this.extendOY)
        .addTo(this);

    this.$oyName = text(this.valueName || '', 0, 0, 'base-chart-oxy-text').addTo(this);
    this.$oxName = text(this.keyName || '', 0, 0, 'base-chart-oxy-text').addTo(this);


    this.$rangeNotes = this.ranges.map(function (range) {
        return this._createRangeNote(range).addTo(this.$content);
    }.bind(this));


    this.$title = text(this.title || '', 0, 19, 'base-chart-title').attr('text-anchor', 'middle').addTo(this);

    this.$scrollArrows = this._createScrollArrow()
        .addTo(this)
        .on('pressleft', this.eventHandler.scrollArrowsPressLeft)
        .on('pressright', this.eventHandler.scrollArrowsPressRight);

    this.$oySegmentLines = this._createOYSegmentLines(this.oySegmentCount + (this.extendOY ? 1 : 0)).addTo(this);
};


// RangeChart.prototype.init = function (props) {
//     // this.valuePlotRadius = 6;
//     // this.maxText = 'Maximum';
//     // this.minText = 'Minimum';
//     // this.midText = 'Median';
//     // this.normalText = 'Normal';
//     // this.maxSegment = 12;
//     // props = props || {};
//     // this.super(props);
//     // if (!this.ranges || this.ranges.length <= 0) {
//     //     console.warn("Empty data!");
//     //     return;
//     // }
//     // this.initComp();
//     // this.sync = this.sync.then(this.update.bind(this));
// }


// RangeChart.property.scrollLeft = {
//     set: function (value) {
//         this._scrollLeft = value || 0;
//         this.$content.attr('transform', 'translate(' + (this.oxyLeft - this.scrollLeft) + ',' + this.oxyBottom + ')');
//         if (this.scrollLeft > 0.001) {
//             this.$scrollArrows.$leftArrow.removeStyle('display');
//         }
//         else {
//             this.$scrollArrows.$leftArrow.addStyle('display', 'none');
//         }
//
//         if (this.oxSegmentLength * this.ranges.length - this.oxLength > this.scrollLeft + 0.001) {
//             this.$scrollArrows.$rightArrow.removeStyle('display');
//         }
//         else {
//             this.$scrollArrows.$rightArrow.addStyle('display', 'none');
//         }
//     },
//     get: function () {
//         return this._scrollLeft || 0;
//     }
// };
//
// RangeChart.property.overflowOX = {
//     get: function () {
//         return Math.max(0, this.oxSegmentLength * this.ranges.length - this.oxLength);
//     }
// };

Vcore.install(RangeChart);
Vcore.install('ostickchart', function () {
    return _('rangechart.base-chart.o-stick-chart', true);
});
