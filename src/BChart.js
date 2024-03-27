import './style/base.css';
import Vcore from "./VCore";
import SvgCanvas from "absol-svg/js/svg/SvgCanvas";
import GContainer from "absol-svg/js/svg/GContainer";
import DomSignal from "absol/src/HTML5/DomSignal";
import ACore from "absol-acomp/ACore";
import ChartResizeBox from "./ChartResizeBox";
import {hitElement} from "absol/src/HTML5/EventEmitter";
import OOP from "absol/src/HTML5/OOP";
import {isNaturalNumber} from "absol-acomp/js/utils";
import {DEFAULT_CHART_COLOR_SCHEMES} from "absol-acomp/js/colorpicker/SelectColorSchemeMenu";
import KeyNote from "./KeyNote";

var _ = Vcore._;
var $ = Vcore.$;


/***
 * @extends SvgCanvas
 * @constructor
 */
function BChart() {
    this.resizable = false;
    this.ready = false;
    this.contentPadding = 5;
    this.title = '';
    this.domSignal = new DomSignal($('sattachhook.vc-dom-signal', this));
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
    this.computedData = {
        /***
         * @type {Array<{color: Color, type: ("stroke"|"rect"), text:string}>}
         */
        notes: []
    };

    this.on('click', this.eventHandler.click2Resize);
    if (!this.numberToText) {
        OOP.drillProperty(this, this, 'numberToText', 'numberToString');
    }
    /**
     * @name colorScheme
     * @type {null|number}
     * @memberof BChart#
     */
}


BChart.tag = 'BChart'.toLowerCase();

BChart.render = function (data, o, dom) {
    var res =  _({
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
                child: {text: ''}
            },
            {
                tag: 'gcontainer',
                class: 'vc-note-ctn'
            },
            'sattachhook.vc-dom-signal'
        ]
    });

    var colorScheme =o && o.props && o.props.colorScheme;
    if (isNaturalNumber(colorScheme)) {
        colorScheme = Math.max(0, Math.min(DEFAULT_CHART_COLOR_SCHEMES.length, colorScheme));
        res.attr('data-color-scheme', colorScheme + '');
    }
    return res;
};

BChart.prototype.normalizeData = function () {
};

BChart.prototype.computeData = function () {
    this.computedData.notes = this.computeNotes();
};

BChart.prototype._createNote = function () {
    var thisC = this;
    this.$noteCtn.clearChild();
    this.$notes = this.computedData.notes.map((note, idx) => {
        var noteElt = _({
            tag: KeyNote,
            props: {
                color: note.color,
                text: note.text,
                noteType: note.type
            },
            attr: {
                'data-idx': idx
            },
            on: {
                mouseenter: event => {
                    if (this.eventHandler['mouseEnterNote']) {
                        this.eventHandler['mouseEnterNote'](idx, event);
                    }
                },
                mouseleave: event => {
                    if (this.eventHandler['mouseLeaveNote']) {
                        this.eventHandler['mouseLeaveNote'](idx, event);
                    }
                }
            }
        });
        thisC.$noteCtn.addChild(noteElt);
        return noteElt;
    });
};

BChart.prototype._createTitle = function () {
    this.$title.firstChild.data = this.title || '';
}

BChart.prototype.createContent = function () {
    this.ready = true;
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

BChart.prototype.updateBodyPosition = function () {
    var titleHeight = this.$title.getBBox().height;
    var top = this.contentPadding;
    if (titleHeight > 0) top += titleHeight + 10;
    this.$body.box.setPosition(this.contentPadding, top);
    this.$body.box.setSize(this.box.width - this.contentPadding * 2, this.$noteCtn.box.y - top - 10);
};

BChart.prototype.updateContentPosition = function () {
    this._updateTitlePosition();
    this._updateNotesPosition();
    this.updateBodyPosition();
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
    this.normalizeData();
    this.computeData();
    this.createContent();
    this.updateContentPosition();
};


BChart.prototype.updateSize = function () {
    SvgCanvas.prototype.updateSize.call(this);
    if (!this.ready) return;
    this.updateContentPosition();
};

BChart.property = {};

BChart.property.canvasWidth = {
    get: function () {
        return this.box.width;
    },
    set: function (value) {
        this.addStyle('width', value + 'px');
        this.updateSize();
    }
};

BChart.property.canvasHeight = {
    get: function () {
        return this.box.height;
    },
    set: function (value) {
        this.addStyle('height', value + 'px');
        this.updateSize();
    }
};


BChart.property.showInlineValue = {
    set: function (value) {
        if (value) {
            this.addClass('vc-show-inline-value');
        } else {
            this.removeClass('vc-show-inline-value');
        }
    },
    get: function () {
        return this.containsClass('vc-show-inline-value');
    }
};

BChart.property.colorScheme = {
    set: function (value) {
        this.attr('data-color-scheme', value + '');
    },
    get: function () {
        var res = this.attr('data-color-scheme');
        if (res) res = parseInt(res, 10);
        if (!isNaturalNumber(res)) res = null;
        return res;
    }
};

BChart.eventHandler = {};

/***
 *
 * @type {ChartResizeBox}
 */
BChart.$resizebox = ACore._({
    tag: ChartResizeBox.tag
});

BChart.eventHandler.click2Resize = function () {
    if (this.resizable)
        if (!BChart.$resizebox.isAttached(this)) {
            BChart.$resizebox.attachTo(this);
            document.addEventListener('click', this.eventHandler.click2CancelResize);
        }
};


BChart.eventHandler.click2CancelResize = function (event) {
    if (hitElement(this, event)) return;
    if (hitElement(BChart.$resizebox, event)) return;
    if (BChart.$resizebox.isAfterMoving()) return;
    if (BChart.$resizebox.isAttached(this)) BChart.$resizebox.detach();
    document.removeEventListener('click', this.eventHandler.click2CancelResize);
};


Vcore.install(BChart);

export default BChart;