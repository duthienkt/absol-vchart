import VCore, {_, $} from "./VCore";
import {isNumber, text, circle, hline, calBeautySegment, map} from "./helper";
import {showTooltip, closeTooltip} from "./ToolTip";
import {translate, rotate} from "./template";
import {ChartTitleController} from "./BChart";
import GContainer from "absol-svg/js/svg/GContainer";
import SvgCanvas from "absol-svg/js/svg/SvgCanvas";
import {isRealNumber} from "absol-acomp/js/utils";
import {KeyNoteGroup} from "./KeyNote";
import Turtle from "absol-svg/js/controller/Turtle";
import TextMeasure from "absol-acomp/js/TextMeasure";
import {numberToString} from "absol/src/Math/int";
import Color from "absol/src/Color/Color";


function LineChart() {
    this.titleCtrl = new ChartTitleController(this);
}

LineChart.tag = 'LineChart'.toLowerCase();

LineChart.render = function () {
    return _('basechart', true);
};


LineChart.prototype.processMinMax = function () {
    this.minValue = this.lines.reduce(function (minValue, line) {
        return line.values.reduce(function (minValue, value) {
            if (!isNumber(value)) return minValue;
            return Math.min(minValue, value);
        }, minValue);
    }, 1000000000);

    this.maxValue = this.lines.reduce(function (maxValue, line) {
        return line.values.reduce(function (maxValue, value) {
            if (!isNumber(value)) return maxValue;

            return Math.max(maxValue, value);
        }, maxValue);
    }, -1000000000);
    if (this.minValue > this.maxValue) {
        this.minValue = 0;
        this.maxValue = this.minValue + 10;
    }
};

LineChart.prototype._createLineNote = function (name, color) {
    var res = _('g');
    res.$line = hline(0, -5, this.noteLineLength, 'line-chart-line').addStyle('stroke', color).addTo(res);
    res.$name = text(name, this.noteLineLength + 5, 0).addTo(res);
    return res;
};

LineChart.prototype._createKeyName = function (key) {
    var res = _('g');
    res.$text = text(key, 0, 5).addTo(res);
    return res;
};

LineChart.prototype._createLine = function (line, color) {
    var res = _({
        tag: 'g',
        style: {
            fill: color,
            stroke: color
        }
    });
    res.$path = _('shape.line-chart-line').addTo(res);
    res.$plots = line.values.map(function (u, i) {

        var plot = circle(0, 0, this.plotRadius, 'line-chart-plot').addTo(res)
        var text = line.texts && line.texts[i];
        if (text) plot.attr('title', text);
        // .on('mouseenter', function (event) {
        // var text = line.texts && line.texts[i];
        // if (!text) return;
        //
        // var currentBound = this.getBoundingClientRect();
        //
        // showTooltip(text, (currentBound.left + currentBound.right) / 2, (currentBound.top + currentBound.bottom) / 2).then(function (token) {
        //     this.once('mouseleave', function () {
        //         setTimeout(function () {
        //             closeTooltip(token);
        //         }, 1000);
        //     });
        // }.bind(this));
        // });
        if (line.plotColors && line.plotColors[i]) {
            plot.addStyle('fill', line.plotColors[i]);
        }
        return plot;
    }.bind(this));
    return res;
};


LineChart.prototype.initBackComp = function () {
    this.super();
    this.colors = this.lines.map(function (line, i, arr) {
        if (line.color) return line.color;
        return this.colorTable[Math.floor(this.colorTable.length * i / arr.length)];
    }.bind(this));

    this.$lineNotes = this.lines.map(function (line, i) {
        return this._createLineNote(line.name, this.colors[i]).addTo(this);
    }.bind(this));

    this.$keyNames = this.keys.map(function (key) {
        return this._createKeyName(key).addTo(this.$content);
    }.bind(this));
};


