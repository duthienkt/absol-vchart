import './style/base.css';
import Vcore from "./VCore";
import SvgCanvas from "absol-svg/js/svg/SvgCanvas";
import GContainer from "absol-svg/js/svg/GContainer";
import DomSignal from "absol/src/HTML5/DomSignal";
import Color from "absol/src/Color/Color";
import {randomWord} from "absol/src/String/stringGenerate";
import RectNote from "./RectNote";
import StrokeNote from "./StrokeNote";

var _ = Vcore._;
var $ = Vcore.$;


/***
 * @extends SvgCanvas
 * @constructor
 */
function BChart() {
    this.contentPadding = 5;
    this.title = '';
    this.domSignal = new DomSignal($('attachhook.vc-dom-signal', this));
    this.domSignal.on({
        updateContent: this.updateContent.bind(this)
    });
    /**
     * @type {GContainer}
     */
    this.$body = $('.vc-body', this);
    /**
     * @type {GContainer}
     */
    this.$noteCtn = $('.vc-note-ctn', this);
    this.domSignal.emit('updateContent');
    this.$title = $('.vc-title', this);
    this._computedData = {
        /***
         * @type {Array<{color: Color, type: ("stroke"|"rect"), text:string}>}
         */
        notes: []
    };
}


BChart.tag = 'BChart'.toLowerCase();

BChart.render = function () {
    return _({
        tag: 'svgcanvas',
        class: 'vc-chart',
        child: [
            {
                tag: 'gcontainer',
                class: 'vc-body'
            },
            {
                tag: 'text',
                class: 'vc-title',
                child: { text: '' }
            },
            {
                tag: 'gcontainer',
                class: 'vc-note-ctn'
            },
            'attachhook.vc-dom-signal'
        ]
    });
};

BChart.prototype._normalizeData = function () {
};

BChart.prototype._computeData = function () {
    this._computedData = {};
    this._computedData.notes = this.computeNotes();
};

BChart.prototype._createNote = function () {
    var thisC = this;
    this.$noteCtn.clearChild();
    this.$notes = this._computedData.notes.map(function (note) {
        var noteElt = _({
            tag: note.type === "rect" ? RectNote : StrokeNote,
            props: {
                color: note.color,
                text: note.text
            }
        });
        thisC.$noteCtn.addChild(noteElt);
        return noteElt;
    });
};

BChart.prototype._createTitle = function () {
    this.$title.firstChild.data = this.title || '';
}

BChart.prototype._createContent = function () {
    this._createTitle();
    this._createNote();
};


BChart.prototype._updateNotesPosition = function () {
    var noteBoundWidth = this.$notes.reduce(function (ac, noteElt) {
        var box = noteElt.getBBox();
        return Math.max(ac, box.width);
    }, 0);

    var noteCtnMaxWidth = Math.max(this.box.width - this.contentPadding * 2, noteBoundWidth + 1);
    var x = 0;
    var y = 0;
    var pieceElt;
    for (var i = 0; i < this.$notes.length; ++i) {
        pieceElt = this.$notes[i];
        if (x + noteBoundWidth > noteCtnMaxWidth) {
            x = 0;
            y += 20;
        }
        pieceElt.box.setPosition(x, y);
        x += noteBoundWidth + 15;
    }
    var noteCtnBound = this.$noteCtn.getBBox();
    this.$noteCtn.box.setPosition(this.box.width / 2 - noteCtnBound.width / 2, this.box.height - this.contentPadding - noteCtnBound.height);
};

BChart.prototype._updateTitlePosition = function () {
    this.$title.attr({
        x: this.box.width / 2,
        y: 15
    });
};

BChart.prototype._updateBodyPosition = function () {
    var titleHeight = this.$title.getBBox().height;
    var top = this.contentPadding;
    if (titleHeight > 0) top += titleHeight + 10;
    this.$body.box.setPosition(this.contentPadding, top);
    this.$body.box.setSize(this.box.width - this.contentPadding * 2, this.$noteCtn.box.y - top - 10);
};

BChart.prototype._updateContentPosition = function () {
    this._updateTitlePosition();
    this._updateNotesPosition();
    this._updateBodyPosition();
};

/***
 *
 * @returns {{color: Color, text: string, type: ("stroke"|"rect")}[]}
 */
BChart.prototype.computeNotes = function () {
    return [];
};

BChart.prototype.updateContent = function () {
    if (!this.isDescendantOf(document.body)) {
        this.domSignal.emit('updateContent');
        return;
    }
    this._normalizeData();
    this._computeData();
    this._createContent();
    this._updateContentPosition();
};


BChart.prototype.updateSize = function () {
    SvgCanvas.prototype.updateSize.call(this);
    if (!this.$notes) return;
    this._updateContentPosition();
};


Vcore.install(BChart);

export default BChart;