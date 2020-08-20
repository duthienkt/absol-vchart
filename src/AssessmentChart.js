import { text, rect, hline, circle, map } from "./helper";
import Vcore from "./VCore";
import Color from "absol/src/Color/Color";
import BaseChart from "./BaseChart";
import { rotate, translate } from "./template";
import Vec2 from "absol/src/Math/Vec2";
import Rectangle from "absol/src/Math/Rectangle";
import Dom from "absol/src/HTML5/Dom";

var _ = Vcore._;
var $ = Vcore.$;


function AssessmentChart() {
    var res = _({
        tag: 'svg',
        class: ['base-chart', 'assessment-chart'],
        child: 'sattachhook'
    }, true);

    res.$attachhook = $("sattachhook", res).on('error', function (error) {
        this.updateSize = this.updateSize || res.update.bind(res);
        Dom.addToResizeSystem(this);
    });

    res.sync = new Promise(function (rs) {
        res.$attachhook.on('error', rs);
    });

    res.sync.then(function () {
        res.update();
    });

    return res;
};

AssessmentChart.prototype._createLineNote = function (name, color) {
    var res = _('g');
    res.$line = hline(0, -5, this.noteLineLength, 'assessment-chart-area').addStyle('stroke', color).addTo(res);
    res.$name = text(name, this.noteLineLength + 5, 0).addTo(res);
    return res;
};

AssessmentChart.prototype._createLevelValue = function (value) {
    var res = _('g.assessment-chart-level-value');
    res.$bound = rect(0, -6, 0, 13).attr({ rx: '4', ry: '4' }).addTo(res);
    res.$text = text(value + '', 0, 4).attr({ 'text-anchor': 'middle' }).addTo(res);
    if (value === '' || value === undefined || value === null) res.addStyle('visibility', 'hidden');
    return res;
};

AssessmentChart.prototype.autoColor = function (index, alpha) {
    var hsla = [index / this.areas.length, 0.8, 0.5, alpha === undefined ? 1 : alpha];
    var c = Color.fromHSLA(hsla[0], hsla[1], hsla[2], hsla[3]);
    return c.toString('rgba');
};

AssessmentChart.prototype.mapAngle = function (i, deg) {
    return (-90 + i * 360 / this.keys.length) * (deg ? 1 : Math.PI / 180);
};

AssessmentChart.prototype.mapRadius = function (level) {
    return this.axisLenth * (level / (this.levels.length - 1));
};


AssessmentChart.prototype.mapLevel = function (value) {
    if (this.isMappingLevel) {
        if (value < this.levelMappingArray[0])
            return map(value,
                this.levelMappingArray[0], this.levelMappingArray[1],
                0, 1);
        if (value > this.levelMappingArray[this.levels.length - 1])
            return map(value,
                this.levelMappingArray[this.levels.length - 2], this.levelMappingArray[this.levels.length - 1],
                0, 1);
        for (var i = 1; i < this.levels.length; ++i) {
            if (value >= this.levelMappingArray[i - 1] && value <= this.levelMappingArray[i])
                return map(value,
                    this.levelMappingArray[i - 1], this.levelMappingArray[i],
                    i - 1, i);
        }
    }
    else {
        return value;
    }
};

AssessmentChart.prototype._createRangeLine = function () {
    var res = _({
        tag: 'g',
        class: 'assessment-chart-range-segment'
    });

    res.$min = circle(0, 0, this.rangePlotRadius, 'assessment-chart-range-plot').addTo(res);
    res.$max = circle(0, 0, this.rangePlotRadius, 'assessment-chart-range-plot').addTo(res);
    res.$line = _('path.assessment-chart-range-line').addTo(res);

    return res;
};

/**
 * @param {Array<Rectangle>} rects
 * @returns {Rectangle}
 */
