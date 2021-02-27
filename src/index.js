import Vcore from "./VCore";

import './style/vchartStyle';

import './Axis';
import './ScrollArrow';
import './BaseChart';
import './ToolTip';
import './HLineArrow';
import './HScrollBar';
import './LineChart';
import './DualChart';
import './RangeChart';
import './AssessmentChart';
import './ColumnChart';
import './ColumnAreaChart';
import './RangeGroupChart';
import './CurveChart';
import './RankChart';
import './SunburstChart';
import './SquareChart';
import './GroupRankChart';
import './MappingChart';
import './ImagesChart';
import './SalaryScaleChart';
import './HorizontalBarChart';
import './SpiderChart';
import './FunnelChart';
import './BarStackChart';
import './PieChart';
import  './HCollumnChart';

import {
    isNumber,
    toLocalString,
    text,
    circle,
    rect,
    vline,
    hline,
    moveVLine,
    moveHLine,
    autoCurve,
    addDevContextMenu
} from "./helper";
import { showTooltip, closeTooltip } from "./ToolTip";
import install from "./install";
install(Vcore);
var vchart = {
    core: Vcore,
    creator: Vcore.creator,
    _: Vcore._,
    $: Vcore.$,
    buildSvg: Vcore._,
    lambda: {
        isNumber: isNumber,
        toLocalString: toLocalString
    },
    text: text,
    circle: circle,
    rect: rect,
    vline: vline,
    hline: hline,
    moveVLine: moveVLine,
    moveHLine: moveHLine,
    autoCurve: autoCurve,
    showTooltip: showTooltip,
    closeTooltip: closeTooltip,
    addDevContextMenu: addDevContextMenu
}

export default vchart;