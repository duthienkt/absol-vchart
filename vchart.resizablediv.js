absol.ShareCreator.draggerdiv = function () {
    var res = absol._('div');
    res.defineEvent(['press', 'drag', 'release']);
    res.eventHandler = absol.OOP.bindFunctions(res, absol.ShareCreator.draggerdiv.eventHandler);
    res.on('mousedown', res.eventHandler.beginDrag, true);
    return res;
};


absol.ShareCreator.draggerdiv.eventHandler = {};

absol.ShareCreator.draggerdiv.eventHandler.beginDrag = function (event) {
    event.preventDefault();
    absol.$(document.body).on('mousemove', this.eventHandler.dragging);
    absol.$(document.body).on('mouseup', this.eventHandler.endDrag);
    absol.$(document.body).on('mouseleave', this.eventHandler.endDrag);
    this.isPressed = true;
    this.pressX = event.clientX;
    this.pressY = event.clientY;
    this.deltaX = 0;
    this.deltaY = 0;
    this.emit('press', event, this);
};

absol.ShareCreator.draggerdiv.eventHandler.dragging = function (event) {
    event.preventDefault();
    this.deltaX = event.clientX - this.pressX;
    this.deltaY = event.clientY - this.pressY;
    this.emit('drag', event, this);
};


absol.ShareCreator.draggerdiv.eventHandler.endDrag = function (event) {
    this.isPressed = false;
    event.preventDefault();


    absol.$(document.body).off('mousemove', this.eventHandler.dragging);
    absol.$(document.body).off('mouseup', this.eventHandler.endDrag);
    absol.$(document.body).off('mouseleave', this.eventHandler.endDrag);
    this.emit('release', event, this);

};







absol.ShareCreator.resizablediv = function () {
    var _ = absol._;
    var $ = absol.$;
    var res = _({
        class: ['resizable-div', 'resizable'],
        extendEvent: 'resize',
        child: {
            class: 'resizable-div-higne',
            child: 'draggerdiv.resizable-div-content'
        }
    });
    res.eventHandler = absol.OOP.bindFunctions(res, absol.ShareCreator.resizablediv.eventHandler);
    res.$content = $('.resizable-div-content', res);
    res.$content.on('press', res.eventHandler['contentPress'], true)
        .on('drag', res.eventHandler['contentDrag'], true)
    res.$higne = $('.resizable-div-higne', res);
    ['move', 'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].forEach(function (e) {
        res['$' + e] = _('draggerdiv.resizable-div-resizer.' + e)
            .on('press', res.eventHandler[e + 'Press'], true)
            .on('drag', res.eventHandler[e + 'Drag'], true)
            .addTo(res.$higne);
    });


    return res;
};

absol.ShareCreator.resizablediv.prototype.init = function (props) {
    this.super(props);
};

absol.ShareCreator.resizablediv.prototype.addChild = function (child) {
    this.$content.addChild(child);
};

absol.ShareCreator.resizablediv.prototype.clearChild = function () {
    this.$content.clearChild();
};



absol.ShareCreator.resizablediv.eventHandler = {};


absol.ShareCreator.resizablediv.eventHandler.contentPress = function (event) {
    // console.log(contentDraggable);
    if (!this.contentDraggable) return;
    if (this.getComputedStyleValue('position') == 'absolute') {
        var styleTop = this.getComputedStyleValue('top');
        if (styleTop == 'auto')
            this.pressTop = 0;
        else
            this.pressTop = parseFloat(styleTop.replace('px', ''));
        var styleLeft = this.getComputedStyleValue('left');
        if (styleLeft == 'auto')
            this.pressLeft = 0;
        else
            this.pressLeft = parseFloat(styleLeft.replace('px', ''));
    }
    else {
        var styleMarginTop = this.getComputedStyleValue('margin-top');
        if (styleMarginTop == 'auto')
            this.pressTop = 0;
        else
            this.pressTop = parseFloat(styleMarginTop.replace('px', ''));

        var styleMarginLeft = this.getComputedStyleValue('margin-left');
        if (styleMarginLeft == 'auto')
            this.pressLeft = 0;
        else
            this.pressLeft = parseFloat(styleMarginLeft.replace('px', ''));
    }
};



absol.ShareCreator.resizablediv.eventHandler.contentDrag = function (event) {
    if (!this.contentDraggable) return;

    if (this.getComputedStyleValue('position') == 'absolute') {
        this.addStyle('top', this.pressTop + this.$content.deltaY);
        this.addStyle('left', this.pressLeft + this.$content.deltaX);
    }
    else {
        this.addStyle('margin-top', this.pressTop + this.$content.deltaY);
        this.addStyle('margin-left', this.pressLeft + this.$content.deltaX);
    }
};

