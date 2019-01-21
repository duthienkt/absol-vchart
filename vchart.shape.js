vchart.creator.shape = function () {
    var res = vchart._('path');
    return res;
};

vchart.creator.shape.prototype.begin = function () {
    this.buildingPath = '';
    return this;
};

vchart.creator.shape.prototype.end = function () {
    this.attr('d', this.buildingPath);
    return this;
};


vchart.creator.shape.prototype.moveTo = function (x, y) {
    this.buildingPath += 'M' + x + ' ' + y;
    return this;
};

vchart.creator.shape.prototype.closePath = function () {
    this.buildingPath += 'z';
    return this;
}

vchart.creator.shape.prototype.lineTo = function (x, y) {
    this.buildingPath += 'L' + x + ' ' + y;
    return this;
};


vchart.creator.shape.prototype.arcTo = function (x, y, rx, ry, lf, sf, xRotate) {
    ry = ry || rx;
    lf = lf || 0;
    sf = sf || 0;
    xRotate = xRotate || 0;
    this.buildingPath += 'A' + [rx, ry, xRotate, lf, sf, x, y].join(' ');
    return this;
};

vchart.creator.shape.prototype.curveTo - function (x, y, x0, y0, x1, y1) {
    this.buildingPath += 'C' + [x0, y0, x1, y1, x, y].join(' ');
    return this;
};





