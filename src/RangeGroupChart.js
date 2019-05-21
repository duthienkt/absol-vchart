import Vcore from "./VCore";
import { hline, text, circle, moveHLine, moveVLine } from "./helper";
import { translate } from "./template";
var _ = Vcore._;
var $ = Vcore.$;

function RangeGroupChart() {

    var res = _('basechart', true);

    return res;
};



RangeGroupChart.prototype._createNote = function () {
    var res = _('g');
    res.$maxLine = hline(0, 7, 40, ['range-group-chart-limit-line', 'max']).addTo(res);
    res.$maxText = text(this.maxText, 50, 12).addTo(res);

    res.$minLine = hline(200, 7, 40, ['range-group-chart-limit-line', 'min']).addTo(res);
    res.$minText = text(this.minText, 250, 12).addTo(res);


    return res;
};


RangeGroupChart.prototype._createMember = function (member) {
    var res = _('g');
    res.$plot = circle(this.plotRadius, 0, this.plotRadius, 'range-group-chart-plot').addTo(res);
    res.$value = text(this.numberToString(member.value), this.plotRadius * 2 + 8, 5).addTo(res);
    res.$nameContainer = _('g').addTo(res).attr('transform', 'rotate(45)');
    res.$name = text(member.name, this.plotRadius, 10).addTo(res.$nameContainer);
    return res;
};

RangeGroupChart.prototype._createRange = function (range) {
    var res = _('g');
    res.$lineLeft = hline(0, 0, 0, 'range-group-chart-range-line').addTo(res);
    res.$lineRight = hline(0, 0, 0, 'range-group-chart-range-line').addTo(res);
    res.$maxLine = hline(10, -this.paddingnAxisBottom, this.rangePaddingH * 2, ['range-group-chart-limit-line', 'max']).addTo(res);
    res.$minLine = hline(10, -this.paddingnAxisBottom, this.rangePaddingH * 2, ['range-group-chart-limit-line', 'min']).addTo(res);
    res.$max = text(this.numberToString(range.max), 0, 0).attr('text-anchor', 'middle').addTo(res);
    res.$min = text(this.numberToString(range.min), 0, 0).attr('text-anchor', 'middle').addTo(res);


    res.$members = range.members.map(function (member) {
        return this._createMember(member).addTo(res);
    }.bind(this));

    res.$name = text(range.name, 0, 0).attr('text-anchor', 'middle').addTo(res);

    return res;

};

RangeGroupChart.prototype.processMinMax = function () {
    this.super();
    this.maxValue = this.ranges.reduce(function (max, range) {
        return range.members.reduce(function (max, member, i) {
            return Math.max(max, member.value);
        }.bind(this), Math.max(max, range.max, range.normal));
    }.bind(this), -1000000000);

    this.minValue = this.ranges.reduce(function (min, range) {
        return range.members.reduce(function (min, member) {

            return Math.min(min, member.value);
        }.bind(this), Math.min(min, range.min, range.normal));
    }.bind(this), 1000000000);
};

RangeGroupChart.prototype.preInit = function () {
    this.super();
    this.paddingnAxisBottom = 40;
    this.rangePaddingH = 10;
    this.plotRadius = 6;
    this.rangeMarginH = 10;
    this.memberMarginH = 5;
};


RangeGroupChart.prototype.initBackComp = function () {
    this.super();
    this.$note = this._createNote().addTo(this);
};

RangeGroupChart.prototype.updateBackComp = function () {

    var noteBBox = this.$note.getBBox();
    this.$note.attr('transform', translate(0, this.canvasHeight - noteBBox.height - 5));

    var x = 50 + this.$note.$maxText.getBBox().width + 40;
    moveHLine(this.$note.$minLine, x, 7, 40);
    this.$note.$minText.attr('x', x + 50);


    this.oxyBottom = this.canvasHeight - noteBBox.height - 30;

    this.memberNameHeight = this.$ranges.reduce(function (memberHeight, $range) {
        return $range.$members.reduce(function (memberHeight, $member) {
            return Math.max(memberHeight, $member.$nameContainer.getBBox().width / 1.4);
        }, memberHeight);
    }, 0);

    this.oxyBottom -= this.memberNameHeight + 25;

    this.super();
};





RangeGroupChart.prototype.initComp = function () {
    this.$ranges = this.ranges.map(function (range) {
        return this._createRange(range).addTo(this.$content);
    }.bind(this));
};

RangeGroupChart.prototype.updateComp = function () {

    var memberWidth = this.$ranges.reduce(function (memberWidth, $range) {
        return $range.$members.reduce(function (memberWidth, $member) {
            return Math.max(memberWidth, $member.getBBox().width);
        }, memberWidth);
    }, 0);


    this.oxContentLength = this.$ranges.reduce(function (oxContentLength, $range, rangeIndex) {
        oxContentLength += this.rangeMarginH;
        var range = this.ranges[rangeIndex];

        $range.attr('transform', translate(oxContentLength, 0));

        var rangeWidth = $range.$members.reduce(function (rangeWidth, $member, memberIndex) {
            rangeWidth += this.memberMarginH;
            var member = range.members[memberIndex];

            $member.attr('transform', translate(rangeWidth, 0));

            $member.$plot.attr('cy', this.mapOYValue(member.value));
            $member.$value.attr('y', this.mapOYValue(member.value) + 5);

            rangeWidth += memberWidth;

            rangeWidth += this.memberMarginH;

            return rangeWidth;
        }.bind(this), this.rangePaddingH) + this.rangePaddingH;

        moveHLine($range.$maxLine, 0, this.mapOYValue(range.max), rangeWidth);
        moveHLine($range.$minLine, 0, this.mapOYValue(range.min), rangeWidth);
        var rangeHeight = this.mapOYValue(range.max) - this.mapOYValue(range.min);
        moveVLine($range.$lineLeft, 0, this.mapOYValue(range.min), rangeHeight);
        moveVLine($range.$lineRight, rangeWidth, this.mapOYValue(range.min), rangeHeight);
        $range.$name.attr({ x: rangeWidth / 2, y: this.memberNameHeight + 25 });

        oxContentLength += rangeWidth;

        $range.$max.attr({
            x: rangeWidth / 2,
            y: this.mapOYValue(range.max) - 5
        });

        $range.$min.attr({
            x: rangeWidth / 2,
            y: this.mapOYValue(range.min) + 15
        });


        oxContentLength += this.rangeMarginH;

        return oxContentLength;
    }.bind(this), 0);
};

Vcore.creator.rangegroupchart = RangeGroupChart;

export default RangeGroupChart;