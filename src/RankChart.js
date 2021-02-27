import Vcore from "./VCore";
import {translate} from "./template";
import {calBeautySegment, map, rect, text} from "./helper";
import {closeTooltip, showTooltip} from "./ToolTip";
import BChart from "./BChart";
import OOP from "absol/src/HTML5/OOP";
import VerticalChart from "./VerticalChart";
import ColumnChart from "./ColumnChart";
import GContainer from "absol-svg/js/svg/GContainer";
import './style/rankchart.css';

var _ = Vcore._;
var $ = Vcore.$;

/***
 * @extends BChart
 * @constructor
 */
function RankChart() {
    BChart.call(this);
    OOP.drillProperty(this, this, 'numberToString', 'numberToText');
    this._isAutoWidth = !this.canvasWidth || !(this.canvasWidth > 0);
    if (this._isAutoWidth) this.addStyle('width', '100%');

    this.colors = [
        'transparent', 'rgb(201, 241, 253)', 'rgb(212, 227, 252)', 'rgb(218, 202, 251)',
        'rgb(242, 201, 251)', 'rgb(255, 218, 216)', 'rgb(255, 236, 215)', 'rgb(254, 252, 224)',
        'rgb(223, 237, 214)', 'rgb(77, 215, 250)', 'rgb(117, 169, 249)', 'rgb(139, 81, 245)',
        'rgb(215, 87, 246)', 'rgb(255, 138, 132)', 'rgb(152, 165, 52)', 'rgb(254, 248, 160)',
        'rgb(174, 221, 148)', 'rgb(0, 164, 221)', 'rgb(20, 100, 246)', 'rgb(156, 41, 183)'
    ];

    this.computedData.oyUpdated = false;
    this.computedData.oy = {};
    this.computedData.numberToFixed = 0;
    this.integerOnly = false;

    this.positions = [];
    this.valueName = '';
    this.plotRadius = 9;
    this.zeroOY = true;
    this.extendOY = true;

    this.computedData.paddingAxisBottom = this.plotRadius + 30;


    this.$axisCtn = _({
        tag: GContainer.tag,
        class: 'vc-axis-ctn',
        child: [
            {
                tag: 'gcontainer',
                class: 'vc-oxy-space',
                child: [
                    'gcontainer.vc-ox-label-ctn',
                    'gcontainer.vc-rank-list-ctn'
                ]
            },
            {
                tag: 'path',
                class: 'vc-white-mask',
                attr: {
                    fill: 'white',
                    stroke: 'white',
                    'fill-rule': 'evenodd',
                    d: 'M0,0  0,2000 2000,2000 2000,0zM100,0  0,200 200,200 200,0z'
                }
            },

            'axis',
            {
                tag: 'text',
                class: 'vc-key-name',
                attr: {
                    y: 14,
                    x: 5
                },
                child: { text: '' }
            },
            'scrollarrow',
            'hscrollbar',
            {
                tag: 'text',
                class: 'vc-value-name',
                attr: {
                    y: 14,
                    x: 5
                },
                child: { text: '' }
            }
        ]
    });
    this.$body.addChild(this.$axisCtn);
    this.$hscrollbar = $('hscrollbar', this.$axisCtn).on('scroll', this.eventHandler.scrollOxySpace);
    this.$hscrollbar.height = 10;
    this.$scrollArrow = $('scrollarrow', this.$axisCtn)
        .on('pressleft', this.eventHandler.scrollArrowsPressLeft)
        .on('pressright', this.eventHandler.scrollArrowsPressRight);
    this.$oxySpace = $('gcontainer.vc-oxy-space', this.$axisCtn);
    this.$whiteMask = $('.vc-white-mask', this.$axisCtn);
    this.$axis = $('axis', this.$axisCtn);
    this.$keyName = $('.vc-key-name', this.$axisCtn);
    this.$valueName = $('.vc-value-name', this.$axisCtn);
    this.$oxLabelCtn = $('gcontainer.vc-ox-label-ctn', this.$axisCtn);
    this.$oxLabels = [];
    this.$oyValueCtn = _('gcontainer.vc-oy-value-ctn').addTo(this.$body);
    this.$oyValues = [];
    this.$postion = [];
    this.$rankListCtn = $('.vc-rank-list-ctn', this.$axisCtn);

}

RankChart.tag = 'RankChart'.toLowerCase();
RankChart.property = Object.assign({}, VerticalChart.property);
RankChart.eventHandler = Object.assign({}, VerticalChart.eventHandler);
OOP.mixClass(RankChart, VerticalChart);

RankChart.render = function () {
    return BChart.render().addClass('vc-rank-chart');
};

RankChart.prototype.updateBodyPosition = function () {
    VerticalChart.prototype.updateBodyPosition.call(this);
    this._updateOyDivision();
    this._updatePosListPosition();
    this._updateScrollerPosition();

};

RankChart.prototype.createContent = function () {
    BChart.prototype.createContent.call(this);
    this._createOxLabel();
    this._createPosList();
};

RankChart.prototype.computeData = VerticalChart.prototype.computeData;
RankChart.prototype.computeMinMax = function () {
    var min = Infinity, max = -Infinity;
    this.positions.forEach(function (position) {
        position.ranks.forEach(function (rank) {
            min = Math.min(min, rank);
            max = Math.max(max, rank);
        });
    });
    this.computedData.min = min;
    this.computedData.max = max + 1;
};


RankChart.prototype._createOxLabel = function () {
    this.$keyName.firstChild.data = this.valueName;
    this.$oxLabelCtn.clearChild();
    this.$oxLabels = this.positions.map(function (position) {
        return _({
            tag: 'text',
            class: 'vc-ox-label',
            child: { text: position.name }
        })
    });
    this.$oxLabelCtn.addChild(this.$oxLabels);
};


