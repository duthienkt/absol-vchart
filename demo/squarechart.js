
var y = vchart._({
    tag: 'squarechart',
    props: {
        canvasHeight: 400,
        canvasWidth: 500,
        title: 'Tương quan hệ số lương',
        valueName: 'Lương',
        keyName: 'Chức danh',
        keys: ['Tạp vụ', 'Nhân viên', 'Trưởng phòng', 'Giám đốc'],
        static: { y0: 0.1, k: 7 },
        dynamic: { y0: 0.1, k: 2 },

    }
}).addTo(document.body);