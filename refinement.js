(()=>{'use strict';
// Highlight the section in view without moving keyboard focus.
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];SiteUX.navHighlight(visible?visible.target.id:null);},{rootMargin:'-10% 0px -55% 0px',threshold:[0,.1,.5]});document.querySelectorAll('#main-nav a[href^="#"]').forEach(a=>{const section=document.querySelector(a.hash);if(section)observer.observe(section);});}
})();
