'use strict';
const londonFormat=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
window.SiteUX={
 london(){const p={};for(const x of londonFormat.formatToParts(new Date()))if(x.type!=='literal')p[x.type]=x.value;return new Date(+p.year,+p.month-1,+p.day,+p.hour,+p.minute);},
 iso(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');},
 async copy(text){try{await navigator.clipboard.writeText(text);return true;}catch{const field=document.createElement('textarea');field.className='copy-buffer';field.value=text;field.setAttribute('aria-label','Request text to copy');document.body.append(field);field.select();let ok=false;try{ok=document.execCommand('copy');}catch{}field.remove();return ok;}}
};
(function(){
const service=document.querySelector('#service');
function serviceState(value){document.querySelectorAll('[data-hero-service]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.heroService===value)));document.querySelectorAll('.services li').forEach(li=>li.classList.toggle('service-selected',li.querySelector('[data-service]')?.dataset.service===value));const description=document.querySelector('#service-copy');if(description)description.textContent=value+' selected for your visit note. The shop confirms options and price.';}
document.querySelectorAll('[data-hero-service]').forEach(b=>b.addEventListener('click',()=>{if(!service)return;service.value=b.dataset.heroService;service.dispatchEvent(new Event('input',{bubbles:true}));serviceState(service.value);}));
document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>{if(service){service.value=a.dataset.service;service.dispatchEvent(new Event('input',{bubbles:true}));serviceState(service.value);}}));
if(service)service.addEventListener('change',()=>serviceState(service.value));
const status=document.querySelector('#visit-status');if(status){
 const hours={1:[540,1020],2:[540,1020],3:[540,1020],4:[540,1020],5:[540,1020],6:[540,780]};
 const fmt=m=>{const h=Math.floor(m/60);return(h%12||12)+(m%60?':'+String(m%60).padStart(2,'0'):'')+(h>=12?'pm':'am');};
 function render(){const n=SiteUX.london(),d=n.getDay(),m=n.getHours()*60+n.getMinutes(),today=hours[d];if(today&&m>=today[0]&&m<today[1])status.textContent='Listed open until '+fmt(today[1]);else if(today&&m<today[0])status.textContent='Listed opening today: '+fmt(today[0]);else{for(let i=1;i<8;i++){const next=(d+i)%7;if(hours[next]){status.textContent='Next listed opening: '+(i===1?'tomorrow':['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][next])+' at '+fmt(hours[next][0]);break;}}}}
 render();setInterval(render,60000);
}
})();
