import Vcore from "./VCore";
import GContainer from "absol-svg/js/svg/GContainer";

var _ = Vcore._;
var $ = Vcore.$;


/***
 * @extends GContainer
 * @constructor
 */
function Axis() {
    this.$oxy = $('#oxy', this);
    this.$oxArrow = $('#ox-arrow', this);
    this.$oyArrow = $('#oy-arrow', this);
    this.oxLength = 1;
    this.oyLength = 1;
}

Axis.tag = 'Axis'.toLowerCase();

Axis.render = function () {
    return _(
        {
            tag: 'gcontainer',
            class: "vchart-axis",
            child: [
                '    <path id="oy-arrow" d="m-5 0h10l-5-6.8z" />',
                '    <path id="ox-arrow" d="m0 -5v10l6.8 -5z"/>',
                '    <path id="oxy" d="m0 -1v1 h1" style="fill:none" />'
            ]
        });
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


Vcore.install(Axis);

export default Axis;