import Vcore from "./VCore";
import BaseChart from "./BaseChart";
import { text, circle, hline, moveHLine, rect, map, isNumber } from "./helper";
import { translate } from "./template";


var _ = Vcore._;
var $ = Vcore.$;

var STATE_READY = 0;
var STATE_MODIFY = 1;


function MappingChart() {
    var res = _({
        tag: 'svg',
        attr: {
            tabindex: '1'
        },
        class: 'mapping-chart',
        extendEvent: ['add', 'addmakertop', 'addmarkerbot', 'clicktop', 'clickbot', 'addline', 'removeline', 'editline'],
        child: ['g.background', 'g.middleground', 'g.forceground']
    });

    res.$background = $('g.background', res);
    res.$middleground = $('g.middleground', res);
    res.$forceground = $('g.forceground', res);
    res.sync = res.afterAttached();

    return res;
};

MappingChart.prototype.generateValue = function (number) {
    return Math.round(Math.round(number * this.precision) / this.precision);
}


MappingChart.prototype.preInit = function () {
    this.canvasWidth = 300;
    this.canvasHeight = 300;
    this.rangePlotRadius = 6;
    this.axisTop = 70;
    this.hitboxHeight = 20;
    this.tempValue = 0;
    this.markerHitboxWidth = 1;

}

MappingChart.prototype.numberToString = function (number) {
    return number + '';
}

MappingChart.prototype.updateSize = BaseChart.prototype.updateSize;
MappingChart.prototype.numberToString = BaseChart.prototype.numberToString;





MappingChart.prototype.initAxis = function () {

    this.$topMinPlot = _('shape.mapping-chart-range-plot').addTo(this.$background);
    this.$topMaxPlot = _('shape.mapping-chart-range-plot').addTo(this.$background);

    this.$botMinPlot = _('shape.mapping-chart-range-plot').addTo(this.$background);
    this.$botMaxPlot = _('shape.mapping-chart-range-plot').addTo(this.$background);

    this.$topLine = hline(50, 50, 500, 'mapping-chart-range-line').addTo(this.$background);
    this.$botLine = hline(50, 50, 500, 'mapping-chart-range-line').addTo(this.$background);

    this.$topMinText = text(this.numberToString(this.min), 20, 20, 'mapping-chart-range-text').addTo(this.$background);
    this.$topMaxText = text(this.numberToString(this.max), 30, 20, 'mapping-chart-range-text').addTo(this.$background);

    this.$botMinText = text(this.numberToString(this.min), 20, 50, 'mapping-chart-range-text').addTo(this.$background);
    this.$botMaxText = text(this.numberToString(this.max), 30, 50, 'mapping-chart-range-text').addTo(this.$background);


    this.$title = text(this.title||'', 0, 25, 'mapping-chart-title').addTo(this.$background).attr('text-anchor', 'middle');

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

    this.$topMinPlot.begin().moveTo(this.axisLeft, this.axisTop - 5).lineTo(this.axisLeft, this.axisTop + 5).end();
    this.$topMaxPlot.begin().moveTo(this.axisRight, this.axisTop - 5).lineTo(this.axisRight, this.axisTop + 5).end();

    moveHLine(this.$topLine, this.axisLeft, this.axisTop, this.axisRight - this.axisLeft);

    this.$botMinPlot.begin().moveTo(this.axisLeft, this.axisBottom - 5).lineTo(this.axisLeft, this.axisBottom + 5).end();
    this.$botMaxPlot.begin().moveTo(this.axisRight, this.axisBottom - 5).lineTo(this.axisRight, this.axisBottom + 5).end();

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
        .addTo(this.$forceground);
    this.$botHitbox = rect(20, 80, 300, 20, 'vchart-hitbox')
        .on({
            mouseenter: this.eventEnterHitboxHandler.bind(this),
            mouseleave: this.eventLeaveHitboxHandler.bind(this),
            click: this.eventClickHitboxHandler.bind(this)
        }).addTo(this.$forceground);
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
    this.$tempTopMarker = _('mappingchartmarker.top').addTo(this.$forceground);
    this.$tempBotMarker = _('mappingchartmarker.bot').addTo(this.$forceground);
    this.$tempTopMarker.rotate180 = true;
    this.$tempTopMarker.text = this.numberToString(this.min);
    this.$tempBotMarker.text = this.numberToString(this.min);
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
    this.initAxis();
    this.initTempmarker();
    this.initHitbox();
};

MappingChart.prototype.updateComp = function () {
    this.updateAxis();
    this.updateHitbox();
    this.updateTempMarker();

};


