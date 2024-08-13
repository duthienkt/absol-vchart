import Vcore, {$, _} from "./VCore";
import SvgCanvas from "absol-svg/js/svg/SvgCanvas";
import {KeyNoteGroup} from "./KeyNote";
import {isNaturalNumber} from "absol-acomp/js/utils";
import {DEFAULT_CHART_COLOR_SCHEMES, generatorColorScheme} from "absol-acomp/js/colorpicker/SelectColorSchemeMenu";
import {ChartResizeController, ChartTitleController} from "./BChart";
import AElement from "absol/src/HTML5/AElement";
import {calBeautySegment, map, measureArial14TextWidth} from "./helper";
import Turtle from "absol/src/Math/Turtle";
import {numberToString} from "absol/src/Math/int";


/**
 * @extends SvgCanvas
 * @constructor
 */
function HorizontalRankChart() {
    this.resizeCtrl = new ChartResizeController(this);
    this.titleCtrl = new ChartTitleController(this);
    this.$attachhook.once('attached', this.updateContent.bind(this));

    this.$title = $('.vc-title', this);

    this.$body = $('.vc-body', this);
    this.$axis = $('.vchart-axis', this);
    this.$oxy = $('#oxy', this);
    this.$oxArrow = $('#ox-arrow', this);
    this.$oyLabelCtn = $('.vc-oy-label-ctn', this);
    this.$oxLabelCtn = $('.vc-ox-label-ctn', this);
    this.$grid = $('.vc-grid', this);
    this.$valueName = $('.vc-value-name', this);
    this.$postionCtn = $('.vc-postion-ctn', this);

    this.$oyLabels = [];
    this.cpData = null;

    this.colors = [
        'white', 'rgb(201, 241, 253)', 'rgb(212, 227, 252)', 'rgb(218, 202, 251)',
        'rgb(242, 201, 251)', 'rgb(255, 218, 216)', 'rgb(255, 236, 215)', 'rgb(254, 252, 224)',
        'rgb(223, 237, 214)', 'rgb(77, 215, 250)', 'rgb(117, 169, 249)', 'rgb(139, 81, 245)',
        'rgb(215, 87, 246)', 'rgb(255, 138, 132)', 'rgb(152, 165, 52)', 'rgb(254, 248, 160)',
        'rgb(174, 221, 148)', 'rgb(0, 164, 221)', 'rgb(20, 100, 246)', 'rgb(156, 41, 183)'
    ];

    /**
     * @name positions
     * @type {{name: string, ranks:number[]}[]}
     * @memberof HorizontalRankChart#
     */
    /**
     * @name valueName
     * @type {string}
     * @memberof HorizontalRangeChart#
     */
}


HorizontalRankChart.tag = 'HorizontalRankChart'.toLowerCase();

HorizontalRankChart.render = function (data, o, dom) {
    var res = _({
        tag: SvgCanvas,
        class: ['vc-chart', 'vc-horizontal-rank-chart', 'as-height-auto'],
        style: {},
        child: [
            {
                tag: 'text',
                class: 'vc-title',
                attr: {
                    'alignment-baseline': "hanging"
                },
                child: {text: ''}
            },
            {
                tag: KeyNoteGroup
            },

            {
                tag: 'gcontainer',
                class: 'vc-body',
                child: [
                    {
                        tag: 'path',
                        class: 'vc-grid'
                    },

                    {
                        tag: 'gcontainer',
                        class: 'vchart-axis',
                        child: [
                            {
                                tag: 'path',
                                id: 'oxy',
                                attr: {
                                    d: 'm0 -1v1 h1',
                                    fill: 'none'
                                }
                            },
                            {
                                tag: 'path',
                                id: "ox-arrow",
                                attr: {
                                    d: 'm0 -5v10l6.8 -5z'
                                }
                            },
                        ]
                    },
                    {
                        tag: 'text',
                        class: 'vc-value-name',
                        child: {text: ''}
                    },
                    {
                        tag: 'gcontainer',
                        class: 'vc-oy-label-ctn'
                    },
                    {
                        tag: 'gcontainer',
                        class: 'vc-ox-label-ctn'
                    },
                    {
                        tag: 'gcontainer',
                        class: 'vc-postion-ctn'
                    },

                ]
            },

        ]
    });

    var colorScheme = o && o.props && o.props.colorScheme;
    if (isNaturalNumber(colorScheme)) {
        colorScheme = Math.max(0, Math.min(DEFAULT_CHART_COLOR_SCHEMES.length, colorScheme));
        res.attr('data-color-scheme', colorScheme + '');
    }
    return res;
};

