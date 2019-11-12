import Vcore from "./VCore";
import { rect, text, line, vline, moveHLine, moveVLine, generateBackgroundColors, getMaxWidthBox, calBeautySegment, map, lighterColor, hline } from "./helper";
import { translate } from "./template";
import Dom from "absol/src/HTML5/Dom";

var _ = Vcore._;
var $ = Vcore.$;


function HorizontalBarChart() {
    var self = this;
    this._bars = [];
    this._vLines = [];
    this._title = '';
    this._ranges = [];

    this._includeValues = [];

    this._dataUpdateTimeout = -1;
    this._ox = 0;
    this._oy = 0;
    this._oxLength = 0;
    this._oyLength = 0;
    this._oyTop = 25;
    this._padding = 5;
    this._barWidth = 35;
    this._rangeWidth = 15;
    this._minValue = 0;
    this._maxValue = 10;
    this._keys = [];
    this._keyColors = [];
    this._barMargin = 10;
    this._zeroOY = true;
    this._maxSegment = 10;

    /**
     * @type {import('./Axis').default}
     */
    this.$axis = $('axis', this);
    this.$title = $('text.vc-horizontal-bar-title', this);
    this.$whiteBoxMask = $('.base-chart-white-mask', this);
    this.$content = $('.vc-horizontal-bar-chart-content', this);
    this.$oneBarNoteContainer = $('g.vc-horizontal-bar-one-bar-note-container', this);
    this.$keysNoteContainer = $('g.vc-horizontal-bar-keys-note-container', this);
    this.$vLinesNoteContainer = $('g.vc-horizontal-bar-vline-note-container', this);
    this.$segmentTextContainer = $('g.vc-horizontal-bar-segment-text-container', this);
    this.$vLineContainer = $('g.vc-horizontal-bar-vline-container', this);
    this.$valueLineContainer = $('.vc-horizontal-bar-chart-value-line-container', this);
    this.$keys = [];
    this.$segmentTexts = [];
    this.$valueLines = [];
    this.$bars = [];
    this.$ranges = [];
    this.$vLines = [];
    this.$attachhook = $("sattachhook", this).on('error', function (error) {
        this.updateSize = this.updateSize || self.updatePosition.bind(self);
        Dom.addToResizeSystem(this);
    });
    this.sync = new Promise(function (rs) {
        self.$attachhook.on('error', rs);
    });
    this.sync.then(this.notifyDataChange.bind(this));
}


HorizontalBarChart.prototype.processData = function () {
    this._minValue = this._bars.concat(this._includeValues).reduce(function (ac, cr) {
        return Math.min(ac, cr);
    }, 10000000);

    this._minValue = this._ranges.reduce(function (ac, cr) {
        return Math.min(ac, cr[0], cr[1]);
    }, this._minValue);

    this._maxValue = this._bars.concat(this._includeValues).reduce(function (ac, cr) {
        return Math.max(ac, cr);
    }, -10000000);

    this._maxValue = this._ranges.reduce(function (ac, cr) {
        return Math.max(ac, cr[1], cr[0]);
    }, this._maxValue);

    if (this._zeroOY)
        this._minValue = Math.min(0, this._minValue);
    this._beautiSegment = calBeautySegment(this._maxSegment, this._minValue, this._maxValue);
};

HorizontalBarChart.prototype.initBarNote = function () {
    this.$oneBarNoteContainer.$minText = text('Điểm đánh giá tối thiểu', 0, 14).addTo(this.$oneBarNoteContainer);
    this.$oneBarNoteContainer.$maxText = text('Điểm đánh giá tối đa', 111, 14).addTo(this.$oneBarNoteContainer);
    this.$oneBarNoteContainer.$bar = this.$oneBarNoteContainer.$bar
        || rect(0.5, 25.5, 100, this._barWidth, 'vc-horizontal-bar-chart-bar').addTo(this.$oneBarNoteContainer);
    this.$oneBarNoteContainer.$range = this.$oneBarNoteContainer.$range
        || rect(80.5, 25.5 + Math.floor((this._barWidth - this._rangeWidth) / 3) + 0.5, 30, this._rangeWidth, 'vc-horizontal-bar-chart-range').addTo(this.$oneBarNoteContainer);
    this.$oneBarNoteContainer.$minLine = vline(80.5, 8 + Math.floor((this._barWidth - this._rangeWidth) / 3), 17.5 - 2, 'vc-horizontal-bar-chart-range-min-line').addTo(this.$oneBarNoteContainer);
    this.$oneBarNoteContainer.$maxLine = vline(80.5 + 30, 8 + Math.floor((this._barWidth - this._rangeWidth) / 3), 17.5 - 2, 'vc-horizontal-bar-chart-range-min-line').addTo(this.$oneBarNoteContainer);
};


