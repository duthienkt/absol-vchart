import SvgCanvas from "absol-svg/js/svg/SvgCanvas";
import VCore, {_, $} from "./VCore";
import BChart, {ChartResizeController} from "./BChart";
import Color from "absol/src/Color/Color";
import Turtle from "absol-svg/js/controller/Turtle";
import './style/tinycirclechart.css';
import {measureText} from "absol-acomp/js/utils";
import {getScreenSize} from "absol/src/HTML5/Dom";

/***
 * @extends SvgCanvas
 * @constructor
 */
function TinyCircleChart() {
    this.resizeCtrl = new ChartResizeController(this);
    this.contentPadding = 5;
    this._arcs = [];
    this.computedData = {
        notes: []
    };
    this.total = NaN;
    this.$notes = [];
    this.$noteCtn = $('.vc-note-ctn', this);
    this.$arcs = [];
    this.$content = $('.vc-content', this);
    this.$circleBlank = $('.vc-tiny-circle-blank', this);
    this.$title = $('.vc-title', this);

}

TinyCircleChart.tag = 'TinyCircleChart'.toLowerCase();

TinyCircleChart.render = function () {
    return _({
        tag: SvgCanvas.tag,
        class: ['vc-chart', 'vc-tiny-circle-chart'],
        child: [
            {
                tag: 'gcontainer',
                class: 'vc-content',
                child: [
                    {
                        tag: 'path',
                        class: 'vc-tiny-circle-blank'
                    },
                    {
                        tag: 'text',
                        class: 'vc-title',
                        attr: {y: '7'},
                        child: {text: ''}
                    }
                ]
            },
            {
                tag: 'gcontainer',
                class: 'vc-note-ctn'
            }
        ]
    });
};

TinyCircleChart.prototype._computeNote = function () {
    this.computedData.notes = (this._arcs || []).map(function (arc, i, array) {
        var note = {};
        note.color = arc.color || Color.fromHSL(1 / array.length * i, 0.5, 0.5);
        note.text = arc.name.replace(/[^\s]+/g, function (all) {
            if (all === '$value') {
                return arc.value + ''
            }
            return all;
        });
        note.type = 'rect';
        return note;
    });
    this.computedData.estimateNoteWidth = this.computedData.notes.reduce((ac, node) => {
        return Math.max(measureText(node.text, '14px arial').width, ac);
    }, 0) + 28;
    this.computedData.estimateNoteHeight = this.computedData.notes.length * 20;
    var screenSize = getScreenSize();
    var fontSize = $(document.body).getFontSize();
    this.computedData.estimateWidth = Math.max(this.computedData.estimateNoteWidth + this.computedData.estimateNoteHeight, 250);

    if (this.computedData.estimateWidth * fontSize / 14 > screenSize.width - 20) {
        this.computedData.estimateWidth = this.computedData.estimateNoteWidth;
        this.computedData.estimateHeight = Math.max(this.computedData.estimateNoteHeight + this.computedData.estimateNoteWidth, 100);

    } else {
        this.computedData.estimateHeight = Math.max(this.computedData.estimateNoteHeight + 10, 100);
    }


    this.addStyle({
        'min-width': this.computedData.estimateWidth / 14 + 'rem',
        'min-height': this.computedData.estimateHeight / 14 + 'rem'
    });
};

TinyCircleChart.prototype._createNote = BChart.prototype._createNote;

TinyCircleChart.prototype._updateNotesPosition = function () {
    var t = $(document.body).getFontSize();
    this.$notes.forEach(function (noteElt, i) {
        noteElt.box.y = Math.ceil(t * 1.428) * i;
    });
};

TinyCircleChart.prototype._createArcs = function () {
    this.$arcs.forEach(function (arc) {
        arc.remove();
    })
    this.$arcs = (this._arcs || []).map(function (arc, i, array) {
        var arcElt = _('path.vc-arc');
        arcElt.addStyle('fill', this.computedData.notes[i].color);
        this.$content.addChild(arcElt);
        return arcElt;
    }.bind(this));
};


