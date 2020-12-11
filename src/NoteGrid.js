import Vcore from "./VCore";
import { translate } from './template';

var _ = Vcore._;
var $ = Vcore.$;


function NoteGrid() {
    this._width = NaN;
    this._height = NaN;
    this._itemMargin = 0;
    this._padding = 0;
    this.$content = $('.vchart-node-grid-content', this);
    this.$box = $('rect.vchart-node-grid-box', this);
    this.boxWidth = 0;
    this.boxHeight = 0;
}

NoteGrid.tag = 'NoteGrid'.toLowerCase();

NoteGrid.prototype.updateSize = function () {
    // this.
    var children = Array.prototype.slice.call(this.$content.children);
    var bBoxes = children.map(function (e) {
        return e.getBBox();
    });
    var maxWidth = bBoxes.reduce(function (ac, cr) {
        return Math.max(ac, cr.width);
    }, 0);
    var maxHeight = bBoxes.reduce(function (ac, cr) {
        return Math.max(ac, cr.height);
    }, 0);

    var availableWidth;
    if (this._width > 0) availableWidth = this._width;
    else availableWidth = this._padding * 2 + (children.length - 1) * this._itemMargin + children.length * maxWidth;
    var itemPerRow = Math.floor((availableWidth - this._padding * 2 + this._itemMargin + 0.1) / (maxWidth + this._itemMargin));
    var marginRight = (availableWidth - this._padding * 2 - itemPerRow * maxWidth) / (itemPerRow - 1);//in view

    var availableHeight;
    var itemPerCol = Math.ceil(children.length / itemPerRow);

    if (this._height > 0) availableHeight = this._height;
    else availableHeight = this._padding * 2 + (itemPerCol - 1) * this._itemMargin + itemPerCol * maxHeight;
    var marginBottom = (availableHeight - this._padding * 2 - itemPerCol * maxHeight) / (itemPerCol - 1);//in view

    this.boxWidth = availableWidth;
    this.boxHeight = availableHeight;
    this.$box.attr({
        x: 0,
        y: 0,
        width: availableWidth,
        height: availableHeight
    });

    var i = 0;
    var x, y;
    if (isNaN(marginBottom)) marginBottom = 0;
    if (isNaN(marginRight)) marginRight = 0;
    for (var rIndex = 0; rIndex < itemPerCol && i < children.length; ++rIndex)
        for (var cIndex = 0; cIndex < itemPerRow && i < children.length; ++cIndex) {
            x = this._padding + cIndex * (maxWidth + marginRight);
            y = this._padding + rIndex * (maxHeight + marginBottom);
            children[i].attr('transform', translate(x, y));
            ++i;
        }
};


['addChild', 'clearChild', 'removeChild', 'addChildBefore', 'findChildBefore', 'findChildAfter'].forEach(function (name) {
    NoteGrid.prototype[name] = function () {
        return this.$content[name].apply(this.$content, arguments);
    }
});

NoteGrid.render = function () {
    return _({
        class: 'vchart-node-grid',
        child: [
            'rect.vchart-node-grid-box',
            '.vchart-node-grid-content'
        ]
    });
};

NoteGrid.attribute = {};

NoteGrid.attribute.width = {
    set: function (value) {
        value = parseFloat(value);
        this._width = value;
    },
    get: function () {
        return this._width;
    },
    remove: function () {
        this._width = NaN;
    }
};

NoteGrid.attribute.height = {
    set: function (value) {
        value = parseFloat(value);
        this._height = value;
    },
    get: function () {
        return this._height;
    },
    remove: function () {
        this._height = NaN;
    }
};


NoteGrid.attribute.itemMargin = {
    set: function (value) {
        value = parseFloat(value);
        this._itemMargin = value;
    },
    get: function () {
        return this._itemMargin;
    },
    remove: function () {
        this._itemMargin = NaN;
    }
};

NoteGrid.attribute.padding = {
    set: function (value) {
        value = parseFloat(value);
        this._padding = value;
    },
    get: function () {
        return this._padding;
    },
    remove: function () {
        this._padding = NaN;
    }
};

Vcore.install('NoteGrid'.toLowerCase(), NoteGrid);

export default NoteGrid;