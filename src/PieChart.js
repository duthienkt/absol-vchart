import Vcore from "./VCore";
import Color from "absol/src/Color/Color";
import {generateBackgroundColors} from "./helper";
import './style/piechart.css';
import BChart from "./BChart";
import OOP from "absol/src/HTML5/OOP";
import Vec2 from "absol/src/Math/Vec2";
import Rectangle from "absol/src/Math/Rectangle";
import Polygon from "absol/src/Math/Polygon";
import {closeTooltip, showTooltip} from "./ToolTip";
import {isNaturalNumber} from "absol-acomp/js/utils";
import {generatorColorScheme} from 'absol-acomp/js/colorpicker/SelectColorSchemeMenu';

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
 * @extends BChart
 * @constructor
 */
function PieChart() {
    BChart.call(this);
    this.$pieCtn = this.$body;
    this.$pie = _('gcontainer');
    this.$pieCtn.addChild(this.$pie);
    /***
     *
     * @type {VCPiece[]}
     */
    this.pieces = [];
}

OOP.mixClass(PieChart, BChart);
PieChart.property = Object.assign({}, BChart.property);
PieChart.eventHandler = Object.assign({}, BChart.eventHandler);


PieChart.tag = 'PieChart'.toLowerCase();

PieChart.render = function (data, o, dom) {
    return BChart.render(data, o, dom).addClass('vc-piece-chart');

};

PieChart.eventHandler.mouseEnterNote = function (idx, event) {
    var pieceElt = this.$pieces[idx];
    var textValueElt = this.$pieceValues[idx];
    var title = pieceElt.attr('title');
    if (!title) {
        if (this.tooltipToken) closeTooltip(this.tooltipToken);
        return;
    }
    var bound = textValueElt.getBoundingClientRect();
    this.tooltipToken = showTooltip(title, bound.left - 3, bound.top + bound.height + 3);
};

PieChart.eventHandler.mouseLeaveNote = function (idx) {
    var token = this.tooltipToken;
    if (!token) return;
    setTimeout(() => {
        closeTooltip(token);
    }, 1000)
};


PieChart.prototype._createPie = function () {
    this.$pie.clearChild();
    var thisC = this;
    this.$pieces = this.pieces.map((piece, idx) => {
        var pieceElt = _({
            tag: 'shape',
            class: 'vc-piece',
            style: {
                fill: piece.fillColor + ''
            },
            attr: {title: piece.name  + ': ' + (piece.valueText || piece.value)},
            on: {
                mouseenter: event => {
                    this.eventHandler.mouseEnterNote(idx, event)
                },
                mouseleave: event => {
                    this.eventHandler.mouseLeaveNote(idx, event)
                },
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
            child: {text: piece.valueText || piece.value || ''}
        });
        thisC.$pie.addChild(valueElt);
        return valueElt;
    });

};

PieChart.prototype.computeNotes = function () {
    return this.pieces.map(function (piece, i) {
        return {
            color: piece.fillColor,
            text: piece.name,
            type: 'rect',
            idx: i
        };
    });
};

PieChart.prototype.createContent = function () {
    BChart.prototype.createContent.call(this);
    this._createPie();
};

PieChart.prototype._updatePiePosition = function () {
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
    var piePoly, jj, textRect, canContain;
    for (var k = 0; k < 50; ++k) {
        var startAngle = -Math.PI / 2;
        var endAngle = 0;
        var valueElt;
        var valueBound, pieceBound;
        var x0, y0;
        var r = Math.min(this.$pieCtn.box.width - 5, this.$pieCtn.box.height - 5) / 2 * (1 - k / 150);
        var sr = Math.max(3, r / 15);
        for (var i = 0; i < this.pieces.length; ++i) {
            piece = this.pieces[i];
            pieceElt = this.$pieces[i];
            valueElt = this.$pieceValues[i];
            if (piece.value === 0) {
                pieceElt.addStyle('display', 'none');
                valueElt.addStyle('display', 'none');
            } else {
                pieceElt.removeStyle('display');
                valueElt.removeStyle('display');
            }
            endAngle = startAngle + Math.PI * 2 * piece.value / sum;
            x0 = 0;
            y0 = 0;
            if (piece.separated) {
                x0 += sr * Math.cos((startAngle + endAngle) / 2);
                y0 += sr * Math.sin((startAngle + endAngle) / 2);
            }
            pieceElt.begin();
            piePoly = [];

            if (piece.value < sum) {
                pieceElt.moveTo(x0, y0);
                pieceElt.lineTo(x0 + r * Math.cos(startAngle), y0 + r * Math.sin(startAngle));
                piePoly.push(new Vec2(x0, y0));
                piePoly.push(new Vec2(x0 + r * Math.cos(startAngle), y0 + r * Math.sin(startAngle)));
            } else {
                pieceElt.moveTo(x0 + r * Math.cos(startAngle), y0 + r * Math.sin(startAngle));
                piePoly.push(new Vec2(x0 + r * Math.cos(startAngle), y0 + r * Math.sin(startAngle)));
            }

            pieceElt.arcTo(x0 + r * Math.cos((startAngle + endAngle) / 2), y0 + r * Math.sin((startAngle + endAngle) / 2), r, r, 0, 1, 0)
                .arcTo(x0 + r * Math.cos(endAngle), y0 + r * Math.sin(endAngle), r, r, 0, 1, 0)
                .closePath()
                .end();
            for (jj = 8; jj >= 0; --jj) {
                piePoly.push(new Vec2(x0 + r * Math.cos(startAngle * jj / 8 + endAngle * (8 - jj) / 8),
                    y0 + r * Math.sin(startAngle * jj / 8 + endAngle * (8 - jj) / 8)));
            }
            valueBound = valueElt.getBBox();
            pieceBound = pieceElt.getBBox();

            if (piece.value === sum) {
                valueElt.attr({
                    x: 0,
                    y: 7
                });

                valueElt.removeStyle('visibility');
            } else {
                valueElt.attr({
                    x: x0 + (r - 20 - valueBound.width / 2) * Math.cos((startAngle + endAngle) / 2),
                    y: y0 + (r - 20 - valueBound.height / 2) * Math.sin((startAngle + endAngle) / 2) + 7
                });
                textRect = new Rectangle(x0 + (r - 20 - valueBound.width / 2) * Math.cos((startAngle + endAngle) / 2) - valueBound.width / 2,
                    y0 + (r - 20 - valueBound.height / 2) * Math.sin((startAngle + endAngle) / 2) + 7 - valueBound.height,
                    valueBound.width, valueBound.height);
                piePoly = new Polygon(piePoly);
                canContain = [textRect.A(), textRect.B(), textRect.C(), textRect.D()].every(v => piePoly.pointLocalIn(v) > 0);
                if (canContain) {
                    valueElt.removeStyle('visibility');

                } else {
                    valueElt.addStyle('visibility', 'hidden');
                }
            }

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

PieChart.prototype.updateBodyPosition = function () {
    BChart.prototype.updateBodyPosition.call(this);
    this._updatePiePosition();
};

PieChart.prototype.normalizeData = function () {
    var colorScheme = this.colorScheme;
    var blockColors = isNaturalNumber(colorScheme) ? generatorColorScheme(colorScheme, this.pieces.length) : generateBackgroundColors(this.pieces.length);
    this.pieces.forEach(function (piece, i) {
        piece.fillColor = piece.fillColor || blockColors[i];
    });
};


Vcore.install(PieChart);

export default PieChart;