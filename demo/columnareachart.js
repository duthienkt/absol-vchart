
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

    var d = vchart._({
        tag: 'columnareachart',
        style: { background: 'rgb(230, 230, 232)' },
        props: {
            title: 'Biểu đồ độ ẩm',
            valueName: '%',
            keyName: 'tháng',
            canvasWidth: 1200,
            canvasHeight: 600,
            zeroOY: true,
            rotateText: false,
            numberToString: vchart.lambda.toLocalString(1),
            keys: ['Tháng giêng', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5',
                'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng chạp'],
            values: Array(12).fill(0).map(function () {
                return 23 + 70 * Math.random();
            })
        }
    }).addTo(document.body);
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

    var b = vchart._({
        tag: 'columnchart',
        style: { background: 'rgb(230, 230, 232)' },
        props: {
            title: 'Biểu đồ độ ẩm',
            valueName: '%',
            keyName: 'tháng',
            canvasWidth: 1200,
            canvasHeight: 600,
            zeroOY: true,
            rotateText: false,
            numberToString: vchart.lambda.toLocalString(1),
            keys: ['Tháng giêng', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5',
                'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng chạp'],
            values: Array(12).fill(0).map(function () {
                return 23 + 70 * Math.random();
            })
        }
    }).addTo(document.body);