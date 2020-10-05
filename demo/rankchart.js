
var y = vchart._({
    tag: 'rankchart',
    props: {
        title: 'Biểu đồ bậc lương',
        canvasWidth: 'auto',
        canvasHeight: 600,
        zeroOY: true,
        valueName: 'lương(VND)',
        numberToString: vchart.lambda.toLocalString(0),
        positions: [
            {
                name: 'Giám đốc',
                ranks: [13000000, 15000000, 16500000, 17700000, 19000000, 20900000, 21000000, 21500000]
            },
            {
                name: 'Trưởng phòng tài chính',
                ranks: [15000000, 17000000, 17500000, 18500000, 19700000, 20000000, 21000000, 21500000, 21700000]
            },
            {
                name: 'Trưởng phòng nhân sự',
                ranks: [13000000, 14000000, 15500000, 16500000, 17700000, 18000000, 19000000, 20500000, 21700000]
            },
            {
                name: 'Trưởng phòng kế toán',
                ranks: [11000000, 11200000, 13500000, 14100000, 15000000, 16100000, 17000000, 18500000, 19700000
                    , 20000000, 21000000, 22000000, 22500000, 23500000]
            }
        ]
    }
}).addTo(document.body);
var x = vchart._({
    tag: 'rankchart',
    props: {
        title: 'Biểu đồ  bậc lương',
        valueName: 'lương',
        canvasWidth: 1200,
        canvasHeight: 600,
        zeroOY: true,
        valueName: 'lương(VND)',
        keyName: 'chức danh',
        numberToString: vchart.lambda.toLocalString(0),
        positions: [
            {
                name: 'Giám đốc',
                ranks: [13000000, 15000000, 16500000, 17700000, 19000000, 20900000, 21000000, 21500000]
            },
            {
                name: 'Trưởng phòng tài chính',
                ranks: [15000000, 17000000, 17500000, 18500000, 19700000, 20000000, 21000000, 21500000, 21700000]
            },
            {
                name: 'Trưởng phòng nhân sự',
                ranks: [13000000, 14000000, 15500000, 16500000, 17700000, 18000000, 19000000, 20500000, 21700000]
            },
            {
                name: 'Trưởng phòng kế toán',
                ranks: [11000000, 11200000, 13500000, 14100000, 15000000, 16100000, 17000000, 18500000, 19700000]
            }

        ]
    }


}).addTo(document.body);
