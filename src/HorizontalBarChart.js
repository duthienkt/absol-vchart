import Vcore from "./VCore";
import { rect, text, line, vline, moveHLine, moveVLine, generateBackgroundColors, getMaxWidthBox, calBeautySegment, map, lighterColor, hline, fresherColor } from "./helper";
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
    this._padding = 5;
    this._ox = 0;
    this._oy = 0;
    this._oxLength = 0;
    this._oyLength = 0;
    this._oyTop = 25;
    this._oxRight = this._padding;
    this._barWidth = 35;
    this._rangeWidth = 15;
    this._minValue = 0;
    this._maxValue = 10;
    this._keys = [];
    this._keyColors = [];
    this._barMargin = 5;
    this._zeroOY = true;
    this._maxSegment = 10;
    this._minRangeText = "Min";
    this._maxRangeText = "Max";

    /**
     * @type {import('./Axis').default}
     */
    this.$axis = $('axis', this);
    this.$title = $('text.vc-horizontal-bar-title', this);
    this.$whiteBoxMask = $('.base-chart-white-mask', this);
    this.$content = $('.vc-horizontal-bar-chart-content', this);

    this.$noteContainer = $('g.vc-horizontal-bar-note-container', this);
    this.$noteBox = $('.vc-horizontal-bar-vline-note-box', this);

    this.$oneBarNoteContainer = $('g.vc-horizontal-bar-one-bar-note-container', this);
    // this.$keysNoteContainer = $('g.vc-horizontal-bar-keys-note-container', this);

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
    this.$oneBarNoteContainer.$minText = text(this._minRangeText, 0, 14).addTo(this.$oneBarNoteContainer);
    this.$oneBarNoteContainer.$maxText = text(this._maxRangeText, 0, 14 + 10 + this._barWidth + 10 + 14).addTo(this.$oneBarNoteContainer);
    this.$oneBarNoteContainer.$bar = this.$oneBarNoteContainer.$bar
        || rect(0.5, 14 + 10 + 0.5, 100, this._barWidth - 1, 'vc-horizontal-bar-chart-bar').addTo(this.$oneBarNoteContainer);

    this.$oneBarNoteContainer.$range = this.$oneBarNoteContainer.$range
        || rect(80.5, 14 + 10 + Math.floor((this._barWidth - this._rangeWidth) / 2) + 0.5, 30, this._rangeWidth - 1, 'vc-horizontal-bar-chart-range').addTo(this.$oneBarNoteContainer);

    this.$oneBarNoteContainer.$minLine = vline(
        80.5,
        14 + 10 + Math.floor((this._barWidth - this._rangeWidth) / 3),
        - Math.floor((this._barWidth - this._rangeWidth) / 3) - 5,
        'vc-horizontal-bar-chart-range-min-line')
        .addTo(this.$oneBarNoteContainer);

    this.$oneBarNoteContainer.$maxLine = vline(
        80.5 + 30,
        14 + 10 + this._barWidth - Math.floor((this._barWidth - this._rangeWidth) / 2),
        Math.floor((this._barWidth - this._rangeWidth) / 2) + 8,
        'vc-horizontal-bar-chart-range-max-line'
    ).addTo(this.$oneBarNoteContainer);
};


HorizontalBarChart.prototype.updateOneBarNotePosition = function () {
    var minTextBox = this.$oneBarNoteContainer.$minText.getBBox();
    var maxTextBox = this.$oneBarNoteContainer.$maxText.getBBox();
    var maxTextLength = Math.max(minTextBox.width, maxTextBox.width);
    if (minTextBox.width / 2 > 80.5) {
        this.$oneBarNoteContainer.$bar.attr('x', Math.floor(maxTextLength / 2 - 80.5) + 0.5 + '');
        this.$oneBarNoteContainer.$range.attr('x', Math.floor(maxTextLength / 2 - 80.5) + 0.5 + 80 + '');

        moveVLine(this.$oneBarNoteContainer.$minLine,
            Math.floor(minTextBox.width / 2 - 80.5) + 0.5 + 80,
            14 + 10 + Math.floor((this._barWidth - this._rangeWidth) / 3),
            - Math.floor((this._barWidth - this._rangeWidth) / 3) - 5);

        moveVLine(this.$oneBarNoteContainer.$maxLine,
            Math.floor(minTextBox.width / 2 - 80.5) + 0.5 + 80 + 30,
            14 + 10 + this._barWidth - Math.floor((this._barWidth - this._rangeWidth) / 2),
            Math.floor((this._barWidth - this._rangeWidth) / 2) + 8,
        );
    }
    else {
        this.$oneBarNoteContainer.$minText.attr('x', 80.5 - minTextBox.width / 2);
        this.$oneBarNoteContainer.$maxText.attr('x', 80.5 + 30 - maxTextBox.width / 2);
    }
};