absol.ShareCreator.resizablediv.eventHandler.movePress = function (event) {
    if (this.getComputedStyleValue('position') == 'absolute') {
        var styleTop = this.getComputedStyleValue('top');
        if (styleTop == 'auto')
            this.pressTop = 0;
        else
            this.pressTop = parseFloat(styleTop.replace('px', ''));
        var styleLeft = this.getComputedStyleValue('left');
        if (styleLeft == 'auto')
            this.pressLeft = 0;
        else
            this.pressLeft = parseFloat(styleLeft.replace('px', ''));
    }
    else {
        var styleMarginTop = this.getComputedStyleValue('margin-top');
        if (styleMarginTop == 'auto')
            this.pressTop = 0;
        else
            this.pressTop = parseFloat(styleMarginTop.replace('px', ''));

        var styleMarginLeft = this.getComputedStyleValue('margin-left');
        if (styleMarginLeft == 'auto')
            this.pressLeft = 0;
        else
            this.pressLeft = parseFloat(styleMarginLeft.replace('px', ''));
    }
};


absol.ShareCreator.resizablediv.eventHandler.moveDrag = function (event) {
    if (this.getComputedStyleValue('position') == 'absolute') {
        this.addStyle('top', this.pressTop + this.$move.deltaY);
        this.addStyle('left', this.pressLeft + this.$move.deltaX);
    }
    else {
        this.addStyle('margin-top', this.pressTop + this.$move.deltaY);
        this.addStyle('margin-left', this.pressLeft + this.$move.deltaX);
    }
};

absol.ShareCreator.resizablediv.eventHandler.nwPress = function (event) {
    if (this.getComputedStyleValue('position') == 'absolute') {
        var styleTop = this.getComputedStyleValue('top');
        if (styleTop == 'auto')
            this.pressTop = 0;
        else
            this.pressTop = parseFloat(styleTop.replace('px', ''));
        var styleLeft = this.getComputedStyleValue('left');
        if (styleLeft == 'auto')
            this.pressLeft = 0;
        else
            this.pressLeft = parseFloat(styleLeft.replace('px', ''));
    }
    else {
        var styleMarginTop = this.getComputedStyleValue('margin-top');
        if (styleMarginTop == 'auto')
            this.pressTop = 0;
        else
            this.pressTop = parseFloat(styleMarginTop.replace('px', ''));

        var styleMarginLeft = this.getComputedStyleValue('margin-left');
        if (styleMarginLeft == 'auto')
            this.pressLeft = 0;
        else
            this.pressLeft = parseFloat(styleMarginLeft.replace('px', ''));
    }
    var bound = this.getBoundingClientRect();
    this.pressHeight = bound.height;
    this.pressWidth = bound.width;

};

absol.ShareCreator.resizablediv.eventHandler.nwDrag = function (event) {
    this.addStyle('height', this.pressHeight - this.$nw.deltaY + 'px');
    this.addStyle('width', this.pressWidth - this.$nw.deltaX + 'px');
    if (this.getComputedStyleValue('position') == 'absolute') {
        this.addStyle('top', this.pressTop + this.$nw.deltaY);
        this.addStyle('left', this.pressLeft + this.$nw.deltaX);
    }
    else {
        this.addStyle('margin-top', this.pressTop + this.$nw.deltaY);
        this.addStyle('margin-left', this.pressLeft + this.$nw.deltaX);
    }
    this.emit('resize', event, this);
};

absol.ShareCreator.resizablediv.eventHandler.nPress = function (event) {
    if (this.getComputedStyleValue('position') == 'absolute') {
        var styleTop = this.getComputedStyleValue('top');
        if (styleTop == 'auto')
            this.pressTop = 0;
        else
            this.pressTop = parseFloat(styleTop.replace('px', ''));
    }
    else {
        var styleMarginTop = this.getComputedStyleValue('margin-top');
        if (styleMarginTop == 'auto')
            this.pressTop = 0;
        else
            this.pressTop = parseFloat(styleMarginTop.replace('px', ''));
    }
    this.pressHeight = this.getBoundingClientRect().height;
};

absol.ShareCreator.resizablediv.eventHandler.nDrag = function (event) {
    this.addStyle('height', this.pressHeight - this.$n.deltaY + 'px');
    if (this.getComputedStyleValue('position') == 'absolute') {
        this.addStyle('top', this.pressTop + this.$n.deltaY);
    }
    else {
        this.addStyle('margin-top', this.pressTop + this.$n.deltaY);
    }
    this.emit('resize', event, this);
};



absol.ShareCreator.resizablediv.eventHandler.nePress = function (event) {
    if (this.getComputedStyleValue('position') == 'absolute') {
        var styleTop = this.getComputedStyleValue('top');
        if (styleTop == 'auto')
            this.pressTop = 0;
        else
            this.pressTop = parseFloat(styleTop.replace('px', ''));
    }
    else {
        var styleMarginTop = this.getComputedStyleValue('margin-top');
        if (styleMarginTop == 'auto')
            this.pressTop = 0;
        else
            this.pressTop = parseFloat(styleMarginTop.replace('px', ''));
    }
    var bound = this.getBoundingClientRect();
    this.pressHeight = bound.height;
    this.pressWidth = bound.width;

};