HorizontalBarChart.prototype.updateOneBarNotePosition = function () {
    var minTextBox = this.$oneBarNoteContainer.$minText.getBBox();
    if (minTextBox.width + 2 > 80.5) {
        this.$oneBarNoteContainer.$bar.attr('x', Math.floor(minTextBox.width - 80.5) + 0.5 + 2 + '');
        this.$oneBarNoteContainer.$range.attr('x', Math.floor(minTextBox.width - 80.5) + 0.5 + 80 + 2 + '');
        this.$oneBarNoteContainer.$maxText.attr('x', Math.floor(minTextBox.width - 80.5) + 0.5 + 80 + 30 + 2 + 2 + '');
        moveVLine(this.$oneBarNoteContainer.$minLine, Math.floor(minTextBox.width - 80.5) + 0.5 + 80 + 2, 8 + Math.floor((this._barWidth - this._rangeWidth) / 3), 27.5 - 2);
        moveVLine(this.$oneBarNoteContainer.$maxLine, Math.floor(minTextBox.width - 80.5) + 0.5 + 80 + 30 + 2, 8 + Math.floor((this._barWidth - this._rangeWidth) / 3), 27.5 - 2);
    }
    else {
        this.$oneBarNoteContainer.$minText.attr(x, 80.5 - 2 - minTextBox.width);
        this.$oneBarNoteContainer.$maxText.attr(x, 80.5 + 2 + 30);
    }
    var bbox = this.$oneBarNoteContainer.getBBox();
    this.$oneBarNoteContainer.attr('transform', translate(this._padding, this._canvasHeight - this._padding - bbox.height - 5));
    this._oy = this._canvasHeight - this._padding - bbox.height - 20;
    this._oyLength = this._oy - this._padding - this._oyTop;
};


HorizontalBarChart.prototype._createKeyNote = function (color, keyName) {
    return _({
        class: 'vc-horizontal-bar-key-note',
        child: [
            rect(0, 0, 14, 14).addStyle('fill', color),
            text(keyName, 17, 12)
        ]
    });
};

HorizontalBarChart.prototype._createVLineNote = function (color, keyName) {
    return _({
        class: 'vc-horizontal-bar-vline-note',
        child: [
            hline(0, 7, 20).addStyle('stroke', color),
            text(keyName, 25, 12)
        ]
    });
};




HorizontalBarChart.prototype.initKeysNote = function () {
    var self = this;
    this.$keysNoteContainer.clearChild();
    this.$keyNotes = this._keys.map(function (text, i) {
        var color = self._keyColors[i];
        return self._createKeyNote(color, text).addTo(self.$keysNoteContainer);
    });
};

HorizontalBarChart.prototype.initVLinesNote = function () {
    var self = this;
    this.$vLinesNoteContainer.clearChild();
    this.$vLineNotes = this._vLines.map(function (vline, i) {
        return self._createVLineNote(vline.color, vline.name + '').addTo(self.$vLinesNoteContainer);
    });
};


HorizontalBarChart.prototype.initAxisText = function () {
    while (this.$keys.length < this._keys.length) {
        this.$keys.push(text('', 0, 0, 'vc-horizontal-bar-chart-key').addTo(this.$content));
    }

    while (this.$keys.length > this._keys.length) {
        this.$keys.pop().remove();
    }
    for (var i = 0; i < this._keys.length; ++i) {
        this.$keys[i].innerHTML = this._keys[i];
    }

    while (this.$segmentTexts.length > this._beautiSegment.segmentCount + 1) {
        this.$segmentTexts.pop().remove();
    }

    while (this.$segmentTexts.length < this._beautiSegment.segmentCount + 1) {
        this.$segmentTexts.push(text('', 0, 0, 'vc-horizontal-bar-chart-segment-text').addTo(this.$segmentTextContainer));
    }

    for (var i = 0; i < this.$segmentTexts.length; ++i) {
        this.$segmentTexts[i].innerHTML = this._beautiSegment.minValue + this._beautiSegment.step * i + '';
    }

    this.$valueLineContainer.clearChild();
    this.$valueLines = Array(this.$segmentTexts.length - 1).fill(0).map(function () {
        return vline(0, 0, 0, 'vc-horizontal-bar-chart-value-line').addTo(this.$valueLineContainer);
    }.bind(this));

};

