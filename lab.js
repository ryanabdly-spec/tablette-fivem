/* BLACK ACE V17.1 — interface Labo RP. Les partenaires ne voient jamais le suivi de production. */
const LAB={groupId:null,archived:false,screen:'groups',busy:false,syncing:false,lastData:null};
const labNum=n=>new Intl.NumberFormat('fr-FR',{maximumFractionDigits:0}).format(Number(n)||0);
const labDot={red:['red','À transformer'],green:['green','Prêt à rendre'],white:['white','Vide']};
const labKindName={receive:'Têtes reçues',receipt:'Têtes reçues',bricks:'Briques produites',bags:'Pochons préparés',return:'Pochons rendus'};
const labCanEdit=()=>isLabStaff();
const labActive=()=>state.page==='lab';

async function labView(c){
 LAB.screen=isLabStaff()?'groups':'group';LAB.groupId=null;LAB.lastData=null;
 await labRender(c);
}
async function labRender(c){
 if(!c||!labActive())return;
 if(state.pageCleanup){const old=state.pageCleanup;state.pageCleanup=null;try{old()}catch{}}
 c.innerHTML='<div class="panel muted">Chargement du Labo…</div>';
 try{
   if(LAB.screen==='recipe'&&isLabStaff())return await labRecipeScreen(c);
   if(LAB.screen==='groups'&&isLabStaff())return await labGroupsScreen(c);
   return await labGroupScreen(c,LAB.groupId);
 }catch(e){c.innerHTML=`<div class="panel"><h3>Impossible de charger le Labo</h3><p class="muted">${esc(e.message)}</p><button class="btn gold" id="labRetry">Réessayer</button></div>`;$('#labRetry',c)?.addEventListener('click',()=>labRender(c))}
}
function labStatus(st){const v=labDot[st]||labDot.white;return `<span class="lab-status ${v[0]}"><i></i>${v[1]}</span>`}
function labHead(title,sub,actions=''){return `<div class="lab-banner"><div><div class="eyebrow">BLACK ACE · LABO RP</div><h2>${esc(title)}</h2><p class="muted">${esc(sub)}</p></div><div class="lab-banner-actions">${actions}</div></div>`}
async function labAction(payload,message){
 if(LAB.busy)return null;LAB.busy=true;
 try{const r=await api('lab','POST',payload);if(message)toast(message);return r}
 catch(e){toast('Labo : '+e.message);return null}
 finally{LAB.busy=false}
}
function labCardHTML(g){return `<div class="lab-group-top"><span class="lab-group-icon">⚗</span>${labStatus(g.pending>0?'red':g.status)}</div><b>${esc(g.name)}</b><div class="lab-group-bottom"><small>${labNum(g.heads)} têtes · ${labNum(g.bricks)} briques · ${labNum(g.bags)} pochons</small>${g.pending?`<span class="lab-pending">${g.pending} demande(s)</span>`:''}</div>`}
function labOverviewTotals(groups){return {active:groups.filter(g=>g.active).length,red:groups.filter(g=>g.active&&(g.status==='red'||g.pending>0)).length,green:groups.filter(g=>g.active&&g.status==='green'&&!g.pending).length,pending:groups.reduce((n,g)=>n+(g.pending||0),0)}}
async function labGroupsScreen(c){
 const d=await api('lab?kind=overview');if(!d.supplier){LAB.screen='group';return labGroupScreen(c,null)}
 const filtered=d.groups.filter(g=>LAB.archived?!g.active:g.active),tot=labOverviewTotals(d.groups);
 c.innerHTML=labHead('Labo · Fournisseur','Tous les groupes et leur état de préparation, sans rechargement intempestif.',`<button class="btn" id="labRecipeBtn">⚙ Circuit de calcul</button><button class="btn gold" id="labNewGroup">+ Groupe</button>`)+
 `<div class="lab-metrics"><div class="lab-metric"><small>Groupes actifs</small><b data-labmetric="active">${tot.active}</b></div><div class="lab-metric"><small>À transformer</small><b data-labmetric="red">${tot.red}</b></div><div class="lab-metric"><small>Prêts à rendre</small><b data-labmetric="green">${tot.green}</b></div><div class="lab-metric"><small>Déclarations en attente</small><b data-labmetric="pending">${tot.pending}</b></div></div>
 <div class="lab-toolbar"><div><h3>Fiches des groupes</h3><p class="muted">● Blanc : vide · ● Rouge : production en attente · ● Vert : prêt à rendre</p></div><div class="lab-toolbar-actions"><input id="labSearch" class="input" placeholder="Rechercher un groupe…"><label class="check lab-archive"><input type="checkbox" id="labShowArchived" ${LAB.archived?'checked':''}> Archivés</label><button class="btn" id="labRefresh">↻ Actualiser</button></div></div>
 <div class="lab-groups" id="labGroupCards">${filtered.map(g=>`<button class="lab-group" data-gid="${g.id}">${labCardHTML(g)}</button>`).join('')||'<div class="panel muted">Aucun groupe. Clique sur « + Groupe » pour en ajouter un.</div>'}</div>`;
 $('#labRecipeBtn',c).onclick=()=>{LAB.screen='recipe';labRender(c)};
 $('#labNewGroup',c).onclick=()=>labGroupEditor(c,null);
 $('#labRefresh',c).onclick=()=>labRender(c);
 $('#labShowArchived',c).onchange=e=>{LAB.archived=e.target.checked;labRender(c)};
 $('#labSearch',c).oninput=e=>{const q=e.target.value.trim().toLowerCase();$$('.lab-group',c).forEach(el=>el.hidden=!el.querySelector('b').textContent.toLowerCase().includes(q))};
 $$('.lab-group',c).forEach(b=>b.onclick=()=>{LAB.groupId=b.dataset.gid;LAB.screen='group';labRender(c)});
 labAutoRefresh(c,'groups');
}
async function labGroupEditor(c,g,canDelete=false){
 const d=modal(`<h2>${g?'Modifier le groupe':'Ajouter un groupe Labo'}</h2><p class="muted">Les groupes associés à un compte « Catégorie Labo » sont créés automatiquement. Tu peux aussi en préparer un à l'avance.</p><form class="stack" id="labGroupForm"><label>Nom du groupe<input name="name" class="input" maxlength="90" value="${esc(g?.name||'')}" required></label><button class="btn gold">Enregistrer</button></form>${g?`<button id="labArchiveGroup" class="btn ${g.active?'danger':''}" style="margin-top:10px">${!g.active?'Réactiver le groupe':canDelete?'Supprimer définitivement':'Archiver le groupe'}</button>`:''}`);
 $('#labGroupForm',d).onsubmit=async e=>{e.preventDefault();const name=new FormData(e.currentTarget).get('name');const result=await labAction(g?{action:'groupRename',id:g.id,name}:{action:'groupCreate',name},'Groupe enregistré');if(result){d.remove();LAB.screen='groups';labRender(c)}};
 $('#labArchiveGroup',d)?.addEventListener('click',async()=>{
   const active=!g.active,remove=canDelete&&g.active;
   const warning=remove?`Supprimer définitivement la catégorie « ${g.name} » ?`:active?`Réactiver ${g.name} ?`:`Archiver ${g.name} ? Son historique sera conservé.`;
   if(!confirm(warning))return;
   const result=await labAction(remove?{action:'groupDelete',id:g.id}:{action:'groupArchive',id:g.id,active},remove?'Groupe supprimé':active?'Groupe réactivé':'Groupe archivé');
   if(result){d.remove();LAB.groupId=null;LAB.screen='groups';labRender(c)}
 });
}
function labRecipeText(recipe){const r=recipe||{};return `<div class="lab-flow"><div><span>🌿 Têtes</span><b>${r.headsInput??'?'} unités</b></div><span class="lab-arrow">→</span><div><span>▣ Briques</span><b>${r.bricksOutput??'?'} unité(s)</b></div><span class="lab-arrow">· · ·</span><div><span>▣ Briques</span><b>${r.bricksInput??'?'} unité(s)</b></div><span class="lab-arrow">→</span><div><span>◈ Pochons</span><b>${r.bagsOutput??'?'} unité(s)</b></div></div>`}
async function labRecipeScreen(c){
 const r=await api('lab?kind=recipe');
 c.innerHTML=labHead('Circuit de transformation','Définis les ratios propres au serveur RP : aucune valeur n’est imposée.',`<button class="btn" id="labBack">← Groupes</button>`)+
 `<div class="lab-recipe-panel"><h3>Les deux étapes du circuit</h3><p class="muted">Les rapports sont modifiables. Chaque opération utilise les rapports enregistrés au moment de la validation.</p>${labRecipeText(r)}
 <form id="labRecipeForm" class="stack"><div class="lab-step"><h3>01 · Têtes → Briques</h3><div class="lab-step-input"><label>Nombre de têtes utilisées<input class="input" type="number" name="headsInput" min="1" max="100000" step="1" value="${r.headsInput??''}" placeholder="À définir"></label><span>→</span><label>Nombre de briques produites<input class="input" type="number" name="bricksOutput" min="1" max="100000" step="1" value="${r.bricksOutput??''}" placeholder="À définir"></label></div></div>
 <div class="lab-step"><h3>02 · Briques → Pochons</h3><div class="lab-step-input"><label>Nombre de briques utilisées<input class="input" type="number" name="bricksInput" min="1" max="100000" step="1" value="${r.bricksInput??''}" placeholder="À définir"></label><span>→</span><label>Nombre de pochons produits<input class="input" type="number" name="bagsOutput" min="1" max="100000" step="1" value="${r.bagsOutput??''}" placeholder="À définir"></label></div></div>
 <div class="line wrap"><button class="btn gold" type="submit">Enregistrer les ratios</button><span class="muted">Le fournisseur seul peut modifier ces calculs.</span></div></form></div>`;
 $('#labBack',c).onclick=()=>{LAB.screen='groups';labRender(c)};
 $('#labRecipeForm',c).onsubmit=async e=>{e.preventDefault();const f=new FormData(e.currentTarget),p={action:'recipe'};['headsInput','bricksOutput','bricksInput','bagsOutput'].forEach(k=>p[k]=f.get(k));const ok=await labAction(p,'Circuit enregistré');if(ok)labRender(c)};
}
function labRequestHTML(requests,isStaff){
 const rows=(requests||[]).map(r=>`<div class="lab-activity-row lab-request-row"><div><b>${labNum(r.heads)} têtes</b><div class="muted">${isStaff?`${esc(r.authorName||'Groupe')} · `:''}${dt(r.createdAt)}${r.note?' · '+esc(r.note):''}</div></div><div class="lab-act-right"><span class="lab-request-${r.status}">${{pending:'En attente',accepted:'Confirmée',rejected:'Refusée',cancelled:'Annulée'}[r.status]||r.status}</span>${r.status==='pending'?(isStaff?`<button class="btn small labAccept" data-rid="${r.id}">Confirmer</button><button class="btn small danger labReject" data-rid="${r.id}">Refuser</button>`:`<button class="btn small labEditRequest" data-rid="${r.id}">Modifier</button><button class="btn small danger labCancelRequest" data-rid="${r.id}">Annuler</button>`):''}</div></div>`).join('');
 return rows||`<div class="lab-empty"><span>✓</span><b>${isStaff?'Aucune déclaration enregistrée':'Aucune demande en attente'}</b><p>${isStaff?'Les nouveaux dépôts apparaîtront ici.':'Utilise le bouton de déclaration pour envoyer une quantité à Black Ace.'}</p></div>`;
}
function labActionHTML(actions){return (actions||[]).map(a=>`<div class="lab-activity-row"><div><b>${esc(labKindName[a.kind]||a.kind)}${a.stage?' · '+esc(({heads:'Têtes',bricks:'Briques',bags:'Pochons'})[a.stage]||a.stage):''}</b><div class="muted">${esc(a.actorName)} · ${dt(a.createdAt)}${a.note?' · '+esc(a.note):''}</div></div><div class="lab-act-right"><strong>${labNum(a.quantityOut||a.quantityIn)}</strong></div></div>`).join('')||'<p class="muted">Aucune opération enregistrée.</p>'}
function labSetHTML(element,content){if(element&&element.innerHTML!==content){const top=element.scrollTop;element.innerHTML=content;element.scrollTop=top;return true}return false}
async function labGroupScreen(c,gid){
 if(!gid){const o=await api('lab?kind=overview');gid=o.groups?.[0]?.id;LAB.groupId=gid}
 if(!gid){c.innerHTML=labHead('Mon espace Labo','Aucun groupe associé à ce compte. Demande à Black Ace d’activer « Catégorie Labo » sur ton compte.');return}
 const d=await api('lab?kind=group&id='+encodeURIComponent(gid));
 LAB.lastData=d;LAB.groupId=d.group.id;
 if(isLabClient() || !d.supplier || !d.stock){labClientScreen(c,d);return}
 const g=d.group,s=d.stock||{heads:0,bricks:0,bags:0,status:'white'},pending=d.requests.filter(r=>r.status==='pending').length;
 c.innerHTML=labHead(g.name,'Fournisseur BLACK ACE · Suivi et préparation des lots',`<button class="btn" id="labBack">← Groupes</button><button class="btn" id="labReload">↻ Actualiser</button>`)+
 `<div class="lab-summary-row"><div><span id="labStatusHolder">${labStatus(pending>0?'red':(s?.status||'white'))}</span><span class="muted lab-pending-summary"><span data-pending-total>${pending}</span> déclaration(s) en attente</span></div><div class="lab-action-buttons"><button class="btn" id="labEditGroup">Modifier / supprimer</button><button class="btn" id="labRecipeNav">⚙ Ratios</button></div></div>
 <div class="lab-stock-grid">${[['heads','Têtes de weed','🌿'],['bricks','Briques','▣'],['bags','Pochons','◈']].map(([key,title,ic],i)=>`<div class="lab-stock-card stage-${i}"><div class="lab-stock-title"><span>${ic}</span><small>${title}</small></div><div class="lab-stock-count" data-stock-count="${key}">${labNum(s[key])}</div><div class="muted lab-stock-sub">${i===0?'Restant à transformer':i===1?'En attente de préparation':'Prêts à rendre'}</div></div>`).join('')}</div>
 ${labRecipeText(d.recipe)}
 <div class="lab-actions-panel"><div><h3>Étapes de transformation</h3><p class="muted">Les quantités évoluent uniquement après confirmation d'un dépôt ou réalisation d'une étape. Aucun ajustement manuel.</p></div><div class="lab-action-buttons"><button class="btn" id="labBricks">Transformer en briques</button><button class="btn gold" id="labBags">Préparer les pochons</button><button class="btn" id="labReturn">Restituer</button></div></div>
 <div class="lab-twocol"><div class="lab-box"><div class="section-head"><h3>Déclarations des groupes</h3><span class="pill" data-pending-pill>${pending} à confirmer</span></div><div class="lab-activity" id="labRequestsList">${labRequestHTML(d.requests,true)}</div></div>
 <div class="lab-box"><div class="section-head"><h3>Traçabilité fournisseur</h3><span class="pill" data-actions-total>${d.actions.length} opération(s)</span></div><div class="lab-activity" id="labActionsList">${labActionHTML(d.actions)}</div></div></div>`;
 $('#labReload',c).onclick=()=>labSyncGroup(c,true);
 $('#labBack',c).onclick=()=>{LAB.groupId=null;LAB.screen='groups';labRender(c)};
 $('#labEditGroup',c).onclick=()=>labGroupEditor(c,g,!g.owner_user_id&&d.actions.length===0&&d.requests.length===0);
 $('#labRecipeNav',c).onclick=()=>{LAB.screen='recipe';labRender(c)};
 [['labBricks','bricks'],['labBags','bags'],['labReturn','return']].forEach(([id,kind])=>$('#'+id,c)?.addEventListener('click',()=>labMovementModal(c,LAB.lastData,kind)));
 labBindRequestButtons(c);
 labAutoRefresh(c,'group');
}
function labClientScreen(c,d){
 const pending=(d.requests||[]).filter(r=>r.status==='pending').length;
 c.innerHTML=labHead('Mon espace Labo',`Groupe ${d.group.name} · Déclaration des quantités`,`<button class="btn" id="labReload">↻ Actualiser</button>`)+
 `<div class="lab-client-hero"><div class="lab-client-hero-copy"><div class="eyebrow">ESPACE PARTENAIRE</div><h3>Déclarer des têtes de weed</h3><p>Indique les quantités que tu souhaites confier au labo. Tu peux modifier ou annuler une déclaration tant qu’elle est en attente.</p><button class="btn gold lab-client-cta" id="labRequestCreate">+ Nouvelle déclaration</button></div><div class="lab-client-icon" aria-hidden="true">🌿</div></div>
 <div class="lab-client-grid"><section class="lab-box lab-client-requests"><div class="section-head"><div><h3>Mes demandes en cours</h3><p class="muted">Uniquement les déclarations non traitées.</p></div><span class="pill" data-pending-pill>${pending} en attente</span></div><div class="lab-activity" id="labRequestsList">${labRequestHTML(d.requests,false)}</div></section>
 <aside class="lab-client-guide"><div class="lab-guide-step"><span>01</span><div><b>Déclare</b><p>Envoie la quantité de têtes reçues.</p></div></div><div class="lab-guide-step"><span>02</span><div><b>Modifie si nécessaire</b><p>Corrige ou annule une demande encore en attente.</p></div></div><div class="lab-guide-step"><span>03</span><div><b>Validation</b><p>Black Ace prend en charge ta déclaration.</p></div></div></aside></div>`;
 $('#labRequestCreate',c).onclick=()=>labRequestModal(c,null);
 $('#labReload',c).onclick=()=>labSyncGroup(c,true);
 labBindRequestButtons(c);
 // Aucune synchronisation de stock ni d'activité fournisseur côté client.
}
function labBindRequestButtons(c){
 const data=LAB.lastData;if(!data||!labActive())return;
 if(data.supplier){
   $$('.labAccept',c).forEach(b=>b.onclick=async()=>{
     if(!confirm('Confirmer la réception de ces têtes et les ajouter au stock ?'))return;
     const r=await labAction({action:'requestDecide',groupId:data.group.id,id:b.dataset.rid,accept:true},'Réception confirmée');if(r)await labSyncGroup(c,true);
   });
   $$('.labReject',c).forEach(b=>b.onclick=async()=>{
     if(!confirm('Refuser cette déclaration ?'))return;
     const r=await labAction({action:'requestDecide',groupId:data.group.id,id:b.dataset.rid,accept:false},'Déclaration refusée');if(r)await labSyncGroup(c,true);
   });
 }else{
   $$('.labEditRequest',c).forEach(b=>b.onclick=()=>labRequestModal(c,LAB.lastData?.requests?.find(r=>r.id===b.dataset.rid)));
   $$('.labCancelRequest',c).forEach(b=>b.onclick=async()=>{
     if(!confirm('Annuler cette demande en attente ?'))return;
     const r=await labAction({action:'requestCancel',id:b.dataset.rid},'Déclaration annulée');if(r)await labSyncGroup(c,true);
   });
 }
}
function labRequestModal(c,r){
 const d=modal(`<h2>${r?'Modifier ma demande':'Nouvelle déclaration de têtes'}</h2><p class="muted">Cette déclaration sera transmise à Black Ace. Seules les demandes en attente sont modifiables.</p><form class="stack"><label>Quantité de têtes de weed<input name="heads" class="input" type="number" min="1" max="1000000000" step="1" value="${r?.heads||''}" required autofocus></label><label>Note (facultative)<textarea name="note" class="input" maxlength="1000">${esc(r?.note||'')}</textarea></label><button class="btn gold">${r?'Enregistrer':'Envoyer la demande'}</button></form>`);
 $('form',d).onsubmit=async e=>{
   e.preventDefault();const f=new FormData(e.currentTarget),q=Number(f.get('heads'));
   if(!Number.isSafeInteger(q)||q<=0)return toast('Indique une quantité entière positive');
   const payload=r?{action:'requestEdit',id:r.id,heads:q,note:f.get('note')}:{action:'requestCreate',heads:q,note:f.get('note')};
   const ok=await labAction(payload,r?'Demande modifiée':'Demande envoyée');if(ok){d.remove();await labSyncGroup(c,true)}
 };
}
function labMovementModal(c,d,kind){
 if(!isLabStaff()||!['bricks','bags','return'].includes(kind))return;
 const titles={bricks:'Transformer en briques',bags:'Préparer les pochons',return:'Restituer les pochons'};
 const ratio=d.recipe||{},unavailable=(kind==='bricks'&&!(ratio.headsInput&&ratio.bricksOutput))||(kind==='bags'&&!(ratio.bricksInput&&ratio.bagsOutput));
 const form=modal(`<h2>${titles[kind]}</h2>${unavailable?'<p class="lab-alert">Configure le circuit de calcul dans « ⚙ Ratios ».</p>':''}<form class="stack"><label>${kind==='bricks'?'Briques produites':kind==='bags'?'Pochons préparés':'Pochons rendus'}<input class="input" name="quantity" type="number" min="1" step="1" required></label><p class="muted" id="labCalcHint">${kind==='return'?'Les pochons rendus seront retirés du stock.':'Le stock utilisé est calculé automatiquement d’après les ratios.'}</p><label>Note (facultative)<textarea name="note" maxlength="1000" class="input" placeholder="Ex. Lot de Mathéo"></textarea></label><button class="btn gold" ${unavailable?'disabled':''}>Valider l’opération</button></form>`);
 const f=$('form',form),inp=$('[name="quantity"]',f);
 inp.oninput=()=>{const n=Number(inp.value),hint=$('#labCalcHint',form);
  if(kind==='bricks'&&ratio.headsInput&&ratio.bricksOutput){const used=n*ratio.headsInput/ratio.bricksOutput;hint.textContent=`Têtes nécessaires : ${labNum(used)} · Disponibles : ${labNum(d.stock.heads)}`}
  if(kind==='bags'&&ratio.bricksInput&&ratio.bagsOutput){const used=n*ratio.bricksInput/ratio.bagsOutput;hint.textContent=`Briques nécessaires : ${labNum(used)} · Disponibles : ${labNum(d.stock.bricks)}`}
 };
 f.onsubmit=async e=>{
   e.preventDefault();const value=Number(inp.value);if(!Number.isSafeInteger(value)||value<=0)return toast('Quantité entière invalide');
   const ff=new FormData(f),r=await labAction({action:'movement',groupId:d.group.id,kind,quantity:value,note:ff.get('note')||''},'Opération enregistrée');
   if(r){form.remove();await labSyncGroup(c,true)}
 };
}
async function labSyncGroup(c,showErrors=false){
 if(LAB.syncing||!labActive()||LAB.screen!=='group'||!c?.isConnected||!LAB.groupId)return;
 const id=LAB.groupId;LAB.syncing=true;
 try{
   const d=await api('lab?kind=group&id='+encodeURIComponent(id));
   if(!labActive()||LAB.screen!=='group'||LAB.groupId!==id||!c.isConnected)return;
   LAB.lastData=d;
   const pending=(d.requests||[]).filter(r=>r.status==='pending').length;
   const pill=$('[data-pending-pill]',c);if(pill)pill.textContent=d.supplier?`${pending} à confirmer`:`${pending} en attente`;
   const list=$('#labRequestsList',c);if(labSetHTML(list,labRequestHTML(d.requests,d.supplier)))labBindRequestButtons(c);
   if(d.supplier){
     $$('.lab-stock-count[data-stock-count]',c).forEach(el=>{const next=labNum(d.stock?.[el.dataset.stockCount]||0);if(el.textContent!==next)el.textContent=next});
     const status=$('#labStatusHolder',c);labSetHTML(status,labStatus(pending?'red':(d.stock?.status||'white')));
     const total=$('[data-pending-total]',c);if(total)total.textContent=pending;
     labSetHTML($('#labActionsList',c),labActionHTML(d.actions));
     const acts=$('[data-actions-total]',c);if(acts)acts.textContent=`${d.actions.length} opération(s)`;
   }
 }catch(e){if(showErrors)toast('Actualisation Labo : '+e.message)}
 finally{LAB.syncing=false}
}
async function labSyncGroups(c){
 if(LAB.syncing||!labActive()||LAB.screen!=='groups'||!c?.isConnected)return;
 LAB.syncing=true;
 try{
   const d=await api('lab?kind=overview');
   if(!labActive()||LAB.screen!=='groups'||!c.isConnected)return;
   const totals=labOverviewTotals(d.groups);
   for(const [k,v] of Object.entries(totals)){const el=$(`[data-labmetric="${k}"]`,c);if(el&&el.textContent!==String(v))el.textContent=v}
   for(const g of d.groups){const card=$(`.lab-group[data-gid="${g.id}"]`,c);if(card)labSetHTML(card,labCardHTML(g))}
 }catch(e){}finally{LAB.syncing=false}
}
// Ne remplace jamais la page : mise à jour ciblée, seulement pour le fournisseur.
function labAutoRefresh(c,screen){
 if(!isLabStaff())return;
 const timer=setInterval(()=>{
   if(!labActive()||LAB.screen!==screen||LAB.busy||!c?.isConnected)return;
   if(document.querySelector('.modal-back')||document.activeElement?.matches('input,textarea,select'))return;
   if(screen==='group')labSyncGroup(c,false);else if(screen==='groups')labSyncGroups(c);
 },20000);
 const previous=state.pageCleanup;state.pageCleanup=()=>{clearInterval(timer);if(previous)previous()};
}
