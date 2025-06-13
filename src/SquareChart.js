import VCore from "./VCore";
import BaseChart from "./BaseChart";
import { text, vline, hline, circle, moveVLine, moveHLine, map } from "./helper";

// vchart.creator.correlationchart = function () {
//     var _ = _;
//     var $ = vchart.$;
//     var res = _({
//         tag: 'svg',
//         class: 'base-chart',
//         child: 'axis'
//     }, true);

//     res.$axis = $('axis', res);
//     res.sync = res.afterAttached();
//     return res;
// };


// vchart.creator.correlationchart.prototype.updateSize = vchart.creator.basechart.prototype.updateSize;

// vchart.creator.correlationchart.prototype.update = function () {

//     this.updateSize();
//     this.updateBackComp();
//     this.updateAxis();
//     this.updateComp();
// };

// vchart.creator.correlationchart.prototype.mapOXColumn = function (index) {
//     return this.oxyLeft + (index + 0.5) * this.oxSegmentLength;
// };
// vchart.creator.correlationchart.prototype.mapOYValue = function (value) {
//     return this.oxyBottom - this.oyLength * value;
// };



// vchart.creator.correlationchart.prototype.updateAxis = function () {
//     this.$axis.moveTo(this.oxyLeft, this.oxyBottom);
//     this.$axis.resize(this.canvasWidth - this.oxyLeft - 10, this.oxyBottom - 43);
//     this.$oyName.attr({ x: 3, y: 30 });
//     this.$oxName.attr({ x: this.canvasWidth - 4, y: this.oxyBottom + 20 });
// };


// vchart.creator.correlationchart.prototype.initBackComp = function () {
//     this.$title = text(this.title, 0, 0, 'base-chart-title').attr('text-anchor', 'middle').addTo(this);
//     this.$oyName = text(this.valueName, 0, 0, 'base-chart-oxy-text').addTo(this);
//     this.$oxName = text(this.keyName, 0, 100, 'base-chart-oxy-text').attr('text-anchor', 'end').addTo(this);
//     this.$keyNames = this.keys.map(function (key) {
//         return text(key, 100, 100).attr('text-anchor', 'middle').addTo(this);
//     }.bind(this));

// };


// vchart.creator.correlationchart.prototype.updateBackComp = function () {
//     this.$title.attr({ x: this.canvasWidth / 2, y: 20 });

//     this.oxyLeft = Math.max(20, this.$oyName.getBBox().width);
//     this.oxyBottom = this.canvasHeight - 10;
//     this.oxLength = this.canvasWidth - this.oxyLeft - 12 - this.$oxName.getBBox().width;
//     this.oxSegmentLength = this.oxLength / this.keys.length;

//     var oyNameHeight = this.$keyNames.reduce(function (ac, $keyName) {
//         return Math.max($keyName.getBBox().height);
//     }.bind(this), 0);

//     this.oxyBottom -= oyNameHeight;
//     this.oyLength = this.oxyBottom - 50;

//     this.$keyNames.forEach(function ($keyName, i) {
//         $keyName.attr({ x: this.mapOXColumn(i), y: this.oxyBottom + 20 });
//     }.bind(this), 0);
// };


// vchart.creator.correlationchart.prototype.initComp = function () {
//     this.$staticVLines = this.staticValues.map(function (value, i) {
//         return vline(0, 0, 0, ['correlation-chart-normal-line', 'static']).addTo(this);
//     }.bind(this));
//     this.$staticHLines = this.staticValues.map(function (value, i) {
//         return hline(0, 0, 0, ['correlation-chart-normal-line', 'static']).addTo(this);
//     }.bind(this));

//     this.$dynamicVLines = this.dynamicValues.map(function (value, i) {
//         return vline(0, 0, 0, ['correlation-chart-normal-line', 'dynamic']).addTo(this);
//     }.bind(this));

//     this.$dynamicHLines = this.dynamicValues.map(function (value, i) {
//         return hline(0, 0, 0, ['correlation-chart-normal-line', 'dynamic']).addTo(this);
//     }.bind(this));

