import VCore from "./VCore";
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

var _ = VCore._;
var $ = VCore.$;

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
function DoughnutChart() {
    BChart.call(this);
    this.titleCtrl.revokeResource();
    delete this.titleCtrl;

    this.$pieCtn = this.$body;
    this.$pie = _('gcontainer');
    this.$pieCtn.addChild(this.$pie);
    /***
     *
     * @type {VCPiece[]}
     */
    this.pieces = [];
}

OOP.mixClass(DoughnutChart, BChart);
DoughnutChart.property = Object.assign({}, BChart.property);
DoughnutChart.eventHandler = Object.assign({}, BChart.eventHandler);

DoughnutChart.prototype.dataKeys = BChart.prototype.dataKeys.concat(['pieces']);


DoughnutChart.tag = 'DoughnutChart'.toLowerCase();

DoughnutChart.render = function (data, o, dom) {
    return BChart.render(data, o, dom).addClass('vc-piece-chart');
};

DoughnutChart.eventHandler.mouseEnterNote = function (idx, event) {
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

DoughnutChart.eventHandler.mouseLeaveNote = function (idx) {
    var token = this.tooltipToken;
    if (!token) return;
    setTimeout(() => {
        if (token) closeTooltip(token);
    }, 1000)
};


DoughnutChart.prototype._createPie = function () {

    this.$pie.clearChild();
    var thisC = this;
    this.$pieces = this.pieces.map((piece, idx) => {
        var pieceElt = _({
            tag: 'shape',
            class: 'vc-piece',
            style: {
                fill: (piece.fillColor  || this.blockColors[idx]) + ''
            },
            attr: {title: piece.name + ': ' + (piece.valueText || piece.value)},
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
    this.$pieceValues = this.pieces.map( (piece, idx)=> {
        var valueElt = _({
            tag: 'text',
            class: 'vc-piece-value',
            style: {
                fill: Color.parse((piece.fillColor  || this.blockColors[idx])+'').getContrastYIQ()
            },
            child: {text: piece.valueText || piece.value || ''}
        });
        thisC.$pie.addChild(valueElt);
        return valueElt;
    });

};

DoughnutChart.prototype.computeNotes = function () {
    return this.pieces.map( (piece, i)=> {
        return {
            color: piece.fillColor||this.blockColors[i],
            text: piece.name,
            type: 'rect',
            idx: i
        };
    });
};

DoughnutChart.prototype.createContent = function () {
    BChart.prototype.createContent.call(this);
    this._createPie();
};

DoughnutChart.prototype._updatePiePosition = function () {
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
        var cp, p0;
        var r = Math.min(this.$pieCtn.box.width - 5, this.$pieCtn.box.height - 5) / 2 * (1 - k / 150);
        var ri = r * 4 / 9;
        var sr = Math.max(3, r / 15);
        var makeVec = (r, angle) => new Vec2(r * Math.cos(angle), r * Math.sin(angle));

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
            p0 = new Vec2(x0, y0);
            if (piece.separated) {
                p0 = p0.add(makeVec(sr, (startAngle + endAngle) / 2));
                x0 = p0.x;
                y0 = p0.y;

            }
            pieceElt.begin();
            piePoly = [];

            cp = p0.add(makeVec(r, startAngle));
            pieceElt.moveTo(cp.x, cp.y);

            piePoly.push(cp);

            cp = p0.add(makeVec(r, (startAngle + endAngle) / 2));

            pieceElt.arcTo(cp.x, cp.y, r, r, 0, 1, 0);
            cp = p0.add(makeVec(r, endAngle));
            pieceElt.arcTo(cp.x, cp.y, r, r, 0, 1, 0);

            for (jj = 8; jj >= 0; --jj) {
                piePoly.push(p0.add(makeVec(r, startAngle * jj / 8 + endAngle * (8 - jj) / 8)));
            }

            cp = p0.add(makeVec(ri, endAngle));
            if (piece.value < sum) {
                pieceElt.lineTo(cp.x, cp.y);

            } else {
                pieceElt.closePath();
                pieceElt.moveTo(cp.x, cp.y);
            }


            cp = p0.add(makeVec(ri, (startAngle + endAngle) / 2));
            pieceElt.arcTo(cp.x, cp.y, ri, ri, 0, 0, 1);
            cp = p0.add(makeVec(ri, startAngle));
            pieceElt.arcTo(cp.x, cp.y, ri, ri, 0, 0, 1);

            for (jj = 0; jj <= 8; ++jj) {
                piePoly.push(p0.add(makeVec(ri, startAngle * jj / 8 + endAngle * (8 - jj) / 8)));
            }

            pieceElt.closePath()
                .end();


            valueBound = valueElt.getBBox();
            pieceBound = pieceElt.getBBox();

            if (piece.value === sum) {
                valueElt.attr({
                    x: x0 + (r - 20 - valueBound.width / 2) * Math.cos(-Math.PI / 2),
                    y: y0 + (r - 20 - valueBound.height / 2) * Math.sin(-Math.PI / 2) + 7
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
            );
            break;
        }
    }
};

DoughnutChart.prototype.updateBodyPosition = function () {
    BChart.prototype.updateBodyPosition.call(this);
    this._updatePiePosition();
};

DoughnutChart.prototype.normalizeData = function () {
    var colorScheme = this.colorScheme;
    this.blockColors = isNaturalNumber(colorScheme) ? generatorColorScheme(colorScheme, this.pieces.length) : generateBackgroundColors(this.pieces.length);
};


VCore.install(DoughnutChart);

export default DoughnutChart;