
//////////////////////////////////////////////////////////
//     RANGE PLOT CHART                                 //
//////////////////////////////////////////////////////////


vchart.creator.rangechart = function () {
    var _ = vchart._;
    var $ = vchart.$;
    var suffix = (Math.random() + '').replace(/\./g, '');
    var res = _({
        tag: 'svg',
        class: 'range-chart',
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

    res.sync = res.afterAttached(500);
    res.$axis = $('axis', res);
    res.$maskRect = $('rect#maskRect', res);
    res.$content = $('g#content', res);
    res.eventHandler = absol.OOP.bindFunctions(res, vchart.creator.rangechart.eventHandler);
    res.on('wheel', res.eventHandler.wheel);

    return res;
};




vchart.creator.rangechart.eventHandler = {};
vchart.creator.rangechart.eventHandler.wheel = function (event) {
    var d = this.scrollBy(event.deltaY);
    if (d != 0) {
        event.preventDefault();
    }
};

vchart.creator.rangechart.eventHandler.scrollArrowsPressLeft = function (event) {
    this.scrollBy(-60);
};

vchart.creator.rangechart.eventHandler.scrollArrowsPressRight = function (event) {
    this.scrollBy(60);
};

vchart.creator.rangechart.prototype.scrollBy = function (dX) {
    var scrollLeft = this.scrollLeft + dX / 5;
    var scrollLeft = Math.max(0, Math.min(this.oxSegmentLength * this.ranges.length - this.oxLength, scrollLeft));
    var deltaX = scrollLeft - this.scrollLeft;
    if (deltaX != 0) {
        this.scrollLeft = scrollLeft;
    }
    return deltaX;
};




vchart.creator.rangechart.prototype._createLimitLine = function (x, y, length, eClss) {
    return vchart.hline(x, y, length, ['range-chart-limit-line'].concat(eClss ? [eClss] : []))
};

vchart.creator.rangechart.prototype.numberToString = function (value) {
    return value.toString();
};

vchart.creator.rangechart.prototype._relocalVLine = function (e, x, y, length) {
    e.attr('d', 'm' + x + ' ' + y + 'h' + length);
};



vchart.creator.rangechart.prototype._createRange = function (range) {
    var _ = vchart._;
    var res = _('g');
    res.$rangeLine = vchart.vline(0, 0, -1, 'range-chart-range-line').addTo(res);
    res.$dashLine = vchart.vline(0, 0, 0, 'range-chart-range-line').attr('stroke-dasharray', '2').addTo(res);
    res.$maxLine = this._createLimitLine(-this.limitLineLength / 2, 0, this.limitLineLength, 'max').addTo(res);
    res.$midLine = this._createLimitLine(-this.limitLineLength / 2, 0, this.limitLineLength, 'mid').addTo(res);
    res.$minLine = this._createLimitLine(-this.limitLineLength / 2, 0, this.limitLineLength, 'min').addTo(res);
    res.$plot = vchart.circle(0, 0, this.valuePlotRadius, 'range-chart-value-plot').addTo(res);
    res.$maxText = vchart.text(this.numberToString(range.max), 0, 0, 'range-chart-inline-value').attr('text-anchor', 'middle').addTo(res);
    res.$minText = vchart.text(this.numberToString(range.min), 0, 0, 'range-chart-inline-value').attr('text-anchor', 'middle').addTo(res);
    return res;
};

vchart.creator.rangechart.prototype._createScrollArrow = function () {
    var _ = vchart._;
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



vchart.creator.rangechart.prototype._createRangeNote = function (range) {

    var _ = vchart._;
    var res = _('g');
    var y0 = 0;
    vchart.text(range.name, 0, y0).addStyle('text-anchor', 'middle').addTo(res);
    y0 += 30;
    vchart.text(this.numberToString(range.max), 0, y0, 'range-char-note-value').addTo(res);
    y0 += 30;
    if (this.ranges[0].mid !== undefined) {
        vchart.text(this.numberToString(range.mid), 0, y0, 'range-char-note-value').addTo(res);
        y0 += 30;
    }

    vchart.text(this.numberToString(range.min), 0, y0, 'range-char-note-value').addTo(res);
    y0 += 30;

    if (this.ranges[0].normal !== undefined)
        vchart.text(this.numberToString(range.normal), 0, y0, 'range-char-note-value').addTo(res);

    return res;
};

vchart.creator.rangechart.prototype._createOYSegmentLines = function (n) {
    var _ = vchart._;
    var res = _({
        tag: 'g',
        child: Array(n).fill('path.vchart-segment-line')
    });
    return res;
}


vchart.creator.rangechart.prototype._createNote = function () {
    var _ = vchart._;
    var $ = vchart.$;
    var res = _('g.range-chart-note');

    var y0 = 12;
    res.$maxLine = this._createLimitLine(0, y0, this.limitLineLength, 'max').addTo(res);
    res.$maxText = vchart.text(this.maxText, 50, y0 + 5).addTo(res);
    y0 += 30;
    if (this.ranges[0].mid != undefined) {
        this._createLimitLine(0, y0, this.limitLineLength, 'mid').addTo(res);
        vchart.text(this.midText, 50, y0 + 5).addTo(res);
        y0 += 30;
    }
    res.$minLine = this._createLimitLine(0, y0, this.limitLineLength, 'min').addTo(res);
    res.$minText = vchart.text(this.minText, 50, y0 + 5).addTo(res);
    y0 += 30;
    if (this.ranges[0].normal !== undefined) {
        vchart.circle(this.limitLineLength / 2, y0, this.valuePlotRadius, 'range-chart-value-plot').addTo(res);
        vchart.text(this.normalText, 50, y0 + 5).addTo(res);
    }

    return res;
};

vchart.creator.rangechart.prototype._createOyValues = function (minValue, step, segmentCout, extendOY) {
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
                x: '0',
                y: '0'
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



vchart.creator.rangechart.prototype.updateSize = function () {
    this.attr({ width: this.canvasWidth + '', height: this.canvasHeight + '', viewBox: [0, 0, this.canvasWidth, this.canvasHeight].join(' ') });
    this.$title.attr('x', this.canvasWidth / 2);
};

vchart.creator.rangechart.prototype.updateNote = function () {
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
    this.oxyBottom = this.notePositionTop - 30;
};


vchart.creator.rangechart.prototype.updateOyValues = function () {

    this.oyLength = this.oxyBottom - 70;
    this.oySegmentLength = this.oyLength / (this.oySegmentCount + (this.extendOY ? 1 : 0));
    Array.prototype.forEach.call(this.$oyValues.childNodes, function (e, i) {
        var eBBox = e.getBBox();
        e.attr({
            y: -i * this.oySegmentLength + 5,
            x: - eBBox.width - 10
        });
    }.bind(this));

    var oyValuesBox = this.$oyValues.getBBox();
    this.oxyLeft = Math.max(this.oxyLeft, oyValuesBox.width + 14);
    this.oxLength = this.canvasWidth - this.oxyLeft - 24;
    this.oxSegmentLength = this.oxLength / (this.ranges.length);
    this.$oyValues.attr('transform', 'translate(' + this.oxyLeft + ',' + this.oxyBottom + ')');
};

vchart.creator.rangechart.prototype.updateAxis = function () {
    this.$axis.moveTo(this.oxyLeft, this.oxyBottom);
    this.$axis.resize(this.oxLength + 14, this.oyLength + 14);
    this.$maskRect.attr({
        x: this.oxyLeft,
        y: 10,
        height: this.canvasHeight - 10,
        width: this.canvasWidth - this.oxyLeft,
    });

    this.$content.attr('transform', 'translate(' + this.oxyLeft + ',' + this.oxyBottom + ')');
    this.$oyName.attr({ x: this.oxyLeft - this.$oyName.getBBox().width / 2, y: 40 });
    this.$oxName.attr({ x: this.canvasWidth - this.$oxName.getBBox().width - 3, y: this.oxyBottom - 9 });
};

vchart.creator.rangechart.prototype.updateRangeNotes = function () {

    var requireOxSegmentLenth = this.$rangeNotes.reduce(function (ac, cr) {
        return Math.max(ac, cr.getBBox().width);
    }, 0) + 20;

    this.oxSegmentLength = Math.max(this.oxSegmentLength, requireOxSegmentLenth);


    this.$rangeNotes.forEach(function (e, i) {
        e.attr('transform',
            'translate(' + (i * this.oxSegmentLength + this.oxSegmentLength / 2) + ', ' + (this.notePositionTop - 13 - this.oxyBottom) + ')');


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

vchart.creator.rangechart.prototype._calYOfValue = function (val) {
    return (this.extendOY ? -this.oySegmentLength : 0) - Math.map(val, this.oyMinValue, this.oyMaxValue, 0, this.oyLength - (this.extendOY ? this.oySegmentLength : 0));
}

vchart.creator.rangechart.prototype.updateRanges = function () {
    this.$ranges.forEach(function (e, i) {
        var range = this.ranges[i];
        e.attr('transform', 'translate(' + this.oxSegmentLength * (i + 0.5) + ',' + 0 + ')');
        if (range.normal === undefined) {
            e.$plot.addStyle('display', 'none');
        }
        else {
            e.$plot.removeStyle('display');
            e.$plot.attr('cy', this._calYOfValue(range.normal) + '');
        }
        vchart.moveHLine(e.$maxLine,
            -this.limitLineLength / 2,
            this._calYOfValue(range.max), this.limitLineLength);
        e.$maxText.attr('y', this._calYOfValue(range.max) - 5);


        vchart.moveHLine(e.$minLine,
            -this.limitLineLength / 2,
            this._calYOfValue(range.min), this.limitLineLength);
        e.$minText.attr('y', this._calYOfValue(range.min) + 15);

        if (range.mid === undefined) {
            e.$midLine.attr('display', 'none');
        }
        else {
            e.$midLine.removeStyle('display');
            vchart.moveHLine(e.$midLine,
                -this.limitLineLength / 2,
                this._calYOfValue(range.mid), this.limitLineLength);
        }


        vchart.moveVLine(e.$rangeLine,
            0, this._calYOfValue((range.min)),
            -Math.map(range.max - range.min, 0, this.oyMaxValue - this.oyMinValue, 0, this.oyLength - (this.extendOY ? this.oySegmentLength : 0))
        );


        if (range.mid > range.max) {
            e.$rangeLine.removeStyle('display');
            vchart.moveVLine(e.$dashLine,
                0, this._calYOfValue((range.mid)),
                -Math.map(range.max - range.mid, 0, this.oyMaxValue - this.oyMinValue, 0, this.oyLength - (this.extendOY ? this.oySegmentLength : 0))
            );
        } else if (range.mid < range.min) {
            e.$rangeLine.removeStyle('display');
            vchart.moveVLine(e.$dashLine,
                0, this._calYOfValue((range.mid)),
                -Math.map(range.min - range.mid, 0, this.oyMaxValue - this.oyMinValue, 0, this.oyLength - (this.extendOY ? this.oySegmentLength : 0))
            );

        } else {
            e.$rangeLine.removeStyle('display', 'none');
        }

    }.bind(this));
};

vchart.creator.rangechart.prototype.updateScrollArrows = function () {
    this.$scrollArrows.attr('transform', 'translate(' + (this.oxyLeft + 7) + ', ' + (this.oxyBottom - this.oyLength / 2) + ')');
    this.$scrollArrows.$rightArrow.attr('transform', 'translate(' + (this.oxLength - 15) + ', 0)');
    this.scrollLeft = this.scrollLeft;//update
};


vchart.creator.rangechart.prototype.updateOYSegmentLines = function () {

    this.$oySegmentLines.attr('transform', 'translate(' + this.oxyLeft + ',' + this.oxyBottom + ')');
    Array.prototype.forEach.call(this.$oySegmentLines.childNodes, function (e, i) {
        vchart.moveHLine(e, -2, -(i + 1) * this.oySegmentLength, 4);

    }.bind(this));
};


vchart.creator.rangechart.prototype.update = function () {
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


vchart.creator.rangechart.prototype.initComp = function () {
    if (this.maxValue == 'auto' || this.maxValue === undefined) {
        this.maxValue = this.ranges.reduce(function (ac, cr) {
            return Math.max(ac, cr.max,
                cr.normal === undefined ? -10000000000 : cr.normal,
                cr.mid === undefined ? -10000000000 : cr.mid);
        }, -1000000000);
    }
    if (this.minValue == 'auto' || this.minValue === undefined) {
        this.minValue = this.ranges.reduce(function (ac, cr) {
            return Math.min(ac, cr.min, cr.normal === undefined ? 10000000000 : cr.normal,
                cr.mid === undefined ? 10000000000 : cr.mid);
        }, 1000000000);
    }

    if (this.maxValue == this.minValue) this.maxValue += this.maxSegment * 2;

    if (this.ranges && this.ranges.length > 0 && this.ranges[0].mid === undefined && this.ranges[0].normal === undefined && this.showInlineValue) {
        this.addClass('show-inline-value');
    }

    this.$note = this._createNote().addTo(this);

    var btSgmt = vchart.calBeautySegment(this.maxSegment, this.minValue, this.maxValue);
    this.oySegmentCount = btSgmt.segmentCout;
    this.oyMinValue = btSgmt.minValue;
    this.oyMaxValue = btSgmt.maxValue;
    this.extendOY = !!(this.zeroOY && (this.oyMinValue > 0));
    this.oyStep = btSgmt.step;
    this.$oyValues = this._createOyValues(this.oyMinValue, this.oyStep, this.oySegmentCount, this.extendOY)
        .addTo(this);

    this.$oyName = vchart.text(this.valueName || '', 0, 0, 'base-chart-oxy-text').addTo(this);
    this.$oxName = vchart.text(this.keyName || '', 0, 0, 'base-chart-oxy-text').addTo(this);


    this.$rangeNotes = this.ranges.map(function (range) {
        return this._createRangeNote(range).addTo(this.$content);
    }.bind(this));

    this.$ranges = this.ranges.map(function (range) {
        return this._createRange(range).addTo(this.$content);
    }.bind(this));


    this.$title = vchart.text(this.title, 0, 19, 'base-chart-title').attr('text-anchor', 'middle').addTo(this);

    this.$scrollArrows = this._createScrollArrow()
        .addTo(this)
        .on('pressleft', this.eventHandler.scrollArrowsPressLeft)
        .on('pressright', this.eventHandler.scrollArrowsPressRight);

    this.$oySegmentLines = this._createOYSegmentLines(this.oySegmentCount + (this.extendOY ? 1 : 0)).addTo(this);
};



vchart.creator.rangechart.prototype.init = function (props) {
    this.valuePlotRadius = 6;
    this.limitLineLength = 20;
    this.maxText = 'Maximum';
    this.minText = 'Minimum';
    this.midText = 'Median';
    this.normalText = 'Normal';
    this.maxSegment = 12;
    props = props || {};
    this.super(props);
    if (!this.ranges || this.ranges.length <= 0) {
        console.warn("Empty data!");
        return;
    }
    this.initComp();
    this.sync = this.sync.then(this.update.bind(this));
}


vchart.creator.rangechart.property = {};

vchart.creator.rangechart.property.scrollLeft = {
    set: function (value) {
        this._scrollLeft = value || 0;
        this.$content.attr('transform', 'translate(' + (this.oxyLeft - this.scrollLeft) + ',' + this.oxyBottom + ')');
        if (this.scrollLeft > 0.001) {
            this.$scrollArrows.$leftArrow.removeStyle('display');
        }
        else {
            this.$scrollArrows.$leftArrow.addStyle('display', 'none');
        }

        if (this.oxSegmentLength * this.ranges.length - this.oxLength > this.scrollLeft + 0.001) {
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

vchart.creator.rangechart.property.overflowOX = {
    get: function () {
        return Math.max(0, this.oxSegmentLength * this.ranges.length - this.oxLength);
    }
};


vchart.creator.ostickchart = function () {
    return vchart._('rangechart.o-stick-chart', false);
};