import Svg from 'absol/src/HTML5/Svg';
import install from "absol-svg/js/svg/install";
var VCore = new Svg();
install(VCore);
export var _ = VCore._;
export var $ = VCore.$;
export default VCore;