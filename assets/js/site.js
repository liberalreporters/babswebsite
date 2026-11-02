(()=>{'use strict';
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('[data-current-year]').forEach(node=>{node.textContent=String(new Date().getFullYear())});
document.querySelectorAll('[data-menu-toggle]').forEach(button=>{
  const nav=document.getElementById(button.getAttribute('aria-controls'));
  if(!nav)return;
  const close=()=>{button.setAttribute('aria-expanded','false');nav.classList.remove('is-open');button.textContent='Menu'};
  button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!open));nav.classList.toggle('is-open',!open);button.textContent=open?'Menu':'Close menu'});
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
  document.addEventListener('click',event=>{if(button.getAttribute('aria-expanded')==='true'&&!nav.contains(event.target)&&!button.contains(event.target))close()});
});
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
  const target=document.querySelector(link.getAttribute('href'));
  if(target){event.preventDefault();target.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'});if(!target.hasAttribute('tabindex'))target.setAttribute('tabindex','-1');target.focus({preventScroll:true})}
}));
document.querySelectorAll('[data-mailto-form]').forEach(form=>form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const recipient=form.dataset.recipient;
  const values=new FormData(form);
  const subject=String(values.get('subject')||'Website enquiry').trim();
  const body=['Name: '+String(values.get('name')||'').trim(),'Reply email: '+String(values.get('email')||'').trim(),'','Message:',String(values.get('message')||'').trim()].join('\n');
  const link='mailto:'+encodeURIComponent(recipient)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  const status=form.querySelector('[data-form-message]');
  if(status)status.textContent='Your email application should open with the message prepared. Review it and press Send in your email app. If it does not open, use the direct email link on this page.';
  window.location.href=link;
}));
})();