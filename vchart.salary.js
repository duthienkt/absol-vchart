vchart.creator.correlationchart = function () {
    var _ = vchart._;
    var $ = vchart.$;
    var res = _({
        tag: 'svg',
        class: 'base-chart',
        child: 'axis'
    }, true);

    res.$axis = $('axis', res);
    res.sync = res.afterAttached();
    return res;
};


vchart.creator.correlationchart.prototype.updateSize = vchart.creator.basechart.prototype.updateSize;

vchart.creator.correlationchart.prototype.update = function () {
    
    this.updateSize();
    this.updateBackComp();
    this.updateAxis();
    this.updateComp();
};

vchart.creator.correlationchart.prototype.mapOXColumn = function (index) {
    return this.oxyLeft + (index + 0.5) * this.oxSegmentLength;
};
vchart.creator.correlationchart.prototype.mapOYValue = function (value) {
    return this.oxyBottom - this.oyLength * value;
};



vchart.creator.correlationchart.prototype.updateAxis = function () {
    this.$axis.moveTo(this.oxyLeft, this.oxyBottom);
    this.$axis.resize(this.canvasWidth - this.oxyLeft - 10, this.oxyBottom - 43);
    this.$oyName.attr({ x: 3, y: 30 });
    this.$oxName.attr({ x: this.canvasWidth - 4, y: this.oxyBottom + 20 });
};


vchart.creator.correlationchart.prototype.initBackComp = function () {
    this.$title = vchart.text(this.title, 0, 0, 'base-chart-title').attr('text-anchor', 'middle').addTo(this);
    this.$oyName = vchart.text(this.valueName, 0, 0, 'base-chart-oxy-text').addTo(this);
    this.$oxName = vchart.text(this.keyName, 0, 100, 'base-chart-oxy-text').attr('text-anchor', 'end').addTo(this);
    this.$keyNames = this.keys.map(function (key) {
        return vchart.text(key, 100, 100).attr('text-anchor', 'middle').addTo(this);
    }.bind(this));

};