LineChart.prototype.updateBackComp = function () {
    this.super();
    this.oxyBottom = this.canvasHeight - 25;

    var lineNoteWidth = this.$lineNotes.reduce(function (lineNoteWidth, $lineNote) {
        return lineNoteWidth + $lineNote.getBBox().width + 15;
    }.bind(this), 0);

    this.$lineNotes.reduce(function (x, $lineNote) {
        $lineNote.attr('transform', translate(x, this.canvasHeight - 5));
        return x + $lineNote.getBBox().width + 15;
    }.bind(this), (this.canvasWidth - lineNoteWidth) / 2);

    var maxKeyNameWidth = this.$keyNames.reduce(function (w, $keyName) {
        return Math.max(w, $keyName.$text.getBBox().width);
    }, 0);

    this.oxSegmentLength = this.oxLength / this.keys.length;
    this.oxContentLength = this.oxLength;
    if (this.oxSegmentLength < maxKeyNameWidth + this.keyPaddingH * 2) {
        this.rotateText = true;
    } else if (this.minOXSegmentLength > this.oxSegmentLength) {
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
    } else {
        this.$keyNames.forEach(function (e, i) {
            e.attr('transform', translate((i + 0.5) * this.oxSegmentLength, 12));
            e.$text.attr('text-anchor', 'middle');

        }.bind(this));
        this.oxyBottom -= 30;
    }


    //reupdate because update oxybottom
    this.super();
};


LineChart.prototype.initComp = function () {
    this.$lines = this.lines.map(function (line, i) {
        return this._createLine(line, this.colors[i]).addTo(this.$content);
    }.bind(this));
};


LineChart.prototype.updateComp = function () {
    this.$lines.map(function ($line, i) {
        var line = this.lines[i];
        $line.$plots.forEach(function ($plot, j) {
            $plot.attr('display');
            var value = line.values[j];
            if (isNumber(value)) {
                $plot.attr({
                    cx: this.oxSegmentLength * (j + 0.5),
                    cy: this.mapOYValue(value)
                });
            } else {
                $plot.attr('display', 'none');
            }
        }.bind(this));


        $line.$path.begin();
        line.values.reduce(function (state, value, j) {

            if (line.length == 1) {
                if (!isNumber(value)) return 'NOT_START';
                var y = this.mapOYValue(value);
                var x = this.oxSegmentLength * (j);
                $line.$path.moveTo(x, y);
                x = this.oxSegmentLength * (j + 1);
                $line.$path.lineTo(x, y);
                return "IN_LINE";
            }

            if (state == "NOT_START") {
                if (!isNumber(value)) return 'NOT_START';

                var y = this.mapOYValue(value);
                var x = this.oxSegmentLength * (j + 0.5);
                $line.$path.moveTo(x, y);
                return 'IN_LINE';
            } else if (state == 'IN_LINE') {
                if (!isNumber(value)) return 'NOT_START';
                var y = this.mapOYValue(value);
                var x = this.oxSegmentLength * (j + 0.5);
                $line.$path.lineTo(x, y);
                return 'IN_LINE';
            }
            return ac;
        }.bind(this), "NOT_START");

        $line.$path.end();
    }.bind(this));
};


LineChart.prototype.preInit = function () {
    this.super();
    this.rotateText = true;
    this.noteLineLength = 40;
    this.plotRadius = 6;
    this.keyPaddingH = 4;
    this.minOXSegmentLength = 25;
    this.colorTable = ['#821616', '#824116', '#826C16', '#6C8216', '#418216', '#168216',
        '#168241', '#16826C', '#166C82', '#164182', '#161682', '#411682', '#6C1682',
        '#82166C', '#821641'];
    this.lines = [];
};


VCore.install(LineChart);
export default LineChart;

/**
 * @extends SvgCanvas
 * @constructor
 */
