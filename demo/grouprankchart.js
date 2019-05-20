var y = vchart._({
    tag: 'grouprankchart',
    style: { background: 'rgb(230, 230, 232)' },
    props: {
        title: 'Biểu đồ lương nhóm chức danh',
        valueName: 'lương',
        canvasWidth: 'auto',
        canvasHeight: 600,
        zeroOY: true,
        valueName: 'lương(VND)',
        numberToString: vchart.lambda.toLocalString(0),
        groups: [
            {
                name: 'Nhóm trưởng phòng',
                members: [
                    {
                        name: "Trưởng phòng tài chính",
                        value: 17000000
                    },
                    {
                        name: 'Trưởng phòng kinh doanh',
                        value: 13000000
                    },
                    {
                        name: "Trưởng phòng nhân sự",
                        value: 11000000
                    },
                    {
                        name: 'Trưởng phòng kế toán',
                        value: 12500000
                    },

                ]
            },
            {
                name: "hỏi nhiều quá",
                members: [
                    {
                        name: 'Giám đốc',
                        value: 20000000
                    },
                    {
                        name: 'Phó giám đốc',
                        value: 17000000
                    },
                    {
                        name: 'Giám đốc kĩ thuật',
                        value: 15000000
                    },
                    {
                        name: 'Giám đốc tài chính',
                        value: 21000000
                    }

                ]
            }
        ]
    }

}).addTo(document.body);

var x = vchart._({
    tag: 'grouprankchart',
    style: { background: 'rgb(230, 230, 232)' },
    props: {
        title: 'Biểu đồ lương nhóm chức danh',
        valueName: 'lương',
        canvasWidth: 900,
        canvasHeight: 600,
        zeroOY: true,
        valueName: 'lương(VND)',
        numberToString: vchart.lambda.toLocalString(0),
        groups: [
            {
                name: 'Nhóm trưởng phòng',
                members: [
                    {
                        name: "Trưởng phòng tài chính",
                        value: 17000000
                    },
                    {
                        name: 'Trưởng phòng kinh doanh',
                        value: 13000000
                    },
                    {
                        name: "Trưởng phòng nhân sự",
                        value: 11000000
                    },
                    {
                        name: 'Trưởng phòng kế toán',
                        value: 12500000
                    },

                ]
            },
            {
                name: "hỏi nhiều quá",
                members: [
                    {
                        name: 'Giám đốc',
                        value: 20000000
                    },
                    {
                        name: 'Phó giám đốc',
                        value: 17000000
                    },
                    {
                        name: 'Giám đốc kĩ thuật',
                        value: 15000000
                    },
                    {
                        name: 'Giám đốc tài chính',
                        value: 21000000
                    }

                ]
            }
        ]
    }

}).addTo(document.body);

var x = vchart._({
    tag: 'grouprankchart',
    style: { background: 'rgba(230, 230, 232, 0.2)' },
    props: {
        title: 'Biểu đồ lương nhóm chức danh',
        valueName: 'lương',
        canvasWidth: 900,
        canvasHeight: 600,
        zeroOY: true,
        valueName: 'lương(VND)',
        keyName :"Chức danh",
        numberToString: vchart.lambda.toLocalString(0),
        groups: [
            {
                name: 'Nhóm trưởng phòng',
                members: [
                    {
                        name: "Trưởng phòng tài chính",
                        value: 17000000
                    },
                    {
                        name: 'Trưởng phòng kinh doanh',
                        value: 13000000
                    },
                    {
                        name: "Trưởng phòng nhân sự",
                        value: 11000000
                    },
                    {
                        name: 'Trưởng phòng kế toán',
                        value: 12500000
                    },
                    {
                        name: 'Trưởng phòng',
                        value: 0
                    }

                ]
            },
            {
                name: "hỏi nhiều quá",
                members: [
                    {
                        name: 'Giám đốc',
                        value: 20000000
                    },
                    {
                        name: 'Phó giám đốc',
                        value: 17000000
                    },
                    {
                        name: 'Giám đốc kĩ thuật',
                        value: 15000000
                    },
                    {
                        name: 'Giám đốc tài chính',
                        value: 21000000
                    }

                ]
            },
            {
                name: 'Nhóm phó phòng',
                members: [
                    {
                        name: "Trưởng phòng tài chính",
                        value: 14000000
                    },
                    {
                        name: 'Trưởng phòng kinh doanh',
                        value: 11000000
                    },
                    {
                        name: "Trưởng phòng nhân sự",
                        value: 8000000
                    },
                    {
                        name: 'Trưởng phòng kế toán',
                        value: 5500000
                    },

                ]
            }
        ]
    }

}).addTo(document.body);

x.sync.then(function () {
    x.canvasWidth = x.canvasWidth + x.overflowOX;
    x.update();
});