Object.assign(
    absol.ShareCreator,
    Object.keys(vchart.creator)
        .filter(function (e) {
            return e.match(/.+chart/);
        }).reduce(function (ac, cr) {
            ac[cr] = vchart.creator[cr];
            return ac;
        }, {})
);