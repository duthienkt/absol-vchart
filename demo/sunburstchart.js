var x = vchart._({
    tag: 'sunburstchart',
    props: {
        // title: 'absol js code analysis',
        canvasWidth: 900,
        canvasHeight: 600,
        zeroOY: true,
        numberToString: vchart.lambda.toLocalString(3),
        root: {
            name: 'Năng lực cốt lõi',
            value: 22,
            child: [{
                fillColor: 'rgb(115, 90, 145)',
                name: 'Năng lực chuyên môn nghiệp vụ',
                value: 7,
                child: [
                    { name: 'Nhân sự', value: 1 },
                    { name: 'Tài chính', value: 1 },
                    { name: 'Phạm vi, tác động', value: 1 },
                    { name: 'MMTB, CNKT', value: 1 },
                    { name: 'Năng lực ra quyết định', value: 1 },
                    { name: 'Tổ chức điều hành', value: 1 },
                    { name: 'Đàm phán', value: 1}
                ]
            },
            {
                fillColor: 'rgb(159, 175, 91)',
                name: 'Năng lực chung',
                value: 7,
                child: [
                    { name: 'Tổng hợp', value: 1 },
                    { name: 'Báo cáo', value: 1 },
                    { name: 'Thu thập thông tin', value: 1 },
                    { name: 'Làm việc nhóm', value: 1 },
                    { name: 'Giao tiếp', value: 1 },
                    { name: 'Ngoại ngữ', value: 1 },
                    { name: 'Vi tính văn phòng', value: 1 }
                ]
            },
            { name: 'Ra quyết định', value: 1, fillColor: 'auto', span: 2 },
            { name: 'Kiểm tra giám sát', value: 1, fillColor: 'auto', span: 2 },
            { name: 'Tổ chức', value: 1, fillColor: 'auto', span: 2 },
            { name: 'Hoạch định', value: 1, fillColor: 'auto', span: 2 },
            {
                fillColor: 'rgb(71, 116, 170)',
                name: 'Năng lực lãnh đạo',
                value: 4,
                child: [
                    { name: 'Định hướng hiệu quả', value: 1 },
                    { name: 'Tạo động lực nhân viên', value: 3 },
                ]
            }
            ]
        }
    }

}).addTo(document.body);