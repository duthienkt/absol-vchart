import Dom from "absol/src/HTML5/Dom";
import BChart from "./BChart";
import VerticalChart from "./VerticalChart";
import PieChart from "./PieChart";
import AssessmentChart from "./AssessmentChart";
import ColumnChart from "./ColumnChart";
import ColumnAreaChart from "./ColumnAreaChart";
import TinyCircleChart from "./TinyCircleChart";
import DoughnutChart from "./DoughnutChart";
import SimpleColumnChart from "./SimpleColumnChart";
import SimpleBarChart from "./SimplerBarChart";
import SimpleLineChart from "./SimpleLineChart";
import HorizontalRangeChart from "./HorizontalRangeChart";
import HorizontalRankChart from "./HorizontalRankChart";
import StackedHorizontalBarChart from "./StackedHorizontalBarChart";
import {LineChart2} from "./LineChart";
import MappingBarChart from "./MapingBarChart";


export var VChartCreators = [
    BChart,
    VerticalChart,
    PieChart,
    AssessmentChart,
    ColumnChart,
    ColumnAreaChart,
    TinyCircleChart,
    DoughnutChart,
    SimpleColumnChart,
    SimpleBarChart,
    SimpleLineChart,
    HorizontalRangeChart,
    HorizontalRankChart,
    StackedHorizontalBarChart,
    LineChart2,
    MappingBarChart
];

/***
 *
 * @param {Dom} core
 */
export default function install(core) {
    core.install(VChartCreators);
}