HorizontalBarChart.prototype.initBars = function () {
    while (this.$bars.length < this._bars.length) {
        this.$bars.push(rect(0, 0, 0, this._barWidth, 'vc-horizontal-bar-chart-bar').addTo(this.$content));
    }
    while (this.$bars.length > this._bars.length) {
        this.$bars.pop().remove();
    }
    for (var i = 0; i < this.$bars.length; ++i) {
        this.$bars[i].addStyle('fill', this._keyColors[i]);
    }
};

HorizontalBarChart.prototype.initRanges = function () {
    while (this.$ranges.length < this._ranges.length) {
        this.$ranges.push(rect(0, 0, 0, this._rangeWidth, 'vc-horizontal-bar-chart-range').addTo(this.$content));
    }
    while (this.$ranges.length > this._ranges.length) {
        this.$ranges.pop().remove();
    }
    for (var i = 0; i < this.$ranges.length; ++i) {
        this.$ranges[i].addStyle('fill', lighterColor(this._keyColors[i], 0.3));
    }
};


HorizontalBarChart.prototype.initVLines = function () {
    var self = this;
    this.$vLineContainer.clearChild();
    this.$vLines = this._vLines.map(function (vLineData) {
        return vline(0, 0, 0, 'vc-horizontal-bar-vline').addStyle('stroke', vLineData.color).addTo(self.$vLineContainer);
    });
};


HorizontalBarChart.prototype.notifyDataChange = function () {
    if (this._dataUpdateTimeout >= 0) return;
    var self = this;
    this._dataUpdateTimeout = setTimeout(function () {
        self.update();
        self._dataUpdateTimeout = -1;
    });
};

HorizontalBarChart.prototype.updateCanvasSize = function () {
    var bound = this.getBoundingClientRect();
    this._canvasHeight = this.__canvasHeight;
    this._canvasWidth = this.__canvasWidth;
    if (!(this._canvasWidth > 0)) {
        this._canvasWidth = bound.width;
    }
    if (!(this._canvasHeight > 0)) {
        this._canvasHeight = bound.height;
    }
    this.attr('width', this._canvasWidth + '');
    this.attr('height', this._canvasHeight + '');

    this._oyTop = 25 + this.$title.getBBox().height * 1.5;
    this.$title.attr('x', this._canvasWidth / 2);
    this._ox = this._padding;
    this._oy = this._canvasHeight - this._padding;
    this._oxLength = this._canvasWidth - this._padding - this._ox - 25;
    this._oyLength = this._oy - this._padding - this._oyTop;
};


HorizontalBarChart.prototype.updateKeysNotePosition = function () {
    var maxWidth = getMaxWidthBox.apply(null, this.$keyNotes);
    var boundWidth = this._canvasWidth - this._padding * 2;
    var noteSpacing = 25;
    var rows = 1;
    var eltPerRow;
    while (rows <= this.$keyNotes.length) {
        eltPerRow = Math.ceil(this.$keyNotes.length / rows);
        if (eltPerRow * (maxWidth + noteSpacing) - noteSpacing < boundWidth) break;
        ++rows;
    }

    noteSpacing = Math.min(100, (boundWidth - maxWidth * eltPerRow) / Math.max(1, eltPerRow - 1));
    var i = 0;
    var keyNoteElt;
    for (var r = 0; r < rows; ++r)
        for (var c = 0; c < eltPerRow; ++c) {
            if (i >= this.$keyNotes.length) break;
            keyNoteElt = this.$keyNotes[i++];
            keyNoteElt.attr('transform', translate(this._padding + c * (maxWidth + noteSpacing), r * 21));
        }

    var bbox = this.$keysNoteContainer.getBBox();
    this.$keysNoteContainer.attr('transform', translate((this._canvasWidth - bbox.width) / 2, this._oy - bbox.height));
    this._oy -= bbox.height + 5;
    this._oyLength = this._oy - this._padding - this._oyTop;
};


