import{ad as h,j as t}from"./vendor-react-BwyGA0Mb.js";import{P as I}from"./index-CAZdTYQ7.js";const A=({project:i,profile:g,packages:f=[],client:c,id:e="invoice-document"})=>{const n=g||{},v=f||[],[k,d]=h.useState(!1);h.useEffect(()=>{d(!1)},[n.logoBase64]);const r=a=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(a),u=a=>{if(!a)return"Tanpa Tanggal";try{return new Date(a).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}catch{return a}},l=Array.isArray(i.addOns)?i.addOns:[],x=Array.isArray(i.customCosts)?i.customCosts:[],b=(Number(i.totalCost)||0)+(Number(i.discountAmount)||0),y=l.reduce((a,o)=>a+(Number(o?.price)||0),0),w=x.reduce((a,o)=>a+(Number(o?.amount)||0),0),N=Math.max(0,b-y-(Number(i.transportCost)||0)-w),s=v.find(a=>a.id===i.packageId||a.name===i.packageName);let p=[],m=[];if(s){const a=s.durationOptions?.find(o=>o.label===i.durationSelection);a&&(a.digitalItems&&a.digitalItems.length>0&&(p=a.digitalItems),a.physicalItems&&a.physicalItems.length>0&&(m=a.physicalItems)),p.length===0&&s.digitalItems&&s.digitalItems.length>0&&(p=s.digitalItems),m.length===0&&s.physicalItems&&s.physicalItems.length>0&&(m=s.physicalItems)}return t.jsxs("div",{id:e,className:"invoice-container invoice-document-mobile bg-white rounded-none border border-slate-200 shadow-xl overflow-visible print:shadow-none print:border-none print:bg-white print:rounded-none mx-auto w-full min-w-0 font-sans text-slate-900",children:[t.jsx("div",{className:"invoice-header avoid-break p-2.5 sm:p-6 border-b-2 sm:border-b-4 border-brand-accent bg-slate-50 print:bg-white print:p-0 print:pt-4 print:pb-4",children:t.jsxs("div",{className:"invoice-header-content flex flex-row justify-between items-start gap-2.5 sm:gap-4",children:[t.jsxs("div",{className:"invoice-brand-panel flex flex-col gap-1 sm:gap-2 flex-1 min-w-0 pr-1",children:[n.logoBase64&&!k?t.jsx("img",{src:n.logoBase64,alt:n.companyName||"Logo",onError:()=>d(!0),className:"invoice-logo h-9 sm:h-20 w-auto max-w-[130px] sm:max-w-[220px] object-contain object-left self-start block shrink-0"}):t.jsxs("div",{className:"invoice-logo-fallback flex items-center gap-1.5 sm:gap-3",children:[t.jsx("div",{className:"w-7 h-7 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-brand-accent flex items-center justify-center shrink-0",children:t.jsx("span",{className:"text-white font-bold text-xs sm:text-xl",children:n.companyName?.charAt(0)||"V"})}),t.jsx("h1",{className:"text-xs sm:text-xl font-bold text-slate-800 truncate",children:n.companyName||"Vendor"})]}),t.jsxs("div",{className:"invoice-company-meta text-[7.5px] sm:text-[11px] leading-snug sm:leading-relaxed text-slate-500 max-w-full sm:max-w-[280px] break-words print:text-black",children:[t.jsx("p",{className:"font-bold text-slate-700 print:text-black",children:n.companyName}),t.jsx("p",{children:n.address}),t.jsxs("p",{className:"break-words",children:[n.phone,n.phone&&n.email?" • ":"",n.email]})]})]}),t.jsxs("div",{className:"invoice-meta-panel text-right flex flex-col items-end shrink-0",children:[t.jsx("h2",{className:"invoice-title text-base sm:text-3xl font-black text-brand-accent tracking-tighter mb-0.5 sm:mb-1.5",children:"INVOICE"}),t.jsxs("div",{className:"invoice-meta-badge bg-slate-200 px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-sm text-[7.5px] sm:text-[11px] font-bold text-slate-700 mb-1 sm:mb-2 print:bg-white print:border print:border-slate-300",children:["ID: #INV-",i.id.slice(-8).toUpperCase()]}),t.jsxs("div",{className:"invoice-meta-text text-[7.5px] sm:text-[11px] text-slate-500 text-right space-y-0 sm:space-y-0.5 print:text-black",children:[t.jsxs("p",{children:["Diterbitkan: ",t.jsx("span",{className:"font-bold text-slate-700 print:text-black",children:u(i.date)})]}),t.jsxs("p",{children:["Status: ",t.jsx("span",{className:`font-bold ${i.paymentStatus===I.LUNAS?"text-green-600":"text-orange-600"} print:text-black uppercase`,children:i.paymentStatus})]})]})]})]})}),t.jsxs("div",{className:"invoice-body p-2.5 sm:p-6 space-y-2.5 sm:space-y-5 print:p-0 print:pt-4",children:[t.jsxs("div",{className:"invoice-section avoid-break grid grid-cols-2 gap-2.5 sm:gap-6 border-b border-slate-100 pb-2.5 sm:pb-4 print:border-slate-200",children:[t.jsxs("div",{children:[t.jsx("h4",{className:"invoice-section-label text-[7px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 sm:mb-2 print:text-slate-500",children:"Tagihan Untuk"}),t.jsxs("div",{className:"space-y-0.5 sm:space-y-1",children:[t.jsx("p",{className:"invoice-party-name text-[10px] sm:text-base font-bold text-slate-800 print:text-black",children:i.clientName}),c&&t.jsxs("div",{className:"invoice-party-meta text-[7.5px] sm:text-[11px] text-slate-600 print:text-black space-y-0 sm:space-y-0.5",children:[t.jsx("p",{children:c.phone}),t.jsx("p",{children:c.email})]})]})]}),t.jsxs("div",{children:[t.jsx("h4",{className:"invoice-section-label text-[7px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 sm:mb-2 print:text-slate-500",children:"Detail Layanan"}),t.jsxs("div",{className:"space-y-0.5 sm:space-y-1",children:[t.jsx("p",{className:"invoice-party-name text-[10px] sm:text-base font-bold text-slate-800 print:text-black",children:i.projectName}),t.jsxs("div",{className:"invoice-party-meta grid grid-cols-2 gap-x-1.5 sm:gap-x-3 gap-y-0.5 sm:gap-y-1 text-[7.5px] sm:text-[11px] text-slate-600 print:text-black",children:[t.jsxs("p",{children:[t.jsx("span",{className:"text-slate-400 font-medium",children:"Lokasi:"})," ",i.location]}),t.jsxs("p",{children:[t.jsx("span",{className:"text-slate-400 font-medium",children:"Tipe:"})," ",i.projectType]}),i.address&&t.jsxs("p",{className:"col-span-2",children:[t.jsx("span",{className:"text-slate-400 font-medium",children:"Alamat:"})," ",i.address]})]})]})]})]}),t.jsx("div",{className:"invoice-table-wrapper mb-2.5 sm:mb-6",children:t.jsxs("table",{className:"invoice-table-tight w-full text-left",children:[t.jsxs("colgroup",{children:[t.jsx("col",{style:{width:"8%"}}),t.jsx("col",{style:{width:"68%"}}),t.jsx("col",{style:{width:"24%"}})]}),t.jsx("thead",{children:t.jsxs("tr",{className:"bg-slate-100 border-b border-black print:bg-slate-50",children:[t.jsx("th",{className:"px-1.5 py-1 sm:px-3 sm:py-2 text-center text-[7px] sm:text-[10px] font-black text-black uppercase tracking-widest border-r border-black",children:"No"}),t.jsx("th",{className:"px-1.5 py-1 sm:px-3 sm:py-2 text-[7px] sm:text-[10px] font-black text-black uppercase tracking-widest border-r border-black",children:"Deskripsi Produk / Layanan"}),t.jsx("th",{className:"px-1.5 py-1 sm:px-3 sm:py-2 text-right text-[7px] sm:text-[10px] font-black text-black uppercase tracking-widest",children:"Total Harga"})]})}),t.jsxs("tbody",{className:"divide-y divide-black print:divide-black text-[8px] sm:text-[12px]",children:[t.jsxs("tr",{className:"align-top bg-white",children:[t.jsx("td",{className:"px-1.5 py-1 sm:px-3 sm:py-2 text-center text-slate-800 font-medium border-r border-black align-top",children:"1"}),t.jsx("td",{className:"px-1.5 py-1 sm:px-3 sm:py-2 border-r border-black align-top",children:t.jsxs("div",{className:"invoice-desc-box m-0 p-0 block",children:[t.jsx("p",{className:"invoice-item-title invoice-item-title-main font-bold text-slate-800 text-[8.5px] sm:text-[13px] print:text-black m-0 p-0",children:i.packageName}),p.length>0?t.jsx("div",{className:"mt-0.5 sm:mt-1 space-y-0 sm:space-y-0.5",children:p.map((a,o)=>t.jsxs("p",{className:"invoice-item-sub text-[7px] sm:text-[10px] text-slate-500 leading-tight flex items-start gap-1",children:[t.jsx("span",{className:"shrink-0",children:"•"}),t.jsx("span",{children:a})]},o))}):t.jsx("p",{className:"invoice-item-sub text-[7px] sm:text-[10px] text-slate-500 mt-0.5 italic",children:"Package utama layanan profesional"}),m.length>0&&t.jsxs("div",{className:"mt-1 pt-1 sm:mt-1.5 sm:pt-1.5 border-t border-slate-200 space-y-0 sm:space-y-0.5",children:[t.jsx("p",{className:"invoice-item-tag text-[6.5px] sm:text-[9px] font-black text-slate-500 uppercase tracking-wider mb-0.5",children:"Vendor (Allpackage):"}),m.map((a,o)=>t.jsxs("p",{className:"invoice-item-sub text-[7px] sm:text-[10px] text-slate-500 leading-tight flex items-start gap-1",children:[t.jsx("span",{className:"shrink-0",children:"•"}),t.jsx("span",{children:a.name})]},o))]})]})}),t.jsx("td",{className:"px-1.5 py-1 sm:px-3 sm:py-2 text-right font-bold text-slate-800 text-[8px] sm:text-[12px] whitespace-nowrap print:text-black align-top",children:r(N)})]}),l.map((a,o)=>t.jsxs("tr",{className:"align-top bg-white",children:[t.jsx("td",{className:"px-1.5 py-1 sm:px-3 sm:py-2 text-center text-slate-800 font-medium border-r border-black align-top",children:2+o}),t.jsx("td",{className:"px-1.5 py-1 sm:px-3 sm:py-2 border-r border-black align-top",children:t.jsxs("div",{className:"invoice-desc-box m-0 p-0 block",children:[t.jsx("p",{className:"invoice-item-title font-medium text-slate-800 text-[8px] sm:text-[12px] print:text-black m-0 p-0",children:a.name}),t.jsx("span",{className:"invoice-item-tag block text-[6.5px] sm:text-[9px] text-slate-500 uppercase font-bold tracking-tight mt-0.5",children:"Add-on Item"})]})}),t.jsx("td",{className:"px-1.5 py-1 sm:px-3 sm:py-2 text-right font-medium text-slate-800 text-[8px] sm:text-[12px] whitespace-nowrap print:text-black align-top",children:r(a.price)})]},a.id||o)),i.transportCost&&Number(i.transportCost)>0&&t.jsxs("tr",{className:"align-top bg-white",children:[t.jsx("td",{className:"px-1.5 py-1 sm:px-3 sm:py-2 text-center text-slate-800 font-medium border-r border-black align-top",children:l.length+2}),t.jsx("td",{className:"px-1.5 py-1 sm:px-3 sm:py-2 border-r border-black align-top",children:t.jsxs("div",{className:"invoice-desc-box m-0 p-0 block",children:[t.jsx("p",{className:"invoice-item-title font-medium text-slate-800 text-[8px] sm:text-[12px] print:text-black m-0 p-0",children:"Biaya Transport"}),t.jsx("span",{className:"invoice-item-tag block text-[6.5px] sm:text-[9px] text-slate-500 uppercase font-bold tracking-tight mt-0.5",children:"Logistik & Operasional"})]})}),t.jsx("td",{className:"px-1.5 py-1 sm:px-3 sm:py-2 text-right font-medium text-slate-800 text-[8px] sm:text-[12px] whitespace-nowrap print:text-black align-top",children:r(Number(i.transportCost))})]}),x.map((a,o)=>{const j=i.transportCost&&Number(i.transportCost)>0?1:0,$=2+l.length+j+o;return t.jsxs("tr",{className:"align-top bg-white",children:[t.jsx("td",{className:"px-1.5 py-1 sm:px-3 sm:py-2 text-center text-slate-800 font-medium border-r border-black align-top",children:$}),t.jsx("td",{className:"px-1.5 py-1 sm:px-3 sm:py-2 border-r border-black align-top",children:t.jsx("div",{className:"invoice-desc-box m-0 p-0 block",children:t.jsx("p",{className:"invoice-item-title font-medium text-slate-800 text-[8px] sm:text-[12px] print:text-black m-0 p-0",children:a.description})})}),t.jsx("td",{className:"px-1.5 py-1 sm:px-3 sm:py-2 text-right font-medium text-slate-800 text-[8px] sm:text-[12px] whitespace-nowrap print:text-black align-top",children:r(a.amount)})]},a.id||o)})]})]})}),t.jsxs("div",{className:"invoice-totals avoid-break flex flex-row justify-between items-start gap-2 sm:gap-4 border-t border-slate-100 pt-2.5 sm:pt-4 print:border-slate-200",children:[t.jsxs("div",{className:"flex-1 min-w-0",children:[t.jsxs("div",{className:"invoice-payment-box bg-slate-50 p-2 sm:p-3.5 rounded border border-slate-100 print:bg-white print:border-slate-200",children:[t.jsx("h5",{className:"invoice-section-label text-[7px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 sm:mb-1.5",children:"Informasi Pembayaran"}),t.jsx("p",{className:"invoice-bank-text text-[8px] sm:text-[12px] font-bold text-slate-800 mb-0.5 sm:mb-1 print:text-black",children:n.bankAccount}),t.jsx("p",{className:"invoice-payment-note text-[7px] sm:text-[10px] text-slate-500 leading-snug sm:leading-relaxed print:text-black",children:"Silakan kirimkan bukti transfer melalui Whatsapp atau Portal Client setelah melakukan pembayaran."})]}),t.jsxs("div",{className:"invoice-terms mt-1.5 sm:mt-2.5 text-[6.5px] sm:text-[9.5px] text-slate-400 italic leading-snug sm:leading-relaxed print:text-slate-500 whitespace-pre-line",children:['"',n.termsAndConditions||"Terima kasih telah mempercayai layanan kami. Kepuasan Anda adalah prioritas kami.",'"']})]}),t.jsxs("div",{className:"invoice-total-panel w-[140px] sm:w-[280px] shrink-0 space-y-1 sm:space-y-1.5",children:[t.jsxs("div",{className:"invoice-total-row flex justify-between text-[8px] sm:text-[12px] text-slate-600 px-1.5 sm:px-2 print:text-black",children:[t.jsx("span",{children:"Subtotal"}),t.jsx("span",{className:"font-medium",children:r(b)})]}),i.discountAmount?t.jsxs("div",{className:"invoice-total-row flex justify-between text-[8px] sm:text-[12px] text-red-600 px-1.5 sm:px-2 font-medium",children:[t.jsx("span",{children:"Diskon"}),t.jsxs("span",{children:["-",r(i.discountAmount)]})]}):null,t.jsx("div",{className:"h-px bg-slate-200 my-0.5 sm:my-1"}),t.jsxs("div",{className:"invoice-grand-total flex justify-between items-center px-1.5 py-1 sm:px-2.5 sm:py-1.5 bg-slate-100 rounded print:bg-white print:border print:border-slate-200",children:[t.jsx("span",{className:"invoice-total-label text-[7px] sm:text-[11px] font-black text-slate-600 uppercase print:text-black",children:"Grand Total"}),t.jsx("span",{className:"invoice-grand-val text-[9.5px] sm:text-lg font-black text-brand-accent print:text-black tracking-tight",children:r(i.totalCost)})]}),t.jsxs("div",{className:"invoice-total-row flex justify-between text-[7.5px] sm:text-[11px] text-green-600 px-1.5 sm:px-2 pt-0.5 font-bold",children:[t.jsx("span",{children:"Sudah Dibayar"}),t.jsx("span",{children:r(i.amountPaid||0)})]}),t.jsxs("div",{className:"invoice-balance-due flex justify-between items-center px-1.5 py-1 sm:px-2.5 sm:py-1.5 border sm:border-2 border-brand-accent/20 rounded-md mt-0.5 sm:mt-1 bg-brand-accent/5 print:bg-white print:border-slate-800",children:[t.jsx("span",{className:"invoice-total-label text-[7px] sm:text-[11px] font-black text-brand-accent uppercase print:text-black",children:"Sisa Tagihan"}),t.jsx("span",{className:"invoice-balance-val text-[9px] sm:text-base font-black text-brand-accent print:text-black tracking-tight",children:r(i.totalCost-(i.amountPaid||0))})]})]})]}),t.jsxs("div",{className:"invoice-signature-section avoid-break grid grid-cols-3 gap-2 sm:gap-6 pt-2.5 sm:pt-4 border-t border-slate-100 print:border-slate-200",children:[t.jsx("div",{className:"col-span-2 flex items-end justify-center pb-1 sm:pb-2",children:t.jsx("p",{className:"invoice-footer-note text-[6.5px] sm:text-[9px] text-slate-400 text-center uppercase tracking-widest font-black",children:"Dicetak Otomatis oleh Sistem Portofolio Weddfin"})}),t.jsxs("div",{className:"text-center flex flex-col items-center",children:[t.jsx("p",{className:"invoice-section-label text-[7px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-2",children:"Hormat Kami,"}),t.jsx("div",{className:"invoice-signature-box h-10 sm:h-14 w-full flex items-center justify-center",children:i.invoiceSignature||n.signatureBase64?t.jsx("img",{src:i.invoiceSignature||n.signatureBase64,alt:"Tanda Tangan",className:"invoice-signature-img h-9 sm:h-14 w-auto max-w-full object-contain grayscale mx-auto block"}):t.jsx("div",{className:"h-px w-14 sm:w-24 bg-slate-200 mx-auto mt-3 sm:mt-6 print:bg-slate-300"})}),t.jsx("p",{className:"invoice-signer-name text-[8px] sm:text-[12px] font-bold text-slate-800 mt-1 sm:mt-1.5 print:text-black underline underline-offset-2 sm:underline-offset-4 decoration-slate-300",children:n.authorizedSigner}),t.jsx("p",{className:"invoice-footer-note text-[6.5px] sm:text-[9px] font-black text-slate-400 uppercase mt-0.5 tracking-tighter",children:n.companyName})]})]})]}),t.jsx("style",{dangerouslySetInnerHTML:{__html:`
        /* Explicitly style and protect the invoice document from outside index.css pollution */
        #${e}, .invoice-container {
          width: 100% !important;
          max-width: 800px;
          box-sizing: border-box !important;
          background-color: #ffffff !important;
          color: #0f172a !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          -webkit-font-smoothing: antialiased !important;
          overflow: visible !important;
        }
        .force-desktop,
        .html2pdf__container #${e},
        .html2pdf__container .invoice-container {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          box-shadow: none !important;
          border-left: none !important;
          border-right: none !important;
          overflow: visible !important;
        }
        #${e} *, .invoice-container * {
          box-sizing: border-box !important;
        }
        #${e} .invoice-table-wrapper, .invoice-container .invoice-table-wrapper {
          page-break-inside: auto !important;
          break-inside: auto !important;
          overflow: visible !important;
          border: none !important;
        }
        #${e} table, .invoice-container table {
          border-collapse: collapse !important;
          border: 1.5px solid #000000 !important;
          width: 100% !important;
          table-layout: fixed !important;
          background-color: #ffffff !important;
          page-break-inside: auto !important;
          break-inside: auto !important;
        }
        #${e} thead, .invoice-container thead {
          display: table-header-group !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        #${e} thead tr, .invoice-container thead tr {
          background-color: #f8fafc !important;
          border-bottom: 1.5px solid #000000 !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        #${e} thead th, .invoice-container thead th {
          background-color: #f8fafc !important;
          border: 1px solid #000000 !important;
          border-top: none !important;
          padding: 7px 10px !important;
          font-size: 10px !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          color: #000000 !important;
          vertical-align: top !important;
        }
        #${e} tbody, .invoice-container tbody {
          page-break-inside: auto !important;
          break-inside: auto !important;
        }
        #${e} tbody tr, .invoice-container tbody tr {
          background-color: #ffffff !important;
          border-bottom: 1px solid #000000 !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          vertical-align: top !important;
        }
        #${e} tbody tr:nth-child(even), .invoice-container tbody tr:nth-child(even) {
          background-color: #ffffff !important;
        }
        #${e} {
          width: 100% !important;
          max-width: 800px;
          box-sizing: border-box !important;
          background-color: #ffffff !important;
        }
        .force-desktop,
        .html2pdf__container #${e} {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          box-shadow: none !important;
        }
        #${e} tbody td, .invoice-container tbody td {
          border: 1px solid #000000 !important;
          padding: 6px 10px !important;
          padding-top: 6px !important;
          padding-bottom: 6px !important;
          background-color: #ffffff !important;
          vertical-align: top !important;
          color: #000000 !important;
          line-height: 1.15 !important;
        }
        #${e} p, .invoice-container p {
          margin: 0 !important;
          line-height: 1.35 !important;
        }
        #${e} tbody td .invoice-desc-box,
        .invoice-container tbody td .invoice-desc-box {
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
        }
        #${e} tbody td .invoice-item-title,
        .invoice-container tbody td .invoice-item-title {
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1.15 !important;
          display: block !important;
        }
        #${e} tbody td .invoice-item-title-main,
        .invoice-container tbody td .invoice-item-title-main {
          line-height: 1.08 !important;
        }
        #${e} tbody td .invoice-item-sub,
        .invoice-container tbody td .invoice-item-sub {
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1.25 !important;
        }
        #${e} tbody td .invoice-item-tag,
        .invoice-container tbody td .invoice-item-tag {
          margin-top: 2px !important;
          margin-bottom: 0 !important;
          padding: 0 !important;
          line-height: 1.15 !important;
          display: block !important;
        }
        @media (max-width: 768px) {
          #${e}:not(.force-desktop) {
            overflow: hidden !important;
          }
          #${e}:not(.force-desktop) .invoice-header {
            padding: 10px 12px !important;
          }
          #${e}:not(.force-desktop) .invoice-header-content {
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
            gap: 8px !important;
            width: 100% !important;
          }
          #${e}:not(.force-desktop) .invoice-brand-panel {
            flex: 1 1 0% !important;
            min-width: 0 !important;
            width: auto !important;
            max-width: 56% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          #${e}:not(.force-desktop) .invoice-meta-panel {
            flex: 0 0 auto !important;
            width: auto !important;
            max-width: 44% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-end !important;
            text-align: right !important;
          }
          #${e}:not(.force-desktop) .invoice-body {
            padding: 10px 12px !important;
          }
          #${e}:not(.force-desktop) .invoice-logo {
            display: block !important;
            height: 32px !important;
            max-height: 32px !important;
            width: auto !important;
            max-width: 120px !important;
            object-fit: contain !important;
            object-position: left center !important;
            margin-bottom: 2px !important;
          }
          #${e}:not(.force-desktop) .invoice-title {
            font-size: 14px !important;
            line-height: 1.1 !important;
            color: var(--color-accent, #3b82f6) !important;
            text-align: right !important;
            margin-bottom: 3px !important;
          }
          #${e}:not(.force-desktop) .invoice-meta-badge {
            font-size: 7px !important;
            padding: 2px 6px !important;
            white-space: nowrap !important;
            margin-bottom: 3px !important;
          }
          #${e}:not(.force-desktop) .invoice-company-meta {
            width: 100% !important;
            max-width: 100% !important;
            overflow-wrap: break-word !important;
            word-break: break-word !important;
          }
          #${e}:not(.force-desktop) .invoice-company-meta p {
            font-size: 7px !important;
            line-height: 1.35 !important;
            white-space: normal !important;
            overflow-wrap: break-word !important;
            word-break: break-word !important;
          }
          #${e}:not(.force-desktop) .invoice-meta-text {
            text-align: right !important;
            width: 100% !important;
          }
          #${e}:not(.force-desktop) .invoice-meta-text p,
          #${e}:not(.force-desktop) .invoice-meta-text span {
            font-size: 7px !important;
            line-height: 1.35 !important;
            white-space: nowrap !important;
            text-align: right !important;
          }
          #${e}:not(.force-desktop) .invoice-section {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
            padding-bottom: 8px !important;
          }
          #${e}:not(.force-desktop) .invoice-section > div {
            min-width: 0 !important;
            overflow-wrap: break-word !important;
            word-break: break-word !important;
          }
          #${e}:not(.force-desktop) .invoice-party-meta p,
          #${e}:not(.force-desktop) .invoice-party-meta span {
            font-size: 7px !important;
            line-height: 1.3 !important;
          }
          #${e}:not(.force-desktop) .invoice-section-label {
            font-size: 6.5px !important;
            line-height: 1.2 !important;
          }
          #${e}:not(.force-desktop) .invoice-party-name {
            font-size: 9.5px !important;
            line-height: 1.25 !important;
          }
          #${e}:not(.force-desktop) .invoice-table-wrapper {
            overflow-x: hidden !important;
            display: block !important;
            width: 100% !important;
            margin-bottom: 10px !important;
          }
          #${e}:not(.force-desktop) table {
            table-layout: fixed !important;
            min-width: 0 !important;
            width: 100% !important;
            font-size: 7.5px !important;
            border: 1px solid #000000 !important;
          }
          #${e}:not(.force-desktop) thead th,
          #${e}:not(.force-desktop) tbody td {
            font-size: 7.5px !important;
            padding: 3.5px 5px !important;
            padding-top: 3.5px !important;
            padding-bottom: 3.5px !important;
            line-height: 1.15 !important;
            vertical-align: top !important;
          }
          #${e}:not(.force-desktop) thead th {
            font-size: 7px !important;
            letter-spacing: 0.03em !important;
            white-space: nowrap !important;
          }
          #${e}:not(.force-desktop) .invoice-item-title {
            font-size: 8px !important;
            line-height: 1.15 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #${e}:not(.force-desktop) .invoice-item-title-main {
            line-height: 1.1 !important;
          }
          #${e}:not(.force-desktop) .invoice-item-sub {
            font-size: 6.5px !important;
            line-height: 1.25 !important;
          }
          #${e}:not(.force-desktop) .invoice-item-tag {
            font-size: 6px !important;
            line-height: 1.15 !important;
          }
          #${e}:not(.force-desktop) tbody td:first-child {
            width: 8% !important;
          }
          #${e}:not(.force-desktop) tbody td:nth-child(2) {
            width: 66% !important;
          }
          #${e}:not(.force-desktop) tbody td:nth-child(3) {
            width: 26% !important;
            white-space: nowrap !important;
            text-align: right !important;
            font-size: 7.5px !important;
          }
          #${e}:not(.force-desktop) .invoice-totals {
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
            gap: 10px !important;
            padding: 8px 0 0 0 !important;
            background: transparent !important;
            border-left: none !important;
            border-right: none !important;
            border-bottom: none !important;
            border-radius: 0 !important;
            margin-bottom: 0 !important;
          }
          #${e}:not(.force-desktop) .invoice-payment-box {
            padding: 6px 8px !important;
          }
          #${e}:not(.force-desktop) .invoice-bank-text {
            font-size: 7.5px !important;
            line-height: 1.25 !important;
          }
          #${e}:not(.force-desktop) .invoice-payment-note {
            font-size: 6.5px !important;
            line-height: 1.25 !important;
          }
          #${e}:not(.force-desktop) .invoice-terms {
            font-size: 6px !important;
            line-height: 1.25 !important;
          }
          #${e}:not(.force-desktop) .invoice-total-panel {
            width: 43% !important;
            min-width: 132px !important;
            max-width: 165px !important;
          }
          #${e}:not(.force-desktop) .invoice-total-row,
          #${e}:not(.force-desktop) .invoice-grand-total,
          #${e}:not(.force-desktop) .invoice-balance-due {
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            white-space: nowrap !important;
          }
          #${e}:not(.force-desktop) .invoice-total-row,
          #${e}:not(.force-desktop) .invoice-total-row span {
            font-size: 7px !important;
            line-height: 1.2 !important;
            white-space: nowrap !important;
          }
          #${e}:not(.force-desktop) .invoice-total-label {
            font-size: 6.5px !important;
            line-height: 1.15 !important;
            white-space: nowrap !important;
          }
          #${e}:not(.force-desktop) .invoice-grand-val {
            font-size: 8.5px !important;
            line-height: 1.15 !important;
            white-space: nowrap !important;
          }
          #${e}:not(.force-desktop) .invoice-balance-val {
            font-size: 8px !important;
            line-height: 1.15 !important;
            white-space: nowrap !important;
          }
          #${e}:not(.force-desktop) .invoice-signature-section {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 8px !important;
            padding: 8px 0 0 0 !important;
            box-shadow: none !important;
            border-left: none !important;
            border-right: none !important;
            border-bottom: none !important;
            border-radius: 0 !important;
          }
          #${e}:not(.force-desktop) .invoice-signature-box {
            height: 36px !important;
            min-height: 36px !important;
            width: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          #${e}:not(.force-desktop) .invoice-signature-img {
            display: block !important;
            height: 32px !important;
            max-height: 32px !important;
            width: auto !important;
            max-width: 100% !important;
            object-fit: contain !important;
            margin: 0 auto !important;
          }
          #${e}:not(.force-desktop) .invoice-signer-name {
            font-size: 7.5px !important;
            line-height: 1.2 !important;
          }
          #${e}:not(.force-desktop) .invoice-footer-note {
            font-size: 6px !important;
            line-height: 1.2 !important;
          }
        }
        .avoid-break {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .html2pdf-pad-row td {
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
          background: transparent !important;
        }

        @media print {
          @page {
            margin: 6mm 8mm !important;
            size: A4 portrait;
          }
          body * { 
            visibility: hidden !important; 
          }
          #${e}, #${e} * { 
            visibility: visible !important; 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #${e} {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}})]})};export{A as I};
