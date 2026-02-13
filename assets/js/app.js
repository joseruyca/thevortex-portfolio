
const $ = s => document.querySelector(s); const $$ = s => Array.from(document.querySelectorAll(s));
const cursor = $("#cursor"); if(cursor){ addEventListener("pointermove", e => { cursor.style.left = e.clientX+"px"; cursor.style.top = e.clientY+"px"; }); }
const prog = $("#progress"); if(prog){ addEventListener("scroll", () => { const h = document.documentElement; const p = h.scrollTop / (h.scrollHeight - h.clientHeight); prog.style.transform = `scaleX(${p})`; const dot = document.querySelector(".vortex-dot"); if(dot) dot.style.transform = `translateY(${p*88}vh)`; const m = $("#meter"); if(m) m.textContent = Math.round(p*100) + "%"; }, { passive:true }); }
const grid = $("#grid"); addEventListener("keydown", e => { if(e.key.toLowerCase() === "g" && grid){ grid.style.opacity = grid.style.opacity === "1" ? "0" : "1"; } });

// HERO CANVAS
const canvas = $("#hx");
if(canvas){
  const ctx = canvas.getContext("2d"); let w,h; const DPR = Math.min(2, devicePixelRatio||1);
  const P = []; function size(){ w = canvas.width = innerWidth*DPR; h = canvas.height = Math.max(360, innerHeight*0.6)*DPR; }
  function seed(){ P.length = 0; const N = Math.round((w*h)/(30000*DPR)); for(let i=0;i<N;i++){ P.push({x:Math.random()*w,y:Math.random()*h,s:.5+Math.random()}); } }
  let mx = w/2, my = h/2; canvas.addEventListener("pointermove", e => { const r = canvas.getBoundingClientRect(); mx = (e.clientX - r.left)*DPR; my = (e.clientY - r.top)*DPR; });
  function step(){ ctx.clearRect(0,0,w,h); ctx.globalCompositeOperation="lighter"; for(const p of P){ const dx=p.x-mx, dy=p.y-my; const d=Math.hypot(dx,dy)+1e-3; const ang=Math.atan2(dy,dx)+.65/d; p.x+=Math.cos(ang)*p.s; p.y+=Math.sin(ang)*p.s; if(p.x<0)p.x+=w; if(p.x>w)p.x-=w; if(p.y<0)p.y+=h; if(p.y>h)p.y-=h; ctx.fillStyle="rgba(11,141,193,0.06)"; ctx.fillRect(p.x,p.y,1.5*DPR,1.5*DPR); } requestAnimationFrame(step); }
  const init = () => { size(); seed(); step(); }; addEventListener("resize", () => { size(); seed(); }); init();
}

// FEATURED LIST (5) + sticky preview
const DATA = [
  { n:"①", slug:"pickleclub", title:"Pickleclub", year:"2025", scope:"Identity",
    caption:"Retro athletic. Grid‑true wordmark + monogram for motion.",
    sheets:[
      { img:"https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?q=80&w=1600&auto=format&fit=crop", text:"Logo + wordmark" },
      { img:"https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1600&auto=format&fit=crop", text:"Color + typography" },
      { img:"https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop", text:"Applications" }
    ]
  },
  { n:"②", slug:"aventra", title:"Aventra", year:"2024", scope:"Logo System",
    caption:"Kinetic A for climbing gear.",
    sheets:[
      { img:"https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1600&auto=format&fit=crop", text:"Monogram construction" },
      { img:"https://images.unsplash.com/photo-1520975922215-c0e1b1f1fc05?q=80&w=1600&auto=format&fit=crop", text:"Packaging" }
    ]
  },
  { n:"③", slug:"nestly", title:"Nestly", year:"2023", scope:"Wordmark",
    caption:"Calm geometry for interiors.",
    sheets:[
      { img:"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1600&auto=format&fit=crop", text:"Wordmark + spacing" },
      { img:"https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop", text:"Stationery" }
    ]
  },
  { n:"④", slug:"Punto Digital", title:"Punto Digital", year:"2025", scope:"Monogram",
    caption:"Connectivity without cliché.",
    sheets:[
      { img:"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop", text:"Signal ligature" }
    ]
  },
  { n:"⑤", slug:"Lūmiara", title:"Lūmiara", year:"2025", scope:"Identity",
    caption:"Premium, natural, bold.",
    sheets:[
      { img:"https://images.unsplash.com/photo-1452960962994-acf4fd70b632?q=80&w=1600&auto=format&fit=crop", text:"Logotype + seal" },
      { img:"https://images.unsplash.com/photo-1524594227083-65f2d76410b4?q=80&w=1600&auto=format&fit=crop", text:"Label system" }
    ]
  }
];
const list = document.getElementById("list"), stage = document.getElementById("stage"), cap = document.getElementById("cap");
const imgs = stage ? Array.from(stage.querySelectorAll("img")) : [];
function showPrev(i, text){ if(!imgs.length) return; imgs.forEach((im,k)=> im.classList.toggle("active", k===i % imgs.length)); if(cap) cap.textContent = text||""; }
function openSlug(s){ location.href = `cases/${s}.html`; }
if(list){
  DATA.forEach((d,i)=>{
    const li = document.createElement("li");
    li.innerHTML = `<div class="n">${d.n}</div><div class="t">${d.title}</div><div class="y">${d.scope} · ${d.year}</div>`;
    li.addEventListener("mouseenter", () => showPrev(i, d.caption));
    li.addEventListener("click", () => openSlug(d.slug));
    list.appendChild(li);
  });
  showPrev(0, DATA[0].caption);
}
const PAR_MULT = 1.0;
stage && stage.addEventListener("mousemove", e => {
  const r = stage.getBoundingClientRect(); const dx = (e.clientX - r.left)/r.width - .5; const dy = (e.clientY - r.top)/r.height - .5;
  imgs.forEach((im, idx) => { const depth = (idx + 1) * 2 * PAR_MULT; im.style.transform = `translate(${(dx*depth).toFixed(2)}px, ${(dy*depth).toFixed(2)}px) rotate(${(dx*.6).toFixed(2)}deg)`; });
});
stage && stage.addEventListener("mouseleave", () => imgs.forEach(im => { im.style.transform = ""; }));
// Kinetic letters micro interaction
Array.from(document.querySelectorAll(".kinetic .k")).forEach(el => {
  el.addEventListener("mouseenter", () => { el.style.transform = "translateY(-2px) skewY(-4deg)"; });
  el.addEventListener("mouseleave", () => { el.style.transform = ""; });
});

// i18n handled by assets/js/i18n.js
