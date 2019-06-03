import Vcore from "./VCore";
import { isNumber, rect, text, getSubNumberArray } from "./helper";
import { translate, rotate } from "./template";
import LineChart from "./LineChart";

var _ = Vcore._;
var $ = Vcore.$;

function DualChart() {

    var res = _('basechart.dualchart', true);
    return res;
};

DualChart.prototype.processMinMax = function () {
    this.minValue = this.lines.reduce(function (minValue, line) {
        return line.values.reduce(function (minValue, value) {
            if (!isNumber(value)) return minValue;
            return Math.min(minValue, value);
        }, minValue);
    }, 1000000000);

    this.minValue = this.areas.reduce(function (minValue, area) {
        return area.values.reduce(function (minValue, value) {
            if (!isNumber(value)) return minValue;
            return Math.min(minValue, value);
        }, minValue);
    }, this.minValue);

    this.maxValue = this.lines.reduce(function (maxValue, line) {
        return line.values.reduce(function (maxValue, value) {
            if (!isNumber(value)) return maxValue;
            return Math.max(maxValue, value);
        }, maxValue);
    }, -1000000000);

    this.maxValue = this.areas.reduce(function (maxValue, area) {
        return area.values.reduce(function (maxValue, value) {
            if (!isNumber(value)) return maxValue;
            return Math.max(maxValue, value);
        }, maxValue);
    }, this.maxValue);

    if (this.minValue > this.maxValue) {
        this.minValue = 0;
        this.maxValue = this.minValue + 10;
    }
};


DualChart.prototype._createArea = function (area, color) {
    var res = _({
        tag: 'shape',
        class: 'dualchart-area',
        style: {
            fill: color,
            stroke: color
        }
    });
    return res;
};


DualChart.prototype._createAreaNote = function (area, color) {
    var res = _({
        tag: 'g'
    });

    res.$rect = rect(0, -14, 14, 14, 'dualchart-note-rect').addTo(res);
    if (color) {
        res.$rect.addStyle('fill', color)
    }
    res.$name = text(area.name, 17, 0, 'dualchart-note-text').addTo(res);
    return res;
};

