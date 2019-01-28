vchart.creator.rankchart = function () {
    
    return  vchart._('basechart', true);
};





vchart.creator.rankchart.prototype._createRank = function (rank, value) {
    var res = vchart._({
        tag: 'g',
        child: [
            {
                tag: 'circle',
                class: 'rank-chart-plot',
                attr: {
                    cx: this.plotRadius,
                    cy: 0,
                    r: this.plotRadius
                },
                style: {
                    fill: this.colors[rank]
                }
            },
            {
                tag: 'text',
                class: 'rank-chart-plot-text',
                attr: {
                    x: this.plotRadius,
                    y: 5,
                    'text-anchor': 'middle'
                },
                props: {
                    innerHTML: rank + 1 + ''
                }
            },
            {
                tag: 'text',
                attr: {
                    x: this.plotRadius * 2 + 7,
                    y: 5
                },
                props: {
                    innerHTML: this.numberToString(value)
                }
            }
        ]
    });
    return res;
};




vchart.creator.rankchart.prototype._createOYSegmentLines = function (n) {
    var _ = vchart._;
    var res = _({
        tag: 'g',
        child: Array(n).fill('path.vchart-segment-line')
    });
    return res;
};



vchart.creator.rankchart.prototype._createPosition = function (position) {
    var res = vchart._({
        tag: 'g',
        child: position.ranks.map(function (value, rank) {
            return this._createRank(rank, value);
        }.bind(this))
    });
    return res;
};



// vchart.creator.rankchart.prototype.updateSize = function () {
//     this.attr({ width: this.canvasWidth + '', height: this.canvasHeight + '', viewBox: [0, 0, this.canvasWidth, this.canvasHeight].join(' ') });
//     this.$title.attr('x', this.canvasWidth / 2);
// };






vchart.creator.rankchart.prototype.updateComp = function () {
    this.oxContentLength = this.$positions.reduce(function (contentLength, pe, positionIndex) {
        var position = this.positions[positionIndex];
        contentLength = contentLength + 20;
        var maxDY = Array.prototype.reduce.call(pe.childNodes, function (maxDY, meme, j) {
            var value = position.ranks[j];
            var y = this.mapOYValue(value);
            meme.attr('transform', vchart.tl.translate(contentLength, y));
            meme._tr_y = y;
            return Math.max(maxDY, -y);
        }.bind(this), 0);

        //todo:auto x
        var valueElements = Array.apply(null, pe.childNodes);
        valueElements.sort(function (a, b) {
            return a._tr_y - b._tr_y;
        });

        var ninf = -1000000;
        var messure = valueElements.reduce(function (ac, e) {
            var y = e._tr_y;
            var colIndex = 0;
            while (ac[colIndex].minY > y)++colIndex;
            ac[colIndex].minY = y + 20;
            ac[colIndex].child.push(e);
            ac[colIndex].maxWidth = Math.max(ac[colIndex].maxWidth, e.getBBox().width);
            return ac;
        }, Array(200).fill(null).map(function () {
            return { minY: ninf, child: [], maxWidth: ninf };
        }));
        messure.reduce(function (left, col) {
            if (col.child.length == 0) return;
            col.child.forEach(function (vale) {
                vale.attr('transform', vchart.tl.translate(left, vale._tr_y));
            });

            return left + col.maxWidth + 9;
        }, contentLength);

        var innerWidth = pe.getBBox().width;

        this.$positionBoxes[positionIndex].attr({
            x: contentLength - 10,
            width: innerWidth + 20,
            y: -maxDY - (this.plotRadius + 20),
            height: maxDY + this.plotRadius + 20
        });

        var columeWidth = Math.max(pe.getBBox().width + 20, this.$positionNames[positionIndex].getBBox().width + 10);

        this.$positionNames[positionIndex].attr('x', contentLength + columeWidth / 2);

        contentLength += columeWidth;

        return contentLength;

    }.bind(this), 0);
};


vchart.creator.rankchart.prototype.update = function () {
    if (!this.positions || this.positions.length <= 0) {
        return;
    }
    this.super();
};

vchart.creator.rankchart.prototype.processMinMax = function(){
    this.maxValue = this.positions.reduce(function (ac, postion) {
        return postion.ranks.reduce(function (ac, value) {
            return Math.max(ac, value);
        }, ac);
    }, -10000000000);

    this.minValue = this.positions.reduce(function (ac, postion) {
        return postion.ranks.reduce(function (ac, value) {
            return Math.min(ac, value);
        }, ac);
    }, 10000000000);
};

vchart.creator.rankchart.prototype.initComp = function () {
    this.$positionBoxes = this.positions.map(function (postion) {
        return vchart.rect(0, 0, 0, 0, 'rank-chart-position-rect').addTo(this.$content);
    }.bind(this));

    this.$positions = this.positions.map(this._createPosition.bind(this)).map(function (e) {
        return e.addTo(this.$content);
    }.bind(this));
    this.$positionNames = this.positions.map(function (position) {
        return vchart.text(position.name, 0, 18).attr('text-anchor', 'middle').addTo(this.$content);
    }.bind(this));
};

vchart.creator.rankchart.prototype.preInit = function () {
    this.super();
    this.colors = [
        'transparent', 'rgb(201, 241, 253)', 'rgb(212, 227, 252)', 'rgb(218, 202, 251)',
        'rgb(242, 201, 251)', 'rgb(255, 218, 216)', 'rgb(255, 236, 215)', 'rgb(254, 252, 224)',
        'rgb(223, 237, 214)', 'rgb(77, 215, 250)', 'rgb(117, 169, 249)', 'rgb(139, 81, 245)',
        'rgb(215, 87, 246)', 'rgb(255, 138, 132)', 'rgb(152, 165, 52)', 'rgb(254, 248, 160)',
        'rgb(174, 221, 148)', 'rgb(0, 164, 221)', 'rgb(20, 100, 246)', 'rgb(156, 41, 183)'
    ];
  
    this.plotRadius = 9;
    this.paddingnAxisBottom = this.plotRadius + 30;
};


vchart.creator.rankchart.prototype.init = function (props) {
    if (!props.positions || props.positions.length <= 0) {
        console.log('Empty data!');
        return;
    }
    this.super(props);
};

