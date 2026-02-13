(function(){
  const featuredGrid = document.getElementById("featuredGrid");
  const archiveGrid = document.getElementById("archiveGrid");
  const chips = document.getElementById("chips");
  const q = document.getElementById("q");
  const empty = document.getElementById("empty");

  if(!featuredGrid || !archiveGrid) return;

  const DATA = [
    { slug:"pickleclub", title:"Pickleclub", scope:"identity", featured:true, metaKey:"projects.meta.pickleclub", img:"assets/img/projects/pickleclub/pickleclub_02.png", href:"cases/pickleclub.html" },
    { slug:"aventra", title:"Aventra", scope:"logo_system", featured:true, metaKey:"projects.meta.aventra", img:"assets/img/projects/aventra/aventra_02.png", href:"cases/aventra.html" },
    { slug:"Lūmiara", title:"Lūmiara", scope:"identity", featured:true, metaKey:"projects.meta.the_ferm", img:"assets/img/projects/Lūmiara/the-ferm_02.png", href:"cases/the-ferm.html" },
    { slug:"Punto Digital", title:"Punto Digital", scope:"wordmark", featured:false, metaKey:"projects.meta.Punto Digital", img:"assets/img/projects/Puntodigital/esim_01.png", href:"cases/Punto Digital.html" },
    { slug:"Nestly", title:"Nestly", scope:"wordmark", featured:false, metaKey:"projects.meta.nestly", img:"assets/img/projects/nestly/nestly_01.png", href:"cases/nestly.html" },
  ];

  const SCOPE_KEYS = {
    all: "projects.filter_all",
    identity: "projects.filter_identity",
    logo_system: "projects.filter_logo_system",
    monogram: "projects.filter_monogram",
    wordmark: "projects.filter_wordmark",
  };

  let state = { filter:"all", query:"" };

  function scopeLabel(scope){
    const key = SCOPE_KEYS[scope] || null;
    const lang = window.tvI18n?.getLang?.() || "en";
    const val = key ? window.tvI18n?.t?.(key, lang) : null;
    if(val) return val;
    // fallback
    return scope.replace(/_/g," ");
  }

  function chipButton(scope){
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.dataset.scope = scope;
    b.textContent = scopeLabel(scope);
    b.addEventListener("click", ()=>{
      state.filter = scope;
      syncChips();
      render();
    });
    return b;
  }

  function buildChips(){
    if(!chips) return;
    chips.innerHTML = "";
    const unique = ["all", ...Array.from(new Set(DATA.map(d=>d.scope)))];
    unique.forEach(s=> chips.appendChild(chipButton(s)));
    syncChips();
  }

  function syncChips(){
    chips?.querySelectorAll(".chip").forEach(b=>{
      b.classList.toggle("is-active", b.dataset.scope === state.filter);
    });
  }

  function matches(d){
    const f = state.filter;
    const qv = state.query.trim().toLowerCase();
    const okFilter = (f === "all") ? true : d.scope === f;
    const okQuery = !qv ? true : (d.title.toLowerCase().includes(qv));
    return okFilter && okQuery;
  }

  function card(d){
    const a = document.createElement("article");
    a.className = "pcard";
    a.tabIndex = 0;
    a.setAttribute("role","link");
    a.setAttribute("aria-label", d.title);

    a.innerHTML = `
      <img class="pcard__img" src="${d.img}" alt="${d.title}">
      <div class="pcard__body">
        <div>
          <div class="pcard__title">${d.title}</div>
        </div>
        <div class="pcard__meta">${scopeLabel(d.scope)}</div>
      </div>`;

    const go = ()=>{ window.location.href = d.href; };
    a.addEventListener("click", go);
    a.addEventListener("keydown", (e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); go(); }});
    return a;
  }

  function render(){
    const list = DATA.filter(matches);
    const featured = list.filter(d=>d.featured);
    const archive = list.filter(d=>!d.featured);

    featuredGrid.innerHTML = "";
    archiveGrid.innerHTML = "";

    featured.forEach(d=> featuredGrid.appendChild(card(d)));
    archive.forEach(d=> archiveGrid.appendChild(card(d)));

    const any = list.length > 0;
    if(empty) empty.hidden = any;
  }

  if(q){
    q.addEventListener("input", ()=>{
      state.query = q.value || "";
      render();
    });
  }

  buildChips();
  render();

  // Re-translate chips & card metas on language change
  window.addEventListener("tv:lang", ()=>{
    // update chip labels
    chips?.querySelectorAll(".chip").forEach(b=>{
      b.textContent = scopeLabel(b.dataset.scope);
    });
    // update card metas
    document.querySelectorAll(".pcard__meta").forEach((el, idx)=>{
      // safer to re-render to update all
    });
    render();
  });
})();