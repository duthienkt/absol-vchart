import Vcore from "./VCore";
import {translate} from "./template";
import {moveHLine} from "./helper";
import AElementNS from "absol/src/HTML5/AElementNS";
import GContainer from "absol-svg/js/svg/GContainer";

var _ = Vcore._;
var $ = Vcore.$;


/***
 * @extends AElementNS
 * @constructor
 */
function HLineArrow() {
    this._length = 0;
    this.$line = $('path.vchart-line-arrow-line', this);
    this.$arrow = $('.vchart-line-arrow-rect', this);
    this.length = 0;
}

HLineArrow.tag = 'HLineArrow'.toLowerCase();

HLineArrow.render = function () {
    return _({
        class: 'vchart-line-arrow',
        child: [
            'path.vchart-line-arrow-line',
            {
                tag: 'path',
                class: 'vchart-line-arrow-rect',
                attr: {
                    d: 'm-6.8 -5v10l6.8 -5z'
                }
            }
        ]
    });
};


HLineArrow.prototype.resize = function (length) {
    if (typeof length !== 'number') length = parseFloat(length + '');
    length = length || 0;
    if (length < 0) length = 0;
    this._length = length;
    this.$arrow.attr('transform', translate(length, 0));
    moveHLine(this.$line, 0, 0, length);
    this._length = length;

};

HLineArrow.property = {};

HLineArrow.property.length = {
    set: function (value) {
        this.resize(this._length);
    },
    get: function () {
        return this._length;
    }
}


Vcore.creator.hlinearrow = HLineArrow;

export default HLineArrow;