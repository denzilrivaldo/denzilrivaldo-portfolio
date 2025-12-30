async function loadJSON(path){
  const res = await fetch(path, {cache:'no-store'});
  if(!res.ok) throw new Error('Failed to load ' + path);
  return await res.json();
}


async function loadMaybe(paths){
  for(const p of paths){
    try{
      const res = await fetch(p, {cache:'no-store'});
      if(res.ok) return await res.json();
    }catch(e){}
  }
  throw new Error('Failed to load any of: ' + paths.join(', '));
}


function el(tag, attrs={}, children=[]){
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k === 'class') n.className = v;
    else if(k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v);
  });
  children.forEach(c => n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return n;
}

function escapeHTML(str){
  return (str||'').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

function setText(id, text){
  const n = document.getElementById(id);
  if(n) n.textContent = text;
}

function setHref(id, href){
  const n = document.getElementById(id);
  if(n) n.setAttribute('href', href);
}

function renderSkills(skills){
  const root = document.getElementById('skills');
  root.innerHTML = '';
  Object.entries(skills).forEach(([group, items])=>{
    const card = el('div', {class:'card block'});
    card.appendChild(el('b', {}, [group]));
    const badges = el('div', {class:'badges'});
    items.forEach(it => badges.appendChild(el('span', {class:'badge'}, [it])));
    card.appendChild(badges);
    root.appendChild(card);
  });
}

function renderExperience(items){
  const root = document.getElementById('experience');
  root.innerHTML = '';
  items.forEach(x=>{
    const card = el('div', {class:'card block'});
    card.appendChild(el('div', {class:'meta'}, [
      el('span', {}, [x.dates]),
      el('span', {}, ['•']),
      el('span', {}, [x.location]),
    ]));
    card.appendChild(el('h3', {}, [`${x.role} — ${x.company}`]));
    const ul = el('ul', {class:'list'});
    x.bullets.forEach(b => ul.appendChild(el('li', {}, [b])));
    card.appendChild(ul);
    root.appendChild(card);
  });
}

function renderEducation(items){
  const root = document.getElementById('education');
  root.innerHTML = '';
  items.forEach(x=>{
    const card = el('div', {class:'card block'});
    card.appendChild(el('div', {class:'meta'}, [
      el('span', {}, [x.dates]),
      el('span', {}, ['•']),
      el('span', {}, [x.location]),
    ]));
    card.appendChild(el('h3', {}, [x.school]));
    card.appendChild(el('div', {class:'small'}, [x.degree]));
    if(x.notes) card.appendChild(el('div', {class:'small'}, [x.notes]));
    root.appendChild(card);
  });
}

function projectCard(p){
  const card = el('div', {class:'card project'});
  card.appendChild(el('div', {class:'meta'}, [p.date]));
  card.appendChild(el('h3', {}, [p.title]));
  card.appendChild(el('div', {class:'small'}, [p.summary]));
  const badges = el('div', {class:'badges'});
  (p.tools||[]).forEach(t => badges.appendChild(el('span', {class:'badge'}, [t])));
  card.appendChild(badges);
  const actions = el('div', {class:'actions'});
  actions.appendChild(el('a', {class:'btn', href:`project.html?slug=${encodeURIComponent(p.slug)}`}, ['View project']));
  card.appendChild(actions);
  return card;
}

function renderProjects(items){
  const root = document.getElementById('projects');
  root.innerHTML = '';
  items.forEach(p => root.appendChild(projectCard(p)));
}

function getQueryParam(key){
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}

function renderProjectPage(p){
  setText('p_title', p.title);
  setText('p_date', p.date);
  setText('p_summary', p.summary);

  const tools = document.getElementById('p_tools');
  tools.innerHTML = '';
  (p.tools||[]).forEach(t => tools.appendChild(el('span', {class:'badge'}, [t])));

  const ul = document.getElementById('p_points');
  ul.innerHTML = '';
  (p.highlights||[]).forEach(h => ul.appendChild(el('li', {}, [h])));

  // Gallery
  const gal = document.getElementById('p_gallery');
  gal.innerHTML = '';
  const imgs = p.images || [];
  const caps = p.figure_captions || [];
  if(imgs.length === 0){
    gal.appendChild(el('div', {class:'note'}, [
      'No images yet. Add images from the admin panel (Deploy to Netlify + enable Identity), or upload files into ',
      el('b', {}, ['assets/img/']),
      ' and then reference them in the CMS.'
    ]));
    return;
  }
  imgs.forEach((src, i)=>{
    const fig = el('figure', {}, [
      el('img', {src, alt: `Project image ${i+1}`}, []),
      el('figcaption', {}, [caps[i] || ''])
    ]);
    gal.appendChild(fig);
  });
}

async function initHome(){
  const site = await loadJSON('content/site.json');
  const projectsWrap = await loadMaybe(['content/cms/projects.cms.json','content/projects.json']);
  const projects = projectsWrap.projects || projectsWrap;
  const expWrap = await loadMaybe(['content/cms/experience.cms.json','content/experience.json']);
  const exp = expWrap.items || expWrap;
  const eduWrap = await loadMaybe(['content/cms/education.cms.json','content/education.json']);
  const edu = eduWrap.items || eduWrap;
  const skillsWrap = await loadMaybe(['content/cms/skills.cms.json','content/skills.json']);
  const skills = (skillsWrap.skill_groups ? Object.fromEntries(skillsWrap.skill_groups.map(g=>[g.group,g.items])) : skillsWrap);

  setText('name', site.name);
  setText('title', site.title);
  setText('tagline', site.tagline);
  setText('about', site.sections.about);

  setText('contact_email', site.email);
  setHref('contact_email', 'mailto:' + site.email);

  setText('contact_phone', site.phone);
  setHref('contact_phone', 'tel:' + site.phone.replace(/\s+/g,''));

  setText('contact_linkedin', 'LinkedIn');
  setHref('contact_linkedin', site.linkedin);

  renderProjects(projects);
  renderExperience(exp);
  renderEducation(edu);
  renderSkills(skills);

  // footer year
  const y = new Date().getFullYear();
  setText('year', String(y));
}

async function initProject(){
  const slug = getQueryParam('slug');
  const projectsWrap = await loadMaybe(['content/cms/projects.cms.json','content/projects.json']);
  const projects = projectsWrap.projects || projectsWrap;
  const p = projects.find(x => x.slug === slug) || projects[0];
  renderProjectPage(p);

  // back link
  const back = document.getElementById('back_home');
  if(back) back.href = 'index.html#projects-section';
}

window.__initHome = initHome;
window.__initProject = initProject;
