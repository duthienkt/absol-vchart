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

import { isNumber, toLocalString } from "./helper";




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
    lambda:{
        isNumber: isNumber,
        toLocalString: toLocalString
    }
}

window.vchart = vchart;