vchart.creator.basechart = function () {
    var _ = vchart._;
    var $ = vchart.$;
    var suffix = (Math.random() + '').replace(/\./g, '');
    var res = _({
        tag: 'svg',
        class: 'base-chart',
        child: [
            'axis',
            {
                tag: 'mask',
                attr: { id: 'contentMask' + suffix },
                child: '<rect id="maskRect" x="0" y="0" width="1800" height="1024" fill="white" />'

            },
            {
                tag: 'g',
                attr: {
                    id: 'contentBox',
                    mask: 'url(#contentMask' + suffix + ')'
                },
                child: 'g#content'
            }
        ]
    });
    res.sync = res.afterAttached();
    res.$axis = $('axis', res);
    res.$maskRect = $('rect#maskRect', res);
    res.$content = $('g#content', res);
    res.eventHandler = absol.OOP.bindFunctions(res, vchart.creator.basechart.eventHandler);
    res.on('wheel', res.eventHandler.wheel);

    return res;
};



vchart.creator.basechart.eventHandler = {};
vchart.creator.basechart.eventHandler.wheel = function (event) {
    var d = this.scrollBy(event.deltaY);
    if (d != 0) {
        event.preventDefault();
    }
};

vchart.creator.basechart.eventHandler.scrollArrowsPressLeft = function (event) {
    this.scrollBy(-60);
};

vchart.creator.basechart.eventHandler.scrollArrowsPressRight = function (event) {
    this.scrollBy(60);
};


vchart.creator.basechart.prototype.scrollBy = function (dX) {
    var scrollLeft = this.scrollLeft + dX / 5;
    var scrollLeft = Math.max(0, Math.min(this.oxContentLength - this.oxLength, scrollLeft));
    var deltaX = scrollLeft - this.scrollLeft;
    if (deltaX != 0) {
        this.scrollLeft = scrollLeft;
    }
    return deltaX;
};



vchart.creator.basechart.prototype._createOyValues = function (minValue, step, segmentCout, extendOY) {
    var child = Array(segmentCout + 1 + (extendOY ? 1 : 0)).fill(0).map(function (u, i) {
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
                x: '-14',
                y: '0',
                'text-anchor': 'end'
            },
            props: {
                innerHTML: this.numberToString(value)
            }
        }
    }.bind(this));
    return vchart._({
        tag: 'g',
        child: child
    });
};


vchart.creator.basechart.prototype._createOYSegmentLines = function (n) {
    var _ = vchart._;
    var res = _({
        tag: 'g',
        child: Array(n).fill('path.vchart-segment-line')
    });
    return res;
};



vchart.creator.basechart.prototype.numberToString = function (value) {
    return value.toString();
};

vchart.creator.basechart.prototype.mapOYValue = function (val) {
    return -this.paddingnAxisBottom + (this.extendOY ? -this.oySegmentLength : 0) - Math.map(val, this.oyMinValue, this.oyMaxValue, 0, this.oyLength - (this.extendOY ? this.oySegmentLength : 0));
};

vchart.creator.basechart.prototype.preInit = function () {

};

vchart.creator.basechart.prototype.updateSize = function () {
    this.attr({ width: this.canvasWidth + '', height: this.canvasHeight + '', viewBox: [0, 0, this.canvasWidth, this.canvasHeight].join(' ') });
};



vchart.creator.basechart.prototype.updateOyValues = function () {

    this.oyLength = this.oxyBottom - 70 - this.paddingnAxisBottom;
    this.oySegmentLength = this.oyLength / (this.oySegmentCount + (this.extendOY ? 1 : 0));
    Array.prototype.forEach.call(this.$oyValues.childNodes, function (e, i) {
        e.attr({
            y: -i * this.oySegmentLength + 5 - this.paddingnAxisBottom,
            x: - 10
        });
    }.bind(this));

    var oyValuesBox = this.$oyValues.getBBox();
    this.oxyLeft = Math.max(this.oxyLeft, oyValuesBox.width + 14, this.$oyName.getBBox().width);
    this.oxLength = this.canvasWidth - this.oxyLeft - 24;
    this.$oyValues.attr('transform', 'translate(' + this.oxyLeft + ',' + this.oxyBottom + ')');
};

vchart.creator.basechart.prototype.updateOYSegmentLines = function () {
    this.$oySegmentLines.attr('transform', 'translate(' + this.oxyLeft + ',' + this.oxyBottom + ')');
    Array.prototype.forEach.call(this.$oySegmentLines.childNodes, function (e, i) {
        vchart.moveHLine(e, -2, -i * this.oySegmentLength - this.paddingnAxisBottom, 4);
    }.bind(this));
};


vchart.creator.basechart.prototype.updateBackComp = function () {
    this.$title.attr('x', this.canvasWidth / 2);
    this.updateOyValues();
    this.updateOYSegmentLines();

};



vchart.creator.basechart.prototype.updateAxis = function () {
    this.$axis.attr('transform', vchart.tl.translate(this.oxyLeft, this.oxyBottom));
    this.$axis.resize(this.canvasWidth - this.oxyLeft - 10, this.oxyBottom - 50);
    this.$oyName.attr({
        x: this.oxyLeft,
        y: 30,
        'text-anchor': 'end'
    });
    this.$maskRect.attr({
        x: this.oxyLeft,
        y: 10,
        height: this.canvasHeight - 10,
        width: this.canvasWidth - 10 - this.oxyLeft,
    });

    this.$content.attr('transform', 'translate(' + this.oxyLeft + ',' + this.oxyBottom + ')');
    this.$oxName.attr({ x: this.canvasWidth - this.$oxName.getBBox().width - 3, y: this.oxyBottom - 9 });
};

