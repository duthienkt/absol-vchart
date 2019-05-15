

window.vchart = window.vchart || new absol.Svg({ creator: Object.assign({}, absol.ShareSvgCreator) });

vchart.btSteps = [
    0.001, 0.002, 0.0025, 0.005,
    0.01, 0.02, 0.025, 0.05,
    0.1, 0.2, 0.25, 0.5,
    1, 2, 5].concat((function () {
        var res = [];
        var h = 1;
        while (h < 10000000000) {
            res.push(10 * h);
            res.push(20 * h);
            res.push(25 * h);
            res.push(50 * h);
            h *= 10;
        }
        return res;
    })());


vchart.circle = function (x, y, r, eClss) {
    return vchart._({
        tag: 'circle',
        class: eClss,
        attr: {
            cx: x,
            cy: y,
            r: r
        }
    });
};

/**
 * @param {String} text
 * @param {Number} x
 * @param {Number} y
 * @param {String} eClss - can be undefine
 * @returns {SVGTextElement} 
 */
vchart.text = function (text, x, y, eClss) {
    if (eClss instanceof Array) eClss = eClss.join(' ');
    return vchart._('<text x="' + x + '" y="' + y + '" ' + (eClss ? 'class="' + eClss + '"' : '') + '>' + text + '</text>')
    return vchart._({
        tag: 'text',
        class: eClss,
        attr: {
            x: x,
            y: y
        },
        props: {
            innerHTML: text
        }
    });
};

vchart.vline = function (x, y, length, eClss) {
    return vchart._({
        tag: 'path',
        class: eClss,
        attr: {
            d: 'm' + x + ' ' + y + 'v' + length
        }
    });
};

vchart.moveVLine = function (e, x, y, length) {
    return e.attr('d', 'm' + x + ' ' + y + 'v' + length);
};

vchart.hline = function (x, y, length, eClss) {
    return vchart._({
        tag: 'path',
        class: eClss,
        attr: {
            d: 'm' + x + ' ' + y + 'h' + length
        }
    });
};

vchart.moveHLine = function (e, x, y, length) {
    return e.attr('d', 'm' + x + ' ' + y + 'h' + length);
};

vchart.rect = function (x, y, width, height, eClss) {
    var option = {
        tag: 'rect',
        attr: {
            x: x,
            y: y,
            width: width,
            height: height
        },
        class: eClss
    };
    return vchart._(option);
};


/**
 * Template string
 */
vchart.tl = {};

vchart.tl.translate = function (x, y) {
    return 'translate(' + x + ', ' + y + ')';
};

vchart.tl.rotate = function () {
    return 'rotate(' + Array.prototype.join.call(arguments, ',') + ')';
};



vchart.calBeautySegment = function (maxSegment, minValue, maxValue) {
    var i = 0;
    var res = { step: 1, segmentCout: maxValue - minValue, maxValue: maxValue, minValue: minValue };
    while (i < vchart.btSteps.length) {
        var step = vchart.btSteps[i];
        var bot = Math.floor(minValue / step);
        var top = Math.ceil(maxValue / step);
        if (top - bot <= maxSegment) {
            res.step = step;
            res.segmentCout = top - bot;
            res.maxValue = top * step;
            res.minValue = bot * step;
            break;
        }
        ++i;
    }
    return res;
};



//////////////////////////////////////////////////////////
//       LINE CHART                                     //
//////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////
//             AXIS                                     //
//////////////////////////////////////////////////////////


vchart.creator.hlinearrow = function () {
    var _ = vchart._;
    var $ = vchart.$;
    var res = _('g.vchart-line-arrow');
    res.$line = _('path').addTo(res);
    res.$arrow = _('<path id="ox-arrow" d="m-6.8 -5v10l6.8 -5z"/>').addTo(res);
    return res;
};

vchart.creator.hlinearrow.prototype.resize = function (length) {
    this.$arrow.attr('transform', vchart.tl.translate(length, 0));
    vchart.moveHLine(this.$line, 0, 0, length);
};




vchart.creator.axis = function () {
    var _ = vchart._;
    var $ = vchart.$;
    var res = vchart._(
        [
            '<g class="vchart-axis" id="axis">',
            '    <path id="oy-arrow" d="m-5 0h10l-5-6.8z" />',
            '    <path id="ox-arrow" d="m0 -5v10l6.8 -5z"/>',
            '    <path id="oxy" d="m0 -1v1 h1" style="fill:none" />',
            '</g>'
        ].join('')
    );
    res.$oxy = $('#oxy', res);
    res.$oxArrow = $('#ox-arrow', res);
    res.$oyArrow = $('#oy-arrow', res);
    res.oxLength = 1;
    res.oyLength = 1;
    return res;
};



vchart.creator.axis.prototype.updateSize = function () {
    this.$oxy.attr('d', 'm0 ' + (-this.oyLength) + 'v' + this.oyLength + ' h' + this.oxLength);
    this.$oxArrow.attr('transform', 'translate(' + this.oxLength + ', 0)');
    this.$oyArrow.attr('transform', 'translate(0, ' + (-this.oyLength) + ')');
};

