import{j as e}from"./vendor-react-BwyGA0Mb.js";import{M as c}from"./index-CAZdTYQ7.js";const p=({isOpen:s,onClose:t,icon:i,title:l,value:d,subtitle:o,description:a,colorVariant:x="default",children:n})=>{const r={blue:{gradient:"from-blue-500/20 via-indigo-500/15 to-cyan-400/10",iconBg:"bg-blue-500/30",iconColor:"text-blue-200",textColor:"text-blue-600"},orange:{gradient:"from-orange-500/20 via-amber-500/15 to-yellow-400/10",iconBg:"bg-orange-500/30",iconColor:"text-orange-200",textColor:"text-orange-600"},purple:{gradient:"from-purple-500/20 via-violet-500/15 to-fuchsia-400/10",iconBg:"bg-purple-500/30",iconColor:"text-purple-200",textColor:"text-purple-600"},pink:{gradient:"from-pink-500/20 via-rose-500/15 to-red-400/10",iconBg:"bg-pink-500/30",iconColor:"text-pink-200",textColor:"text-pink-600"},green:{gradient:"from-green-500/20 via-emerald-500/15 to-teal-400/10",iconBg:"bg-green-500/30",iconColor:"text-green-200",textColor:"text-green-600"},default:{gradient:"from-white/15 via-white/10 to-white/5",iconBg:"bg-gray-700/50",iconColor:"text-brand-text-primary",textColor:"text-brand-accent"}}[x];return e.jsx(c,{isOpen:s,onClose:t,title:l,size:"lg",children:e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:`
          relative
          p-3.5 sm:p-6
          rounded-xl sm:rounded-2xl
          bg-gradient-to-br ${r.gradient}
          border border-brand-border
          backdrop-blur-xl
          overflow-hidden
        `,children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-white/5 via-white/3 to-transparent"}),e.jsxs("div",{className:"relative z-10 flex items-center gap-3 sm:gap-4",children:[e.jsx("div",{className:`
              w-10 h-10 sm:w-16 sm:h-16
              rounded-xl sm:rounded-2xl
              flex items-center justify-center
              ${r.iconBg} ${r.iconColor}
              shadow-md sm:shadow-lg
              backdrop-blur-md
              border border-white/10
              flex-shrink-0
            `,children:e.jsx("div",{className:"w-5 h-5 sm:w-8 sm:h-8",children:i})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("p",{className:`
                text-xl sm:text-4xl font-bold
                ${r.textColor}
                mb-0.5 sm:mb-1
                truncate
                tabular-nums
              `,children:d}),o&&e.jsx("p",{className:"text-[11px] sm:text-sm text-brand-text-secondary",children:o})]})]})]}),a&&e.jsxs("div",{className:"bg-brand-bg p-4 rounded-xl border border-brand-border",children:[e.jsx("h4",{className:"font-semibold text-brand-text-light mb-2",children:"Deskripsi"}),e.jsx("p",{className:"text-sm text-brand-text-secondary leading-relaxed whitespace-pre-line",children:a})]}),n&&e.jsx("div",{children:n}),e.jsx("div",{className:"flex justify-end pt-4 border-t border-brand-border",children:e.jsx("button",{onClick:t,className:"button-secondary",children:"Tutup"})})]})})};export{p as S};
