const STRETCHES = [
  {"id":1,"emoji":"📱","name":"WiFi-Is-Not-Working Stretch","desc":"Lift your phone to the sky like a sacrifice.","cat":"Neck","targets":"Neck, Shoulders","sec":12},
  {"id":2,"emoji":"🤸","name":"I-Dropped-My-Pen Stretch","desc":"Bend and reach under the bench.","cat":"Back","targets":"Lower back, Hamstrings","sec":10},
  {"id":3,"emoji":"🪑","name":"Office Chair Yoga","desc":"Twist gently in your chair.","cat":"Back","targets":"Mid back, Spine","sec":18}
];

let filtered = STRETCHES.slice();
const libEl = document.getElementById('library');
const catEl = document.getElementById('category');
const qEl = document.getElementById('q');
const modal = document.getElementById('modal');
const toast = document.getElementById('toast');

let activeStretch = null;
let timerInterval = null;
let remaining = 0;

function init(){
  populateCategories();
  renderLibrary();
}

function populateCategories(){
  const cats = ['All'];
  STRETCHES.forEach(s=>{ if(!cats.includes(s.cat)) cats.push(s.cat)});
  cats.forEach(c=>{
    const opt = document.createElement('option'); opt.value=c.toLowerCase(); opt.textContent=c; catEl.appendChild(opt);
  });
}

function renderLibrary(){
  const q = qEl.value.trim().toLowerCase();
  const cat = catEl.value;
  filtered = STRETCHES.filter(s=>{
    const inCat = (cat==='all') || (s.cat.toLowerCase()===cat);
    const inQ = !q || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.targets.toLowerCase().includes(q);
    return inCat && inQ;
  });
  libEl.innerHTML = '';
  if(filtered.length===0){document.getElementById('empty').style.display='block'; return} else {document.getElementById('empty').style.display='none'}
  filtered.forEach(s=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `<div class='emoji'>${s.emoji}</div><div class='meta'><h3>${s.name}</h3><p>${s.desc}</p><div class='chip'>${s.cat} • ${s.sec}s</div></div>`;
    card.onclick = ()=>openStretch(s.id);
    libEl.appendChild(card);
  });
}

function openStretch(id){
  const s = STRETCHES.find(x=>x.id===id);
  if(!s) return;
  activeStretch = s;
  document.getElementById('m-title').textContent = s.name;
  document.getElementById('m-desc').textContent = s.desc;
  document.getElementById('m-emoji').textContent = s.emoji;
  document.getElementById('m-cat').textContent = s.cat;
  document.getElementById('m-target').textContent = 'Targets: ' + s.targets;
  remaining = s.sec;
  updateTimerDisplay();
  modal.classList.add('show');
}

function closeModal(){modal.classList.remove('show'); stopTimer();}
function startTimer(){
  if(!activeStretch) return;
  document.getElementById('startBtn').disabled = true; document.getElementById('startBtn').textContent='Running...';
  remaining = activeStretch.sec; updateTimerDisplay();
  timerInterval = setInterval(()=>{
    remaining--; updateTimerDisplay();
    if(remaining<=0){ stopTimer(true); }
  },1000);
}
function stopTimer(completed){
  clearInterval(timerInterval); timerInterval=null; document.getElementById('startBtn').disabled=false; document.getElementById('startBtn').textContent='Start';
  if(completed) showToast('Nice! Stretch complete. 💪');
}
function skipStretch(){ showToast('Skipped. Try another!'); closeModal();}
function updateTimerDisplay(){ const el=document.getElementById('timer'); const s=Math.max(0,remaining); el.textContent=(s<10?'00:0'+s:'00:'+s); }
function randomStretch(){ openStretch(STRETCHES[Math.floor(Math.random()*STRETCHES.length)].id); }
function showToast(txt){ toast.textContent=txt; toast.style.display='block'; setTimeout(()=>{ toast.style.display='none'; },2600);}
window.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });
init();