vchart.creator.basechart.prototype.updateFrontComp = function () { };
vchart.creator.basechart.prototype.updateComp = function () { };

vchart.creator.basechart.prototype.updateScrollArrows = function () {
    this.$scrollArrows.attr('transform', 'translate(' + (this.oxyLeft + 7) + ', ' + (this.oxyBottom - this.oyLength / 2) + ')');
    this.$scrollArrows.$rightArrow.attr('transform', 'translate(' + (this.oxLength - 15) + ', 0)');
    this.scrollLeft = this.scrollLeft;//update
};
vchart.creator.basechart.prototype.update = function () {
    if (typeof this.canvasWidth != 'number') {
        this.canvasWidth = 300;
        this.autoWidth = true;
    }
    this.updateSize();
    this.updateBackComp();
    this.updateAxis();
    this.updateComp();
    this.updateScrollArrows();
    this.updateFrontComp();
    requestAnimationFrame(function () {
        if (this.autoWidth) {
            var requireWidth = this.canvasWidth + this.overflowOX;
            var proviceWidth = this.parentElement.getBoundingClientRect().width;
            this.canvasWidth = Math.max(Math.min(requireWidth, proviceWidth), 300);
            this.autoWidth = false;
            this.update();
            console.log(this);
        }
    }.bind(this));
};


vchart.creator.basechart.prototype.initScroll = function () {
    this.$scrollArrows = vchart._('scrollarrow')
        .addTo(this)
        .on('pressleft', this.eventHandler.scrollArrowsPressLeft)
        .on('pressright', this.eventHandler.scrollArrowsPressRight);
};


vchart.creator.basechart.prototype.preInit = function () {
    this.canvasWidth = 900;
    this.canvasHeight = 600;
    this.paddingnAxisBottom = 0;
    this.maxSegment = 9;
    this.oyMaxValue = 10;
    this.oyMinValue = 0;
    this.valueName = '';
    this.keyName = '';
};


vchart.creator.basechart.prototype.processMinMax = function () {
    this.minValue = 0;
    this.maxValue = 10;
};

vchart.creator.basechart.prototype.beautifyMinMax = function () {
    if (this.maxValue == this.minValue) this.maxValue += this.maxSegment;

    var btSgmt = vchart.calBeautySegment(this.maxSegment, this.minValue, this.maxValue);

    this.oySegmentCount = btSgmt.segmentCout;
    this.oyMinValue = btSgmt.minValue;
    this.oyMaxValue = btSgmt.maxValue;
    this.extendOY = !!(this.zeroOY && (this.oyMinValue > 0));
    this.oyStep = btSgmt.step;
    this.oxyLeft = 20;
    this.oxyBottom = this.canvasHeight - 40;

};




vchart.creator.basechart.prototype.initBackComp = function () {

    this.$oyValues = this._createOyValues(this.oyMinValue, this.oyStep, this.oySegmentCount, this.extendOY)
        .addTo(this);

    this.$oySegmentLines = this._createOYSegmentLines(this.oySegmentCount + 1 + (this.extendOY ? 1 : 0)).addTo(this);

    this.$title = vchart.text(this.title, 0, 19, 'base-chart-title').attr('text-anchor', 'middle').addTo(this);

    this.$oyName = vchart.text(this.valueName || '', 0, 0, 'base-chart-oxy-text').addTo(this);
    this.$oxName = vchart.text(this.keyName || '', 0, 0, 'base-chart-oxy-text').addTo(this);

};

vchart.creator.basechart.prototype.initComp = function () { };
vchart.creator.basechart.prototype.initFrontComp = function () { };

vchart.creator.basechart.prototype.initScroll = function () {
    this.$scrollArrows = vchart._('scrollarrow')
        .addTo(this)
        .on('pressleft', this.eventHandler.scrollArrowsPressLeft)
        .on('pressright', this.eventHandler.scrollArrowsPressRight);
};



vchart.creator.basechart.prototype.init = function (props) {
    this.preInit();
    this.super(props);
    this.processMinMax();
    this.beautifyMinMax();
    this.initBackComp();
    this.initComp();
    this.initFrontComp();
    this.initScroll();
    this.sync = this.sync.then(this.update.bind(this));
};



vchart.creator.basechart.property = {};


vchart.creator.basechart.property.scrollLeft = {
    set: function (value) {
        this._scrollLeft = value || 0;
        this.$content.attr('transform', 'translate(' + (this.oxyLeft - this.scrollLeft) + ',' + this.oxyBottom + ')');
        if (this.scrollLeft > 0.001) {
            this.$scrollArrows.$leftArrow.removeStyle('display');
        }
        else {
            this.$scrollArrows.$leftArrow.addStyle('display', 'none');
        }

        if (this.oxContentLength - this.oxLength > this.scrollLeft + 0.001) {
            this.$scrollArrows.$rightArrow.removeStyle('display');
        }
        else {
            this.$scrollArrows.$rightArrow.addStyle('display', 'none');
        }
    },
    get: function () {
        return this._scrollLeft || 0;
    }
};

vchart.creator.basechart.property.overflowOX = {
    get: function () {
        return Math.max(0, this.oxContentLength - this.oxLength);
    }
};

vchart.creator.basechart.property.showInlineValue = {
    set: function (value) {
        if (value) {
            this.addClass('vchart-show-inline-value');
        }
        else {
            this.removeClass('vchart-show-inline-value');
        }
    },
    get: function () {
        return this.containsClass('vchart-show-inline-value');
    }
};
