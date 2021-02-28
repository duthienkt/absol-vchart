import ACore from "absol-acomp/ACore";
import ResizeBox from "absol-acomp/js/ResizeBox";
import {isDomNode} from "absol/src/HTML5/Dom";
import ResizeSystem from "absol/src/HTML5/ResizeSystem";
import './style/chartresizebox.css';

var _ = ACore._;
var $ = ACore.$;

/***
 * @augments AElement
 * @extends ResizeBox
 * @constructor
 */
function ChartResizeBox() {
    /***
     *
     * @type {null|AElement}
     */
    this.$target = null;
    this._listenInterval = -1;
    this.$attachhook = $('attachhook', this);
    this.updateSize = this.updateSize.bind(this);
    this.$attachhook.requestUpdateSize = this.updateSize;
    this.$trackedScrollers = [];
    this.canResize = true;
    this.on({
        beginmove: this.eventHandler.crbBeginMove,
        moving: this.eventHandler.crbMove
    })
}

ChartResizeBox.tag = 'ChartResizeBox'.toLowerCase();

ChartResizeBox.render = function () {
    return _({
        tag: ResizeBox.tag,
        class: 'vc-chart-resize-box',
        child: ['attachhook']
    }, true);
};

ChartResizeBox.prototype.isAttached = function (target) {
    return this.$target === target;
};

ChartResizeBox.prototype.attachTo = function (target) {
    if (this.$target === target) return;
    this.detach();
    if (!target || !isDomNode(target)) return;
    ResizeSystem.add(this.$attachhook);
    this.$target = target;
    var pe = target.parentElement;
    if (pe) {
        pe.appendChild(this);
    }
    while (pe) {
        if (pe.addEventListener) {
            pe.addEventListener('scroll', this.updateSize)
            this.$trackedScrollers.push(pe);
        }
        else break;
        pe = pe.parentElement;
    }
    document.addEventListener('scroll', this.updateSize);
    this.$trackedScrollers.push(document);
    this.updateSize();
};


ChartResizeBox.prototype.detach = function () {
    clearInterval(this._listenInterval);
    this._listenInterval = -1;
    while (this.$trackedScrollers.length > 0) {
        this.$trackedScrollers.pop().removeEventListener('scroll', this.updateSize)
    }
    this.remove();
    this.$target = null;
};


ChartResizeBox.prototype.updateSize = function () {
    var target = this.$target;
    if (!target) return;
    var bound = target.getBoundingClientRect();
    this.addStyle({
        left: bound.left + 'px',
        top: bound.top + 'px',
        width: bound.width + 'px',
        height: bound.height + 'px'
    });
};

ChartResizeBox.eventHandler = {};
ChartResizeBox.eventHandler.crbBeginMove = function (event) {
    this._targetInitBound = this.$target.getBoundingClientRect();
};

ChartResizeBox.eventHandler.crbMove = function (event) {
    if (event.option.right) {
        this.$target.addStyle('width', this._targetInitBound.width + event.clientDX + 'px');
    }
    if (event.option.bottom) {
        this.$target.addStyle('height', this._targetInitBound.height + event.clientDY + 'px');
    }
    ResizeSystem.update();
};


ACore.install(ChartResizeBox);
export default ChartResizeBox;
