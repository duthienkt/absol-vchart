import Vcore from "./VCore";

import vchartStyle_css from './style/vchartStyle';
import Dom from "absol/src/HTML5/Dom";

import './Axis';
import './Shape';
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

import { isNumber, toLocalString, text, circle, rect, vline, hline, moveVLine, moveHLine, autoCurve } from "./helper";
import { showTooltip, closeTooltip } from "./ToolTip";

var vchart = {
    core: Vcore,
    creator: Vcore.creator,
    _: Vcore._,
    $: Vcore.$,
    buildSvg: Vcore._,
    $style: Dom.ShareInstance._({
        tag: 'style',
        props: {
            innerHTML: vchartStyle_css
        }
    }).addTo(document.head),
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
    closeTooltip: closeTooltip
}

window.vchart = vchart;