vchart.creator.correlationchart.prototype.updateBackComp = function () {
    this.$title.attr({ x: this.canvasWidth / 2, y: 20 });

    this.oxyLeft = Math.max(20, this.$oyName.getBBox().width);
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


vchart.creator.correlationchart.prototype.initComp = function () {
    this.$staticVLines = this.staticValues.map(function (value, i) {
        return vchart.vline(0, 0, 0, ['correlation-chart-normal-line', 'static']).addTo(this);
    }.bind(this));
    this.$staticHLines = this.staticValues.map(function (value, i) {
        return vchart.hline(0, 0, 0, ['correlation-chart-normal-line', 'static']).addTo(this);
    }.bind(this));

    this.$dynamicVLines = this.dynamicValues.map(function (value, i) {
        return vchart.vline(0, 0, 0, ['correlation-chart-normal-line', 'dynamic']).addTo(this);
    }.bind(this));

    this.$dynamicHLines = this.dynamicValues.map(function (value, i) {
        return vchart.hline(0, 0, 0, ['correlation-chart-normal-line', 'dynamic']).addTo(this);
    }.bind(this));

    this.$staticPlots = this.staticValues.map(function (value, i) {
        return vchart.circle(50 + i * 30, 100, this.plotRadius, ['correlation-chart-plot', 'static']).addTo(this);
    }.bind(this));

    this.$staticLine = vchart._('path.correlation-chart-line.static').addTo(this);

    this.$dynamicPlots = this.dynamicValues.map(function (value, i) {
        return vchart.circle(50 + i * 30, 200, this.plotRadius, ['correlation-chart-plot', 'dynamic']).addTo(this);
    }.bind(this));

    this.$dynamicLine = vchart._('path.correlation-chart-line.dynamic').addTo(this);
};

vchart.creator.correlationchart.prototype.updateComp = function () {
    this.$staticVLines.forEach(function ($staticVLine, i) {
        vchart.moveVLine($staticVLine, this.mapOXColumn(i), this.oxyBottom, this.mapOYValue(this.staticValues[i]) - this.oxyBottom);
    }.bind(this));

    this.$staticHLines.forEach(function ($staticHLine, i) {
        vchart.moveHLine($staticHLine, this.oxyLeft, this.mapOYValue(this.staticValues[i]), this.mapOXColumn(i) - this.oxyLeft);
    }.bind(this));

    this.$dynamicVLines.forEach(function ($dynamicVLine, i) {
        vchart.moveVLine($dynamicVLine, this.mapOXColumn(i), this.oxyBottom, this.mapOYValue(this.dynamicValues[i]) - this.oxyBottom);
    }.bind(this));

    this.$dynamicHLines.forEach(function ($dynamicHLine, i) {
        vchart.moveHLine($dynamicHLine, this.oxyLeft, this.mapOYValue(this.dynamicValues[i]), this.mapOXColumn(i) - this.oxyLeft);
    }.bind(this));

    this.$staticPlots.forEach(function ($plot, i) {
        $plot.attr({ cx: this.mapOXColumn(i), cy: this.mapOYValue(this.staticValues[i]) });
    }.bind(this));

    var staticPoints = this.staticValues.map(function (value, i) {
        return [this.mapOXColumn(i), this.mapOYValue(value)];
    }.bind(this));

    this.$staticLine.attr('d', vchart.autoCurve(staticPoints, 0.7, 0.01));//

    this.$dynamicPlots.forEach(function ($plot, i) {
        $plot.attr({ cx: this.mapOXColumn(i), cy: this.mapOYValue(this.dynamicValues[i]) });
    }.bind(this));

    var dynamicPoints = this.dynamicValues.map(function (value, i) {
        return [this.mapOXColumn(i), this.mapOYValue(value)];
    }.bind(this));
    this.$dynamicLine.attr('d', vchart.autoCurve(dynamicPoints, 0.7, 0.01));//
};




vchart.creator.correlationchart.prototype.preInit = function (props) {
    this.plotRadius = 6;
};

vchart.creator.correlationchart.prototype.init = function (props) {
    this.super(props);
    this.preInit();
    this.initBackComp();
    this.initComp();
    this.sync = this.sync.then(this.update.bind(this));
};



vchart.creator.squarechart = function () {
    var _ = vchart._;
    var $ = vchart.$;
    var res = _({
        tag: 'svg',
        class: 'base-chart',
        child: 'axis'
    }, true);

    res.$axis = $('axis', res);
    res.sync = res.afterAttached();
    return res;
};


vchart.creator.squarechart.prototype.updateSize = vchart.creator.basechart.prototype.updateSize;



vchart.creator.squarechart.prototype.getY = function (k, y0, x) {
    var a = k*k/64;
    return Math.map(a * x * x * x * x + a * x * x + x, 0, 1 + 2 * a, y0, 1);
}

vchart.creator.squarechart.prototype.staticY = function (x) {
    return this.getY(this.static.k, this.static.y0, x);
};

vchart.creator.squarechart.prototype.dynamicY = function (x) {
    return this.getY(this.dynamic.k, this.dynamic.y0, x);
};
vchart.creator.squarechart.prototype.getX = function (index) {
    return index / (this.keys.length - 1);
};



vchart.creator.squarechart.prototype.update = function () {
    this.updateSize();
    this.updateBackComp();
    this.updateAxis();
    this.updateComp();
};


vchart.creator.squarechart.prototype.mapOXColumn = function (index) {
    return this.oxyLeft + (index + 0.5) * this.oxSegmentLength;
};
vchart.creator.squarechart.prototype.mapOYValue = function (value) {
    return this.oxyBottom - this.oyLength * value;
};



vchart.creator.squarechart.prototype.updateAxis = function () {
    this.$axis.moveTo(this.oxyLeft, this.oxyBottom);
    this.$axis.resize(this.canvasWidth - this.oxyLeft - 10, this.oxyBottom - 43);
    this.$oyName.attr({ x: 3, y: 30 });
    this.$oxName.attr({ x: this.canvasWidth - 4, y: this.oxyBottom + 20 });
};


vchart.creator.squarechart.prototype.initBackComp = function () {
    this.$title = vchart.text(this.title, 0, 0, 'base-chart-title').attr('text-anchor', 'middle').addTo(this);
    this.$oyName = vchart.text(this.valueName, 0, 0, 'base-chart-oxy-text').addTo(this);
    this.$oxName = vchart.text(this.keyName, 0, 100, 'base-chart-oxy-text').attr('text-anchor', 'end').addTo(this);
    this.$keyNames = this.keys.map(function (key) {
        return vchart.text(key, 100, 100).attr('text-anchor', 'middle').addTo(this);
    }.bind(this));

};


vchart.creator.squarechart.prototype.updateBackComp = function () {
    this.$title.attr({ x: this.canvasWidth / 2, y: 20 });

    this.oxyLeft = Math.max(20, this.$oyName.getBBox().width);
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


vchart.creator.squarechart.prototype.initComp = function () {

    this.$staticVLines = this.keys.map(function (value, i) {
        return vchart.vline(0, 0, 0, ['correlation-chart-normal-line', 'static']).addTo(this);
    }.bind(this));
    this.$staticHLines = this.keys.map(function (value, i) {
        return vchart.hline(0, 0, 0, ['correlation-chart-normal-line', 'static']).addTo(this);
    }.bind(this));

    this.$dynamicVLines = this.keys.map(function (value, i) {
        return vchart.vline(0, 0, 0, ['correlation-chart-normal-line', 'dynamic']).addTo(this);
    }.bind(this));

    this.$dynamicHLines = this.keys.map(function (value, i) {
        return vchart.hline(0, 0, 0, ['correlation-chart-normal-line', 'dynamic']).addTo(this);
    }.bind(this));

    this.$staticPlots = this.keys.map(function (value, i) {
        return vchart.circle(50 + i * 30, 100, this.plotRadius, ['correlation-chart-plot', 'static']).addTo(this);
    }.bind(this));

    this.$staticLine = vchart._('path.correlation-chart-line.static').addTo(this);

    this.$dynamicPlots = this.keys.map(function (value, i) {
        return vchart.circle(50 + i * 30, 200, this.plotRadius, ['correlation-chart-plot', 'dynamic']).addTo(this);
    }.bind(this));

    this.$dynamicLine = vchart._('path.correlation-chart-line.dynamic').addTo(this);
};



vchart.creator.squarechart.prototype.updateComp = function () {
    this.$staticVLines.forEach(function ($staticVLine, i) {
        vchart.moveVLine($staticVLine, this.mapOXColumn(i), this.oxyBottom, this.mapOYValue(this.staticY(this.getX(i))) - this.oxyBottom);
    }.bind(this));

    this.$staticHLines.forEach(function ($staticHLine, i) {
        vchart.moveHLine($staticHLine, this.oxyLeft, this.mapOYValue(this.staticY(this.getX(i))), this.mapOXColumn(i) - this.oxyLeft);
    }.bind(this));

    this.$dynamicVLines.forEach(function ($dynamicVLine, i) {
        vchart.moveVLine($dynamicVLine, this.mapOXColumn(i), this.oxyBottom, this.mapOYValue(this.dynamicY(this.getX(i))) - this.oxyBottom);
    }.bind(this));

    this.$dynamicHLines.forEach(function ($dynamicHLine, i) {
        vchart.moveHLine($dynamicHLine, this.oxyLeft, this.mapOYValue(this.dynamicY(this.getX(i))), this.mapOXColumn(i) - this.oxyLeft);
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
};


vchart.creator.squarechart.prototype.preInit = function (props) {
    this.plotRadius = 6;
};

vchart.creator.squarechart.prototype.init = function (props) {
    this.preInit();
    this.super(props);
    this.initBackComp();
    this.initComp();
    this.sync = this.sync.then(this.update.bind(this));
};





Object.assign(
    absol.ShareCreator,
    Object.keys(vchart.creator)
        .filter(function (e) {
            return /.+chart/
        }).reduce(function (ac, cr) {
            ac[cr] = vchart.creator[cr];
            return ac;
        }, {})
);