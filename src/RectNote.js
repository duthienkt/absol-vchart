import Vcore from "./VCore";

var _ = Vcore._;
var $ = Vcore.$;


function RectNote() {
    this._text = '';
    this._color = 'black';
    this.$rect = $('.vc-note-rect', this);
    this.$text = $('.vc-note-text', this);
}

RectNote.tag = 'RectNote'.toLowerCase();

RectNote.render = function () {
    var fontSize = $(document.body).getFontSize();
    return _({
        tag: 'gcontainer',
        class: 'cv-note',
        child: [
            {
                tag: 'rect',
                class: 'vc-note-rect',
                attr: {
                    x: 0,
                    y: 0,
                    width: Math.ceil(24 * fontSize / 14) + '',
                    height: fontSize + ''
                }
            },
            {
                tag: 'text',
                class: 'vc-note-text',
                attr: {
                    x:  Math.ceil(30 * fontSize / 14) + '',
                    y:  Math.ceil(11 * fontSize / 14) + ''
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
            this.$text.clearChild().addChild(_({text: value}))
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