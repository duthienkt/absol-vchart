import vchart from ".";

import * as helper from './helper';
import * as tl from './template';

Object.assign(vchart, helper);
vchart.tl = tl;

if ('absol' in window) {
    if (absol.coreDom) {
        absol.coreDom.install(
            Object.assign(
                absol.ShareCreator,
                Object.keys(vchart.creator)
                    .filter(function (e) {
                        return !!e.match(/.+chart/);
                    }).reduce(function (ac, cr) {
                        ac[cr] = vchart.creator[cr];
                        return ac;
                    }, {})
            ))
    }
    else {
        console.error("coreDom not found");
    }
}


window.vchart = vchart;