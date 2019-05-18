import Vcore from "./VCore";

var _ = Vcore._;
var $ = Vcore.$;

function HLineArrow() {
    var res = _('g.vchart-line-arrow');
    res.$line = _('path').addTo(res);
    res.$arrow = _('<path id="ox-arrow" d="m-6.8 -5v10l6.8 -5z"/>').addTo(res);
    return res;
};

HLineArrow.prototype.resize = function (length) {
    this.$arrow.attr('transform', vchart.tl.translate(length, 0));
    vchart.moveHLine(this.$line, 0, 0, length);
};


export default HLineArrow;