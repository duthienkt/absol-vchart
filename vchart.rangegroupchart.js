vchart.creator.rangegroupchart = function () {
    var _ = vchart._;

    var res = _('basechart', true);

    return res;
};



vchart.creator.rangegroupchart.prototype._createNote = function () {
    var res = vchart._('g');
    res.$maxLine = vchart.hline(0, 7, 40, ['range-group-chart-limit-line', 'max']).addTo(res);
    res.$maxText = vchart.text(this.maxText, 50, 12).addTo(res);

    res.$minLine = vchart.hline(200, 7, 40, ['range-group-chart-limit-line', 'min']).addTo(res);
    res.$minText = vchart.text(this.minText, 250, 12).addTo(res);


    return res;
};


vchart.creator.rangegroupchart.prototype._createMember = function (member) {
    var res = vchart._('g');
    res.$plot = vchart.circle(this.plotRadius, 0, this.plotRadius, 'range-group-chart-plot').addTo(res);
    res.$value = vchart.text(this.numberToString(member.value), this.plotRadius * 2 + 8, 5).addTo(res);
    res.$nameContainer = vchart._('g').addTo(res).attr('transform', 'rotate(45)');
    res.$name = vchart.text(member.name, this.plotRadius, 10).addTo(res.$nameContainer);
    return res;
};

vchart.creator.rangegroupchart.prototype._createRange = function (range) {
    var res = vchart._('g');
    res.$lineLeft = vchart.hline(0, 0, 0, 'range-group-chart-range-line').addTo(res);
    res.$lineRight = vchart.hline(0, 0, 0, 'range-group-chart-range-line').addTo(res);
    res.$maxLine = vchart.hline(10, -this.paddingnAxisBottom, this.rangePaddingH * 2, ['range-group-chart-limit-line', 'max']).addTo(res);
    res.$minLine = vchart.hline(10, -this.paddingnAxisBottom, this.rangePaddingH * 2, ['range-group-chart-limit-line', 'min']).addTo(res);
    res.$max = vchart.text(this.numberToString(range.max), 0, 0).attr('text-anchor', 'middle').addTo(res);
    res.$min = vchart.text(this.numberToString(range.min), 0, 0).attr('text-anchor', 'middle').addTo(res);


    res.$members = range.members.map(function (member) {
        return this._createMember(member).addTo(res);
    }.bind(this));

    res.$name = vchart.text(range.name, 0, 0).attr('text-anchor', 'middle').addTo(res);

    return res;

};

vchart.creator.rangegroupchart.prototype.processMinMax = function () {
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

vchart.creator.rangegroupchart.prototype.preInit = function () {
    this.super();
    this.paddingnAxisBottom = 40;
    this.rangePaddingH = 10;
    this.plotRadius = 6;
    this.rangeMarginH = 10;
    this.memberMarginH = 5;
};


vchart.creator.rangegroupchart.prototype.initBackComp = function () {
    this.super();
    this.$note = this._createNote().addTo(this);
};

vchart.creator.rangegroupchart.prototype.updateBackComp = function () {

    var noteBBox = this.$note.getBBox();
    this.$note.attr('transform', vchart.tl.translate(0, this.canvasHeight - noteBBox.height - 5));

    var x = 50 + this.$note.$maxText.getBBox().width + 40;
    vchart.moveHLine(this.$note.$minLine, x, 7, 40);
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





vchart.creator.rangegroupchart.prototype.initComp = function () {
    this.$ranges = this.ranges.map(function (range) {
        return this._createRange(range).addTo(this.$content);
    }.bind(this));
};

vchart.creator.rangegroupchart.prototype.updateComp = function () {

    var memberWidth = this.$ranges.reduce(function (memberWidth, $range) {
        return $range.$members.reduce(function (memberWidth, $member) {
            return Math.max(memberWidth, $member.getBBox().width);
        }, memberWidth);
    }, 0);


    this.oxContentLength = this.$ranges.reduce(function (oxContentLength, $range, rangeIndex) {
        oxContentLength += this.rangeMarginH;
        range = this.ranges[rangeIndex];

        $range.attr('transform', vchart.tl.translate(oxContentLength, 0));

        var rangeWidth = $range.$members.reduce(function (rangeWidth, $member, memberIndex) {
            rangeWidth += this.memberMarginH;
            var member = range.members[memberIndex];

            $member.attr('transform', vchart.tl.translate(rangeWidth, 0));

            $member.$plot.attr('cy', this.mapOYValue(member.value));
            $member.$value.attr('y', this.mapOYValue(member.value) + 5);

            rangeWidth += memberWidth;

            rangeWidth += this.memberMarginH;

            return rangeWidth;
        }.bind(this), this.rangePaddingH) + this.rangePaddingH;

        vchart.moveHLine($range.$maxLine, 0, this.mapOYValue(range.max), rangeWidth);
        vchart.moveHLine($range.$minLine, 0, this.mapOYValue(range.min), rangeWidth);
        var rangeHeight = this.mapOYValue(range.max) - this.mapOYValue(range.min);
        vchart.moveVLine($range.$lineLeft, 0, this.mapOYValue(range.min), rangeHeight);
        vchart.moveVLine($range.$lineRight, rangeWidth, this.mapOYValue(range.min), rangeHeight);
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