MappingChart.prototype.update = function () {
    this.updateSize();

    this.updateComp();

};

MappingChart.prototype.addMarkerTop = function (value) {
    var value = this.generateValue(this.tempValue);
    var cLine;

    if (!this._tempLine) {
        this._tempLine = {
            value: 0,//default
            $line: _('shape.mapping-chart-map-line').addTo(this.$background),
            $line_hitbox: _('shape.mapping-chart-map-line-hitbox.vchart-hitbox').addTo(this.$middleground),
            $topMarker: _({
                tag: 'mappingchartmarker',
            }).addTo(this.$forceground),
            $topPlot: circle(20, 20, 5, 'mapping-chart-line-plot').addTo(this.$forceground)
        }
    }
    this._tempLine.value = value;
    var x0 = map(value, this.min, this.max, this.axisLeft, this.axisRight);
    var y0 = this.axisTop;
    this._tempLine.x0 = x0;
    this._tempLine.y0 = y0;
    this._tempLine.$topMarker.moveTo(x0, y0);
    this._tempLine.$topPlot.attr({
        cx: x0,
        cy: y0
    });
    this._tempLine.$topMarker.text = this.numberToString(this.generateValue(value));

    var self = this;
    var lineElt = this._tempLine.$line;
    function mouseMoveHandler(event) {
        lineElt.begin().moveTo(x0, y0).lineTo(self.mouseX, self.mouseY).end();

    }

    this.on('mousemove', mouseMoveHandler);
    this.once('addmarkerbot', function () {
        this.off('mousemove', mouseMoveHandler);
    });
};

MappingChart.prototype.addMarkerBottom = function (mapValue) {
    if (!this._tempLine) return;//must click top first
    var mapValue = this.generateValue(this.tempValue);
    var isCross = this._checkLineIsCross(this._tempLine.value, mapValue);
    if (isCross) return;
    var x1 = map(mapValue, this.min, this.max, this.axisLeft, this.axisRight);
    var y1 = this.axisBottom;
    this._tempLine.mapValue = mapValue;
    this._tempLine.$botMarker = _({
        tag: 'mappingchartmarker',
        props: {
            text: this.numberToString(this.generateValue(mapValue)),
            rotate180: true
        }
    })
        .moveTo(x1, y1)
        .addTo(this.$forceground);

    this._tempLine.x1 = x1;
    this._tempLine.y1 = y1;

    this._tempLine.$botPlot = circle(20, 80, 5, 'mapping-chart-line-plot').addTo(this.$forceground);

    this._tempLine.$botPlot.attr({
        cx: x1,
        cy: y1
    });


    this._tempLine.$line.begin()
        .moveTo(this._tempLine.x0, this._tempLine.y0)
        .lineTo(x1, y1)
        .end();
    this._tempLine.$line_hitbox.attr('d', this._tempLine.$line.attr('d'));

    var tempLine = this._tempLine;
    this.settupEvent(tempLine);

    this._lineList.push(this._tempLine);
    this._tempLine = undefined;
    this.emit('addmarkerbot', {
        target: this,
        data: tempLine
    }, this);
    this.emit('addline', this.content, this);
};

MappingChart.prototype._checkLineIsCross = function (value, mapValue) {
    return this._lineList.some(function (element) {
        return (element.value - value) * (element.mapValue - mapValue) < 0;
    });
};




