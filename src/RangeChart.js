import './style/rangechart.css';
import Vcore from "./VCore";
import {
    hline,
    vline,
    circle,
    text,
    isNumber,
    moveHLine,
    moveVLine,
    calBeautySegment,
    map,
    wrapToLines,
    rect
} from "./helper";
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
    this.valuePlotRadius = 10;
    this.minKeyWidth = 90;
    this.maxKeyWidthRatio = 1.5;
    this.limitLineLength = 40;
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
    this.ranges.some(function (range) {
        if (isNumber(range.min) && isNumber(range.max)) {
            if (range.min > range.max) {
                console.error(range, "Violation: min > max");
                return true;
            }
            else {
                if (isNumber(range.mid)) {
                    if (range.mid < range.min || range.mid > range.max) {
                        console.error(range, "Violation: mid < min or mid > max");
                        return true;
                    }
                }
            }
        }
        return false;
    });
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
    var res = false;
    var segment = calBeautySegment(Math.floor(this.$axisCtn.box.height / 50), this.computedData.min, this.computedData.max, this.integerOnly);
    if (segment && segment.segmentCount < 30) {//error
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
            res = true;
        }
    }
    this.computedData.oySegmentLength = this.$axisCtn.box.height / segment.segmentCount;
    return res;
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
    if (!this.style.getPropertyValue('--vc-require-width')) {
        this.addStyle('--vc-require-width', this.$axisCtn.box.x + this.contentPadding + this.$keyName.getBBox().width + 50 + 'px');
        this.addStyle('--vc-require-height', this.box.height - this.$axisCtn.box.height + this.contentPadding * 2 +
              this.$title.getBBox().height + 60 + 'px');
    };
};

RangeChart.prototype.updateAxisY = function () {
    this.$axis.resize(this.$axisCtn.box.width + this.computedData.keyNameWidth, this.$axisCtn.box.height + 10);
    this.$valueName.attr('y', -this.$axisCtn.box.height - 22);

    this.$whiteMask.attr('d',
        'M' + (-this.$axisCtn.box.x - this.$body.box.x - 1) + ' ' + (-this.$axisCtn.box.y - this.$body.box.y)
        + ' h' + (this.box.width + 2)
        + 'v' + (this.box.height)
        + 'h' + (-this.box.width - 2)
        + 'z'
        + 'M0 ' + (-this.$axisCtn.box.height - 10)
        + 'h ' + (this.$axisCtn.box.width) +
        'v' + (this.$axisCtn.box.height + this.$oxTable.box.height + 10) + ' H 0z'
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
    var ctn = this.$rangeCtn;
    ctn.clearChild();
    this.$ranges = this.ranges.map(function (range) {
        return this._createRange(range).addTo(ctn);
    }.bind(this));
};

RangeChart.prototype.updateRangesPosition = function () {
    var colWidth = this.computedData.collWidth;
    var thisC = this;
    this.$ranges.forEach(function (rangeElt, i) {
        var range = thisC.ranges[i];
        rangeElt.box.x = colWidth * (i + 0.5);
        var yMin, yMax, yMid, yNormal;
        if (isNumber(range.min) && rangeElt.$minLine) {
            yMin = -thisC.mapOYValue(range.min);
            moveHLine(rangeElt.$minLine, -thisC.limitLineLength / 2, yMin, thisC.limitLineLength);
        }

        if (isNumber(range.max) && rangeElt.$maxLine) {
            yMax = -thisC.mapOYValue(range.max);
            moveHLine(rangeElt.$maxLine, -thisC.limitLineLength / 2, yMax, thisC.limitLineLength)
        }
        if (isNumber(range.mid) && rangeElt.$midLine) {
            yMid = -thisC.mapOYValue(range.mid);
            moveHLine(rangeElt.$midLine, -thisC.limitLineLength / 2, yMid, thisC.limitLineLength)
        }

        if (isNumber(range.normal) && rangeElt.$plot) {
            yNormal = -thisC.mapOYValue(range.normal);
            rangeElt.$plot.attr('cy', yNormal);
        }
        if (isNumber(range.min) && isNumber(range.max)) {
            rangeElt.$rect.attr({
                x: -thisC.limitLineLength / 2,
                y: yMax,
                height: yMin - yMax,
                width: thisC.limitLineLength
            })
        }
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
    if (isNumber(range.max) && isNumber(range.min))
        res.$rect = _('rect.vc-range-rect').addTo(res);
    if (isNumber(range.max))
        res.$maxLine = this._createLimitLine(-this.limitLineLength / 2, 0, this.limitLineLength, 'max').addTo(res);
    if (isNumber(range.mid))
        res.$midLine = this._createLimitLine(-this.limitLineLength / 2, 0, this.limitLineLength, 'mid').addTo(res);
    if (isNumber(range.min))
        res.$minLine = this._createLimitLine(-this.limitLineLength / 2, 0, this.limitLineLength, 'min').addTo(res);
    if (isNumber(range.normal))
        res.$plot = circle(0, 0, this.valuePlotRadius, 'range-chart-value-plot').addTo(res);

    return res;
};


Vcore.install(RangeChart);
Vcore.install('ostickchart', function () {
    return _('rangechart.base-chart.o-stick-chart', true);
});
