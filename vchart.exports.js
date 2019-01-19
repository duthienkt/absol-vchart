Object.assign(
    absol.ShareCreator,
    Object.keys(vchart.creator)
        .filter(function (e) {
            return /.+chart/
        }).reduce(function (ac, cr) {
            ac[cr] = vchart.creator[cr];
            return ac;
        }, {})
);