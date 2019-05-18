import Vcore from "./VCore";

var _ = Vcore._;
var $ = Vcore.$;

function ScrollArrow() {
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

Vcore.creator.scrollarrow = ScrollArrow;