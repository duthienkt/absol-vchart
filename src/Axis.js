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
    this.$oyDivision = $('.cv-oy-division', this);
    this.oxLength = 1;
    this.oyLength = 1;
    this.oyDivision = NaN;
}

Axis.tag = 'Axis'.toLowerCase();

Axis.render = function () {
    return _(
        {
            tag: 'gcontainer',
            class: "vchart-axis",
            child: [
                {
                    tag: 'path',
                    id: "oy-arrow",
                    attr: {
                        d: "m-5 0h10l-5-6.8z"
                    }
                },
                {
                    id: "ox-arrow",
                    attr: {
                        d: 'm0 -5v10l6.8 -5z'
                    }
                },
                {
                    tag: 'path',
                    id: 'oxy',
                    attr: {
                        d: 'm0 -1v1 h1',
                        fill: 'none'
                    }
                },
                {
                    tag: 'path',
                    class: 'cv-oy-division',
                    style: {
                        display: 'none'
                    }
                }
            ]
        });
};


Axis.prototype.updateOyDivision = function () {
    if (this.oyDivision) {
        this.$oyDivision.removeStyle('display');
        var y = this.oyDivision;
        var d = '';
        while (y <= this.oyLength) {
            d += 'M-2 ' + (-y) + 'H 2 '
            y += this.oyDivision;
        }
        this.$oyDivision.attr('d', d);
    }
    else {
        this.$oyDivision.addStyle('display', 'none');
    }
};

Axis.prototype.updateSize = function () {
    this.$oxy.attr('d', 'm0 ' + (-this.oyLength) + 'v' + this.oyLength + ' h' + this.oxLength);
    this.$oxArrow.attr('transform', 'translate(' + this.oxLength + ', 0)');
    this.$oyArrow.attr('transform', 'translate(0, ' + (-this.oyLength) + ')');
    this.updateOyDivision();
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