AssessmentChart.prototype._expectSize = function (rects, r, db) {
    var cr = new Rectangle(0, 0, 0, 0);
    var rect;
    for (var i = 0; i < rects.length; ++i) {
        var angle = Math.PI * 2 * i / rects.length - Math.PI / 2;
        rect = rects[i];
        if (i == 0) {
            rect.x = rect.width / 2;
            rect.y = - rect.height - r - 7;
        }
        else if (rects.length % 4 == 0 && i == (rects.length >> 2)) {
            rect.x = r;
            rect.y = rect.height / 2;
        }
        else if (rects.length % 4 == 0 && i == (rects.length >> 2) * 3) {
            rect.x = -r - rect.width;
            rect.y = rect.height / 2;
        }
        else if (rects.length % 2 == 0 && i == (rects.length >> 1)) {
            rect.x = rect.width / 2;
            rect.y = r + 7;
        }
        else if (i < rects.length / 4) {
            rect.x = r * Math.cos(angle);
            rect.y = r * Math.sin(angle) - rect.height;
        }
        else if (i < rects.length / 2) {
            rect.x = r * Math.cos(angle);
            rect.y = r * Math.sin(angle);
        }
        else if (i < rects.length / 4 * 3) {
            rect.x = r * Math.cos(angle) - rect.width;
            rect.y = r * Math.sin(angle);
        }
        else {
            rect.x = r * Math.cos(angle) - rect.width;
            rect.y = r * Math.sin(angle) - rect.height;
        }

        cr = cr.merge(rect);
    }
    return cr;

};


AssessmentChart.prototype.estimateSize = function () {
    this.axisNameBBoxs = this.$axisNames.map(function (elt) {
        return elt.getBBox();
    });

    var rects = this.axisNameBBoxs.map(function (box) {
        return new Rectangle(box.x, box.y, box.width, box.height);
    });

    var titleBox = this.$title.getBBox();
    var noteGroupBox = this.$noteGroup.getBBox();

    var maxR = Math.min(this.canvasWidth, this.canvasHeight) / 2;
    var minR = 20;//
    var aWidth = this.canvasWidth - this.paddingContent * 2;
    var aHeight = this.canvasHeight - this.paddingContent * 2 - titleBox.height * 3 + noteGroupBox.height * 1.5;
    while (maxR - minR > 3) {
        var midR = (minR + maxR) / 2;
        var size = this._expectSize(rects, midR);
        if (size.width < aWidth && size.height < aHeight) {
            minR = midR;
        }
        else {
            maxR = midR;
        }
    }

    this.expectedSize = this._expectSize(rects, minR, true);
    this.expectedRadius = minR;
    this.axisLenth = this.expectedRadius - 30;
};


AssessmentChart.prototype.updateSize = BaseChart.prototype.updateSize;

AssessmentChart.prototype.update = function () {

    this.updateSize();
    this.estimateSize()
    this.updateBackComp();
    this.updateComp();
    this.updateFrontComp();
};

AssessmentChart.prototype.initBackComp = function () {
    this.$title = text(this.title || '', 20, 20, 'base-chart-title').attr('text-anchor', 'middle').addTo(this);
    this.$content = _('g').addTo(this);
    this.$noteGroup = _('g').addTo(this);
    this.$axisLines = this.keys.map(function (u, i) {
        var res = _('hlinearrow');
        res.resize(200);
        res.attr('transform', rotate(-90 + i * 360 / this.keys.length));
        res.addTo(this.$content);
        return res;
    }.bind(this));

    this.$axisNames = this.keys.map(function (key, i, arr) {
        var anchor = 'start';
        if (i == 0 || i == arr.length / 2) anchor = 'middle';
        else if (i > arr.length / 2) anchor = 'end';
        return text(key, 0, 0).attr('text-anchor', anchor).addTo(this.$content);
    }.bind(this));

    this.$levels = this.levels.map(function (level, i, levels) {
        return _('path.assessment-chart-level' + (i + 1 == levels.length ? '.last' : '')).addTo(this.$content);
    }.bind(this));

    this.$notes = this.areas.map(function (area, i) {
        return this._createLineNote(area.name, area.color || this.autoColor(i)).addTo(this.$noteGroup);
    }.bind(this));



};

