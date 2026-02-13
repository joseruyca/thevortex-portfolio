
(function(){
  const destination = "home.html";
  const sentinel = document.getElementById("sentinel");
  const ring = document.querySelector(".progress__ring");
  const label = document.querySelector(".progress__label");
  if(!sentinel || !ring || !label) return;

  const dwellMs = 800; // how long the sentinel must be fully visible
  let start = null, raf = null, seen = false;

  function reset(){
    start = null; label.textContent = "0%"; ring.style.background = "conic-gradient(var(--brand) 0deg, transparent 0deg)";
  }
  reset();

  const io = new IntersectionObserver((entries)=>{
    const e = entries[0];
    if(e && e.isIntersecting && e.intersectionRatio >= 1){
      if(seen) return;
      start = performance.now();
      function step(t){
        const elapsed = t - start;
        const pct = Math.max(0, Math.min(1, elapsed / dwellMs));
        const deg = Math.floor(pct * 360);
        ring.style.background = `conic-gradient(var(--brand) ${deg}deg, #0000 0deg)`;
        label.textContent = `${Math.floor(pct*100)}%`;
        if(pct >= 1){
          seen = true;
          setTimeout(()=> location.href = destination, 80);
          cancelAnimationFrame(raf);
          return;
        }
        raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
    }else{
      cancelAnimationFrame(raf);
      reset();
    }
  }, { threshold: 1.0 });

  io.observe(sentinel);
})();

// i18n handled by assets/js/i18n.js
