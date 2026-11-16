(()=>{'use strict';
// Highlight the section in view without moving keyboard focus.
const links=[...document.querySelectorAll('#main-nav a[href^="#"]')];if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;links.forEach(a=>{if(a.hash==='#'+visible.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});},{rootMargin:'-10% 0px -55% 0px',threshold:[0,.1,.5]});links.forEach(a=>{const section=document.querySelector(a.hash);if(section)observer.observe(section);});}
})();
