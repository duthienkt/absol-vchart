import './style/base.css';
import Vcore from "./VCore";
import SvgCanvas from "absol-svg/js/svg/SvgCanvas";
import GContainer from "absol-svg/js/svg/GContainer";
import DomSignal from "absol/src/HTML5/DomSignal";
import ACore from "absol-acomp/ACore";
import ChartResizeBox from "./ChartResizeBox";
import {hitElement} from "absol/src/HTML5/EventEmitter";
import OOP from "absol/src/HTML5/OOP";
import {isNaturalNumber, revokeResource} from "absol-acomp/js/utils";
import {DEFAULT_CHART_COLOR_SCHEMES} from "absol-acomp/js/colorpicker/SelectColorSchemeMenu";
import KeyNote from "./KeyNote";
import Tooltip from "absol-acomp/js/Tooltip";
import ToolTip from "absol-acomp/js/Tooltip";
import noop from "absol/src/Code/noop";
import {observePropertyChanges, unobservePropertyChanges} from "absol/src/DataStructure/Object";


var _ = Vcore._;
var $ = Vcore.$;

/**
 *
 * @param chartElt
 * @constructor
 */
export function ChartResizeController(chartElt) {
    this.chartElt = chartElt;
    this.ev_click = this.ev_click.bind(this);
    this.ev_clickOut = this.ev_clickOut.bind(this);
    this.chartElt.on('click', this.ev_click);
}


ChartResizeController.prototype.ev_click = function (event) {
    if (!this.chartElt.resizable) return;
    this.prepare();
    if (this.share.$resizebox.isAttached(this.chartElt)) return;
    this.share.$resizebox.attachTo(this.chartElt);
    document.addEventListener('click', this.ev_clickOut);
};

ChartResizeController.prototype.ev_clickOut = function (event) {
    if (hitElement(this.chartElt, event)) return;
    if (this.share.$resizebox.isAfterMoving()) return;
    if (this.share.$resizebox.isAttached(this)) this.share.$resizebox.detach();
    document.removeEventListener('click', this.ev_clickOut);
};

ChartResizeController.prototype.revokeResource = function () {
    document.removeEventListener('click', this.ev_clickOut);
};


ChartResizeController.prototype.share = {
    /**
     * @type {ChartResizeBox}
     */
    $resizebox: null
};

ChartResizeController.prototype.prepare = function () {
    if (this.share.$resizebox) return;
    this.share.$resizebox = ACore._({
        tag: ChartResizeBox.tag
    });
};



/**
 *
 * @param {BChart} elt
 * @constructor
 */
export function ChartTitleController(elt) {
    this.elt = elt;
    Object.keys(this.constructor.prototype).filter(key => key.startsWith('ev_')).forEach(key => this[key] = this[key].bind(this));
    this.elt.on('mouseover', this.ev_mouseEnter)
        .on('mouseout', this.ev_mouseOut);
    this.titleElt = null;
    this.contentElt = ACore._({
        tag: 'div',
        style: {font: '14px Arial'}
    }).on('mouseover', this.ev_mouseEnter)
        .on('mouseout', this.ev_mouseOut)
    this.closeTO = -1;
    this.sessonToken = null;
}

ChartTitleController.prototype.revokeResource = function () {
    this.elt.off('mouseover', this.ev_mouseEnter)
        .off('mouseout', this.ev_mouseOut);
    this.contentElt.off('mouseover', this.ev_mouseEnter)
        .off('mouseout', this.ev_mouseOut);
    revokeResource(this.contentElt);
    delete this.elt;
    delete this.contentElt;
    this.revokeResource = noop();
};


ChartTitleController.prototype.ev_mouseEnter = function (event) {
    if (hitElement(this.contentElt, event)) {
        clearTimeout(this.closeTO);
        return;
    }
    var hasTileElt = this.findTitleElt(event.target);

    if (hasTileElt) {
        clearTimeout(this.closeTO);
        if (hasTileElt !== this.titleElt) {
            this.titleElt = hasTileElt;
            this.sessonToken = Tooltip.show(this.titleElt, this.makeTooltipContent(this.titleElt.attr('title')));
        }
    } else {
        if (this.titleElt) {
            clearTimeout(this.closeTO);
            this.closeTO = setTimeout(() => {
                this.titleElt = null;
                ToolTip.close(this.sessonToken);
            }, 500)
        }
    }
};


ChartTitleController.prototype.ev_mouseOut = function (event) {
    if (this.titleElt && (event.target === this.titleElt || event.target === this.contentElt ||
        (event.target.isDescendantOf && !event.target.isDescendantOf(this.titleElt)) && !event.target.isDescendantOf(this.contentElt))
    ) {
        clearTimeout(this.closeTO);
        this.closeTO = setTimeout(() => {
            this.titleElt = null;
            ToolTip.close(this.sessonToken);
        }, 500);
    }
};

ChartTitleController.prototype.makeTooltipContent = function (text) {
    this.contentElt.clearChild();
    return ACore._({
        elt: this.contentElt,
        child: text.split('\n').reduce((ac, cr) => {
            ac.push({text: cr}, 'br');
            return ac;
        }, [])
    });
};

ChartTitleController.prototype.findTitleElt = function (elt) {
    while (elt && elt !== this.elt) {
        if (elt.attr && elt.attr('title')) return elt;
        elt = elt.parentElement;
    }
    return null;
};


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

    this.resizeCtrl = new ChartResizeController(this);
    this.titleCtrl = new ChartTitleController(this);
    if (!this.numberToText) {
        OOP.drillProperty(this, this, 'numberToText', 'numberToString');
    }

    observePropertyChanges(this, this.dataKeys, ()=>{
        if (this.domSignal) this.domSignal.emit('updateContent');
    });


    /**
     * @name colorScheme
     * @type {null|number}
     * @memberof BChart#
     */
}


BChart.tag = 'BChart'.toLowerCase();

BChart.render = function (data, o, dom) {
    var res = _({
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

    var colorScheme = o && o.props && o.props.colorScheme;
    if (isNaturalNumber(colorScheme)) {
        colorScheme = Math.max(0, Math.min(DEFAULT_CHART_COLOR_SCHEMES.length, colorScheme));
        res.attr('data-color-scheme', colorScheme + '');
    }
    return res;
};

BChart.prototype.dataKeys = ['title'];

BChart.prototype.revokeResource = function () {
    unobservePropertyChanges(this, this.dataKeys);
    revokeResource(this.resizeCtrl);
    revokeResource(this.titleCtrl);
    while (this.lastChild) {
        revokeResource(this.lastChild);
        this.lastChild.remove();
    }
    this.revokeResource = noop;
    this.computedData = null;
}

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
        if (this.isDescendantOf(document.body)) {
            this.domSignal.emit("updateContent");
        }
    },
    get: function () {
        var res = this.attr('data-color-scheme');
        if (res) res = parseInt(res, 10);
        if (!isNaturalNumber(res)) res = null;
        return res;
    }
};

BChart.eventHandler = {};


Vcore.install(BChart);

export default BChart;