vchart.creator.axis.prototype.resize = function (oxLength, oyLength) {
    this.oxLength = oxLength;
    this.oyLength = oyLength;
    this.updateSize();
};


vchart.creator.axis.prototype.moveTo = function (x, y) {
    this.attr('transform', 'translate(' + x + ',' + y + ')');
};

vchart.creator.axis.prototype.init = function (props) {
    if (props) {
        if (props.oxLength && props.oyLength) this.resize(props.oxLength, props.oyLength);
        if (props.x && props.y) this.moveTo(props.x, props.y);
    }
};







vchart.creator.scrollarrow = function () {
    var _ = vchart._;
    var res = _('g.vchart-scroll-arrow');
    res.defineEvent(['pressleft', 'pressright']);

    res.$leftArrow = _(
        [
            '<g>',
            '<g class="vchart-scroll-arrow-left" transform="translate(0,-270)">',
            '<g transform="matrix(-.26164 0 0 .26164 20.762 218.56)" style="fill:#00a5d6">',
            '<path d="m0.99976 198 49.214 48.519-49.213 49.481v-14.201l35.215-35.079-35.164-34.611z" style="fill:#00a5d6"/>',
            '<path d="m28.531 198.44v13.96l35.057 34.608-35.057 34.963v13.555l48.91-48.844z" style="fill:#00a5d6"/>',
            '</g>',
            '</g>',
            '</g>'
        ].join('')
    ).addTo(res)
        .on('pointerdown', function (event) {
            event.preventDefault();
            var iv = setInterval(function () {
                res.emit('pressleft', event, res);
            }, 30);
            function finish(event) {
                clearInterval(iv);
                this.off('pointerleave', finish);
                this.off('pointerup', finish);
            };
            this.on('pointerleave', finish);
            this.on('pointerup', finish);
        });

    res.$hitBoxLeft = _({
        tag: 'rect',
        attr: {
            x: -5,
            y: -5,
            width: 30,
            height: 37,
            rx: 5,
            ry: 5
        },
        style: {
            fill: 'rgba(0, 0, 255, 0.1)'
        }
    }).addTo(res.$leftArrow);



    res.$rightArrow = _(
        [
            '<g>',
            '<g transform="translate(0,-270)">',
            '<g transform="matrix(.26164 0 0 .26164 .23843 218.56)" style="fill:#00a5d6">',
            '<path d="m0.99976 198 49.214 48.519-49.213 49.481v-14.201l35.215-35.079-35.164-34.611z" style="fill:#00a5d6"/>',
            '<path d="m28.531 198.44v13.96l35.057 34.608-35.057 34.963v13.555l48.91-48.844z" style="fill:#00a5d6"/>',
            '</g>',
            '</g>',
            '</g>'
        ].join('')
    ).addTo(res)
        .on('pointerdown', function (event) {
            event.preventDefault();
            var iv = setInterval(function () {
                res.emit('pressright', event, res);
            }, 30);
            function finish(event) {
                clearInterval(iv);
                this.off('pointerleave', finish);
                this.off('pointerup', finish);
            };
            this.on('pointerleave', finish);
            this.on('pointerup', finish);
        });

    res.$hitBoxRight = _({
        tag: 'rect',
        attr: {
            x: -5,
            y: -5,
            width: 30,
            height: 37,
            rx: 5,
            ry: 5
        },
        style: {
            fill: 'rgba(0, 0, 255, 0.1)'
        }
    }).addTo(res.$rightArrow);

    return res;
};


//x[i] < x[i+1] 
vchart.autoCurve = function (points, strong, free) {
    if (!(strong > 0)) strong = 0.5;
    if (points.length == 0) {
        return '';
    };
    var paddingLeft = points[0].slice();
    var paddingRight = points[points.length - 1].slice();
    if (typeof free == "number") {
        paddingLeft[0] -= (points[1][0] - points[0][0]) * free;
        paddingLeft[1] -= (points[1][1] - points[0][1]) * free;

        paddingRight[0] += (points[points.length - 1][0] - points[points.length - 2][0]) * free;
        paddingRight[1] += (points[points.length - 1][1] - points[points.length - 2][1]) * free;
    }
    else if (free instanceof Array) {
        paddingLeft[0] -= free[0][0];
        paddingLeft[1] -= free[0][1];

        paddingRight[0] += free[1][0];
        paddingRight[1] += free[1][1];
    }
    points = [paddingLeft].concat(points).concat([paddingRight]);
    var Cs = [];
    Cs.push('M' + points[1].join(' '));

    for (var i = 1; i < points.length - 2; ++i) {
        var A = Math.makeVec2(points[i - 1]);
        var B = Math.makeVec2(points[i]);
        var C = Math.makeVec2(points[i + 1]);
        var D = Math.makeVec2(points[i + 2]);
        var AB = B.sub(A);
        var BC = C.sub(B);
        var CB = BC.inv();
        var DC = C.sub(D);
        var lAB = AB.abs();
        var lBC = BC.abs();
        var lDC = DC.abs();
        var lCB = lBC;
        var h1 = Math.sqrt(lAB * lBC);
        var h2 = Math.sqrt(lBC * lDC);
        if (h1 == 0) h1 = 1;
        if (h2 == 0) h2 = 1;

        var N1 = (AB.normalized()).add(BC.normalized()).normalized();
        var N2 = (CB.normalized()).add(DC.normalized()).normalized();

        var lN1 = lBC == 0 ? 0 : lBC * (N1.dot(BC) / (N1.abs() * BC.abs())) * h1 / (h1 + h2) * strong;
        var lN2 = lCB == 0 ? 0 : lCB * (N2.dot(CB) / (N2.abs() * CB.abs())) * h2 / (h1 + h2) * strong;
        N1 = N1.mult(lN1);
        N2 = N2.mult(lN2);
        var P1 = B.add(N1);
        var P2 = C.add(N2);
        var x1 = P1.x;
        var y1 = P1.y;
        var x2 = P2.x;
        var y2 = P2.y;
        var x = C.x;
        var y = C.y;
        Cs.push('C ' + x1 + ' ' + y1 + ', ' + x2 + ' ' + y2 + ', ' + x + ' ' + y);
    }

    return Cs.join('');

};



