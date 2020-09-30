import Dom from "absol/src/HTML5/Dom";
import BChart from "./BChart";

export var VChartCreators = [
    BChart
];

/***
 *
 * @param {Dom} core
 */
export default function install(core) {
    core.install(VChartCreators);
}

