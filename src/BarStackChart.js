import './style/barstackchart.css';
import VCore from "./VCore";
import GContainer from "absol-svg/js/svg/GContainer";
import SvgCanvas from "absol-svg/js/svg/SvgCanvas";
import DomSignal from "absol/src/HTML5/DomSignal";
import {generateBackgroundColors} from "./helper";
import Color from "absol/src/Color/Color";
import {ChartResizeController} from "./BChart";
import {observePropertyChanges, unobservePropertyChanges} from "absol/src/DataStructure/Object";
import {revokeResource} from "absol-acomp/js/utils";
import noop from "absol/src/Code/noop";

var _ = VCore._;
var $ = VCore.$;

/***
 * @extends SvgCanvas
 * @constructor
 */
function BarStackChart() {
    this._contentMargin = 5;
    /***
     *
     * @type {GContainer}
     */
    this.$content = $('.vc-bar-stack-content', this);
    this.$content.box.setPosition(40, 5);
    /***
     *
     * @type {GContainer}
     */
    this.$noteCtn = $('.vc-bar-stack-note-ctn', this);
    /***
     *
     * @type {GContainer}
     */
    this.$stack = $('.vc-bar-stack', this);
    this.domSignal = new DomSignal($('sattachhook.vc-dom-signal', this));
    this.domSignal.on('_updateContentPosition', this.updateContentPosition.bind(this))
        .on('updateContent', this.updateContent.bind(this));
    this.blocks = [];
    this.$blocks = [];
    this.$notes = [];
    this.domSignal.emit('updateContent');
    this.resizeCtrl = new ChartResizeController(this);
    observePropertyChanges(this, ['blocks'], () => {
        this.domSignal.emit('updateContent');
    });
}


BarStackChart.tag = 'BarStackChart'.toLowerCase();

BarStackChart.render = function () {
    return _({
        tag: 'svgcanvas',
        class: ['vc-bar-stack-chart', 'base-chart'],
        child: [
            {
                tag: 'gcontainer',
                class: 'vc-bar-stack-content',
                child: [
                    {
                        tag: 'gcontainer',
                        class: 'vc-bar-stack-note-ctn',
                    },
                    {
                        tag: 'gcontainer',
                        class: 'vc-bar-stack'
                    }
                ]
            },
            'sattachhook.vc-dom-signal'
        ]
    })
};

BarStackChart.prototype.revokeResource = function () {
    unobservePropertyChanges(this, ['blocks']);
    revokeResource(this.resizeCtrl);
    this.revokeResource = noop;
    while (this.lastChild) {
        revokeResource(this.lastChild);
        this.lastChild.remove();
    }
};


BarStackChart.prototype.normalizeData = function () {
    var blockColor = generateBackgroundColors(this.blocks.length);
    var sum = this.blocks.reduce(function (ac, cr) {
        return ac + cr.value;
    }, 0);
    this.blocks.forEach(function (block, i) {
        block.color = block.color || blockColor[i];
        block.percent = block.percent || block.value * 100 / sum;
    });


};

BarStackChart.prototype.updateSize = function () {
    SvgCanvas.prototype.updateSize.call(this);
    this.updateContentPosition();
};

/***
 *
 * @param block
 * @returns {GContainer}
 * @private
 */
BarStackChart.prototype._makeNote = function (block) {
    var noteElt = _({
        tag: 'gcontainer',
        class: 'vc-bar-stack-note',
        child: [
            {
                tag: 'text',
                class: 'vc-bar-stack-note-name',
                style: {
                    fill: block.color + ''
                },
                attr: {
                    y: 15,
                    x: 0
                },
                child: {text: block.name}
            },
            {
                tag: 'text',
                class: 'vc-bar-stack-note-desc',
            }
        ]
    });
    noteElt.$name = $('.vc-bar-stack-note-name', this);
    noteElt.$desc = $('.vc-bar-stack-note-desc', this);
    return noteElt;
};

/***
 *
 * @param block
 * @returns {GContainer}
 * @private
 */
