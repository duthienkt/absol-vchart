import vchart from ".";

import * as helper from './helper';
import * as tl from './template';

Object.assign(vchart, helper);
vchart.tl = tl;

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