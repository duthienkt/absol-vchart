var testChart = vchart._({
    tag:'svg',
    attr:{
        width: '1000px',
        height:'700px',
        viewBox:"0 0 1000 700"
    },
    style:{
        background:'rgb(200, 100, 100, 0.3)',
        width:'500px',
        height:'350px'
    },
    child: {
        tag:'hscrollbar',
        props:{
            width:500,
            height:20,
            innerWidth:9000,
            outterWidth:500
        }
    }
}).addTo(document.body);