import Vcore from "./VCore";
import BaseChart from "./BaseChart";
import { text, circle, hline, moveHLine, rect, map, isNumber } from "./helper";
import { translate } from "./template";

var _ = Vcore._;
var $ = Vcore.$;

function MappingChart() {
    var res = _({
        tag: 'svg',
        class: 'mapping-chart',
        extendEvent: ['add']
    });

    res.sync = res.afterAttached();

    return res;
};




MappingChart.prototype.preInit = function () {
    this.canvasWidth = 300;
    this.canvasHeight = 300;
    this.rangePlotRadius = 6;
    this.axisTop = 70;
    this.hitboxHeight = 20;
    this.tempValue = 0;
    this.markerHitboxWidth = 1;

}

MappingChart.prototype.updateSize = BaseChart.prototype.updateSize;
MappingChart.prototype.numberToString = BaseChart.prototype.numberToString;





MappingChart.prototype.initAxis = function () {
    this.$topLine = hline(50, 50, 500, 'mapping-chart-range-line').addTo(this);
    this.$botLine = hline(50, 50, 500, 'mapping-chart-range-line').addTo(this);


    this.$topMinText = text(this.min + '', 20, 20, 'mapping-chart-range-text').addTo(this);
    this.$topMaxText = text(this.max + '', 30, 20, 'mapping-chart-range-text').addTo(this);
    this.$botMinText = text(this.min + '', 20, 50, 'mapping-chart-range-text').addTo(this);
    this.$botMaxText = text(this.max + '', 30, 50, 'mapping-chart-range-text').addTo(this);

    this.$topMinPlot = circle(25, 20, this.rangePlotRadius, 'mapping-chart-range-plot').addTo(this);
    this.$topMaxPlot = circle(55, 20, this.rangePlotRadius, 'mapping-chart-range-plot').addTo(this);

    this.$botMinPlot = circle(25, 50, this.rangePlotRadius, 'mapping-chart-range-plot').addTo(this);
    this.$botMaxPlot = circle(55, 50, this.rangePlotRadius, 'mapping-chart-range-plot').addTo(this);



    this.$title = text(this.title, 0, 25, 'mapping-chart-title').addTo(this).attr('text-anchor', 'middle');

};


MappingChart.prototype.updateAxis = function () {

    this.axisLeft = 10 + this.$topMinText.getBBox().width + 10;
    var maxTextWidth = this.$botMaxText.getBBox().width;
    this.axisRight = this.canvasWidth - 10 - maxTextWidth - 10;
    this.axisBottom = this.canvasHeight - 50;

    this.$topMinText.attr({
        x: '10',
        y: this.axisTop - 4 + ''
    });

    this.$topMaxText.attr({
        x: this.canvasWidth - 10 - maxTextWidth,
        y: this.axisTop - 4 + ''
    });

    this.$botMinText.attr({
        x: '10',
        y: this.axisBottom + 4 + 14
    });
    this.$botMaxText.attr({
        x: this.canvasWidth - 10 - maxTextWidth,
        y: this.axisBottom + 4 + 14
    });

    this.$topMinPlot.attr({
        cx: this.axisLeft,
        cy: this.axisTop
    });

    this.$topMaxPlot.attr({
        cx: this.axisRight,
        cy: this.axisTop
    });


    moveHLine(this.$topLine, this.axisLeft, this.axisTop, this.axisRight - this.axisLeft);

    this.$botMinPlot.attr({
        cx: this.axisLeft,
        cy: this.axisBottom
    });
    this.$botMaxPlot.attr({
        cx: this.axisRight,
        cy: this.axisBottom
    });

    moveHLine(this.$botLine, this.axisLeft, this.axisBottom, this.axisRight - this.axisLeft);

    this.$title.attr({
        x: this.canvasWidth / 2,
        y: 10 + 20
    });
};

MappingChart.prototype.initHitbox = function () {
    this.$topHitbox = rect(20, 20, 300, 20, 'vchart-hitbox')
        .on({
            mouseenter: this.eventEnterHitboxHandler.bind(this),
            mouseleave: this.eventLeaveHitboxHandler.bind(this),
            click: this.eventClickHitboxHandler.bind(this)
        })
        .addTo(this);
    this.$botHitbox = rect(20, 80, 300, 20, 'vchart-hitbox')
        .on({
            mouseenter: this.eventEnterHitboxHandler.bind(this),
            mouseleave: this.eventLeaveHitboxHandler.bind(this),
            click: this.eventClickHitboxHandler.bind(this)
        }).addTo(this);
};


