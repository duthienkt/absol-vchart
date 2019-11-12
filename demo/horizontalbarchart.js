var skillChartProps = {
    canvasWidth: 'auto',
    canvasHeight: 'auto',
    keys: ['Bạn', 'Quản lý', 'Cấp trên', 'Đồng nghiệp', 'Cấp dưới', 'Khách hàng', 'Mọi người'],
    bars: [4.2, 2.3, 4.5, 4.4, 3.6, 2.5, 4.3],
    title: 'Mô tả năng lực ABC',
    includeValues:[0, 5],
    ranges: [
        [3.7, 4.5],
        [1.5, 2.9],
        [3.3, 4.8],
        [4.3, 4.5],
        [2.2, 4.3],
        [1.1, 3.3],
        [4, 5]
    ],
    vLines: [
        {
            value: 1.5,
            color: 'red',
            name:"Chưa đạt yêu cầu"
        },
        {
            color: 'blue',
            value: 3.5,
            name:"Đạt yêu cầu"

        }
    ]
};

vchart._({
    tag: 'horizontalbarchart',
    style:{
        width:'80vw',
        height:'80vh'
    }, 
    props: skillChartProps
}).addTo(document.body);