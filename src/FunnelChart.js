import './style/base.css';
import './style/funnelchart.css';
import Vcore from "./VCore";
import AElement from "absol/src/HTML5/AElement";
import ResizeSystem from "absol/src/HTML5/ResizeSystem";
import DomSignal from "absol/src/HTML5/DomSignal";
import {translate} from "./template";
import {generateBackgroundColors, map, rect} from "./helper";
import Color from "absol/src/Color/Color";

var _ = Vcore._;
var $ = Vcore.$;

/***
 * @extends AElement
 * @constructor
 */
function FunnelChart() {
    this.$attachhook = $('sattachhook.av-hook', this);
    this.$attachhook.on('attached', this.eventHandler.attached);
    this.$attachhook.requestUpdateSize = this.updateSize.bind(this);
    this.domSignal = new DomSignal($('sattachhook.av-signal', this))
        .on('_createContent', this._createContent.bind(this))
        .on('_alignContent', this._alignContent.bind(this))
        .on('_updateContent', this._updateContent.bind(this));
    this.$content = $('.av-funnel-content', this);
    this.$funnelCtn = $('.av-funnel-ctn', this);
    this.$noteCtn = $('.av-funnel-note-ctn', this);
    this._contentMargin = 5;
    this._contentWidth = 0;
    this._contentHeight = 0;
    this.$title = $('.av-title', this);
    this.$blocks = [];
    this.blocks = [];
    this._cavasWidth = 0;
    this._canvasHeight = 0;
    this.domSignal.emit('_updateContent');
}

FunnelChart.tag = 'FunnelChart'.toLowerCase();


FunnelChart.render = function () {
    return _({
        tag: 'svg',
        class: ['av-chart', 'av-funnel-chart'],
        child: [
            {
                tag: 'text',
                class: 'av-title',
                child: { text: '' }
            },
            {
                class: 'av-funnel-content',
                child: [
                    {
                        class: 'av-funnel-ctn',
                        child: {
                            class: 'av-funnel'
                        }
                    },
                    {
                        class: 'av-funnel-note-ctn',
                        child: []
                    }
                ]
            },
            'sattachhook.av-hook',
            'sattachhook.av-signal'
        ]
    })
};

FunnelChart.prototype._updateCanvasSize = function () {
    var bound = this.getBoundingClientRect();
    var width = bound.width;
    var height = bound.height;
    this._canvasHeight = height;
    this._cavasWidth = width;

    this.attr('width', width + '');
    this.attr('height', height + '');
    this.attr('viewBox', [0.5, 0.5, width, height].join(' '));
};

FunnelChart.prototype.updateSize = function () {
    this._updateCanvasSize();
    this._alignContent();
};

FunnelChart.prototype._normalizeData = function () {
    var blockColor = generateBackgroundColors(this.blocks.length);
    this.blocks.forEach(function (block, i) {
        block.color = block.color || blockColor[i];
    });
};


FunnelChart.prototype._createContent = function () {
    this._normalizeData();
    this.$title.firstChild.data = this.title + '';
    this.$funnelCtn.clearChild();
    this._createNote();
    this._createFunnel();
};


FunnelChart.prototype._createNote = function () {
    var thisC = this;
    this.$noteCtn.clearChild();
    this.$notes = this.blocks.map(function (block) {
        var noteElt = thisC._makeNote(block);
        thisC.$noteCtn.addChild(noteElt);
        return noteElt;
    });
};

FunnelChart.prototype._createFunnel = function () {
    var thisC = this;
    this.$blocks = this.blocks.map(function (block) {
        var blockElt = thisC._makeBlock(block);
        thisC.$funnelCtn.addChild(blockElt);
        return blockElt;
    });
};


FunnelChart.prototype._makeNote = function (block) {
    var $note = _({
        class: 'av-funnel-note',
        child: [
            {
                tag: 'text',
                style: {
                    fill: block.color
                },
                attr: {
                    y: 30
                },
                class: 'av-funnel-note-name',
                child: { text: block.name },
            },
            {
                class: 'av-funnel-note-desc'
            }
        ]
    });
    $note.$name = $('av-funnel-note-name', $note);
    return $note;
};

FunnelChart.prototype._makeBlock = function (block) {
    var $block = _({
        class: 'av-funnel-block',
        child: [
            {
                tag: 'shape',
                class: 'av-funnel-block-shape',
                style: {
                    fill: block.color + ''
                }
            },
            {
                tag: 'text',
                class: 'av-funnel-block-value',
                attr: {
                    y: 35
                },
                style: {
                    fill: Color.parse(block.color + '').getContrastYIQ() + ''
                },
                child: {
                    text: block.value
                }
            }

        ]
    });

    $block.$shape = $('shape', $block);
    $block.$value = $('.av-funnel-block-value', $block);
    return $block;
};

FunnelChart.prototype._alignNote = function () {
    var dy = this._contentHeight / this.blocks.length;
    this._stackHeight = dy;
    this.$notes.forEach(function (noteElt, i) {
        noteElt.attr({
            transform: translate(0, dy * i)
        });
    });
    var noteWidth = this.$noteCtn.getBBox().width;
    this._noteCtnX = this._contentWidth - noteWidth;
    this.$noteCtn.attr({
        transform: translate(this._noteCtnX, 0)
    });
};

FunnelChart.prototype._alignFunnel = function () {
    var thisC = this;
    this._funnelWidth = this._noteCtnX - 20;
    var maxValue = this.blocks.reduce(function (ac, block) {
        return Math.max(ac, block.value);
    }, 0);

    this.$funnelCtn.attr('transform', translate(this._funnelWidth / 2, 0));
    this.$blocks.forEach(function (blockElt, i) {
        var block = thisC.blocks[i];
        var nextBlock = thisC.blocks[i + 1] || block;
        var y = i * thisC._stackHeight;
        blockElt.$shape.begin()
            .moveTo(-thisC._funnelWidth / 2 * block.value / maxValue, 0)
            .lineTo(thisC._funnelWidth / 2 * block.value / maxValue, 0)
            .lineTo(thisC._funnelWidth / 2 * nextBlock.value / maxValue, thisC._stackHeight)
            .lineTo(-thisC._funnelWidth / 2 * nextBlock.value / maxValue, thisC._stackHeight)
            .closePath().end();
        blockElt.attr('transform', translate(0, y))
    });

};

FunnelChart.prototype._alignContent = function () {
    if (!this.isDescendantOf(document.body)) {
        this.domSignal.emit('_alignContent');
        return;
    }
    this.$title.attr({
        x: this._cavasWidth / 2,
        y: 14 + this._contentMargin
    });
    this.$content.attr('transform', translate(this._contentMargin, this._contentMargin + 50));
    this._contentWidth = this._cavasWidth - this._contentMargin * 2;
    this._contentHeight = this._canvasHeight - this._contentMargin * 2 - 50;
    this._alignNote();
    this._alignFunnel();
};


FunnelChart.prototype._updateContent = function () {
    this._createContent();
    this._alignContent();
};


/***
 *
 * @type {FunnelChart}
 */
FunnelChart.eventHandler = {};


FunnelChart.eventHandler.attached = function () {
    ResizeSystem.add(this.$attachhook);
    this._updateCanvasSize();
};


Vcore.install(FunnelChart);

export default FunnelChart;