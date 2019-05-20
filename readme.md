# VCHART

SVG chart, base on absol.js
-----------------------


## Linechart

[![Live-Demo](./doc/assets/linechart.PNG)](http://volcanion.cf/vchart/demo/linechart.html)

```js
var results = Array(12).fill(0).map(function () {
    return 23 + Math.floor(600 * Math.random());
});
var results1 = Array(12).fill(0).map(function () {
    return 23 + Math.floor(600 * Math.random());
});
vchart._({
    tag: 'linechart',
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
        ]
}).addTo(document.body)
```

## DualChart(Area-Line)
[![Live-Demo](./doc/assets/dualchart.PNG)](http://volcanion.cf/vchart/demo/dualchart.html)


```js
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
```


## RangeChart(O-stick-chart)

[![Live-Demo](./doc/assets/rangechart.PNG)](http://volcanion.cf/vchart/demo/rangechart.html)

```js
   var y = vchart._({
        tag: 'rangechart',
        style: { background: 'rgb(230, 230, 232)', width: '1024px', height: 1024 * 600 / 700 + 'px' },
        props: {
            title: 'Biểu đồ lương chức danh',
            valueName: 'lương',
            keyName: 'chức danh', 
            canvasWidth: 900,
            canvasHeight: 600,
            zeroOY: true,
            numberToString: vchart.lambda.toLocalString(0),
            maxText: 'Lương tối thiểu',
            minText: 'Lương tối thiểu',
            midText: 'Lương ở giữa',
            normalText: 'Lương thị trường',
            ranges: [
                {
                    name: 'Giám đốc',
                    min: 3000000.4838583485835,
                    max: 5000000.48237573475,
                    mid: 3500000.5275834579345,
                    normal: 4000000.5723957239
                },
                {
                    name: 'Trưởng phòng tài chính',
                    min: 4000000,
                    max: 7500000,
                    mid: 10000000,
                    normal: 8000000
                },
                {
                    name: 'Trưởng phòng kế hoạch',
                    min: 2100000,
                    max: 7900000,
                    mid: 6000000,
                    normal: 7000000
                },
                {
                    name: 'Kế toán',
                    min: 2500000,
                    max: 5000000,
                    mid: (500000 + 5000000) / 2,
                    normal: 3000000
                },
                {
                    name: 'Nhân sự',
                    min: 6000000,
                    max: 9000000,
                    mid: (900000 + 9000000) / 2,
                    normal: 4000000
                }
            ]

        }

    }).addTo(document.body);
```

> Có thể bỏ bớt mid và normal