import Dom from "absol/src/HTML5/Dom";
import BChart from "./BChart";
import VerticalChart from "./VerticalChart";
import PieChart from "./PieChart";
import AssessmentChart from "./AssessmentChart";


export var VChartCreators = [
    BChart,
    VerticalChart,
    PieChart,
    AssessmentChart
];

/***
 *
 * @param {Dom} core
 */
export default function install(core) {
    core.install(VChartCreators);
}