export function LineChart2() {
    this.titleCtrl = new ChartTitleController(this);
    this.$title = $('.vc-title', this);
    /**
     *
     * @type {KeyNoteGroup}
     */
    this.$keyNoteGroup = $(KeyNoteGroup.tag, this);
    this.$keyNoteGroup.on({
        enteritem: this.eventHandler.enterNote,
        leaveitem: this.eventHandler.leaveNote
    })
    this.$oyLabelCtn = $('.vc-oy-label-ctn', this);
    this.$body = $('.vc-body', this);
    this.$keyCtn = $('.vc-key-ctn', this);
    this.$oxy = $('.vc-oxy', this);
    this.$oxyArrow = $('.vc-oxy-arrow', this);
    this.$content = $('.vc-content', this);
    this.$valueName = $('.vc-value-name', this);
    this.$keyName = $('.vc-key-name', this);
    this.$lines = [];
    this.cpData = {
        min: 0,
        max: 1,
        oyLabelLength: 0,
        keyNameWidth: 0,
        valueNameWidth:0
    };
    this.$keys = [];
    /**
     * @type {{name: string, values: number[], texts: string[], color: string, plotColors: (string|Color)[]}[]}
     * @name lines
     * @memberof LineChart2#
     */
    /**
     * * @type {string[]}
     * @name keys
     */
    /**
     * * @type {boolean}
     * @name zeroOY
     * @memberof LineChart2#
     */
    /**
     * * @type {string}
     * @name keyName
     * @memberof LineChart2#
     */

    /**
     * * @type {string}
     * @name valueName
     * @memberof LineChart2#
     */
}

LineChart2.tag = 'LineChart2'.toLowerCase();

LineChart2.render = function () {
    return _({
        tag: SvgCanvas,
        class: ['vc-chart', 'vc-line-chart'],
        child: [
            {
                tag: 'text',
                class: 'vc-title',
                child: {text: ""}
            },
            {
                tag: GContainer,
                class: 'vc-body',
                child: [
                    {
                        tag: 'path',
                        class: 'vc-oxy',
                    },
                    {
                        tag: 'path',
                        class: 'vc-oxy-arrow',
                    },
                    {
                        tag: 'text',
                        class: 'vc-value-name',
                        child: {text: ''}

                    },
                    {
                        tag: 'text',
                        class: 'vc-key-name',
                        child: {text: ''}
                    },
                    {
                        tag: GContainer,
                        class: 'vc-oy-label-ctn'
                    },
                    {
                        tag: GContainer,
                        class: 'vc-key-ctn'
                    },
                    {
                        tag: GContainer,
                        class: 'vc-content'
                    }
                ]
            },
            {
                tag: KeyNoteGroup
            }
        ]
    });
};

LineChart2.prototype.colorTable =  [
    "#FF0000", "#00FFFF", "#00FF00", "#FF00FF", "#0000FF", "#FFFF00", "#800000", "#008080",
    "#808000", "#800080", "#008000", "#000080", "#FFC0CB", "#00CED1", "#ADFF2F", "#FF1493",
    "#1E90FF", "#FFD700", "#DC143C", "#20B2AA", "#7FFF00", "#C71585", "#4169E1", "#FFA500",
    "#8B0000", "#40E0D0", "#BDB76B", "#DA70D6", "#87CEFA", "#FF8C00", "#A52A2A", "#48D1CC",
    "#9ACD32", "#FF69B4", "#4682B4", "#FFA07A", "#B22222", "#5F9EA0", "#556B2F", "#DDA0DD",
    "#6495ED", "#FF7F50", "#A52A2A", "#66CDAA", "#6B8E23", "#BA55D3", "#7B68EE", "#FF6347",
    "#B22222", "#20B2AA", "#808000", "#9932CC", "#4169E1", "#FF4500", "#CD5C5C", "#3CB371",
    "#B8860B", "#8A2BE2", "#6A5ACD", "#FF8C00", "#8B4513", "#2E8B57", "#DAA520", "#9400D3",
    "#7B68EE", "#FF4500", "#A0522D", "#2F4F4F", "#D2691E", "#8B008B", "#7CFC00", "#BC8F8F",
    "#191970", "#FFD700", "#F08080", "#006400", "#B0C4DE", "#DC143C", "#90EE90", "#778899",
    "#FA8072", "#228B22", "#708090", "#E9967A", "#32CD32", "#778899", "#FFA07A", "#98FB98",
    "#00BFFF", "#F4A460", "#3CB371", "#D2B48C", "#00FA9A", "#DEB887", "#00FFFF", "#F5DEB3",
    "#00FF7F", "#F0E68C", "#00FF00", "#FFFFE0", "#7FFFD4", "#FFFACD", "#ADFF2F", "#FFE4B5"
];

LineChart2.prototype.paddingContent = 5;
LineChart2.prototype.plotRadius = 6;
LineChart2.prototype.integerOnly = false;

LineChart2.prototype.numberToString = function (value) {
    return numberToString(value);

}

