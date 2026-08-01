const svgNS = 'http://www.w3.org/2000/svg';
const makeSvg = (name, attrs={}) => { const el=document.createElementNS(svgNS,name); Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v)); return el; };

export function initPrinciples(principles){
  const controls=document.querySelector('#principleControls');
  const stage=document.querySelector('.principle-stage');
  const settle=document.querySelector('#settlingParticles');
  const layers=document.querySelector('#filterLayers');
  const trapped=document.querySelector('#filterParticles');
  const pores=document.querySelector('#carbonPores');
  const molecules=document.querySelector('#molecules');
  [settle,layers,trapped,pores,molecules].forEach(g=>g.replaceChildren());
  for(let i=0;i<22;i++) settle.append(makeSvg('circle',{cx:70+Math.random()*125,cy:120+Math.random()*185,r:3+Math.random()*5,fill:i%3?'#795d41':'#b58a55',class:'settle-dot'}));
  [['#8e7459',75],['#b28a55',62],['#d7bd89',54],['#242b27',45],['#eee4d1',25]].forEach(([fill,h],i)=>layers.append(makeSvg('rect',{x:367,y:320-i*58,width:128,height:h-5,rx:4,fill})));
  for(let i=0;i<16;i++) trapped.append(makeSvg('circle',{cx:375+Math.random()*115,cy:100+Math.random()*220,r:2.5+Math.random()*3,fill:'#76543a'}));
  for(let i=0;i<17;i++) pores.append(makeSvg('circle',{cx:620+Math.random()*88,cy:170+Math.random()*85,r:4+Math.random()*8,fill:'#4a554f',class:'pore'}));
  for(let i=0;i<11;i++) molecules.append(makeSvg('circle',{cx:600+Math.random()*122,cy:130+Math.random()*160,r:3.5,fill:'#d69b43'}));
  principles.forEach((p,i)=>{ const b=document.createElement('button'); b.innerHTML=`<span>${p.name}</span><small>${p.english}</small>`; b.addEventListener('click',()=>select(i)); controls.append(b); });
  function select(i){
    [...controls.children].forEach((b,j)=>b.classList.toggle('is-active',i===j));
    const p=principles[i]; document.querySelector('#principleEnglish').textContent=p.english; document.querySelector('#principleName').textContent=p.name; document.querySelector('#principleSummary').textContent=p.summary; document.querySelector('#principleCan').textContent=p.can; document.querySelector('#principleCannot').textContent=p.cannot;
    settle.style.opacity=i===0?'1':'.22'; layers.style.opacity=i===1?'1':'.25'; trapped.style.opacity=i===1?'1':'.2'; pores.style.opacity=i===2?'1':'.25'; molecules.style.opacity=i===2?'1':'.18'; stage.classList.remove('is-playing'); void stage.offsetWidth; stage.classList.add('is-playing');
  }
  document.querySelector('#playPrinciple').addEventListener('click',()=>stage.classList.add('is-playing'));
  document.querySelector('#pausePrinciple').addEventListener('click',()=>stage.classList.remove('is-playing'));
  document.querySelector('#resetPrinciple').addEventListener('click',()=>{stage.classList.remove('is-playing');void stage.offsetWidth;stage.classList.add('is-playing')});
  select(0);
}

export function initMaterials(materials){
  const grid=document.querySelector('#materialGrid'), table=document.querySelector('#materialTable'), sort=document.querySelector('#materialSort'), search=document.querySelector('#materialSearch');
  function render(){
    const q=search.value.trim(); let list=materials.filter(m=>!q||[m.name,m.role,m.limit].join(' ').includes(q));
    if(sort.value!=='default') list=[...list].sort((a,b)=>sort.value==='cost'?a.cost-b.cost:b[sort.value]-a[sort.value]);
    grid.innerHTML=list.map(m=>`<article class="material-card" style="--swatch:${m.color}"><h3>${m.name}</h3><p>${m.role}</p><div class="mini-bars"><span>清澈<i style="width:${m.clarity*20}%"></i></span><span>流速<i style="width:${m.flow*20}%"></i></span><span>成本<i style="width:${m.cost*20}%"></i></span></div></article>`).join('');
    table.innerHTML=list.map(m=>`<tr><td>${m.name}</td><td>${m.scale}<br>${m.porosity}</td><td>${m.role}</td><td>${m.strength}</td><td>${m.limit}</td></tr>`).join('');
  }
  sort.addEventListener('change',render); search.addEventListener('input',render); render();
}

