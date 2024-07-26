import VCore, {_, $} from "./VCore";
import GContainer from "absol-svg/js/svg/GContainer";
import './style/note.css';
import {measureArial14TextWidth} from "./helper";




/**
 * @typedef KeyNoteItem
 * @property {string} text
 * @property {null|"rect"|"point"|"line"} noteType
 * @property {string|Color} color
 * @property {string} key
 */


/**
 * @extends {GContainer}
 * @constructor
 */
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
    // var fontSize = AElement.prototype.getComputedStyleValue.call(document.body, 'font-size');
    // fontSize = parseFloat((fontSize || '14px').replace('px', ''));
    var fontSize = 14;
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
        // var fontSize = getComputedStyle(document.body).getPropertyValue('font-size');
        // fontSize = parseFloat((fontSize || '14px').replace('px', ''));
        var fontSize = 14;

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
        // var fontSize = getComputedStyle(document.body).getPropertyValue('font-size');
        // fontSize = parseFloat((fontSize || '14px').replace('px', ''));
        var fontSize = 14;

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

KeyNote.prototype.typeHandlers.stroke = KeyNote.prototype.typeHandlers.line;


KeyNote.property = {
    noteType: {
        set: function (value) {
            if (!this.typeHandlers[value]) {
                value = null;
            }
            if (this._noteType === value) return;
            this._noteType = value;
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
            // var fontSize = getComputedStyle(document.body).getPropertyValue('font-size');
            // fontSize = parseFloat((fontSize || '14px').replace('px', ''));
            var fontSize = 14;
            value = value || '';
            this._text = value;
            this.$text.clearChild().addChild(_({text: value}));
            var width = 30 * fontSize / 14 + measureArial14TextWidth(value);
            this.$hitbox.attr('width', 30 * fontSize / 14 + measureArial14TextWidth(value));
            this.box.width = width;
            this.box.height = Math.ceil(24 * fontSize / 14);
        },
        get: function () {
            return this._text;
        }
    },
    color: {
        set: function (value) {
            this._color = value;
            if (this.typeHandlers[this._noteType + ''] && this.$type) {
                this.typeHandlers[this._noteType + ''].color.call(this, value.toString());
            }
        },
        /**
         * @this {KeyNote}
         * @returns {*}
         */
        get: function () {
            return this._color;
        }
    },
    key: {
        set: function (value) {
            this.attr('data-key', value + '');
        },
        get: function () {
            return this.attr('data-key');
        }
    }
};


VCore.install(KeyNote);

export default KeyNote;


/**
 * @extends GContainer
 * @constructor
 */
export function KeyNoteGroup() {
    this.extendStyle = {};


    /**
     *
     * @type {KeyNote[]}
     */
    this.$items = [];
    /**
     *
     * @type {KeyNoteItem[]}
     * @private
     */
    this._items = [];

    /**
     * @type {KeyNoteItem[]}
     * @name items
     * @memberof KeyNoteGroup#
     */

}

KeyNoteGroup.tag = 'KeyNodeGroup'.toLowerCase();

KeyNoteGroup.render = function () {
    return _({
        tag: GContainer
    });
};


KeyNoteGroup.prototype.updateSize = function () {
    var maxWidth = this.$items.reduce((ac, it) => Math.max(ac, it.box.width), 0);
    maxWidth = Math.ceil(maxWidth) + 20;
    var col = Math.floor((this.box.width) / maxWidth) || 1;
    var y = 0;
    var itemElt;
    var height;
    for (var i = 0; i < this.$items.length; ++i) {
        itemElt = this.$items[i];
        itemElt.box.position = {x: maxWidth * (i % col), y: y};
        height = y + itemElt.box.height;
        if ((i + 1) % col === 0) {
            y += itemElt.box.height * 1.5;
        }
    }
    this.box.height = height;
};

//
// KeyNoteGroup.prototype.styleHandlers = {};
//
// KeyNoteGroup.prototype.styleHandlers.width = function (value) {
//     console.log(value)
// };
//
//
// KeyNoteGroup.prototype.addStyle = function (arg0, arg1) {
//     var handler;
//     if ((typeof arg0 === "string")) {
//         handler = this.styleHandlers[arg0] || this.styleHandlers[kebabCaseToCamelCase(arg0)]
//     }
//
//     if (handler) handler.call(this, arg1);
//     else AElementNS.prototype.addStyle.apply(this, arguments);
//     return this;
// };

// KeyNoteGroup.prototype.removeStyle = function (arg0) {
//     this.addStyle(arg0, '');
//     return this;
// };


KeyNoteGroup.property = {};

KeyNoteGroup.property.items = {
    /**
     * @this KeyNoteGroup
     * @param items
     */
    set: function (items) {
        items = items || [];
        this.clearChild();
        this.$items = items.map(it => {
            return _({
                tag: KeyNote,
                props: Object.assign({}, it)
            })
        });
        this.addChild(this.$items)

    },
    /**
     * @this KeyNoteGroup
     */
    get: function () {

    },
    configurable: true
};
