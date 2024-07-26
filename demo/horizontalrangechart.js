var y = vchart._({
    tag: 'horizontalrangechart',
    style: {
        width: '900px',
        height: 'auto'
    },
    props: {
        debug: true,
        resizable: true,
        title: 'Biểu đồ lương chức danh',
        valueName: 'lương',
        keyName: 'chức danh',
        zeroOY: true,
        numberToString: vchart.lambda.toLocalString(0),
        maxText: 'Lương tối đa',
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
                mid: 5000000,
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
                mid: (9000000 + 6000000) / 2,
                normal: 4000000
            },
            {
                name: "Chăm sóc khách hàng",
                min: 3e6,
                max: 5e6,
                mid: 3.5e6,
                normal: 3.5e6

            }
        ]

    }

}).addTo(document.body);
/*
var x = vchart._({
    tag: 'rangechart',
    props: {
        title: 'Biểu đồ không có median',
        valueName: 'lương',
        canvasWidth: 700,
        canvasHeight: 600,
        zeroOY: true,
        maxText: 'Lương tối thiểu',
        minText: 'Lương tối thiểu',
        midText: 'Lương ở giữa',
        normalText: 'Lương thị trường',

        ranges: [
            {
                name: 'Giám đốc',
                min: 3000000,
                max: 5000000,
                normal: 4000000
            },
            {
                name: 'Trưởng phòng tài chính',
                min: 4000000,
                max: 7500000,
                normal: 8000000
            },
            {
                name: 'Trưởng phòng kế hoạch',
                min: 2100000,
                max: 7900000,
                normal: 7000000
            },
            {
                name: 'Kế toán',
                min: 2500000,
                max: 5000000,
                normal: 3000000
            },
            {
                name: 'Nhân sự',
                min: 6000000,
                max: 9000000,
                normal: 4000000
            }
        ]

    }

}).addTo(document.body);

var z = vchart._({
    tag: 'rangechart',
    props: {
        title: 'Biểu đồ không có normal',
        valueName: 'lương',
        canvasWidth: 1000,
        canvasHeight: 600,
        zeroOY: true,
        maxText: 'Lương tối thiểu',
        minText: 'Lương tối thiểu',
        midText: 'Lương ở giữa',
        normalText: 'Lương thị trường',

        ranges: [
            {
                name: 'Giám đốc',
                min: 3000000,
                max: 5000000,
                mid: 3500000
            },
            {
                name: 'Trưởng phòng tài chính',
                min: 4000000,
                max: 7500000,
                mid: 10000000
            },
            {
                name: 'Trưởng phòng kế hoạch',
                min: 2100000,
                max: 7900000,
                mid: 6000000
            },
            {
                name: 'Kế toán',
                min: 2500000,
                max: 5000000,
                mid: (500000 + 5000000) / 2
            },
            {
                name: 'Nhân sự',
                min: 6000000,
                max: 9000000,
                mid: (900000 + 9000000) / 2
            }
        ]

    }

}).addTo(document.body);


var t = vchart._({
    tag: 'rangechart',
    props: {
        title: 'Biểu đồ chỉ có min max',
        valueName: 'lương',
        canvasWidth: 700,
        canvasHeight: 900,
        zeroOY: true,
        maxText: 'Lương tối thiểu',
        minText: 'Lương tối thiểu',
        midText: 'Lương ở giữa',
        normalText: 'Lương thị trường',

        ranges: [
            {
                name: 'Giám đốc',
                min: 3000000,
                max: 5000000
            },
            {
                name: 'Trưởng phòng tài chính',
                min: 4000000,
                max: 7500000
            },
            {
                name: 'Trưởng phòng kế hoạch',
                min: 2100000,
                max: 7900000
            },
            {
                name: 'Kế toán',
                min: 2500000,
                max: 5000000
            },
            {
                name: 'Nhân sự',
                min: 6000000,
                max: 9000000
            }
        ]

    }

}).addTo(document.body);

var u = vchart._({
    tag: 'rangechart',
    style: { 'border-radius': '10px' },
    props: {
        title: 'Biểu đồ chỉ có min max (giá trị trong đồ thị)',
        valueName: 'lương',
        canvasWidth: 1024,
        canvasHeight: 600,
        zeroOY: true,
        showInlineValue: true,
        maxText: 'Lương tối thiểu',
        minText: 'Lương tối thiểu',
        midText: 'Lương ở giữa',
        normalText: 'Lương thị trường',
        ranges: [
            {
                name: 'Giám đốc',
                min: 3000000,
                max: 5000000
            },
            {
                name: 'Trưởng phòng tài chính',
                min: 4000000,
                max: 7500000
            },
            {
                name: 'Trưởng phòng kế hoạch',
                min: 2100000,
                max: 7900000
            },
            {
                name: 'Kế toán',
                min: 2500000,
                max: 5000000
            },
            {
                name: 'Nhân sự',
                min: 3000000,
                max: 9000000
            }
        ]

    }

}).addTo(document.body);*/