HorizontalBarChart.prototype.updateVLinesNotePosition = function () {
    var maxWidth = getMaxWidthBox.apply(null, this.$vLineNotes);
    var boundWidth = this._canvasWidth - this._padding * 2;
    var noteSpacing = 25;
    var rows = 1;
    var eltPerRow;
    while (rows <= this.$vLineNotes.length) {
        eltPerRow = Math.ceil(this.$vLineNotes.length / rows);
        if (eltPerRow * (maxWidth + noteSpacing) - noteSpacing < boundWidth) break;
        ++rows;
    }

    noteSpacing = Math.min(100, (boundWidth - maxWidth * eltPerRow) / Math.max(1, eltPerRow - 1));
    var i = 0;
    var vLineNoteElt;
    for (var r = 0; r < rows; ++r)
        for (var c = 0; c < eltPerRow; ++c) {
            if (i >= this.$vLineNotes.length) break;
            vLineNoteElt = this.$vLineNotes[i++];
            vLineNoteElt.attr('transform', translate(this._padding + c * (maxWidth + noteSpacing), r * 21));
        }

    var bbox = this.$vLinesNoteContainer.getBBox();
    this.$vLinesNoteContainer.attr('transform', translate((this._canvasWidth - bbox.width) / 2, this._oy - bbox.height));
    this._oy -= bbox.height + 5;
    this._oyLength = this._oy - this._padding - this._oyTop;
};


HorizontalBarChart.prototype.updateAxisPosition = function () {
    this.$axis.moveTo(this._ox - 0.5, this._oy - 0.5);
    this.$axis.resize(this._oxLength + 15, this._oyLength + 10);
    this.$whiteBoxMask.attr('d', 'M0,0  0,cvh cvw,cvh cvw,0zMleft,top  left,bottom right,bottom right,topz'
        .replace(/cvh/g, this._canvasHeight)
        .replace(/cvw/g, this._canvasWidth)
        .replace(/left/g, this._padding)
        .replace(/top/g, 10)
        .replace(/bottom/g, this._oy)
        .replace(/right/g, this._canvasWidth - 10)
    );
};


HorizontalBarChart.prototype.updateAxisTextPosition = function () {
    var maxWidthKey = getMaxWidthBox.apply(null, this.$keys);
    this._ox = Math.ceil(maxWidthKey) + 0.5 + this._padding + 5;
    this._oxLength = this._canvasWidth - this._padding - this._ox - 25;
    this._oy -= 21;
    this._oyLength = this._oy - this._padding - this._oyTop;
    var barMargin = Math.max(this._barMargin, (this._oyLength / this._keys.length - this._barWidth) / 2);
    var i;
    for (i = 0; i < this.$keys.length; ++i) {
        this.$keys[i].attr({ x: - 5, y: -(i + 0.5) * (barMargin * 2 + this._barWidth) + 7 });
        this.$bars[i].attr('y', - i * (barMargin * 2 + this._barWidth) - barMargin - this._barWidth);
        this.$ranges[i].attr('y', - i * (barMargin * 2 + this._barWidth) - barMargin - this._barWidth + Math.floor((this._barWidth - this._rangeWidth) / 3));
    }

    this._segmentLength = this._oxLength / this._beautiSegment.segmentCount;

    for (i = 0; i < this.$segmentTexts.length; ++i) {
        this.$segmentTexts[i].attr({
            x: this._ox + this._segmentLength * i,
            y: this._oy + 18
        })
    }

    for (i = 0; i < this.$valueLines.length; ++i) {
        moveVLine(this.$valueLines[i], this._ox + this._segmentLength * (i + 1), this._oy - this._oyLength, this._oyLength);
    }

    this.$content.attr('transform', translate(this._ox, this._oy));
};


HorizontalBarChart.prototype.updateBarsPosition = function () {
    for (var i = 0; i < this.$bars.length; ++i) {
        this.$bars[i].attr('width', map(this._bars[i], this._beautiSegment.minValue, this._beautiSegment.maxValue, 0, this._oxLength));
    }
};


HorizontalBarChart.prototype.updateRangesPosition = function () {
    var left, right, range;
    for (var i = 0; i < this.$bars.length; ++i) {
        range = this._ranges[i];
        left = map(range[0], this._beautiSegment.minValue, this._beautiSegment.maxValue, 0, this._oxLength)
        right = map(range[1], this._beautiSegment.minValue, this._beautiSegment.maxValue, 0, this._oxLength)
        this.$ranges[i].attr({ width: right - left + '', x: left + '' });
    }
};

HorizontalBarChart.prototype.updateVLinesPosition = function () {
    for (var i = 0; i < this.$vLines.length; ++i) {
        moveVLine(this.$vLines[i], this._ox + map(this._vLines[i].value, this._beautiSegment.minValue, this._beautiSegment.maxValue, 0, this._oxLength), this._oy - this._oyLength, this._oyLength)
    }
};