//     this.$staticPlots = this.staticValues.map(function (value, i) {
//         return circle(50 + i * 30, 100, this.plotRadius, ['correlation-chart-plot', 'static']).addTo(this);
//     }.bind(this));

//     this.$staticLine = _('path.correlation-chart-line.static').addTo(this);

//     this.$dynamicPlots = this.dynamicValues.map(function (value, i) {
//         return circle(50 + i * 30, 200, this.plotRadius, ['correlation-chart-plot', 'dynamic']).addTo(this);
//     }.bind(this));

//     this.$dynamicLine = _('path.correlation-chart-line.dynamic').addTo(this);
// };

// vchart.creator.correlationchart.prototype.updateComp = function () {
//     this.$staticVLines.forEach(function ($staticVLine, i) {
//        moveVLine($staticVLine, this.mapOXColumn(i), this.oxyBottom, this.mapOYValue(this.staticValues[i]) - this.oxyBottom);
//     }.bind(this));

//     this.$staticHLines.forEach(function ($staticHLine, i) {
//         moveHLine($staticHLine, this.oxyLeft, this.mapOYValue(this.staticValues[i]), this.mapOXColumn(i) - this.oxyLeft);
//     }.bind(this));

//     this.$dynamicVLines.forEach(function ($dynamicVLine, i) {
//        moveVLine($dynamicVLine, this.mapOXColumn(i), this.oxyBottom, this.mapOYValue(this.dynamicValues[i]) - this.oxyBottom);
//     }.bind(this));

//     this.$dynamicHLines.forEach(function ($dynamicHLine, i) {
//         moveHLine($dynamicHLine, this.oxyLeft, this.mapOYValue(this.dynamicValues[i]), this.mapOXColumn(i) - this.oxyLeft);
//     }.bind(this));

//     this.$staticPlots.forEach(function ($plot, i) {
//         $plot.attr({ cx: this.mapOXColumn(i), cy: this.mapOYValue(this.staticValues[i]) });
//     }.bind(this));

//     var staticPoints = this.staticValues.map(function (value, i) {
//         return [this.mapOXColumn(i), this.mapOYValue(value)];
//     }.bind(this));

//     this.$staticLine.attr('d', vchart.autoCurve(staticPoints, 0.7, 0.01));//

//     this.$dynamicPlots.forEach(function ($plot, i) {
//         $plot.attr({ cx: this.mapOXColumn(i), cy: this.mapOYValue(this.dynamicValues[i]) });
//     }.bind(this));

//     var dynamicPoints = this.dynamicValues.map(function (value, i) {
//         return [this.mapOXColumn(i), this.mapOYValue(value)];
//     }.bind(this));
//     this.$dynamicLine.attr('d', vchart.autoCurve(dynamicPoints, 0.7, 0.01));//
// };




// vchart.creator.correlationchart.prototype.preInit = function (props) {
//     this.plotRadius = 6;
// };

// vchart.creator.correlationchart.prototype.init = function (props) {
//     this.super(props);
//     this.preInit();
//     this.initBackComp();
//     this.initComp();
//     this.sync = this.sync.then(this.update.bind(this));
// };


var _ = VCore._;
var $ = VCore.$;

function SquareChart() {
    var res = _({
        tag: 'svg',
        class: 'base-chart',
        child: 'axis'
    }, true);

    res.$axis = $('axis', res);
    res.sync = res.afterAttached();
    return res;
};


SquareChart.prototype.updateSize = BaseChart.prototype.updateSize;



SquareChart.prototype.getY = function (k, y0, x) {
    var a = k * k / 64;
    return map(a * x * x * x * x + a * x * x + x, 0, 1 + 2 * a, y0, 1);
}

SquareChart.prototype.staticY = function (x) {
    return this.getY(this.static.k, this.static.y0, x);
};

