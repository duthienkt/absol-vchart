import VCore from "./VCore";
import OOP from "absol/src/HTML5/OOP";
import Draggable from "absol-acomp/js/Draggable";
import {translate} from "./template";
import GContainer from "absol-svg/js/svg/GContainer";
import Hanger from "absol-acomp/js/Hanger";

var _ = VCore._;

var $ = VCore.$;


/**
 * @augments Hanger
 * @augments GContainer
 * @constructor
 */
function HScrollBar() {
    var res = _({
            tag: Hanger,
            elt: this
        }
    );
    this._scrollLeft = 0;
    this.on('predrag', res.eventHandler.predrag)
        .on('drag', res.eventHandler.drag);
    this.$bar = $('.vchart-vscrollbar-bar', this);
    this.$button = $('.vchart-vscrollbar-button', this);
}

HScrollBar.tag = 'HScrollBar'.toLowerCase();

HScrollBar.render = function () {
    return _({
        tag: 'gcontainer',
        extendEvent: ['scroll'],
        class: 'vchart-vscrollbar',
        child: [
            {
                tag: 'rect',
                class: 'vchart-vscrollbar-bar',
                attr: {
                    x: '0',
                    y: '0'
                }
            },
            {
                tag: 'rect',
                class: 'vchart-vscrollbar-button'

            }
        ]
    });
}

HScrollBar.eventHandler = {};

HScrollBar.eventHandler.predrag = function (event) {
    var bBox = this.$bar.getBBox();
    var bound = this.$bar.getBoundingClientRect();
    if (event.target !== this.$button) {
        var centerOfset = Math.max(0, Math.min(1, (event.clientX - bound.left) / bound.width));
        var newScrollLeft = centerOfset * this.innerWidth - this.outterWidth / 2;
        newScrollLeft = Math.max(0, Math.min(this.innerWidth - this.outterWidth, newScrollLeft));
        this._scrollLeft = newScrollLeft;
        this.updateButtonPosition();
    }

    this.__predragScrollLeft = this._scrollLeft;
    this.emit('scroll', event, this);
};


HScrollBar.eventHandler.drag = function (event) {
    event.preventDefault();
    var bBox = this.$bar.getBBox();
    var bound = this.$bar.getBoundingClientRect();
    var scaleX = bBox.width / bound.width * this.innerWidth / this.outterWidth;
    event.moveDX = event.currentPoint.sub(event.startingPoint).x
    var newScrollLeft = this.__predragScrollLeft + event.moveDX * scaleX;

    newScrollLeft = Math.max(0, Math.min(this.innerWidth - this.outterWidth, newScrollLeft));
    this._scrollLeft = newScrollLeft;
    this.updateButtonPosition();
    this.emit('scroll', event, this);
};


HScrollBar.prototype.updateButtonPosition = function () {
    var maxButtonX = (this.innerWidth - this.outterWidth) / this.innerWidth * this.width;
    var buttonX = this.scrollLeft / this.innerWidth * this.width;
    if (maxButtonX < 0) maxButtonX = 0;

    if (!(buttonX >= 0)) buttonX = 0;
    if (!(buttonX <= maxButtonX)) buttonX = maxButtonX;

    this.$button.attr('x', buttonX + '');
};

HScrollBar.prototype.updateView = function () {
    if (this.outterWidth >= this.innerWidth) {
        this.addClass('vchart-hidden');
    }
    else {
        this.removeClass('vchart-hidden');
        this.$bar.attr({
            rx: this.height / 2.5 + '',
            ry: this.height / 2.5 + ''
        })

        var buttonWidth = 1 / (this.innerWidth / this.outterWidth) * this.width;
        if (!(buttonWidth >= 0 && buttonWidth < Infinity)) buttonWidth = 0;
        this.$button.attr('width', buttonWidth + '');
        this.$button.attr({
            height: this.height * 0.8 + '', y: this.height / 10 + '',
            rx: this.height / 2.5 + '',
            ry: this.height / 2.5 + ''
        });

        this.updateButtonPosition();
    }
};

HScrollBar.property = {
    width: {
        set: function (value) {
            this.$bar.attr('width', value + '');
            this.updateView();
        },
        get: function () {
            var r = (this.$bar.attr('width') || '0').replace(/px|em|rem/g, '');
            var c = parseFloat(r);
            if (c > 0) return c;
            return 0;

        }
    },
    height: {
        set: function (value) {
            this.$bar.attr('height', value + '');
            this.updateView();

        },
        get: function () {
            var r = (this.$bar.attr('height') || '0').replace(/px|em|rem/g, '');
            var c = parseFloat(r);
            if (c > 0) return c;
            return 0;

        }
    },
    innerWidth: {
        set: function (value) {
            if (value >= 0) {
                this._innerWidth = value;
                this.updateView();
            }
        },
        get: function () {
            return this._innerWidth || 0;
        }
    },

    outterWidth: {
        set: function (value) {
            if (value >= 0) {
                this._outterWidth = value;
                this.updateView();
            }
        },
        get: function () {
            return this._outterWidth || 0;
        }
    },
    scrollLeft: {
        set: function (value) {
            value = Math.max(0, value);
            value = Math.min(value,this.innerWidth - this.outterWidth);
                this._scrollLeft = value;
            this.updateView();
        },
        get: function () {
            return this._scrollLeft || 0;
        }
    }

};

HScrollBar.prototype.resize = function (width, height) {
    this.height = height;
    this.width = width;
};

HScrollBar.prototype.moveTo = function (x, y) {
    this.attr('transform', translate(x, y));
}

VCore.creator.hscrollbar = HScrollBar;

export default HScrollBar;