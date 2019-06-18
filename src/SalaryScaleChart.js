import Vcore from "./VCore";

import salaryimgchart_svg from '../template/salaryimgchart.svg';
import { text, getMaxHeightBox, getMaxWidthBox, rect } from "./helper";

var _ = Vcore._;
var $ = Vcore.$;

function SalaryScaleChart() {
    var res = _(salaryimgchart_svg.replace(/(.|[\r\n])+\<svg/, '<svg')).addClass('image-chart').addClass('base-chart');
    return res;
}

SalaryScaleChart.prototype.updateSize = function () {
    this.attr({
        width: this.canvasWidth,
        height: this.canvasHeight,
        viewBox: [0, 0, this.canvasWidth, this.canvasHeight].join(' ')
    })
};



SalaryScaleChart.prototype.initComp = function () {
    this.$colTexts = this.colTexts.map(function () {
        return text('', 100, 100).attr('text-anchor', 'middle').addTo(this);
    }.bind(this));

    this.$bases = this.colTexts.map(function () {
        return _('rect.image-chart-base').addTo(this);
    }.bind(this));
    this.$bonuses = this.colTexts.map(function () {
        return _('rect.image-chart-bonus').addTo(this);
    }.bind(this));

    this.$oxLine = _('shape.image-chart-ox').addTo(this);
    this.$oxDash = _('shape.image-chart-ox[stroke-dasharray="4, 2"]').addTo(this);
    this.$sizeTexts = this.sizeTexts.map(function () {
        return text('', 100, 100).addTo(this);
    }.bind(this));

    this.$ranges = this.sizeTexts.map(function () {
        return _('shape.image-chart-range[marker-end="url(#Arrow2Mend)"][marker-start="url(#Arrow2Mstart)"]', 100, 100).addTo(this);
    }.bind(this));

    this.$hLine = Array(5).fill(0).map(function () {
        return _('shape.image-chart-range-limit[stroke-dasharray="2, 1"]').addTo(this)
    }.bind(this));
};

SalaryScaleChart.prototype.updateText = function () {
    var self = this;
    this.$colTexts.forEach(function (elt, i) {
        var text = self.colTexts[i];
        elt.innerHTML = text;
        elt.attr('y', self.oy);
    });

    this.oy -= getMaxHeightBox.apply(null, this.$colTexts);
    this.oy -= this.textMargin;
    this.$sizeTexts.forEach(function (elt, i) {
        var text = self.sizeTexts[i];
        elt.innerHTML = text;
    });

    this.oxLength -= getMaxWidthBox(this.$sizeTexts[0], this.$sizeTexts[1]);

    this.oxLength -= this.textMargin
};

SalaryScaleChart.prototype.updateAxis = function () {
    var self = this;

    var leftCol = this.ox + this.axisPadding;
    var rightCol = this.ox + this.oxLength - this.axisPadding - this.rangeMargin - this.colWidth;
    this.colXs = [leftCol, leftCol / 3 + rightCol * 2 / 3, rightCol];
    this.$oxLine.begin()
        .moveTo(this.ox, this.oy)
        .lineTo(this.ox + this.oxLength / 4, this.oy)
        .moveTo(this.ox + this.oxLength / 2, this.oy)
        .lineTo(this.ox + this.oxLength, this.oy)
        .end();
    this.$oxDash.begin()
        .moveTo(this.ox + this.oxLength / 4, this.oy)
        .lineTo(this.ox + this.oxLength / 2, this.oy)
        .end();

    this.$colTexts.forEach(function (elt, i) {
        elt.attr('x', self.colXs[i] + self.colWidth / 2);
    });

    this.maxColHeight = this.oy - this.paddingContent;

};

SalaryScaleChart.prototype.updateCols = function () {
    var self = this;
    this.heightCols = [this.maxColHeight / (1 + this.distance / 100), this.maxColHeight / (1 + this.minDistance / 100), this.maxColHeight];
    this.baseHeight = this.heightCols.map(function (h) {
        return h / (100 + self.bonus) * 100
    });

    this.bonusHeight = this.heightCols.map(function (h) {
        return h / (100 + self.bonus) * self.bonus;
    });

    this.$bases.forEach(function (e, i) {
        var height = self.baseHeight[i];
        e.attr({
            x: self.colXs[i],
            y: self.oy - height,
            width: self.colWidth,
            height: height
        });
    });

    this.$bonuses.forEach(function (e, i) {
        var height = self.bonusHeight[i];
        e.attr({
            x: self.colXs[i],
            y: self.oy - self.heightCols[i],
            width: self.colWidth,
            height: height
        });
    });

}


