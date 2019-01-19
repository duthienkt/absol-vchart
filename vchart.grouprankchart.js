vchart.creator.grouprankchart = function () {
    var _ = vchart._;
    var $ = vchart.$;
    var suffix = (Math.random() + '').replace(/\./g, '');
    var res = _({
        tag: 'svg',
        class: 'grank-chart',
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
    res.eventHandler = absol.OOP.bindFunctions(res, vchart.creator.grouprankchart.eventHandler);
    res.on('wheel', res.eventHandler.wheel);

    return res;
};



vchart.creator.grouprankchart.eventHandler = {};
vchart.creator.grouprankchart.eventHandler.wheel = function (event) {
    var d = this.scrollBy(event.deltaY);
    if (d != 0) {
        event.preventDefault();
    }
};

vchart.creator.grouprankchart.eventHandler.scrollArrowsPressLeft = function (event) {
    this.scrollBy(-60);
};

vchart.creator.grouprankchart.eventHandler.scrollArrowsPressRight = function (event) {
    this.scrollBy(60);
};

vchart.creator.grouprankchart.prototype.scrollBy = function (dX) {
    var scrollLeft = this.scrollLeft + dX / 5;
    var scrollLeft = Math.max(0, Math.min(this.oxContentLength - this.oxLength, scrollLeft));
    var deltaX = scrollLeft - this.scrollLeft;
    if (deltaX != 0) {
        this.scrollLeft = scrollLeft;
    }
    return deltaX;
};




vchart.creator.grouprankchart.prototype.numberToString = function (value) {
    return value.toString();
}

vchart.creator.grouprankchart.prototype._createMember = function (member) {
    var _ = vchart._;
    var res = _('g');
    res.$plot = vchart.circle(this.plotRadius, 0, this.plotRadius, 'grank-chart-plot').addTo(res);
    res.$name = vchart.text(member.name, this.plotRadius * 2 + 9, -3).addTo(res);
    res.$value = vchart.text('' + this.numberToString(member.value) + '', this.plotRadius * 2 + 9, 16).addTo(res);
    return res;
};



vchart.creator.grouprankchart.prototype._createOyValues = function (minValue, step, segmentCout, extendOY) {
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


vchart.creator.grouprankchart.prototype._createOYSegmentLines = function (n) {
    var _ = vchart._;
    var res = _({
        tag: 'g',
        child: Array(n).fill('path.vchart-segment-line')
    });
    return res;
};

vchart.creator.grouprankchart.prototype._createGroup = function (group) {
    return vchart._({
        tag: 'g',
        child: group.members.map(this._createMember.bind(this))
    });
};


vchart.creator.grouprankchart.prototype._callOYValue = function (val) {
    return -this.paddingnAxisBottom + (this.extendOY ? -this.oySegmentLength : 0) - Math.map(val, this.oyMinValue, this.oyMaxValue, 0, this.oyLength - (this.extendOY ? this.oySegmentLength : 0));
};




vchart.creator.grouprankchart.prototype.updateSize = function () {
    this.attr({ width: this.canvasWidth + '', height: this.canvasHeight + '', viewBox: [0, 0, this.canvasWidth, this.canvasHeight].join(' ') });
    this.$title.attr('x', this.canvasWidth / 2);
};


vchart.creator.grouprankchart.prototype.updateOyValues = function () {

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

vchart.creator.grouprankchart.prototype.updateAxis = function () {
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



vchart.creator.grouprankchart.prototype.updateOYSegmentLines = function () {
    this.$oySegmentLines.attr('transform', 'translate(' + this.oxyLeft + ',' + this.oxyBottom + ')');
    Array.prototype.forEach.call(this.$oySegmentLines.childNodes, function (e, i) {
        vchart.moveHLine(e, -2, -i * this.oySegmentLength - this.paddingnAxisBottom, 4);
    }.bind(this));
};



vchart.creator.grouprankchart.prototype.updateGroups = function () {
    this.oxContentLength = this.$groups.reduce(function (contentLength, ge, groupIndex) {
        var group = this.groups[groupIndex];
        contentLength = contentLength + 20;
        var maxDY = Array.prototype.reduce.call(ge.childNodes, function (maxDY, meme, j) {

            var member = group.members[j];
            var y = this._callOYValue(member.value);
            meme.attr('transform', vchart.tl.translate(contentLength, y));
            meme._tr_y = y;
            return Math.max(maxDY, -y);
        }.bind(this), 0);

        //todo:auto x
        var memberElements = Array.apply(null, ge.childNodes);
        memberElements.sort(function (a, b) {
            return a._tr_y - b._tr_y;
        });

        var ninf = -1000000;
        var messure = memberElements.reduce(function (ac, e) {
            var y = e._tr_y;
            var colIndex = 0;
            while (ac[colIndex].minY > y)++colIndex;
            ac[colIndex].minY = y + 40;
            ac[colIndex].child.push(e);
            ac[colIndex].maxWidth = Math.max(ac[colIndex].maxWidth, e.getBBox().width);
            return ac;
        }, Array(30).fill(null).map(function () {
            return { minY: ninf, child: [], maxWidth: ninf };
        }));
        messure.reduce(function (left, col) {
            if (col.child.length == 0) return;
            col.child.forEach(function (meme) {
                meme.attr('transform', vchart.tl.translate(left, meme._tr_y));
            });

            return left + col.maxWidth + 9;
        }, contentLength);

        var innerWidth = ge.getBBox().width;

        this.$groupBoxes[groupIndex].attr({
            x: contentLength - 10,
            width: innerWidth + 20,
            y: -maxDY - (this.plotRadius + 20),
            height: maxDY + this.plotRadius + 20
        });

        var columeWidth = Math.max(ge.getBBox().width + 20, this.$groupNames[groupIndex].getBBox().width + 10);

        this.$groupNames[groupIndex].attr('x', contentLength + columeWidth / 2);

        contentLength += columeWidth;


        return contentLength;

    }.bind(this), 0);
};


vchart.creator.grouprankchart.prototype.updateScrollArrows = function () {
    this.$scrollArrows.attr('transform', 'translate(' + (this.oxyLeft + 7) + ', ' + (this.oxyBottom - this.oyLength / 2) + ')');
    this.$scrollArrows.$rightArrow.attr('transform', 'translate(' + (this.oxLength - 15) + ', 0)');
    this.scrollLeft = this.scrollLeft;//update
};



vchart.creator.grouprankchart.prototype.update = function () {
    if (!this.groups || this.groups.length <= 0) return;
    this.updateSize();
    this.updateOyValues();
    this.updateAxis();
    this.updateOYSegmentLines();
    this.updateGroups();
    this.updateScrollArrows();
};

vchart.creator.grouprankchart.prototype.initComp = function () {
    this.maxValue = this.groups.reduce(function (ac, group) {
        return group.members.reduce(function (ac, member) {
            return Math.max(ac, member.value);
        }, ac);
    }, -10000000000);

    this.minValue = this.groups.reduce(function (ac, group) {
        return group.members.reduce(function (ac, member) {
            return Math.min(ac, member.value);
        }, ac);
    }, 10000000000);


    if (this.maxValue == this.minValue) this.maxValue += this.maxSegment;

    this.oxyBottom = this.canvasHeight - 40;//fix size, not need update
    this.oxyLeft = 0;

    var btSgmt = vchart.calBeautySegment(this.maxSegment, this.minValue, this.maxValue);

    this.oySegmentCount = btSgmt.segmentCout;
    this.oyMinValue = btSgmt.minValue;
    this.oyMaxValue = btSgmt.maxValue;
    this.extendOY = !!(this.zeroOY && (this.oyMinValue > 0));
    this.oyStep = btSgmt.step;

    this.$oyValues = this._createOyValues(this.oyMinValue, this.oyStep, this.oySegmentCount, this.extendOY)
        .addTo(this);

    this.$oySegmentLines = this._createOYSegmentLines(this.oySegmentCount + 1 + (this.extendOY ? 1 : 0)).addTo(this);


    this.$title = vchart.text(this.title, this.canvasWidth / 2, 19, 'base-chart-title').attr('text-anchor', 'middle').addTo(this);

    this.$oyName = vchart.text(this.valueName || '', 0, 0, 'base-chart-oxy-text').addTo(this);
    this.$oxName = vchart.text(this.keyName || '', 0, 0, 'base-chart-oxy-text').addTo(this);

    this.$groups = this.groups.map(function (group) {
        return this._createGroup(group).addTo(this.$content);
    }.bind(this));

    this.$groupNames = this.groups.map(function (group) {
        return vchart.text(group.name, 0, 18).attr('text-anchor', 'middle').addTo(this.$content);
    }.bind(this));

    this.$groupBoxes = this.groups.map(function (group) {
        return vchart.rect(0, 0, 0, 0, 'grank-chart-group-rect').addTo(this.$content);
    }.bind(this));

    this.$scrollArrows = vchart._('scrollarrow')
        .addTo(this)
        .on('pressleft', this.eventHandler.scrollArrowsPressLeft)
        .on('pressright', this.eventHandler.scrollArrowsPressRight);


};

vchart.creator.grouprankchart.prototype.init = function (props) {
    this.plotRadius = 6;
    this.canvasWidth = 400;
    this.canvasHeight = 300;
    this.maxSegment = 9;
    this.paddingnAxisBottom = this.plotRadius + 30;
    this.valueName = '';
    this.super(props);
    if (!this.groups || this.groups.length <= 0) {
        console.log('Empty data!');
        return;
    }
    this.initComp();
    this.sync = this.sync.then(this.update.bind(this));
};

vchart.creator.grouprankchart.property = {};


vchart.creator.grouprankchart.property.scrollLeft = {
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

vchart.creator.grouprankchart.property.overflowOX = {
    get: function () {
        return Math.max(0, this.oxContentLength - this.oxLength);
    }
}; 

