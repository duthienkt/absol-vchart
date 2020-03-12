import Vcore from "./VCore";

var _ = Vcore._;
var $ = Vcore.$;


function StrokeNote() {
    this._text = '';
    this._color = 'black';
    this.$line = $('.vchart-stroke-note-line', this);
    this.$text = $('.vchart-stroke-note-text', this);
}

StrokeNote.render = function () {
    return _({
        class: 'vchart-stroke-note',
        child: [
            {
                tag: 'path',
                class: 'vchart-stroke-note-line',
                attr: {
                    d: 'M0 7 h24'
                }
            },
            {
                tag: 'text',
                class: 'vchart-stroke-note-text',
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