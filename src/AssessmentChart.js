import './style/assessmentchart.css';
import {text, rect, hline, circle, map, lighterColor} from "./helper";
import Vcore from "./VCore";
import Color from "absol/src/Color/Color";
import {rotate, translate} from "./template";
import Rectangle from "absol/src/Math/Rectangle";
import BChart from "./BChart";
import OOP from "absol/src/HTML5/OOP";
import GContainer from "absol-svg/js/svg/GContainer";

var _ = Vcore._;
var $ = Vcore.$;


/***
 *
 * @extends BChart
 * @constructor
 */
function AssessmentChart() {
    BChart.call(this);
    this.rangePlotRadius = 5;
    this.rangeFillColor = null;
    this.rangeFillColor = null;
    this.rangeMaxStrokeColor = Color.parse('rgba(255, 150, 0, 0.3)');
    this.rangeMinStrokeColor = Color.parse('rgba(200, 200, 0, 0.3)');


    /**
     *
     * @type {{values:number[], name: string, stroke: Color|string, fill:Color|string, color:Color|string}[]}
     */
    this.areas = [];

    this.ranges = [];
    /***
     *
     * @type {string[]}
     */
    this.keys = [];
    this.levels = [];
    /***
     *
     * @type {null|[]}
     */
    this.axisWeight = null;

    /***
     *
     * @type {GContainer}
     */
    this.$netCtn = _('gcontainer.vc-assessment-net-ctn');
    this.$netCtn = _('gcontainer.vc-assessment-net-ctn');
    this.$body.addChild(this.$netCtn);
    this.$netCtn.box.setPosition(200, 200);

    this.$axisCnt = _('gcontainer.vc-assessment-axis-ctn');
    this.$levelValueCnt = _('gcontainer.vc-assessment-axis-level-ctn');
    this.$levelCnt = _('gcontainer.vc-assessment-level-ctn');

    this.$areaCtn = _('gcontainer.vc-assessment-area-ctn');
    this.$rangeCtn = _('gcontainer.vc-assessment-range-ctn');

    this.$netCtn.addChild(this.$levelCnt);
    this.$netCtn.addChild(this.$axisCnt);

    this.$netCtn.addChild(this.$rangeCtn);
    this.$netCtn.addChild(this.$areaCtn);

    this.$netCtn.addChild(this.$levelValueCnt);
}

OOP.mixClass(AssessmentChart, BChart);
AssessmentChart.property = Object.assign({}, BChart.property);
AssessmentChart.eventHandler = Object.assign({}, BChart.eventHandler);

AssessmentChart.tag = 'AssessmentChart'.toLowerCase();

AssessmentChart.render = function () {
    return BChart.render().addClass('vc-assessment-chart');
};

AssessmentChart.prototype.normalizeData = function () {
    var thisC = this;
    // fill: area.fill || this.autoColor(i, 0.3),
    //     stroke: area.stroke || this.autoColor(i, 0.8),
    this.areas.forEach(function (area, i) {
        var color = area.color || area.stroke || area.fill || thisC.autoColor(i);
        color = Color.parse(color + '');
        color.rgba[3] = 1;
        var strokeColor = color.clone();
        strokeColor.rgba[3] = 0.8;
        var filColor = color.clone();
        filColor.rgba[3] = 0.3;
        if (area.color) {
            area.fill = area.fill || filColor;
            area.stroke = area.stroke || strokeColor;
        }
        else {
            if (area.stroke) {
                area.fill = area.fill || 'none';
            }
            else if (area.fill) {
                area.stroke = area.stroke || 'none';
            }
            else {
                area.fill = filColor;
                area.stroke = strokeColor;
            }
            area.color = color;
        }
    });
};

AssessmentChart.prototype.computeNotes = function () {
    return this.areas.map(function (area) {
        return {
            type: 'stroke',
            color: area.color,
            text: area.name
        }
    });
};

AssessmentChart.prototype._createAxis = function () {
    this.$axisCnt.clearChild();
    this.$axisLines = this.keys.map(function (u, i) {
        var res = _('hlinearrow');
        res.resize(200);
        res.attr('transform', rotate(-90 + i * 360 / this.keys.length));
        res.addTo(this.$axisCnt);
        return res;
    }.bind(this));

    this.$axisNames = this.keys.map(function (key, i, arr) {
        var anchor = 'start';
        if (i === 0 || i === arr.length / 2) anchor = 'middle';
        else if (i > arr.length / 2) anchor = 'end';
        return _({
            tag: 'text',
            attr: {
                x: 0,
                y: 0
            },
            style: {
                textAnchor: anchor
            },
            child: { text: key }
        }).addTo(this.$axisCnt);
    }.bind(this));

    this.$levelCnt.clearChild();
    this.$levels = this.levels.map(function (level, i, levels) {
        return _('path.vc-assessment-chart-level' + (i + 1 == levels.length ? '.last' : '')).addTo(this.$levelCnt);
    }.bind(this));

    this.computedData.axisNameSize = this.$axisNames.map(function (elt) {
        var box = elt.getBBox();
        return { width: box.width, height: box.height };
    });

    this.$levelValueCnt.clearChild();
    this.$levelValues = this.levels.map(function (level) {
        return this._createLevelValue(level).addTo(this.$levelValueCnt);
    }.bind(this));


};

AssessmentChart.prototype._createAreas = function () {
    this.$areaCtn.clearChild();
    this.$areas = this.areas.map(function (area, i, arr) {
        return _('path.vc-assessment-chart-area').addTo(this.$areaCtn).addStyle({
            fill: area.fill,
            stroke: area.stroke
        });
    }.bind(this));
};

