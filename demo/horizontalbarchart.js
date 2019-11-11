var skillChartProps = {
    canvasWidth: 900,
    canvasHeight: 600,
    keys: ['Bạn', 'Quản lý', 'Cấp trên', 'Đồng nghiệp', 'Cấp dưới', 'Khách hàng', 'Mọi người'],
    bars: [4.2, 2.3, 4.5, 4.4, 3.6, 2.5, 4.3],
    title:'Mô tả năng lực ABC',
    ranges:[
        [3.7, 4.5],
        [1.5, 2.9],
        [3.3, 4.8],
        [4.3, 4.5],
        [2.2, 4.3],
        [1.1, 3.3],
        [4, 5]
    ]
};

vchart._({
    tag: 'horizontalbarchart',
    props: skillChartProps

}).addTo(document.body);