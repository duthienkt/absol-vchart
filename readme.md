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

## CurveChart

[![Live-Demo](./doc/assets/curvechart.PNG)](http://volcanion.cf/vchart/demo/curvechart.html)

```js
var results = Array(12).fill(0).map(function () {
    return 23 + Math.floor(600 * Math.random());
});
var results1 = Array(12).fill(0).map(function () {
    return 23 + Math.floor(600 * Math.random());
});
vchart._({
    tag: 'curvechart',
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

## AssessmentChart

[![Live-Demo](./doc/assets/assessmentchart.PNG)](http://volcanion.cf/vchart/demo/assessmentchart.html)

```js

var x = vchart._({
    tag: 'assessmentchart',
    style: { background: 'rgb(230, 230, 232)' },
    props: {
        simpleMode:true,
        title: 'Programming skill',
        canvasWidth: 700,
        canvasHeight: 600,
        levels: ['0.0', '1.0', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0', '8.0', '9.0', '10.0'],
        keys: ['C/C++', 'Javascript', 'Matlab', 'CSS', 'C#', 'R', 'Python', 'ASM', 'Pascal'],
        ranges: [
            [4, 7],
            [5, 7],
            [6, 8],
            [4, 5],
            [6, 9],
            [3, 5],
            [1, 4],
            [4, 7],
            [7, 9]
        ],
        areas: [
            {
                name: 'FirstYear',
                values: [5, 0.5, 3.5, 2, 2, 3, 0.7, 8.2, 7]
            }
        ]
    }

}).addTo(document.body);

var a = vchart._({
    extendEvent: 'contextmenu',
    tag: 'assessmentchart',
    style: { background: 'rgb(230, 230, 232)' },
    props: {
        title: 'Programming skill',
        canvasWidth: 900,
        canvasHeight: 900,
        levels: ['0.0', '1.0', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0', '8.0', '9.0', '10.0'],
        keys: ['C/C++', 'Javascript', 'Matlab', 'CSS', 'C#', 'R', 'Python', 'ASM'],
        areas: [
            {
                name: 'FirstYear',
                values: [5, 0, 3, 2, 2, 3, 0, 0]
            },
            {
                name: 'ThirdYear',
                values: [6, 2, 4, 3, 6, 1, 3, 3]

            },
            {
                name: 'FifthtYear',
                values: [8, 5, 5, 6, 5, 1, 4, 2]
            },
            {
                name: 'FinalYear',
                values: [7, 9, 3, 8, 5, 0, 3, 0]
            }
        ],
         numberToString: vchart.lambda.toLocalString(0)

    }
    , on: chartEventHandlers
}).addTo(document.body);
```

## ColumnChart, ColumnAreaChart

[![Live-Demo](./doc/assets/columnchart.PNG)](http://volcanion.cf/vchart/demo/columnareachart.html)

```js
var a = vchart._({
        tag: 'columnchart',
        style: { background: 'rgb(230, 230, 232)' },
        props: {
            title: 'Biểu đồ độ ẩm',
            valueName: '%',
            keyName: 'tháng',
            canvasWidth: 800,
            canvasHeight: 600,
            zeroOY: true,
            rotateText: false,
            showInlineValue: true,
            columnWidth: 40,
            numberToString: vchart.lambda.toLocalString(1),
            keys: ['Tháng giêng', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5',
                'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng chạp'],
            values: Array(12).fill(0).map(function () {
                return 23 + 70 * Math.random();
            })
        }
    }).addTo(document.body);

```

[![Live-Demo](./doc/assets/columnareachart.PNG)](http://volcanion.cf/vchart/demo/columnareachart.html)

```js
 var minA = Array(12).fill(0).map(function () {
        return Math.floor(Math.random() * 50) + 1;
    });

    var midA = minA.map(function (v) {
        return v + 10 + Math.floor(Math.random() * 50);
    });
    var maxA = midA.map(function (v) {
        return v + 10 + Math.floor(Math.random() * 50);
    });


    var c = vchart._({
        tag: 'columnareachart',
        style: { border: 'solid 1px black' },
        props: {
            title: 'Biểu đồ độ ẩm',
            valueName: '%',
            keyName: 'tháng',
            canvasWidth: 800,
            canvasHeight: 600,
            zeroOY: true,
            rotateText: false,
            showInlineValue: true,
            columnWidth: 20,
            numberToString: vchart.lambda.toLocalString(1),
            keys: ['Tháng giêng', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5',
                'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng chạp'],
            values: Array(12).fill(0).map(function () {
                return 23 + 70 * Math.random();
            }),
            colName: 'Mục tiêu',
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
    }).addTo(document.body);
```

## RangeGroupChart

[![Live-Demo](./doc/assets/rangegroupchart.PNG)](http://volcanion.cf/vchart/demo/rangegroupchart.html)

```js
var x = vchart._({
    tag: 'rangegroupchart',
    style: { background: 'rgb(230, 230, 232)' },
    props: {
        title: 'Biểu đồ lương chức danh',
        valueName: 'lương',
        keyName: 'chức danh',
        canvasWidth: 900,
        canvasHeight: 600,
        zeroOY: true,
        // maxSegment: 20,
        numberToString: vchart.lambda.toLocalString(0),
        maxText: 'Lương tối thiểu',
        minText: 'Lương tối thiểu',
        normalText: 'Lương thị trường',
        ranges: [
            {
                name: 'Giám đốc',
                min: 15000000,
                max: 25000000,
                normal: 19000000,
                members: [
                    {
                        name: 'Lê Hoàng Nhật Trí',
                        value: 19000000
                    },
                    {
                        name: 'Đào Công Cường',
                        value: 21000000
                    },
                    {
                        name: 'Đào Duy Mạnh',
                        value: 17000000
                    }
                ]
            },
            {
                name: 'Trưởng phòng',
                min: 11000000,
                max: 19000000,
                normal: 20000000,
                members: [
                    {
                        name: 'Võ Văn Toàn Phong',
                        value: 12000000
                    },
                    {
                        name: 'Huỳnh Bá Lộc',
                        value: 14000000
                    },
                    {
                        name: 'Hàn Bá Đa',
                        value: 17000000
                    }
                ]
            },
            {
                name: 'Trưởng phòng',
                min: 9000000,
                max: 18000000,
                normal: 18500000,
                members: [
                    {
                        name: "Đinh Văn Biết",
                        value: 9000000
                    },
                    {
                        name: 'Nguyễn Văn Mạnh',
                        value: 10000000
                    },
                    {
                        name: 'Nguyễn Hoàng Kim Trâm',
                        value: 9800000
                    }
                ]
            }

        ]

    }

}).addTo(document.body);

```