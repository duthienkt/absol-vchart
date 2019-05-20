var minA = Array(12).fill(0).map(function () {
    return Math.floor(Math.random() * 200) + 100;
});

var midA = minA.map(function (v) {
    return 300 + Math.floor(Math.random() * 200);
});
var maxA = Array(12).fill(700);
var results = Array(12).fill(0).map(function () {
    return 23 + Math.floor(600 * Math.random());
});
var results1 = Array(12).fill(0).map(function () {
    return 23 + Math.floor(600 * Math.random());
});

var texts = Array(12).fill(0).map(function (u, i) {
    return 'Tối đa: ' + maxA[i] + '\nTối thiểu: ' + minA[i] + '\nTrung bình: ' + midA[i] + '\nĐạt được: ' + results[i];
});


vchart._({
    tag: 'dualchart',
    props: {
        title: 'Bão lãnh thanh toán',
        valueName: '$',
        keyName: 'Tháng',
        zeroOY: true,
        keys: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        lines: [
            {
                name: 'Đường 1',
                values: results,
                texts: texts,
                color: 'red',
                plotColors: ['blue']
            },
            {
                name: 'Đường 2',
                values: results1,
                texts: texts,
                color: 'pink',
                plotColors: ['cyan']
            }
        ],
        areas: [
            {
                name: 'Tối đa',
                values: maxA,
                color: 'rgb(255, 204, 127)'
            },

            {
                name: 'Trung bình',
                values: midA,
                color: 'rgb(204, 204, 127)'
            },
            {
                name: 'Thấp',
                values: minA,
                color: 'rgb(231, 228, 227)'
            }
        ]
    }
}).addTo(document.body)
