import vchart from ".";

import * as helper from './helper';

Object.assign(vchart, helper);
if ('absol' in window) {
    if (absol.ShareCreator) {
        Object.assign(
            absol.ShareCreator,
            Object.keys(vchart.creator)
                .filter(function (e) {
                    return !!e.match(/.+chart/);
                }).reduce(function (ac, cr) {
                    ac[cr] = vchart.creator[cr];
                    return ac;
                }, {})
        );
    }
}


window.vchart = vchart;