absol.documentReady.then(function () {
    var _ = absol._;
    var $ = absol.$;
    var higne = _({
        class: 'vchart-tooltip-higne',
        child: {
            class: 'vchart-tooltip-anchor-container',
            child: {
                class: 'vchart-tooltip-anchor',
                child: '.vchart-tooltip-container'
            }
        }
    }).addTo(document.body);

    var container = $('.vchart-tooltip-container', higne);
    container.addStyle({ left: -10000, top: -1000 });
    var anchorContainer = $('.vchart-tooltip-anchor-container', higne);
    var sync = higne.afterAttached();
    var currentToken = 0;
    var anchorClientX, anchorClientY;

    function updateTooltipContainer() {
        var containerBound = container.getBoundingClientRect();
        var viewBound = absol.dom.traceOutBoundingClientRect(higne);
        if (anchorClientX + containerBound.width > viewBound.right) {
            container.addStyle({
                left: 'auto',
                right: '0'
            });
        }
        else {
            container.addStyle({
                left: '0',
                right: 'auto'
            });
        }

        if (anchorClientY - containerBound.height < viewBound.top) {
            container.addStyle({
                top: '0',
                bottom: 'auto'
            });
        }
        else {
            container.addStyle({
                top: 'auto',
                bottom: '0'
            });
        }
    }

    function close() {
        container.addClass('absol-hidden');
        window.removeEventListener('scroll', close, false);

    }

    vchart.showTooltip = function (text, clientX, clientY) {
        window.addEventListener('scroll', close, false);

        anchorClientX = clientX;
        anchorClientY = clientY;
        var higneBound = higne.getBoundingClientRect();
        anchorContainer.addStyle({
            left: clientX - higneBound.left + 'px',
            top: clientY - higneBound.top + 'px'
        });


        container.addClass('vchart-hidden');
        container.clearChild();
        text.split(/\r?\n/).forEach(function (line) {
            _('<div><span>' + line + '</span></div>').addTo(container);
        });

        sync = sync.then(updateTooltipContainer).then(function () {
            container.removeClass('vchart-hidden');
        });

        return (++currentToken);
    };

    vchart.closeTooltip = function (token) {
        if (currentToken == token) {
            container.addClass('vchart-hidden');
        }
    };

});





vchart.hslaToRGBA = function (hsla) {
    var hue = hsla[0] * 6;
    var sat = hsla[1];
    var li = hsla[2];

    var RGBA = [];

    if (sat === 0) {
        RGBA = [li, li, li, hsla[3]];
    } else {
        var val;
        if (li < 0.5) {
            val = (1 + sat) * li;
        } else {
            val = li + sat - li * sat;
        }

        var zest = 2 * li - val;

        var hzvToRGB = function (hue, zest, val) {
            if (hue < 0) {
                hue += 6;
            } else if (hue >= 6) {
                hue -= 6;
            }
            if (hue < 1) {
                return zest + (val - zest) * hue;
            } else if (hue < 3) {
                return val;
            } else if (hue < 4) {
                return zest + (val - zest) * (4 - hue);
            } else {
                return zest;
            }
        };

        RGBA = [
            hzvToRGB(hue + 2, zest, val),
            hzvToRGB(hue, zest, val),
            hzvToRGB(hue - 2, zest, val),
            hsla[3]
        ];
    }

    return RGBA;
};



vchart.generateBackgroundColors = function (n) {
    var l = Math.ceil(Math.sqrt(n));
    var arrs = Array(n).fill(null).reduce(function (ac, cr, i) {
        var tail = ac[ac.length - 1];
        if (tail.length >= l) {
            var tail = [];
            ac.push(tail);
        }

        var color = absol.Color.fromHSL(i / n, 0.296, 0.46);
        tail.push(color);
        return ac;
    }, [[]]);

    var res = [];
    var i = 0;
    while (res.length < n) {
        if (arrs[i].length > 0) {
            res.push(arrs[i].shift());
        }
        i = (i + 1) % arrs.length;
    }

    return res;

};