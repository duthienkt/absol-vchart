var $ = absol.$;
var _ = absol._;
_({
    tag: 'VerticalChart'.toLowerCase(),
    style: {
        width: '80vw',
        height: '80vh',
        backgroundColor: 'rgb(250, 250, 250)'
    },
    props: {
        title: "Nhiệt độ theo tháng",
        keys: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
    }
}).addTo(document.body);