RankChart.prototype._updateOxLabelPosition = function () {
    this.$oxLabelCtn.box.y = 20;
};

RankChart.prototype._updateScrollerPosition = function (){
    this.computedData.oxOverFlow = this.computedData.oxScrollWidth > this.computedData.oxLength;
    this.$hscrollbar.outterWidth = this.computedData.oxLength;
    this.$hscrollbar.innerWidth = this.computedData.oxScrollWidth;
    this.$hscrollbar.width = this.computedData.oxLength;
    // this.$hscrollbar.scrollLeft = Math.max(0, Math.min(this.$hscrollbar.scrollLeft, this.computedData.oxScrollWidth - this.computedData.oxLength));
    this.$hscrollbar.scrollLeft = 0;
    if (this.computedData.oxOverFlow) {
        this.$scrollArrow.removeStyle('display');
        this.$scrollArrow.box.y = this.computedData.oyLength / 2;
        this.$scrollArrow.width = this.computedData.oxLength - 20;
        this._updateScrollArrowBtb();
    }
    else {
        this.$scrollArrow.addStyle('display', 'none');
    }
    this.$axis.oyDivision = this.computedData.oySegmentLength;

    this.$axis.updateOyDivision();
};


RankChart.prototype._updateOyDivision = function (value) {
    this.$axis.oyDivision = this.computedData.oySegmentLength;
    this.$axis.oyPadding = this.computedData.paddingAxisBottom;
    this.$axis.updateOyDivision();
};


RankChart.prototype.mapOYValue = function (val) {
    return this.computedData.paddingAxisBottom + map(val, this.computedData.oy.minValue, this.computedData.oy.maxValue, 0, this.computedData.oyLength);
};

RankChart.prototype._createRank = function (rank, value) {
    var res = _({
        tag: 'g',
        child: [
            {
                tag: 'circle',
                class: 'rank-chart-plot',
                attr: {
                    cx: this.plotRadius,
                    cy: 0,
                    r: this.plotRadius
                },
                style: {
                    fill: this.colors[rank]
                }
            },
            {
                tag: 'text',
                class: 'rank-chart-plot-text',
                attr: {
                    x: this.plotRadius,
                    y: 5,
                    'text-anchor': 'middle'
                },
                props: {
                    innerHTML: rank + 1 + ''
                }
            }
        ]
    });

    res.on('mouseenter', function () {
        var currentBound = res.getBoundingClientRect();
        var text = this.numberToString(value);
        showTooltip(text, currentBound.right + 3, currentBound.bottom + 7).then(function (token) {
            res.once('mouseleave', function () {
                setTimeout(function () {
                    closeTooltip(token);
                }, 1000);
            });
        }.bind(this));
    }.bind(this))
    return res;
};

RankChart.prototype.numberToString = function (num) {
    return num.toString();
};

RankChart.prototype._createPosition = function (position) {
    var res = _({
        tag: GContainer.tag,
    });
    res.$ranks = position.ranks.map(function (value, rank) {
        return this._createRank(rank, value);
    }.bind(this));
    res.$rect = _({
        tag: 'rect',
        class: 'vc-rank-position-list-rect',
        attr: {
            x: '0',
            y: '0'
        }
    });
    res.addChild(res.$rect)
        .addChild(res.$ranks);
    return res;
};

RankChart.prototype._createPosList = function () {
    this.$positions = this.positions.map(this._createPosition.bind(this));
    this.$rankListCtn.clearChild()
        .addChild(this.$positions);
};

RankChart.prototype._updatePosListPosition = function () {
    var contentLength = this.$positions.reduce(function (contentLength, pe, positionIndex) {

        var position = this.positions[positionIndex];
        contentLength = contentLength + 20;
        var maxDY = pe.$ranks.reduce(function (maxDY, meme, j) {
            var value = position.ranks[j];
            var y = -this.mapOYValue(value);
            meme.attr('transform', translate(contentLength, y));
            meme._tr_y = y;
            return Math.max(maxDY, -y);
        }.bind(this), 0);
        var valueElements = pe.$ranks.slice();
        valueElements.sort(function (a, b) {
            return a._tr_y - b._tr_y;
        });


        var ninf = -1000000;
        var messure = valueElements.reduce(function (ac, e) {
            var y = e._tr_y;
            var colIndex = 0;
            while (ac[colIndex].minY > y) ++colIndex;
            ac[colIndex].minY = y + 20;
            ac[colIndex].child.push(e);
            ac[colIndex].maxWidth = Math.max(ac[colIndex].maxWidth, e.getBBox().width);
            return ac;
        }, Array(200).fill(null).map(function () {
            return { minY: ninf, child: [], maxWidth: ninf };
        }));
        messure.reduce(function (left, col) {
            if (col.child.length == 0) return;
            col.child.forEach(function (vale) {
                vale.attr('transform', translate(left, vale._tr_y));
            });

            return left + col.maxWidth + 9;
        }, 10);
        pe.$rect.addStyle('display','none');
        var innerWidth = pe.getBBox().width;
        pe.$rect.removeStyle('display');

        pe.$rect.attr({
            width: innerWidth + 20,
            y: -maxDY - (this.plotRadius + 10),
            height: maxDY + this.plotRadius + 10
        });

        var columeWidth = Math.max(pe.getBBox().width + 20, this.$oxLabels[positionIndex].getBBox().width + 10);
        this.$oxLabels[positionIndex].attr('x', contentLength + columeWidth / 2);
        pe.box.x = contentLength  + columeWidth / 2 - (innerWidth + 20)/2;
        contentLength += columeWidth;

        return contentLength;

    }.bind(this), 9);

    this.computedData.oxScrollWidth = contentLength;



};

Vcore.install(RankChart);

export default RankChart;