TinyCircleChart.prototype._updateArcsPosition = function () {
    var noteBBox = this.$noteCtn.getBBox();
    var R = 0;
    if (this.box.width - noteBBox.width >= this.box.height - noteBBox.height) {
        R = Math.min(this.box.width - noteBBox.width - 2 * this.contentPadding - 10, this.box.height - this.contentPadding) / 2;
        this.$noteCtn.box.position = {
            x: 2 * R + 10 + this.contentPadding,
            y: (this.box.height / 2 - noteBBox.height / 2)
        };
        this.$content.box.position = {
            x: R + this.contentPadding,
            y: this.box.height / 2
        }
    } else {
        R = Math.min(this.box.height - noteBBox.height - 2 * this.contentPadding - 10, this.box.width - this.contentPadding) / 2;
        this.$noteCtn.box.position = {
            y: 2 * R + 10 + this.contentPadding,
            x: (this.box.width / 2 - noteBBox.width / 2)
        };
        this.$content.box.position = {
            y: R + this.contentPadding,
            x: this.box.width / 2
        }
    }

    var r = Math.min(R - 12, R - R / 10);

    this.$circleBlank.attr('d', new Turtle().moveTo(0, -R)
        .arcBy(R, R, 0, 0, 1, R, R)
        .arcBy(R, R, 0, 0, 1, -R, R)
        .arcBy(R, R, 0, 0, 1, -R, -R)
        .arcBy(R, R, 0, 0, 1, R, -R)
        .moveTo(0, -r)
        .arcBy(r, r, 0, 0, 1, r, r)
        .arcBy(r, r, 0, 0, 1, -r, r)
        .arcBy(r, r, 0, 0, 1, -r, -r)
        .arcBy(r, r, 0, 0, 1, r, -r)
        .closePath().getPath());
    var total = this.total;
    if (!(total > 0 && total < Infinity && typeof total === "number")) {
        total = (this._arcs || []).reduce(function (ac, cr) {
            return ac + cr.value;
        }, 0);
    }
    var angle0, angle1 = -Math.PI / 2;
    var total2 = Math.max(total, 1);
    var angleCenter;
    for (var i = 0; i < this.$arcs.length; ++i) {
        angle0 = angle1;
        angle1 = angle1 + Math.PI * 2 * this._arcs[i].value / total2;
        angleCenter = (angle0 + angle1) / 2;
        this.$arcs[i].attr('d', new Turtle()
            .moveTo(R * Math.cos(angle0), R * Math.sin(angle0))
            .arcTo(R, R, 0, this._arcs[i].value > total2 ? 1 : 0, 1, R * Math.cos(angleCenter), R * Math.sin(angleCenter))
            .arcTo(R, R, 0, this._arcs[i].value > total2 ? 1 : 0, 1, R * Math.cos(angle1), R * Math.sin(angle1))
            .lineTo(r * Math.cos(angle1), r * Math.sin(angle1))
            .arcTo(r, r, 0, this._arcs[i].value > total2 ? 1 : 0, 0, r * Math.cos(angleCenter), r * Math.sin(angleCenter))
            .arcTo(r, r, 0, this._arcs[i].value > total2 ? 1 : 0, 0, r * Math.cos(angle0), r * Math.sin(angle0))
            .closePath().getPath());
    }
    this.$title.firstChild.data = total + '';
};


TinyCircleChart.prototype.updateSize = function () {
    SvgCanvas.prototype.updateSize.call(this);
    this._updateArcsPosition();
};

TinyCircleChart.property = {};

TinyCircleChart.property.arcs = {
    set: function (value) {
        this._arcs = value;
        this._computeNote();
        this._createNote();
        this._updateNotesPosition();
        this._createArcs();
    },
    get: function () {
        return this._arcs;
    }
};


VCore.install(TinyCircleChart);

export default TinyCircleChart;

