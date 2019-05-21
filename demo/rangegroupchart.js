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

var y = vchart._({
    tag: 'rangegroupchart',
    style: { background: 'rgb(230, 230, 232)' },
    props: {
        title: 'Biểu đồ lương chức danh',
        valueName: 'lương',
        keyName: 'chức danh',
        canvasWidth: 1024,
        canvasHeight: 600,
        zeroOY: true,
        // maxSegment: 20,
        numberToString: vchart.lambda.toLocalString(0),
        maxText: 'Lương tối thiểu',
        minText: 'Lương tối thiểu',
        normalText: 'Lương thị trường',
        ranges: [

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

var z = vchart._({
    tag: 'rangegroupchart',
    style: { background: 'rgb(230, 230, 232)' },
    props: {
        title: 'Biểu đồ lương chức danh',
        valueName: 'lương',
        keyName: 'chức danh',
        canvasWidth: 1024,
        canvasHeight: 600,
        zeroOY: true,
        // maxSegment: 20,
        numberToString: vchart.lambda.toLocalString(0),
        maxText: 'Lương tối thiểu',
        minText: 'Lương tối thiểu',
        normalText: 'Lương thị trường',
        ranges: [

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
            },
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
            }


        ]

    }

}).addTo(document.body);