DualChart.prototype.initBackComp = function () {
    this.super();
    this.noteLineLength = 14;
    this.colors = this.lines.concat(this.areas).map(function (items, i, arr) {
        if (items.color) return items.color;
        return i < this.lines.length ? this.colorTable[Math.floor(this.colorTable.length * i / arr.length)] :
            this.colorTable[Math.floor(this.colorTable.length * i / arr.length)].replace(/#/, '#80');
    }.bind(this));

    this.$lineNotes = this.lines.map(function (line, i) {
        return this._createLineNote(line.name, this.colors[i]).addTo(this);
    }.bind(this));

    this.$arealNotes = this.areas.map(function (area, i) {
        return this._createAreaNote(area, this.colors[i + this.lines.length]).addTo(this);
    }.bind(this));


    this.$keyNames = this.keys.map(function (key) {
        return this._createKeyName(key).addTo(this.$content);
    }.bind(this));
};




DualChart.prototype.updateBackComp = function () {
    this.super();
    this.oxyBottom = this.canvasHeight - 5;

    var $notes = this.$lineNotes.concat(this.$arealNotes);

    var notesWidth = $notes.reduce(function (noteWidth, $lineNote) {
        return noteWidth + $lineNote.getBBox().width + 15;
    }.bind(this), 0);

    if (notesWidth >= this.canvasWidth) {
        var maxNoteWidth = $notes.reduce(function (maxNoteWidth, $lineNote) {
            return Math.max(maxNoteWidth, $lineNote.getBBox().width + 10);
        }.bind(this), 0);
        var notePerLine = Math.max(1, Math.floor(this.canvasWidth / maxNoteWidth));
        var x0 = (this.canvasWidth - notePerLine * maxNoteWidth) / 2 + 5;
        var y0 = this.canvasHeight - 5;
        $notes.forEach(function ($note, i) {
            $note.attr('transform', translate(x0 + maxNoteWidth * (i % notePerLine), y0));
            if (i % notePerLine == notePerLine - 1)
                y0 -= 20;
            this.oxyBottom -= 20;
        }.bind(this));
    }
    else {
        $notes.reduce(function (x, $line) {
            $line.attr('transform', translate(x, this.canvasHeight - 5));
            return x + $line.getBBox().width + 15;
        }.bind(this), (this.canvasWidth - notesWidth) / 2);
        this.oxyBottom -= 20;
    }

    var maxKeyNameWidth = this.$keyNames.reduce(function (w, $keyName) {
        return Math.max(w, $keyName.$text.getBBox().width);
    }, 0);

    this.oxSegmentLength = this.oxLength / this.keys.length;
    this.oxContentLength = this.oxLength;
    if (this.oxSegmentLength < maxKeyNameWidth + this.keyPaddingH * 2) {
        this.rotateText = true;
    }
    else if (this.minOXSegmentLength > this.oxSegmentLength) {
        this.oxSegmentLength = this.minOXSegmentLength;
        this.rotateText = true;
        this.oxContentLength = this.oxSegmentLength * this.keys.length;
    }

    if (this.rotateText) {
        this.$keyNames.forEach(function (e, i) {
            e.attr('transform', translate((i + 0.5) * this.oxSegmentLength - 5, 12));
            e.$text.attr('transform', rotate(45));
        }.bind(this));
        this.oxyBottom -= maxKeyNameWidth / 1.4 + 12;
    }
    else {
        this.$keyNames.forEach(function (e, i) {
            e.attr('transform', translate((i + 0.5) * this.oxSegmentLength, 12));
            e.$text.attr('text-anchor', 'middle');
        }.bind(this));
        this.oxyBottom -= 30;
    }


    //reupdate because update oxybottom

    this.super();
};



DualChart.prototype.initComp = function () {
    this.$areas = this.areas.map(function (line, i) {
        return this._createArea(line, this.colors[i + this.lines.length]).addTo(this.$content);
    }.bind(this));
    this.$lines = this.lines.map(function (line, i) {
        return this._createLine(line, this.colors[i]).addTo(this.$content);
    }.bind(this));

};



DualChart.prototype.updateComp = function () {
    this.updateLine();
    this.updateArea();
};


DualChart.prototype.updateLine = function () {

    this.$lines.map(function ($line, i) {
        var line = this.lines[i];

        var subLines = getSubNumberArray(line.values);
        $line.$path.begin();
        subLines.forEach(function (subLine, j) {
            var start = subLine.start;
            var values = subLine.values;
            if (values.length > 1) {
                $line.$path.moveTo(this.oxSegmentLength * (start + 0.5), this.mapOYValue(values[0]));
                for (var xi = 1; xi < values.length; ++xi) {
                    $line.$path.lineTo(this.oxSegmentLength * (start + xi + 0.5), this.mapOYValue(values[xi]));
                }
            }
            else {
                $line.$path.moveTo(this.oxSegmentLength * (start + 0.25), this.mapOYValue(values[0]));
                $line.$path.lineTo(this.oxSegmentLength * (start + 0.75), this.mapOYValue(values[0]));
            }
        }.bind(this));
        $line.$path.end();


        $line.$plots.forEach(function ($plot, j) {
            $plot.attr('display');
            var value = line.values[j];
            if (isNumber(value)) {
                $plot.attr({
                    display: undefined,
                    cx: this.oxSegmentLength * (j + 0.5),
                    cy: this.mapOYValue(value)
                });
            }
            else
                $plot.attr('display', 'none');
        }.bind(this));

        $line.$path.end();
    }.bind(this));

}

DualChart.prototype.updateArea = function () {
    this.$areas.map(function ($area, i) {
        var values = this.areas[i].values;
        var subAreas = getSubNumberArray(values);

        $area.begin();
        subAreas.forEach(function (subArea) {
            var start = subArea.start;
            var values = subArea.values;

            if (values.length > 1) {
                $area.moveTo(this.oxSegmentLength * (start + 0.5), -1);
                for (var xi = 0; xi < values.length; ++xi) {
                    $area.lineTo(this.oxSegmentLength * (start + xi + 0.5), this.mapOYValue(values[xi]));
                }

                $area.lineTo(this.oxSegmentLength * (start + values.length - 1 + 0.5), -1);
                $area.closePath();
            }
            else {
                $area.moveTo(this.oxSegmentLength * (start + 0.25), -1);

                $area.lineTo(this.oxSegmentLength * (start + 0.25), this.mapOYValue(values[0]));
                $area.lineTo(this.oxSegmentLength * (start + 0.75), this.mapOYValue(values[0]));

                $area.lineTo(this.oxSegmentLength * (start + 0.75), -1);
                $area.closePath();
            }

        }.bind(this));

        // $area
        //     .moveTo(this.oxSegmentLength * (values.length - (this.keys.length == 1 ? 0.25 : 0.5)), -1)
        //     .lineTo(this.oxSegmentLength * (this.keys.length == 1 ? 0.25 : 0.5), -1);
        // if (this.keys.length == 1) {
        //     $area.lineTo(this.oxSegmentLength * 0.25, isNumber(values[0]) ? this.mapOYValue(values[0]) : 0);
        // }
        // for (var i = 0; i < values.length; ++i) {
        //     $area.lineTo(this.oxSegmentLength * (i + 0.5), isNumber(values[i]) ? this.mapOYValue(values[i]) : 0);
        // }

        // if (this.keys.length == 1) {
        //     $area.lineTo(this.oxSegmentLength * 0.75, isNumber(values[0]) ? this.mapOYValue(values[0]) : 0);
        // }
        // $area.closePath().end();
        $area.end();

    }.bind(this));
};

Object.keys(LineChart.prototype)
    .filter(function (key) {
        return !DualChart.prototype[key]
    }).forEach(function (key) {
        DualChart.prototype[key] = LineChart.prototype[key];
    });


Vcore.creator.dualchart = DualChart;

export default DualChart;