LineChart2.prototype.requestUpdate = function () {
    if (this.pendingUpdate) return;
    this.pendingUpdate = true;
    setTimeout(() => {
        this.updateContent();
        this.updatePosition();
    });
};

LineChart2.prototype.updateSize = function () {
    SvgCanvas.prototype.updateSize.call(this);
    this.updatePosition();
}

LineChart2.prototype.computeData = function () {
    var cpData = this.cpData;
    var lines = this.lines || [];
    cpData.max = lines.reduce((ac, cr) => {
        var values = cr.values || [];
        return values.reduce((ac2, cr2) => Math.max(ac2, cr2), ac);
    }, this.zeroOY ? 0 : -1000000000);
    cpData.min = lines.reduce((ac, cr) => {
        var values = cr.values || [];
        return values.reduce((ac2, cr2) => Math.min(ac2, cr2), ac);
    }, this.zeroOY ? 0 : 1000000000);
    if (cpData.min > cpData.max) {
        cpData.min = 0;
        cpData.max = 1;
    } else if (cpData.min === cpData.max) {
        cpData.max = cpData.min + 1;
    }

    cpData.oyLabelLength = Math.max((cpData.max + '').length, (cpData.min + '').length);
    cpData.keyNameWidth = 0;
    if (this.keyName) {
        cpData.keyNameWidth = TextMeasure.measureWidth(this.keyName, TextMeasure.FONT_ARIAL, 14);
    }
    else {
        cpData.keyNameWidth = 0;
    }
    cpData.keyNameWidth = Math.round(cpData.keyNameWidth);
    if (this.valueName) {
        cpData.valueNameWidth = TextMeasure.measureWidth(this.valueName, TextMeasure.FONT_ARIAL, 14);
    }
    else {
        cpData.valueNameWidth = 0;
    }
    cpData.valueNameWidth = Math.round(cpData.valueNameWidth);

};

LineChart2.prototype.makeLine = function (lineData, i) {
    var color = lineData.color || this.colorTable[i % this.colorTable.length];
    if (!color) color = new Color([Math.random() * 0.9, Math.random()* 0.9, Math.random()* 0.9, 1]).toString('hex6');
    var lighterColor = Color.parse(color + '');
    var hsla = lighterColor.toHSLA();
    hsla[1] += 0.2;
    hsla[2] += 0.2;
    if (hsla[1] > 0.8) hsla[1] = 0.8;
    if (hsla[2] > 1) hsla[2] = 1;
    lighterColor = Color.fromHSLA(hsla[0], hsla[1], hsla[2], 0.3);

    var values = lineData.values || [];
    var res = _({
        class: 'vc-line',
        style: {
            '--color': color + '',
            '--lighter-color': lighterColor + ''
        },
        child: [
            {
                tag: 'path',
                class: 'vc-line-path',
            },
            {
                tag: 'path',
                class: 'vc-line-hit-path',
                attr:{
                    title: lineData.name ||''
                }
            }
        ]
    });
    var plotEltArr = values.map((value, i) => {
        var text = lineData.texts && lineData.texts[i];
        var plotColor = null;
        if (lineData.plotColors && lineData.plotColors.length > 0) {
            plotColor = lineData.plotColors[i];
        }
        var plotElt = _({
            tag: 'circle',
            class: 'vc-plot',
            attr: {
                r: this.plotRadius, cy: 0,
                cx: 0

            }
        });

        if (text) plotElt.attr('title', text);
        if (plotColor) {
            plotElt.addStyle('--color', plotColor + '');
        }
        return plotElt;
    });
    res.addChild(plotEltArr);
    var linePathElt = $('.vc-line-path', res);
    var lineHitPathElt = $('.vc-line-hit-path', res);
    res.updatePosition = () => {
        var width = this.$body.box.width;
        var height = this.$body.box.height;
        var nCol = this.$keys.length;
        var turtle = new Turtle();
        var value;
        var x, y;
        var sm = this.cpData.sm;
        for (var i = 0; i < nCol; ++i) {
            if (i >= values.length) break;
            value = values[i];
            x = map(i + 0.5, 0, nCol, 0, width);
            y = map(value, sm.minValue, sm.maxValue, 0, -height);
            if (isRealNumber(value)) {
                plotEltArr[i].removeStyle('display', 'none');
                plotEltArr[i].attr({
                    cx: x,
                    cy: y
                });
                if (i === 0) {
                    turtle.moveTo(x, y);
                } else {
                    turtle.lineTo(x, y);
                }
            } else {
                plotEltArr[i].addStyle('display', 'none');
            }

        }
        linePathElt.attr('d', turtle.getPath());
        lineHitPathElt.attr('d', turtle.getPath());
    }

    return res;
    // color = Color.parse(color);

};

