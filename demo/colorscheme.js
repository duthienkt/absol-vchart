var DEFAULT_CHART_COLOR_SCHEMES =absol.Color.DEFAULT_CHART_COLOR_SCHEMES;


var generators = Array(20);
generators[0] = function (n) {

};

DEFAULT_CHART_COLOR_SCHEMES.forEach((colors, i)=>{
    colors = colors.map(c=>absol.Color.parse(c));

    var c = absol._({
        tag:'SelectColorSchemeMenu'.toLowerCase(),
        props: {
            value: i
        }
    }).addTo(document.body);

    console.log(c.items)

    vchart._({
        tag: 'linechart',
        props: {
            title: 'Colors '+ i,
            valueName: '$',
            keyName: 'Value',
            zeroOY: true,
            keys: colors.map(c=> c.toString('hex6')),
            lines: [
               /* {
                    name: 'Red',
                    values: colors.map(c=> c.rgba[0]),
                    // texts: texts,
                    color: 'red',
                    plotColors: colors.slice()
                },
                {
                    name: 'Green',
                    values: colors.map(c=> c.rgba[1]),
                    // texts: texts,
                    color: 'green',
                    plotColors: colors.slice()
                },
                {
                    name: 'Blue',
                    values: colors.map(c=> c.rgba[2]),
                    // texts: texts,
                    color: 'blue',
                    plotColors: colors.slice()
                },
*/
                {
                    name: 'Hue',
                    values: colors.map(c=> c.toHSLA()[0]),
                    // texts: texts,
                    color: 'cyan',
                    plotColors: colors.slice()
                },

                {
                    name: 'Sat',
                    values: colors.map(c=> c.toHSLA()[1]),
                    // texts: texts,
                    color: 'yellow',
                    plotColors: colors.slice()
                },

                {
                    name: 'Lig',
                    values: colors.map(c=> c.toHSLA()[2]),
                    // texts: texts,
                    color: 'orange',
                    plotColors: colors.slice()
                },
                // {
                //     name: 'Bri',
                //     values: colors.map(c=> c.toHSBA()[2]),
                //     // texts: texts,
                //     color: 'gray',
                //     plotColors: colors.slice()
                // },


            ]
        }
    }).addTo(document.body)
});