vchart.creator.dualchart = function () {
    var _ = vchart._;
    var $ = vchart.$;
    var res = _('basechart.dualchart', true);
    return res;
};

vchart.creator.dualchart.prototype.processMinMax = function () {
    this.minValue = this.lines.reduce(function (minValue, line) {
        return line.values.reduce(function (minValue, value) {
            return Math.min(minValue, value);
        }, minValue);
    }, 1000000000);

    this.minValue = this.areas.reduce(function (minValue, area) {
        return area.values.reduce(function (minValue, value) {
            return Math.min(minValue, value);
        }, minValue);
    }, this.minValue);

    this.maxValue = this.lines.reduce(function (maxValue, line) {
        return line.values.reduce(function (maxValue, value) {
            return Math.max(maxValue, value);
        }, maxValue);
    }, -1000000000);

    this.maxValue = this.areas.reduce(function (maxValue, area) {
        return area.values.reduce(function (maxValue, value) {
            return Math.max(maxValue, value);
        }, maxValue);
    }, this.maxValue);
};


vchart.creator.dualchart.prototype._createArea = function (area, color) {
    var res = vchart._({
        tag: 'shape',
        class: 'dualchart-area',
        style: {
            fill: color,
            stroke: color
        }
    });
    return res;
};


vchart.creator.dualchart.prototype._createAreaNote = function (area, color) {
    var res = vchart._({
        tag: 'g'
    });

    res.$rect = vchart.rect(0, -14, 14, 14, 'dualchart-note-rect').addStyle('fill', color).addTo(res);
    res.$name = vchart.text(area.name, 17, 0, 'dualchart-note-text').addTo(res);
    return res;
};

vchart.creator.dualchart.prototype.initBackComp = function () {
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




vchart.creator.dualchart.prototype.updateBackComp = function () {
    this.super();
    this.oxyBottom = this.canvasHeight - 25;

    var $notes = this.$lineNotes.concat(this.$arealNotes);

    var notesWidth = $notes.reduce(function (noteWidth, $lineNote) {
        return noteWidth + $lineNote.getBBox().width + 15;
    }.bind(this), 0);

    $notes.reduce(function (x, $line) {
        $line.attr('transform', vchart.tl.translate(x, this.canvasHeight - 5));
        return x + $line.getBBox().width + 15;
    }.bind(this), (this.canvasWidth - notesWidth) / 2);

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
            e.attr('transform', vchart.tl.translate((i + 0.5) * this.oxSegmentLength - 5, 12));
            e.$text.attr('transform', vchart.tl.rotate(45));

        }.bind(this));
        this.oxyBottom -= maxKeyNameWidth / 1.4 + 12;
    }
    else {
        this.$keyNames.forEach(function (e, i) {
            e.attr('transform', vchart.tl.translate((i + 0.5) * this.oxSegmentLength, 12));
            e.$text.attr('text-anchor', 'middle');

        }.bind(this));
        this.oxyBottom -= 30;
    }

    //reupdate because update oxybottom
    this.super();
};



vchart.creator.dualchart.prototype.initComp = function () {
    
    this.$areas = this.areas.map(function (line, i) {
        return this._createArea(line, this.colors[i + this.lines.length]).addTo(this.$content);
    }.bind(this));
    this.$lines = this.lines.map(function (line, i) {
        return this._createLine(line, this.colors[i]).addTo(this.$content);
    }.bind(this));

};



vchart.creator.dualchart.prototype.updateComp = function () {
    this.$lines.map(function ($line, i) {
        var line = this.lines[i];
        var line = this.lines[i];
        $line.$plots.forEach(function ($plot, j) {
            var value = line.values[j];
            $plot.attr({
                cx: this.oxSegmentLength * (j + 0.5),
                cy: this.mapOYValue(value)
            });
        }.bind(this));

        var d = 'M';
        if (this.keys.length == 1) {
            var y = this.mapOYValue(line.values[0]);
            var x = this.oxSegmentLength * (0.25);
            d += x + ' ' + y + 'L';
        }

        d += line.values.reduce(function (ac, value, j) {
            var y = this.mapOYValue(value);
            var x = this.oxSegmentLength * (j + 0.5);
            ac.result.push(x + ' ' + y);
            ac.x0 = x;
            ac.y0 = y;
            return ac;
        }.bind(this), { result: [] }).result.join('L');

        if (this.keys.length == 1) {
            var y = this.mapOYValue(line.values[0]);
            var x = this.oxSegmentLength * (0.75);
            d += "L" + x + ' ' + y;
        }

        $line.$path.attr('d', d);
    }.bind(this));

    this.$areas.map(function ($area, i) {
        var values = this.areas[i].values;
        $area.begin();

        $area
            .moveTo(this.oxSegmentLength * (values.length - (this.keys.length == 1 ? 0.25 : 0.5)), -1)
            .lineTo(this.oxSegmentLength * (this.keys.length == 1 ? 0.25 : 0.5), -1);
        if (this.keys.length == 1) {
            $area.lineTo(this.oxSegmentLength * 0.25, this.mapOYValue(values[0]))
        }
        for (var i = 0; i < values.length; ++i) {
            $area.lineTo(this.oxSegmentLength * (i + 0.5), this.mapOYValue(values[i]))
        }

        if (this.keys.length == 1) {
            $area.lineTo(this.oxSegmentLength * 0.75, this.mapOYValue(values[0]))
        }
        $area.closePath().end();
    }.bind(this));

};

Object.keys(vchart.creator.linechart.prototype)
    .filter(function (key) {
        return !vchart.creator.dualchart.prototype[key]
    }).forEach(function (key) {
        vchart.creator.dualchart.prototype[key] = vchart.creator.linechart.prototype[key];
    });

