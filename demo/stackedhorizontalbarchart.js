var props = {
    keys:[
        "Nguyễn Văn A",
        "Nguyễn Văn B",
        "Nguyễn Văn C"
    ],
    series:[
        {
            name:'Chưa bắt đầu',
            values: [10, 20, 300],
        },
        {
            name: 'Đang làm',
            values: [20, 30, 40],
        },
        {
            name: "Hoàn thành",
            values: [30, 40, 50],
        },
        {
            name:'Quá hạn',
            values: [5, 10, 15],
        }
    ],
    title: 'Tổng hợp lượng công việc theo trạng thái',
};
absol._({
    tag: 'StackedHorizontalBarChart'.toLocaleLowerCase(),
    style:{
        resizable: true,
      width:'100%',//or px, vw
        //height: auto as default
    },
    props: props,
}).addTo(document.body);