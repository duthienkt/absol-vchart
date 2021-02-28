var x = vchart._({
    tag: 'assessmentchart',
    extendEvent: 'contextmenu',
    props: {
        simpleMode: true,
        title: 'Đồ thị năng lực cá nhân',
        canvasWidth: 700,
        canvasHeight: 600,
        resizable: true,
        levels: [0, 20, 40, 60, 80, 100, 120],
        axisWeight: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2],
        keys: ["Kỹ năng sử dụng vi tính văn phòng", "Kỹ năng sử dụng ngoại ngữ", "Kỹ năng giao tiếp",
            "Kỹ năng đàm phán, thương lượng", "Phân tích, tổng hợp, báo cáo", "Năng lực bán hàng",
            "Kỹ năng nhân sự chung", "Kỹ năng hoạch định", "Kỹ năng tổ chức công việc", "Kỹ năng giải quyết vấn đề",
            "Kỹ năng kiểm tra, giám sát"],
        ranges: [[100, 100], [75, 100], [100, 100], [100, 100], [91, 100], [73, 100], [78, 100], [100, 100], [100, 100], [100, 100], [100, 100]],
        rangeFillColor: 'orange',
        rangeMaxStrokeColor: 'lightgreen',
        rangeMinStrokeColor: 'ligthred',
        areas: [{
            "name": "Yêu cầu tối thiểu",
            "values": [100, 75, 100, 100, 91, 73, 78, 100, 100, 100, 100],
            "strokeWidth": 1,
        }, {
            "name": "Yêu cầu tối đa",
            "values": [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            "strokeWidth": 1,
        }, {
            "name": "Trần Thị Tú Nga",
            "values": [100, 100, 102, 103, 100, 105, 100, 100, 100, 100, 100],
        }]
    }

}).addTo(document.body);

