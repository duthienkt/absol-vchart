import SvgCanvas from "absol-svg/js/svg/SvgCanvas";

import VCore, {_} from "./VCore";
import DelaySignal from "absol/src/HTML5/DelaySignal";
import {mixClass} from "absol/src/HTML5/OOP";
import Turtle from "absol/src/Math/Turtle";


/**
 * @extends SvgCanvas
 * @constructor
 */
function SparklineChart() {
    SvgCanvas.apply(this, arguments);
    this.addClass('vc-sparkline-chart');
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

mixClass(SparklineChart, SvgCanvas);


SparklineChart.tag = "SparklineChart".toLowerCase();


SparklineChart.prototype.createStaticContent = function () {
    this.$title = _({
        tag: 'text',
        class: 'vc-title'
    }).addTo(this);

    this.$line = _({
        tag: 'path',
        style: {
            strokeWidth: 1.5,
            stroke: '#2563eb',
            fill: 'none'
        }
    }).addTo(this);
};

SparklineChart.prototype.updateContent = function () {
    this.$title.clearChild().addChild(_({text: '' + (this.title || '')}));
    this.updateContentPosition();
};

SparklineChart.prototype.updateContentPosition = function () {
    var values = this['values'] || [];
    

    
    var width = this.box.width;
    var height = this.box.height;
    
    if (width <= 0 || height <= 0) return;
    
    // Calculate title position
    var titleHeight = 0;
    if (this.title) {
        titleHeight = 20;
        this.$title.attr({
            x: width / 2,
            y: height - 5,
            'text-anchor': 'middle'
        });
    }

    if (values.length === 0) {
        this.$line.attr({d: ''});
        return;
    }
    
    var chartHeight = height - titleHeight - 10;
    var chartWidth = width - 10;
    
    if (chartHeight <= 0 || chartWidth <= 0) return;
    
    // Find min and max values
    var minValue = Math.min.apply(null, values);
    var maxValue = Math.max.apply(null, values);
    var valueRange = maxValue - minValue;
    
    // Handle case when all values are the same
    if (valueRange === 0) {
        valueRange = 1;
    }
    
    // Calculate points for the line
    var points = values.map((value, index) => {
        var x = 5 + (index / (values.length - 1 || 1)) * chartWidth;
        var y = 5 + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        return {x, y};
    });
    
    // Create path using Turtle
    var turtle = new Turtle();
    
    if (points.length > 0) {
        turtle.moveTo(points[0].x, points[0].y);
        
        for (var i = 1; i < points.length; i++) {
            turtle.lineTo(points[i].x, points[i].y);
        }
    }
    
    this.$line.attr({
        d: turtle.getPath()
    });
};

SparklineChart.prototype.updateSize = function () {
    SvgCanvas.prototype.updateSize.apply(this, arguments);
    this.updateContentPosition();
};

SparklineChart.prototype.hookedProperties = ['values', 'title'];


VCore.install(SparklineChart);

export default SparklineChart;
