const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/vendor-html2pdf-Ce4p5aKT.js","assets/vendor-react-BR18iUFV.js","assets/vendor-html2canvas-npP2JtOW.js"])))=>i.map(i=>d[i]);
import{_ as p}from"./vendor-supabase-eAJN3mNY.js";const c=async(n,d,a)=>{const s=document.getElementById(n);if(!s)throw new Error(`Element with id ${n} not found`);const l=a?.margin!==void 0?Array.isArray(a.margin)?[a.margin[0],a.margin[1],a.margin[2],a.margin[3]]:[a.margin,a.margin,a.margin,a.margin]:[12,12,12,12],o=Math.round((210-l[1]-l[3])/25.4*96),h={margin:l,filename:d,image:{type:"jpeg",quality:.98},html2canvas:{scale:a?.scale||1.5,useCORS:!0,allowTaint:!0,logging:!1,windowWidth:a?.windowWidth||794,scrollX:0,scrollY:0,onclone:i=>{const e=i.getElementById(n);if(e){e.style.opacity="1",e.style.visibility="visible",e.style.transform="none",e.style.width=`${o}px`,e.style.maxWidth=`${o}px`,e.style.minWidth="0",e.style.margin="0 auto",e.style.boxSizing="border-box",e.style.boxShadow="none",e.style.overflow="visible",e.style.height="auto",e.style.maxHeight="none",e.style.padding="0",e.classList.add("force-desktop");const t=e.parentElement;t&&(t.style.opacity="1",t.style.visibility="visible",t.style.overflow="visible",t.style.maxHeight="none",t.style.height="auto")}try{i.body.style.height="auto",i.body.style.maxHeight="none",i.body.style.overflow="visible",i.body.style.margin="0"}catch{}i.querySelectorAll('.pdf-page-wrapper, .modal-content-area, [class*="max-h-"], [class*="overflow-hidden"], [class*="max-height"]').forEach(t=>{try{t.style.maxHeight="none",t.style.height="auto",t.style.overflow="visible",t.style.boxShadow="none"}catch{}});const r=i.querySelector(".html2pdf__container");r&&(r.style.boxSizing="border-box",r.style.overflow="visible",r.style.maxHeight="none",r.style.height="auto");try{const t=i.createElement("style");t.type="text/css",t.appendChild(i.createTextNode(`
                        html, body {
                          margin: 0 !important;
                          padding: 0 !important;
                          width: 100% !important;
                          height: auto !important;
                          max-height: none !important;
                          overflow: visible !important;
                        }
                        .avoid-break { page-break-inside: avoid !important; break-inside: avoid !important; }
                        .section-title {
                          page-break-after: avoid !important;
                          break-after: avoid !important;
                          page-break-inside: avoid !important;
                          break-inside: avoid !important;
                        }
                                                .contract-document,
                        .document-page,
                        .page,
                        .pdf-page {
                                                    width: ${o}px !important;
                                                    max-width: ${o}px !important;
                          min-width: 0 !important;
                          overflow: visible !important;
                          max-height: none !important;
                          height: auto !important;
                          box-sizing: border-box !important;
                        }
                        .html2pdf__container {
                          overflow: visible !important;
                          max-height: none !important;
                          height: auto !important;
                        }
                        p, li, td, th {
                          orphans: 2;
                          widows: 2;
                          overflow-wrap: anywhere;
                          word-break: break-word;
                        }
                    `)),i.head.appendChild(t)}catch{}}},pagebreak:{mode:a?.pagebreak?.mode||["css","legacy"],before:a?.pagebreak?.before||[".page-break"],avoid:a?.pagebreak?.avoid||["tr",".avoid-break","thead","tbody"]},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}},m=await p(()=>import("./vendor-html2pdf-Ce4p5aKT.js").then(i=>i.h),__vite__mapDeps([0,1,2]));return await(m.default||m)().from(s).set(h).output("blob")};export{c as g};