BarStackChart.prototype._makeBlock = function (block) {
    var valueColor = Color.parse(block.color + '').getContrastYIQ();
    var percenColor = valueColor.clone();
    percenColor.rgba[0] = (percenColor.rgba[0] + Math.sqrt(0.5)) / 2;
    percenColor.rgba[1] = (percenColor.rgba[1] + Math.sqrt(0.5)) / 2;
    percenColor.rgba[2] = (percenColor.rgba[2] + Math.sqrt(0.5)) / 2;
    var blockElt = _({
        tag: 'gcontainer',
        class: 'vc-bar-stack-block',
        child: [
            {
                tag: 'rect',
                class: 'vc-bar-stack-block-rect',
                style: {
                    fill: block.color
                },
                attr: {
                    x: -250,
                    y: 0,
                    width: 500,
                    height: 10
                }
            },
            {
                tag: 'text',
                class: 'vc-bar-stack-block-value',
                attr: {
                    y: 25
                },
                style: {
                    fill: valueColor + ''
                },
                child: {
                    text: block.value
                }
            },
            {
                tag: 'text',
                class: 'vc-bar-stack-block-percent',
                attr: {
                    y: 55
                },
                style: {
                    fill: percenColor + ''
                },
                child: {
                    text: block.percent.toFixed(1) + '%'
                }
            }
        ]
    });
    blockElt.$rect = $('.vc-bar-stack-block-rect', blockElt);
    return blockElt;
};


BarStackChart.prototype._createNote = function () {
    var thisC = this;
    this.$noteCtn.clearChild();
    this.$notes = this.blocks.map(function (block) {
        var noteElt = thisC._makeNote(block);
        thisC.$noteCtn.addChild(noteElt);
        return noteElt;
    });
};

BarStackChart.prototype._createStack = function () {
    var thisC = this;
    this.$stack.clearChild();
    this.$blocks = this.blocks.map(function (block) {
        var blockElt = thisC._makeBlock(block);
        thisC.$stack.addChild(blockElt);
        return blockElt;
    });
};

BarStackChart.prototype.createContent = function () {
    this.normalizeData();
    this._createNote();
    this._createStack();
};

BarStackChart.prototype.updateContentPosition = function () {
    if (!this.isDescendantOf(document.body)) {
        this.emit('_updateContentPosition');
        return;
    }
    this.$content.box.setPosition(this._contentMargin, 40);
    this.$content.box.setSize(this.box.width - 2 * this._contentMargin, this.box.height - this._contentMargin - 40);
    this._updateNotePosition();
    this._updateStackPosition();
};


BarStackChart.prototype._updateNotePosition = function () {
    var thisC = this;
    var noteCtnBox = this.$noteCtn.getBBox();
    this.$noteCtn.box.setSize(noteCtnBox.width, this.$content.box.height);
    this.$noteCtn.box.setPosition(this.$content.box.width - noteCtnBox.width, 0);
    var dy = this.$noteCtn.box.height / this.blocks.length;
    this.$notes.forEach(function (noteElt, i) {
        noteElt.box.y = dy * i + dy / 2 - 7;
    });
};

BarStackChart.prototype._updateStackPosition = function () {
    var thisC = this;
    this.$stack.box.setSize(this.$content.box.width - this.$noteCtn.box.width - 20, this.$content.box.height);
    this.$stack.box.x = this.$stack.box.width / 2;//to center
    var dy = this.$noteCtn.box.height / this.blocks.length;
    var width = this.$stack.box.width;
    var maxValue = this.blocks.reduce(function (ac, cr) {
        return Math.max(ac, cr.value);
    }, 0)
    this.$blocks.forEach(function (blockElt, i) {
        var block = thisC.blocks[i];
        blockElt.box.y = dy * i;
        blockElt.$rect.attr({
            height: dy,
            width: block.value / maxValue * width,
            x: -block.value / maxValue * width / 2
        });
    });
};

BarStackChart.prototype.updateContent = function () {
    this.createContent();
    this.updateContentPosition();
};


VCore.install(BarStackChart);
export default BarStackChart;