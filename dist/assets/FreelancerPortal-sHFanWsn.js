const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/vendor-html2pdf-Ce4p5aKT.js","assets/vendor-react-BR18iUFV.js","assets/vendor-html2canvas-npP2JtOW.js"])))=>i.map(i=>d[i]);
import{_ as $}from"./vendor-supabase-eAJN3mNY.js";import{b as m,j as t,ad as z}from"./vendor-react-BR18iUFV.js";import{bm as R,M as A,a2 as H,a7 as U}from"./index-xNNPTZG_.js";import{H as O}from"./HelpBox-DnsyQXB3.js";import{P as S}from"./PaymentSlipDocument-DyVjdPnS.js";import"./vendor-react-dom-CuRLrbG3.js";import"./vendor-others-DVr0KorU.js";import"./vendor-react-query-DVs5Qpeh.js";(()=>{try{return CSS&&CSS.supports&&CSS.supports("selector(body:has(.x))")}catch{return!1}})();const Y=(()=>{try{const n=navigator.userAgent.toLowerCase();return!n.includes("mobile")&&(n.includes("chrome")||n.includes("firefox")||n.includes("safari"))}catch{return!1}})(),_=({areaId:n,label:i="Cetak",title:p,showPreview:u=!1,directPrint:l=!1,...d})=>{m.useEffect(()=>{const s=()=>{document.body.classList.add("printing")},e=()=>{document.body.classList.remove("printing"),document.documentElement.style.removeProperty("--fit-scale")};return window.addEventListener("beforeprint",s),window.addEventListener("afterprint",e),()=>{window.removeEventListener("beforeprint",s),window.removeEventListener("afterprint",e),document.body.classList.remove("printing"),document.documentElement.style.removeProperty("--fit-scale")}},[n]);const c=m.useCallback(()=>{try{document.body.classList.add("printing"),window.print()}finally{setTimeout(()=>document.body.classList.remove("printing"),300)}},[]),h=m.useCallback(s=>{try{const e=document.createElement("iframe");e.style.position="absolute",e.style.left="-9999px",e.style.top="0",e.style.width="1px",e.style.height="1px",e.style.border="none",e.setAttribute("sandbox","allow-same-origin allow-scripts allow-modals allow-popups"),document.body.appendChild(e);const r=e.contentDocument||e.contentWindow?.document;if(!r){c();return}const a=s.cloneNode(!0);a.querySelectorAll(".non-printable, button, .button-primary, .button-secondary").forEach(x=>x.remove());const b=`
        @page { 
          size: A4 portrait; 
          margin: 2cm 2.5cm;
        }
        
        :root {
          --fit-scale: scale(1);
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-sizing: border-box !important;
        }
        
        html, body { 
          font-family: 'Manrope', sans-serif !important;
          line-height: 1.15 !important;
          color: #000 !important;
          background: #fff !important;
          margin: 0 !important;
          padding: 0 !important;
          font-size: 12pt !important;
          width: 100% !important;
          height: auto !important;
        }
        
        .page-canvas {
          width: 160mm;
          height: 257mm;
          overflow: hidden;
          margin: 0 auto;
          position: relative;
        }

        #fitWrapper {
          width: 160mm;
          margin: 0 auto;
          transform-origin: top left !important;
        }
        
        #fitWrapper[data-fit-scale="true"] {
          transform: var(--fit-scale) !important;
        }
        
        .printable-content { 
          max-width: 100% !important;
          width: 100% !important;
          box-shadow: none !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
          background: white !important;
          overflow: visible !important;
        }
        
        /* ==========================================================================
           ENHANCED DOCUMENT STYLING - INVOICE, RECEIPT, CONTRACT, BUKTI PEMBAYARAN
           ========================================================================== */
        
        /* ===== INVOICE STYLING - DYNAMIC NO BACKGROUND ===== */
        .print-invoice {
          font-family: 'Manrope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
          background: transparent !important;
          color: #1e293b !important;
          line-height: 1.5 !important;
          font-size: 12pt !important;
        }
        
        .print-invoice .max-w-4xl {
          max-width: none !important;
          margin: 0 !important;
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
          width: 100% !important;
        }
        
        .print-invoice header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          margin-bottom: 18pt !important;
          border-bottom: none !important;
          padding: 0 !important;
        }
        
        .print-invoice header img {
          height: 32pt !important;
          max-width: 32pt !important;
          object-fit: contain !important;
          margin-bottom: 6pt !important;
          border-radius: 4pt !important;
        }
        
        .print-invoice .printable-bg-blue {
          background: #3b82f6 !important;
          color: #ffffff !important;
          padding: 16pt !important;
          border-radius: 6pt !important;
          margin: 16pt 0 !important;
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* Grid alignment for info sections and footer */
        .print-invoice .doc-header-grid {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 24pt !important;
          align-items: start !important;
        }
        
        .print-invoice .doc-footer-flex {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 32pt !important;
          align-items: start !important;
        }
        
        .print-invoice .invoice-totals {
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-end !important;
        }
        
        .print-invoice .invoice-totals .flex {
          width: 180pt !important;
          min-width: 180pt !important;
        }
        
        /* Add colon and bold styling for totals */
        .print-invoice .invoice-totals span:first-child {
          font-weight: 600 !important;
          color: #0f172a !important;
          position: relative !important;
          padding-right: 8pt !important;
        }
        
        .print-invoice .invoice-totals span:first-child::after {
          content: " :" !important;
          color: #94a3b8 !important;
          font-weight: 700 !important;
          margin-left: 2pt !important;
        }
        
        .print-invoice .invoice-totals span:last-child {
          font-weight: 700 !important;
          color: #1e293b !important;
        }
        
        .print-invoice .invoice-totals .flex:last-child span:first-child,
        .print-invoice .invoice-totals .flex:last-child span:last-child {
          font-weight: 800 !important;
          color: #0f172a !important;
        }
        
        .print-invoice .invoice-table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 16pt 0 !important;
          border: none !important;
        }
        
        .print-invoice .invoice-table-header th {
          padding: 9pt !important;
          font-size: 10pt !important;
          font-weight: 600 !important;
          color: #64748b !important;
          background: none !important;
          border-bottom: 2pt solid #e2e8f0 !important;
        }
        
        .print-invoice .invoice-table-body td {
          padding: 9pt !important;
          font-size: 10pt !important;
          vertical-align: top !important;
          border: none !important;
        }
        
        /* ===== RECEIPT STYLING ===== */
        .print-receipt {
          font-family: 'Manrope', 'Inter', sans-serif !important;
          background: #ffffff !important;
          color: #1e293b !important;
          line-height: 1.2 !important;
          font-size: 12pt !important;
        }
        
        .print-receipt header {
          text-align: center !important;
          margin-bottom: 12pt !important;
          padding-bottom: 8pt !important;
          border-bottom: 2px solid #059669 !important;
        }
        
        .print-receipt .printable-bg-green-light {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0) !important;
          border: 2px solid #059669 !important;
          border-radius: 8pt !important;
          padding: 12pt !important;
          margin: 12pt 0 !important;
          text-align: center !important;
        }
        
        /* ===== GENERAL STYLING ===== */
        h1, h2, h3, h4, h5, h6 {
          color: #000 !important;
          page-break-after: avoid !important;
          margin-top: 0.8em !important;
          margin-bottom: 0.4em !important;
        }
        
        p { 
          margin: 0 0 8pt 0 !important;
          text-align: justify !important;
          font-size: 12pt !important;
          line-height: 1.2 !important;
        }
        
        table { 
          border-collapse: collapse !important; 
          width: 100% !important; 
          margin: 0.8em 0 !important;
        }
        
        th, td { 
          border: 1px solid #333 !important; 
          padding: 6px !important; 
          text-align: left !important;
          font-size: 10pt !important;
        }
        
        th {
          background-color: #f5f5f5 !important;
          font-weight: bold !important;
        }
        
        .avoid-break {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        .print-text-green {
          color: #059669 !important;
        }
        
        .printable-text-white {
          color: #ffffff !important;
        }
        
        button, input, select, textarea, .non-printable {
          display: none !important;
        }
      `;r.open(),r.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${p||"Dokumen"}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>${b}</style>
        </head>
        <body>
          <div class="page-canvas" id="pageCanvas">
            <div class="fit-to-page" id="fitWrapper">
              ${a.innerHTML}
            </div>
          </div>
          <script>
            window.onload = function() {
              // Auto fit content
              function mmToPx(mm) {
                const el = document.createElement('div');
                el.style.width = mm + 'mm';
                el.style.position = 'absolute';
                el.style.visibility = 'hidden';
                document.body.appendChild(el);
                const px = el.getBoundingClientRect().width;
                document.body.removeChild(el);
                return px;
              }
              
              const printableWidthMM = 160, printableHeightMM = 257;
              const printableWidthPx = mmToPx(printableWidthMM);
              const printableHeightPx = mmToPx(printableHeightMM);
              const wrapper = document.getElementById('fitWrapper');
              const canvas = document.getElementById('pageCanvas');
              
              if (canvas) {
                canvas.style.width = printableWidthMM + 'mm';
                canvas.style.height = printableHeightMM + 'mm';
              }
              
              if (wrapper) {
                const rect = wrapper.getBoundingClientRect();
                const scaleX = printableWidthPx / rect.width;
                const scaleY = printableHeightPx / rect.height;
                const scale = Math.min(1, scaleX, scaleY);
                wrapper.setAttribute('data-fit-scale', 'true');
                document.documentElement.style.setProperty('--fit-scale', 'scale(' + scale + ')');
              }
              
              // Direct print tanpa dialog preview
              setTimeout(function() {
                try {
                  window.print();
                } catch (e) {
                  console.error('Direct print failed:', e);
                }
                // Cleanup iframe setelah print
                setTimeout(function() {
                  if (window.parent && window.parent.document.body.contains(window.frameElement)) {
                    window.parent.document.body.removeChild(window.frameElement);
                  }
                }, 1000);
              }, 500);
            };
          <\/script>
        </body>
        </html>
      `),r.close()}catch{c()}},[p,c]),o=m.useCallback(()=>{let s=null;if(n&&(s=document.getElementById(n),s||(s=document.querySelector(".printable-area")),!s)){c();return}if(l&&s)if(Y){h(s);return}else{document.body.classList.add("printing");try{window.print()}finally{setTimeout(()=>document.body.classList.remove("printing"),300)}return}if(s){const e=window.open("","_blank","width=800,height=600");if(e){const r=s.cloneNode(!0);r.querySelectorAll(".non-printable, button, .button-primary, .button-secondary").forEach(b=>b.remove()),e.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>${p||"Dokumen Kontrak"}</title>
            ${(()=>{try{return`
                  <link rel="preconnect" href="https://fonts.googleapis.com">
                  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
                `+Array.from(document.querySelectorAll('link[rel="stylesheet"], style')).map(y=>y.outerHTML).join(`
`)}catch{return""}})()}
            <style>
          @page { 
            size: A4 portrait; 
            margin: 2cm 2.5cm; /* Indonesian standard: 2cm top/bottom, 2.5cm left/right */
          }
          
          :root {
            --fit-scale: scale(1);
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box !important;
          }
          
          html, body { 
            font-family: 'Manrope', sans-serif !important;
            line-height: 1.15 !important; /* Indonesian standard line spacing */
            color: #000 !important;
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 12pt !important; /* Standard document font size */
            width: 100% !important;
            height: auto !important;
          }
          
          /* Page canvas ensures we stay within a single A4 page printable area */
          .page-canvas {
            width: 160mm;
            height: 257mm; /* 297mm - 20mm - 20mm */
            overflow: hidden;
            margin: 0 auto;
            position: relative;
          }

          /* The wrapper holds the actual document content at the exact printable width */
          #fitWrapper {
            width: 160mm; /* A4 width (210mm) - 25mm - 25mm = 160mm */
            margin: 0 auto; /* center within printable area */
            transform-origin: top left !important;
          }
          
          /* When scaling is needed to fit height, apply the transform */
          #fitWrapper[data-fit-scale="true"] {
            transform: var(--fit-scale) !important;
          }
          
          .printable-content { 
            max-width: 100% !important;
            width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            overflow: visible !important;
          }
          
          img, svg {
            max-width: 100% !important;
            height: auto !important;
          }
          
          h1, h2, h3, h4, h5, h6 {
            color: #000 !important;
            page-break-after: avoid !important;
            margin-top: 0.8em !important;
            margin-bottom: 0.4em !important;
            font-family: inherit !important;
          }
          
          h2 { 
            font-size: 16pt !important; 
            text-align: center !important; 
            font-weight: bold !important;
            margin-bottom: 0.2em !important;
          }
          h3 { 
            font-size: 14pt !important; 
            text-align: center !important; 
            font-weight: bold !important;
            margin-bottom: 1em !important;
          }
          h4 { 
            font-size: 12pt !important; 
            font-weight: bold !important; 
            text-align: center !important;
            margin: 0.8em 0 0.4em 0 !important;
          }
          
          p { 
            margin: 0 0 8pt 0 !important; /* 8pt spacing after paragraphs */
            text-align: justify !important;
            orphans: 2 !important;
            widows: 2 !important;
            font-size: 12pt !important;
            line-height: 1.2 !important; /* Indonesian standard line spacing */
          }
          
          .my-4 {
            margin: 0.8em 0 !important;
          }
          
          .mt-6 {
            margin-top: 1.2em !important;
          }
          
          .space-y-4 > * + * {
            margin-top: 0.8em !important;
          }
          
          table { 
            border-collapse: collapse !important; 
            width: 100% !important; 
            margin: 0.8em 0 !important;
            page-break-inside: avoid !important;
          }
          
          thead { display: table-header-group !important; }
          tfoot { display: table-footer-group !important; }
          tr { page-break-inside: avoid !important; break-inside: avoid !important; }
          
          th, td { 
            border: 1px solid #333 !important; 
            padding: 6px !important; 
            text-align: left !important;
            vertical-align: top !important;
            font-size: 10pt !important;
          }
          
          th {
            background-color: #f5f5f5 !important;
            font-weight: bold !important;
          }
          
          .avoid-break, 
          .signature-section,
          section { 
            page-break-inside: avoid !important; 
          }
          
          .signature-section {
            margin-top: 1.5em !important;
            padding-top: 0.8em !important;
            border-top: 2px solid #333 !important;
            page-break-inside: avoid !important;
          }
          
          .signature-area {
            display: inline-block !important;
            width: 45% !important;
            text-align: center !important;
            vertical-align: top !important;
            margin: 0 2.5% !important;
          }
          
          .signature-area img {
            max-height: 30px !important;
            max-width: 80px !important;
            object-fit: contain !important;
          }
          
          .signature-area p {
            font-size: 10pt !important;
            margin: 0.2em 0 !important;
          }
          
          .border-t-2 {
            border-top: 2px dotted #333 !important;
            padding-top: 0.2em !important;
            margin-top: 0.5em !important;
          }
          
          .printable-bg-blue { 
            background-color: #2563eb !important; 
            color: white !important;
          }
          
          .printable-text-white { 
            color: #ffffff !important; 
          }
          
          .print-text-green { 
            color: #16a34a !important; 
          }
          
          /* Hide any remaining interactive elements */
          button, input, select, textarea,
          .non-printable {
            display: none !important;
          }
          
          /* Ensure proper flex layout for signatures */
          .flex {
            display: flex !important;
          }
          
          .justify-between {
            justify-content: space-between !important;
          }
          
          .items-start {
            align-items: flex-start !important;
          }
          
          .text-center {
            text-align: center !important;
          }
          
          .font-bold {
            font-weight: bold !important;
          }
          
          .text-xs {
            font-size: 9pt !important;
          }
          
          .italic {
            font-style: italic !important;
          }
        </style>
          </head>
          <body>
            <div class="page-canvas" id="pageCanvas"><div class="fit-to-page" id="fitWrapper">${r.innerHTML}</div></div>
            <script>
              (function() {
                function mmToPx(mm) {
                  const el = document.createElement('div');
                  el.style.width = mm + 'mm';
                  el.style.position = 'absolute';
                  el.style.visibility = 'hidden';
                  document.body.appendChild(el);
                  const px = el.getBoundingClientRect().width;
                  document.body.removeChild(el);
                  return px;
                }
                async function ready() {
                  try {
                    if (document.fonts && document.fonts.ready) {
                      await document.fonts.ready;
                    }
                  } catch {}
                  try {
                    const images = Array.from(document.images || []);
                    await Promise.all(images.map(img => (img.decode ? img.decode().catch(()=>{}) : Promise.resolve())));
                  } catch {}
                }
                async function fit() {
                  // A4 printable area: width 160mm, height 257mm (after 25mm L/R and 20mm T/B)
                  var printableWidthMM = 160, printableHeightMM = 257;
                  const printableWidthPx = mmToPx(printableWidthMM);
                  const printableHeightPx = mmToPx(printableHeightMM);
                  const wrapper = document.getElementById('fitWrapper');
                  const canvas = document.getElementById('pageCanvas');
                  if (canvas) {
                    canvas.style.width = printableWidthMM + 'mm';
                    canvas.style.height = printableHeightMM + 'mm';
                    canvas.style.overflow = 'hidden';
                    canvas.style.margin = '0 auto';
                  }
                  if (wrapper) {
                    const rect = wrapper.getBoundingClientRect();
                    const scaleX = printableWidthPx / rect.width;
                    const scaleY = printableHeightPx / rect.height;
                    const scale = Math.min(1, scaleX, scaleY);
                    wrapper.setAttribute('data-fit-scale', 'true');
                    document.documentElement.style.setProperty('--fit-scale', 'scale(' + scale + ')');
                  }
                  (window as any).__fitReady = true;
                }
                window.addEventListener('load', function(){ ready().then(fit); });
              })();
            <\/script>
          </body>
          </html>
        `),e.document.close(),e.onload=()=>{setTimeout(()=>{e.focus(),e.print(),setTimeout(()=>{e.close()},1e3)},800)};return}}c()},[n,p,l,c,h]);return t.jsx("button",{type:"button",onClick:o,className:"button-primary inline-flex items-center gap-2",...d,children:i})},G=(n,i)=>{const{showDecimals:p=!0,compact:u=!1}=i||{};return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:p?2:0,maximumFractionDigits:p?2:0,notation:u?"compact":"standard"}).format(n)},P=n=>G(n,{showDecimals:!1}),D=n=>new Date(n).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"}),ot=({accessId:n,teamMembers:i,clients:p=[],projects:u,teamProjectPayments:l,teamPaymentRecords:d,showNotification:c,userProfile:h})=>{const[o,s]=m.useState("dashboard"),[e,r]=m.useState(null),[a,b]=m.useState(null),x=h,[y,N]=m.useState(null),[k,C]=m.useState(!1),[M,E]=m.useState(!1),I=m.useCallback(async w=>{},[]);m.useEffect(()=>{},[a,I]);const L=m.useCallback(async()=>{if(!a)return;const w=document.getElementById(`payment-slip-content-${a.id}`);if(!w)return;const f={margin:[6,8,6,8],filename:`Slip-Gaji-${a.recordNumber}.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2,useCORS:!0,letterRendering:!0,windowWidth:1400,onclone:j=>{const v=j.getElementById(`payment-slip-content-${a.id}`);v&&(v.style.width="100%",v.style.maxWidth="100%",v.style.minWidth="0",v.style.margin="0",v.style.boxShadow="none",v.style.border="none",v.classList.add("force-desktop"))}},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}};try{const j=await $(()=>import("./vendor-html2pdf-Ce4p5aKT.js").then(W=>W.h),__vite__mapDeps([0,1,2]));await(j.default||j)().set(f).from(w).save()}catch{window.print()}},[a]),g=m.useMemo(()=>i?.find(f=>f.portalAccessId===n||f.id===n)||y,[i,n,y]);m.useEffect(()=>{if(!n)return;if(!i?.some(f=>f.portalAccessId===n||f.id===n)&&!g){let f=!0;return C(!0),R(n).then(j=>{f&&N(j)}).catch(j=>{}).finally(()=>{f&&(C(!1),E(!0))}),()=>{f=!1}}},[n,i,g]);const T=m.useMemo(()=>(u||[]).filter(w=>w.team?.some(f=>f.memberId===g?.id)).sort((w,f)=>new Date(f.date).getTime()-new Date(w.date).getTime()),[u,g]);if(!g)return k||!M&&(!i||i.length===0)?t.jsx("div",{className:"flex items-center justify-center min-h-screen bg-white p-4",children:t.jsxs("div",{className:"flex flex-col items-center justify-center text-center",children:[t.jsxs("div",{className:"relative flex justify-center items-center mb-6",children:[t.jsx("div",{className:"absolute border-4 border-brand-accent/20 rounded-full w-16 h-16"}),t.jsx("div",{className:"animate-spin border-4 border-transparent border-t-brand-accent rounded-full w-16 h-16"})]}),t.jsx("p",{className:"text-sm font-medium text-slate-600 animate-pulse",children:"Memuat Portal Tim..."})]})}):t.jsx("div",{className:"flex items-center justify-center min-h-screen bg-white p-4",children:t.jsxs("div",{className:"w-full max-w-lg p-8 text-center bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200",children:[t.jsx("div",{className:"w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-3xl font-bold",children:"!"}),t.jsx("h1",{className:"text-2xl font-bold text-slate-800",children:"Portal Tidak Ditemukan"}),t.jsx("p",{className:"mt-3 text-slate-600 leading-relaxed",children:"Tautan portal tim yang Anda gunakan tidak valid atau telah dihapus."}),t.jsx("div",{className:"mt-6 flex justify-center",children:t.jsx("a",{href:"#/home",className:"inline-flex items-center gap-2 px-5 py-2.5 bg-brand-accent text-white rounded-xl text-sm font-medium shadow-sm hover:opacity-90 transition-opacity",children:"Kembali ke Beranda"})})]})});const B=[{id:"dashboard",label:"Dasbor"},{id:"projects",label:"Acara Pernikahan"},{id:"payments",label:"Pembayaran"},{id:"performance",label:"Kinerja"}],F=()=>{switch(o){case"dashboard":return t.jsx(K,{member:g,projects:T,teamProjectPayments:l});case"projects":return t.jsx(V,{projects:T,clients:p,onProjectClick:r,memberId:g.id});case"payments":return t.jsx(q,{member:g,projects:u,teamProjectPayments:l,teamPaymentRecords:d,onSlipView:b});case"performance":return t.jsx(J,{member:g});default:return null}};return t.jsx("div",{className:"min-h-screen bg-white text-public-text-primary p-3 md:p-4 sm:p-6 lg:p-8",children:t.jsxs("div",{className:"max-w-5xl mx-auto",children:[t.jsx("header",{className:"mb-6 md:mb-8 p-3 md:p-4 sm:p-6 bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 widget-animate",children:t.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4",children:[t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsx("div",{className:"w-14 h-14 rounded-full overflow-hidden shrink-0 bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold",children:g.avatarUrl?t.jsx("img",{src:g.avatarUrl,alt:`${g.name} avatar`,className:"w-full h-full object-cover"}):g.name?.charAt(0).toUpperCase()||"?"}),t.jsxs("div",{children:[t.jsx("h1",{className:"text-2xl md:text-3xl font-bold text-slate-800",children:"Portal Tim / Vendor"}),t.jsxs("p",{className:"text-base md:text-lg text-slate-600 mt-1",children:["Selamat Datang, ",g.name]})]})]}),x?.phone&&t.jsx("div",{className:"lg:w-[360px]",children:t.jsx(O,{variant:"public",phone:x.phone})})]})}),t.jsx("div",{className:"bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 mb-6 p-2.5 widget-animate",style:{animationDelay:"100ms"},children:t.jsx("nav",{className:"flex space-x-2 overflow-x-auto",children:B.map(w=>t.jsx("button",{onClick:()=>s(w.id),className:`shrink-0 inline-flex items-center justify-center py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${o===w.id?"bg-blue-500 text-white shadow-sm":"text-slate-600 hover:bg-slate-100"}`,children:w.label},w.id))})}),t.jsx("main",{children:F()}),t.jsx(A,{isOpen:!!e,onClose:()=>r(null),title:`Detail Acara Pernikahan: ${e?.projectName}`,size:"3xl",children:e&&t.jsx(X,{project:e,member:g,showNotification:c,onClose:()=>r(null)})}),a&&t.jsxs(z.Fragment,{children:[t.jsx("div",{style:{position:"fixed",left:0,top:0,zIndex:-9999,opacity:0,pointerEvents:"none",width:"800px"},children:t.jsx(S,{record:a,teamMembers:i&&i.length>0?i:[g],teamProjectPayments:l,projects:u,userProfile:x})}),t.jsxs(A,{isOpen:!!a,onClose:()=>b(null),title:`Slip Pembayaran: ${a?.recordNumber}`,size:"4xl",children:[t.jsx("div",{className:"bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto",children:a&&t.jsx(S,{record:a,teamMembers:i&&i.length>0?i:[g],teamProjectPayments:l,projects:u,userProfile:x})}),t.jsxs("div",{className:"mt-5 flex justify-end items-center gap-2 non-printable border-t border-slate-200 pt-4",children:[t.jsx(_,{areaId:`payment-slip-content-${a.id}`,label:"Cetak",title:`Slip Pembayaran - ${a.recordNumber||""}`}),t.jsxs("button",{type:"button",onClick:L,className:"inline-flex items-center gap-2 px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-sm",children:[t.jsx(H,{className:"w-4 h-4"}),"Unduh PDF"]})]})]})]})]})})},K=({member:n,projects:i,teamProjectPayments:p})=>{const u=m.useMemo(()=>{const d=p.filter(o=>o.teamMemberId===n.id&&o.status==="Unpaid").reduce((o,s)=>o+s.fee,0),c=p.filter(o=>o.teamMemberId===n.id&&o.status==="Paid").reduce((o,s)=>o+s.fee,0),h=i.filter(o=>o.status==="Selesai"&&o.team.some(s=>s.memberId===n.id)).length;return{unpaidFee:d,paidFee:c,completedProjects:h,activeProjects:i.filter(o=>o.status!=="Selesai"&&o.status!=="Dibatalkan").length}},[n,i,p]),l=m.useMemo(()=>{const d=i.filter(h=>new Date(h.date)>=new Date&&h.status!=="Selesai"&&h.status!=="Dibatalkan").sort((h,o)=>new Date(h.date).getTime()-new Date(o.date).getTime())[0],c=[];return d&&c.push({...d,type:"project"}),c.sort((h,o)=>new Date(h.date).getTime()-new Date(o.date).getTime())},[i,n]);return t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{className:"grid grid-cols-2 lg:grid-cols-4 gap-4",children:[t.jsxs("div",{className:"bg-white p-5 rounded-2xl shadow-sm border border-slate-100",children:[t.jsx("p",{className:"text-xs text-slate-500 font-medium uppercase tracking-wider",children:"Fee Diterima"}),t.jsx("p",{className:"text-lg font-bold text-slate-800 mt-1",children:P(u.paidFee)})]}),t.jsxs("div",{className:"bg-white p-5 rounded-2xl shadow-sm border border-slate-100",children:[t.jsx("p",{className:"text-xs text-slate-500 font-medium uppercase tracking-wider",children:"Fee Pending"}),t.jsx("p",{className:"text-lg font-bold text-slate-800 mt-1",children:P(u.unpaidFee)})]}),t.jsxs("div",{className:"bg-white p-5 rounded-2xl shadow-sm border border-slate-100",children:[t.jsx("p",{className:"text-xs text-slate-500 font-medium uppercase tracking-wider",children:"Acara Aktif"}),t.jsx("p",{className:"text-lg font-bold text-slate-800 mt-1",children:u.activeProjects})]}),t.jsxs("div",{className:"bg-white p-5 rounded-2xl shadow-sm border border-slate-100",children:[t.jsx("p",{className:"text-xs text-slate-500 font-medium uppercase tracking-wider",children:"Selesai"}),t.jsx("p",{className:"text-lg font-bold text-slate-800 mt-1",children:u.completedProjects})]})]}),t.jsxs("div",{className:"bg-white p-6 rounded-3xl shadow-sm border border-slate-100",children:[t.jsx("h3",{className:"text-lg font-bold text-slate-800 mb-4",children:"Agenda Mendesak"}),t.jsx("div",{className:"space-y-3",children:l.length>0?l.map((d,c)=>t.jsxs("div",{className:"p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100",children:[t.jsxs("div",{children:[t.jsx("p",{className:"font-semibold text-slate-800",children:d.projectName}),t.jsx("p",{className:"text-sm text-slate-500",children:D(d.date)})]}),t.jsx("span",{className:"text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full",children:"Akan Datang"})]},c)):t.jsx("p",{className:"text-center text-slate-400 py-8 text-sm",children:"Tidak ada agenda mendesak."})})]})]})},V=({projects:n,clients:i,onProjectClick:p,memberId:u})=>{const[l,d]=m.useState("all"),c=e=>{const r=new Date,a=new Date(e.date),b=e.status==="Selesai",x=e.status==="Dibatalkan",y=!b&&!x&&a>=new Date(r.getFullYear(),r.getMonth(),r.getDate()),N=!b&&!x&&a<new Date(r.getFullYear(),r.getMonth(),r.getDate());return{isCompleted:b,isUpcoming:y,isOngoing:N}},h=m.useMemo(()=>{let e=0,r=0,a=0;return n.forEach(b=>{const x=c(b);x.isUpcoming?e++:x.isOngoing?r++:x.isCompleted&&a++}),{upcoming:e,ongoing:r,completed:a,all:n.length}},[n]),o=m.useMemo(()=>{let e=n.slice();return l!=="all"&&(e=e.filter(r=>{const a=c(r);return l==="upcoming"?a.isUpcoming:l==="ongoing"?a.isOngoing:l==="completed"?a.isCompleted:!0})),l==="completed"?e.sort((r,a)=>new Date(a.date).getTime()-new Date(r.date).getTime()):e.sort((r,a)=>new Date(r.date).getTime()-new Date(a.date).getTime()),e},[n,l]),s=({id:e,label:r,count:a})=>{const b="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1",x={all:{active:"bg-slate-600 text-white border-slate-600 shadow-soft",inactive:"bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"},upcoming:{active:"bg-blue-600 text-white border-blue-600 shadow-soft",inactive:"bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"},ongoing:{active:"bg-amber-600 text-white border-amber-600 shadow-soft",inactive:"bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"},completed:{active:"bg-green-600 text-white border-green-600 shadow-soft",inactive:"bg-green-50 text-green-700 border-green-200 hover:bg-green-100"}},y=l===e?x[e].active:x[e].inactive;return t.jsxs("button",{onClick:()=>d(e),"aria-pressed":l===e,className:`${b} ${y}`,children:[r," (",a,")"]})};return t.jsxs("div",{className:"space-y-2.5",children:[t.jsxs("div",{className:"flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-xl border border-slate-200 p-2.5 rounded-xl shadow-sm",children:[t.jsx(s,{id:"all",label:"Semua",count:h.all}),t.jsx(s,{id:"upcoming",label:"Akan Datang",count:h.upcoming}),t.jsx(s,{id:"ongoing",label:"Berjalan",count:h.ongoing}),t.jsx(s,{id:"completed",label:"Selesai",count:h.completed})]}),o.map((e,r)=>{const a=e.team.find(k=>k.memberId===u),b=i.find(k=>k.id===e.clientId),{isUpcoming:x,isCompleted:y}=c(e),N=y?{text:"Selesai",cls:"bg-green-100 text-green-800"}:x?{text:"Akan Datang",cls:"bg-blue-100 text-blue-800"}:{text:"Berjalan",cls:"bg-yellow-100 text-yellow-800"};return t.jsx("div",{onClick:()=>p(e),className:"h-fit p-2.5 sm:p-3 bg-white/95 backdrop-blur-xl rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 flex justify-between items-center gap-2 transition-all duration-200 hover:shadow-md widget-animate",style:{animationDelay:`${r*80}ms`},children:t.jsxs("div",{className:"flex items-center gap-2.5 min-w-0 flex-1",children:[t.jsx("div",{className:"w-8 h-8 rounded-full overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600",children:b?.avatarUrl?t.jsx("img",{src:b.avatarUrl,alt:`${e.clientName} avatar`,className:"w-full h-full object-cover"}):(e.clientName||"K").charAt(0).toUpperCase()}),t.jsxs("div",{className:"min-w-0 flex-1",children:[t.jsxs("div",{className:"flex items-center justify-between gap-2",children:[t.jsx("h3",{className:"font-semibold text-sm sm:text-base text-public-text-primary leading-tight truncate",children:e.projectName}),t.jsxs("div",{className:"flex items-center gap-1.5 shrink-0",children:[a?.subJob&&t.jsx("span",{className:"text-[10px] font-semibold text-public-accent bg-public-accent/10 px-1.5 py-0.5 rounded-md inline-block leading-none",children:a.subJob}),t.jsx("span",{className:`text-[10px] font-bold px-2 py-0.5 rounded-full leading-none ${N.cls}`,children:N.text})]})]}),t.jsxs("p",{className:"text-xs text-public-text-secondary leading-tight mt-0.5 truncate",children:[e.clientName," • ",D(e.date)]})]})]})},e.id)}),o.length===0&&t.jsx("div",{className:"bg-white/95 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 shadow-sm text-center widget-animate",children:t.jsx("p",{className:"text-slate-500 py-2 text-xs sm:text-sm",children:"Tidak ada Acara Pernikahan pada kategori ini."})})]})},q=({member:n,projects:i,teamProjectPayments:p,teamPaymentRecords:u,onSlipView:l})=>t.jsxs("div",{className:"bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-xl border border-slate-200 widget-animate",children:[t.jsx("h2",{className:"text-xl font-bold text-slate-800 mb-4",children:"Riwayat Pembayaran"}),t.jsx("div",{className:"overflow-x-auto",children:t.jsxs("table",{className:"w-full text-sm",children:[t.jsx("thead",{className:"bg-gradient-to-r from-blue-50 to-cyan-50",children:t.jsxs("tr",{children:[t.jsx("th",{className:"p-3 text-center font-semibold text-slate-700 w-12",children:"No"}),t.jsx("th",{className:"p-3 text-left font-semibold text-slate-700",children:"Acara Pernikahan"}),t.jsx("th",{className:"p-3 text-left font-semibold text-slate-700",children:"Tanggal"}),t.jsx("th",{className:"p-3 text-right font-semibold text-slate-700",children:"Fee"}),t.jsx("th",{className:"p-3 text-center font-semibold text-slate-700",children:"Status & Aksi"})]})}),t.jsx("tbody",{className:"divide-y divide-slate-200",children:p.filter(d=>d.teamMemberId===n.id).map((d,c)=>{const o=d.status==="Paid"?u.find(s=>s.projectPaymentIds.includes(d.id)):null;return t.jsxs("tr",{className:"widget-animate",style:{animationDelay:`${c*50}ms`},children:[t.jsx("td",{className:"p-3 text-center font-medium text-slate-500",children:c+1}),t.jsx("td",{className:"p-3 font-semibold text-public-text-primary",children:i.find(s=>s.id===d.projectId)?.projectName||"N/A"}),t.jsx("td",{className:"p-3 text-public-text-secondary",children:D(d.date)}),t.jsx("td",{className:"p-3 text-right font-medium text-public-text-primary",children:P(d.fee)}),t.jsxs("td",{className:"p-3 text-center space-x-2",children:[t.jsx("span",{className:`px-2 py-1 text-xs font-semibold rounded-full ${d.status==="Paid"?"bg-green-100 text-green-800":"bg-yellow-100 text-yellow-800"}`,children:d.status==="Paid"?"Lunas":"Belum Lunas"}),o&&t.jsx("button",{onClick:()=>l(o),className:"text-xs font-semibold text-public-accent hover:underline",children:"Lihat Slip"})]})]},d.id)})})]})})]}),J=({member:n})=>t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{className:"bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-3xl shadow-xl border border-blue-300 text-center widget-animate",style:{animationDelay:"100ms"},children:[t.jsx("h3",{className:"text-lg font-bold text-white mb-2",children:"Peringkat Kinerja"}),t.jsx("div",{className:"flex justify-center items-center gap-2",children:t.jsxs("p",{className:"text-3xl font-bold text-white",children:[n.rating.toFixed(1)," / 5.0"]})})]}),t.jsxs("div",{className:"bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-slate-200 widget-animate",style:{animationDelay:"200ms"},children:[t.jsx("h3",{className:"text-xl font-bold text-slate-800 mb-4",children:"Catatan Kinerja dari Admin"}),t.jsxs("div",{className:"space-y-3 max-h-80 overflow-y-auto pr-2",children:[n.performanceNotes.map((i,p)=>t.jsxs("div",{className:`p-4 rounded-lg border-l-4 widget-animate ${i.type===U.PRAISE?"border-green-400 bg-green-500/5":"border-yellow-400 bg-yellow-500/5"}`,style:{animationDelay:`${300+p*100}ms`},children:[t.jsxs("p",{className:"text-sm text-public-text-primary italic",children:['"',i.note,'"']}),t.jsxs("p",{className:"text-right text-xs text-public-text-secondary mt-2",children:["- ",D(i.date)]})]},i.id)),n.performanceNotes.length===0&&t.jsx("p",{className:"text-center text-public-text-secondary py-8",children:"Belum ada catatan kinerja."})]})]})]}),X=({project:n,member:i,showNotification:p,onClose:u})=>{const l=n.team.find(d=>d.memberId===i.id);return t.jsx("div",{className:"space-y-6",children:t.jsxs("div",{children:[t.jsx("h4",{className:"font-semibold text-gradient mb-2",children:"Informasi Umum"}),t.jsxs("div",{className:"text-sm space-y-2 p-3 bg-public-bg rounded-lg",children:[l&&t.jsxs("p",{children:[t.jsx("strong",{children:"Peran Anda:"})," ",l.role," ",l.subJob&&t.jsxs("span",{className:"text-public-text-secondary",children:["(",l.subJob,")"]})]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Pengantin:"})," ",n.clientName]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Lokasi:"})," ",n.location]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Waktu:"})," ",n.startTime||"N/A"," - ",n.endTime||"N/A"]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Link Moodboard/Brief (Internal):"})," ",n.driveLink?t.jsx("a",{href:n.driveLink,target:"_blank",rel:"noopener noreferrer",className:"text-blue-400 hover:underline",children:"Buka Tautan"}):"N/A"]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Link File dari Pengantin:"})," ",n.clientDriveLink?t.jsx("a",{href:n.clientDriveLink,target:"_blank",rel:"noopener noreferrer",className:"text-blue-400 hover:underline",children:"Buka Tautan"}):"N/A"]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Link File Jadi (untuk Pengantin):"})," ",n.finalDriveLink?t.jsx("a",{href:n.finalDriveLink,target:"_blank",rel:"noopener noreferrer",className:"text-blue-400 hover:underline",children:"Buka Tautan"}):"Belum tersedia"]}),n.notes&&t.jsxs("p",{className:"whitespace-pre-wrap mt-2 pt-2 border-t border-public-border",children:[t.jsx("strong",{children:"Catatan:"})," ",n.notes]})]})]})})};export{ot as default};
