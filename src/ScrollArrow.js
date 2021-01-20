import Vcore from "./VCore";
import Mat3 from "absol/src/Math/Mat3";
import Vec2 from "absol/src/Math/Vec2";
import './style/scrollarrow.css';
import EventEmitter from "absol/src/HTML5/EventEmitter";

var _ = Vcore._;
var $ = Vcore.$;

function ScrollArrow() {
    this.$left = $('.vc-scroll-arrow-left', this);
    this.$right = $('.vc-scroll-arrow-right', this);
    this.width = 100;
    this.on('pointerdown', this.eventHandler.pointerDown);
    this.$leftArrow = this.$left;
    this.$rightArrow = this.$right;
    this._pointerItv = -1;

    //     .on('pointerdown', function (event) {
    //         event.preventDefault();
    //         var iv = setInterval(function () {
    //             res.emit('pressleft', event, res);
    //         }, 30);
    //
    //         function finish(event) {
    //             clearInterval(iv);
    //             this.off('pointerleave', finish);
    //             this.off('pointerup', finish);
    //         };
    //         this.on('pointerleave', finish);
    //         this.on('pointerup', finish);
    //     });
    //
    // res.$hitBoxLeft = _({
    //     tag: 'rect',
    //     attr: {
    //         x: -5,
    //         y: -5,
    //         width: 30,
    //         height: 37,
    //         rx: 5,
    //         ry: 5
    //     },
    //     style: {
    //         fill: 'rgba(0, 0, 255, 0.1)'
    //     }
    // }).addTo(res.$leftArrow);
    //
    // res.$rightArrow = _(
    //     [
    //         '<g>',
    //         '<g transform="translate(0,-270)">',
    //         '<g transform="matrix(.26164 0 0 .26164 .23843 218.56)" style="fill:#00a5d6">',
    //         '<path d="m0.99976 198 49.214 48.519-49.213 49.481v-14.201l35.215-35.079-35.164-34.611z" style="fill:#00a5d6"/>',
    //         '<path d="m28.531 198.44v13.96l35.057 34.608-35.057 34.963v13.555l48.91-48.844z" style="fill:#00a5d6"/>',
    //         '</g>',
    //         '</g>',
    //         '</g>'
    //     ].join('')
    // ).addTo(res)
    //     .on('pointerdown', function (event) {
    //         event.preventDefault();
    //         var iv = setInterval(function () {
    //             res.emit('pressright', event, res);
    //         }, 30);
    //
    //         function finish(event) {
    //             clearInterval(iv);
    //             this.off('pointerleave', finish);
    //             this.off('pointerup', finish);
    //         };
    //         this.on('pointerleave', finish);
    //         this.on('pointerup', finish);
    //     });
    //
    // res.$hitBoxRight = _({
    //     tag: 'rect',
    //     attr: {
    //         x: -5,
    //         y: -5,
    //         width: 30,
    //         height: 37,
    //         rx: 5,
    //         ry: 5
    //     },
    //     style: {
    //         fill: 'rgba(0, 0, 255, 0.1)'
    //     }
    // }).addTo(res.$rightArrow);
    //
    // return res;
}

Mat3.prototype.apply2DTransform = function (v, isPoint) {
    var a = this.data;
    var x0 = v.x;
    var y0 = v.y;
    var x = x0 * a[0] + y0 * a[3] + (isPoint ? a[6] : 0);
    var y = x0 * a[1] + y0 * a[4] + (isPoint ? a[7] : 0);
    return new Vec2(x, y);
};

ScrollArrow.tag = 'ScrollArrow'.toLowerCase();

ScrollArrow.render = function () {
    return _({
        tag: 'gcontainer',
        extendEvent: ['pressleft', 'pressright'],
        class: 'vc-scroll-arrow',
        child: [
            {
                attr: {
                    // transform: "matrix(.26164 0 0 .26164 .23843 218.56)"
                },
                child: [
                    {
                        tag: 'gcontainer',
                        class: 'vc-scroll-arrow-left',
                        child: [
                            {
                                tag: 'rect',
                                class: 'vc-scroll-arrow-hit-box',
                                attr: {
                                    x: 0,
                                    y: -19,
                                    width: 30,
                                    height: 38,
                                    rx: 5,
                                    ry: 5
                                }
                            },
                            {
                                tag: 'path',
                                class: 'vc-scroll-arrow-icon',
                                attr: {
                                    d: 'm 24.02314720639999998 -12.3647199999999984 -12.876350959999998 12.69451116 12.87608932 12.946208839999999' +
                                        ' v -3.71554964 l -9.2136526 -9.178069559999999 9.20030896 -9.05562204 z' +
                                        ' M 17.226420839999999 -12.4798416000000003 v 3.6524944 l -9.17231348 9.054837119999998 9.17231348 9.14771932' +
                                        ' v 3.5465302 l -12.796812399999999 -12.77954416 z'
                                }

                            }
                        ]

                    },
                    {
                        tag: 'gcontainer',
                        class: 'vc-scroll-arrow-right',

                        child: [
                            {
                                tag: 'rect',
                                class: 'vc-scroll-arrow-hit-box',
                                attr: {
                                    x: -30,
                                    y: -19,
                                    width: 30,
                                    height: 38,
                                    rx: 5,
                                    ry: 5
                                }
                            },
                            {
                                tag: 'path',
                                class: 'vc-scroll-arrow-icon',
                                attr: {
                                    d: 'm -22.5000072064 -12.3647199999999984 12.876350959999998 12.69451116 -12.87608932 12.946208839999999' +
                                        ' v -3.71554964 l 9.2136526 -9.178069559999999 -9.20030896 -9.05562204 z ' +
                                        'M -15.70328084 -12.4798416000000003 v 3.6524944 l 9.17231348 9.054837119999998 ' +
                                        '-9.17231348 9.14771932 v 3.5465302 l 12.796812399999999 -12.77954416 z'
                                }

                            }
                        ]

                    }
                ]
            }
        ]
    });
};

ScrollArrow.property = {
    width: {
        set: function (value) {
            this.box.width = value;
            this.$right.box.x = value;
        },
        get: function () {
            return this.box.width;
        }
    }
};

ScrollArrow.eventHandler = {};

ScrollArrow.eventHandler.pointerDown = function (event) {
    event.preventDefault();
    var button = EventEmitter.hitElement(this.$left, event)?0: 1;
    var thisSB = this;
    this._buttonIdx = button;
    if (this._pointerItv < 0){
        this._pointerItv= setInterval(function () {
            if (thisSB._buttonIdx === 0){
                thisSB.emit('pressleft', event, thisSB);
            }
            else  if (thisSB._buttonIdx === 1){
                thisSB.emit('pressright', event, thisSB);
            }
        }, 30);
    }

    $(document.body).on('pointerup', this.eventHandler.pointerUp);

    if (thisSB._buttonIdx === 0){
        thisSB.emit('pressleft', event, thisSB);
    }
    else  if (thisSB._buttonIdx === 1){
        thisSB.emit('pressright', event, thisSB);
    }

};

ScrollArrow.eventHandler.pointerUp = function () {
    clearInterval(this._pointerItv);
    this._pointerItv = -1;
    $(document.body).off('pointerup', this.eventHandler.pointerUp);
};


Vcore.install(ScrollArrow);

export default ScrollArrow;