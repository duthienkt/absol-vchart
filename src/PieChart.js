import Vcore from "./VCore";
import SvgCanvas from "absol-svg/js/svg/SvgCanvas";
import DomSignal from "absol/src/HTML5/DomSignal";
import Color from "absol/src/Color/Color";
import {generateBackgroundColors} from "./helper";
import './style/piechart.css';

var _ = Vcore._;
var $ = Vcore.$;


/***
 * @typedef VCPiece
 * @property {string} name
 * @property {number} value
 * @property {string} valueText
 * @property {string} fillColor
 * @property {boolean} separated
 */

/***
 * @extends SvgCanvas
 * @constructor
 */
function PieChart() {
    this.domSignal = new DomSignal($('sattachhook.vc-dom-signal', this));
    this.domSignal.on({
        updateContent: this.updateContent.bind(this)
    });
    this.$notesCtn = $('.vc-fill-note-ctn', this);
    this.$pieCtn = $('.vc-pie-ctn', this);
    this._layout = 0;
    /***
     *
     * @type {VCPiece[]}
     */
    this.pieces = [];
    this.$pie = $('.vc-pie', this);
    this.$pieces = [];
    this.$pieceValues = [];
    this.$title = $('.vc-title', this);
    this.title = '';
    this.domSignal.emit('updateContent');
}


PieChart.tag = 'piechart';

PieChart.prototype.updateSize = function () {
    SvgCanvas.prototype.updateSize.call(this);
    if (!this.$pieceNotes) return;
    this._updateContentPosition();

};

PieChart.render = function () {
    return _({
        tag: 'svgcanvas',
        class: ['vc-pie-chart', 'av-chart'],
        child: [
            {
                tag: 'text',
                class: 'vc-title',
                child: { text: '' },
                attr: {
                    y: 20
                }
            },
            {
                tag: 'gcontainer',
                class: 'vc-fill-note-ctn'
            },
            {
                tag: 'gcontainer',
                class: 'vc-pie-ctn',
                child: {
                    tag: 'gcontainer',
                    class: 'vc-pie'
                }
            },
            'sattachhook.vc-dom-signal'
        ]
    });
};


/***
 *
 * @param {VCPiece} piece
 * @returns {GContainer}
 * @private
 */
PieChart.prototype._makeNote = function (piece) {
    var pieceElt = _({
        tag: 'gcontainer',
        class: 'vc-fill-note',
        child: [
            {
                tag: 'rect',
                attr: {
                    x: 0,
                    y: 0,
                    width: 14,
                    height: 14
                },
                style: {
                    fill: piece.fillColor + ''
                }
            },
            {
                tag: 'text',
                attr: {
                    x: 20,
                    y: 12
                },
                child: { text: piece.name }
            }
        ]
    });

    return pieceElt;
}

PieChart.prototype._createNotes = function () {
    this.$notesCtn.clearChild();
    var thisC = this;
    this.$pieceNotes = this.pieces.map(function (piece) {
        var pieceElt = thisC._makeNote(piece);
        thisC.$notesCtn.addChild(pieceElt);
        return pieceElt;
    });
};

PieChart.prototype._createPie = function () {
    this.$pie.clearChild();

    var thisC = this;
    this.$pieces = this.pieces.map(function (piece) {
        var pieceElt = _({
            tag: 'shape',
            class: 'vc-piece',
            style: {
                fill: piece.fillColor + ''
            }
        });
        thisC.$pie.addChild(pieceElt);
        return pieceElt;
    });
    this.$pieceValues = this.pieces.map(function (piece) {
        var valueElt = _({
            tag: 'text',
            class: 'vc-piece-value',
            style: {
                fill: Color.parse(piece.fillColor + '').getContrastYIQ()
            },
            child: { text: piece.valueText || piece.value }
        });
        thisC.$pie.addChild(valueElt);
        return valueElt;
    });

};

PieChart.prototype._createTitle = function () {
    this.$title.firstChild.data = this.title || '';
}


PieChart.prototype._createContent = function () {
    this._createTitle();
    this._createNotes();
    this._createPie();
};


PieChart.prototype._updateTitlePosition = function () {
    this.$title.attr({
        x: this.box.width / 2
    })
};

