import Vcore from "./VCore";
import { autoCurve } from "./helper";

/**
 *
 * @returns {LineChart}
 * @constructor
 */
function CurveChart() {
}

CurveChart.tag = 'CurveChart'.toLowerCase();

CurveChart.render = function () {
    return Vcore._('linechart', true);
};

CurveChart.prototype.updateComp = function () {
    this.$lines.map(function ($line, i) {
        var line = this.lines[i];
        $line.$plots.forEach(function ($plot, j) {
            var value = line.values[j];
            $plot.attr({
                cx: this.oxSegmentLength * (j + 0.5),
                cy: this.mapOYValue(value)
            });
        }.bind(this));

        var points = line.values.map(function (value, j) {
            var y = this.mapOYValue(value);
            var x = this.oxSegmentLength * (j + 0.5);
            return [x, y];
        }.bind(this));
        var d = autoCurve(points, 0.5, 0.000001);
        $line.$path.attr('d', d);
    }.bind(this));
};

Vcore.creator.curvechart = CurveChart;

export default CurveChart;