AssessmentChart.prototype._createRanges = function () {
    this.$rangeCtn.clearChild();
    if (this.ranges && this.ranges.length > 0) {
        this.$rangeArea = _('shape.vc-assessment-chart-range-area').addStyle('fill-rule', "evenodd").addTo(this.$rangeCtn);
        if (this.rangeFillColor) {
            var rangeFillColor = Color.parse(this.rangeFillColor + '');
            rangeFillColor.rgba[3] = 0.3;
            this.$rangeArea.addStyle({
                fill: rangeFillColor.toString()
            })
        }
        this.$ranges = this.ranges.map(function (range, i, arr) {
            return this._createRangeLine().addTo(this.$rangeCtn);
        }.bind(this));

        this.$rangeMax = _('shape.vc-assessment-chart-range-area-stroke').addTo(this.$rangeCtn).addStyle({
            stroke: this.rangeMaxStrokeColor || 'rgba(255, 150, 0, 0.3)',
        });


        this.$rangeMin = _('shape.vc-assessment-chart-range-area-stroke').addTo(this.$rangeCtn).addStyle({
            stroke: this.rangeMinStrokeColor || 'rgba(200, 200, 0, 0.3)',
        });
    }
};


AssessmentChart.prototype.createContent = function () {
    BChart.prototype.createContent.call(this);
    this._createAxis();
    this._createRanges();
    this._createAreas();
};


AssessmentChart.prototype._createLevelValue = function (value) {
    var res = _('gcontainer.vc-assessment-chart-level-value');
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
    return this.computedData.axisLength * (level / (this.levels.length - 1));
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
        class: 'vc-assessment-chart-range-segment'
    });

    res.$min = circle(0, 0, this.rangePlotRadius, 'vc-assessment-chart-range-plot').addTo(res);
    res.$max = circle(0, 0, this.rangePlotRadius, 'vc-assessment-chart-range-plot').addTo(res);
    res.$line = _('path.vc-assessment-chart-range-line').addTo(res);
    return res;
};

/**
 * @param {Array<Rectangle>} rects
 * @returns {Rectangle}
 */
AssessmentChart.prototype._expectSize = function (rects, r) {
    var cr = new Rectangle(0, 0, 0, 0);
    var rect;
    for (var i = 0; i < rects.length; ++i) {
        var angle = Math.PI * 2 * i / rects.length - Math.PI / 2;
        rect = rects[i];
        if (i == 0) {
            rect.x = rect.width / 2;
            rect.y = -rect.height - r - 7;
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


AssessmentChart.prototype._computedNetSize = function () {
    var rects = this.computedData.axisNameSize.map(function (box) {
        return new Rectangle(0, 0, box.width, box.height);
    });

    var aWidth = this.$body.box.width;
    var aHeight = this.$body.box.height;
    var maxR = Math.min(aWidth, this.$body.box.height) / 2;
    var minR = 20;//

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

    this.computedData.expectedSize = this._expectSize(rects, minR);
    this.computedData.expectedRadius = minR;
    this.computedData.axisLength = this.computedData.expectedRadius - 30;
};


AssessmentChart.prototype._updateAxisPosition = function () {
    var axisLength = this.computedData.axisLength;
    this.$axisLines.forEach(function ($axisLine) {
        $axisLine.resize(axisLength + 20);
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
        var x = (axisLength + 30) * Math.cos(angle);
        var y = (axisLength + 30) * Math.sin(angle) + 5;
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


    var levelValueWidth = this.$levelValues.reduce(function (w, $levelValue) {
        return Math.max(w, $levelValue.$text.getBBox().width + 4);
    }, 0);


    if (this.mapRadius(1) - this.mapRadius(0) > 13) {
        this.$levelValues.forEach(function ($levelValue, i) {
            $levelValue.$bound.attr({ x: -levelValueWidth / 2, width: levelValueWidth });
            $levelValue.attr('transform', translate(0, -this.mapRadius(i)));
        }.bind(this));

    }
    else {
        this.$levelValues.forEach(function ($levelValue, i) {
            $levelValue.addStyle('display', 'none');
        }.bind(this));
    }

    var contentBound = new Rectangle(0, 0, this.$body.box.width, this.$body.box.height);
    var centerBound = contentBound.centerPoint();

    this.$netCtn.box.setPosition(centerBound.x + (-this.computedData.expectedSize.x - this.computedData.expectedSize.width / 2),
        centerBound.y + (-this.computedData.expectedSize.y - this.computedData.expectedSize.height / 2));
};

AssessmentChart.prototype._updateAreaPosition = function () {
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

AssessmentChart.prototype._updateRangePosition = function () {
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
};

AssessmentChart.prototype.updateBodyPosition = function () {
    BChart.prototype.updateBodyPosition.call(this);
    this._computedNetSize();
    this._updateAxisPosition();
    this._updateAreaPosition();
    this._updateRangePosition();
};


AssessmentChart.prototype.updateContent = function () {
    this.prepareData();
    BChart.prototype.updateContent.call(this);
};


AssessmentChart.prototype.prepareData = function () {
    this.levelMappingArray = this.levels.map(function (value) {
        return parseFloat(value + '');
    });

    this.isMappingLevel = this.levelMappingArray.reduce(function (ac, cr) {
        return ac && (!isNaN(cr));
    }, true);
};

AssessmentChart.property.simpleMode = {
    set: function (value) {
        if (value)
            this.addClass('simple-mode');
        else
            this.removeClass('simple-mode');
    },
    get: function () {
        return this.containsClass('simple-mode');
    }
};

AssessmentChart.property.rangeSegment = {
    set: function (value) {
        if (value)
            this.addClass('show-range-segment');
        else
            this.removeClass('show-range-segment');
    },
    get: function () {
        return this.containsClass('show-range-segment');
    }
};


Vcore.install(AssessmentChart);

export default AssessmentChart;