export function initBuilder(materials,configurations){
  const preset=document.querySelector('#presetSelect'), editor=document.querySelector('#layerEditor'), bottle=document.querySelector('#bottleLayers');
  const names=['gravel','coarseSand','fineSand','activatedCarbon','coffee'];
  const lookup=Object.fromEntries(materials.map(m=>[m.id,m]));
  const labelMap={gravel:'礫石',coarseSand:'粗砂',fineSand:'細砂',activatedCarbon:'顆粒活性碳',coffee:'咖啡濾紙',stone:'石頭',nonwoven:'不織布'};
  let state=[];
  const presets={starter:[['gravel',4],['coarseSand',4],['fineSand',6],['activatedCarbon',3],['coffee',1]],fast:[['stone',5],['gravel',7],['coarseSand',5],['nonwoven',1]],fine:[['gravel',3],['coarseSand',3],['fineSand',10],['activatedCarbon',4],['coffee',1]],control:[['coffee',1]]};
  function load(id){state=presets[id].map(x=>[...x]);renderEditor();update(true)}
  function renderEditor(){editor.innerHTML=state.map((row,i)=>`<div class="layer-row"><select data-i="${i}">${materials.map(m=>`<option value="${m.id}" ${m.id===row[0]?'selected':''}>${m.name}</option>`).join('')}</select><input data-i="${i}" type="number" min="1" max="12" value="${row[1]}" aria-label="${labelMap[row[0]]||row[0]}厚度公分"></div>`).join(''); editor.querySelectorAll('select').forEach(el=>el.addEventListener('change',e=>{state[+e.target.dataset.i][0]=e.target.value;update(false)})); editor.querySelectorAll('input').forEach(el=>el.addEventListener('input',e=>{state[+e.target.dataset.i][1]=Math.max(1,Math.min(12,+e.target.value||1));update(false)}));}
  function update(isPreset){
    const down=document.querySelector('input[name="direction"]:checked').value==='down'; document.querySelector('#flowLabel').textContent=down?'進水 ↓':'出水 ↑'; bottle.style.flexDirection=down?'column':'column-reverse';
    bottle.innerHTML=state.map(([id,cm])=>{const m=lookup[id];return `<div class="filter-layer" style="--layer:${m?.color||'#ddd'};height:${Math.max(22,cm*10)}px">${m?.name||id} ${cm} cm</div>`}).join('');
    const total=state.reduce((s,[,cm])=>s+cm,0)||1; const weighted=key=>state.reduce((s,[id,cm])=>s+(lookup[id]?.[key]||1)*cm,0)/total;
    let clarity=Math.min(5,weighted('clarity')+(state.some(x=>x[0]==='fineSand') ? .55 : 0)); let speed=Math.max(1,weighted('flow')-total/28); let cost=Math.min(5,weighted('cost')); let diff=Math.min(5,1+state.length*.35+(down?0:1.25));
    if(isPreset){const cfg=configurations.find(c=>c.id===preset.value); clarity=cfg.clarity;speed=cfg.speed;cost=cfg.cost;diff=cfg.difficulty;document.querySelector('#presetName').textContent=cfg.name;document.querySelector('#presetWhy').textContent=cfg.why;} else {document.querySelector('#presetName').textContent='自訂配置';document.querySelector('#presetWhy').textContent='這是依材料屬性與總厚度產生的課堂預測。請用至少三次實驗資料驗證，不要把分數當成真實濁度或安全檢驗。';}
    [['clarity',clarity],['speed',speed],['cost',cost],['difficulty',diff]].forEach(([id,val])=>{document.querySelector(`#${id}Meter`).style.width=`${val/5*100}%`;document.querySelector(`#${id}Value`).textContent=val.toFixed(1)});
    document.querySelector('#tradeoffText').textContent=!down?'上行模式需配水與支撐結構，課堂開口瓶不應加壓操作。':speed<2.2?'預測：細層或總厚度較大，清澈度可能提高，但堵塞與慢流風險也較高。':clarity<3?'預測：通水較快，但細小懸浮物較可能通過。':'預測：清澈度與流速較平衡，適合作為第一輪比較起點。';
  }
  preset.addEventListener('change',()=>load(preset.value)); document.querySelectorAll('input[name="direction"]').forEach(x=>x.addEventListener('change',()=>update(false))); document.querySelector('#resetBuilder').addEventListener('click',()=>{preset.value='starter';load('starter')}); load('starter');
}

