absol._({
    tag:'a',
    attr:{
        href:location.href.replace('.html', '.js'),
        target:'_blank'
    },
    child:{
        tag:'h3',
        child: {text:"Code mẫu"}
    }
}).addTo(document.body);
/////////// EXAMPLE  /////////////////////////

var t = absol._({
    tag:'mappingbarchart',
    style:{
        width:'50vw',
        height:'50vh'
    },
    props:{
        title: 'Đồ thị ánh xạ',
        sourceValues:[0, 0,5e6,9e6, 33e6, 55e6],
        destValues:[0, 0,3e6,12e6, 40e6, 70e6],
    }
});


var t1= absol._({
    tag:'sparklinechart',
    style:{
        width:'50vw',
        height:'50vh'
    },
    props:{
        title: 'Đồ thị ánh xạ',

        values:Array(100).fill(0).map((u, i)=>Math.sin(i/10)*50+50),
    }
});
//////////////////////

setTimeout(()=>{
    t.addTo(document.body);
    t1.addTo(document.body);

}, 1000);
