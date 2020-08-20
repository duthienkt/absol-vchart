

var x = vchart.wrapChartInWHResizer(vchart._({
    tag: 'assessmentchart',
    extendEvent: 'contextmenu',
    props: {
        simpleMode: true,
        title: 'Programming skill',
        canvasWidth: 700,
        canvasHeight: 600,
        levels: ['', '1.0', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0', '8.0', '9.0', '10.0'],
        keys: ['C/C++', 'Javascript', 'Matlab', 'CSS', 'C#', 'R', 'Python', 'ASM', 'Pascal - basic programming language'],
        axisWeight: [1, 2, 3, 4, 1, 2, 7, 3, 4, 2, 5],
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
        rangeFillColor: 'orange',
        rangeMaxStrokeColor: 'lightgreen',
        rangeMinStrokeColor: 'ligthred',
        
        areas: [
            {
                name: 'FirstYear',
                values: [5, 0, 3, 2, 2, 3, 0, 0],
                color:'red'
            },
            {
                name: 'ThirdYear',
                values: [6, 2, 4, 3, 6, 1, 3, 3],
                color:'green'

            },
            {
                name: 'FifthtYear',
                values: [8, 5, 5, 6, 5, 1, 4, 2],
                color:'blue',

            },
            {
                name: 'FinalYear',
                values: [7, 9, 3, 8, 5, 0, 3, 0],
                color:'violet'
            }
        ]
    }

})).addTo(document.body);

var a = vchart._({
    extendEvent: 'contextmenu',
    tag: 'assessmentchart',

    props: {
        title: 'Programming skill',
        canvasWidth: 900,
        canvasHeight: 900,
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
                color:'red'
            },
            {
                name: 'ThirdYear',
                values: [6, 2, 4, 3, 6, 1, 3, 3, 3].map(div2),
                color:'green'
            },
            {
                name: 'FifthtYear',
                values: [8, 5, 5, 6, 5, 1, 4, 2, 2].map(div2),

                color:'blue'

            },
            {
                name: 'FinalYear',
                values: [7, 9, 3, 8, 5, 0, 3, 0, 2].map(div2),
                color:'yellow'

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