export function initEvidence(){
  const slider=document.querySelector('#turbiditySlider'), overlay=document.querySelector('#sampleOverlay'), output=document.querySelector('#turbidityOutput'), guide=document.querySelector('#clarityGuide');
  function update(){const v=+slider.value;overlay.style.background=`rgba(112,82,49,${v/115})`;overlay.style.backdropFilter=`blur(${v/18}px)`;output.value=v;const level=Math.max(0,Math.min(5,Math.round((100-v)/20)));guide.textContent=['圖樣完全看不見，記為 0 級。','圖樣只看得出明暗，記為 1 級。','可見大區塊，記為 2 級。','可辨主要邊界，記為 3 級。','圖樣大多清楚，記為 4 級。','圖樣非常清楚，記為 5 級。'][level]}
  slider.addEventListener('input',update);update();
  const rows=document.querySelector('#recordRows'); for(let group=0;group<3;group++)for(let run=1;run<=3;run++)rows.insertAdjacentHTML('beforeend',`<tr><td><input aria-label="配置名稱" value="${String.fromCharCode(65+group)} 組"></td><td>${run}</td>${[5,5,3,999,999,99].map((max,i)=>`<td><input type="number" min="0" max="${max}" aria-label="紀錄欄 ${i+1}"></td>`).join('')}</tr>`);
  document.querySelector('#downloadCsv').addEventListener('click',()=>{const csv='配置,次數,清澈度0-5,顏色0-5,氣味0-3,100mL時間秒,5分鐘出水量mL,成本點\n'+['A','B','C'].flatMap(g=>[1,2,3].map(n=>`${g},${n},,,,,,`)).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'}));a.download='自製濾水器實驗紀錄.csv';a.click();URL.revokeObjectURL(a.href)});
}

export function initApplications(){
  const apps=[
    ['自來水廠','多重屏障','混凝、沉澱、過濾後還要消毒與檢驗；瓶裝濾柱只模擬其中一小部分。','plant'],
    ['雨水園藝回用','先篩再沉澱','葉片與泥砂可先被攔截，但用途、儲存與在地規範仍要評估。','rain'],
    ['咖啡沖煮','纖維篩濾','濾紙留下咖啡粉，溶解的色、味物質仍通過；這正好顯示溶解物不等於顆粒。','coffee'],
    ['魚缸循環','物理＋生物處理','海綿攔屑，濾材表面也可能成為微生物棲地；不能直接類推為飲用水設備。','tank'],
    ['露營用水','過濾不等於消毒','戶外濾器規格各異；不確定水源還需合適的病原體處理，化學污染水不應飲用。','camp'],
    ['太空站回收','工程循環','NASA 以反覆設計、量測與改良思考回收水；真實系統遠比寶特瓶模型複雜。','space']
  ];
  const icons={plant:'<path d="M20 105h160M35 105V48h25v57M75 105V25h30v80M120 105V58h25v47M155 105V38h20v67"/><path d="M15 18h170"/><circle cx="48" cy="36" r="5"/><circle cx="91" cy="17" r="5"/>',rain:'<path d="M55 25c-20 0-30 13-30 28h110c0-18-13-30-32-30-8-16-38-17-48 2z"/><path d="M45 68l-8 17m36-17-8 17m36-17-8 17"/><path d="M20 105h160M55 105V88h90v17"/>',coffee:'<path d="M45 25h110l-28 62H73z"/><path d="M73 87h54M90 87v18m20-18v18M65 105h70"/><path d="M70 45h60"/>',tank:'<rect x="25" y="30" width="150" height="80" rx="8"/><path d="M25 65h150M50 28v-15h95v15"/><circle cx="75" cy="78" r="10"/><path d="M120 78c15-14 30 0 30 0s-15 14-30 0z"/>',camp:'<path d="M25 108l55-75 55 75zM80 33l55 75h45"/><path d="M140 30v60h25V30"/><path d="M145 45h15m-15 14h15m-15 14h15"/>',space:'<circle cx="100" cy="62" r="42"/><path d="M100 20v84M58 62h84M70 32c24 20 36 44 60 60M130 32c-24 20-36 44-60 60"/><circle cx="155" cy="25" r="9"/><path d="M15 112h170"/>'};
  document.querySelector('#applicationGrid').innerHTML=apps.map(([title,tag,text,key])=>`<article class="app-card"><div class="app-visual"><svg viewBox="0 0 200 130" role="img" aria-label="${title}示意圖"><g fill="none" stroke="#204c3f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${icons[key]}</g></svg></div><div class="app-body"><span>${tag}</span><h3>${title}</h3><p>${text}</p><details><summary>想一想</summary>這個情境的目標污染物、量測方式與安全標準，和課堂泥水模型有何不同？</details></div></article>`).join('');
}

export function initResources(resources){
  const list=document.querySelector('#resourceList'); let filter='all';
  function render(){const data=resources.filter(r=>filter==='all'||r.language===filter);list.innerHTML=data.map(r=>`<a class="resource-item" href="${r.url}" target="_blank" rel="noopener"><span class="lang">${r.language}</span><div><strong>${r.title}</strong><small>${r.institution} · ${r.grade}<br>${r.date}</small></div><p>${r.description}<br><b>可借鑑：</b>${r.borrow}</p><b aria-hidden="true">↗</b></a>`).join('')}
  document.querySelectorAll('[data-resource-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.resourceFilter;document.querySelectorAll('[data-resource-filter]').forEach(x=>x.classList.toggle('is-active',x===b));render()}));render();
}
