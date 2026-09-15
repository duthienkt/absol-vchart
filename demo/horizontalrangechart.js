var ctn = absol._({
    style: {
        marginTop: '8vh',
        width: '90vw',
        height: '90vh',
        overflow: 'auto'
    }
}).addTo(document.body);

var ranges = [
    {
        name: "T?ng Giám d?c",
        min: 63136000,
        max: 82077000,
        mid: 72607000,
        normal: 5000000
    },
    {
        name: "Tru?ng Phòng PTSP",
        min: 30436000,
        max: 39567000,
        mid: 35001000,
        normal: 2000000
    },
    {
        name: "Tru?ng phòng NC",
        min: 26088000,
        max: 33915000,
        mid: 30002000,
        normal: 0
    },
    {
        name: "K? Toán Tru?ng",
        min: 24633000,
        max: 32022000,
        mid: 28328000,
        normal: 10000000
    },
    {
        name: "P.GÐKD – Cung ?ng s?n xu?t",
        min: 24099000,
        max: 31328000,
        mid: 27714000,
        normal: 0
    },
    {
        name: "Phó Phòng PTSP",
        min: 22480000,
        max: 29225000,
        mid: 25852000,
        normal: 0
    },
    {
        name: "Giám d?c chi nhánh",
        min: 21703000,
        max: 28214000,
        mid: 24958000,
        normal: 0
    },
    {
        name: "Chuyên viên CSKH",
        min: 20561000,
        max: 28868000,
        mid: 24715000,
        normal: 6000000
    },
    {
        name: "Qu?ng Bá Co Ð?ng",
        min: 19401000,
        max: 25221000,
        mid: 22311000,
        normal: 0
    },
    {
        name: "Phó Giám Ð?c QHKH",
        min: 19130000,
        max: 24870000,
        mid: 22000000,
        normal: 0
    },
    {
        name: "Chuyen vien S?n xu?t, KCS",
        min: 18579000,
        max: 24152000,
        mid: 21365000,
        normal: 0
    },
    {
        name: "P.GÐKD – Bán hàng",
        min: 17976000,
        max: 23369000,
        mid: 20673000,
        normal: 0
    },
    {
        name: "Phó phòng NC",
        min: 17705000,
        max: 23017000,
        mid: 20361000,
        normal: 0
    },
    {
        name: "xxx",
        min: 17042000,
        max: 22155000,
        mid: 19599000,
        normal: 0
    },
    {
        name: "Phó Giám d?c chi nhánh",
        min: 16400000,
        max: 21320000,
        mid: 18860000,
        normal: 0
    },
    {
        name: "Chuyên viên NC Hóa-PT",
        min: 16105000,
        max: 20936000,
        mid: 18520000,
        normal: 0
    },
    {
        name: "Chuyên viên KT nhà lu?i",
        min: 16090000,
        max: 20917000,
        mid: 18504000,
        normal: 0
    },
    {
        name: "Qu?ng Bá Chi Nhánh",
        min: 14914000,
        max: 19389000,
        mid: 17152000,
        normal: 0
    },
    {
        name: "Chuyên viên NC Thu?c-PB",
        min: 14699000,
        max: 19109000,
        mid: 16904000,
        normal: 0
    },
    {
        name: "Chuyên viên Media",
        min: 13221000,
        max: 17187000,
        mid: 15204000,
        normal: 0
    },
    {
        name: "K? toán T?ng H?p ",
        min: 13217000,
        max: 17182000,
        mid: 15199000,
        normal: 0
    },
    {
        name: "Chuyên viên dang ký",
        min: 13109000,
        max: 17041000,
        mid: 15075000,
        normal: 0
    },
    {
        name: "Nhân viên Marketing, PTSP",
        min: 12780000,
        max: 16615000,
        mid: 14697000,
        normal: 0
    },
    {
        name: "Ki?m soát viên K? toán ",
        min: 12706000,
        max: 16518000,
        mid: 14612000,
        normal: 0
    },
    {
        name: "Nhân viên bán hàng",
        min: 12385000,
        max: 16100000,
        mid: 14243000,
        normal: 0
    },
    {
        name: "Chuyên viên Mô Hình",
        min: 12359000,
        max: 16066000,
        mid: 14212000,
        normal: 0
    },
    {
        name: "Chuyên viên Trình Di?n",
        min: 12359000,
        max: 16066000,
        mid: 14212000,
        normal: 0
    },
    {
        name: "Nhân viên bán hàng CN",
        min: 12339000,
        max: 16040000,
        mid: 14189000,
        normal: 0
    },
    {
        name: "K? ho?ch t?ng h?p",
        min: 12136000,
        max: 15777000,
        mid: 13957000,
        normal: 0
    },
    {
        name: "Công n? ph?i thu",
        min: 11815000,
        max: 15359000,
        mid: 13587000,
        normal: 0
    },
    {
        name: "Nhân viên CSKH",
        min: 11460000,
        max: 14898000,
        mid: 13179000,
        normal: 0
    },
    {
        name: "Nhân viên kế toán công nợ phải trả",
        min: 11003000,
        max: 14304000,
        mid: 12654000,
        normal: 0
    },
    {
        name: "Cung ?ng, thi?t k?",
        min: 10684000,
        max: 13889000,
        mid: 12287000,
        normal: 0
    },
    {
        name: "Thủ kho chi nhánh",
        min: 10266000,
        max: 13346000,
        mid: 11806000,
        normal: 0
    },
    {
        name: "Nhân viên K? toán Giá thành",
        min: 10142000,
        max: 13185000,
        mid: 11664000,
        normal: 0
    },
    {
        name: "Nhân viên kế toán ngân hàng",
        min: 9592000,
        max: 12469000,
        mid: 11030000,
        normal: 0
    },
    {
        name: "Nhân viên PR",
        min: 9548000,
        max: 12412000,
        mid: 10980000,
        normal: 0
    },
    {
        name: "Quản lý văn phòng",
        min: 9487000,
        max: 12333000,
        mid: 10910000,
        normal: 0
    },
    {
        name: "Chuyên viên nhân s?",
        min: 9358000,
        max: 12165000,
        mid: 10761000,
        normal: 0
    },
    {
        name: "Thủ quỹ",
        min: 8889000,
        max: 11556000,
        mid: 10222000,
        normal: 0
    },
    {
        name: "Nhân viên bốc xếp",
        min: 8840000,
        max: 11492000,
        mid: 10166000,
        normal: 0
    },
    {
        name: "Kế toán chi nhánh",
        min: 8713000,
        max: 11327000,
        mid: 10020000,
        normal: 0
    },
    {
        name: "Nhân viên NC Hóa-PT",
        min: 8691000,
        max: 11298000,
        mid: 9995000,
        normal: 0
    },
    {
        name: "Lái xe tải",
        min: 8574000,
        max: 11146000,
        mid: 9860000,
        normal: 0
    },
    {
        name: "Xuất nhập, điều chuyển kho",
        min: 8455000,
        max: 10992000,
        mid: 9723000,
        normal: 0
    },
    {
        name: "Nhân viên KT nhà lưới",
        min: 8081000,
        max: 10506000,
        mid: 9294000,
        normal: 0
    },
    {
        name: "Nhân viên nhân sự",
        min: 7969000,
        max: 10360000,
        mid: 9165000,
        normal: 0
    },
    {
        name: "Nhân viên tiền lương",
        min: 7933000,
        max: 10314000,
        mid: 9124000,
        normal: 0
    },
    {
        name: "Nhân viên kế toán công nợ phải thu",
        min: 7877000,
        max: 10240000,
        mid: 9059000,
        normal: 0
    },
    {
        name: "Nhân viên web",
        min: 7781000,
        max: 10116000,
        mid: 8948000,
        normal: 0
    },
    {
        name: "Nhân viên kế toán tải sản cố định",
        min: 7463000,
        max: 9703000,
        mid: 8583000,
        normal: 0
    },
    {
        name: "Nhân viên kế toán tiền mặt",
        min: 7463000,
        max: 9703000,
        mid: 8583000,
        normal: 0
    },
    {
        name: "Lái xe con",
        min: 7284000,
        max: 9469000,
        mid: 8377000,
        normal: 0
    },
    {
        name: "Van thu, tổng dài",
        min: 6471000,
        max: 8413000,
        mid: 7442000,
        normal: 0
    },
    {
        name: "Thủ kho",
        min: 5353000,
        max: 6959000,
        mid: 6156000,
        normal: 0
    },
    {
        name: "Nhân viên bảo vệ 2",
        min: 4956000,
        max: 6443000,
        mid: 5700000,
        normal: 0
    },
    {
        name: "Nhân viên bảo vệ 1",
        min: 4537000,
        max: 5898000,
        mid: 5218000,
        normal: 0
    },
    {
        name: "Nhân viên tạp vụ",
        min: 3531000,
        max: 4590000,
        mid: 4060000,
        normal: 0
    }
]

var y = vchart._({
    tag: 'horizontalrangechart',
    style: {
        width: '900px',
        height: 'auto'
    },
    props: {
        resizable: true,
        title: 'Biểu đồ lương chức danh',
        valueName: 'lương',
        keyName: 'chức danh',
        zeroOY: false,
        numberToString: vchart.lambda.toLocalString(0),
        maxText: 'Lương tối đa',
        minText: 'Lương tối thiểu',
        midText: 'Lương ở giữa',
        normalText: 'Lương thị trường',
        ranges: ranges,
        ranges1: [
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
                max: 10e6,
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
}).addTo(ctn);
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