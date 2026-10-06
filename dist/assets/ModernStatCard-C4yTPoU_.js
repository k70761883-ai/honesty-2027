import{j as t,ad as b}from"./vendor-react-BR18iUFV.js";const o={primary:{bg:"bg-[#ECF2FF]",text:"text-[#5D87FF]",dot:"bg-[#5D87FF]"},secondary:{bg:"bg-[#E8F7FF]",text:"text-[#49BEFF]",dot:"bg-[#49BEFF]"},success:{bg:"bg-[#E6FFFA]",text:"text-[#13DEB9]",dot:"bg-[#13DEB9]"},warning:{bg:"bg-[#FEF5E5]",text:"text-[#FFAE1F]",dot:"bg-[#FFAE1F]"},error:{bg:"bg-[#FDEDE8]",text:"text-[#FA896B]",dot:"bg-[#FA896B]"},info:{bg:"bg-[#EBF3FE]",text:"text-[#539BFF]",dot:"bg-[#539BFF]"}},f={sm:"text-[9px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 font-semibold",md:"text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 font-semibold",lg:"text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1.5 font-bold"},d=({variant:x="primary",children:a,size:m="md",className:s="",dot:r=!1})=>{const e=o[x]||o.primary;return t.jsxs("span",{className:`
        inline-flex items-center gap-1.5
        rounded-full
        ${e.bg}
        ${e.text}
        ${f[m]}
        leading-tight
        whitespace-nowrap
        select-none
        ${s}
      `,children:[r&&t.jsx("span",{className:`w-1.5 h-1.5 rounded-full ${e.dot}`}),a]})},F={primary:"bg-[#ECF2FF] text-[#5D87FF]",secondary:"bg-[#E8F7FF] text-[#49BEFF]",success:"bg-[#E6FFFA] text-[#13DEB9]",warning:"bg-[#FEF5E5] text-[#FFAE1F]",error:"bg-[#FDEDE8] text-[#FA896B]"},h=({title:x,value:a,icon:m,subtitle:s,change:r,changeType:e="increase",iconColorVariant:c="primary",onClick:l,className:p="",valueClassName:g="",compactOnMobile:n=!1,badge:i})=>t.jsxs("div",{onClick:l,className:`
        relative
        bg-white
        rounded-xl sm:rounded-2xl
        border border-[#EAEFF4]
        p-2.5 sm:p-6
        shadow-[0_9px_17.5px_rgba(0,0,0,0.05)]
        hover:shadow-md
        transition-all duration-200
        ${l?"cursor-pointer":""}
        flex
        ${n?"flex-row items-center gap-2.5 sm:flex-col sm:items-stretch sm:justify-between sm:gap-0":"flex-col justify-between"}
        min-h-[90px] sm:min-h-0
        ${p}
      `,children:[t.jsxs("div",{className:`flex ${n?"items-center justify-start gap-0 mb-0 sm:items-start sm:justify-between sm:gap-2 sm:mb-4":"items-start justify-between gap-1.5 mb-2 sm:gap-2 sm:mb-4"}`,children:[t.jsx("div",{className:`
            w-7 h-7 sm:w-12 sm:h-12
            rounded-lg sm:rounded-xl
            flex items-center justify-center
            flex-shrink-0
            ${F[c]||F.primary}
            transition-transform duration-200
            hover:scale-105
          `,children:b.cloneElement(m,{className:"w-4 h-4 sm:w-6 sm:h-6"})}),r&&t.jsxs(d,{variant:e==="increase"?"success":"error",size:"sm",className:"text-[8px] sm:text-xs",children:[e==="increase"?"+":"-",r]}),i&&t.jsx(d,{variant:i.variant,size:"sm",className:"text-[8px] sm:text-xs",children:i.text})]}),t.jsxs("div",{className:n?"min-w-0 flex-1 sm:w-full sm:flex-none":"",children:[t.jsx("p",{className:"text-[8px] sm:text-xs font-semibold uppercase tracking-wider text-[#5A6A85] mb-0.5 sm:mb-1",children:x}),t.jsx("h4",{className:`text-xs sm:text-2xl font-extrabold text-[#2A3547] tracking-tight leading-tight tabular-nums ${g}`,children:a}),s&&t.jsx("p",{className:"hidden sm:block text-xs text-[#5A6A85] mt-1 leading-relaxed font-normal",children:s})]})]});export{h as M};
