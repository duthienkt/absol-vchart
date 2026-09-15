import SvgCanvas from "absol-svg/js/svg/SvgCanvas";

import VCore, {_} from "./VCore";
import DelaySignal from "absol/src/HTML5/DelaySignal";
import {mixClass} from "absol/src/HTML5/OOP";
import Turtle from "absol/src/Math/Turtle";
import {generatorColorScheme} from "absol-acomp/js/colorpicker/SelectColorSchemeMenu";


/**
 * @extends SvgCanvas
 * @constructor
 */
function MappingBarChart() {
    SvgCanvas.apply(this, arguments);
    this.addClass('vc-mapping-bar-chart');
    this.delaySignal = new DelaySignal(0);
    this.delaySignal.on('update_content', this.updateContent.bind(this));
    this.hookedProperties.map(key => {
        Object.defineProperty(this, key, {
            get: function () {
                return this['_' + key];
            },
            set: function (value) {
                if (this['_' + key] !== value) {
                    this['_' + key] = value;
                    this.delaySignal.emit('update_content');
                }
            }
        })
    });
    this.createStaticContent();

    this.delaySignal.emit('update_content');
}

mixClass(MappingBarChart, SvgCanvas);


MappingBarChart.tag = "MappingBarChart".toLowerCase();


MappingBarChart.prototype.createStaticContent = function () {
    this.$blockCtn = _({
        tag: 'g',
    }).addTo(this);

    this.$sourceRect = _({
        tag: 'rect',
        style: {
            fill: 'none',
            strokeWidth: 1,
            stroke: 'black'
        }
    }).addTo(this);

    this.$destRect = _({
        tag: 'rect',
        style: {
            fill: 'none',
            strokeWidth: 1,
            stroke: 'black'
        }
    }).addTo(this);

    var turtle = new Turtle().moveTo(0, 100).hLineBy(200);
    this.$ox = _({
        tag: 'path',
        class: 'vc-oxy',
        style: {
            strokeWidth: 2
        },
        attr: {
            d: turtle.getPath()
        }
    }).addTo(this);
    this.$title = _({
        tag: 'text',
        class: 'vc-title'
    }).addTo(this);
    this.$mapLine = _({
        tag: 'path',
        style: {
            strokeWidth: 1,
            stroke: 'black',
            fill: 'none'
        }
    }).addTo(this);

};

MappingBarChart.prototype.updateContent = function () {
    var sourceValues = this['sourceValues'] || [];
    var destValues = this['destValues'] || [];
    sourceValues.sort(function (a, b) {
        return a - b;
    });
    destValues.sort(function (a, b) {
        return a - b;
    });

    this.$title.clearChild().addChild(_({text: '' + this.title}));
    this.colors = generatorColorScheme(1, Math.max(sourceValues.length, destValues.length));
    this.$blockCtn.clearChild();
    this.$sourceRects = sourceValues.map((value, index) => {
        return _({
            tag: 'rect',
            attr: {
                'data-value': value,
                x: 10, y: index * 100,
                width: 50, height: 50
            },
            style: {
                fill: this.colors[index]
            }
        })
    });
    this.$blockCtn.addChild(this.$sourceRects);
    this.$destRects = destValues.map((value, index) => {
        return _({
            tag: 'rect',
            attr: {
                'data-value': value,
                x: 100, y: index * 100,
                width: 50, height: 50
            },
            style: {
                fill: this.colors[index]
            }
        })
    });
    this.$blockCtn.addChild(this.$destRects);

    this.$sourceValues = sourceValues.map((value, index) => {
        return _({
            tag: 'text',
            style: {
                'text-anchor': 'end'
            },
            attr: {
                x: 10, y: index * 100 + 20
            },
            child: {text: this.valueToText(value)}
        });
    });
    this.$blockCtn.addChild(this.$sourceValues);
    this.$destValues = destValues.map((value, index) => {
        return _({
            tag: 'text',
            style: {
                'text-anchor': 'end'
            },
            attr: {
                x: 100, y: index * 100 + 20
            },
            child: {text: this.valueToText(value)}
        });
    });
    this.$blockCtn.addChild(this.$destValues);

    this.updateContentPosition();


};

