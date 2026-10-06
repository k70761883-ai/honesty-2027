import{ad as F,j as e}from"./vendor-react-BwyGA0Mb.js";const v=F.memo(({icon:d,title:m,value:h,change:o,changeType:r,iconBgColor:u="bg-gray-700/50",iconColor:j="text-brand-text-primary",subtitle:l,colorVariant:g="default",valueClassName:p="",description:b,onClick:i,image:a,compactOnMobile:t=!1,iconBesideContentOnMobile:s=!1})=>{const x={blue:{iconBg:"bg-[#ECF2FF]",iconColor:"text-[#5D87FF]"},orange:{iconBg:"bg-[#FEF5E5]",iconColor:"text-[#FFAE1F]"},purple:{iconBg:"bg-[#E8F7FF]",iconColor:"text-[#49BEFF]"},pink:{iconBg:"bg-[#FDEDE8]",iconColor:"text-[#FA896B]"},green:{iconBg:"bg-[#E6FFFA]",iconColor:"text-[#13DEB9]"},red:{iconBg:"bg-[#FDEDE8]",iconColor:"text-[#FA896B]"},default:{iconBg:"bg-[#ECF2FF]",iconColor:"text-[#5D87FF]"}},c=x[g]||x.default,f=n=>e.jsxs("svg",{...n,xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17"}),e.jsx("polyline",{points:"16 7 22 7 22 13"})]}),w=n=>e.jsxs("svg",{...n,xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"22 17 13.5 8.5 8.5 13.5 2 7"}),e.jsx("polyline",{points:"16 17 22 17 22 11"})]});return e.jsx("div",{onClick:i,className:`
      relative
      ${t?"p-2 sm:p-6":"p-5 sm:p-6"}
      rounded-2xl
      bg-white
      border border-[#EAEFF4]
      shadow-[0_9px_17.5px_rgba(0,0,0,0.05)]
      hover:shadow-md
      transition-all duration-200 ease-out
      group
      h-full
      flex flex-col justify-between
      ${i?"cursor-pointer":""}
    `,children:e.jsxs("div",{className:`relative z-10 h-full flex ${s?"flex-row items-center gap-2 sm:flex-col sm:items-stretch sm:justify-between sm:gap-0":"flex-col justify-between"}`,children:[e.jsxs("div",{className:`flex items-start justify-between ${s?"mb-0 sm:mb-4":t?"mb-2 sm:mb-4":"mb-4"}`,children:[e.jsx("div",{className:`
            ${s?"w-8 h-8 sm:w-12 sm:h-12":t?"w-10 h-10 sm:w-12 sm:h-12":"w-11 h-11 sm:w-12 sm:h-12"}
            rounded-xl
            flex items-center justify-center 
            flex-shrink-0 
            ${c.iconBg} ${c.iconColor}
            group-hover:scale-105
            transition-transform duration-200
            overflow-hidden
          `,children:a?e.jsx("img",{src:a,alt:"",className:"w-full h-full object-cover"}):e.jsx("div",{className:"w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center",children:d})}),o&&e.jsxs("div",{className:`
              inline-flex items-center 
              text-[11px]
              font-bold
              gap-1
              px-2.5 py-1
              rounded-full
              flex-shrink-0
              ${r==="increase"?"bg-[#E6FFFA] text-[#13DEB9]":"bg-[#FDEDE8] text-[#FA896B]"}
            `,children:[r==="increase"?e.jsx(f,{className:"w-3 h-3"}):e.jsx(w,{className:"w-3 h-3"}),e.jsx("span",{children:o})]})]}),e.jsxs("div",{className:s?"min-w-0 flex-1 sm:flex-none":"",children:[e.jsx("p",{className:`
            text-xs
            text-[#5A6A85]
            font-semibold 
            uppercase
            tracking-wider
            mb-1
            leading-tight
          `,children:m}),e.jsx("p",{className:`
            text-xl sm:text-2xl
            font-extrabold 
            text-[#2A3547] 
            break-words
            tracking-tight
            leading-tight
            ${p}
          `,children:h}),l&&e.jsx("p",{className:`
              hidden sm:block
              text-xs 
              text-[#5A6A85]
              mt-1.5
              line-clamp-2
              leading-relaxed
              font-normal
            `,children:l})]})]})})});export{v as S};
