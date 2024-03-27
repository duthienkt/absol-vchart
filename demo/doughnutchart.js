absol._({
    tag: 'doughnutchart',
    style: {
        width: '278px',
        height: '222.3px'
    },
    props: {
        colorScheme: 2,
        pieces: [
            {
                name: "Đạo phật",
                value: 5,
                valueText: "1.4%",
                // fillColor: {
                //     rgba: [
                //         0.75,
                //         0.25,
                //         0.25,
                //         1
                //     ]
                // }
            },
            {
                name: "Đạo thiên chúa",
                value: 9,
                valueText: "2.5%",
                // fillColor: {
                //     rgba: [
                //         0.25,
                //         0.25,
                //         0.75,
                //         1
                //     ]
                // }
            },
            {
                name: "Không",
                value: 343,
                valueText: "96.1%",
                // fillColor: {
                //     rgba: [
                //         0.25,
                //         0.75,
                //         0.25,
                //         1
                //     ]
                // }
            }
        ]
    }
}).addTo(document.body);


absol._({
    tag: 'doughnutchart',
    style: {
        width: '500px',
        height: '450px',
        verticalAlign: 'top',
        backgroundColor: 'gray'
    },
    props: {
        resizable: true,
        contentPadding: 0,
        pieces: [
            {
                name: 'IE',
                value: 12,
                valueText: '100%'
            }
        ]
    }
}).addTo(document.body);

absol._({
    tag: 'doughnutchart',
    style: {
        width: '40vw',
        height: '60vh',
        minWidth: '300px',
        minHeight: '300px'
    },
    props: {
        title: 'Browser',
        pieces: [
            {
                name: 'IE',
                value: 12,
                valueText: '12%',
                separated: true
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
absol._({
    tag: 'doughnutchart',
    style: {
        width: '40vw',
        height: '60vh',
        minWidth: '300px',
        minHeight: '500px'
    },
    props: {
        title: 'Browser',
        pieces: [
            {
                name: 'IE',
                value: 12,
                valueText: '12%',
            },
            {
                name: 'Firefox',
                value: 15,
                valueText: '15%',
                separated: true
            },
            {
                name: 'Other',
                value: 11,
                valueText: '11%',
                separated: true
            },
            {
                name: 'Chrome',
                value: 61,
                valueText: '61%'
            }
        ]
    }
}).addTo(document.body);

absol._({
    tag: 'doughnutchart',
    style: {
        width: '40vw',
        height: '60vh',
        minWidth: '300px',
        minHeight: '500px'
    },
    props: {
        title: 'Browser',
        pieces: [
            {
                name: 'IE',
                value: 0,
                valueText: '',
            },
            {
                name: 'Firefox',
                value: 0,
                valueText: '',
                separated: true
            },
            {
                name: 'Other',
                value: 0,
                valueText: '',
                separated: true
            },
            {
                name: 'Chrome',
                value: 61,
                valueText: '100%'
            }
        ]
    }
}).addTo(document.body);