LineChart2.prototype.updateNotes = function () {
    var lines = this.lines || [];
    this.$keyNoteGroup.items = lines.map((line, i) => {
        return {
            lineIdx: i,
            noteType: 'line',
            text: line.name || '',
            color: line.color || this.colorTable[i % this.colorTable.length],
        };
    });
};

LineChart2.prototype.updateKeys = function () {
    var keys = this.keys || [];
    this.$keys = keys.map((key) => {
        return _({
            tag: GContainer,
            class: 'vc-key',
            child: {
                tag: 'text',
                attr: {
                    x: 0, y: 5, transform: 'rotate(45)',
                },
                child: {text: key || ''},
            }
        })
    });

    this.$keyCtn.clearChild().addChild(this.$keys);

};


LineChart2.prototype.updateLines = function () {
    this.$content.clearChild();
    var lines = this.lines || [];
    this.$lines = lines.map((line, i) => this.makeLine(line, i));
    this.$content.addChild(this.$lines);
};

LineChart2.prototype.updateContent = function () {
    this.computeData();
    this.updateNotes();
    this.updateKeys();
    this.updateLines();
};


LineChart2.prototype.updateAxisPosition = function () {
    var turtle = new Turtle();
    var width = this.$body.box.width;
    var height = this.$body.box.height;
    var cpData = this.cpData;
    var sm = calBeautySegment(Math.floor(height / 50), cpData.min, cpData.max, this.integerOnly);
    this.$valueName.attr({
        x: -10,
        y: -height - 15,
    });

    this.$keyName.attr({
        x: width + 5 + cpData.keyNameWidth,
        y: -10
    });
    cpData.sm = sm;
    turtle.moveTo(0, -height - 10)
        .vLineBy(height + 10)
        .hLineBy(width + 10);
    var i;
    for (i = 1; i <= sm.segmentCount; ++i) {
        turtle.moveTo(-2, map(i, 0, sm.segmentCount, 0, -height));
        turtle.hLineBy(4)
    }
    this.$oxy.attr('d', turtle.getPath());
    turtle = new Turtle();
    turtle.moveTo(0, -height - 12)
        .lineBy(-6, 6)
        .hLineBy(12)
        .closePath()
        .moveTo(width + 12, 0)
        .lineBy(-6, -6)
        .vLineBy(12)
        .closePath();
    this.$oxyArrow.attr('d', turtle.getPath());
    var nOyLb = sm.segmentCount + 1;
    while (this.$oyLabelCtn.childNodes.length > nOyLb) {
        this.$oyLabelCtn.lastChild.remove();
    }

    while (this.$oyLabelCtn.childNodes.length < nOyLb) {
        this.$oyLabelCtn.addChild(_({
            tag: 'text',
            class: 'vc-oy-value',
            attr: {
                x: -10, y: 0,
            },
            child: {text: ''}
        }));
    }
    var elt;
    for (i = 0; i < nOyLb; ++i) {
        elt = this.$oyLabelCtn.childNodes[i];
        elt.firstChild.data = this.numberToString(sm.minValue + sm.step * i);
        elt.attr('y', map(i, 0, sm.segmentCount, 0, -height) + 5);
    }
};

LineChart2.prototype.updateKeysPosition = function () {
    var width = this.$body.box.width;
    this.$keys.forEach((elt, i, arr) => {
        elt.box.x = map(i + 0.5, 0, arr.length, 0, width)
    })
}