MappingChart.prototype.updateHitbox = function () {
    this.$topHitbox.attr({
        x: this.axisLeft,
        y: this.axisTop - this.hitboxHeight / 2,
        height: this.hitboxHeight,
        width: this.axisRight - this.axisLeft
    });
    this.$botHitbox.attr({
        x: this.axisLeft,
        y: this.axisBottom - this.hitboxHeight / 2,
        height: this.hitboxHeight,
        width: this.axisRight - this.axisLeft
    });
};


MappingChart.prototype.initTempmarker = function () {
    this.$tempTopMarker = _('mappingchartmarker.top').addTo(this);
    this.$tempBotMarker = _('mappingchartmarker[rotate180="true"].bot').addTo(this);
    this.$tempTopMarker.text = this.min;
    this.$tempBotMarker.text = this.min;
};


MappingChart.prototype.updateTempMarker = function () {
    //todo
    if (isNumber(this.collision)) {
        this.markerHitboxWidth = Math.max(1, map(this.collision, 0, this.max - this.min, 0, this.axisRight - this.axisLeft));
    }
    this.$tempTopMarker.moveTo(this.axisLeft, this.axisTop);
    this.$tempBotMarker.moveTo(this.axisLeft, this.axisBottom);
    this.$tempTopMarker.hitboxWidth = this.markerHitboxWidth;
    this.$tempBotMarker.hitboxWidth = this.markerHitboxWidth;

};


MappingChart.prototype.initComp = function () {
    // console.log(this.canvasWidth);
    this.initAxis();
    this.initTempmarker();
    this.initHitbox();
};

MappingChart.prototype.updateComp = function () {
    // console.log(this.canvasWidth);
    this.updateAxis();
    this.updateHitbox();
    this.updateTempMarker();

};


MappingChart.prototype.update = function () {
    this.updateSize();

    this.updateComp();

};

MappingChart.prototype.addMarkerTop = function (value) {
    console.log('top', this.tempValue);
};

MappingChart.prototype.addMarkerBottom = function (value) {
    console.log('bot', this.tempValue);
};



MappingChart.prototype.eventEnterHitboxHandler = function (event) {
    if (this.__removeClassTimeOut) {
        clearTimeout(this.__removeClassTimeOut);
        self.__removeClassTimeOut = false;
    }
    if (event.target == this.$topHitbox) {
        this.addClass('mapping-chart-hover-top');
    }
    else if (event.target == this.$botHitbox) {
        this.addClass('mapping-chart-hover-bot');
    }
};

MappingChart.prototype.eventLeaveHitboxHandler = function (event) {
    var target = event.target;
    var self = this;
    if (this.__removeClassTimeOut) {
        clearTimeout(this.__removeClassTimeOut);
        self.__removeClassTimeOut = false;
    }
    this.__removeClassTimeOut = setTimeout(function () {
        if (target == self.$topHitbox) {
            self.removeClass('mapping-chart-hover-top');
        }
        else if (target == self.$botHitbox) {
            self.removeClass('mapping-chart-hover-bot');
        }
        self.__removeClassTimeOut = false;
    }, 100)

};

MappingChart.prototype.eventClickHitboxHandler = function (event) {
    var target = event.target;
    if (target == this.$topHitbox) {
        this.addMarkerTop(this.tempValue);
    }
    else if (target == this.$botHitbox) {
        this.addMarkerBottom(this.tempValue);
    }
};


MappingChart.prototype.eventMoveHandler = function (event) {
    var hitboxBound = this.$botHitbox.getBoundingClientRect();
    var eventX = event.clientX;
    var tempValue = map(eventX, hitboxBound.left, hitboxBound.right, this.min, this.max);
    this.tempValue = Math.min(this.max, Math.max(this.min, tempValue));
    var newX = map(this.tempValue, this.min, this.max, this.axisLeft, this.axisRight);
    this.$tempTopMarker.moveTo(newX, this.axisTop);
    this.$tempBotMarker.moveTo(newX, this.axisBottom);
    var markerText = this.numberToString(this.tempValue);
    this.$tempTopMarker.text = markerText;
    this.$tempBotMarker.text = markerText;
};




