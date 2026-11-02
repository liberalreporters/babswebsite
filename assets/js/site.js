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
const formatDate=value=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return '';const date=new Date(value+'T12:00:00');return Number.isNaN(date.getTime())?'':new Intl.DateTimeFormat('en-NG',{day:'numeric',month:'long',year:'numeric'}).format(date)};
const element=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node};
const safeLink=(href,label)=>{const link=element('a','',label);link.href=href;return link};
const createFeedCard=(item,kind)=>{
  const card=element('article',kind==='press'?'news-card':'card');
  const meta=[item.category,formatDate(item.date)].filter(Boolean).join(' · ');
  if(meta)card.append(element('p','eyebrow',meta));
  if(item.image){const img=element('img');img.src=item.image;img.alt=item.imageAlt||item.alt||item.title||'Published media image';img.loading='lazy';img.decoding='async';card.append(img)}
  card.append(element('h3','',item.title||'Untitled update'));
  if(item.summary)card.append(element('p','',item.summary));
  if(kind==='announcements'&&item.body){const excerpt=String(item.body).split(/\n\s*\n/)[0];card.append(element('p','',excerpt.length>320?excerpt.slice(0,317)+'…':excerpt))}
  if(item.author||item.source){card.append(element('p','feed-source','Source: '+[item.author,item.source].filter(Boolean).join(' · ')))}
  if(kind==='press')card.append(safeLink('/press-centre/article?id='+encodeURIComponent(item.id),'Read full release →'));
  if(kind==='news')card.append(safeLink('/press-centre','Visit Press Centre →'));
  if(kind==='announcements'&&item.contact)card.append(safeLink('mailto:'+item.contact+'?subject='+encodeURIComponent('Enquiry about: '+(item.title||'announcement')),'Enquire by email →'));
  return card;
};
document.querySelectorAll('[data-feed]').forEach(async container=>{
  const kind=container.dataset.feedKind||'news';
  const search=document.getElementById(container.dataset.searchId||'');
  let published=[];
  const render=()=>{
    const term=(search?.value||'').trim().toLocaleLowerCase();
    const filtered=published.filter(item=>[item.title,item.summary,item.body,item.category,item.author,item.source].filter(Boolean).join(' ').toLocaleLowerCase().includes(term));
    container.replaceChildren();
    if(!filtered.length){container.append(element('p','empty-state',term?'No published items match that search.':'No published items are available at the moment.'));return}
    filtered.forEach(item=>container.append(createFeedCard(item,kind)));
  };
  if(search)search.addEventListener('input',render);
  try{
    const response=await fetch(container.dataset.feedUrl,{headers:{Accept:'application/json'}});
    if(!response.ok)throw new Error('Feed request failed');
    const data=await response.json();
    published=(Array.isArray(data.items)?data.items:[]).filter(item=>item&&item.status==='published'&&item.title).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    render();
  }catch(error){container.replaceChildren(element('p','empty-state','Updates could not be loaded right now. Please use the other pages or try again later.'))}
});
const articleTitle=document.querySelector('[data-article-title]');
if(articleTitle){
  const params=new URLSearchParams(window.location.search);
  const id=params.get('id');
  const summary=document.querySelector('[data-article-summary]');
  const meta=document.querySelector('[data-article-meta]');
  const body=document.querySelector('[data-article-body]');
  fetch('/press-centre.json',{headers:{Accept:'application/json'}}).then(response=>{if(!response.ok)throw new Error('Feed request failed');return response.json()}).then(data=>{
    const item=(Array.isArray(data.items)?data.items:[]).find(entry=>entry&&entry.id===id&&entry.status==='published');
    if(!item)throw new Error('Published article not found');
    articleTitle.textContent=item.title;
    document.title=item.title+' | Babatunde Sunday Ogunlade';
    if(summary)summary.textContent=item.summary||'Official statement from the public information team.';
    if(meta)meta.textContent=[item.category,formatDate(item.date),item.author||item.source].filter(Boolean).join(' · ');
    if(body){
      body.replaceChildren();
      if(item.image){const img=element('img');img.src=item.image;img.alt=item.imageAlt||item.title;img.loading='eager';img.decoding='async';body.append(img)}
      const paragraphs=String(item.body||item.summary||'').split(/\n\s*\n/).map(text=>text.trim()).filter(Boolean);
      paragraphs.forEach(text=>body.append(element('p','',text)));
      if(item.source)body.append(element('p','feed-source','Source: '+item.source));
    }
  }).catch(()=>{articleTitle.textContent='Statement not found';if(summary)summary.textContent='The requested statement may have been removed or is not published. Browse the Press Centre for available releases.';if(body){body.replaceChildren(element('p','empty-state','This statement is not available.'));body.append(safeLink('/press-centre','Return to Press Centre →'))}if(meta)meta.textContent=''});
}
document.querySelectorAll('[data-mailto-form]').forEach(form=>form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const recipient=form.dataset.recipient;
  const values=new FormData(form);
  const subject=String(values.get('subject')||'Website enquiry').trim();
  const body=['Name: '+String(values.get('name')||'').trim(),'Reply email: '+String(values.get('email')||'').trim(),'','Message:',String(values.get('message')||'').trim()].join('\n');
  const link='mailto:'+recipient+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  const status=form.querySelector('[data-form-message]');
  if(status)status.textContent='Your email application should open with the message prepared. Review it and press Send in your email app. If it does not open, use the direct email link on this page.';
  window.location.href=link;
}));
})();