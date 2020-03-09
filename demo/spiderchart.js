vchart._({
    tag: 'spiderchart',
    style: {
        width: '50vw',
        height: '50vh'
    },

    props: {
        title: {
            text: "Programming skills"
        },
        axis: {
            oyAxises: [
                {
                    name: 'C++',
                    weight: 3
                },
                {
                    name: 'Java',
                    weight: 2
                },
                {
                    name: 'Javascript',
                    weight: 3
                }
            ]
        },
        objects: [
            {
                type: 'polyline',
                name: "1st year",
                values: [3, 2, 3],
                stroke: 'red',
                fill: 'rgba(2550, 0, 0, 0.3)'
            },
            {
                type: 'polygon',
                name: "2nd year",
                values: [2, 4, 3],
                stroke: 'blue',
                fill: 'rgba(0, 0, 255, 0.3)'
            }
        ]
    }

}).addTo(document.body)