HorizontalRankChart.prototype.addStyle = function (arg0, arg1) {
    if (arg0 === 'height') {
        if (arg1 === 'auto') {
            this.addClass('as-height-auto');
        }
    } else {
        this.removeClass('as-height-auto');
        AElement.prototype.addStyle.apply(this, arguments);
    }
    return this;
};

HorizontalRankChart.prototype.computeData = function () {
    var positions = Array.isArray(this.positions) ? this.positions : [];
    this.cpData = {};
    this.cpData.min = positions.reduce((ac, cr) => {
        return Math.min(ac, ...cr.ranks);
    }, Infinity);

    this.cpData.count = positions.reduce((ac, cr) => {
        return Math.max(ac, cr.ranks.length);
    }, 0);

    this.cpData.max = positions.reduce((ac, cr) => {
        return Math.max(ac, ...cr.ranks);
    }, -Infinity);
    if (this.cpData.min > this.cpData.max) {
        this.cpData = 0;
        this.cpData.max = 0;
    }

    this.cpData.max += 1;
    if (this.zeroOY) this.cpData.min = Math.min(this.cpData.min, 0);

    this.colors = this.cpData.count < 10 ? [
        "#FF5733", // Bright Orange
        "#33FF57", // Bright Green
        "#3357FF", // Bright Blue
        "#FF33A8", // Bright Pink
        "#FF3333", // Bright Red
        "#33FFF5", // Bright Cyan
        "#FFFF33", // Bright Yellow
        "#FF8C33", // Bright Coral
        "#33FF8C", // Bright Mint
        "#8C33FF"  // Bright Purple
    ] : [
        "#FF5733", // Bright Orange
        "#33FF57", // Bright Green
        "#3357FF", // Bright Blue
        "#FF33A8", // Bright Pink
        "#FF3333", // Bright Red
        "#33FFF5", // Bright Cyan
        "#FFFF33", // Bright Yellow
        "#FF8C33", // Bright Coral
        "#33FF8C", // Bright Mint
        "#8C33FF", // Bright Purple
        "#FF5733", // Bright Orange
        "#33FF57", // Bright Green
        "#3357FF", // Bright Blue
        "#FF33A8", // Bright Pink
        "#FF3333", // Bright Red
        "#33FFF5", // Bright Cyan
        "#FFFF33", // Bright Yellow
        "#FF8C33", // Bright Coral
        "#33FF8C", // Bright Mint
        "#8C33FF"  // Bright Purple
    ];
    ;

};


HorizontalRankChart.prototype.createOYLabel = function () {
    var positions = Array.isArray(this.positions) ? this.positions : [];
    this.$oyLabels = positions.map(it => {
        return _({
            tag: 'text',
            attr: {
                'alignment-baseline': "middle"
            },
            child: {text: it.name}
        });
    });
    this.$oyLabelCtn.addChild(this.$oyLabels)
};


HorizontalRankChart.prototype.createPositions = function () {
    var positions = Array.isArray(this.positions) ? this.positions : [];
    this.$position = positions.map(it => {
        var elt = _({
            tag: 'gcontainer',
        });

        elt.$line = _({
            tag: 'path',
            style: {
                stroke: 'rgb(69, 69, 72)',
                'stroke-width': 3
            }
        });
        elt.addChild(elt.$line);

        elt.$ranks = it.ranks.map((r, i) => {
            return _({
                tag: 'gcontainer',
                class: 'rank-chart-group',
                attr: {
                    title: this.numberToString(r)
                },
                child: [
                    {
                        tag: 'circle',
                        class: 'vc-circle-plot',
                        style: {
                            fill: this.colors[i],
                            stroke: 'black',
                            strokeWidth: 2
                        },
                        attr: {
                            r: 8,
                            x: 0, y: 0
                        }
                    }
                ]
            })
        });

        elt.addChild(elt.$ranks);

        return elt;
    });

    this.$postionCtn.clearChild().addChild(this.$position);
};

