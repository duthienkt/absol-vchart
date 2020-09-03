absol._({
    tag: 'piechart',
    style: {
        width: '80vw',
        height: '60vh',
    },
    props: {
        title: 'Browser',
        pieces: [
            {
                name: 'IE',
                value: 12,
                valueText: '12%'
            },
            {
                name: 'Firefox',
                value: 15,
                valueText: '15%'
            },
            {
                name: 'Other',
                value: 11,
                valueText: '11%'
            },
            {
                name: 'Chrome',
                value: 61,
                valueText: '61%'
            }
        ]
    }
}).addTo(document.body);