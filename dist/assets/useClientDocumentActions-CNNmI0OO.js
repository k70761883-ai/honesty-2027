const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/vendor-html2pdf-C40V6Goj.js","assets/vendor-react-BwyGA0Mb.js","assets/vendor-html2canvas-npP2JtOW.js"])))=>i.map(i=>d[i]);
import{j as a,b as E}from"./vendor-react-BwyGA0Mb.js";import{r as B,P as I,T as A,M as w,p as F,a3 as R,W as L,a1 as T}from"./index-CAZdTYQ7.js";import{S as M}from"./SignaturePad-TVxL61Ck.js";import{I as W}from"./InvoiceDocument-CVWKk4Hr.js";import{P as O}from"./PaymentSlipDocument-DuvxtYbi.js";import{_ as $}from"./vendor-supabase-ZQfPI4cJ.js";const j=e=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0,maximumFractionDigits:0}).format(e),Q=e=>e&&e.replace(/Proyek/g,"Acara Pernikahan").replace(/DP Proyek/g,"DP Acara Pernikahan").replace(/Pelunasan Proyek/g,"Pelunasan Acara Pernikahan").replace(/Pembayaran Proyek/g,"Pembayaran Acara Pernikahan"),Z=e=>{if(!e)return"bg-gray-500/20 text-gray-400";switch(e){case I.LUNAS:return"bg-green-100 text-green-800";case I.DP_TERBAYAR:return"bg-blue-600/20 text-blue-800";case I.BELUM_BAYAR:return"bg-yellow-100 text-yellow-800";default:return"bg-gray-500/20 text-gray-400"}},V=e=>navigator.onLine?!0:(e("Harus online untuk melakukan perubahan"),!1),ee={clientId:"",clientName:"",avatarUrl:"",email:"",phone:"",whatsapp:"",instagram:"",clientType:B.DIRECT,projectId:"",projectName:"",projectType:"",location:"",date:new Date().toISOString().split("T")[0],packageId:"",selectedAddOnIds:[],customItems:[],durationSelection:"",unitPrice:void 0,dp:"",dpDestinationCardId:"",notes:"",accommodation:"",driveLink:"",promoCodeId:"",address:"",homeAddress:""},G=({transaction:e,project:i,profile:n,client:o})=>{const l=n||{},d=l.companyName||"Vendor",f=l.authorizedSigner||d,h=e.vendorSignature||l.signatureBase64,g=r=>new Date(r).toLocaleDateString("id-ID",{year:"numeric",month:"long",day:"numeric"}),m=e.type===A.EXPENSE,P=m?"Bukti Pengeluaran":"Tanda Terima",k=m?"Telah Dibayarkan Secara Sah":"Telah Diterima Secara Sah",v=m?"text-blue-600":"text-green-600";let y=o?.name||"Pengantin";if(m)if(e.category==="Gaji Tim / Vendor"){const r=e.description?.match(/Gaji Freelance - (.+?) \(/);r&&r[1]?y=r[1]:y="Vendor / Tim"}else y="Pihak Lain";return a.jsxs("div",{id:"receipt-document",className:"p-3 sm:p-8 bg-white border border-slate-200 shadow-xl mx-auto w-full font-sans text-slate-900 print:shadow-none print:border-none print:bg-white print:max-w-none",children:[a.jsxs("div",{className:"flex justify-between items-start mb-4 sm:mb-10 pb-3 sm:pb-6 border-b-2 border-brand-accent print:mb-6 print:pb-4",children:[a.jsxs("div",{children:[l.logoBase64?a.jsx("img",{src:l.logoBase64,alt:"Company Logo",className:"h-9 sm:h-16 object-contain mb-1.5 sm:mb-3"}):a.jsx("h2",{className:"text-xs sm:text-xl font-bold text-brand-accent mb-0.5 sm:mb-1",children:d}),a.jsx("p",{className:"text-[8px] sm:text-[11px] text-slate-500",children:l.address||""})]}),a.jsxs("div",{className:"text-right",children:[a.jsx("h1",{className:"text-sm sm:text-2xl font-black text-slate-400 uppercase tracking-widest leading-none",children:P}),a.jsxs("p",{className:"text-[8.5px] sm:text-xs font-mono text-slate-500 mt-1 sm:mt-2",children:["#",e.id.slice(0,8).toUpperCase()]})]})]}),a.jsxs("div",{className:"bg-white p-3 sm:p-6 rounded-lg mb-4 sm:mb-8 border border-slate-100 print:bg-white print:border-slate-200",children:[a.jsx("p",{className:"text-[7.5px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5 sm:mb-1",children:"Status Pembayaran"}),a.jsx("p",{className:`text-[9px] sm:text-xs font-bold ${v} uppercase mb-1.5 sm:mb-3`,children:k}),a.jsx("p",{className:"text-lg sm:text-4xl font-black text-slate-900 tracking-tighter",children:j(e.amount)}),a.jsxs("p",{className:"text-[8.5px] sm:text-xs text-slate-500 mt-1 sm:mt-2",children:["Tanggal: ",a.jsx("span",{className:"font-bold text-slate-700",children:g(e.date)})]})]}),a.jsx("div",{className:"grid grid-cols-1 gap-3 sm:gap-6 mb-4 sm:mb-10",children:a.jsxs("div",{className:"space-y-2 sm:space-y-4",children:[a.jsxs("div",{className:"flex justify-between text-[9.5px] sm:text-sm py-1.5 sm:py-2 border-b border-slate-100",children:[a.jsx("span",{className:"text-slate-500",children:m?"Dibayarkan Kepada":"Diterima Dari"}),a.jsx("span",{className:"font-bold text-slate-800",children:y})]}),a.jsxs("div",{className:"flex justify-between text-[9.5px] sm:text-sm py-1.5 sm:py-2 border-b border-slate-100",children:[a.jsx("span",{className:"text-slate-500",children:"Metode Pembayaran"}),a.jsx("span",{className:"font-bold text-slate-800",children:e.method})]}),a.jsxs("div",{className:"py-2 sm:py-4",children:[a.jsx("p",{className:"text-[7.5px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 sm:mb-2",children:"Tujuan Pembayaran"}),a.jsx("p",{className:"text-[9.5px] sm:text-sm font-medium text-slate-700 leading-relaxed bg-white p-2 sm:p-3 rounded",children:e.description})]}),i&&a.jsxs("div",{className:"p-2.5 sm:p-4 bg-blue-50/50 border border-blue-100 rounded-lg text-[8.5px] sm:text-[12px] text-blue-700",children:[a.jsxs("p",{className:"font-bold mb-0.5 sm:mb-1",children:["Progres Acara Pernikahan Pengantin: ",i.projectName]}),a.jsxs("div",{className:"flex justify-between",children:[a.jsxs("span",{children:["Total Tagihan: ",j(i.totalCost)]}),a.jsxs("span",{className:"font-bold",children:["Sisa: ",j(i.totalCost-i.amountPaid)]})]})]})]})}),a.jsxs("div",{className:"flex justify-between items-end pt-4 sm:pt-8 border-t border-slate-100",children:[a.jsxs("div",{className:"text-[7.5px] sm:text-[10px] text-slate-400 italic",children:["Dicetak otomatis oleh ",d]}),a.jsxs("div",{className:"text-center w-28 sm:w-48 shrink-0",children:[a.jsx("p",{className:"text-[7.5px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 sm:mb-4",children:"Penerima,"}),a.jsx("div",{className:"h-10 sm:h-20 w-full flex items-center justify-center mb-1 sm:mb-2",children:h?a.jsx("img",{src:h,alt:"Tanda Tangan",className:"h-9 sm:h-16 w-auto max-w-full object-contain mx-auto block"}):a.jsx("div",{className:"h-px w-16 sm:w-24 bg-slate-200 mx-auto mt-5 sm:mt-10"})}),a.jsxs("p",{className:"text-[9px] sm:text-sm font-bold text-slate-800 underline underline-offset-4 decoration-slate-300",children:["(",f,")"]})]})]}),a.jsx("style",{dangerouslySetInnerHTML:{__html:`
                #receipt-document {
                    width: 100% !important;
                    max-width: 800px;
                    box-sizing: border-box !important;
                    background-color: #ffffff !important;
                    color: #0f172a !important;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                }
                .force-desktop,
                .html2pdf__container #receipt-document {
                    width: 100% !important;
                    max-width: 100% !important;
                    min-width: 0 !important;
                    margin: 0 !important;
                    box-shadow: none !important;
                    border-left: none !important;
                    border-right: none !important;
                }
                #receipt-document * {
                    box-sizing: border-box !important;
                }
                `}})]})},ae=({documentToView:e,onClose:i,clientForDetail:n,userProfile:o,packages:l,projects:d,isSignatureModalOpen:f,setIsSignatureModalOpen:h,onSaveSignature:g,onEditDocument:m,onDownloadPDF:P,onShareDocumentWA:k,teamMembers:v,teamProjectPayments:y})=>{const r=()=>{if(!e)return null;if(e.type==="invoice"){const t=e.project,s=n||{id:t.clientId||"",name:t.clientName||"Pengantin",phone:"",whatsapp:"",email:"",address:t.address||""};return a.jsx(W,{id:"invoice-document",project:t,profile:o,packages:l,client:s})}else if(e.type==="receipt"){const t=e.transaction,s=t.projectId?d.find(N=>N.id===t.projectId):void 0,c=n||{id:s?.clientId||"",name:s?.clientName||"Pengantin",phone:"",whatsapp:"",email:"",address:s?.address||""};return a.jsx(G,{transaction:t,project:s,profile:o,client:c})}else if(e.type==="slip-gaji")return!v||!y?null:a.jsx(O,{record:e.teamPaymentRecord,teamMembers:v,teamProjectPayments:y,projects:d,userProfile:o});return null},u=e&&(e.type==="invoice"?!!e.project?.invoiceSignature:e.type==="receipt"?!!e.transaction?.vendorSignature:!!e.teamPaymentRecord?.vendorSignature);return a.jsxs(a.Fragment,{children:[a.jsxs(w,{isOpen:!!e,onClose:i,title:e?e.type==="invoice"?"Invoice":e.type==="receipt"?"Tanda Terima":"Slip Gaji":"",size:"4xl",children:[a.jsx("div",{className:"overflow-x-auto rounded-xl border border-slate-200 bg-white",children:a.jsx("div",{id:"invoice",className:"printable-area bg-white !p-0",children:r()})}),a.jsxs("div",{className:"client-document-toolbar mt-3 sm:mt-6 flex flex-wrap justify-end items-center non-printable gap-2 sm:gap-3 border-t border-slate-200 pt-3 sm:pt-4 px-1 sm:px-2",children:[e&&!u&&a.jsx("button",{type:"button",onClick:()=>{o?.signatureBase64?g(o.signatureBase64):h(!0)},className:"client-document-action button-secondary p-2.5",children:"Tanda Tangani"}),a.jsxs("button",{onClick:m,className:"client-document-action button-secondary inline-flex items-center gap-2 p-2.5",title:"Edit Dokumen",children:[a.jsx(F,{className:"w-5 h-5"}),a.jsx("span",{className:"hidden sm:inline",children:"Edit"})]}),a.jsxs("button",{onClick:P,className:"client-document-action button-secondary inline-flex items-center gap-2 p-2.5",title:"Unduh sebagai PDF",children:[a.jsx(R,{className:"w-5 h-5 text-brand-accent"}),a.jsx("span",{className:"hidden sm:inline",children:"Unduh PDF"})]}),a.jsxs("button",{onClick:k,className:"client-document-action btn-box-wa px-4 py-2 text-xs sm:text-sm",title:"Kirim via WhatsApp",children:[a.jsx(L,{className:"w-4 h-4 flex-shrink-0 text-white"}),a.jsx("span",{children:"Kirim ke WA"})]})]})]}),a.jsx(w,{isOpen:f,onClose:()=>h(!1),title:"Bubuhkan Tanda Tangan Anda",children:a.jsx(M,{onClose:()=>h(!1),onSave:g})})]})},H=(e,i,n,o)=>{const l=e.split(" ")[0],d=n.totalCost-n.amountPaid;return`Halo *${l}*! 👋

Berikut kami kirimkan *Invoice* untuk Acara Pernikahan Anda bersama *${i}* 💍

📋 *Detail Tagihan:*
• Acara: ${n.projectName}
• Total Biaya: *${j(n.totalCost)}*
• Sudah Dibayar: ${j(n.amountPaid)}
• Sisa Tagihan: *${j(d)}*

📄 *Lihat & Download Invoice PDF di sini:*
${o}

_(File PDF invoice juga telah kami kirimkan terpisah)_

Terima kasih atas kepercayaan Anda. Semoga acaranya berjalan lancar! 🙏`},U=(e,i,n,o,l)=>{const d=n.type===A.EXPENSE,f=new Date(n.date).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"});if(d){let g="Pihak Lain";if(n.category==="Gaji Tim / Vendor"){const m=n.description?.match(/Gaji Freelance - (.+?) \(/);g=m&&m[1]?m[1]:"Vendor / Tim"}return`Halo *${g}*! 👋

Berikut kami kirimkan *Bukti Pengeluaran / Slip Pembayaran* dari *${i}* ✅

📋 *Detail Pembayaran:*
• Tanggal: ${f}
• Jumlah: *${j(n.amount)}*
• Metode: ${n.method}
• Keterangan: ${n.description}

📄 *Lihat & Download Slip PDF di sini:*
${l}

_(File PDF slip pembayaran juga telah kami kirimkan terpisah)_

Terima kasih! 🙏`}return`Halo *${e.split(" ")[0]}*! 👋

Berikut kami kirimkan *Tanda Terima Pembayaran* untuk Acara Pernikahan Anda bersama *${i}* ✅

📋 *Detail Pembayaran:*
• Acara: ${o}
• Tanggal: ${f}
• Jumlah: *${j(n.amount)}*
• Metode: ${n.method}
• Keterangan: ${n.description}

📄 *Lihat & Download Tanda Terima PDF di sini:*
${l}

_(File PDF tanda terima juga telah kami kirimkan terpisah)_

Terima kasih, pembayaran Anda telah kami terima dengan baik. Semoga persiapannya lancar! 🙏`},te=(e,i,n)=>`Halo ${(e||"").split(" ")[0]}! 👋

Salam dari tim *${i}* 💍

Kami dengan senang hati membagikan *Portal Pengantin* Anda, di mana Anda bisa memantau:
✅ Progres persiapan acara pernikahan Anda
💰 Detail pembayaran & invoice
📋 Package & vendor yang dipilih

🔗 *Akses Portal Anda di sini:*
${n}

Jika ada pertanyaan, jangan ragu menghubungi kami. Semoga membantu! 🙏`,ne=({documentToView:e,clientForDetail:i,userProfile:n,projects:o,showNotification:l,onSignInvoice:d,onSignTransaction:f,setSharePreview:h})=>{const[g,m]=E.useState(!1),P=r=>{e?.type==="invoice"&&e.project?d(e.project.id,r):e?.type==="receipt"&&e.transaction&&f(e.transaction.id,r),m(!1)},k=(r,u)=>({margin:[6,8,6,8],filename:u,image:{type:"jpeg",quality:.98},html2canvas:{scale:2,useCORS:!0,logging:!1,windowWidth:1400,onclone:t=>{const s=t.getElementById(r);s&&(s.style.width="100%",s.style.maxWidth="100%",s.style.minWidth="0",s.style.margin="0",s.style.boxSizing="border-box",s.style.boxShadow="none",s.style.border="none",s.classList.add("force-desktop"));const c=t.querySelector(".html2pdf__container");c&&(c.style.boxSizing="border-box",c.style.overflow="visible"),t.querySelectorAll("tbody > div").forEach(p=>{const b=t.createElement("tr");b.className="html2pdf-pad-row",b.style.border="none",b.style.background="transparent";const x=t.createElement("td");x.colSpan=10,x.style.height=p.style.height||`${p.offsetHeight}px`,x.style.border="none",x.style.padding="0",x.style.margin="0",x.style.background="transparent",b.appendChild(x),p.parentNode&&p.parentNode.replaceChild(b,p)})}},pagebreak:{mode:["css","legacy"],avoid:["tr",".avoid-break"]},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}});return{isSignatureModalOpen:g,setIsSignatureModalOpen:m,handleSaveSignature:P,handleShareDocumentWA:async()=>{if(!e||!i)return;const r=i.whatsapp||i.phone,u=n?.companyName||"Weddfinter";if(e.type==="invoice"){const t=e.project,s="invoice-document",c=document.getElementById(s);if(c){const x=k(s,`Invoice-${t.projectName.replace(/\s+/g,"_")}.pdf`),D=(await $(async()=>{const{default:S}=await import("./vendor-html2pdf-C40V6Goj.js").then(_=>_.h);return{default:S}},__vite__mapDeps([0,1,2]))).default;D().from(c).set(x).save()}const N=window.location.pathname.replace(/index\.html$/,""),p=`${window.location.origin}${N}#/portal/invoice/${T(t.projectName)}`,b=H(i.name,u,t,p);h({title:`Bagikan Invoice - ${t.projectName}`,message:b,phone:r})}else if(e.type==="receipt"){const t=e.transaction,s="receipt-document",c=document.getElementById(s);if(c){const D=k(s,`Tanda_Terima-${t.id.slice(0,8)}.pdf`),S=(await $(async()=>{const{default:_}=await import("./vendor-html2pdf-C40V6Goj.js").then(C=>C.h);return{default:_}},__vite__mapDeps([0,1,2]))).default;S().from(c).set(D).save()}const N=window.location.pathname.replace(/index\.html$/,""),p=`${window.location.origin}${N}#/portal/receipt/${t.id}`,b=t.projectId&&o.find(D=>D.id===t.projectId)?.projectName||"",x=U(i.name,u,t,b,p);h({title:`Bagikan Tanda Terima - ${t.id.slice(0,8).toUpperCase()}`,message:x,phone:r})}},handleDownloadPDF:async()=>{if(!e)return;const r=e.type==="invoice"?"invoice-document":e.type==="receipt"?"receipt-document":`payment-slip-content-${e.teamPaymentRecord.id}`,u=document.getElementById(r);if(!u){l("Gagal menemukan elemen dokumen untuk diunduh.");return}const t=e.type==="invoice"?`Invoice-${e.project.projectName.replace(/[\\/:*?"<>|\s]+/g,"_")}.pdf`:e.type==="receipt"?`Tanda_Terima-${e.transaction.id.slice(0,8)}.pdf`:`Slip-Gaji-${(e.teamPaymentRecord.recordNumber||e.teamPaymentRecord.id.slice(0,8)).replace(/[\\/:*?"<>|\s]+/g,"_")}.pdf`;try{const s=k(r,t),c=await $(()=>import("./vendor-html2pdf-C40V6Goj.js").then(p=>p.h),__vite__mapDeps([0,1,2]));await(c.default||c)().set(s).from(u).save()}catch{l("Gagal membuat PDF. Membuka dialog cetak sebagai alternatif."),window.print()}}}};export{ae as C,te as a,V as e,j as f,Z as g,ee as i,Q as n,ne as u};
