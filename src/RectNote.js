import Vcore from "./VCore";

var _ = Vcore._;
var $ = Vcore.$;


function RectNote() {
    this._text = '';
    this._color = 'black';
    this.$rect = $('.vchart-rect-note-rect', this);
    this.$text = $('.vchart-rect-note-text', this);
}

RectNote.render = function () {
    return _({
        class: 'vchart-rect-note',
        child: [
            {
                tag: 'rect',
                class: 'vchart-rect-note-rect',
                attr: {
                    x:0,
                    y:0,
                    width:24,
                    height:14
                }
            },
            {
                tag: 'text',
                class: 'vchart-rect-note-text',
                attr: {
                    x: '30',
                    y: '11'
                }
            }
        ]
    });
};

RectNote.property = {
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
            this.$rect.addStyle('fill', value.toString());
        },
        get: function () {
            return this._color;
        }
    }
};


Vcore.install('RectNote'.toLowerCase(), RectNote);

export default RectNote;