SquareChart.prototype.dynamicY = function (x) {
    return this.getY(this.dynamic.k, this.dynamic.y0, x);
};
SquareChart.prototype.getX = function (index) {
    return index / (this.keys.length - 1);
};



SquareChart.prototype.update = function () {
    this.updateSize();
    this.updateBackComp();
    this.updateAxis();
    this.updateComp();
};


SquareChart.prototype.mapOXColumn = function (index) {
    return this.oxyLeft + (index + 0.5) * this.oxSegmentLength;
};
SquareChart.prototype.mapOYValue = function (value) {
    return this.oxyBottom - this.oyLength * value;
};



SquareChart.prototype.updateAxis = function () {
    this.$axis.moveTo(this.oxyLeft, this.oxyBottom);
    this.$axis.resize(this.canvasWidth - this.oxyLeft - 10, this.oxyBottom - 43);
    this.$oyName.attr({ x: this.oxyLeft - 5, y: 30 });
    this.$oxName.attr({ x: this.canvasWidth - 4, y: this.oxyBottom + 20 });
};


SquareChart.prototype.initBackComp = function () {
    this.$title = text(this.title||'', 0, 0, 'base-chart-title').attr('text-anchor', 'middle').addTo(this);
    this.$oyName = text(this.valueName, 0, 0, 'base-chart-oxy-text').attr('text-anchor', 'end').addTo(this);
    this.$oxName = text(this.keyName, 0, 100, 'base-chart-oxy-text').attr('text-anchor', 'end').addTo(this);
    this.$keyNames = this.keys.map(function (key) {
        return text(key, 100, 100).attr('text-anchor', 'middle').addTo(this);
    }.bind(this));

    this.$testText = text('0'.repeat(10), 0, 18).addStyle('visibility', 'hidden').addTo(this);

};


SquareChart.prototype.updateBackComp = function () {
    // update value text

    if (this.minValueText !== null && this.minValueText !== undefined)
        this.$minValueText.innerHTML = this.minValueText;
    else
        this.$minValueText.innerHTML = '';
    if (this.maxValueText !== null && this.maxValueText !== undefined)
        this.$maxValueText.innerHTML = this.maxValueText;
    else
        this.$maxValueText.innerHTML = '';

    this.$title.attr({ x: this.canvasWidth / 2, y: 20 });

    this.oxyLeft = Math.max(20, this.$oyName.getBBox().width + 10,
        this.$maxValueText.getBBox().width + 10,
        this.$minValueText.getBBox().width + 10,
        this.$testText.getBBox().width / 10 * this.minValueTextLength + 10
    );
    this.oxyBottom = this.canvasHeight - 10;
    this.oxLength = this.canvasWidth - this.oxyLeft - 12 - this.$oxName.getBBox().width;
    this.oxSegmentLength = this.oxLength / this.keys.length;

    var oyNameHeight = this.$keyNames.reduce(function (ac, $keyName) {
        return Math.max($keyName.getBBox().height);
    }.bind(this), 0);

    this.oxyBottom -= oyNameHeight;
    this.oyLength = this.oxyBottom - 50;

    this.$keyNames.forEach(function ($keyName, i) {
        $keyName.attr({ x: this.mapOXColumn(i), y: this.oxyBottom + 20 });
    }.bind(this), 0);


};