HorizontalBarChart.prototype.updatePosition = function () {
    this.updateCanvasSize();
    this.updateOneBarNotePosition();
    // this.updateKeysNotePosition();
    this.updateVLinesNotePosition();
    this.updateAxisTextPosition();
    this.updateBarsPosition();
    this.updateRangesPosition();
    this.updateVLinesPosition();

    this.updateAxisPosition();
};

HorizontalBarChart.prototype.update = function () {
    this.processData();
    this.initBarNote();
    // this.initKeysNote();
    this.initVLinesNote();
    this.initAxisText();
    this.initBars();
    this.initRanges();
    this.initVLines();

    this.updatePosition();
};


HorizontalBarChart.property = {};


HorizontalBarChart.property.canvasWidth = {
    set: function (value) {
        if (value >= 0) {
            this.attr('width', undefined);
            this.__canvasWidth = value;
        }
        else {
            this._canvasWidth = -1;
        }
        this.notifyDataChange();
    },
    get: function () {
        return this.__canvasWidth;
    }
};

HorizontalBarChart.property.canvasHeight = {
    set: function (value) {
        if (value >= 0) {
            this.attr('height', undefined);
            this.__canvasHeight = value;
        }
        else {
            this.__canvasHeight = -1;
        }
        this.notifyDataChange();
    },
    get: function () {
        return this.__canvasHeight;
    }
};

HorizontalBarChart.property.keys = {
    set: function (value) {
        this._keys = value || [];
        if (this._keyColors.length < this._keys.length) {
            this._keyColors = generateBackgroundColors(this._keys.length);
        }

        this.notifyDataChange();
    },
    get: function () {
        return this._keys;
    }

};

HorizontalBarChart.property.bars = {
    set: function (value) {
        this._bars = value || [];
        if (this._keyColors.length < this._bars.length) {
            this._keyColors = generateBackgroundColors(this._bars.length);
        }

        this.notifyDataChange();
    },
    get: function () {
        return this._bars;
    }
}

HorizontalBarChart.property.ranges = {
    set: function (value) {
        this._ranges = value || [];
        if (this._keyColors.length < this._ranges.length) {
            this._keyColors = generateBackgroundColors(this._ranges.length);
        }

        this.notifyDataChange();
    },
    get: function () {
        return this._ranges;
    }
};


HorizontalBarChart.property.vLines = {
    set: function (value) {
        this._vLines = value || [];
        if (this._keyColors.length < this._vLines.length) {
            this._keyColors = generateBackgroundColors(this._vLines.length);
        }

        this.notifyDataChange();
    },
    get: function () {
        return this._vLines;
    }
};

HorizontalBarChart.property.includeValues = {
    set: function (value) {
        this._includeValues = value || [];
        this.notifyDataChange();
    },
    get: function () {
        return this._includeValues;
    }
};


HorizontalBarChart.property.maxSegment = {
    set: function (value) {
        this._maxSegment = value || 10;
    },
    get: function () {
        return this._maxSegment;
    }
}

HorizontalBarChart.property.title = {
    set: function (value) {
        this._title = value || '';
        this.$title.innerHTML = this._title;
        this.notifyDataChange();
    },
    get: function () {
        return this._title;
    }
};


HorizontalBarChart.render = function () {
    return _({
        tag: 'svg',
        class: ['vc-horizontal-bar-chart', 'base-chart'],
        child: [
            '.vc-horizontal-bar-chart-value-line-container',
            '.vc-horizontal-bar-chart-content',
            {
                tag: 'path',
                class: 'base-chart-white-mask',
                attr: {
                    fill: 'white',
                    stroke: 'white',
                    'fill-rule': 'evenodd',
                    d: 'M0,0  0,2000 2000,2000 2000,0zM100,100  100,200 200,200 200,100z'
                }
            },
            'axis',
            'g.vc-horizontal-bar-one-bar-note-container',
            'g.vc-horizontal-bar-keys-note-container',
            'g.vc-horizontal-bar-segment-text-container',
            'g.vc-horizontal-bar-vline-container',
            'g.vc-horizontal-bar-vline-note-container',
            'text.vc-horizontal-bar-title[y="20"]',
            'sattachhook'
        ]
    });
};

Vcore.install('HorizontalBarChart'.toLowerCase(), HorizontalBarChart);

export default HorizontalBarChart;