LineChart2.prototype.updatePosition = function () {
    if (!this.box.width || !this.box.height) return;
    if (!this.isDescendantOf(document.body)) return;
    if (this.pendingUpdate) this.updateContent();
    var width = this.box.width;
    var height = this.box.height;
    var cpData = this.cpData;
    this.$title.attr({
        x: width / 2,
        y: this.paddingContent + 17
    });

    this.$keyNoteGroup.box.width = width - this.paddingContent * 2
    this.$keyNoteGroup.updateSize();
    this.$keyNoteGroup.box.x = width / 2 - this.$keyNoteGroup.getBBox().width / 2;
    this.$keyNoteGroup.box.y = height - this.paddingContent - (this.$keyNoteGroup.box.height || 0);

    this.$keyCtn.box.y = 20;
    var textYWidth = TextMeasure.measureWidth('0'.repeat(cpData.oyLabelLength), TextMeasure.FONT_ARIAL, 14);
    if (this.valueName) {
        textYWidth = Math.max(textYWidth, cpData.valueNameWidth);
    }
    this.$body.box.x =  textYWidth + this.paddingContent + 10;
    this.$body.box.width = width - this.$body.box.x - cpData.keyNameWidth - this.paddingContent - 12;
    if (this.$body.box.width / (this.$keys.length || 1) > 20) {
        this.removeClass('vc-small-col');
        this.$keyCtn.box.height = this.$keyCtn.getBBox().height;
    } else {
        this.addClass('vc-small-col');
        this.$keyCtn.box.height = 0;
    }
    this.$body.box.y = this.$keyNoteGroup.box.y - this.$keyCtn.box.height - 20;
    this.$body.box.height = this.$body.box.y - this.paddingContent - 20 - 10 - 20 - 10;
    this.updateAxisPosition();
    this.updateKeysPosition();

    this.$lines.forEach(lineElt => {
        lineElt.updatePosition();
    })
};

LineChart2.eventHandler = {};
LineChart2.eventHandler.enterNote = function (event) {
    var lineIdx = event.item.lineIdx;
    var lineElt = this.$lines[lineIdx];
    if (!lineElt) return;
    if (this.$hoverLine) {
        this.$hoverLine.removeClass('vc-hover');
    }
    this.$hoverLine = lineElt;
    this.$hoverLine.addClass('vc-hover');
    var parentElt = this.$hoverLine.parentElement;
    if (!parentElt) return;
    lineElt.remove();
    parentElt.addChild(lineElt);
};

LineChart2.eventHandler.leaveNote = function (event) {
    var lineIdx = event.item.lineIdx;
    var lineElt = this.$lines[lineIdx];
    if (!lineElt) return;
    if (this.$hoverLine === lineElt) {
        this.$hoverLine.removeClass('vc-hover');
        this.$hoverLine = null;
    }
};


LineChart2.property = {};

LineChart2.property.lines = {
    set: function (lines) {
        lines = lines || [];
        this._lines = lines;
        this.requestUpdate();
    },
    get: function () {
        return this._lines;
    }
};


//adapt old
LineChart2.property.canvasWidth = {
    set: function (value) {
        if (isRealNumber(value)) {
            this.addStyle('width', value + 'px');
        } else if (typeof value === "string") {
            this.addStyle('width', value);
        }
    },
    get: function () {
        var value = this.style.width + '';
        if (value.endsWith('px')) value = parseFloat(value.replace('px', ''));
        return value || 0;
    }
};

LineChart2.property.canvasHeight = {
    set: function (value) {
        if (isRealNumber(value)) {
            this.addStyle('height', value + 'px');
        } else if (typeof value === "string") {
            this.addStyle('height', value);
        }
    },
    get: function () {
        var value = this.style.height + '';
        if (value.endsWith('px')) value = parseFloat(value.replace('px', ''));
        return value || 0;
    }
};

LineChart2.property.title = {
    set: function (value) {
        value = (value || '') + '';
        this.$title.firstChild.data = value;
    },
    get: function () {
        return this.$title.firstChild.data;
    }
};

LineChart2.property.valueName = {
    set: function (value) {
        this.$valueName.firstChild.data = (value || '') + '';
    },
    get: function () {
        return this.$valueName.firstChild.data;
    }
};

LineChart2.property.keyName = {
    set: function (value) {
        this.$keyName.firstChild.data = (value || '') + '';
    },
    get: function () {
        return this.$keyName.firstChild.data;
    }
};


VCore.install(LineChart2);


