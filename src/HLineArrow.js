import Vcore from "./VCore";
import { translate } from "./template";
import { moveHLine } from "./helper";

var _ = Vcore._;
var $ = Vcore.$;

function HLineArrow() {
    var res = _('g.vchart-line-arrow');
    res.$line = _('path').addTo(res);
    res.$arrow = _('<path id="ox-arrow" d="m-6.8 -5v10l6.8 -5z"/>').addTo(res);
    return res;
};

HLineArrow.prototype.resize = function (length) {
    this.$arrow.attr('transform',translate(length, 0));
    moveHLine(this.$line, 0, 0, length);
};

Vcore.creator.hlinearrow = HLineArrow;

export default HLineArrow;