SquareChart.prototype.initComp = function () {

    this.$staticVLines = this.keys.map(function (value, i) {
        return vline(0, 0, 0, ['correlation-chart-normal-line', 'static']).addTo(this);
    }.bind(this));
    this.$staticHLines = this.keys.map(function (value, i) {
        return hline(0, 0, 0, ['correlation-chart-normal-line', 'static']).addTo(this);
    }.bind(this));

    this.$dynamicVLines = this.keys.map(function (value, i) {
        return vline(0, 0, 0, ['correlation-chart-normal-line', 'dynamic']).addTo(this);
    }.bind(this));

    this.$dynamicHLines = this.keys.map(function (value, i) {
        return hline(0, 0, 0, ['correlation-chart-normal-line', 'dynamic']).addTo(this);
    }.bind(this));

    this.$staticPlots = this.keys.map(function (value, i) {
        return circle(50 + i * 30, 100, this.plotRadius, ['correlation-chart-plot', 'static']).addTo(this);
    }.bind(this));

    this.$staticLine = _('path.correlation-chart-line.static').addTo(this);

    this.$dynamicPlots = this.keys.map(function (value, i) {
        return circle(50 + i * 30, 200, this.plotRadius, ['correlation-chart-plot', 'dynamic']).addTo(this);
    }.bind(this));

    this.$dynamicLine = _('path.correlation-chart-line.dynamic').addTo(this);
    // (this.minValueText !== undefined && this.minValueText  === null)
    this.$minValueText = text('test', 10, 100).attr('text-anchor', 'end').addTo(this);
    this.$maxValueText = text('test 2   ', 100, 100).attr('text-anchor', 'end').addTo(this);
};



SquareChart.prototype.updateComp = function () {
    this.$staticVLines.forEach(function ($staticVLine, i) {
        moveVLine($staticVLine, this.mapOXColumn(i), this.oxyBottom, this.mapOYValue(this.staticY(this.getX(i))) - this.oxyBottom);
    }.bind(this));

    this.$staticHLines.forEach(function ($staticHLine, i) {
        moveHLine($staticHLine, this.oxyLeft, this.mapOYValue(this.staticY(this.getX(i))), this.mapOXColumn(i) - this.oxyLeft);
    }.bind(this));

    this.$dynamicVLines.forEach(function ($dynamicVLine, i) {
        moveVLine($dynamicVLine, this.mapOXColumn(i), this.oxyBottom, this.mapOYValue(this.dynamicY(this.getX(i))) - this.oxyBottom);
    }.bind(this));

    this.$dynamicHLines.forEach(function ($dynamicHLine, i) {
        moveHLine($dynamicHLine, this.oxyLeft, this.mapOYValue(this.dynamicY(this.getX(i))), this.mapOXColumn(i) - this.oxyLeft);
    }.bind(this));

    this.$staticPlots.forEach(function ($plot, i) {
        $plot.attr({ cx: this.mapOXColumn(i), cy: this.mapOYValue(this.staticY(this.getX(i))) });
    }.bind(this));

    var staticPoints = Array(101).fill(0).map(function (value, i) {
        return [this.mapOXColumn(i * (this.keys.length - 1) / 100), this.mapOYValue(this.staticY(i / 100))];
    }.bind(this));

    this.$staticLine.attr('d', vchart.autoCurve(staticPoints, 0.7, 0.01));//

    this.$dynamicPlots.forEach(function ($plot, i) {
        $plot.attr({ cx: this.mapOXColumn(i), cy: this.mapOYValue(this.dynamicY(this.getX(i))) });
    }.bind(this));

    var dynamicPoints = Array(101).fill(0).map(function (value, i) {
        return [this.mapOXColumn(i * (this.keys.length - 1) / 100), this.mapOYValue(this.dynamicY(i / 100))];
    }.bind(this));

    this.$dynamicLine.attr('d', vchart.autoCurve(dynamicPoints, 0.7, 0.01));//

    this.$minValueText.attr({
        x: this.oxyLeft - 5,
        y: this.mapOYValue(this.dynamicY(this.getX(0))) + 6
    });

    this.$maxValueText.attr({
        x: this.oxyLeft - 5,
        y: this.mapOYValue(this.dynamicY(this.getX(this.keys.length - 1))) + 6
    });


};


SquareChart.prototype.preInit = function (props) {
    this.plotRadius = 6;
    this.minValueTextLength = 0;
};

SquareChart.prototype.init = function (props) {
    this.preInit();
    this.super(props);
    this.initBackComp();
    this.initComp();
    this.sync = this.sync.then(this.update.bind(this));
};

VCore.creator.squarechart = SquareChart;

export default SquareChart;