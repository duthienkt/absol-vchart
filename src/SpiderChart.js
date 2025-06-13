import VCore from "./VCore";
import './style/spiderchart.css';
import {rotate, translate} from "./template";
import {hline, text} from "./helper";

import './NoteGrid';
import KeyNote from "./KeyNote";


var _ = VCore._;
var $ = VCore.$;


function SpiderChart() {
    this.$attachhook = _('attachhook').addTo(this).on('attached', this.eventHandler.attached);
    this.$background = $('.vchart-spider-chart-background', this);
    this.$axisCtn = $('.vchart-spider-chart-axis-ctn', this.$background);
    this.$forceground = $('.vchart-spider-chart-forceground', this);
    this.$title = $('.base-chart-title', this.$forceground);
    this.$noteCtn = $('.vchart-spider-chart-note-ctn', this);
    this._canvasWidth = 'auto';
    this._canvasHeight = 'auto';
    this._viewCanvasHeight = 0;
    this._viewCanvasWidth = 0;
    this._resizeCallback = [];
    this._drew = false;
    this.ctitle = {
        text: 'This is title',
        $elt: this.$title
    };
    this._viewExpected = {};
    this._viewOption = {
        // noteLineLength: 15,
        // noteBoxHight: 14
    };

    this.$noteGrid = $('notegrid', this);
}


SpiderChart.tag = 'SpiderChart'.toLowerCase();

SpiderChart.render = function () {
    return _({
        tag: 'svg',
        class: 'vchart-base',
        child: [
            {
                class: 'vchart-spider-chart-background',
                child: [
                    '.vchart-spider-chart-axis-ctn'
                ]
            },
            {
                class: 'vchart-spider-chart-content'
            },
            {
                class: 'vchart-spider-chart-forceground',
                child: [
                    'text.base-chart-title',
                    '.vchart-spider-chart-note-ctn'
                ]
            },
            {
                tag: 'notegrid',
                attr: {
                    itemMargin: 20,
                    padding: 5
                },
                child: [{
                    tag: KeyNote,
                    attr: {
                        transform: translate(10, 20)
                    },
                    props: {
                        type: 'line',
                        text: 'Long long text',
                        color: 'red'
                    }
                },
                    {
                        tag: KeyNote,
                        attr: {
                            transform: translate(10, 40)
                        },
                        props: {
                            type: 'rect',
                            text: 'Long long text',
                            color: 'red'
                        }
                    }]
            }
        ]
    });
};


/**
 * @param {Array<Rectangle>} rects
 * @returns {Rectangle}
 */
SpiderChart.prototype._expectSize = function (rects, r) {
    var cr = new Rectangle(0, 0, 0, 0);
    var rect;
    for (var i = 0; i < rects.length; ++i) {
        var angle = Math.PI * 2 * i / rects.length - Math.PI / 2;
        rect = rects[i];
        if (i == 0) {
            rect.x = rect.width / 2;
            rect.y = -rect.height - r;
        } else
            if (rects.length % 4 == 0 && i == (rects.length >> 2)) {
                rect.x = r;
                rect.y = rect.height / 2;
            } else
                if (rects.length % 4 == 0 && i == (rects.length >> 2) * 3) {
                    rect.x = -r - rect.width;
                    rect.y = rect.height / 2;
                } else
                    if (rects.length % 2 == 0 && i == (rects.length >> 1)) {
                        rect.x = rect.width / 2;
                        rect.y = r;
                    } else
                        if (i < rects.length / 4) {
                            rect.x = r * Math.cos(angle);
                            rect.y = r * Math.sin(angle) - rect.height;
                        } else
                            if (i < rects.length / 2) {
                                rect.x = r * Math.cos(angle);
                                rect.y = r * Math.sin(angle);
                            } else
                                if (i < rects.length / 4 * 3) {
                                    rect.x = r * Math.cos(angle) - rect.width;
                                    rect.y = r * Math.sin(angle);
                                } else {
                                    rect.x = r * Math.cos(angle) - rect.width;
                                    rect.y = r * Math.sin(angle) - rect.height;
                                }

        cr = cr.merge(rect);
    }
    return cr;
};


