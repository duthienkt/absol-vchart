import Vcore from "./VCore";
import SvgCanvas from "absol-svg/js/svg/SvgCanvas";
import DomSignal from "absol/src/HTML5/DomSignal";

var _ = Vcore._;
var $ = Vcore.$;


/***
 * @extends SvgCanvas
 * @constructor
 */
function HColumnChart() {
    this.$title = $('.vc-title', this);
    console.log($('sattachhook.vc-dom-signal', this))
    this.domSignal = new DomSignal($('sattachhook.vc-dom-signal', this));
    // this.domSignal.on({
    //     updateContent: this.updateContent.bind(this)
    // });
    // this.emit('updateContent');
}


HColumnChart.tag = "HColumnChart".toLowerCase();

HColumnChart.render = function () {
    return _({
        tag: SvgCanvas.tag,
        class: 'vc-h-column-chart',
        child: [
            {
                tag: 'text',
                class: 'vc-title',
                child: { text: '' },
                attr: {
                    y: 20
                }
            },
            {
                class: 'vc-h-column-root',
                child: [
                    {
                        class: 'vc-h-column-ox-key-ctn'
                    },
                    {
                        class: 'vc-h-column-oy-key-ctn'
                    },
                    {
                        tag: 'hlinearrow'
                    }
                ]
            },
            'sattachhook.vc-dom-signal'
        ]
    });
};


HColumnChart.prototype.updateSize = function () {
    SvgCanvas.prototype.updateSize.call(this);
    this.updateContentPosition();
};


HColumnChart.prototype.updateContent = function () {
    if (!this.isDescendantOf(document.body)) {
        this.domSignal.emit('updateContent');
        return;
    }
    this.normalizeData();
    this.createContent();
    this.updateContentPosition();
};

HColumnChart.prototype.normalizeData = function () {

};

HColumnChart.prototype._createTitle = function (){
    this.$title.firstChild.data = this.title;
};

HColumnChart.prototype.createContent = function () {
    this._createTitle();

};

HColumnChart.prototype._alignTitle = function (){
      this.$title.attr('x', this.box.width/2);
};


HColumnChart.prototype.updateContentPosition = function () {
    this._alignTitle();
};


Vcore.install(HColumnChart);

export default HColumnChart;