AssessmentChart.prototype.updateBackComp = function () {
    this.$title.attr('x', this.canvasWidth / 2);
    this.axisTop = 30 + this.axisNameMarging + 30;
    this.axisBottom = this.canvasHeight - 25 - 30 - this.axisNameMarging;

    // this.$content.attr('transform', translate(this.cx, this.0));
    this.$axisLines.forEach(function ($axisLine) {
        $axisLine.resize(this.axisLenth + 20);
    }.bind(this));

    if (this.axisWeight && this.axisWeight.forEach) {
        this.axisWeight.forEach(function (value, i) {
            var axisLineElt = this.$axisLines[i];
            if (axisLineElt) {
                if (value >= 0) {
                    axisLineElt.addStyle('strokeWidth', value + '');
                }
                else {
                    axisLineElt.remove('strokeWidth');
                }
            }
        }.bind(this));
    }
    this.$axisNames.forEach(function ($axisName, i) {
        var angle = (-90 + i * 360 / this.keys.length) * Math.PI / 180;
        var x = (this.axisLenth + 30) * Math.cos(angle);
        var y = (this.axisLenth + 30) * Math.sin(angle) + 5;
        if (this.keys.length % 2 == 0 && i == (this.keys.length >> 1)) {
            y += 7;
        }
        else if (i == 0) {
            y -= 7;
        }
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
        $note.attr('transform', translate(x + this.noteMarginH, this.canvasHeight - 7));
        return x + maxNoteWidth + this.noteMarginH * 2;
    }.bind(this), this.canvasWidth / 2 - ((maxNoteWidth + 2 * this.noteMarginH) * this.areas.length) / 2);


    var contentBound = new Rectangle(this.paddingContent, this.$title.getBBox().height * 1.5, this.canvasWidth - this.paddingContent * 2, Math.max(this.$content.getBBox().height + 20, this.$noteGroup.getBBox().y));
    contentBound.height -= contentBound.y;
    var centerBound = contentBound.centerPoint();

    this.$content.attr('transform', translate(centerBound.x + (- this.expectedSize.x - this.expectedSize.width / 2), centerBound.y + (- this.expectedSize.y - this.expectedSize.height / 2)));
};

AssessmentChart.prototype.initComp = function () {
    if (this.ranges && this.ranges.length > 0) {
        this.$rangeArea = _('shape.assessment-chart-range-area').addStyle('fill-rule', "evenodd").addTo(this.$content);
        if (this.rangeFillColor) {
            var rangeFillColor = Color.parse(this.rangeFillColor);
            rangeFillColor.rgba[3] = 0.3;
            this.$rangeArea.addStyle({
                fill: rangeFillColor.toString()
            })
        }
        this.$ranges = this.ranges.map(function (range, i, arr) {
            return this._createRangeLine().addTo(this.$content);
        }.bind(this));

        this.$rangeMax = _('shape.assessment-chart-range-area-stroke').addTo(this.$content).addStyle({
            stroke: this.rangeMaxStrokeColor || 'rgba(255, 150, 0, 0.3)',
        });


        this.$rangeMin = _('shape.assessment-chart-range-area-stroke').addTo(this.$content).addStyle({
            stroke: this.rangeMinStrokeColor || 'rgba(200, 200, 0, 0.3)',
        });
    }

    this.$areas = this.areas.map(function (area, i, arr) {
        return _('path.assessment-chart-area').addTo(this.$content).addStyle({
            fill: area.fill || this.autoColor(i, 0.3),
            stroke: area.stroke || this.autoColor(i, 0.8),
        });
    }.bind(this));



};

