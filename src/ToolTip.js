import Dom from "absol/src/HTML5/Dom";

var syncTooltip = Dom.documentReady.then(function () {
    var _ = Dom.ShareInstance._;
    var $ = Dom.ShareInstance.$;
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
        var viewBound = Dom.traceOutBoundingClientRect(higne);
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

    var ToolTip = {};
    ToolTip.showTooltip = function (text, clientX, clientY) {
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

    ToolTip.closeTooltip = function (token) {
        if (currentToken == token) {
            container.addClass('vchart-hidden');
        }
    };
    return ToolTip;
});


export function showTooltip(text, clientX, clientY) {
    return syncTooltip.then(function (tooltip) {
        return tooltip.showTooltip(text, clientX, clientY);
    })
}


export function closeTooltip(text, clientX, clientY) {
    return syncTooltip.then(function (tooltip) {
        tooltip.closeTooltip(text, clientX, clientY);
    });
}