HorizontalBarChart.prototype.generateColor = function () {
    var colorLength = Math.max(this._keys.length, this._bars.length) + this._vLines.length;
    if (this._keyColors.length < colorLength) {
        this._keyColors = generateBackgroundColors(colorLength).map(function (c) {
            return fresherColor(c);
        });
    }
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
        return self._createVLineNote(vline.color || lighterColor(self._keyColors[self._keys.length + i], -0.2), vline.name + '').addTo(self.$vLinesNoteContainer).attr('transform', translate(0, i * 20));
    });
};


HorizontalBarChart.prototype.initNote = function () {
    this.initVLinesNote();
    this.initBarNote();

};

HorizontalBarChart.prototype.updateNotePosition = function () {
    this.updateOneBarNotePosition();
    var y = this._padding;
    var x = this._padding;
    this.$vLinesNoteContainer.attr('transform', translate(x, y));
    y += this.$vLinesNoteContainer.getBBox().height + 5 + this._padding;
    this.$oneBarNoteContainer.attr('transform', translate(this._padding, y));
    this.$noteBox.attr({
        width: '1',
        height: '1'
    })
    //align right
    var box = this.$noteContainer.getBBox();
    this.$noteBox.attr({
        width: box.width + this._padding - 1 + '',
        height: box.height + this._padding - 1 + ''
    })
    this.$noteContainer.attr('transform', translate(this._canvasWidth - this._padding - box.width - this._padding, this._canvasHeight / 3 - (box.height + this._padding) / 2));
    this._oxRight = this._canvasWidth - box.width - this._padding * 2;
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
    this.$vLines = this._vLines.map(function (vLineData, i) {
        return vline(0, 0, 0, 'vc-horizontal-bar-vline').addStyle('stroke', vLineData.color || lighterColor(self._keyColors[self._keys.length + i], -0.2)).addTo(self.$vLineContainer);
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
    this._ox = this._padding;
    this._oy = this._canvasHeight - this._padding;
    this._oxLength = this._oxRight - this._padding - this._ox;
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
    this.$title.attr('x', (this._oxRight + this._ox) / 2 + '');
};


HorizontalBarChart.prototype.updateAxisTextPosition = function () {
    var maxWidthKey = getMaxWidthBox.apply(null, this.$keys);
    this._ox = Math.ceil(maxWidthKey) + 0.5 + this._padding + 5;
    this._oxLength = this._oxRight - this._padding - this._ox;
    this._oy -= 21;
    this._oyLength = this._oy - this._padding - this._oyTop;
    var barMargin = Math.max(this._barMargin, (this._oyLength / this._keys.length - this._barWidth) / 2);
    var i;
    for (i = 0; i < this.$keys.length; ++i) {
        this.$keys[i].attr({ x: - 5, y: -(i + 0.5) * (barMargin * 2 + this._barWidth) + 7 });
        this.$bars[i].attr('y', - i * (barMargin * 2 + this._barWidth) - barMargin - this._barWidth);
        this.$ranges[i].attr('y', - i * (barMargin * 2 + this._barWidth) - barMargin - this._barWidth + Math.floor((this._barWidth - this._rangeWidth) / 2));
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
    this.updateNotePosition();
    this.updateAxisTextPosition();
    this.updateBarsPosition();
    this.updateRangesPosition();
    this.updateVLinesPosition();

    this.updateAxisPosition();
};

HorizontalBarChart.prototype.update = function () {
    this.generateColor();
    this.processData();
    this.initNote();
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
        this.notifyDataChange();
    },
    get: function () {
        return this._keys;
    }
};

HorizontalBarChart.property.bars = {
    set: function (value) {
        this._bars = value || [];
        this.notifyDataChange();
    },
    get: function () {
        return this._bars;
    }
};


HorizontalBarChart.property.ranges = {
    set: function (value) {
        this._ranges = value || [];
        this.notifyDataChange();
    },
    get: function () {
        return this._ranges;
    }
};


HorizontalBarChart.property.vLines = {
    set: function (value) {
        this._vLines = value || [];
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
};


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


HorizontalBarChart.property.minRangeText = {
    set: function (value) {
        this._minRangeText = value || '';
        this.notifyDataChange();
    },
    get: function () {
        return this._minRangeText;
    }
};


HorizontalBarChart.property.maxRangeText = {
    set: function (value) {
        this._maxRangeText = value || '';
        this.notifyDataChange();
    },
    get: function () {
        return this._maxRangeText;
    }
};


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
            'g.vc-horizontal-bar-segment-text-container',
            'g.vc-horizontal-bar-vline-container',
            {
                class: 'vc-horizontal-bar-note-container',
                child: [
                    rect(0.5, 0.5, 1, 1, 'vc-horizontal-bar-vline-note-box'),
                    'g.vc-horizontal-bar-vline-note-container',
                    'g.vc-horizontal-bar-one-bar-note-container'
                ]
            },
            'text.vc-horizontal-bar-title[y="20"]',
            'sattachhook'
        ]
    });
};

Vcore.install('HorizontalBarChart'.toLowerCase(), HorizontalBarChart);

export default HorizontalBarChart;


