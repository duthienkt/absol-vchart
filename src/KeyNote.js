import VCore, {_, $} from "./VCore";
import GContainer from "absol-svg/js/svg/GContainer";
import AElement from "absol/src/HTML5/AElement";
import {measureArial14TextWidth} from "absol-acomp/js/CheckListBox";
import './style/note.css';

function KeyNote() {
    this._noteType = null;
    this._text = '';
    this._color = 'black';
    this.$type = null;
    this.$hitbox = $('.vc-note-hit', this);
    this.$text = $('.vc-note-text', this);

}

KeyNote.tag = 'KeyNote'.toLowerCase();

KeyNote.render = function () {
    var fontSize = AElement.prototype.getComputedStyleValue.call(document.body, 'font-size');
    fontSize = parseFloat((fontSize || '14px').replace('px', ''));
    return _({
        tag: GContainer,
        class: 'vc-note',
        child: [
            {
                tag: 'rect',
                class: 'vc-note-hit',
                attr: {
                    x: 0,
                    y: 0,
                    // width: measureArial14TextWidth(),
                    height: fontSize + ''
                }
            },
            {
                tag: 'text',
                class: 'vc-note-text',
                attr: {
                    x: Math.ceil(30 * fontSize / 14) + '',
                    y: Math.ceil(11 * fontSize / 14) + ''
                }
            }
        ]
    });
};

KeyNote.prototype.typeHandlers = {};

KeyNote.prototype.typeHandlers.null = {
    view: function () {
        var fontSize = AElement.prototype.getFontSize.call(document.body);
        this.$type = _({
            tag: 'rect',
            class: 'vc-note-rect',
            attr: {
                x: 0,
                y: 0,
                width: Math.ceil(24 * fontSize / 14) + '',
                height: fontSize + ''
            }
        });
    },
    color: function (value) {
        this.$type.addStyle('fill', value);
    }
}

KeyNote.prototype.typeHandlers.rect = KeyNote.prototype.typeHandlers.null;
KeyNote.prototype.typeHandlers.point = {
    view: function () {
        var fontSize = AElement.prototype.getFontSize.call(document.body);
        this.$type = _({
            tag: 'circle',
            class: 'vc-note-point',
            style: {
                strokeWidth: 2,
                stroke: 'white',
            },
            attr: {
                cx: Math.ceil(10 * fontSize / 14) + '',
                cy: Math.ceil(7 * fontSize / 14) + '',
                r: Math.ceil(8 * fontSize / 14) + '',
            }
        });
    },
    color: function (value) {
        this.$type.addStyle('fill', value);
    }
};


KeyNote.prototype.typeHandlers.line = {
    view: function () {
        var fontSize = AElement.prototype.getFontSize.call(document.body);
        this.$type = _({
            tag: 'path',
            class: 'vc-note-line',
            attr: {
                d: 'M0 9 h24'
            }
        });
    },
    color: function (value) {
        this.$type.addStyle('stroke', value);
    }
};


KeyNote.property = {
    noteType: {
        set: function (value) {
            if (!this.typeHandlers[value]) {
                value = null;
            }
            if (this._noteType === value) return;
            if (this.$type) {
                this.$type.remove();
                this.$type = null;
            }
            this.typeHandlers[value + ''].view.call(this);
            if (this.$type)
                this.typeHandlers[value + ''].color.call(this, this._color + '');
            this.addChildAfter(this.$type, this.$hitbox);

        },
        get: function () {
            return this._noteType;
        }
    },
    text: {
        set: function (value) {
            var fontSize = $(document.body).getFontSize();

            value = value || '';
            this._text = value;
            this.$text.clearChild().addChild(_({text: value}));
            this.$hitbox.attr('width', 30 * fontSize / 14 + measureArial14TextWidth(value))
        },
        get: function () {
            return this._text;
        }
    },
    color: {
        set: function (value) {
            this._color = value;
            if (this.typeHandlers[this._noteType] && this.$type) {
                this.typeHandlers[this._noteType].color.call(this, value.toString());
            }
        },
        get: function () {
            return this._color;
        }
    }
};


VCore.install(KeyNote);

export default KeyNote;