SpiderChart.prototype.estimateSize = function () {
    var axisNameBBoxs = this.$axisNames.map(function (elt) {
        return elt.getBBox();
    });

    var rects = axisNameBBoxs.map(function (box) {
        return new Rectangle(box.x, box.y, box.width, box.height);
    });

    var titleBox = this.$title.getBBox();
    var noteGroupBox = this.$noteGroup.getBBox();

    var maxR = Math.min(this.canvasWidth, this.canvasHeight) / 2;
    var minR = 20;//
    var aWidth = this.canvasWidth - this.paddingContent * 2;
    var aHeight = this.canvasHeight - this.paddingContent * 2 - titleBox.height * 3 + noteGroupBox.height * 1.5;
    while (maxR - minR > 3) {
        var midR = (minR + maxR) / 2;
        var size = this._expectSize(rects, midR);
        if (size.width < aWidth && size.height < aHeight) {
            minR = midR;
        } else {
            maxR = midR;
        }
    }

    return {
        expectedSize: this._expectSize(rects, minR, true),
        expectedRadius: minR,
        axisLenth: minR - 30
    }
};


SpiderChart.prototype.updateCanvasSize = function () {
    var bound = this.getBoundingClientRect();
    var newHeight = this._canvasHeight;
    var newWidth = this._canvasWidth;
    if (!(newHeight > 0)) newHeight = bound.height;
    if (!(newWidth > 0)) newWidth = bound.witdh;
    if (newHeight == this._viewCanvasHeight && newWidth == this._viewCanvasWidth) return false;
    this.attr({
        width: newWidth + '',
        height: newWidth + ''
    });
    return true;
};


SpiderChart.prototype.recreate = function () {
    this._resizeCallback = [];
    this.recreateTitle();
    this.recreateAxis();
    this.recreateNotes();
    this._resizeCallback.sort(function (a, b) {
        return a.order - b.order;
    });
};


SpiderChart.prototype.recreateAxis = function () {
    var thisChart = this;

    var oyAxisElts = this.axis.oyAxises.map(function (oyAxis, i, arr) {
        var lineArrowElt = _('hlinearrow');
        lineArrowElt.resize(200);
        lineArrowElt.attr('transform', rotate(-90 + i * 360 / arr.length));
        lineArrowElt.addTo(thisChart.$axisCtn);
        oyAxis.lineArrowElt = lineArrowElt;
        return lineArrowElt;
    });

    this.$oyAxises = oyAxisElts;
};

SpiderChart.prototype._createLineNote = function (obj) {
    var res = _('g.vchart-spinder-chart-note');
    res.$line = hline(0, 9, 15, 'vc-assessment-chart-area').addStyle('stroke', obj.stroke).addTo(res);
    res.$name = text(obj.name, 15 + 5, 14).addTo(res);
    return res;
};

SpiderChart.prototype._createBoxNote = function (obj) {
    var res = _('g.vchart-spinder-chart-note');
    res.$line = hline(0, 9, 15, 'vc-assessment-chart-area').addStyle('stroke', obj.stroke).addTo(res);
    res.$name = text(obj.name, 15 + 5, 14).addTo(res);
    return res;
};

//todo more
SpiderChart.prototype.recreateNotes = function () {
    var thisChart = this;
    this.$noteCtn.clearChild();
    this.$notes = this.objects.map(function (obj) {
        var noteElt = thisChart._createLineNote(obj);

        noteElt.addTo(thisChart.$noteCtn);
    })
};

SpiderChart.prototype.recreateTitle = function () {
    this.ctitle.elt = this.$title;
    this.$title.clearChild().addChild(_({text: this.ctitle.text || ''}));
};


SpiderChart.prototype.updateSize = function (force) {
    if (!force && !this.updateCanvasSize()) return;// nothing change
    this.$noteGrid.updateSize();


};

SpiderChart.prototype.redraw = function () {
    this.recreate();
    this.updateSize(true);
};


/**
 * @type {SpiderChart}
 */
SpiderChart.eventHandler = {};

SpiderChart.eventHandler.attached = function () {
    if (!this._drew) {
        this._drew = true;
        this.redraw();
    } else {
        this.updateSize();
    }
};


SpiderChart.property = {};


VCore.install('spiderchart', SpiderChart);
export default SpiderChart;