MappingChart.prototype.eventEnterHitboxHandler = function (event) {
    if (this.__removeClassTimeOutTop) {
        clearTimeout(this.__removeClassTimeOutTop);
        self.__removeClassTimeOutTop = false;
    }
    if (this.__removeClassTimeOutBot) {
        clearTimeout(this.__removeClassTimeOutBot);
        self.__removeClassTimeOutBot = false;
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
    if (target == self.$topHitbox) {

        if (this.__removeClassTimeOutTop) {
            clearTimeout(this.__removeClassTimeOutTop);
            self.__removeClassTimeOutTop = false;
        }
        this.__removeClassTimeOutTop = setTimeout(function () {
            self.removeClass('mapping-chart-hover-top');
            self.__removeClassTimeOutTop = false;
        }, 100);
    }
    else if (target == self.$botHitbox) {
        if (this.__removeClassTimeOutBot) {
            clearTimeout(this.__removeClassTimeOutBot);
            self.__removeClassTimeOutBot = false;
        }
        self.__removeClassTimeOutBot = setTimeout(function () {
            self.removeClass('mapping-chart-hover-bot');
            self.__removeClassTimeOutBot = false;
        }, 100)
    }


};

MappingChart.prototype.eventClickHitboxHandler = function (event) {
    var target = event.target;
    if (target == this.$topHitbox) {
        if (this.state == STATE_READY) {
            this.addMarkerTop(this.tempValue);
        }

        this.emit('clicktop', {}, this);
    }
    else if (target == this.$botHitbox) {
        if (this.state == STATE_READY) {
            this.addMarkerBottom(this.tempValue);
        }
        this.emit('clickbot', {}, this);

    }
};


MappingChart.prototype.eventMoveHandler = function (event) {
    var hitboxBound = this.$botHitbox.getBoundingClientRect();
    var eventX = event.clientX;
    var tempValue = map(eventX, hitboxBound.left, hitboxBound.right, this.min, this.max);
    tempValue = Math.round(tempValue);
    this.tempValue = Math.min(this.max, Math.max(this.min, tempValue));
    var newX = map(this.tempValue, this.min, this.max, this.axisLeft, this.axisRight);
    this.$tempTopMarker.moveTo(newX, this.axisTop);
    this.$tempBotMarker.moveTo(newX, this.axisBottom);
    var markerText = this.numberToString(this.generateValue(this.tempValue));
    this.$tempTopMarker.text = markerText;
    this.$tempBotMarker.text = markerText;

    var bound = this.getBoundingClientRect();
    this.mouseX = map(event.clientX, bound.left, bound.right, 0, this.canvasWidth);
    this.mouseY = map(event.clientY, bound.top, bound.bottom, 0, this.canvasHeight);
};


MappingChart.prototype.cancelCMD = function () {
    if (this._tempLine) {
        this.removeElementInObject(this._tempLine);
        this._tempLine = undefined;
    }
    else {

    }
};
MappingChart.prototype.deleteCMD = function () {
    if (this._tempLine) {
        this.removeElementInObject(this._tempLine);
        this._tempLine = undefined;
    }
    else {
        if (this._selectedLine !== undefined) {
            var tempLine = this._selectedLine;
            this.removeElementInObject(tempLine);
            this._lineList = this._lineList.filter(function (elt) {
                return ((elt.value != tempLine.value) && (elt.mapValue != tempLine.mapValue));
            });
            this._selectedLine = undefined;
            this.emit('removeline', this.content, this);
        }
    }
};


MappingChart.prototype.eventKeyDownHandler = function (event) {
    if (event.key == "Escape") {
        this.cancelCMD();
        event.preventDefault();
    } else if (event.key == "Delete") {
        this.deleteCMD();
        event.preventDefault();
    }
};

MappingChart.prototype.settupEvent = function (tempLine) {
    var self = this;
    function clickLineHandler(event) {


        if (self._selectedLine !== undefined) {
            self._selectedLine.$line.removeClass('selected-line');
            self._selectedLine = undefined;
        }
        self._selectedLine = tempLine;
        tempLine.$line.addClass('selected-line');

        function unSelectLine() {
            tempLine.$line.removeClass('selected-line');
            if (self._selectedLine !== undefined)
                if (self._selectedLine.$line == tempLine.$line)
                    self._selectedLine = undefined;
            self.off('click', clickOutHandler);
            self.off('keydown', cancelFocusHandler);
        }

        function clickOutHandler(event) {
            if (event.target != tempLine.$line) {
               unSelectLine();
            }
        }

        function cancelFocusHandler(event) {
            if (event.key == "Escape") {
                unSelectLine();
            }
        }

        setTimeout(function () {
            self.on('click', clickOutHandler);
        }, 1);

        setTimeout(function () {
            self.on('keydown', cancelFocusHandler);
        }, 1);
    }

    var lineElt = tempLine.$line;
    var line_hitboxElt = tempLine.$line_hitbox;
    function clickTopPlotHandler(event) {
        self.state = STATE_MODIFY;
        tempLine.$topMarker.addStyle('visibility', 'hidden');
        tempLine.$topPlot.addStyle('visibility', 'hidden');
        function mouseMoveHandler(event) {
            lineElt.begin().moveTo(self.mouseX, self.mouseY).lineTo(tempLine.x1, tempLine.y1).end();
        }

        function clickTopBarHandler(event, sender) {
            var newValue = self.tempValue;
            if (self._checkLineIsCross(newValue, tempLine.mapValue)) {
            }
            else {
                var newX0 = map(newValue, this.min, this.max, this.axisLeft, this.axisRight);
                lineElt.begin().moveTo(newX0, tempLine.y0).lineTo(tempLine.x1, tempLine.y1).end();
                line_hitboxElt.attr('d', lineElt.attr('d'));
                tempLine.$topMarker.moveTo(newX0, tempLine.y0);
                tempLine.$topMarker.text = this.numberToString(this.generateValue(newValue));
                tempLine.$topPlot.attr({
                    cx: newX0,
                    cy: tempLine.y0
                });
                tempLine.x0 = newX0;
                tempLine.value = newValue;

                tempLine.$topMarker.removeStyle('visibility', 'hidden');
                tempLine.$topPlot.removeStyle('visibility', 'hidden');

                self.off('clicktop', clickTopBarHandler);
                self.off('mousemove', mouseMoveHandler);
                self.off('keydown', KeyDownHandler);
                self.state = STATE_READY;
                this.emit('editline', this.content, this);
            }

        }
        function cancel() {
            lineElt.begin().moveTo(tempLine.x0, tempLine.y0).lineTo(tempLine.x1, tempLine.y1).end();
            line_hitboxElt.attr('d', lineElt.attr('d'));
        };

        function deleteElt() {
            self.removeElementInObject(tempLine);
            self._lineList = self._lineList.filter(function (elt) {
                return ((elt.value != tempLine.value) && (elt.mapValue != tempLine.mapValue));
            });
            this.emit('removeline', this.content, this);
        };

        function KeyDownHandler(event) {
            tempLine.$topMarker.removeStyle('visibility', 'hidden');
            tempLine.$topPlot.removeStyle('visibility', 'hidden');
            if (event.key == "Escape") {
                cancel();
                event.preventDefault();
            } else if (event.key == "Delete") {
                deleteElt();
                event.preventDefault();
            }
            self.off('clicktop', clickTopBarHandler);
            self.off('mousemove', mouseMoveHandler);
            self.off('keydown', KeyDownHandler);
            self.state = STATE_READY;
        };

        self.on('clicktop', clickTopBarHandler);

        self.on('mousemove', mouseMoveHandler);

        self.on('keydown', KeyDownHandler);

    }

    function clickBotPlotHandler(event) {
        self.state = STATE_MODIFY;
        tempLine.$botMarker.addStyle('visibility', 'hidden');
        tempLine.$botPlot.addStyle('visibility', 'hidden');
        function mouseMoveHandler(event) {
            lineElt.begin().moveTo(tempLine.x0, tempLine.y0).lineTo(self.mouseX, self.mouseY).end();
        }

        function clickBotBarHandler(event, sender) {
            var newValue = self.tempValue;
            if (self._checkLineIsCross(tempLine.value, newValue)) {
            }
            else {
                var newX1 = map(newValue, this.min, this.max, this.axisLeft, this.axisRight);
                lineElt.begin().moveTo(tempLine.x0, tempLine.y0).lineTo(newX1, tempLine.y1).end();
                line_hitboxElt.attr('d', lineElt.attr('d'));
                tempLine.$botMarker.moveTo(newX1, tempLine.y1);
                tempLine.$botMarker.text = this.numberToString(this.generateValue(newValue));
                tempLine.$botPlot.attr({
                    cx: newX1,
                    cy: tempLine.y1
                });
                tempLine.x1 = newX1;
                tempLine.mapValue = newValue;

                tempLine.$botMarker.removeStyle('visibility', 'hidden');
                tempLine.$botPlot.removeStyle('visibility', 'hidden');

                self.off('clickbot', clickBotBarHandler);
                self.off('mousemove', mouseMoveHandler);
                self.off('keydown', KeyDownHandler);
                self.state = STATE_READY;
                this.emit('editline', this.content, this);
            }

        }
        function cancel() {
            lineElt.begin().moveTo(tempLine.x0, tempLine.y0).lineTo(tempLine.x1, tempLine.y1).end();
            line_hitboxElt.attr('d', lineElt.attr('d'));
        };

        function deleteElt() {
            self.removeElementInObject(tempLine);
            self._lineList = self._lineList.filter(function (elt) {
                return ((elt.value != tempLine.value) && (elt.mapValue != tempLine.mapValue));
            });
        };

        function KeyDownHandler(event) {
            tempLine.$botMarker.removeStyle('visibility', 'hidden');
            tempLine.$botPlot.removeStyle('visibility', 'hidden');
            if (event.key == "Escape") {
                cancel();
                event.preventDefault();
            } else if (event.key == "Delete") {
                deleteElt();
                event.preventDefault();
            }
            self.off('clickbot', clickBotBarHandler);
            self.off('mousemove', mouseMoveHandler);
            self.off('keydown', KeyDownHandler);
            self.state = STATE_READY;
        };

        self.on('clickbot', clickBotBarHandler);

        self.on('mousemove', mouseMoveHandler);

        self.on('keydown', KeyDownHandler);

    }

    tempLine.$line_hitbox.on("click", clickLineHandler);
    tempLine.$topPlot.on("click", clickTopPlotHandler);
    tempLine.$botPlot.on("click", clickBotPlotHandler);
}

MappingChart.prototype.setLineElt = function (value, mapValue) {
    value = this.generateValue(value);
    mapValue = this.generateValue(mapValue);
    var x0 = map(value, this.min, this.max, this.axisLeft, this.axisRight);
    var y0 = this.axisTop;
    var x1 = map(mapValue, this.min, this.max, this.axisLeft, this.axisRight);
    var y1 = this.axisBottom;
    var tempLine;
    var cLine;
    tempLine = {
        value: value,
        mapValue: mapValue,
        $line: _('shape.mapping-chart-map-line').addTo(this.$background),
        $line_hitbox: _('shape.mapping-chart-map-line-hitbox.vchart-hitbox').addTo(this.$middleground),
        $topMarker: _({
            tag: 'mappingchartmarker',
        }).addTo(this.$forceground),
        $topPlot: circle(20, 20, 5, 'mapping-chart-line-plot').addTo(this.$forceground),
        $botMarker: _({
            tag: 'mappingchartmarker',
            props: {
                rotate180: true
            }
        }).addTo(this.$forceground),
        $botPlot: circle(20, 20, 5, 'mapping-chart-line-plot').addTo(this.$forceground),
        x0: x0,
        x1: x1,
        y0: y0,
        y1: y1
    }
    tempLine.x0 = x0;
    tempLine.y0 = y0;
    tempLine.x1 = x1;
    tempLine.y1 = y1;
    tempLine.$topMarker.moveTo(x0, y0);
    tempLine.$topPlot.attr({
        cx: x0,
        cy: y0
    });
    tempLine.$botMarker.moveTo(x1, y1);
    tempLine.$botPlot.attr({
        cx: x1,
        cy: y1
    });
    tempLine.$topMarker.text = this.numberToString(value);
    tempLine.$botMarker.text = this.numberToString(mapValue);
    tempLine.$line.begin().moveTo(x0, y0).lineTo(x1, y1).end();
    tempLine.$line_hitbox.attr('d', tempLine.$line.attr('d'));
    ///todo

    this.settupEvent(tempLine);


    this._lineList.push(tempLine);
}


MappingChart.prototype.removeElementInObject = function (object) {
    Object.keys(object).forEach(function (key) {
        if (typeof object[key].remove == 'function') object[key].remove();
    })
};

MappingChart.property = {};

MappingChart.property.content = {
    set: function (content) {
        this._lineList.forEach(function (lineData) {
            this.removeElementInObject(lineData);
        }.bind(this));

        this._lineList = [];
        this.sync.then(function () {
            for (var i = 0; i < content.length; i++) {
                this.setLineElt(content[i].value, content[i].mapValue);
            }

        }.bind(this));
        //
    },
    get: function () {
        var ret = this._lineList.map(function (lineData) {
            return {
                value: lineData.value,
                mapValue: lineData.mapValue
            }
        });
        ret.sort(function (a, b) {
            return a.value - b.value;
        });
        return ret;
    }
};


/**
 * @typedef MapLine
 * @property {Number} value
 * @property {Number} mapValue
 * @property {Path} $line
 * @property {MappingChartMarker} $topMarker
 * @property {MappingChartMarker} $botMarker
 * @property {circle} $botPlot
 * @property {circle} $botPlot
 */




MappingChart.prototype.init = function (props) {
    this.on('mousemove', this.eventMoveHandler.bind(this));
    this.on('keydown', this.eventKeyDownHandler.bind(this));
    this.preInit();
    this._lineList = [];
    this.sync = this.sync.then(this.update.bind(this));
    this.super(props);
    this.state = STATE_READY;
    /**
    * @type {Array<MapLine>}
    */

    this.initComp();
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
    return this;
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


MappingChartMarker.prototype.init = function (props) {
    this.super(props);
    this.sync.then(this.updateBox.bind(this))
};



Vcore.creator.mappingchartmarker = MappingChartMarker;


Vcore.creator.mappingchart = MappingChart;
export default MappingChart;