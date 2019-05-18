

export function translate (x, y) {
    return 'translate(' + x + ', ' + y + ')';
};

export function rotate () {
    return 'rotate(' + Array.prototype.join.call(arguments, ',') + ')';
};
