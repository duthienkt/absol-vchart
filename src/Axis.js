import Vcore from "./VCore";

var _ = Vcore._;
var $ = Vcore.$;

function Axis() {
    var res = vchart._(
        [
            '<g class="vchart-axis" id="axis">',
            '    <path id="oy-arrow" d="m-5 0h10l-5-6.8z" />',
            '    <path id="ox-arrow" d="m0 -5v10l6.8 -5z"/>',
            '    <path id="oxy" d="m0 -1v1 h1" style="fill:none" />',
            '</g>'
        ].join('')
    );
    res.$oxy = $('#oxy', res);
    res.$oxArrow = $('#ox-arrow', res);
    res.$oyArrow = $('#oy-arrow', res);
    res.oxLength = 1;
    res.oyLength = 1;
    return res;
};



Axis.prototype.updateSize = function () {
    this.$oxy.attr('d', 'm0 ' + (-this.oyLength) + 'v' + this.oyLength + ' h' + this.oxLength);
    this.$oxArrow.attr('transform', 'translate(' + this.oxLength + ', 0)');
    this.$oyArrow.attr('transform', 'translate(0, ' + (-this.oyLength) + ')');
};

Axis.prototype.resize = function (oxLength, oyLength) {
    this.oxLength = oxLength;
    this.oyLength = oyLength;
    this.updateSize();
};


Axis.prototype.moveTo = function (x, y) {
    this.attr('transform', 'translate(' + x + ',' + y + ')');
};

Axis.prototype.init = function (props) {
    if (props) {
        if (props.oxLength && props.oyLength) this.resize(props.oxLength, props.oyLength);
        if (props.x && props.y) this.moveTo(props.x, props.y);
    }
};


Vcore.creator.axis = Axis;

export default Axis;