absol._({
    tag: 'barstackchart',
    style: {
        width: '80vw',
        height: 'calc(100vh - 100px)',
        'box-shadow': '0px 0px 0px 1px rgba(0,0,0,0.75)'
    },
    props: {
        resizable: true,
        title: 'App Conversions',
        blocks: [
            {
                name: 'Visit',
                value: 100
            },
            {
                name: 'Sign-up',
                value: 75
            },
            {
                name: 'Purchase',
                value: 55
            },
            {
                name: "Review",
                value: 22
            }
        ]
    }
}).addTo(document.body);