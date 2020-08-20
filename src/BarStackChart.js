import Vcore from "./VCore";
import GContainer from "absol-svg/js/svg/GContainer";
import SvgCanvas from "absol-svg/js/svg/SvgCanvas";
import DomSignal from "absol/src/HTML5/DomSignal";

var _ = Vcore._;
var $ = Vcore.$;

/***
 * @extends SvgCanvas
 * @constructor
 */
function BarStackChart() {
    /***
     *
     * @type {GContainer}
     */
    this.$content = $('.vc-bar-stack-content', this);
    this.$content.box.setPosition(40, 5);
    /***
     *
     * @type {GContainer}
     */
    this.$noteCtn = $('.vc-bar-stack-note-ctn', this);
    /***
     *
     * @type {GContainer}
     */
    this.$stack = $('.vc-bar-stack-stack', this);
    this.domSignal = new DomSignal($('sattachhook.vc-dom-sinal', this));
    this.domSignal.on('_updateContentPosition', this._updateContentPosition.bind(this))
        .on('updateContent', this.updateContent.bind(this));
    this.domSignal.emit('updateContent');
}


BarStackChart.tag = 'BarStackChart'.toLowerCase();

BarStackChart.render = function () {
    return _({
        tag: 'svgcanvas',
        class: 'vc-bar-stack-chart',
        child: [
            {
                tag: 'gcontainer',
                class: 'vc-bar-stack-content',
                child: [
                    {
                        tag: 'gcontainer',
                        class: 'vc-bar-stack-note-ctn',
                    },
                    {
                        tag: 'gcontainer',
                        class: 'vc-bar-stack-stack'
                    }
                ]
            },
            'sattachhook.vc-dom-sinal'
        ]
    })
};

BarStackChart.prototype.updateSize = function () {
    SvgCanvas.prototype.updateSize.call(this);
};

BarStackChart.prototype._makeNote = function (block) {
    var noteElt = _({
        tag: 'gcontainer',
        class: 'vc-bar-stack-note',
        child: [
            {
                tag: 'text',
                class: 'vc-bar-stack-note-name',
                attr: {
                    y: 10,
                    x: 0
                },
                child: { text: block.name }
            },
            {
                tag: 'text',
                class: 'vc-bar-stack-note-desc',
            }
        ]
    });
    noteElt.$name = $('.vc-bar-stack-note-name', this);
    noteElt.$desc = $('.vc-bar-stack-note-desc', this);
    return noteElt;
};


BarStackChart.prototype._createNote = function (block) {
    // var blockElt = _({});
    //
    // return blockElt;
};

BarStackChart.prototype._createContent = function () {
    console.log("create");
};

BarStackChart.prototype._updateContentPosition = function () {
    if (!this.isDescendantOf(document.body)) {
        this.emit('_updateContentPosition');
        return;
    }
};

BarStackChart.prototype.updateContent = function () {
    this._createContent();
    this._updateContentPosition();
};


Vcore.install(BarStackChart);
export default BarStackChart;