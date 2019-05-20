# VCHART

SVG chart, base on absol.js
-----------------------


## Linechart

[![Live-Demo](./doc/assets/linechart.PNG)](http://volcanion.cf/vchart/demo/linechart.html)

```js
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