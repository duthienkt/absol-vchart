import './style/note.css';
import Vcore from "./VCore";

var _ = Vcore._;
var $ = Vcore.$;


function StrokeNote() {
    this._text = '';
    this._color = 'black';
    this.$line = $('.vc-note-line', this);
    this.$text = $('.vc-note-text', this);
}

StrokeNote.tag = 'StrokeNote'.toLowerCase();

StrokeNote.render = function () {
    return _({
        tag: 'gcontainer',
        class: 'vc-note',
        child: [
            {
                tag: 'path',
                class: 'vc-note-line',
                attr: {
                    d: 'M0 7 h24'
                }
            },
            {
                tag: 'text',
                class: 'vc-note-text',
                attr: {
                    x: '30',
                    y: '11'
                }
            }
        ]
    });
};

StrokeNote.property = {
    text: {
        set: function (value) {
            value = value || '';
            this._text = value;
            this.$text.clearChild().addChild(_({ text: value }))
        },
        get: function () {
            return this._text;
        }
    },
    color: {
        set: function (value) {
            this._color = value;
            this.$line.addStyle('stroke', value.toString());
        },
        get: function () {
            return this._color;
        }
    }
};


Vcore.install('StrokeNote'.toLowerCase(), StrokeNote);

export default StrokeNote;