AssessmentChart.prototype.updateComp = function () {
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

        this.$rangeArea.begin();
        this.$rangeMax.begin();
        this.$rangeMin.begin();
        this.ranges.forEach(function (range, i, arr) {
            var angle = this.mapAngle(i);
            var levelMax = this.mapLevel(range[1]);
            var xMax = this.mapRadius(levelMax) * Math.cos(angle);
            var yMax = this.mapRadius(levelMax) * Math.sin(angle);
            if (i == 0) {
                this.$rangeArea.moveTo(xMax, yMax);
                this.$rangeMax.moveTo(xMax, yMax);
            }
            else {
                this.$rangeArea.lineTo(xMax, yMax);
                this.$rangeMax.lineTo(xMax, yMax);
            }
            if (i + 1 == arr.length) {
                this.$rangeArea.closePath();
                this.$rangeMax.closePath();
            }
        }.bind(this))

        this.ranges.forEach(function (range, i, arr) {
            var angle = this.mapAngle(i);
            var levelMax = this.mapLevel(range[0]);
            var xMin = this.mapRadius(levelMax) * Math.cos(angle);
            var yMin = this.mapRadius(levelMax) * Math.sin(angle);
            if (i == 0) {
                this.$rangeArea.moveTo(xMin, yMin);
                this.$rangeMin.moveTo(xMin, yMin);
            }
            else {
                this.$rangeArea.lineTo(xMin, yMin);
                this.$rangeMin.lineTo(xMin, yMin);
            }
            if (i + 1 == arr.length) {
                this.$rangeArea.closePath();
                this.$rangeMin.closePath();
            }
        }.bind(this))
        this.$rangeMax.end();
        this.$rangeMin.end();
        this.$rangeArea.end();
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
        if (typeof (area.strokeWidth) == "number") {
            $area.addStyle('stroke-width', area.strokeWidth + '');
        }
    }.bind(this));
};


AssessmentChart.prototype.initFrontComp = function () {
    this.$levelValues = this.levels.map(function (level) {
        return this._createLevelValue(level).addTo(this.$content);
    }.bind(this));
};


AssessmentChart.prototype.updateFrontComp = function () {

    var levelValueWidth = this.$levelValues.reduce(function (w, $levelValue) {
        return Math.max(w, $levelValue.$text.getBBox().width + 4);
    }, 0);


    if (this.mapRadius(1) - this.mapRadius(0) > 13) {
        this.$levelValues.forEach(function ($levelValue, i) {

            $levelValue.$bound.attr({ x: -levelValueWidth / 2, width: levelValueWidth });
            $levelValue.attr('transform', translate(0, - this.mapRadius(i)));
        }.bind(this));

    }
    else {
        this.$levelValues.forEach(function ($levelValue, i) {
            $levelValue.addStyle('display', 'none');
        }.bind(this));
    }
};


AssessmentChart.prototype.preInit = function () {
    this.noteLineLength = 30;
    this.noteMarginH = 8;
    this.paddingMaxAxis = 20;
    this.axisNameMarging = 7;
    this.rangePlotRadius = 5;
    this.paddingContent = 10;
};

AssessmentChart.prototype.prepareData = function () {
    this.levelMappingArray = this.levels.map(function (value) {
        return parseFloat(value + '');
    });

    this.isMappingLevel = this.levelMappingArray.reduce(function (ac, cr) {
        return ac && (!isNaN(cr));
    }, true);
};


AssessmentChart.prototype.init = function (props) {
    this.preInit();
    this.super(props);
    this.prepareData();
    this.initBackComp();
    this.initComp();
    this.initFrontComp();
    this.sync = this.sync.then(this.update.bind(this));
};


AssessmentChart.property = {
    simpleMode: {
        set: function (value) {
            if (value)
                this.addClass('simple-mode');
            else
                this.removeClass('simple-mode');
        },
        get: function () {
            return this.containsClass('simple-mode');
        }
    },
    rangeSegment: {
        set: function (value) {
            if (value)
                this.addClass('show-range-segment');
            else
                this.removeClass('show-range-segment');
        },
        get: function () {
            return this.containsClass('show-range-segment');
        }
    }
};


Vcore.creator.assessmentchart = AssessmentChart;

export default AssessmentChart;