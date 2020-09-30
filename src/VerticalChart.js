import BChart from "./BChart";
import Vcore from "./VCore";
import OOP from "absol/src/HTML5/OOP";

var _ = Vcore._;
var $ = Vcore.$;

/**
 * @extends BChart
 * @constructor
 */
function VerticalChart() {
    BChart.call(this);
    /**
     *
     * @type {string[]}
     */
    this.keys = [];
    this.$oxLabelCtn = _('gcontainer.vc-ox-label-ctn');
    this.$oxLabels = [];
    this.$body.addChild(this.$oxLabelCtn);
}

OOP.mixClass(VerticalChart, BChart);

VerticalChart.property = Object.assign({}, BChart.property);

VerticalChart.tag = 'VerticalChart'.toLowerCase();

VerticalChart.render = function () {
    return BChart.render();
};

VerticalChart.prototype._createOxLabel = function () {
    var thisC = this;
    this.$oxLabelCtn.clearChild();
    this.$oxLabels = this.keys.map(function (key) {
        var labelElt = _({
            tag: 'text',
            child: {
                text: key
            }
        });
        thisC.$oxLabelCtn.addChild(labelElt);
        return labelElt;
    });
    this._computedData.oxLabelMaxWidth = this.$oxLabels.reduce(function (ac, elt) {
        return Math.max(ac, elt.getBBox().width);
    }, 0);
};

VerticalChart.prototype._createOyValue = function () {
    //todo: recreate if segment of OY change, call in updatePosition, not createContent
};

VerticalChart.prototype._createContent = function () {
    BChart.prototype._createContent.call(this);
    this._createOxLabel();
};

VerticalChart.prototype._updateLabelPosition = function () {

};

VerticalChart.prototype._updateBodyPosition = function () {
    BChart.prototype._updateBodyPosition.call(this);

}

Vcore.install(VerticalChart);

export default VerticalChart;