absol.ShareCreator.resizablediv.eventHandler.neDrag = function (event) {
    this.addStyle('height', this.pressHeight - this.$ne.deltaY + 'px');
    this.addStyle('width', this.pressWidth + this.$ne.deltaX + 'px');
    if (this.getComputedStyleValue('position') == 'absolute') {
        this.addStyle('top', this.pressTop + this.$ne.deltaY);
    }
    else {
        this.addStyle('margin-top', this.pressTop + this.$ne.deltaY);
    }
    this.emit('resize', event, this);
};


absol.ShareCreator.resizablediv.eventHandler.ePress = function (event) {
    this.pressWidth = this.getBoundingClientRect().width;
};

absol.ShareCreator.resizablediv.eventHandler.eDrag = function (event) {
    this.addStyle('width', this.pressWidth + this.$e.deltaX + 'px');
    this.emit('resize', event, this);
};

absol.ShareCreator.resizablediv.eventHandler.sPress = function (event) {
    this.pressHeight = this.getBoundingClientRect().height;
};

absol.ShareCreator.resizablediv.eventHandler.sDrag = function (event) {
    this.addStyle('height', this.pressHeight + this.$s.deltaY + 'px');
    this.emit('resize', event, this);
};



absol.ShareCreator.resizablediv.eventHandler.swPress = function (event) {
    if (this.getComputedStyleValue('position') == 'absolute') {
        var styleLeft = this.getComputedStyleValue('left');
        if (styleLeft == 'auto')
            this.pressLeft = 0;
        else
            this.pressLeft = parseFloat(styleLeft.replace('px', ''));
    }
    else {
        var styleMarginLeft = this.getComputedStyleValue('margin-left');
        if (styleMarginLeft == 'auto')
            this.pressLeft = 0;
        else
            this.pressLeft = parseFloat(styleMarginLeft.replace('px', ''));
    }
    var bound = this.getBoundingClientRect();
    this.pressHeight = bound.height;
    this.pressWidth = bound.width;

};

absol.ShareCreator.resizablediv.eventHandler.swDrag = function (event) {
    this.addStyle('height', this.pressHeight + this.$sw.deltaY + 'px');
    this.addStyle('width', this.pressWidth - this.$sw.deltaX + 'px');
    if (this.getComputedStyleValue('position') == 'absolute') {
        this.addStyle('left', this.pressLeft + this.$sw.deltaX);
    }
    else {
        this.addStyle('margin-left', this.pressLeft + this.$sw.deltaX);
    }
    this.emit('resize', event, this);
};


absol.ShareCreator.resizablediv.eventHandler.sePress = function (event) {
    var bound = this.getBoundingClientRect();
    this.pressHeight = bound.height;
    this.pressWidth = bound.width;

};

absol.ShareCreator.resizablediv.eventHandler.seDrag = function (event) {
    this.addStyle({
        height: this.pressHeight + this.$se.deltaY + 'px',
        width: this.pressWidth + this.$se.deltaX + 'px'
    });
    this.emit('resize', event, this);
};



absol.ShareCreator.resizablediv.eventHandler.wPress = function (event) {
    if (this.getComputedStyleValue('position') == 'absolute') {
        var styleLeft = this.getComputedStyleValue('left');
        if (styleLeft == 'auto')
            this.pressLeft = 0;
        else
            this.pressLeft = parseFloat(styleLeft.replace('px', ''));
    }
    else {
        var styleMarginLeft = this.getComputedStyleValue('margin-left');
        if (styleMarginLeft == 'auto')
            this.pressLeft = 0;
        else
            this.pressLeft = parseFloat(styleMarginLeft.replace('px', ''));
    }
    var bound = this.getBoundingClientRect();
    this.pressWidth = bound.width;

};

absol.ShareCreator.resizablediv.eventHandler.wDrag = function (event) {
    this.addStyle('width', this.pressWidth - this.$w.deltaX + 'px');
    if (this.getComputedStyleValue('position') == 'absolute') {
        this.addStyle('left', this.pressLeft - this.$w.deltaX);
    }
    else {
        this.addStyle('margin-left', this.pressLeft + this.$w.deltaX);
    }
    this.emit('resize', event, this);
};


absol.ShareCreator.resizablediv.property = {};
absol.ShareCreator.resizablediv.property.resizable = {
    set: function (value) {
        if (value) this.addClass('resizable');
        else this.removeClass('resizable');
    },
    get: function () {
        return this.containsClass('resizable');
    }
};
