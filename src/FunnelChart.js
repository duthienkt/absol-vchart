import Vcore from "./VCore";
import AElement from "absol/src/HTML5/AElement";

var _ = Vcore._;
var $ = Vcore.$;

/***
 * @extends AElement
 * @constructor
 */
function FunnelChart() {

}

FunnelChart.tag = 'FunnelChart'.toLowerCase();


FunnelChart.render = function () {
    return _({
        tag: 'svg',
        class: ['base-chart', 'av-funnel-chart'],
        child: [
            {
                class: '',
                child: []
            },
            {
                class: '',
                child: []
            }
        ]
    })
};

FunnelChart.prototype._updateCanvasSize = function () {
    var bound = this.getBoundingClientRect();
    var width = 100;
    var height = 100;

    this.attr('width', width + '');
    this.attr('height', height + '');

    console.log(bound);


};


Vcore.install(FunnelChart);

export default FunnelChart;