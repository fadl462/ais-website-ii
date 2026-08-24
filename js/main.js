const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];

const bar=$("#commandBar"), progress=$(".progress span"), glow=$(".cursor-glow");
let ticking=false;
window.addEventListener("scroll",()=>{
  if(!ticking){requestAnimationFrame(()=>{
    const y=scrollY, h=document.documentElement.scrollHeight-innerHeight;
    progress.style.width=`${h?y/h*100:0}%`;
    bar.classList.toggle("scrolled",y>60);
    const hero=document.querySelector(".hero");
    if(hero) hero.querySelector(".hero-bg").style.transform=`scale(${1.04+y/18000}) translateY(${y*.08}px)`;
    const st=$("#statement"); if(st){const r=st.getBoundingClientRect();st.classList.toggle("in-view",r.top<innerHeight*.75);}
    ticking=false;
  });ticking=true;}
},{passive:true});

window.addEventListener("pointermove",e=>{
  glow.style.left=e.clientX+"px"; glow.style.top=e.clientY+"px"; glow.style.opacity="1";
},{passive:true});
document.addEventListener("mouseleave",()=>glow.style.opacity="0");

const menuButton=$("#menuButton"), menuPanel=$("#menuPanel");
function toggleMenu(open){menuPanel.classList.toggle("open",open);menuButton.classList.toggle("open",open);document.body.style.overflow=open?"hidden":""}
menuButton.addEventListener("click",()=>toggleMenu(!menuPanel.classList.contains("open")));
$$(".menu-grid a").forEach(a=>a.addEventListener("click",()=>toggleMenu(false)));

const journeyStage=$("#journeyStage");
$$(".journey-item").forEach(item=>{
  item.addEventListener("mouseenter",()=>setJourney(item));
  item.addEventListener("click",()=>setJourney(item));
});
function setJourney(item){
  $$(".journey-item").forEach(x=>x.classList.remove("active")); item.classList.add("active");
  journeyStage.querySelector("span").textContent=item.dataset.stage;
  journeyStage.animate([{transform:"scale(.88) rotate(-8deg)"},{transform:"scale(1) rotate(0)"}],{duration:400,easing:"cubic-bezier(.2,.7,.2,1)"});
}

const acadPhoto=$("#academicPhoto");
$$(".academic-item").forEach(item=>{
  item.addEventListener("mouseenter",()=>swapImage(acadPhoto,item.dataset.image));
  item.addEventListener("click",()=>swapImage(acadPhoto,item.dataset.image));
});
function swapImage(img,src){
  img.style.opacity=".25"; img.style.transform="scale(1.03)";
  const next=new Image(); next.onload=()=>{img.src=src; requestAnimationFrame(()=>{img.style.opacity="1";img.style.transform="scale(1)"})}; next.src=src;
}

const whyBg=$("#whyBg");
$$(".why-item").forEach(item=>{
  item.addEventListener("mouseenter",()=>setWhy(item));
  item.addEventListener("click",()=>setWhy(item));
});
function setWhy(item){
  $$(".why-item").forEach(x=>x.classList.remove("active"));item.classList.add("active");
  whyBg.style.opacity=".3";
  setTimeout(()=>{whyBg.style.backgroundImage=`url("${item.dataset.bg}")`;whyBg.style.opacity="1"},170);
}

const fi=$("#facilityImage"), ft=$("#facilityTitle"), fc=$("#facilityCopy");
$$(".facility-nav button").forEach(btn=>{
  const change=()=>{
    $$(".facility-nav button").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
    fi.style.opacity=".2";
    const next=new Image(); next.onload=()=>{fi.src=btn.dataset.img;ft.textContent=btn.dataset.title;fc.textContent=btn.dataset.copy;requestAnimationFrame(()=>fi.style.opacity="1")};next.src=btn.dataset.img;
  };
  btn.addEventListener("mouseenter",change); btn.addEventListener("click",change);
});

$$(".magnet").forEach(el=>{
  el.addEventListener("mousemove",e=>{
    const r=el.getBoundingClientRect(), x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
    el.style.transform=`translate(${x*.12}px,${y*.18}px)`;
  });
  el.addEventListener("mouseleave",()=>el.style.transform="");
});

const observer=new IntersectionObserver(entries=>{
 entries.forEach(en=>{
   if(en.isIntersecting){
     en.target.querySelectorAll?.(".reveal-on-view").forEach(x=>x.classList.add("visible"));
   }
 });
},{threshold:.12});
$$("section").forEach(s=>observer.observe(s));

// Auto-cycle selected "live" content subtly, while remaining interactive.
let feedIndex=0;
const feedTabs=$$(".feed-tabs button");
setInterval(()=>{
  feedIndex=(feedIndex+1)%feedTabs.length;
  feedTabs.forEach((b,i)=>b.classList.toggle("active",i===feedIndex));
},4200);

const liveFeed=$(".live");
let feedPaused=false;
liveFeed?.addEventListener("mouseenter",()=>feedPaused=true);
liveFeed?.addEventListener("mouseleave",()=>feedPaused=false);

// Background motion for immersive sections.
let rafId;
function ambient(){
  const why=document.querySelector(".why"), acad=document.querySelector(".academics");
  if(why){
    const r=why.getBoundingClientRect(), p=Math.max(0,Math.min(1,1-r.top/(innerHeight+r.height)));
    const b=document.querySelector("#whyBg"); if(b) b.style.transform=`scale(${1.06+p*.04}) translate3d(0,${p*-18}px,0)`;
  }
  if(acad){
    const r=acad.getBoundingClientRect(), p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));
    const img=document.querySelector("#academicPhoto"); if(img) img.style.transform=`scale(${1.01+p*.03})`;
  }
  rafId=requestAnimationFrame(ambient);
}
ambient();

window.addEventListener("beforeunload",()=>cancelAnimationFrame(rafId));
