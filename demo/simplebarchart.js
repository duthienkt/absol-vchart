absol._({
    tag: 'simplebarchart',
    style: {
        width: '100%',
        height: '300px'
    },
    props: {
        colorScheme: 1,
        keys: ['Tháng giêng', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5',
            'Tháng 6'],
        values: [43, 12, 34, 33, 44, 55],
        texts: ["43", '12', '34', '33', "44", "123%"]
    }
}).addTo(document.body);

