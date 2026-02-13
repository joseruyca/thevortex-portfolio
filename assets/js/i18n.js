(function(){
  const STORAGE_KEY = "tv_lang_v2"; // v2 to force EN default when old value exists
  const DEFAULT_LANG = "en";

  const DICT = {
    en: {
      "nav.home":"Home",
      "nav.projects":"Projects",
      "nav.about":"About",
      "nav.contact":"Contact",
      "nav.back_home":"Back home",
      "nav.back_projects":"Back to projects",

      "intro.prefix":"Designing",
      "intro.item.logos":"logos.",
      "intro.item.identities":"identities.",
      "intro.item.systems":"systems.",
      "intro.item.wordmarks":"wordmarks.",
      "intro.item.monograms":"monograms.",
      "intro.item.posters":"posters.",
      "intro.item.motion":"motion.",

      "hero.word1":"BRAND",
      "hero.word2":"IDENTITY",
      "hero.word3":"DESIGN",
      "hero.lead":"Built to last. Made to stand out.",
      "hero.learn_more":"● Learn more",
      "hero.view_featured":"View featured ●",

      "home.select_works":"Select Works",
      "home.view_all":"View all",
      "home.hover":"Hover a project",
      "ticker.text":"AVAILABLE FOR LOGO & BRANDING COMMISSIONS • TURNAROUND 1–2 WEEKS • ",

      "about.title":"About",
      "about.body":"Designing brand identities since 2014 — logos, wordmarks and visual systems built for real‑world use across digital and print. I work closely with clients to define the idea, refine the details, and deliver assets that stay consistent over time.",


      "projects.title":"Projects",
      "projects.subtitle":"Logo & brand systems crafted to feel sharp, simple and alive.",
      "projects.search_ph":"Search project…",
      "projects.featured":"Featured",
      "projects.archive":"Archive",
      "projects.filter_all":"All",
      "projects.filter_identity":"Identity",
      "projects.filter_logo_system":"Logo system",
      "projects.filter_monogram":"Monogram",
      "projects.filter_wordmark":"Wordmark",
      "projects.empty":"No projects found.",
      "projects.meta.pickleclub":"Brand identity",
      "projects.meta.aventra":"Logo system",
      "projects.meta.the_ferm":"Identity direction",
      "projects.meta.Punto Digital":"Wordmark + symbol",
      "projects.meta.nestly":"Wordmark",


      "contact.title":"Contact",
      "contact.instagram":"Instagram",
      "contact.email":"Email",
      "contact.etsy":"Etsy shop",
      "contact.behance":"Behance",
    },
    es: {
      "nav.home":"Inicio",
      "nav.projects":"Proyectos",
      "nav.about":"Sobre mí",
      "nav.contact":"Contacto",
      "nav.back_home":"Volver al inicio",
      "nav.back_projects":"Volver a proyectos",

      "intro.prefix":"Diseñando",
      "intro.item.logos":"logos.",
      "intro.item.identities":"identidades.",
      "intro.item.systems":"sistemas.",
      "intro.item.wordmarks":"logotipos.",
      "intro.item.monograms":"monogramas.",
      "intro.item.posters":"pósters.",
      "intro.item.motion":"animación.",

      "hero.word1":"MARCA",
      "hero.word2":"IDENTIDAD",
      "hero.word3":"DISEÑO",
      "hero.lead":"Hecho para durar. Diseñado para destacar.",
      "hero.learn_more":"● Saber más",
      "hero.view_featured":"Ver destacados ●",
      "home.select_works":"Selección",
      "home.view_all":"Ver todo",
      "home.hover":"Pasa por un proyecto",
      "ticker.text":"DISPONIBLE PARA ENCARGOS DE LOGO Y BRANDING • ENTREGA 1–2 SEMANAS • ",
      "about.title":"Sobre mí",
      "about.body":"Diseñando identidades de marca desde 2014: logos, wordmarks y sistemas visuales pensados para funcionar en digital e impresión. Trabajo de cerca con cada cliente para definir el concepto, pulir los detalles y entregar un sistema coherente y consistente en el tiempo.",

      "projects.title":"Proyectos",
      "projects.subtitle":"Logos y sistemas de marca pensados para sentirse modernos, claros y vivos.",
      "projects.search_ph":"Buscar proyecto…",
      "projects.featured":"Destacados",
      "projects.archive":"Archivo",
      "projects.filter_all":"Todos",
      "projects.filter_identity":"Identidad",
      "projects.filter_logo_system":"Sistema de logo",
      "projects.filter_monogram":"Monograma",
      "projects.filter_wordmark":"Wordmark",
      "projects.empty":"No se han encontrado proyectos.",
      "projects.meta.pickleclub":"Identidad de marca",
      "projects.meta.aventra":"Sistema de logo",
      "projects.meta.the_ferm":"Dirección de identidad",
      "projects.meta.Punto Digital":"Wordmark + símbolo",
      "projects.meta.nestly":"Wordmark",


      "contact.title":"Contacto",
      "contact.instagram":"Instagram",
      "contact.email":"Correo",
      "contact.etsy":"Tienda Etsy",
      "contact.behance":"Behance",
    }
  };

  function getStoredLang(){
    try{ return localStorage.getItem(STORAGE_KEY); }catch(_){ return null; }
  }
  function storeLang(lang){
    try{ localStorage.setItem(STORAGE_KEY, lang); }catch(_){}
  }
  function getLang(){
    const l = (getStoredLang() || DEFAULT_LANG).toLowerCase();
    return (l === "es" || l === "en") ? l : DEFAULT_LANG;
  }

  function t(key, lang){
    const L = DICT[lang] || DICT[DEFAULT_LANG];
    return (L && Object.prototype.hasOwnProperty.call(L, key)) ? L[key] : null;
  }

  function applyI18n(lang){
    document.documentElement.lang = lang;

    // text nodes
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.getAttribute("data-i18n");
      const value = t(key, lang);
      if(value !== null && value !== undefined){
        el.textContent = value;
      }
    });

    // placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
      const key = el.getAttribute("data-i18n-placeholder");
      const value = t(key, lang);
      if(value !== null && value !== undefined){
        el.setAttribute("placeholder", value);
      }
    });

    // aria-labels
    document.querySelectorAll("[data-i18n-aria]").forEach(el=>{
      const key = el.getAttribute("data-i18n-aria");
      const value = t(key, lang);
      if(value !== null && value !== undefined){
        el.setAttribute("aria-label", value);
      }
    });

    // toggle active state
    document.querySelectorAll("[data-lang-btn]").forEach(btn=>{
      const val = (btn.getAttribute("data-lang-btn") || "").toLowerCase();
      btn.setAttribute("aria-pressed", val === lang ? "true" : "false");
      btn.classList.toggle("is-active", val === lang);
    });

    // allow pages with dynamic content to re-label
    window.dispatchEvent(new CustomEvent("tv:lang", {detail:{lang}}));
  }

  function setLang(lang){
    const next = (lang || DEFAULT_LANG).toLowerCase();
    const safe = (next === "es" || next === "en") ? next : DEFAULT_LANG;
    storeLang(safe);
    applyI18n(safe);
  }

  function initLangUI(){
    document.querySelectorAll("[data-lang-btn]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const val = btn.getAttribute("data-lang-btn");
        setLang(val);
      });
    });
  }

  // expose
  window.tvI18n = { getLang, setLang, applyI18n, t };

  // init
  document.addEventListener("DOMContentLoaded", ()=>{
    initLangUI();
    applyI18n(getLang());
  });
})();