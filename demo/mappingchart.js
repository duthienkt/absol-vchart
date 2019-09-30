vchart._({
    tag: 'mappingchart',
    style: {},
    class: ['vchart-debug'],
    attr: {},
    props: {
        title: 'Ánh xạ lương',
        canvasHeight: 500,
        canvasWidth: 800,
        min: 5000000,
        max: 100000000,
        numberToString: function (x) {
            return Math.round(x / 100000) * 100000 + ''
        },
        content: [
            {value: 7000000, mapValue: 12000000},
            {value: 30000000, mapValue: 40000000},
            {value: 55000000, mapValue: 70000000}
        ],
        // collision: 1,
        precision: 1/1
    },
    on: {

    }
}).addTo(document.body);