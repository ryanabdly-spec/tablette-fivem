/* BLACK ACE – Labo RP FiveM : interface fournisseur et client, aucune recette réelle. */
const LAB={groupId:null,archived:false,screen:'groups',busy:false,lastData:null};
const labNum=n=>new Intl.NumberFormat('fr-FR',{maximumFractionDigits:0}).format(Number(n)||0);
const labDot={red:['red','À transformer'],green:['green','Prêt à rendre'],white:['white','Vide']} ;
const labKindName={receive:'Têtes reçues',receipt:'Têtes reçues',bricks:'Briques produites',bags:'Pochons préparés',return:'Pochons rendus',adjust:'Stock corrigé'};
const labCanEdit=()=>isLabStaff();
async function labView(c){LAB.screen=isLabStaff()?'groups':'group';LAB.groupId=null;await labRender(c)}
async function labRender(c){
 if(!c||state.page!=='lab')return;
 if(state.pageCleanup){const old=state.pageCleanup;state.pageCleanup=null;try{old()}catch{}}
 c.innerHTML='<div class="panel muted">Chargement du Labo…</div>';
 try{
   if(LAB.screen==='recipe'&&isLabStaff())return await labRecipeScreen(c);
   if(LAB.screen==='groups'&&isLabStaff())return await labGroupsScreen(c);
   return await labGroupScreen(c,LAB.groupId);
 }catch(e){c.innerHTML=`<div class="panel"><h3>Erreur Labo</h3><p class="muted">${esc(e.message)}</p><button class="btn gold" id="labRetry">Réessayer</button></div>`;$('#labRetry',c)?.addEventListener('click',()=>labRender(c))}
}
function labStatus(st){const x=labDot[st]||labDot.white;return `<span class="lab-status ${x[0]}"><i></i>${x[1]}</span>`}
function labHead(title,sub,actions=''){return `<div class="lab-banner"><div><div class="eyebrow">BLACK ACE · LABORATOIRE RP</div><h2>${esc(title)}</h2><p class="muted">${esc(sub)}</p></div><div class="lab-banner-actions">${actions}</div></div>`}
async function labAction(payload,message,after){
 if(LAB.busy)return;LAB.busy=true;
 try{const data=await api('lab','POST',payload);if(message)toast(message);if(after)await after(data);return data}
 catch(e){toast('Labo : '+e.message);return null}
 finally{LAB.busy=false}
}
async function labGroupsScreen(c){
 const d=await api('lab?kind=overview');if(!d.supplier)return labGroupScreen(c,null);
 const groups=d.groups.filter(g=>LAB.archived?!g.active:g.active);
 const red=d.groups.filter(g=>g.active&&(g.status==='red'||g.pending>0)).length,ready=d.groups.filter(g=>g.active&&g.status==='green'&&!g.pending).length;
 c.innerHTML=labHead('Labo · Fournisseurs','Un espace indépendant pour chaque groupe et un circuit de transformation commun.',`<button class="btn" id="labRecipeBtn">⚙ Circuit de calcul</button><button class="btn gold" id="labNewGroup">+ Groupe</button>`)+
 `<div class="lab-metrics"><div class="lab-metric"><small>Groupes actifs</small><b>${d.groups.filter(x=>x.active).length}</b></div><div class="lab-metric"><small>À transformer</small><b>${red}</b></div><div class="lab-metric"><small>Prêts à rendre</small><b>${ready}</b></div><div class="lab-metric"><small>Déclarations à vérifier</small><b>${d.groups.reduce((t,g)=>t+g.pending,0)}</b></div></div>
 <div class="lab-toolbar"><div><h3>Fiches des groupes</h3><p class="muted">● Blanc : vide · ● Rouge : production en attente · ● Vert : tout est transformé</p></div><div class="lab-toolbar-actions"><input id="labSearch" class="input" placeholder="Rechercher un groupe…" aria-label="Rechercher un groupe"><label class="check lab-archive"><input type="checkbox" id="labShowArchived" ${LAB.archived?'checked':''}> Archivés</label><button class="btn" id="labRefresh">↻</button></div></div>
 <div class="lab-groups" id="labGroupCards">${groups.map(g=>`<button class="lab-group" data-gid="${g.id}"><div class="lab-group-top"><span class="lab-group-icon">⚗</span>${labStatus(g.pending>0?'red':g.status)}</div><b>${esc(g.name)}</b><div class="lab-group-bottom"><small>${labNum(g.heads)} têtes · ${labNum(g.bricks)} briques · ${labNum(g.bags)} pochons</small>${g.pending?`<span class="lab-pending">${g.pending} demande(s)</span>`:''}</div></button>`).join('')||'<div class="panel muted">Aucun groupe. Clique sur « + Groupe » pour en ajouter un.</div>'}</div>`;
 $('#labRecipeBtn',c).onclick=()=>{LAB.screen='recipe';labRender(c)};
 $('#labNewGroup',c).onclick=()=>labGroupEditor(c,null);
 $('#labRefresh',c).onclick=()=>labRender(c);
 $('#labShowArchived',c).onchange=e=>{LAB.archived=e.target.checked;labRender(c)};
 $('#labSearch',c).oninput=e=>{const q=e.target.value.trim().toLowerCase();$$('.lab-group',c).forEach(x=>x.hidden=!x.querySelector('b').textContent.toLowerCase().includes(q))};
 $$('.lab-group',c).forEach(b=>b.onclick=()=>{LAB.groupId=b.dataset.gid;LAB.screen='group';labRender(c)});
 labAutoRefresh(c,'groups');
}
async function labGroupEditor(c,g,canDelete=false){
 const d=modal(`<h2>${g?'Modifier le groupe':'Ajouter un groupe Labo'}</h2><p class="muted">Une fiche par groupe. Si tu coches « Catégorie Labo » sur son compte avec ce même nom, la fiche lui sera automatiquement associée.</p><form class="stack" id="labGroupForm"><label>Nom du groupe<input name="name" class="input" maxlength="90" value="${esc(g?.name||'')}" required></label><button class="btn gold">Enregistrer</button></form>${g?`<button id="labArchiveGroup" class="btn ${g.active?'danger':''}" style="margin-top:10px">${!g.active?'Réactiver le groupe':canDelete?'Supprimer définitivement':'Archiver le groupe'}</button>`:''}`);
 $('#labGroupForm',d).onsubmit=async e=>{e.preventDefault();const name=new FormData(e.currentTarget).get('name');const r=await labAction(g?{action:'groupRename',id:g.id,name}:{action:'groupCreate',name},'Groupe enregistré');if(r){d.remove();LAB.screen='groups';labRender(c)}};
 $('#labArchiveGroup',d)?.addEventListener('click',async()=>{
   const active=!g.active;
   const remove=canDelete&&g.active;
   const warning=remove?`Supprimer définitivement la catégorie « ${g.name} » ?`:active?`Réactiver ${g.name} ?`:`Archiver ${g.name} ? L'historique sera conservé et le compte associé perdra l'accès Labo.`;
   if(!confirm(warning))return;
   const r=await labAction(remove?{action:'groupDelete',id:g.id}:{action:'groupArchive',id:g.id,active},remove?'Groupe supprimé':active?'Groupe réactivé':'Groupe archivé');
   if(r){d.remove();LAB.groupId=null;LAB.screen='groups';labRender(c)}
 })
}
function labRecipeText(recipe){const r=recipe||{};return `<div class="lab-flow"><div><span>🌿 Têtes</span><b>${r.headsInput??'?'} unités</b></div><span class="lab-arrow">→</span><div><span>▣ Briques</span><b>${r.bricksOutput??'?'} unité(s)</b></div><span class="lab-arrow">· · ·</span><div><span>▣ Briques</span><b>${r.bricksInput??'?'} unité(s)</b></div><span class="lab-arrow">→</span><div><span>◈ Pochons</span><b>${r.bagsOutput??'?'} unité(s)</b></div></div>`}
async function labRecipeScreen(c){
 const d=await api('lab?kind=overview');if(!d.supplier)return labRender(c);
 const r=await api('lab?kind=recipe');
 c.innerHTML=labHead('Circuit de transformation','Définis les ratios du jeu : aucune valeur n’est supposée ou imposée.',`<button class="btn" id="labBack">← Groupes</button>`)+
 `<div class="lab-recipe-panel"><h3>Les deux étapes du circuit</h3><p class="muted">La valeur saisie correspond à une simulation RP. Exemple fictif : si tu configures 10 → 1, produire 50 briques retirera 500 têtes au stock du groupe.</p>${labRecipeText(r)}
 <form id="labRecipeForm" class="stack"><div class="lab-step"><h3>01 · Têtes → Briques</h3><div class="lab-step-input"><label>Nombre de têtes utilisées<input class="input" type="number" name="headsInput" min="1" max="100000" step="1" value="${r.headsInput??''}" placeholder="À définir"></label><span>→</span><label>Nombre de briques produites<input class="input" type="number" name="bricksOutput" min="1" max="100000" step="1" value="${r.bricksOutput??''}" placeholder="À définir"></label></div></div>
 <div class="lab-step"><h3>02 · Briques → Pochons</h3><div class="lab-step-input"><label>Nombre de briques utilisées<input class="input" type="number" name="bricksInput" min="1" max="100000" step="1" value="${r.bricksInput??''}" placeholder="À définir"></label><span>→</span><label>Nombre de pochons produits<input class="input" type="number" name="bagsOutput" min="1" max="100000" step="1" value="${r.bagsOutput??''}" placeholder="À définir"></label></div></div>
 <div class="line wrap"><button class="btn gold" type="submit">Enregistrer les ratios</button><span class="muted">L'historique conserve les ratios utilisés au moment de chaque opération.</span></div></form></div>`;
 $('#labBack',c).onclick=()=>{LAB.screen='groups';labRender(c)};
 $('#labRecipeForm',c).onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget),p={action:'recipe'};['headsInput','bricksOutput','bricksInput','bagsOutput'].forEach(k=>p[k]=f.get(k));const ok=await labAction(p,'Circuit de calcul mis à jour');if(ok)labRender(c)};
}
async function labGroupScreen(c,gid){
 if(!gid){const o=await api('lab?kind=overview');gid=o.groups[0]?.id;LAB.groupId=gid}
 if(!gid){c.innerHTML=labHead('Mon Labo','Aucune catégorie Labo associée à ce compte. Demande à Black Ace de cocher « Catégorie Labo » lors de la création de ton compte.');return}
 const d=await api('lab?kind=group&id='+encodeURIComponent(gid)),g=d.group,s=d.stock;
 LAB.lastData=d;LAB.groupId=g.id;
 const isStaff=d.supplier,pending=d.requests.filter(r=>r.status==='pending').length;
 c.innerHTML=labHead(isStaff?g.name:'Mon Labo · '+g.name,isStaff?'Fournisseur BLACK ACE · production et suivi des lots':'Espace partenaire · déclare tes dépôts et suis leur avancement.',`${isStaff?'<button class="btn" id="labBack">← Groupes</button>':''}<button class="btn" id="labReload">↻ Actualiser</button>`)+
 `<div class="lab-summary-row"><div>${labStatus(pending>0?'red':s.status)}<span class="muted">${pending} déclaration(s) à confirmer</span></div>${isStaff?`<div class="lab-action-buttons"><button class="btn" id="labEditGroup">Modifier / supprimer</button><button class="btn" id="labRecipeNav">⚙ Ratios</button></div>`:''}</div>
 <div class="lab-stock-grid">${[['heads','Têtes de weed','🌿'],['bricks','Briques','▣'],['bags','Pochons','◈']].map(([key,title,ic],i)=>`<div class="lab-stock-card stage-${i}"><div class="lab-stock-title"><span>${ic}</span><small>${title}</small></div><div class="lab-stock-count">${labNum(s[key])}</div><div class="muted lab-stock-sub">${i===0?'En attente de transformation':i===1?'En cours de transformation':'Prêts à rendre'}</div>${isStaff?`<div class="lab-quick"><button class="lab-stock-nudge" data-stage="${key}" data-delta="-1" aria-label="Retirer 1">−</button><input class="input lab-stock-qty" data-stage="${key}" type="number" min="0" step="1" value="${s[key]}"><button class="lab-stock-nudge" data-stage="${key}" data-delta="1" aria-label="Ajouter 1">+</button></div><small class="muted">Saisie directe · Entrée pour enregistrer</small>`:''}</div>`).join('')}</div>
 ${labRecipeText(d.recipe)}
 <div class="lab-actions-panel"><div><h3>${isStaff?'Gérer la transformation':'Déclarer des têtes reçues'}</h3><p class="muted">${isStaff?'Chaque action ajuste les quantités et enregistre le compte qui la réalise.':'La déclaration est transmise à BLACK ACE pour confirmation.'}</p></div><div class="lab-action-buttons">${isStaff?`<button class="btn" id="labReceive">+ Têtes reçues</button><button class="btn" id="labBricks">Fabriquer des briques</button><button class="btn gold" id="labBags">Préparer les pochons</button><button class="btn" id="labReturn">Restituer</button><button class="btn" id="labAdjust">Corriger stock</button>`:`<button class="btn gold" id="labRequestCreate">+ Têtes de weed reçues</button>`}</div></div>
 <div class="lab-twocol"><div class="lab-box"><div class="section-head"><h3>Déclarations de têtes</h3><span class="pill">${pending} en attente</span></div><div class="lab-activity">${d.requests.map(r=>`<div class="lab-activity-row"><div><b>${labNum(r.heads)} têtes</b><div class="muted">${esc(r.authorName)} · ${dt(r.createdAt)}${r.note?' · '+esc(r.note):''}</div></div><div class="lab-act-right"><span class="lab-request-${r.status}">${{pending:'En attente',accepted:'Confirmée',rejected:'Refusée',cancelled:'Annulée'}[r.status]||r.status}</span>${r.status==='pending'?(isStaff?`<button class="btn small labAccept" data-rid="${r.id}">Confirmer</button><button class="btn small danger labReject" data-rid="${r.id}">Refuser</button>`:`<button class="btn small labEditRequest" data-rid="${r.id}">Modifier</button><button class="btn small danger labCancelRequest" data-rid="${r.id}">Annuler</button>`):''}</div></div>`).join('')||'<p class="muted">Aucune déclaration pour ce groupe.</p>'}</div></div>
 <div class="lab-box"><div class="section-head"><h3>Historique des transformations</h3><span class="pill">${d.actions.length} opération(s)</span></div><div class="lab-activity">${d.actions.map(a=>`<div class="lab-activity-row"><div><b>${esc(labKindName[a.kind]||a.kind)}${a.stage?' · '+esc(({heads:'Têtes',bricks:'Briques',bags:'Pochons'})[a.stage]||a.stage):''}</b><div class="muted">${esc(a.actorName)} · ${dt(a.createdAt)}${a.note?' · '+esc(a.note):''}</div></div><div class="lab-act-right"><strong>${labNum(a.quantityOut||a.quantityIn)}</strong></div></div>`).join('')||'<p class="muted">Aucune opération enregistrée.</p>'}</div></div></div>`;
 $('#labReload',c).onclick=()=>labRender(c);
 labAutoRefresh(c,'group');
 $('#labBack',c)?.addEventListener('click',()=>{LAB.groupId=null;LAB.screen='groups';labRender(c)});
 $('#labEditGroup',c)?.addEventListener('click',()=>labGroupEditor(c,g,!g.owner_user_id&&d.actions.length===0&&d.requests.length===0));
 $('#labRecipeNav',c)?.addEventListener('click',()=>{LAB.screen='recipe';labRender(c)});
 if(isStaff){
   [['labReceive','receive'],['labBricks','bricks'],['labBags','bags'],['labReturn','return'],['labAdjust','adjust']].forEach(([id,kind])=>$('#'+id,c)?.addEventListener('click',()=>labMovementModal(c,d,kind)));
   labQuickEdits(c,d);
   $$('.labAccept',c).forEach(b=>b.onclick=async()=>{if(!confirm('Confirmer la réception de ces têtes ? Elles seront ajoutées au stock du groupe.'))return;const r=await labAction({action:'requestDecide',groupId:g.id,id:b.dataset.rid,accept:true},'Réception confirmée');if(r)labRender(c)});
   $$('.labReject',c).forEach(b=>b.onclick=async()=>{if(!confirm('Refuser cette déclaration ?'))return;const r=await labAction({action:'requestDecide',groupId:g.id,id:b.dataset.rid,accept:false},'Déclaration refusée');if(r)labRender(c)});
 }else{
   $('#labRequestCreate',c).onclick=()=>labRequestModal(c,null);
   $$('.labEditRequest',c).forEach(b=>b.onclick=()=>labRequestModal(c,d.requests.find(r=>r.id===b.dataset.rid)));
   $$('.labCancelRequest',c).forEach(b=>b.onclick=async()=>{if(!confirm('Annuler cette déclaration ?'))return;const r=await labAction({action:'requestCancel',id:b.dataset.rid},'Déclaration annulée');if(r)labRender(c)});
 }
}
function labRequestModal(c,r){
 const d=modal(`<h2>${r?'Modifier la déclaration':'Têtes de weed reçues'}</h2><p class="muted">Renseigne le nombre de têtes confiées au Labo. Black Ace confirmera la réception avant de les intégrer au stock.</p><form class="stack"><label>Quantité de têtes<input name="heads" class="input" type="number" min="1" max="1000000000" step="1" value="${r?.heads||''}" required autofocus></label><label>Note facultative<textarea name="note" class="input" maxlength="1000">${esc(r?.note||'')}</textarea></label><button class="btn gold">${r?'Enregistrer les modifications':'Envoyer la déclaration'}</button></form>`);
 $('form',d).onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget);const q=Number(f.get('heads'));if(!Number.isSafeInteger(q)||q<=0)return toast('Indique une quantité entière positive');const p=r?{action:'requestEdit',id:r.id,heads:q,note:f.get('note')}:{action:'requestCreate',heads:q,note:f.get('note')};const result=await labAction(p,'Déclaration enregistrée');if(result){d.remove();labRender(c)}};
}
function labMovementModal(c,d,kind){
 const titles={receive:'Enregistrer des têtes reçues',bricks:'Produire des briques',bags:'Préparer des pochons',return:'Restituer les pochons',adjust:'Corriger un stock'};
 const ratio=d.recipe;
 const unavailable=(kind==='bricks'&&!(ratio.headsInput&&ratio.bricksOutput))||(kind==='bags'&&!(ratio.bricksInput&&ratio.bagsOutput));
 const stepOptions=kind==='adjust'?`<label>Stock à corriger<select class="input" name="stage"><option value="heads">Têtes</option><option value="bricks">Briques</option><option value="bags">Pochons</option></select></label>`:'';
 const dModal=modal(`<h2>${titles[kind]}</h2>${unavailable?'<p class="lab-alert">Configure d’abord le circuit de calcul dans « ⚙ Ratios ».</p>':''}<form class="stack">${stepOptions}<label>${kind==='adjust'?'Nouvelle quantité totale':kind==='bricks'?'Nombre de briques produites':kind==='bags'?'Nombre de pochons préparés':'Quantité'}<input class="input" name="quantity" type="number" min="${kind==='adjust'?'0':'1'}" step="1" required placeholder="0"></label><p class="muted" id="labCalcHint">${kind==='receive'?'Ajout immédiat aux têtes de ce groupe.':kind==='adjust'?'La correction est enregistrée dans les logs.':kind==='return'?'Les pochons remis seront retirés du stock.':'La consommation sera calculée automatiquement.'}</p><label>Note (facultative)<textarea name="note" maxlength="1000" class="input" placeholder="Ex. Lot de Mathéo"></textarea></label><button class="btn gold" ${unavailable?'disabled':''}>Valider l’opération</button></form>`);
 const f=$('form',dModal),inp=$('[name="quantity"]',f);inp.oninput=()=>{
  const n=Number(inp.value),hint=$('#labCalcHint',dModal);
  if(kind==='bricks'&&ratio.headsInput&&ratio.bricksOutput){const used=n*ratio.headsInput/ratio.bricksOutput;hint.textContent=`Consommation calculée : ${labNum(used)} têtes. Disponibles : ${labNum(d.stock.heads)}.`}
  if(kind==='bags'&&ratio.bricksInput&&ratio.bagsOutput){const used=n*ratio.bricksInput/ratio.bagsOutput;hint.textContent=`Consommation calculée : ${labNum(used)} briques. Disponibles : ${labNum(d.stock.bricks)}.`}
 };
 f.onsubmit=async e=>{e.preventDefault();const v=Number(inp.value);if(!Number.isSafeInteger(v)||(kind==='adjust'?v<0:v<=0))return toast('Quantité entière invalide');const ff=new FormData(f);const r=await labAction({action:'movement',groupId:d.group.id,kind,quantity:v,stage:ff.get('stage')||null,note:ff.get('note')||''},'Stock actualisé');if(r){dModal.remove();labRender(c)}};
}
function labQuickEdits(c,d){
 const timers={};const expected={heads:Number(d.stock.heads),bricks:Number(d.stock.bricks),bags:Number(d.stock.bags)};
 const save=async stage=>{delete timers[stage];if(LAB.busy){queue(stage);return}const input=$(`.lab-stock-qty[data-stage="${stage}"]`,c);if(!input||!c.isConnected)return;const n=Number(input.value);if(!Number.isSafeInteger(n)||n<0||n>1000000000){input.value=expected[stage];return toast('Quantité invalide')};if(n===expected[stage])return;
 const old=expected[stage];expected[stage]=n;const r=await labAction({action:'movement',groupId:d.group.id,kind:'adjust',stage,quantity:n,note:'Ajustement rapide'},'Stock mis à jour');if(!r){expected[stage]=old;input.value=old;return}const latest=$(`.lab-stock-qty[data-stage="${stage}"]`,c);if(latest&&Number(latest.value)!==n){queue(stage);return}if(state.page==='lab'&&LAB.groupId===d.group.id)labRender(c)};
 const queue=stage=>{clearTimeout(timers[stage]);timers[stage]=setTimeout(()=>save(stage),550)};
 $$('.lab-stock-nudge',c).forEach(b=>b.onclick=()=>{const inp=$(`.lab-stock-qty[data-stage="${b.dataset.stage}"]`,c),v=Number(inp.value)||0;inp.value=Math.max(0,v+Number(b.dataset.delta));queue(b.dataset.stage)});
 $$('.lab-stock-qty',c).forEach(inp=>{inp.onfocus=()=>inp.select();inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();clearTimeout(timers[inp.dataset.stage]);save(inp.dataset.stage)}};inp.onchange=()=>queue(inp.dataset.stage)});
 const prev=state.pageCleanup;state.pageCleanup=()=>{Object.values(timers).forEach(clearTimeout);if(prev)prev()};
}

// Actualisation visible entre les tablettes, sans interrompre les modifications ou fenêtres ouvertes.
function labAutoRefresh(c,screen){
 const timer=setInterval(()=>{
   if(state.page!=='lab'||LAB.screen!==screen||LAB.busy||!c?.isConnected)return;
   if(document.querySelector('.modal-back'))return;
   if(document.activeElement?.matches('input,textarea,select'))return;
   labRender(c);
 },12000);
 const previous=state.pageCleanup;
 state.pageCleanup=()=>{clearInterval(timer);if(previous)previous()};
}