SalaryScaleChart.prototype.updateRange = function () {
    var self = this;
    var rangeX = this.colXs.map(function (x) {
        return x + self.colWidth + self.rangeMargin;
    });
    this.$ranges[0].begin()
        .moveTo(rangeX[2], this.oy - this.baseHeight[2] + this.arrowPadding)
        .lineTo(rangeX[2], this.oy - this.baseHeight[0] - this.arrowPadding)
        .end();

    this.$ranges[1].begin()
        .moveTo(rangeX[2], this.oy - this.baseHeight[0] + this.arrowPadding)
        .lineTo(rangeX[2], this.oy - this.arrowPadding)
        .end();

    this.$ranges[2].begin()
        .moveTo(rangeX[1], this.oy - this.baseHeight[2] + this.arrowPadding)
        .lineTo(rangeX[1], this.oy - this.baseHeight[1] - this.arrowPadding)
        .end();

    this.$ranges[3].begin()
        .moveTo(rangeX[1], this.oy - this.baseHeight[1] + this.arrowPadding)
        .lineTo(rangeX[1], this.oy - this.arrowPadding)
        .end();
    this.$ranges[4].begin()
        .moveTo(rangeX[0], this.oy - this.heightCols[0] + this.arrowPadding)
        .lineTo(rangeX[0], this.oy - this.arrowPadding)
        .end();

    this.$hLine[0].begin()
        .moveTo(this.colXs[2] + this.colWidth, this.oy - this.baseHeight[2])
        .lineTo(rangeX[2], this.oy - this.baseHeight[2])
        .end();

    this.$hLine[1].begin()
        .moveTo(this.colXs[2], this.oy - this.baseHeight[2])
        .lineTo(rangeX[1], this.oy - this.baseHeight[2])
        .end();

    this.$hLine[2].begin()
        .moveTo(this.colXs[1] + this.colWidth, this.oy - this.baseHeight[1])
        .lineTo(rangeX[1], this.oy - this.baseHeight[1])
        .end();

    this.$hLine[3].begin()
        .moveTo(this.colXs[0] + this.colWidth, this.oy - this.heightCols[0])
        .lineTo(rangeX[0], this.oy - this.heightCols[0])
        .end();

    this.$hLine[4].begin()
        .moveTo(this.colXs[0] + this.colWidth, this.oy - this.baseHeight[0])
        .lineTo(rangeX[2], this.oy - this.baseHeight[0])
        .end();
    //a
    this.$sizeTexts[0].attr({
        x: rangeX[2] + this.textMargin,
        y: this.oy - (this.baseHeight[2] + this.baseHeight[0]) / 2 + 4
    });

    //b
    this.$sizeTexts[1].attr({
        x: rangeX[2] + this.textMargin,
        y: this.oy - (this.baseHeight[0]) / 2 + 4
    });

    //c
    this.$sizeTexts[2].attr({
        x: rangeX[1] + this.textMargin,
        y: this.oy - (this.baseHeight[2] + this.baseHeight[1]) / 2 + 4
    });

    //d
    this.$sizeTexts[3].attr({
        x: rangeX[1] + this.textMargin,
        y: this.oy - (this.baseHeight[1]) / 2 + 4
    });

    //e
    this.$sizeTexts[4].attr({
        x: rangeX[0] + this.textMargin,
        y: this.oy - (this.heightCols[0]) / 2 + 4
    });
};




SalaryScaleChart.prototype.update = function () {
    this.updateSize();
    this.oy = this.canvasHeight - this.paddingContent;
    this.oxLength = this.canvasWidth - 2 * this.paddingContent;
    this.ox = this.paddingContent;
    this.updateText();
    this.updateAxis();
    this.updateCols();
    this.updateRange();
};



SalaryScaleChart.prototype.preInit = function () {
    this.sync = this.afterAttached();
    this.canvasWidth = 560;
    this.canvasHeight = 320;
    this.paddingContent = 10;
    this.colTexts = ['Bậc 1', 'Bậc n -1', 'Bậc n'];
    this.sizeTexts = ['a', 'b', 'c', 'd', 'e'];
    this.bonus = 20;
    this.distance = 80;
    this.minDistance = 10;
    // this.sizeTexts = ['Lương tối đa', 'b', 'c', 'd', 'e'];
    this.colWidth = 40;
    this.textMargin = 5;
    this.axisPadding = 30;
    this.rangeMargin = 20;
    this.arrowPadding = 2.5;
};

SalaryScaleChart.prototype.init = function (props) {
    this.preInit();
    this.super(props);
    this.initComp();
    this.sync.then(this.update.bind(this));

};

Vcore.install('SalaryScaleChart'.toLowerCase(), SalaryScaleChart);