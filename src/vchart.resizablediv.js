import Acore from "absol-acomp/ACore";
import EventEmitter from 'absol/src/HTML5/EventEmitter';

var _ = Acore._;
var $ = Acore.$;


function ResizeableDiv() {
    this.$resizebox = $('resizebox', this).on('beginmove', this.eventHandler.beginMove);
    this.on('click', this.eventHandler.click);
}

ResizeableDiv.tag = 'ResizeableDiv'.toLowerCase();


ResizeableDiv.render = function () {
    return _({
        class: ['vchart-resizable-div'],
        extendEvent: 'sizechange',
        child: {
            tag: 'resizebox',
            props: { canResize: true }
        },
    });
};



Acore.install('resizablediv', ResizeableDiv);

ResizeableDiv.eventHandler = {};

ResizeableDiv.eventHandler.click = function () {
    this.enableResize();
};

ResizeableDiv.eventHandler.clickBody = function (event) {
    if (EventEmitter.hitElement(this.$modal, event) || EventEmitter.hitElement(this, event)) return;
    this.disableResize();
};


ResizeableDiv.eventHandler.beginMove = function (event) {
    this.$modal = (this.$modal || _({
        style: {
            position: 'fixed',
            left: '1px',
            right: '1px',
            top: '1px',
            bottom: '1px',
            zIndex: '1000'
        }
    })).addTo(document.body);
    this.$resizebox.on('moving', this.eventHandler.moving);
    this.$resizebox.on('endmove', this.eventHandler.endMove);
    this._preBound = this.getBoundingClientRect();
};

ResizeableDiv.eventHandler.moving = function (event) {
    var w = this._preBound.width;
    var h = this._preBound.height;
    if (event.option.bottom) {
        h += event.clientDY;
        this.addStyle('height', this._preBound.height + event.clientDY + 'px');
    }
    if (event.option.right) {
        w += event.clientDX;
        this.addStyle('width', this._preBound.width + event.clientDX + 'px');
    }

    this.emit('sizechange', { type: 'type', target: this, width: w, height: h, originEvent: event.originEvent || event });
};

ResizeableDiv.eventHandler.endMove = function (event) {
    this.$resizebox.off('moving', this.eventHandler.moving);
    this.$resizebox.off('endmove', this.eventHandler.endMove);
    this.$modal.remove();
};

ResizeableDiv.prototype.enableResize = function () {
    if (this.containsClass('vchart-resizable-div-active')) return;
    this.addClass('vchart-resizable-div-active');
    $(document.body).on('click', this.eventHandler.clickBody);

};

ResizeableDiv.prototype.disableResize = function () {
    if (!this.containsClass('vchart-resizable-div-active')) return;
    this.removeClass('vchart-resizable-div-active');
    $(document.body).off('click', this.eventHandler.clickBody);
};

export default ResizeableDiv;