import {_, $} from "absol-acomp/ACore";
import {isRealNumber} from "absol-acomp/js/utils";
import {getScreenSize} from "absol/src/HTML5/Dom";


function TooltipSession(content, x, y) {
    this.content = content;
    this.x = isRealNumber(x) ? x : 0;
    this.y = isRealNumber(y) ? y : 0;
    this.open();
}

/**
 *
 * @type {{$ctn: AElement, $anchor: AElement, holder: TooltipSession}}
 */
TooltipSession.prototype.share = {
    $anchor: null,
    $ctn: null,
    holder: null
};


TooltipSession.prototype._prepare = function () {
    if (this.share.$anchor) return;
    this.share.$ctn = _({
        class: "vchart-tooltip-container"
    });
    this.share.$anchor = _({
        class: 'vchart-tooltip-anchor',
        child: this.share.$ctn
    });
};

TooltipSession.prototype.open = function () {
    this._prepare();
    if (this.share.holder === this) return;
    if (this.share.holder) {
        this.share.holder.close();
    }
    this.share.holder = this;
    this.share.$anchor.addStyle({
        visibility: 'hidden',
        left: this.x + 'px',
        top: this.y + 'px'
    }).addTo(document.body);
    this.share.$ctn.clearChild();
    if (typeof this.content === "string") {
        this.content.split(/\r?\n/).forEach((line, i) => {
            if (i) _('br').addTo(this.share.$ctn);
            _({
                tag: 'span',
                child: {text: line}
            }).addTo(this.share.$ctn);
        });
    } else {
        console.error("Not support tooltip.content ", this.content);
    }

    var bound = this.share.$ctn.getBoundingClientRect();
    var screenBound = getScreenSize();
    if (this.y < bound.height) {
        this.share.$ctn.addStyle('top', '0').addStyle('bottom', 'unset');
    }
    else {
        this.share.$ctn.removeStyle('top').removeStyle('bottom');

    }

    if (this.x + bound.width > screenBound.width) {
        this.share.$ctn.addStyle('right', '0').addStyle('left', 'unset');
    } else {
        this.share.$ctn.removeStyle('right').removeStyle('left');

    }

    this.share.$anchor.removeStyle('visibility');


};


TooltipSession.prototype.close = function () {
    if (this.share.holder !== this) return;
    this.share.holder = null;
    this.share.$ctn.clearChild();
    this.share.$anchor.remove();
};

/**
 * adapt old version
 * @param cb
 * @returns {TooltipSession}
 */
TooltipSession.prototype.then = function (cb) {
    if (typeof cb === "string") {
        cb(this);
    }
    return this;
}

export function showTooltip(text, clientX, clientY) {
    return new TooltipSession(text, clientX, clientY);
}


export function closeTooltip(token) {
    if (token && token.close) token.close();
}