var a = vchart._({
    extendEvent: 'contextmenu',
    tag: 'assessmentchart',
    style: {
        width: 'calc(100vw - 100px)',
        height: '80vh',
        minWidth: '500px',
        minHeight: '500px'
    },
    props: {
        title: 'Programming skill',
        resizable: true,
        levels: ['0.0', '1.0', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0', '8.0', '9.0', '10.0'],
        keys: ['C/C++', 'Javascript', 'Matlab', 'CSS', 'C#', 'R', 'Python', 'ASM'],
        areas: [
            {
                name: 'FirstYear',
                values: [5, 0, 3, 2, 2, 3, 0, 0],
                strokeWidth: 5
            },
            {
                name: 'ThirdYear',
                values: [6, 2, 4, 3, 6, 1, 3, 3],
                strokeWidth: 2


            },
            {
                name: 'FifthtYear',
                values: [8, 5, 5, 6, 5, 1, 4, 2],
                strokeWidth: 1

            },
            {
                name: 'FinalYear',
                values: [7, 9, 3, 8, 5, 0, 3, 0],
                strokeWidth: 7
            }
        ]//,
        // numberToString: vchart.lambda.toLocalString(0)

    }


}).addTo(document.body);
var b = vchart._({
    extendEvent: 'contextmenu',
    tag: 'assessmentchart',

    props: {
        title: 'Programming skill',
        canvasWidth: 300,
        canvasHeight: 400,
        levels: ['0.0', '1.0', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0', '8.0', '9.0', '10.0'],
        keys: ['C/C++', 'Javascript', 'Matlab', 'CSS', 'C#', 'R', 'Python', 'ASM', 'Pascal'],
        areas: [
            {
                name: 'FirstYear',
                values: [5, 0, 3, 2, 2, 3, 0, 0, 7]
            },
            {
                name: 'ThirdYear',
                values: [6, 2, 4, 3, 6, 1, 3, 3, 3]

            },
            {
                name: 'FifthtYear',
                values: [8, 5, 5, 6, 5, 1, 4, 2, 2]
            },
            {
                name: 'FinalYear',
                values: [7, 9, 3, 8, 5, 0, 3, 0, 2]
            }
        ]//,
        // numberToString: vchart.lambda.toLocalString(0)

    }


}).addTo(document.body);

var y = vchart._({
    extendEvent: 'contextmenu',
    tag: 'assessmentchart',

    props: {
        title: 'Programming skill',
        canvasWidth: 400,
        canvasHeight: 400,
        levels: ['0.0', '1.0', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0', '8.0', '9.0', '10.0'],
        keys: ['C/C++', 'Javascript', 'Matlab', 'CSS', 'C#', 'R', 'Python', 'ASM', 'Pascal'],
        areas: [
            {
                name: 'FirstYear',
                values: [5, 0, 3, 2, 2, 3, 0, 0, 7],
                strokeWidth: 5
            },
            {
                name: 'ThirdYear',
                values: [6, 2, 4, 3, 6, 1, 3, 3, 3]

            },
            {
                name: 'FifthtYear',
                values: [8, 5, 5, 6, 5, 1, 4, 2, 2]
            },
            {
                name: 'FinalYear',
                values: [7, 9, 3, 8, 5, 0, 3, 0, 2]
            }
        ]//,
        // numberToString: vchart.lambda.toLocalString(0)

    }


}).addTo(document.body);

var z = vchart._({
    extendEvent: 'contextmenu',
    tag: 'assessmentchart',

    props: {
        title: 'Programming skill',
        canvasWidth: 300,
        canvasHeight: 500,
        levels: ['0.0', '1.0', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0', '8.0', '9.0', '10.0'],
        keys: ['C/C++', 'Javascript', 'Matlab', 'CSS', 'C#', 'R', 'Python', 'ASM', 'Pascal'],
        areas: [
            {
                name: 'FirstYear',
                values: [5, 0, 3, 2, 2, 3, 0, 0, 7]
            },
            {
                name: 'ThirdYear',
                values: [6, 2, 4, 3, 6, 1, 3, 3, 3]

            },
            {
                name: 'FifthtYear',
                values: [8, 5, 5, 6, 5, 1, 4, 2, 2]
            },
            {
                name: 'FinalYear',
                values: [7, 9, 3, 8, 5, 0, 3, 0, 2]
            }
        ]//,
        // numberToString: vchart.lambda.toLocalString(0)

    }


}).addTo(document.body);
var t = vchart._({
    extendEvent: 'contextmenu',
    tag: 'assessmentchart',
    style: { width: '600px', height: '750px' },
    props: {
        title: 'Programming skill(scale 1.5)',
        canvasWidth: 400,
        canvasHeight: 500,
        levels: ['0.0', '1.0', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0', '8.0', '9.0', '10.0'],
        keys: ['C/C++', 'Javascript', 'Matlab', 'CSS', 'C#', 'R', 'Python', 'ASM', 'Pascal'],
        areas: [
            {
                name: 'FirstYear',
                values: [5, 0, 3, 2, 2, 3, 0, 0, 7]
            },
            {
                name: 'ThirdYear',
                values: [6, 2, 4, 3, 6, 1, 3, 3, 3]

            },
            {
                name: 'FifthtYear',
                values: [8, 5, 5, 6, 5, 1, 4, 2, 2]
            },
            {
                name: 'FinalYear',
                values: [7, 9, 3, 8, 5, 0, 3, 0, 2]
            }
        ]//,
        // numberToString: vchart.lambda.toLocalString(0)

    }


}).addTo(document.body);
var m = vchart._({
    extendEvent: 'contextmenu',
    tag: 'assessmentchart',

    props: {
        title: 'Programming skill',
        canvasWidth: 400,
        canvasHeight: 500,
        levels: ['0.0', '1.0', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0', '8.0', '9.0', '10.0'],
        keys: ['C/C++', 'Javascript', 'Matlab', 'CSS', 'C#', 'R', 'Python', 'ASM', 'Pascal'],
        areas: [
            {
                name: 'FirstYear',
                values: [5, 0, 3, 2, 2, 3, 0, 0, 7]
            },
            {
                name: 'ThirdYear',
                values: [6, 2, 4, 3, 6, 1, 3, 3, 3]

            },
            {
                name: 'FifthtYear',
                values: [8, 5, 5, 6, 5, 1, 4, 2, 2]
            },
            {
                name: 'FinalYear',
                values: [7, 9, 3, 8, 5, 0, 3, 0, 2]
            }
        ]//,
        // numberToString: vchart.lambda.toLocalString(0)
    }


}).addTo(document.body);

function div2(x) {
    return x / 2;
}

var m = vchart._({
    extendEvent: 'contextmenu',
    tag: 'assessmentchart',

    props: {
        title: 'Programming skill',
        canvasWidth: 500,
        canvasHeight: 800,
        levels: ['0.0', '1.0', 'Đậu', '3.0', '4.0', 'Xuất sắc'],
        keys: ['C/C++', 'Javascript', 'Matlab', 'CSS', 'C#', 'R', 'Python', 'ASM', 'Pascal'],
        areas: [
            {
                name: 'FirstYear',
                values: [5, 0, 3, 2, 2, 3, 0, 0, 7].map(div2),
                color: 'red'
            },
            {
                name: 'ThirdYear',
                values: [6, 2, 4, 3, 6, 1, 3, 3, 3].map(div2),
                color: 'green'
            },
            {
                name: 'FifthtYear',
                values: [8, 5, 5, 6, 5, 1, 4, 2, 2].map(div2),

                color: 'blue'

            },
            {
                name: 'FinalYear',
                values: [7, 9, 3, 8, 5, 0, 3, 0, 2].map(div2),
                color: 'yellow'

            }
        ]//,
        // numberToString: vchart.lambda.toLocalString(0)
    }

}).addTo(document.body);

var m = vchart._({
    extendEvent: 'contextmenu',
    tag: 'assessmentchart',

    props: {
        title: 'Programming skill',
        canvasWidth: 1300,
        canvasHeight: 800,
        levels: ['0.0', '1.0', 'Đậu', '3.0', '4.0', 'Xuất sắc'],
        keys: ['C/C++', 'Javascript', 'Matlab', 'CSS', 'C#', 'R', 'Python', 'ASM', 'Pascal'],
        areas: [
            {
                name: 'FirstYear',
                values: [5, 0, 3, 2, 2, 3, 0, 0, 7].map(div2)
            },
            {
                name: 'ThirdYear',
                values: [6, 2, 4, 3, 6, 1, 3, 3, 3].map(div2)

            },
            {
                name: 'FifthtYear',
                values: [8, 5, 5, 6, 5, 1, 4, 2, 2].map(div2)
            },
            {
                name: 'FinalYear',
                values: [7, 9, 3, 8, 5, 0, 3, 0, 2].map(div2)
            }
        ]//,
        // numberToString: vchart.lambda.toLocalString(0)
    }
}).addTo(document.body);
