
var minA = Array(12).fill(0).map(function () {
    return Math.floor(Math.random() * 50) + 1;
});

var midA = minA.map(function (v) {
    return v + 10 + Math.floor(Math.random() * 50);
});
var maxA = midA.map(function (v) {
    return v + 10 + Math.floor(Math.random() * 50);
});
//
//
// var c = vchart._({
//     tag: 'columnareachart',
//     style: { border: 'solid 1px black' },
//     props: {
//         title: 'Biểu đồ độ ẩm',
//         valueName: '%',
//         keyName: 'tháng',
//         canvasWidth: 800,
//         canvasHeight: 600,
//         zeroOY: true,
//         rotateText: false,
//         showInlineValue: true,
//         columnWidth: 20,
//         numberToString: vchart.lambda.toLocalString(1),
//         keys: ['Tháng giêng', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5',
//             'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng chạp'],
//         values: Array(12).fill(0).map(function (u, i) {
//             return (i == 1 || i == 4 || i == 10) ? '-' : 23 + 70 * Math.random();
//         }),
//         colName: 'Mục tiêu',
//         areas: [
//             {
//                 name: 'Tối đa',
//                 values: Array(12).fill(0).map(function (u, i) {
//                     return (i == 1 || i == 4 || i == 10) ? '-' : 80 + 70 * Math.random();
//                 }),
//                 color: 'rgb(255, 204, 127)'
//             },
//             {
//                 name: 'Trung bình',
//                 values: Array(12).fill(0).map(function (u, i) {
//                     return (i == 1 || i == 4 || i == 10) ? '-' : 40 + 30 * Math.random();
//                 }),
//                 color: 'rgb(204, 204, 127)'
//             },
//             {
//                 name: 'Thấp',
//                 values: Array(12).fill(0).map(function (u, i) {
//                     return (i == 1 || i == 4 || i == 10) ? '-' : 4 + 30 * Math.random();
//
//                 }),
//                 color: 'rgb(231, 228, 227)'
//             }
//         ]
//     }
// }).addTo(document.body);
//
// var c = vchart._({
//     tag: 'columnareachart',
//     style: { border: 'solid 1px black' },
//     props: {
//         title: 'Biểu đồ độ ẩm',
//         valueName: '%',
//         keyName: 'tháng',
//         canvasWidth: 800,
//         canvasHeight: 600,
//         zeroOY: true,
//         rotateText: false,
//         showInlineValue: true,
//         columnWidth: 20,
//         numberToString: vchart.lambda.toLocalString(1),
//         keys: ['Tháng giêng', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5',
//             'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng chạp'],
//         values: Array(12).fill(0).map(function () {
//             return 23 + 70 * Math.random();
//         }),
//         colName: 'Mục tiêu',
//         areas: [
//             {
//                 name: 'Tối đa',
//                 values: maxA,
//                 color: 'rgb(255, 204, 127)'
//             },
//
//             {
//                 name: 'Trung bình',
//                 values: midA,
//                 color: 'rgb(204, 204, 127)'
//             },
//             {
//                 name: 'Thấp',
//                 values: minA,
//                 color: 'rgb(231, 228, 227)'
//             }
//         ]
//     }
// }).addTo(document.body);
//
// var d = vchart._({
//     tag: 'columnareachart',
//     props: {
//         title: 'Biểu đồ độ ẩm',
//         valueName: '%',
//         keyName: 'tháng',
//         canvasWidth: 1200,
//         canvasHeight: 600,
//         zeroOY: true,
//         rotateText: false,
//         numberToString: vchart.lambda.toLocalString(1),
//         keys: ['Tháng giêng', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5',
//             'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng chạp'],
//         values: Array(12).fill(0).map(function () {
//             return 23 + 70 * Math.random();
//         })
//     }
// }).addTo(document.body);
var a = vchart._({
    tag: 'columnchart',
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

var b = vchart._({
    tag: 'columnchart',
    props: {
        title: 'Biểu đồ độ ẩm',
        valueName: '%',
        keyName: 'tháng',
        canvasWidth: 1200,
        canvasHeight: 600,
        zeroOY: true,
        rotateText: false,
        numberToString: vchart.lambda.toLocalString(1),
        keys: ['T 1', 'T 2', 'T 3', 'T 4', 'T 5',
            'T 6', 'T 7', 'T 8', 'T 9', 'T 10', 'T11', 'T12'],
        values: Array(12).fill(0).map(function () {
            return 23 + 70 * Math.random();
        })
    }
}).addTo(document.body);
