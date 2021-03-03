
export default function Diagram ({ real_time, statistics, coils, discrete }) {

   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width={750.696}
         height={452.367}
         viewBox="0 0 198.622 119.689"
       >
         <defs>
           <marker
             id="prefix__c"
             refX={0}
             refY={0}
             orient="auto"
             overflow="visible"
           >
             <path
               d="M-1.926-1.21L1.352-.005l-3.278 1.206a2.05 2.05 0 000-2.411z"
               fillRule="evenodd"
               stroke="#000"
               strokeWidth={0.1875}
               strokeLinejoin="round"
             />
           </marker>
           <marker
             orient="auto"
             refY={0}
             refX={0}
             id="prefix__b"
             overflow="visible"
           >
             <path
               d="M-1.926-1.21L1.352-.005l-3.278 1.206a2.05 2.05 0 000-2.411z"
               fillRule="evenodd"
               stroke="#000"
               strokeWidth={0.1875}
               strokeLinejoin="round"
             />
           </marker>
           <marker
             orient="auto"
             refY={0}
             refX={0}
             id="prefix__a"
             overflow="visible"
           >
             <path
               d="M-1.926-1.21L1.352-.005l-3.278 1.206a2.05 2.05 0 000-2.411z"
               fillRule="evenodd"
               stroke="#000"
               strokeWidth={0.1875}
               strokeLinejoin="round"
             />
           </marker>
         </defs>
         <path
           fill="#002"
           fillOpacity={0.651}
           stroke="#000"
           strokeLinejoin="bevel"
           strokeOpacity={0.711}
           d="M34.67 35.983h71.815v52.161H34.67z"
           transform="matrix(.31867 0 .12235 .31867 4.709 23.045)"
         />
         <path
           fill="#00f"
           stroke="#ff0"
           strokeWidth={3}
           strokeLinejoin="bevel"
           d="M43.089 26.458h71.815v52.161H43.089z"
           transform="matrix(.31867 0 .12235 .31867 4.709 23.045)"
         />
         <path
           d="M60.854 26.458V78.62M79.224 26.08v52.35M97.782 27.025V78.43M42.522 45.735h72.383M43.278 62.555h71.816"
           fill="none"
           stroke="#ff0"
           strokeWidth={3}
           transform="matrix(.31867 0 .12235 .31867 4.709 23.045)"
         />
         <g transform="translate(56.813 7.427) scale(.77114)">
           <path
             fill="#ccc"
             fillOpacity={0.651}
             stroke="#000"
             strokeWidth={1.561}
             strokeLinejoin="bevel"
             strokeOpacity={0.711}
             d="M45.124 31.887h36.425v19.881H45.124z"
           />
           <path fill="green" d="M50.129 47.319h22.384v2.224H50.129z" />
           <circle r={0.861} cy={40.65} cx={73.973} fill="#00f" />
           <circle cx={52.418} cy={37.426} r={1.039} fill="#0f0" />
           <circle r={1.039} cy={37.426} cx={55.593} fill="#0f0" />
         </g>
         <path
           d="M38.837 47.937h29.057"
           fill="none"
           stroke="#000"
           strokeWidth={3}
           markerEnd="url(#prefix__a)"
           transform="translate(14.737 -5.714)"
         />
         <path
           d="M108.687 47.937h29.057"
           fill="none"
           stroke="#000"
           strokeWidth={3}
           markerEnd="url(#prefix__b)"
           transform="translate(14.737 -5.714)"
         />
         <g transform="translate(14.737 1.165)" stroke="#000">
           <ellipse
             ry={7.149}
             rx={7.717}
             cy={33.777}
             cx={155.48}
             fill={coils.manual_control_load?"#ff0":"#fff"}
             strokeWidth={0.5}
             strokeLinejoin="bevel"
           />
           <path
             d="M155.456 26.776a7.358 7.358 0 00-7.35 7.358c.342 2.747 1.284 3.75 3.173 5.822l.835 1.088v8.797h6.244v-8.797l1.244-1.183c1.764-1.93 3.22-2.639 3.22-5.727a7.358 7.358 0 00-7.357-7.358z"
             fill="none"
             strokeWidth={2.124}
             strokeLinejoin="bevel"
           />
           <path
             d="M152.521 48.048l5.67-1.52M152.521 46.175l5.67-1.52M152.521 44.302l5.67-1.52M152.521 42.803l5.67-1.519"
             fill="none"
             strokeWidth={0.849}
           />
           <path
             d="M153.142 40.987l-1.749-6.526"
             fill="none"
             strokeWidth={0.265}
           />
           <path d="M157.64 40.984l1.904-6.52" fill="none" strokeWidth={0.276} />
           <path
             d="M151.393 34.46c.027.003.083.034.081.007-.009-.104-.219-.326-.236-.52-.044-.48.287-.98.732-1.158.167-.066.412-.076.59-.118.228-.052.238-.046.45.048.016.007.036.01.047.023.31.4.466.87.52 1.37.02.196.017.394.023.591.001.044-.018.342-.07.378-.206.137-.357-.17-.402-.307-.061-.183-.048-.22-.048-.402 0-.715.34-1.019.992-1.252.165-.059.395-.12.567-.07.199.056.396.177.473.377.09.232.282 1.408-.284 1.181-.137-.055-.148-.108-.236-.236-.048-.07-.111-.133-.142-.212a1.31 1.31 0 01.071-1.134c.052-.097.2-.156.284-.213.033-.022.058-.054.094-.07.111-.051.31-.066.425-.072.326-.017.174.011.426.095.045.015.099.002.141.024.222.11.484.565.591.78a.924.924 0 01.047.613c-.004.016.01.034 0 .048-.01.014-.032.014-.047.023-.135.081-.328.076-.425-.07-.375-.562-.296-.997.189-1.442.338-.31 1.216-.37 1.512.024.251.335.298 1.077.07 1.417-.015.024-.05.027-.07.048-.036.035-.056.085-.095.118-.012.01-.032-.004-.047 0-.028.007-.043.047-.071.047-.187 0-.213-.315-.26-.496-.193-.754.293-1.618 1.063-1.796.201-.046.669-.067.85.024.168.084.201.32.26.496.015.045-.007.095 0 .142.009.042.042.076.048.118.021.152.007.319.023.472.019.174.06.346.071.52.015.236-.007.475-.023.709a.351.351 0 01-.048.142c-.005.01-.024.034-.023.023.005-.096.025-.19.038-.286"
             fill="none"
             strokeWidth={0.265}
           />
         </g>
         <path
           d={statistics.net_battery_current<0?"M90.902 85.417v-29.057":"M90.902 56.36v29.057"}
           fill="none"
           stroke="#000"
           strokeWidth={3}
           markerEnd="url(#prefix__c)"
           transform="translate(14.737 -5.714)"
         />
         <text
           style={{
             lineHeight: 1.25,
           }}
           x={43.845}
           y={40.595}
           fontWeight={400}
           fontSize={9}
           fontFamily="Algerian"
           letterSpacing={0}
           wordSpacing={0}
           strokeWidth={0.265}
           transform="translate(14.737 -5.714)"
         >
            <tspan x={43.845} y={40.595}>
               { real_time.pv_power } W
            </tspan>
         </text>
         <text
           y={40.595}
           x={114.149}
           style={{
             lineHeight: 1.25,
           }}
           fontWeight={400}
           fontSize={9}
           fontFamily="Algerian"
           letterSpacing={0}
           wordSpacing={0}
           strokeWidth={0.265}
           transform="translate(14.737 -5.714)"
         >
            <tspan y={40.595} x={114.149}>
               { real_time.load_power } W
            </tspan>
         </text>
         <text
           style={{
             lineHeight: 1.25,
           }}
           x={101.298}
           y={74.159}
           fontWeight={400}
           fontSize={9}
           fontFamily="Algerian"
           letterSpacing={0}
           wordSpacing={0}
           strokeWidth={0.265}
           transform="translate(14.737 -5.714)"
         >
            <tspan x={101.298} y={74.159}>
               { trimNumber(statistics.net_battery_current < 0 ? Math.abs(real_time.battery_voltage * statistics.net_battery_current) : real_time.battery_charging_power) } W
            </tspan>
         </text>
         <g>
           <path
             fill="#999"
             stroke="#000"
             strokeWidth={0.26}
             strokeLinejoin="bevel"
             d="M90.61 88.739h30.088v17.699H90.61z"
           />
           <path
             stroke="#000"
             strokeWidth={0.4}
             strokeLinejoin="bevel"
             d="M91.815 85.48h2.422v3.103h-2.422z"
           />
           <path
             stroke="#000"
             strokeWidth={0.4}
             strokeLinejoin="bevel"
             d="M91.815 85.48h2.422v3.103h-2.422zM116.397 85.48h2.422v3.103h-2.422z"
           />
           <path
             fill="#fff"
             stroke="#000"
             strokeWidth={0.5}
             strokeLinejoin="bevel"
             d="M92.608 90.802h26.326v13.764H92.608z"
           />
           <path fill="#0f0" d={`M92.832 90.884h${real_time.battery_soc * .25897}v13.418H92.832z`} />
           <path
             fill="none"
             stroke="#000"
             strokeWidth={0.5}
             strokeLinejoin="bevel"
             d="M92.608 90.802h26.326v13.764H92.608z"
           />
         </g>
         { !discrete.day_night &&
            <g transform="matrix(.6832 0 0 .6832 26.148 1.212)">
            <circle r={7.918} cy={17.09} cx={23.788} fill="#ff0" />
            <path
               d="M10.067 17.09h4.158M33.35 17.09h4.158M23.788 3.37v4.158M23.788 26.653v4.158M33.49 7.388l-2.94 2.94M17.026 23.852l-2.94 2.94M33.49 26.792l-2.94-2.94M17.026 10.328l-2.94-2.94"
               fill="none"
               stroke="#ff0"
            />
            </g>
         }
         { discrete.day_night &&
            <g transform="matrix(.6832 0 0 .6832 26.148 1.212)">
               <circle cx={23.788} cy={17.09} r={7.918} fill="#ff0" />
               <path d="M21.304 24.609a7.918 7.918 0 01-5.208-9.395 7.918 7.918 0 018.949-5.941l-1.257 7.817z" />
            </g>
         }
      </svg>
   );
}

function trimNumber (n, places = 2) {
   if (n === 0) return "0";
   return n.toFixed(places).replace(/[.0]+$/, "");
}