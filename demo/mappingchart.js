vchart._({
    tag: 'mappingchart',
    style: {},
    class: ['vchart-debugx'],
    attr: {},
    props: {
        title: 'Ánh xạ lương',
        canvasHeight: 500,
        canvasWidth: 800,
        min: 5000000,
        max: 100000000,
        numberToString: function (x) {
            return Math.round(x / 1000) * 1000 + 'VND'
        }
        // collision: 1
    },
    on: {

    }
}).addTo(document.body);