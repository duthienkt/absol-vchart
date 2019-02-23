vchart.creator.assessmentchart = function () {
    var _ = vchart._;
    var $ = vchart.$;
    var res = _({
        tag: 'svg',
        class: 'base-chart'
    });

    res.sync = res.afterAttached(200);
    return res;
};

vchart.creator.assessmentchart.prototype._createLineNote = function (name, color) {
    var res = vchart._('g');
    res.$line = vchart.hline(0, -5, this.noteLineLength, 'assessment-chart-area').addStyle('stroke', color).addTo(res);
    res.$name = vchart.text(name, this.noteLineLength + 5, 0).addTo(res);
    return res;
};

vchart.creator.assessmentchart.prototype._createLevelValue = function (value) {
    var res = vchart._('g.assessment-chart-level-value');
    res.$bound = vchart.rect(0, -6, 0, 13).attr({ rx: '4', ry: '4' }).addTo(res);
    res.$text = vchart.text(value + '', 0, 4).attr({ 'text-anchor': 'middle' }).addTo(res);

    return res;
};

vchart.creator.assessmentchart.prototype.autoColor = function (index, alpha) {
    var hsla = [index / this.areas.length, 0.8, 0.5, alpha === undefined ? 1 : alpha];
    var rgba = vchart.hslaToRGBA(hsla).map(function (x, i) { return (i == 3 ? x : (x * 255 >> 0)); });
    return 'rgba(' + rgba.join(',') + ')';
};

vchart.creator.assessmentchart.prototype.mapAngle = function (i, deg) {
    return (-90 + i * 360 / this.keys.length) * (deg ? 1 : Math.PI / 180);
};

vchart.creator.assessmentchart.prototype.mapRadius = function (level) {

    return this.axisLenth * (level / (this.levels.length - 1));
};


vchart.creator.assessmentchart.prototype.mapLevel = function (value) {
    if (this.isMappingLevel) {
        if (value < this.levelMappingArray[0])
            return Math.map(value,
                this.levelMappingArray[0], this.levelMappingArray[1],
                0, 1);
        if (value > this.levelMappingArray[this.levels.length - 1])
            return Math.map(value,
                this.levelMappingArray[this.levels.length - 2], this.levelMappingArray[this.levels.length - 1],
                0, 1);
        for (var i = 1; i < this.levels.length; ++i) {
            if (value >= this.levelMappingArray[i - 1] && value <= this.levelMappingArray[i])
                return Math.map(value,
                    this.levelMappingArray[i - 1], this.levelMappingArray[i],
                    i - 1, i);
        }
    }
    else {
        return value;
    }
};

vchart.creator.assessmentchart.prototype._createRangeLine = function () {
    var _ = vchart._;
    var $ = vchart.$;
    var res = _({
        tag: 'g'
    });

    res.$min = vchart.circle(0, 0, this.rangePlotRadius, 'assessment-chart-range-plot').addTo(res);
    res.$max = vchart.circle(0, 0, this.rangePlotRadius, 'assessment-chart-range-plot').addTo(res);
    res.$line = vchart._('path.assessment-chart-range-line').addTo(res);

    return res;
};




vchart.creator.assessmentchart.prototype.updateSize = vchart.creator.basechart.prototype.updateSize;

vchart.creator.assessmentchart.prototype.update = function () {
    this.updateSize();
    this.updateBackComp();
    this.updateComp();
    this.updateFrontComp();
};

vchart.creator.assessmentchart.prototype.initBackComp = function () {
    this.$title = vchart.text(this.title, 20, 20, 'base-chart-title').attr('text-anchor', 'middle').addTo(this);
    this.$content = vchart._('g').addTo(this);
    this.$axisLines = this.keys.map(function (u, i) {
        var res = vchart._('hlinearrow');
        res.resize(200);
        res.attr('transform', vchart.tl.rotate(-90 + i * 360 / this.keys.length));
        res.addTo(this.$content);
        return res;
    }.bind(this));

    this.$axisNames = this.keys.map(function (key, i, arr) {
        var anchor = 'start';
        if (i == 0 || i == arr.length / 2) anchor = 'middle';
        else if (i > arr.length / 2) anchor = 'end';
        return vchart.text(key, 0, 0).attr('text-anchor', anchor).addTo(this.$content);
    }.bind(this));

    this.$levels = this.levels.map(function () {
        return vchart._('path.assessment-chart-level').addTo(this.$content);
    }.bind(this));

    this.$notes = this.areas.map(function (area, i) {
        return this._createLineNote(area.name, this.autoColor(i)).addTo(this);
    }.bind(this));



};

