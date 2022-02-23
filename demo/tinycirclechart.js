absol._({
    tag: 'tinycirclechart',
    style: {
        width: '250px',
        height: '100px',
        border: '1px solid black'
    },
    props: {
        total: 34,
        arcs: [
            { name: '$value hoàn thành', value: 8 },
            { name: '$value quá hạn', value: 1 },
            { name: '$value đang thực hiện', value: 1 }
        ]
    }
}).addTo(document.body);


absol._({
    tag: 'tinycirclechart',
    style: {
        width: '250px',
        height: '100px',
        border: '1px solid black'
    },
    props: {
        //total will be calculated automatically
        arcs: [
            { name: '$value hoàn thành', value: 8 },
            { name: '$value quá hạn', value: 1 },
            { name: '$value đang thực hiện', value: 1 }
        ]
    }
}).addTo(document.body);


absol._({
    tag: 'tinycirclechart',
    style: {
        width: '600px',
        height: '200px',
        border: '1px solid black'
    },
    props: {
        total: 4,
        arcs: [
            { name: '$value hoàn thành', value: 2 },
            { name: '$value quá hạn', value: 1 },
            { name: '$value đang thực hiện', value: 1 }
        ]
    }
}).addTo(document.body);

absol._({
    tag: 'tinycirclechart',
    style: {
        width: '50vw',
        height: '50vh',
        border: '1px solid black',
        maxWidth: '500px',
        maxHeight: '500px'
    },
    props: {
        total: 4,
        arcs: [
            { name: '$value hoàn thành', value: 2 },
            { name: '$value quá hạn', value: 1 },
            { name: '$value đang thực hiện', value: 1 }
        ]
    }
}).addTo(document.body);