// Documentation page: step-by-step guides (Markdown files) and the node reference (generated from the app by
// tools/build-docs.py). Guides keep their reading order and have previous / next links; nodes are grouped by family
// and drawn like node cards, with sockets coloured by data type.
(function(){
 const $=s=>document.querySelector(s),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const SOCKET={Color:'#e9b34c',Value:'#bdc4cf',Vector:'#6ea5ed',Normal:'#ad84e0',Integer:'#68cca7',Boolean:'#cb798a',Path:'#ef7e44'};
 const params=new URLSearchParams(location.search);
 let index,nodes,mode=params.has('node')?'nodes':'guides',selected=params.get('node')||params.get('guide')||'guide-getting-started',request=0;
 const items=()=>mode==='nodes'?nodes:index.articles,idOf=x=>x.kind||x.id;
 function localLink(url,article){
  if(/^https?:\/\//i.test(url)||url.startsWith('#'))return url;
  if(/^docs\.html\?(node|guide)=[\w-]+$/.test(url)||/^[\w-]+\.html(#[\w-]+)?$/.test(url))return url;
  const file=url.split('#')[0].split('/').at(-1),found=index.articles.find(a=>a.path.split('/').at(-1)===file);
  if(found)return `docs.html?guide=${encodeURIComponent(found.id)}`;
  if(/\.(png|jpe?g|svg|webp)$/i.test(url)&&!url.includes('..'))return new URL(url,new URL(article.path,location.href)).href;
  return '';
 }
 function inline(text,a){let out=esc(text).replace(/&lt;br\s*\/?&gt;/gi,'<br>');out=out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,(_,alt,url)=>{const href=localLink(url,a);return href?`<img class="doc-figure" src="${esc(href)}" alt="${alt}" loading="lazy">`:alt});out=out.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,url)=>{const href=localLink(url.replace(/&amp;/g,'&'),a);return href?`<a href="${esc(href)}" ${/^https?:/.test(href)?'target="_blank" rel="noopener noreferrer"':''}>${label}</a>`:label});return out.replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>').replace(/\\\\/g,'\\')}
 function markdown(text,a){const lines=text.replace(/\r/g,'').split('\n');let html='',paragraph=[],list='',code=null,comment=false;const flush=()=>{if(paragraph.length){html+=`<p>${inline(paragraph.join(' '),a)}</p>`;paragraph=[]}if(list){html+=`</${list}>`;list=''}};for(let i=0;i<lines.length;i++){let line=lines[i];if(code!==null){if(line.startsWith('```')){html+=`<pre><code>${esc(code.join('\n'))}</code></pre>`;code=null}else code.push(line);continue}if(line.includes('<!--')){comment=true;if(line.includes('-->'))comment=false;continue}if(comment){if(line.includes('-->'))comment=false;continue}if(line.startsWith('```')){flush();code=[];continue}if(!line.trim()){flush();continue}if(line.includes('|')&&i+1<lines.length&&/^\s*\|?\s*:?-{3}/.test(lines[i+1])){flush();const cells=v=>v.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(x=>x.trim());const head=cells(line);html+='<div class="doc-table-scroll"><table>'+(head.some(Boolean)?'<thead><tr>'+head.map(x=>`<th>${inline(x,a)}</th>`).join('')+'</tr></thead>':'')+'<tbody>';i+=2;for(;i<lines.length&&lines[i].includes('|')&&lines[i].trim();i++)html+='<tr>'+cells(lines[i]).map(x=>`<td>${inline(x,a)}</td>`).join('')+'</tr>';html+='</tbody></table></div>';i--;continue}const heading=line.match(/^(#{1,6})\s+(.+)$/);if(heading){flush();const level=Math.min(heading[1].length+1,6),id=heading[2].toLowerCase().replace(/[^a-z0-9]+/g,'-');html+=`<h${level} id="${id}">${inline(heading[2],a)}</h${level}>`;continue}const item=line.match(/^\s*(?:[-*]|\d+\.)\s+(.+)$/);if(item){if(paragraph.length){html+=`<p>${inline(paragraph.join(' '),a)}</p>`;paragraph=[]}const type=/^\s*\d/.test(line)?'ol':'ul';if(list!==type){if(list)html+=`</${list}>`;html+=`<${type}>`;list=type}html+=`<li>${inline(item[1],a)}</li>`;continue}if(line.startsWith('>')){flush();html+=`<blockquote>${inline(line.replace(/^>\s?/,''),a)}</blockquote>`;continue}paragraph.push(line)}flush();if(code)html+=`<pre><code>${esc(code.join('\n'))}</code></pre>`;return html}
 // sections keep the order they first appear in (guides: reading order; nodes: family order)
 function sections(list){const out=[];list.forEach(x=>{if(!out.includes(x.category))out.push(x.category)});return out}
 function category(){const old=$('#docs-category').value;$('#docs-category').innerHTML=`<option value="">${mode==='nodes'?'All families':'All sections'}</option>`+sections(items()).map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');if([...$('#docs-category').options].some(o=>o.value===old))$('#docs-category').value=old}
 function familyColor(name){return (index.families||[]).find(f=>f.name===name)?.color||'#505050'}
 function results(){
  const search=$('#docs-search').value.trim().toLowerCase(),cat=$('#docs-category').value;
  const found=items().filter(x=>(!cat||x.category===cat)&&(!search||[x.name,x.title,x.category,x.description,...(x.parameters||[]).map(p=>p.name),...(x.inputs||[]).map(p=>p.name)].join(' ').toLowerCase().includes(search)));
  $('#docs-count').textContent=`${found.length} ${mode==='nodes'?(found.length===1?'node':'nodes'):(found.length===1?'guide':'guides')}`;
  let html='',last='';
  found.forEach(x=>{
   if(x.category!==last){last=x.category;html+=`<div class="doc-group"${mode==='nodes'?` style="--h:${esc(familyColor(x.category))}"`:''}>${mode==='nodes'?'<i></i>':''}${esc(x.category)}</div>`}
   const n=mode==='guides'?`<em>${index.articles.indexOf(x)+1}</em>`:'';
   html+=`<button type="button" class="doc-result ${selected===idOf(x)?'selected':''}" data-result="${esc(idOf(x))}">${n}<span>${esc(x.name||x.title)}</span></button>`;
  });
  $('#docs-results').innerHTML=html||'<p class="doc-empty">No matches. Try a shorter word.</p>';
  const box=$('#docs-results'),sel=box.querySelector('.selected');if(sel&&(sel.offsetTop<box.scrollTop||sel.offsetTop>box.scrollTop+box.clientHeight-40))box.scrollTop=sel.offsetTop-box.clientHeight/3; // keep the open item in view inside the list
  $('#docs-results').querySelectorAll('[data-result]').forEach(b=>b.onclick=()=>{open(b.dataset.result);if(innerWidth<900)$('#docs-article').scrollIntoView({behavior:'smooth',block:'start'})});
 }
 const fmt=(v,p)=>v===null||v===undefined?'–':p.type==='Boolean'?(v?'On':'Off'):String(v);
 function sockets(title,list,side){return `<section class="node-port-section"><h3>${title}</h3>${list.length?'<ul>'+list.map(x=>`<li class="${side}"><s style="--c:${SOCKET[x.type]||'#bdc4cf'}"></s><span>${esc(x.name||'Result')}</span><b>${esc(x.type)}</b></li>`).join('')+'</ul>':`<p>${side==='in'?'No inputs: it makes its result from its settings.':'No outputs.'}</p>`}</section>`}
 function nodePage(n){
  const rows=n.parameters.map(p=>`<tr><td>${esc(p.name)}</td><td>${esc(p.type)}${p.components>1?' × '+p.components:''}</td><td>${p.type==='Boolean'?'On / off':`${fmt(p.min,p)} to ${fmt(p.max,p)}`}</td><td>${fmt(p.default,p)}</td></tr>`).join('');
  const same=nodes.filter(x=>x.category===n.category&&x.kind!==n.kind).slice(0,8);
  return `<div class="doc-breadcrumb">Node reference · ${esc(n.category)}</div>
  <div class="node-card-head" style="--h:${esc(n.color)}"><i></i><h2>${esc(n.name)}</h2></div>
  <p class="node-summary">${esc(n.description)}</p>
  <p class="node-find"><b>Find it:</b> in the graph, press <kbd>Shift+A</kbd> and type <code>${esc(n.name)}</code>, or look under <em>${esc(n.category)}</em>.${n.spatial?' It reads neighbouring pixels (like a blur), so it can take a moment at 4K.':''}</p>
  <div class="node-ports">${sockets('Inputs',n.inputs,'in')}${sockets('Outputs',n.outputs,'out')}</div>
  <h3>Settings</h3>${rows?`<div class="doc-table-scroll"><table><thead><tr><th>Setting</th><th>Type</th><th>Range</th><th>Default</th></tr></thead><tbody>${rows}</tbody></table></div>`:'<p>No number settings. It works from its inputs, its mode or its own editor.</p>'}
  ${same.length?`<h3>Also in ${esc(n.category)}</h3><p class="node-related">${same.map(x=>`<a href="docs.html?node=${esc(x.kind)}">${esc(x.name)}</a>`).join('')}</p>`:''}
  <p class="doc-source-line">From Surface3D ${esc(index.version)}. New to graphs? Read <a href="docs.html?guide=guide-node-graphs">Node graphs</a> first.</p>`;
 }
 function pager(a){const list=index.articles,i=list.indexOf(a),prev=list[i-1],next=list[i+1];return `<nav class="doc-pager" aria-label="More guides">${prev?`<a href="docs.html?guide=${prev.id}" class="prev"><small>← Previous</small>${esc(prev.title)}</a>`:'<span></span>'}${next?`<a href="docs.html?guide=${next.id}" class="next"><small>Next →</small>${esc(next.title)}</a>`:''}</nav>`}
 async function open(id){
  selected=id;results();const ticket=++request;const host=$('#docs-article');
  if(mode==='nodes'){const n=nodes.find(x=>x.kind===id);if(!n)return;host.innerHTML=nodePage(n);history.replaceState(null,'',`docs.html?node=${encodeURIComponent(id)}`)}
  else{const a=index.articles.find(x=>x.id===id);if(!a)return;host.innerHTML='<p>Loading the guide…</p>';try{const overrides=window.SurfaceSite.content.documentation?.overrides||{},text=overrides[id]??await (await fetch(a.path+'?v='+index.version)).text();if(ticket!==request)return;host.innerHTML=`<div class="doc-breadcrumb">${esc(a.category)} · Guide ${index.articles.indexOf(a)+1} of ${index.articles.length}</div>${markdown(text,a)}${pager(a)}`;history.replaceState(null,'',`docs.html?guide=${encodeURIComponent(id)}`)}catch{host.innerHTML='<p>This guide could not load. Check your connection and try again.</p>'}}
  // links to other guides or nodes open in place
  host.querySelectorAll('a[href^="docs.html?"]').forEach(l=>l.addEventListener('click',e=>{const u=new URL(l.href),g=u.searchParams.get('guide'),nd=u.searchParams.get('node');if(!g&&!nd)return;e.preventDefault();if(nd){if(mode!=='nodes')changeMode('nodes',nd);else open(nd)}else{if(mode!=='guides')changeMode('guides',g);else open(g)}const top=$('.documentation-browser').getBoundingClientRect().top+scrollY-84;if(scrollY>top)window.scrollTo({top,behavior:'smooth'})}));
  window.dispatchEvent(new Event('surface-document-rendered'));
 }
 function changeMode(next,id){mode=next;$('#guides-tab').classList.toggle('active',mode==='guides');$('#nodes-tab').classList.toggle('active',mode==='nodes');$('#docs-category').value='';$('#docs-search').value='';$('#docs-search').placeholder=mode==='nodes'?'Search nodes, e.g. noise or blur…':'Search guides…';category();open(id||(mode==='nodes'?nodes[0].kind:'guide-getting-started'))}
 window.SurfaceDocs={get articles(){return index?.articles||[]},reload(){open(selected)}};
 window.DocsReady=(async()=>{await window.SurfaceSite.ready;try{
  const v='?v='+Math.floor(Date.now()/6e5); // fresh lists at least every ten minutes
  [index,nodes]=await Promise.all([fetch('data/documentation/index.json'+v).then(r=>r.json()),fetch('data/documentation/nodes.json'+v).then(r=>r.json())]);
  $('#documentation-stats').textContent=`Surface3D ${index.version} · ${index.articles.length} guides · ${index.nodeCount} nodes in ${index.families.filter(f=>f.count).length} families`;
  $('#guides-tab').hidden=false;$('#guides-tab').onclick=()=>changeMode('guides');$('#nodes-tab').onclick=()=>changeMode('nodes');
  $('#docs-search').oninput=results;$('#docs-category').onchange=results;$('#docs-clear').onclick=()=>{$('#docs-search').value='';results();$('#docs-search').focus()};
  const url=new URL(location.href);url.searchParams.get('node')?changeMode('nodes',url.searchParams.get('node')):changeMode('guides',url.searchParams.get('guide')||'guide-getting-started');
 }catch{$('#docs-article').textContent='The documentation could not load. Check your connection and reload the page.'}})();
})();
