vchart.lambda = {};

vchart.lambda.toLocalString = function (fixedRight) {
    var separatorReal = (1.5).toLocaleString().replace(/[0-9]/g, '');
    var separatorInt = (10000).toLocaleString().replace(/[0-9]/g, '');
    return function (value) {
        var x = Math.abs(value);
        if (fixedRight !== undefined) x = x.toFixed(fixedRight);
        var s = x.toString().split('.');
        var int = s[0] || '';
        var realText = s[1] || '';

        int = int.split('').reduce(function (ac, cr, i, arr) {
            if (i == 0 || (arr.length - i) % 3 == 0) {
                ac.push(cr);
            }
            else {
                ac[ac.length - 1] += cr;
            }
            return ac;
        }, []).join(separatorInt);

        return (value < 0 ? '-' : '') + int + (realText.length > 0 ? (separatorReal + realText) : '');
    }

};