HorizontalRankChart.prototype.updateContentPosition = function () {
    if (!this.cpData) return;
    var i, j;
    var width = this.box.width || 0;
    var positions = Array.isArray(this.positions) ? this.positions : [];

    var y = 5;
    this.$title.attr('x', width / 2).attr('y', y);
    y += 30;

    var oyLabelWidth = this.$oyLabels.reduce((ac, cr) => Math.max(ac, cr.getBBox().width), 0);
    oyLabelWidth = Math.ceil(oyLabelWidth);
    var spacing = 40;
    this.$body.box.y = y + 24;
    this.$body.box.x = oyLabelWidth + 10;
    this.$body.box.width = width - this.$body.box.x - 10;
    this.$oyLabelCtn.box.x = -this.$body.box.x;
    this.$axis.box.width = this.$body.box.width;
    this.$oxArrow.attr('d', 'M' + (this.$axis.box.width) + ' 0 m0 -5v10l6.8 -5z');
    this.$axis.box.height = spacing * this.$oyLabels.length;

    var valueNameWidth = this.$valueName.getBBox().width;
    this.$valueName.attr('x', this.$axis.box.width)
        .attr('y', -8);

    /**
     *
     * @type {Turtle}
     */
    var turtle = new Turtle()
        .moveTo(this.$axis.box.width, 0)
        .hLineTo(0)
        .vLineTo(this.$axis.box.height);

    var dx = Math.max(100, Math.floor(20 + measureArial14TextWidth(this.numberToString(this.cpData.max))));
    var sm = calBeautySegment(Math.floor((this.$axis.box.width - valueNameWidth - 10 - dx / 2) / dx),
        this.cpData.min, this.cpData.max + 1);
    dx = Math.floor((this.$axis.box.width - valueNameWidth - 10 - dx / 2) / sm.segmentCount);
    var dv = (sm.maxValue - sm.minValue) / sm.segmentCount;
    turtle.moveTo(0, 2);
    for (i = 0; i < sm.segmentCount; ++i) {
        turtle.moveBy(dx, -4);
        turtle.vLineBy(4);
    }

    this.$oxy.attr('d', turtle.getPath());
    this.$oyLabels.forEach((elt, i) => {
        elt.attr('y', i * spacing + spacing / 2);
    });
    Array.prototype.forEach.call(this.$oxLabelCtn.childNodes, (elt, i) => {
        elt.firstChild.data = this.numberToString(sm.minValue + i * dv);
        elt.attr('x', dx * i);
    });


    while (this.$oxLabelCtn.childNodes.length > sm.segmentCount + 1) this.$oxLabelCtn.lastChild.remove();
    while (this.$oxLabelCtn.childNodes.length < sm.segmentCount + 1)
        this.$oxLabelCtn.addChild(_({tag: 'text', style: {textAnchor: 'middle'}, attr: {y: -8}, child: {text: ''}}));


    /***** draw grid *******/
    turtle = new Turtle();
    var oxLength = this.$axis.box.width - 5;
    turtle.moveTo(oxLength, 0);
    for (i = 0; i < positions.length; ++i) {
        turtle.moveBy(-oxLength, spacing)
            .hLineBy(oxLength);
    }

    turtle.moveTo(0, spacing * positions.length, 0);
    for (i = 0; i < sm.segmentCount; ++i) {
        turtle.moveBy(dx, -spacing * positions.length)
            .vLineBy(spacing * positions.length);
    }

    this.$grid.attr('d', turtle.getPath());

    this.$position.forEach((elt, i) => {
        elt.box.y = i * spacing + spacing / 2;
        var position = positions[i];
        for (var k = 0; k < position.ranks.length; ++k) {
            elt.$ranks[k].box.x = map(position.ranks[k] - sm.minValue, 0, dv, 0, dx);
        }
        if (position.ranks.length > 0)
            elt.$line.attr('d', `M${map(position.ranks[0] - sm.minValue, 0, dv, 0, dx)} 0 L${map(position.ranks[position.ranks.length - 1] - sm.minValue, 0, dv, 0, dx)} 0`);
    });


    //auto size
    this.$body.box.height = this.$axis.box.height + 10;//10px: padding button
    this.box.height = this.$body.box.y + this.$body.box.height;
};

HorizontalRankChart.prototype.numberToString = function () {
    return numberToString.apply(this, arguments);
};


HorizontalRankChart.prototype.updateContent = function () {
    this.computeData();
    this.$title.firstChild.data = this.title;
    this.$valueName.firstChild.data = this.valueName || '';
    this.createOYLabel();
    this.createPositions();

    this.updateContentPosition();
};

HorizontalRankChart.prototype.updateSize = function () {
    SvgCanvas.prototype.updateSize.call(this);
    this.updateContentPosition();
};

Vcore.install(HorizontalRankChart);

export default HorizontalRankChart;