vchart.creator.assessmentchart.prototype.updateBackComp = function () {
    this.$title.attr('x', this.canvasWidth / 2);
    this.axisTop = 30 + this.axisNameMarging + 30;
    this.axisBottom = this.canvasHeight - 25 - 30 - this.axisNameMarging;
    var axisNameWidth = this.$axisNames.reduce(function (ac, e) {
        return Math.max(e.getBBox().width, ac);
    }, 0);

    this.axisLenth = Math.min(this.axisBottom - this.axisTop - this.paddingMaxAxis * 2, this.canvasWidth - axisNameWidth * 2 - this.axisNameMarging - this.paddingMaxAxis) / 2;
    this.cx = this.canvasWidth / 2;
    this.cy = (this.axisBottom + this.axisTop) / 2;
    this.$content.attr('transform', vchart.tl.translate(this.cx, this.cy));
    this.$axisLines.forEach(function ($axisLine) {
        $axisLine.resize(this.mapRadius(this.levels.length - 1) + this.paddingMaxAxis);
    }.bind(this));
    this.$axisNames.forEach(function ($axisName, i) {
        var angle = (-90 + i * 360 / this.keys.length) * Math.PI / 180;
        var x = (this.mapRadius(this.levels.length - 1) + this.axisNameMarging + this.paddingMaxAxis) * Math.cos(angle);
        var y = (this.mapRadius(this.levels.length - 1) + this.axisNameMarging + this.paddingMaxAxis) * Math.sin(angle) + 5;
        $axisName.attr({ x: x, y: y });
    }.bind(this));

    this.$levels.forEach(function ($level, level) {
        var points = this.keys.reduce(function (ac, value, i) {
            var angle = this.mapAngle(i);
            var x = this.mapRadius(level) * Math.cos(angle);
            var y = this.mapRadius(level) * Math.sin(angle);
            ac.push(x + ' ' + y);
            return ac;
        }.bind(this), []);
        var d = 'M' + points.join('L') + 'Z';
        $level.attr('d', d);
    }.bind(this));

    var maxNoteWidth = this.$notes.reduce(function (ac, $note) {
        return Math.max($note.getBBox().width, ac);
    }, 0);


    this.$notes.reduce(function (x, $note) {
        $note.attr('transform', vchart.tl.translate(x + this.noteMarginH, this.canvasHeight - 7));
        return x + maxNoteWidth + this.noteMarginH * 2;
    }.bind(this), this.canvasWidth / 2 - ((maxNoteWidth + 2 * this.noteMarginH) * this.areas.length) / 2);
};

vchart.creator.assessmentchart.prototype.initComp = function () {
    if (this.ranges && this.ranges.length > 0) {
        this.$ranges = this.ranges.map(function (range, i, arr) {
            return this._createRangeLine().addTo(this.$content);
        }.bind(this));
    }

    this.$areas = this.areas.map(function (area, i, arr) {
        return vchart._('path.assessment-chart-area').addTo(this.$content).addStyle({
            fill: area.fill || this.autoColor(i, 0.3),
            stroke: area.stroke || this.autoColor(i, 0.8),
        });
    }.bind(this));
};

vchart.creator.assessmentchart.prototype.updateComp = function () {
    if (this.ranges && this.ranges.length > 0) {
        this.$ranges.forEach(function ($range, i) {
            var range = this.ranges[i];
            var angle = this.mapAngle(i);
            var levelMax = this.mapLevel(range[1]);
            var xMax = this.mapRadius(levelMax) * Math.cos(angle);
            var yMax = this.mapRadius(levelMax) * Math.sin(angle);
            $range.$max.attr({ cx: xMax, cy: yMax });

            var levelMin = this.mapLevel(range[0]);
            var xMin = this.mapRadius(levelMin) * Math.cos(angle);
            var yMin = this.mapRadius(levelMin) * Math.sin(angle);
            $range.$min.attr({ cx: xMin, cy: yMin });
            $range.$line.attr('d', 'M' + xMin + ' ' + yMin + 'L' + xMax + ' ' + yMax);


        }.bind(this));
    }

    this.$areas.forEach(function ($area, i) {
        var area = this.areas[i];
        var points = area.values.reduce(function (ac, value, i) {
            var angle = this.mapAngle(i);
            var level = this.mapLevel(value);
            var x = this.mapRadius(level) * Math.cos(angle);
            var y = this.mapRadius(level) * Math.sin(angle);
            ac.push(x + ' ' + y);
            return ac;

        }.bind(this), []);
        var d = 'M' + points.join('L') + 'Z';
        $area.attr('d', d);
    }.bind(this));
};


vchart.creator.assessmentchart.prototype.initFrontComp = function () {
    this.$levelValues = this.levels.map(function (level) {
        return this._createLevelValue(level).addTo(this.$content);
    }.bind(this));
};


vchart.creator.assessmentchart.prototype.updateFrontComp = function () {

    var levelValueWidth = this.$levelValues.reduce(function (w, $levelValue) {
        return Math.max(w, $levelValue.$text.getBBox().width + 4);
    }, 0);


    if (this.mapRadius(1) - this.mapRadius(0) > 13) {
        this.$levelValues.forEach(function ($levelValue, i) {

            $levelValue.$bound.attr({ x: -levelValueWidth / 2, width: levelValueWidth });
            $levelValue.attr('transform', vchart.tl.translate(0, - this.mapRadius(i)));
        }.bind(this));

    }
    else {
        this.$levelValues.forEach(function ($levelValue, i) {
            $levelValue.addStyle('display', 'none');
        }.bind(this));
    }
};


vchart.creator.assessmentchart.prototype.preInit = function () {
    this.noteLineLength = 30;
    this.noteMarginH = 8;
    this.paddingMaxAxis = 20;
    this.axisNameMarging = 7;
    this.rangePlotRadius = 5;
};

vchart.creator.assessmentchart.prototype.prepareData = function () {
    this.levelMappingArray = this.levels.map(function (value) {
        return parseFloat(value + '');
    });

    this.isMappingLevel = this.levelMappingArray.reduce(function (ac, cr) {
        return ac && (!isNaN(cr));
    }, true);
};


vchart.creator.assessmentchart.prototype.init = function (props) {
    this.preInit();
    this.super(props);
    this.prepareData();
    this.initBackComp();
    this.initComp();
    this.initFrontComp();
    this.sync = this.sync.then(this.update.bind(this));
};