import Vcore from "./VCore";

import salaryimgchart_svg from '../template/salaryimgchart.svg';

import { map, text } from './helper';

var _ = Vcore._;
var $ = Vcore.$;

export function SalaryImgChart() {
    var res = _(salaryimgchart_svg.replace(/(.|[\r\n])+\<svg/, '<svg')).addClass('image-chart').addClass('base-chart');
    return res;
}

SalaryImgChart.property = {};




SalaryImgChart.prototype.preInit = function () {
    //this is defaul and can not be change
    this.bonus = 20;
    this.colTexts = ['Bậc 1', 'Bậc n -1', 'Bậc n'];
    this.distText = 'Khoảng cách lương';
    this.minDistText = 'Khoảng cách tối thiểu';
    this.bonusText = 'Hệ số ưu đãi (20%)';

};



SalaryImgChart.prototype.initComp = function () {
    this.$ox = _('shape.image-chart-ox').addTo(this);
    this.$oxDash = _('shape.image-chart-ox[stroke-dasharray="4, 2"]').addTo(this);
    this.$bases = [_('rect.image-chart-base').addTo(this), _('rect.image-chart-base').addTo(this), _('rect.image-chart-base').addTo(this)];
    this.$bonuses = [_('rect.image-chart-bonus').addTo(this), _('rect.image-chart-bonus').addTo(this), _('rect.image-chart-bonus').addTo(this)];

    this.$distRange = _('shape.image-chart-range[marker-end="url(#Arrow2Mend)"][marker-start="url(#Arrow2Mstart)"]').addTo(this);

    this.$minDistRange = _('shape.image-chart-range[marker-end="url(#Arrow1Send)"][marker-start="url(#Arrow1Sstart)"]').addTo(this);
    this.$bonusRange = _('shape.image-chart-range[marker-end="url(#Arrow1Send)"][marker-start="url(#Arrow1Sstart)"]').addTo(this);

    this.$distTop = _('shape.image-chart-range-limit[stroke-dasharray="2, 1"]').addTo(this);
    this.$distBot = _('shape.image-chart-range-limit[stroke-dasharray="2, 1"]').addTo(this);
    this.$minDistBot = _('shape.image-chart-range-limit[stroke-dasharray="2, 1"]').addTo(this);

    this.$bonusTop = _('shape.image-chart-range-limit[stroke-dasharray="2, 1"]').addTo(this);
    this.$bonusBot = _('shape.image-chart-range-limit[stroke-dasharray="2, 1"]').addTo(this);

    this.$distText = text('', 0, 0).addTo(this);
    this.$minDistText = text('', 0, 0).attr('text-anchor', 'end').addTo(this);
    this.$bonusText = text('', 0, 0).addTo(this);

    this.$lvTexts = [null, null, null].map(function () {
        return text('', 0, 0).attr('text-anchor', 'middle').addTo(this);
    }.bind(this));

}