MappingChart.property = {};

// MappingChart.property.canvasWidth = {
//     set:function(value){
//         console.log('set', value);
//         this._canvasWidth = value/2;
//     },
//     get:function(){
//         return this._canvasWidth;
//     }
// };





MappingChart.prototype.init = function (props) {
    this.on('mousemove', this.eventMoveHandler.bind(this));
    this.preInit();
    this.super(props);
    this.initComp();
    this.sync.then(this.update.bind(this));
};


function MappingChartMarker() {
    var res = _({
        // tag:'g',
        class: 'mapping-chart-marker',
        attr: {
            transform: translate(200, 200)
        }
    });

    res.$box = _('shape.mapping-chart-marker-box')
        .addTo(res);

    res.$text = text('', 0, -10, 'mapping-chart-marker-text').attr('text-anchor', 'middle').addTo(res);
    res.$hitbox = rect(-3, -30, 6, 60, 'vchart-hitbox').addTo(res);
    res.sync = res.afterAttached();
    return res;
}


MappingChartMarker.prototype.updateBox = function () {
    var textBBox = this.$text.getBBox();
    if (this.rotate180) {
        this.$box.begin()
            .moveTo(0, 0)
            .lineTo(-2, 5)
            .lineTo(-textBBox.width / 2 - 5, 5)
            .lineTo(-textBBox.width / 2 - 5, textBBox.height + 2 + 5)
            .lineTo(textBBox.width / 2 + 5, +textBBox.height + 2 + 5)
            .lineTo(textBBox.width / 2 + 5, 5)
            .lineTo(2, 5)
            .end();
        this.$text.attr('y', 3 + textBBox.height);
    }
    else {
        this.$box.begin()
            .moveTo(0, 0)
            .lineTo(-2, -5)
            .lineTo(-textBBox.width / 2 - 5, -5)
            .lineTo(-textBBox.width / 2 - 5, -textBBox.height - 2 - 5)
            .lineTo(textBBox.width / 2 + 5, -textBBox.height - 2 - 5)
            .lineTo(textBBox.width / 2 + 5, - 5)
            .lineTo(2, - 5)
            .end();
        this.$text.attr('y', -10);
    }
};

MappingChartMarker.prototype.moveTo = function (x, y) {
    this.attr('transform', translate(x, y));
};

MappingChartMarker.property = {};
MappingChartMarker.property.text = {
    set: function (value) {
        this._text = value + '';
        this.$text.innerHTML = this._text;
        this.updateBox();
    },
    get: function () {
        return this._text || '';
    }
};


MappingChartMarker.property.rotate180 = {
    set: function (value) {
        this._rotate180 = !!value;
        this.updateBox();
    },
    get: function () {
        return !!this._rotate180;
    }
}

MappingChartMarker.property.hitboxWidth = {
    set: function (value) {
        this.$hitbox.attr({
            width: value,
            x: -value / 2
        })
    },
    get: function () {
        return parseFloat(this.$hitbox.attr('width'));
    }
};

MappingChartMarker.attribute = {};

MappingChartMarker.attribute.rotate180 = {
    set: function (value) {
        this.rotate180 = value == 'true' || value === true;
    },
    get: function () {
        return this.rotate180 ? 'true' : 'false'
    },
    remove: function () {
        this.rotate180 = false;
    }
};

MappingChartMarker.attribute.rotate180 = {
    set: function (value) {
        value = parseFloat(value + '');
        if (isNumber(value)) {
            this.hitboxWidth = value;
        }
    },
    get: function () {
        return this.hitboxWidth + '';
    },
    remove: function () {
        this.hitboxWidth = 6;
    }
};


MappingChartMarker.prototype.init = function () {
    this.sync.then(this.updateBox.bind(this))
};



Vcore.creator.mappingchartmarker = MappingChartMarker;


Vcore.creator.mappingchart = MappingChart;
export default MappingChart;