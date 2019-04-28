vchart.creator.columnchart = function () {
    return vchart._('basechart.column-chart', true);
};


vchart.creator.columnchart.prototype._createColumn = function (value, i) {
    var res = vchart._('g.column-chart-column');
    res.$rect = vchart.rect(-this.columnWidth / 2, 0, this.columnWidth, 10).addTo(res);
    res.$value = vchart.text(this.numberToString(value) + '', 0, 0).attr('text-anchor', 'middle').addTo(res);
    return res;
};

vchart.creator.columnchart.prototype.processMinMax = function () {
    this.minValue = this.values.filter(vchart.lambda.isNumber).reduce(function (ac, cr) {
        return Math.min(ac, cr);
    }, 1000000000);

    this.maxValue = this.values.filter(vchart.lambda.isNumber).reduce(function (ac, cr) {
        return Math.max(ac, cr);
    }, -1000000000);
};

vchart.creator.columnchart.prototype.initBackComp = function () {
    this.super();
    this.$keys = this.keys.map(function (key) {
        return vchart.text(key, 0, 20).attr('text-anchor', 'middle').addTo(this.$content);
    }.bind(this));

};



vchart.creator.columnchart.prototype.updateBackComp = function () {
    this.super();
    this.oxSegmentLength = Math.max(this.columnWidth + this.columnMarginH * 2, this.oxLength / this.keys.length);

    this.oxSegmentLength = this.$keys.reduce(function (maxLength, $key) {
        return Math.max(maxLength, $key.getBBox().width + this.columnMarginH * 2)
    }.bind(this), this.oxSegmentLength);

    this.oxContentLength = this.oxSegmentLength * this.keys.length;
    this.$keys.forEach(function ($key, i) {
        $key.attr('x', (i + 0.5) * this.oxSegmentLength);
    }.bind(this));
};

vchart.creator.columnchart.prototype.initComp = function () {
    this.$columes = this.values.map(function (value, i) {
        return this._createColumn(value, i).addTo(this.$content);
    }.bind(this));

};

vchart.creator.columnchart.prototype.updateComp = function () {
    this.$columes.forEach(function ($colume, i) {
        if (vchart.lambda.isNumber(this.values[i])) {
            $colume.$rect.removeStyle('display');
            var height = - this.mapOYValue(this.values[i]);
            // x: (i + 0.5) * this.oxSegmentLength - this.columnWidth / 2
            $colume.$rect.attr({
                height: height,
                y: -height
            });
            $colume.$value.attr('y', -height - 4);
            $colume.attr({
                transform: vchart.tl.translate((i + 0.5) * this.oxSegmentLength, 0)
            });
        }
        else {
            $colume.$rect.addStyle('display', 'none');
        }

    }.bind(this));
};


vchart.creator.columnchart.prototype.preInit = function () {
    this.super();
    this.columnMarginH = 5;
    this.columnWidth = 25;
};