SalaryImgChart.prototype.updateComp = function () {
    var width = 560;
    var height = 320;
    var _this = this;
    this.oxY = height - 20;

    this.oxSeg = [10, 100, 260, 500];
    this.xCols = [37, 272, 373];
    this.heightCols = [60, 264, 288];


    this.colWidth = 40;



    //<path d="m2.9298 290.03h21.626m43.891 0h51.013" fill="none" stroke="#4472c4" stroke-width=".26458px"/>
    this.$ox.begin()
        .moveTo(this.oxSeg[0], this.oxY + 1)
        .lineTo(this.oxSeg[1], this.oxY + 1)
        .moveTo(this.oxSeg[2], this.oxY + 1)
        .lineTo(this.oxSeg[3], this.oxY + 1)
        .end();

    // <path d="m24.555 290.03h43.891" fill="none" stroke="#4372c4" stroke-dasharray="1.05999993, 0.52999997" stroke-width=".265"/>
    this.$oxDash.begin()
        .moveTo(this.oxSeg[1], this.oxY + 1)
        .lineTo(this.oxSeg[2], this.oxY + 1)
        .end();

    this.heightBase = this.heightCols.map(function (hc) {
        return map(100, 0, 100 + _this.bonus, 0, hc);
    });
    this.heightBonus = this.heightCols.map(function (hc) {
        return map(_this.bonus, 0, 100 + _this.bonus, 0, hc);
    });

    this.$bases.forEach(function (e, i) {
        var x = _this.xCols[i];
        var height = _this.heightBase[i];
        e.attr({
            x: x,
            y: _this.oxY - height,
            width: _this.colWidth,
            height: height
        })
    });


    this.$bonuses.forEach(function (e, i) {
        var x = _this.xCols[i];
        var height = _this.heightBonus[i];
        e.attr({
            x: x,
            y: _this.oxY - _this.heightCols[i],
            width: _this.colWidth,
            height: height
        })
    });

    this.$distRange.begin()
        .moveTo(this.xCols[0] - 13, this.oxY - this.heightBase[2] + 2)
        .lineTo(this.xCols[0] - 13, this.oxY - this.heightBase[0] - 2)
        .end();

    this.$minDistRange.begin()
        .moveTo(this.xCols[1] - 38, this.oxY - this.heightBase[2] + 1)
        .lineTo(this.xCols[1] - 38, this.oxY - this.heightBase[1] - 1)
        .end();

    this.$bonusRange.begin()
        .moveTo(this.xCols[2] + 13 + this.colWidth, this.oxY - this.heightBase[2] - this.heightBonus[2] + 1)
        .lineTo(this.xCols[2] + 13 + this.colWidth, this.oxY - this.heightBase[2] - 1)
        .end();

    this.$distTop.begin()
        .moveTo(this.xCols[0] - 13, this.oxY - this.heightBase[2])
        .lineTo(this.xCols[2], this.oxY - this.heightBase[2])
        .end();

    this.$distBot.begin()
        .moveTo(this.xCols[0] - 13, this.oxY - this.heightBase[0])
        .lineTo(this.xCols[0], this.oxY - this.heightBase[0])
        .end();

    this.$minDistBot.begin()
        .moveTo(this.xCols[1] - 38, this.oxY - this.heightBase[1])
        .lineTo(this.xCols[1], this.oxY - this.heightBase[1])
        .end();

    this.$bonusBot.begin()
        .moveTo(this.xCols[2] + this.colWidth, this.oxY - this.heightBase[2])
        .lineTo(this.xCols[2] + 13 + this.colWidth, this.oxY - this.heightBase[2])
        .end();

    this.$bonusTop.begin()
        .moveTo(this.xCols[2] + this.colWidth, this.oxY - this.heightBase[2] - this.heightBonus[2])
        .lineTo(this.xCols[2] + 13 + this.colWidth, this.oxY - this.heightBase[2] - this.heightBonus[2])
        .end();

    this.$distText.innerHTML = this.distText;

    this.$distText.attr({
        x: this.xCols[0] - 7,
        y: this.oxY - (this.heightBase[2] + this.heightBase[0]) / 2 + 5
    });

    this.$minDistText.innerHTML = this.minDistText;
    this.$minDistText.attr({
        x: this.xCols[1] - 38 - 6,
        y: this.oxY - (this.heightBase[2] + this.heightBase[1]) / 2 + 5
    });

    this.$bonusText.innerHTML = this.bonusText;
    this.$bonusText.attr({
        x: this.xCols[2] + 13 + this.colWidth + 6,
        y: this.oxY - this.heightBase[2] - this.heightBonus[2] / 2 + 5
    });


    this.$lvTexts.forEach(function (e, i) {
        e.innerHTML = _this.colTexts[i];
        e.attr({
            x: _this.xCols[i] + _this.colWidth / 2,
            y: _this.oxY + 15
        })
    })
};

SalaryImgChart.prototype.init = function (props) {
    this.preInit();

    this.super(props);
    this.initComp();
    this.updateComp();
};



Vcore.install(SalaryImgChart);

// cons