MappingBarChart.prototype.valueToText = function (value) {
    var locale;
    var separateSign;
    if (typeof systemconfig === 'object') {
        locale = systemconfig.commaSign === '.'? 'en-US' : 'vi-VN';
        separateSign = systemconfig.separateSign ||'';
    }
    else {
        locale =navigator.language === 'vi'? 'vi-VN' : 'en-US';
        separateSign = locale === 'vi-VN'? '.' : ',';
    }

    var formatter = new Intl.NumberFormat(locale);
    var text = formatter.format(value);
    var thousandParts = text.split(locale === 'vi-VN'? '.' : ',');
    text = thousandParts.join(separateSign);
    return text;
};

MappingBarChart.prototype.updateContentPosition = function () {
    var sourceValues = this['sourceValues'] || [];
    var destValues = this['destValues'] || [];
    if (sourceValues.length === 0 && destValues.length === 0) return;
    if (!this.$sourceValues) return;
    var n = Math.max(sourceValues.length, destValues.length);
    var minValue = Math.min.apply(null, sourceValues.concat(destValues));
    var maxValue = Math.max.apply(null, sourceValues.concat(destValues));
    var zeroYValue = 0;
    // note:  non-negative values
    if (n > 1)
        zeroYValue = Math.max(0, minValue - maxValue / 1.5);//first block from zero not take too much space

    var width = this.box.width;
    var height = this.box.height;
    if (width <= 0 || height <= 0) return;
    var sourceTextWidth = this.$sourceValues.reduce((ac, cur)=>{
        return Math.max(ac, cur.getBBox().width);
    }, 0);

    var destTextWidth = this.$destValues.reduce((ac, cur)=>{
        return Math.max(ac, cur.getBBox().width);
    }, 0);


    this.$title.attr({
        x: width / 2,
        y: height - 20
    });

    var cy = height - 20;

    cy -= 30;
    cy = Math.round(cy) - 0.5;// fix blur line
    var turtle = new Turtle();
    turtle.moveTo(10, cy).hLineBy(width - 20);
    this.$ox.attr({
        d: turtle.getPath()
    });

    cy += 0.5;
    var maxBarHeight = cy - 20;
    var barValueRange = Math.max(maxValue - zeroYValue, 1);

    var x0, x1;
    var barWidth = Math.min(width / 4, 80);
    barWidth = Math.round(barWidth);
    x0 = Math.max(sourceTextWidth + 5,width / 4 - barWidth / 2);
    x1 = Math.min(width - destTextWidth - barWidth -5,3 * width / 4 - barWidth / 2);
    x0 = Math.round(x0);
    x1 = Math.round(x1);

    var barY = cy;
    var sum = 0;
    var bar0Ys = [];
    this.$sourceRects.forEach((rect, index) => {
        var barHeight = (sourceValues[index] - zeroYValue - sum) / barValueRange * maxBarHeight;
        rect.attr({
            x: x0,
            y: barY - barHeight,
            width: barWidth,
            height: barHeight
        });
        barY -= barHeight;
        bar0Ys.push(barY);
        sum = sourceValues[index];
    });

    barY = cy;
    sum = 0;
    var bar1Ys = [];

    this.$destRects.forEach((rect, index) => {
        var barHeight = (destValues[index] - zeroYValue - sum) / barValueRange * maxBarHeight;
        rect.attr({
            x: x1,
            y: barY - barHeight,
            width: barWidth,
            height: barHeight
        });
        barY -= barHeight;
        bar1Ys.push(barY);
        sum = destValues[index];
    });

    turtle = new Turtle();
    n = Math.min(bar0Ys.length, bar1Ys.length);
    var i;
    for (i = 0; i < n; ++i) {
        turtle.moveTo(x0 + barWidth, bar0Ys[i]).lineTo(x1, bar1Ys[i]);
    }
    this.$mapLine.attr({
        d: turtle.getPath()
    });

    for (i = 0; i < bar0Ys.length; ++i) {
        this.$sourceValues[i].attr({
            x: x0 - 5,
            y: bar0Ys[i] + 7
        });
    }

    for (i = 0; i < bar1Ys.length; ++i) {
        this.$destValues[i].attr({
            x: x1 + 5 + barWidth + destTextWidth,
            y: bar1Ys[i] + 7
        });
    }



};

MappingBarChart.prototype.updateSize = function () {
    SvgCanvas.prototype.updateSize.apply(this, arguments);
    this.updateContentPosition();
};

MappingBarChart.prototype.hookedProperties = ['sourceValues', 'destValues'];


VCore.install(MappingBarChart);

export default MappingBarChart;