PieChart.prototype._updateNotesPosition = function () {
    var noteBoundWidth = this.$pieceNotes.reduce(function (ac, noteElt) {
        var box = noteElt.getBBox();
        return Math.max(ac, box.width);
    }, 0);

    var noteCtnMaxWidth = Math.max(this.box.width - 20, noteBoundWidth + 1);
    var x = 0;
    var y = 0;
    var pieceElt;
    for (var i = 0; i < this.$pieceNotes.length; ++i) {
        pieceElt = this.$pieceNotes[i];
        if (x + noteBoundWidth > noteCtnMaxWidth) {
            x = 0;
            y += 20;
        }
        pieceElt.box.setPosition(x, y);
        x += noteBoundWidth + 15;
    }
    var noteCtnBound = this.$notesCtn.getBBox();
    this.$notesCtn.box.setPosition(this.box.width / 2 - noteCtnBound.width / 2, this.box.height - 10 - noteCtnBound.height);
};

PieChart.prototype._updatePiePosition = function () {
    this.$pieCtn.box.setSize(this.box.width - 20, this.$notesCtn.box.y - 40);
    this.$pieCtn.box.setPosition(10, 30);

    // this.$pie.box.setPosition(this.$pieCtn.box.width / 2, this.$pieCtn.box.height / 2);
    var piece, pieceElt;
    var sum = this.pieces.reduce(function (ac, cr) {
        return ac + cr.value;
    }, 0);

    this.$pieCenter = _({
        tag: 'circle',
        attr: {
            cx: 0,
            cy: 0,
            r: 1
        },
        style: {
            fill: 'transparent'
        }
    });
    this.$pie.addChild(this.$pieCenter);
    var pieCenterBound = this.$pieCenter.getBBox();

    var hasSeparatedPiece = this.pieces.reduce(function (ac, cr) {
        return ac || cr.value;
    }, false);
    for (var k = 0; k < 50; ++k) {
        var startAngle = -Math.PI / 2;
        var endAngle = 0;
        var valueElt;
        var valueBound;
        var x0, y0;
        var r = Math.min(this.$pieCtn.box.width - 5, this.$pieCtn.box.height - 5) / 2 * (1 - k / 150);
        var sr = Math.max(3, r / 15);
        for (var i = 0; i < this.pieces.length; ++i) {
            piece = this.pieces[i];
            pieceElt = this.$pieces[i];
            valueElt = this.$pieceValues[i];
            endAngle = startAngle + Math.PI * 2 * piece.value / sum;
            x0 = 0;
            y0 = 0;
            if (piece.separated) {
                x0 += sr * Math.cos((startAngle + endAngle) / 2);
                y0 += sr * Math.sin((startAngle + endAngle) / 2);
            }
            pieceElt.begin()
                .moveTo(x0, y0, 0)
                .lineTo(x0 + r * Math.cos(startAngle), y0 + r * Math.sin(startAngle))
                .arcTo(x0 + r * Math.cos(endAngle), y0 + r * Math.sin(endAngle), r, r, piece.value > sum / 2 ? 1 : 0, 1, 0)
                .closePath()
                .end();
            valueBound = valueElt.getBBox();
            valueElt.attr({
                x: x0 + (r - 20 - valueBound.width / 2) * Math.cos((startAngle + endAngle) / 2),
                y: y0 + (r - 20 - valueBound.height / 2) * Math.sin((startAngle + endAngle) / 2)
            })
            startAngle = endAngle;
        }
        var piePound = this.$pie.getBBox();
        if (piePound.width < this.$pieCtn.box.width && piePound.height < this.$pieCtn.box.height) {
            this.$pie.box.setPosition(
                this.$pieCtn.box.width / 2 - (piePound.width / 2 - (pieCenterBound.x + 1 - piePound.x)),
                this.$pieCtn.box.height / 2 - (piePound.height / 2 - (pieCenterBound.y + 1 - piePound.y))
            )
            break;
        }
    }

};


PieChart.prototype._updateContentPosition = function () {
    if (this.box.width / 1.2 > this.box.height) {
        this._layout = 1;
    }
    else {
        this._layout = 0;
    }

    this._updateTitlePosition();
    this._updateNotesPosition();
    this._updatePiePosition();
};

PieChart.prototype._normalizeData = function () {
    var blockColors = generateBackgroundColors(this.pieces.length);
    this.pieces.forEach(function (piece, i) {
        piece.fillColor = piece.fillColor || blockColors[i];
    });
};


PieChart.prototype.updateContent = function () {
    if (!this.isDescendantOf(document.body)) {
        this.domSignal.emit('updateContent');
        return;
    }
    this._normalizeData();
    this._createContent();
    this._updateContentPosition();
};

Vcore.install(PieChart);

export default PieChart;