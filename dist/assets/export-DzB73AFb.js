const E=(s,i,d,l=[])=>{const o=n=>{const e=String(n??"");return e.includes(";")||e.includes('"')||e.includes(`
`)?`"${e.replace(/"/g,'""')}"`:e},c=n=>n.map(o).join(";"),r=["sep=;",...l.map(c),s.map(o).join(";"),...i.map(c)].join(`
`),a="\uFEFF",u=new Blob([a+r],{type:"text/csv;charset=utf-8;"}),m=URL.createObjectURL(u),t=document.createElement("a");t.setAttribute("href",m),t.setAttribute("download",d),t.style.visibility="hidden",document.body.appendChild(t),t.click(),document.body.removeChild(t)};export{E as d};
