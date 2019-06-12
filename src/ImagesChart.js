import Vcore from "./VCore";

var _ = Vcore._;
var $ = Vcore.$;

Vcore.creator.salaryimgchart = function () {
    return _(
        `<svg width="560" height="320" version="1.1" viewBox="0 0 148.17 84.667" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
         <defs>
          <marker id="Arrow1Send" overflow="visible" orient="auto">
           <path transform="scale(.2) rotate(180) translate(6)" d="m0 0 5-5-17.5 5 17.5 5-5-5z" fill-rule="evenodd" stroke="#000" stroke-width="1pt"/>
          </marker>
          <marker id="Arrow1Sstart" overflow="visible" orient="auto">
           <path transform="scale(.2) translate(6)" d="m0 0 5-5-17.5 5 17.5 5-5-5z" fill-rule="evenodd" stroke="#000" stroke-width="1pt"/>
          </marker>
          <marker id="Arrow2Mend" overflow="visible" orient="auto">
           <path transform="scale(-.6)" d="m8.7186 4.0337-10.926-4.0177 10.926-4.0177c-1.7455 2.3721-1.7354 5.6175-6e-7 8.0354z" fill-rule="evenodd" stroke="#000" stroke-linejoin="round" stroke-width=".625"/>
          </marker>
          <marker id="Arrow2Mstart" overflow="visible" orient="auto">
           <path transform="scale(.6)" d="m8.7186 4.0337-10.926-4.0177 10.926-4.0177c-1.7455 2.3721-1.7354 5.6175-6e-7 8.0354z" fill-rule="evenodd" stroke="#000" stroke-linejoin="round" stroke-width=".625"/>
          </marker>
         </defs>
         <metadata>
          <rdf:RDF>
           <cc:Work rdf:about="">
            <dc:format>image/svg+xml</dc:format>
            <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>
            <dc:title/>
           </cc:Work>
          </rdf:RDF>
         </metadata>
         <g transform="translate(0 -212.33)">
          <path d="m5.6025 293.55h139.25" fill="none" stroke="#4472c4" stroke-width=".26458px"/>
          <g fill="#7bc0f7">
           <rect x="19.777" y="274.63" width="10.583" height="18.899" fill-opacity=".99497"/>
           <g>
            <rect x="46.235" y="255.73" width="10.583" height="37.798"/>
            <rect x="72.693" y="243.26" width="10.583" height="50.271"/>
            <rect x="99.152" y="235.32" width="10.583" height="58.208"/>
            <rect x="125.61" y="230.03" width="10.583" height="63.5"/>
           </g>
          </g>
          <g fill="#ffcc7f">
           <rect x="19.777" y="270.85" width="10.583" height="3.7798"/>
           <rect x="46.235" y="248.74" width="10.583" height="7.5595"/>
           <rect x="72.693" y="233.07" width="10.583" height="10.186"/>
           <rect x="99.152" y="223.68" width="10.583" height="11.642"/>
           <rect x="125.61" y="217.33" width="10.583" height="12.7"/>
          </g>
          <g fill="none" stroke="#000">
           <path d="m19.777 274.63h-10.583" stroke-dasharray="0.79374995, 0.26458332" stroke-width=".26458"/>
           <path d="m125.61 230.34h-116.42" stroke-dasharray="0.79374995, 0.26458332" stroke-width=".26458"/>
           <path d="m9.1933 231.09v43.384" marker-end="url(#Arrow2Mend)" marker-start="url(#Arrow2Mstart)" stroke-width=".26458px"/>
          </g>
          <text transform="rotate(-90)" x="-266.33362" y="7.562871" fill="#000000" font-family="sans-serif" font-size="10.583px" letter-spacing="0px" stroke-width=".26458" word-spacing="0px" style="line-height:1.25" xml:space="preserve"><tspan x="-266.33362" y="7.562871" font-size="2.4694px" stroke-width=".26458">Khoảng cách lương</tspan></text>
          <path d="m19.155 235.39h79.928" fill="none" stroke="#000" stroke-dasharray="0.79374994, 0.26458332" stroke-width=".26458"/>
          <path d="m18.966 234.78v-3.6392" fill="none" marker-end="url(#Arrow1Send)" marker-start="url(#Arrow1Sstart)" stroke="#000" stroke-width=".26458px"/>
          <text transform="rotate(-90)" x="-263.28491" y="15.464068" fill="#000000" font-family="sans-serif" font-size="10.583px" letter-spacing="0px" stroke-width=".26458" word-spacing="0px" style="line-height:1.25" xml:space="preserve"><tspan x="-263.28491" y="15.464068" font-size="2.4694px" stroke-width=".26458">Khoảng cách bậc tối thiểu</tspan></text>
         </g>
        </svg>
         `
    )
};