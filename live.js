// Helpers
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

const app = $('#ag-app');
const logEl = $('#ag-log');
const viewerEl = $('#ag-viewers');

function addChat(msg, who='user', cls=''){
  const li = document.createElement('li');
  if(cls) li.classList.add(cls);
  li.innerHTML = `<span class="ag-name">${who}</span> ${msg}`;
  logEl.appendChild(li);
 
  logEl.scrollTop = logEl.scrollHeight;
}
function addSys(msg){ addChat(msg, 'SYSTEM', 'ag-sys'); }
function addMod(msg){ addChat(msg, 'MOD', 'ag-mod'); }


 $('#ag-back').addEventListener('click', () => {
  if (history.length > 1) history.back();
  else window.location.href = 'index.html';
});

// Viewers
let viewers = 100000;
setInterval(()=>{
  const delta = Math.floor((Math.random()*2-1) * 160);
  viewers = Math.max(97000, viewers + delta);
  viewerEl.textContent = viewers.toLocaleString('en-US');
}, 1000);


[['plumtea','Aura‑con looks amazing!'],['kaizen','Overlay looks clean!'],['softwires','*popcorn ready*']].forEach(([u,m])=>addChat(m,u));


let chatTimer = null;
const negativePool = [
  ['star_gazer','wait… banned?? 😳'],['chi-chi','啊？这也能封？'],['bytecraft','49.99/h LOL what'],
  ['mod_kai','Region lock??'],['aurafan88','brand pulled the plug 😬'],['wanderer','资本的高墙来了 🧱'],
  ['local_kite','try non-commercial skin?'],['neon_noir','rip Blade Runner 🥀'],['data_drip','“身份即商品”的现场'],
  ['pixelpanda','Refund when? 💸'],['ethics101','Tech utopia felt different in the brochure.'],['unionize_chat','boycott the surcharge!'],
  ['publicdomain','Switch to Newsreel!'],['cinephile','Branding > art smh'],['ether','Dont let brands own identity.'],
  ['yolk','We cant afford $49.99/h 💀'],['retrograde','Corporate TOS speedrun lol'],['murmur','限区也太离谱了'],
];
function startNegativeChat(ms=1500){
  if(chatTimer) clearInterval(chatTimer);
  chatTimer = setInterval(()=>{
    const [name,msg] = negativePool[Math.floor(Math.random()*negativePool.length)];
    addChat(msg, name);
  }, ms);
}


function sendFromComposer(){
  const inp = $('#ag-input');
  const v = inp.value.trim();
  if(!v) return; addChat(v, 'you'); inp.value='';
}
$('#ag-send').addEventListener('click', sendFromComposer);
$('#ag-input').addEventListener('keydown', e=>{ if(e.key==='Enter') sendFromComposer(); });

// helped with copilot
$('#ag-choose').addEventListener('click', ()=> $('#ag-drawer').classList.add('ag-open'));
$('#ag-closeDrawer').addEventListener('click', ()=> $('#ag-drawer').classList.remove('ag-open'));
$$('.ag-skin').forEach(card=>{
  card.addEventListener('click', ()=>{
    const id = card.getAttribute('data-id');
    if(id === 'bladerunner1982'){
      playSfx(SFX.blade);

      $('#ag-banText').innerHTML = `
        <p>You are outside the area where this service is available.</p>
        <p>The "Blade Runner (1982)" avatar has been temporarily disabled by the brand owner.</p>
        <p>Please switch to a non-commercial skin or pay a traffic surcharge ($49.99/hour).</p>`;
      $('#ag-banModal').classList.add('ag-open');
      $('#ag-drawer').classList.remove('ag-open');
      $('#ag-avatarName').textContent = 'Blade Runner (1982)';
      addSys('Avatar selection attempted: "Blade Runner (1982)" (brand‑owned)');
      
      startNegativeChat(1500);
      
      scheduleEndingCTA(15000);
         
    } else {
      applySkin(id);
      $('#ag-drawer').classList.remove('ag-open');
    }
  })
});

function applySkin(id){
  if(id==='newsreel'){
    app.setAttribute('data-skin','newsreel');
    $('#ag-avatarName').textContent = 'Newsreel B/W';
    addSys('Switched to non‑commercial skin: Newsreel B/W');
  } else {
    app.setAttribute('data-skin','default');
    $('#ag-avatarName').textContent = 'Default';
    addSys('Switched skin: Default');
  }
}


$('#ag-dismiss').addEventListener('click', ()=> $('#ag-banModal').classList.remove('ag-open'));
$('#ag-switch').addEventListener('click', ()=>{
  $('#ag-banModal').classList.remove('ag-open');
  applySkin('newsreel');
  toast('Switched to non-commercial skin.');
});
$('#ag-pay').addEventListener('click', ()=>{
  toast('Payment declined: avatar disabled by brand owner in your region.');
  addMod('Payment attempt blocked — brand disable overrides surcharge.');
});

// System announcement
$('#ag-announce').addEventListener('click', ()=> addSys('Aura-con Notice: Brand skins restricted in this hall. Public skins only for on-site demos.'));

// Toast
function toast(msg){
  const t = $('#ag-toast');
  t.textContent = msg; t.classList.add('ag-show');
  setTimeout(()=> t.classList.remove('ag-show'), 2800);
}


const prelive = $('#ag-prelive');
const countdownEl = $('#ag-countdown');
const preliveClose = $('#ag-preliveClose');
const preliveLater = $('#ag-preliveLater');
const preliveChoose = $('#ag-preliveChoose');

function openPrelive(){
  if (!prelive) return;
  prelive.classList.add('ag-open');

 
  let t = 10;
  countdownEl.textContent = t;
  const timer = setInterval(()=>{
    t -= 1;
    countdownEl.textContent = t;
    if (t <= 0) {
      clearInterval(timer);
      addSys('Aura-con live is starting now. Consider switching to your brand avatar skin.');
      
    }
  }, 1000);
}

preliveClose.addEventListener('click', ()=> prelive.classList.remove('ag-open'));


preliveLater.addEventListener('click', ()=> prelive.classList.remove('ag-open'));


preliveChoose.addEventListener('click', ()=>{
  prelive.classList.remove('ag-open');
  $('#ag-drawer').classList.add('ag-open');
});


document.addEventListener('DOMContentLoaded', openPrelive);


let endCtaTimer = null;
function scheduleEndingCTA(ms = 15000){
  if (endCtaTimer) clearTimeout(endCtaTimer);
  endCtaTimer = setTimeout(()=>{
    
    ['#ag-banModal', '#ag-prelive', '#ag-drawer'].forEach(sel=>{
      const el = $(sel);
      if (el && el.classList.contains('ag-open')) el.classList.remove('ag-open');
    });

    const cta = $('#ag-endCTA');
    if (!cta) return;
    cta.classList.add('ag-show');
    cta.style.display = 'inline-flex';
    cta.focus(); 
    addSys('Proceed to the ending when you’re ready.');
  }, ms);
}


$('#ag-endCTA')?.addEventListener('click', ()=>{
  window.location.href = 'end.html';
});



const SFX = {
  blade: new Audio('Sound/notif.MP3') 
};

Object.values(SFX).forEach(a => { a.preload = 'auto'; a.volume = 0.5; });

function playSfx(audio){
  const node = audio.cloneNode(true);
  node.volume = audio.volume;
  node.play().catch(()=>{}); 
}
