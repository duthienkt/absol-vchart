import vchart from ".";

import * as helper from './helper';
import * as tl from './template';
import install from "./install";

Object.assign(vchart, helper);
vchart.tl = tl;

if ('absol' in window) {
    if (absol.coreDom) {
        absol.coreDom.install(
            Object.keys(vchart.creator)
                .filter(function (e) {
                    return !!e.match(/.+chart/);
                }).reduce(function (ac, cr) {
                ac[cr] = vchart.creator[cr];
                return ac;
            }, {}));
        install(absol.coreDom);
    }
    else {
        console.error("coreDom not found");
    }
}




window.vchart = vchart;