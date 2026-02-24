import { useState, useEffect, useRef } from "react";

const WA_NUMBER = "51952363643";
const WA_LINK   = "https://wa.me/" + WA_NUMBER;
const MP_STARTER = "https://mpago.la/REEMPLAZAR_STARTER";
const MP_GROWTH  = "https://mpago.la/REEMPLAZAR_GROWTH";

const FLOW = [
  { id:"bienvenida", msg:"Hola! Soy Carlos, Growth Executive de Sazon. En 2 minutos calculo cuanto puedes crecer en delivery. Empezamos?", opts:[{txt:"Si, calculame el ROI",next:"plataformas"},{txt:"Primero quiero mas info",next:"info"}] },
  { id:"info", msg:"Sazon gestiona tu restaurante en Rappi, PedidosYa, Didi y Glovo. Clientes crecen +38% en 90 dias. Quieres ver cuanto puedes crecer tu?", opts:[{txt:"Si, calculame",next:"plataformas"},{txt:"Hablar con un humano",next:"humano"}] },
  { id:"plataformas", msg:"En que plataformas estas activo ahora?", opts:[{txt:"Solo Rappi",next:"pedidos",d:{plats:"Solo Rappi"}},{txt:"Rappi + PedidosYa",next:"pedidos",d:{plats:"Rappi + PedidosYa"}},{txt:"3 o mas plataformas",next:"pedidos",d:{plats:"3+ plataformas"}},{txt:"Ninguna aun",next:"nuevo",d:{plats:"Ninguna"}}] },
  { id:"pedidos", msg:"Cuantos pedidos por mes reciben aproximadamente?", opts:[{txt:"50 a 100 pedidos",next:"ticket",d:{ped:75}},{txt:"100 a 300 pedidos",next:"ticket",d:{ped:200}},{txt:"300 a 1000 pedidos",next:"ticket",d:{ped:650}},{txt:"Mas de 1000",next:"ticket",d:{ped:1200}}] },
  { id:"ticket", msg:"Cual es el ticket promedio de tu pedido (en soles)?", opts:[{txt:"Menos de S/ 30",next:"resultado",d:{tck:25}},{txt:"S/ 30 a S/ 50",next:"resultado",d:{tck:40}},{txt:"S/ 50 a S/ 80",next:"resultado",d:{tck:65}},{txt:"Mas de S/ 80",next:"resultado",d:{tck:100}}] },
  { id:"nuevo", msg:"Perfecto para empezar desde cero. Tenemos plan Starter especial. Quieres que un Growth Manager te contacte?", opts:[{txt:"Si, me interesa",next:"wa"},{txt:"Ver planes primero",next:"planes"}] },
  { id:"resultado", msg:"__ROI__", opts:[{txt:"Quiero empezar ya",next:"wa"},{txt:"Ver planes y precios",next:"planes"}] },
  { id:"humano", msg:"Claro! Un Growth Manager esta disponible ahora mismo. Por WhatsApp?", opts:[{txt:"Si, por WhatsApp",next:"wa"},{txt:"Prefiero el formulario",next:"form"}] },
  { id:"wa",     msg:"Perfecto! Te conectamos con el equipo ahora.", opts:[], action:"whatsapp" },
  { id:"planes", msg:"Claro! Te llevo a la seccion de planes.", opts:[], action:"planes" },
  { id:"form",   msg:"Perfecto! Baja al formulario, toma 60 segundos.", opts:[], action:"form" },
];

function roi(p,t){ const m=Math.round(p*t*0.28); return {m, a:m*12}; }

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [step, setStep]     = useState("bienvenida");
  const [data, setData]     = useState({});
  const [hist, setHist]     = useState([]);
  const [busy, setBusy]     = useState(false);
  const [sent, setSent]     = useState(false);
  const [err,  setErr]      = useState("");
  const endRef = useRef(null);
  const [form, setForm] = useState({ nombre:"", restaurante:"", email:"", whatsapp:"", plan:"Starter", plataformas:"Solo Rappi", pedidos:"100-300", ticket:"", mensaje:"" });

  useEffect(()=>{ const f=()=>setScrolled(window.scrollY>55); window.addEventListener("scroll",f); return()=>window.removeEventListener("scroll",f); },[]);

  useEffect(()=>{
    const els=document.querySelectorAll(".rv");
    const obs=new IntersectionObserver((entries)=>entries.forEach(e=>{
      if(e.isIntersecting){const s=Array.from(e.target.parentElement?.querySelectorAll(".rv")||[]);const i=s.indexOf(e.target);setTimeout(()=>e.target.classList.add("vis"),Math.min(i*80,360));obs.unobserve(e.target);}
    }),{threshold:0.1});
    els.forEach(el=>obs.observe(el)); return()=>obs.disconnect();
  },[]);

  useEffect(()=>{
    if(chatOpen && hist.length===0){ setTimeout(()=>{ const s=FLOW.find(x=>x.id==="bienvenida"); setHist([{f:"c",m:s.msg}]); setStep("bienvenida"); },400); }
  },[chatOpen]);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[hist]);

  const goTo = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  function pick(opt){
    if(busy) return;
    const nd={...data,...(opt.d||{})};
    setData(nd);
    setHist(h=>[...h,{f:"u",m:opt.txt}]);
    setBusy(true);
    const ns=FLOW.find(x=>x.id===opt.next);
    if(!ns) return;
    let msg=ns.msg;
    if(ns.id==="resultado"){
      const r=roi(nd.ped||200, nd.tck||40);
      msg="Con "+( nd.plats||"tus plataformas")+", proyectamos S/ "+r.m.toLocaleString()+" adicionales al mes (S/ "+r.a.toLocaleString()+" al año). ROI de "+(Math.round((r.m/890)*100))+"% sobre el plan Starter.";
    }
    setTimeout(()=>{
      setHist(h=>[...h,{f:"c",m:msg}]);
      setStep(ns.id); setBusy(false);
      if(ns.action==="whatsapp"){ setTimeout(()=>{ const t=encodeURIComponent("Hola! Quiero crecer en delivery.\nPlataformas: "+(nd.plats||"?")+"\nPedidos/mes: "+(nd.ped||"?")+"\nTicket: S/"+(nd.tck||"?")); window.open(WA_LINK+"?text="+t,"_blank"); },800); }
      if(ns.action==="planes"){ setTimeout(()=>{ setChatOpen(false); goTo("pricing"); },600); }
      if(ns.action==="form")  { setTimeout(()=>{ setChatOpen(false); goTo("contact"); },600); }
    },700);
  }

  const hi = e=>{ setForm({...form,[e.target.name]:e.target.value}); setErr(""); };
  const fROI=()=>{ const mp={"50-100":75,"100-300":200,"300-1000":650,"1000+":1000}; return roi(mp[form.pedidos]||200, parseFloat(form.ticket)||40); };

  function sub(e){
    e.preventDefault();
    if(!form.nombre.trim()){setErr("Ingresa tu nombre");return;}
    if(!form.restaurante.trim()){setErr("Ingresa el nombre del restaurante");return;}
    if(form.whatsapp.replace(/\D/g,"").length<9){setErr("WhatsApp invalido");return;}
    const r=fROI();
    const t=encodeURIComponent("Hola! Solicito diagnostico gratuito.\n\nNombre: "+form.nombre+"\nRestaurante: "+form.restaurante+"\nPlataformas: "+form.plataformas+"\nPedidos/mes: "+form.pedidos+"\nTicket: S/"+(form.ticket||"?")+"\nROI proyectado: S/"+r.m.toLocaleString()+"/mes\nPlan: "+form.plan+"\n\n"+(form.mensaje||"Me interesa el analisis gratuito."));
    window.open(WA_LINK+"?text="+t,"_blank");
    setSent(true);
  }

  const cs=FLOW.find(x=>x.id===step);
  const {m:roiM, a:roiA}=fROI();

  const plats=["Rappi","PedidosYa","Didi Food","Uber Eats","iFood","Glovo","Deliveroo","Rappi","PedidosYa","Didi Food","Uber Eats","iFood","Glovo","Deliveroo"];
  const steps4=[{n:"01",lb:"Analizamos",t:"Diagnostico Profundo",d:"Auditamos tu operacion en todas las plataformas. Detectamos que frena tus ventas y donde estan las oportunidades sin explotar."},{n:"02",lb:"Disenamos",t:"Estrategia Personalizada",d:"Creamos un plan a medida: precios, menu digital, campanas y negociaciones. Cada accion respaldada en datos reales."},{n:"03",lb:"Ejecutamos",t:"Gestion Integral",d:"Un Growth Manager dedicado opera tu presencia en los aplicativos. Tu cocinas, nosotros hacemos que se venda."},{n:"04",lb:"Optimizamos",t:"Mejora Continua",d:"Medimos ticket, conversion, recompra y visibilidad. Ajustamos en tiempo real para maximizar resultados cada semana."}];
  const svcs=[{ico:"📊",t:"Gestion Integral de Plataformas",d:"Administramos tu presencia en todas las apps de delivery. Configuracion, operacion diaria y soporte continuo."},{ico:"🤝",t:"Negociacion con Aplicativos",d:"Acceso directo a los equipos comerciales de Rappi, PedidosYa y Didi. Negociamos comisiones exclusivas."},{ico:"🍽️",t:"Optimizacion de Menu Digital",d:"Rediseniamos tu carta: fotografias, descripciones persuasivas, precios ancla que incrementa el ticket promedio."},{ico:"📣",t:"Campanas dentro de las Food Apps",d:"Planificamos y ejecutamos campanas pagas para maximizar visibilidad, conversion y volumen de pedidos."},{ico:"📈",t:"Reportes y Analisis de Datos",d:"Dashboard mensual con metricas clave: ventas, pedidos, calificaciones, conversion y benchmarks del sector."},{ico:"🗓️",t:"Plan Comercial Mensual",d:"Cada mes presentamos un plan de accion con objetivos y tacticas basadas en los resultados anteriores."}];
  const clts=[{ico:"🍣",n:"La Picada Cebicheria"},{ico:"☕",n:"Buena Vista Cafe"},{ico:"🍪",n:"Puqui Cookies House"},{ico:"🍷",n:"Victoriano Taberna"},{ico:"🎂",n:"La Dosis Dulce"},{ico:"🍕",n:"Veggie Pizza"},{ico:"🥩",n:"Mas Que Bueno"},{ico:"🍝",n:"Piacere Peru"},{ico:"🍳",n:"Cookery Peru"},{ico:"🥐",n:"Pancracia Panes"}];
  const plrs=[{ico:"🔬",t:"Expertise en Foodtech",d:"Conocemos los algoritmos de cada plataforma y las palancas que mueven el volumen."},{ico:"📡",t:"Data-Driven al 100%",d:"Cada decision se basa en metricas. Solo acciones que generan ROI comprobable."},{ico:"🤝",t:"Acceso Directo a APPs",d:"Relaciones directas con Rappi, PedidosYa y Didi. Condiciones exclusivas."},{ico:"📋",t:"Transparencia Total",d:"Reportes claros y acceso completo a todos tus datos. Sin letra chica."}];
  const plans=[
    {name:"Starter",tag:"1 plataforma hasta 300 pedidos/mes",price:"S/ 890",period:"/mes",fee:"+3% del crecimiento generado",badge:null,dark:false,mp:MP_STARTER,fts:[{t:"Diagnostico inicial",ok:true},{t:"1 plataforma de delivery",ok:true},{t:"Optimizacion basica de menu",ok:true},{t:"Reporte mensual",ok:true},{t:"1 campana mensual",ok:true},{t:"Growth Manager dedicado",ok:false},{t:"Negociacion comisiones",ok:false}]},
    {name:"Growth",tag:"Hasta 3 plataformas escala rapida",price:"S/ 1,790",period:"/mes",fee:"+2.5% del crecimiento generado",badge:"Mas popular",dark:true,mp:MP_GROWTH,fts:[{t:"Diagnostico completo",ok:true},{t:"Hasta 3 plataformas",ok:true},{t:"Optimizacion menu foto+copy+precio",ok:true},{t:"Growth Manager dedicado",ok:true},{t:"Negociacion comisiones",ok:true},{t:"Plan comercial mensual",ok:true},{t:"Hasta 3 campanas mensuales",ok:true}]},
    {name:"Pro",tag:"Cadenas multi-local dark kitchens",price:"A medida",period:"cotizacion",fee:"Negociable segun operacion",badge:null,dark:false,mp:null,fts:[{t:"Todo Growth incluido",ok:true},{t:"Plataformas ilimitadas",ok:true},{t:"Dark kitchens y marcas virtuales",ok:true},{t:"Equipo dedicado exclusivo",ok:true},{t:"Campanas ilimitadas",ok:true},{t:"Integracion con POS",ok:true},{t:"Reunion semanal",ok:true}]}
  ];
  const inp={background:"#EDE4CE",border:"1px solid rgba(0,0,0,.12)",padding:"14px 18px",fontFamily:"DM Sans,sans-serif",fontSize:".9rem",color:"#1A1A1A",outline:"none",borderRadius:2,width:"100%",transition:"border-color .2s"};
  const lbl={fontSize:".7rem",textTransform:"uppercase",letterSpacing:"1.5px",fontWeight:500,color:"#5A4E3E",display:"block",marginBottom:6};

  return (<>
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}
    body{font-family:'DM Sans',sans-serif;background:#F5EFE0;color:#1A1A1A;overflow-x:hidden;}
    .pf{font-family:'Playfair Display',serif!important;}
    .rv{opacity:0;transform:translateY(26px);transition:opacity .65s,transform .65s;}
    .rv.vis{opacity:1;transform:none;}
    @keyframes fUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
    @keyframes fDown{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:none}}
    @keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @keyframes pls{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.2);opacity:.6}}
    @keyframes cpop{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:none}}
    @keyframes db{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
    .a1{animation:fUp .8s .2s both}.a2{animation:fUp .8s .35s both}.a3{animation:fUp .8s .5s both}.a4{animation:fUp .8s .65s both}.a5{animation:fUp .9s .8s both}.anav{animation:fDown .6s both}
    .sc{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);padding:48px 36px;position:relative;overflow:hidden;transition:background .25s;cursor:default;}
    .sc:hover{background:rgba(200,57,43,.12);}
    .sr{display:grid;grid-template-columns:72px 1fr;border-top:1px solid rgba(0,0,0,.1);padding:36px 0;transition:all .2s;}
    .sr:last-child{border-bottom:1px solid rgba(0,0,0,.1);}
    .si{width:48px;height:48px;border:1.5px solid #C8392B;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:#C8392B;transition:all .2s;margin-top:4px;}
    .sr:hover .si{background:#C8392B;color:white;}
    .pc{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);padding:26px 30px;display:flex;gap:22px;align-items:flex-start;transition:background .2s;}
    .pc:hover{background:rgba(200,57,43,.1);}
    .cc{background:#EDE4CE;padding:32px 20px;text-align:center;transition:background .2s;cursor:default;}
    .cc:hover{background:#1A1A1A;}
    .cc:hover .cn{color:white;}
    .cn{font-size:.82rem;font-weight:500;transition:color .2s;}
    .plc{padding:48px 40px;border:1px solid rgba(0,0,0,.08);position:relative;transition:transform .2s;}
    .plc:hover{transform:translateY(-6px);}
    input:focus,select:focus,textarea:focus{border-color:#C8392B!important;}
    textarea{resize:vertical;}
    select{appearance:none;-webkit-appearance:none;}
    .cw{position:fixed;bottom:28px;right:28px;z-index:999;display:flex;flex-direction:column;align-items:flex-end;gap:12px;}
    .cb{width:62px;height:62px;border-radius:50%;background:#C8392B;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.6rem;box-shadow:0 8px 28px rgba(200,57,43,.4);transition:transform .2s,background .2s;}
    .cb:hover{transform:scale(1.08);background:#9B2335;}
    .cwin{animation:cpop .3s ease;width:340px;background:white;border-radius:18px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.18);display:flex;flex-direction:column;max-height:520px;}
    .ch{background:#1A1A1A;padding:16px 20px;display:flex;align-items:center;gap:12px;}
    .cav{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#C8392B,#D4A547);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;}
    .cm{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#f9f6f0;}
    .mc{display:flex;justify-content:flex-start;}
    .mc.u{justify-content:flex-end;}
    .mb{max-width:85%;padding:10px 14px;border-radius:12px;font-size:.84rem;line-height:1.5;}
    .mb.c{background:white;border-radius:4px 12px 12px 12px;box-shadow:0 1px 4px rgba(0,0,0,.08);}
    .mb.u{background:#C8392B;color:white;border-radius:12px 4px 12px 12px;}
    .co{padding:14px 16px;background:white;border-top:1px solid #f0ebe0;display:flex;flex-direction:column;gap:7px;max-height:180px;overflow-y:auto;}
    .co button{padding:9px 14px;border:1.5px solid #C8392B;border-radius:8px;font-size:.82rem;color:#C8392B;font-weight:500;cursor:pointer;text-align:left;background:white;font-family:'DM Sans',sans-serif;transition:all .18s;}
    .co button:hover{background:#C8392B;color:white;}
    .dt{width:7px;height:7px;border-radius:50%;background:#ccc;animation:db 1.2s ease infinite;}
    .dt:nth-child(2){animation-delay:.15s;}.dt:nth-child(3){animation-delay:.3s;}
    @media(max-width:900px){
      .nomob{display:none!important;}nav{padding:14px 22px!important;}
      .nl{display:none!important;}.sec{padding:68px 22px!important;}
      .hl{padding:120px 22px 60px!important;}
      .g2{grid-template-columns:1fr!important;}.g3{grid-template-columns:1fr!important;}
      .g4{grid-template-columns:1fr 1fr!important;}.g5{grid-template-columns:repeat(3,1fr)!important;}
      .gs{position:static!important;}footer{padding:22px 22px!important;flex-direction:column!important;gap:12px!important;text-align:center!important;}
      .cwin{width:calc(100vw - 40px);}.cw{bottom:18px;right:16px;}
    }
  `}</style>

  {/* NAV */}
  <nav className="anav" style={{position:"fixed",top:0,width:"100%",zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:scrolled?"13px 60px":"20px 60px",background:"rgba(245,239,224,.96)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(200,57,43,.15)",transition:"padding .3s"}}>
    <div className="pf" style={{fontSize:"1.35rem",fontWeight:900,cursor:"pointer",color:"#1A1A1A"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
      Saz<span style={{fontFamily:"DM Sans,sans-serif"}}>ó</span>n<span style={{color:"#C8392B"}}>.</span>
    </div>
    <ul className="nl" style={{display:"flex",gap:34,listStyle:"none"}}>
      {[["Como trabajamos","how"],["Servicios","services"],["Planes","pricing"],["Clientes","clients"],["Contacto","contact"]].map(([l,id])=>(
        <li key={id}><button onClick={()=>goTo(id)} style={{background:"none",border:"none",fontSize:".82rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1.5px",color:"#1A1A1A",cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="#C8392B"} onMouseLeave={e=>e.target.style.color="#1A1A1A"}>{l}</button></li>
      ))}
    </ul>
    <div style={{display:"flex",gap:10,alignItems:"center"}}>
      <button onClick={()=>setChatOpen(v=>!v)} style={{background:"none",border:"1.5px solid rgba(200,57,43,.4)",color:"#C8392B",padding:"9px 18px",borderRadius:2,fontSize:".78rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1px",cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.background="#C8392B";e.currentTarget.style.color="white";}} onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color="#C8392B";}}>Habla con Carlos</button>
      <button onClick={()=>goTo("contact")} style={{background:"#C8392B",color:"white",padding:"11px 24px",border:"none",borderRadius:2,fontSize:".82rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1.5px",cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="#9B2335"} onMouseLeave={e=>e.currentTarget.style.background="#C8392B"}>Quiero crecer</button>
    </div>
  </nav>

  {/* HERO */}
  <section id="hero" className="g2" style={{minHeight:"100vh",display:"grid",gridTemplateColumns:"1fr 1fr",background:"#1A1A1A",overflow:"hidden"}}>
    <div className="hl" style={{display:"flex",flexDirection:"column",justifyContent:"center",padding:"140px 80px 100px",zIndex:2}}>
      <p className="a1" style={{fontSize:".75rem",fontWeight:500,textTransform:"uppercase",letterSpacing:3,color:"#D4A547",marginBottom:28}}>Growth Partner para Restaurantes · Lima</p>
      <h1 className="pf a2" style={{fontSize:"clamp(3rem,5vw,5.2rem)",lineHeight:1.05,color:"white"}}>Tu delivery,<br/>al <em style={{fontStyle:"italic",color:"#C8392B"}}>maximo</em><br/>rendimiento.</h1>
      <p className="a3" style={{marginTop:28,fontSize:"1.05rem",lineHeight:1.7,color:"rgba(255,255,255,.6)",maxWidth:420}}>Somos tu equipo especializado en hacer crecer tus ventas en Rappi, PedidosYa, Didi Food y mas. No somos consultores, somos tu partner real de crecimiento.</p>
      <div className="a4" style={{display:"flex",gap:16,alignItems:"center",marginTop:48,flexWrap:"wrap"}}>
        <button onClick={()=>goTo("contact")} style={{background:"#C8392B",color:"white",padding:"16px 36px",border:"none",borderRadius:2,fontSize:".9rem",fontWeight:500,letterSpacing:1,textTransform:"uppercase",cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"background .2s, transform .15s",boxShadow:"0 8px 28px rgba(200,57,43,.35)"}} onMouseEnter={e=>{e.currentTarget.style.background="#9B2335";e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.background="#C8392B";e.currentTarget.style.transform="none";}}>Agendar diagnostico gratuito</button>
        <button onClick={()=>setChatOpen(true)} style={{background:"none",border:"none",color:"rgba(255,255,255,.65)",fontSize:".9rem",cursor:"pointer",fontFamily:"DM Sans,sans-serif",display:"flex",alignItems:"center",gap:6}} onMouseEnter={e=>e.currentTarget.style.color="white"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.65)"}>Calcular mi ROI con Carlos →</button>
      </div>
    </div>
    <div className="nomob" style={{position:"relative",overflow:"hidden",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div className="pf" style={{position:"absolute",bottom:-30,right:-20,fontSize:"26vw",fontWeight:900,lineHeight:1,color:"rgba(255,255,255,.03)",pointerEvents:"none"}}>SZN</div>
      <div style={{position:"absolute",top:"50%",left:"50%",width:380,height:380,background:"radial-gradient(circle,rgba(200,57,43,.3) 0%,transparent 70%)",borderRadius:"50%",animation:"pls 4s ease-in-out infinite",transform:"translate(-50%,-50%)"}}/>
      <div className="a5" style={{position:"relative",zIndex:2,display:"flex",gap:2,marginBottom:60}}>
        {[{n:"+40%",l:"Ventas promedio"},{n:"16+",l:"Restaurantes activos"},{n:"< 2min",l:"Resp. Carlos"}].map((s,i)=>(
          <div key={i} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",padding:"28px 36px",textAlign:"center",backdropFilter:"blur(8px)"}}>
            <strong className="pf" style={{display:"block",fontSize:"2.4rem",fontWeight:700,color:"white"}}>{s.n}</strong>
            <span style={{fontSize:".72rem",textTransform:"uppercase",letterSpacing:"1.5px",color:"rgba(255,255,255,.45)"}}>{s.l}</span>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* MARQUEE */}
  <div style={{background:"#EDE4CE",borderTop:"1px solid rgba(0,0,0,.08)",borderBottom:"1px solid rgba(0,0,0,.08)",padding:"18px 0",overflow:"hidden"}}>
    <div style={{display:"flex",gap:56,alignItems:"center",animation:"tick 22s linear infinite",width:"max-content"}}>
      {plats.map((p,i)=><span key={i} style={{fontSize:".75rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"2px",color:"#5A4E3E",opacity:.65,whiteSpace:"nowrap"}}>{p}</span>)}
    </div>
  </div>

  {/* HOW */}
  <section id="how" className="sec" style={{padding:"110px 80px",background:"#1A1A1A"}}>
    <p className="rv" style={{fontSize:".7rem",fontWeight:500,textTransform:"uppercase",letterSpacing:3,color:"#D4A547",marginBottom:18}}>Metodologia</p>
    <h2 className="pf rv" style={{fontSize:"clamp(2.2rem,3.5vw,3.4rem)",lineHeight:1.1,color:"white"}}>La receta del<br/>crecimiento en 4 pasos.</h2>
    <p className="rv" style={{marginTop:18,maxWidth:500,fontSize:"1rem",lineHeight:1.7,color:"rgba(255,255,255,.5)"}}>Un proceso claro, medible y sin sorpresas. Del diagnostico al resultado.</p>
    <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2,marginTop:64}}>
      {steps4.map((s,i)=>(
        <div key={i} className="sc rv">
          <div className="pf" style={{position:"absolute",bottom:-16,right:16,fontSize:"8rem",fontWeight:900,color:"rgba(255,255,255,.03)",lineHeight:1,pointerEvents:"none"}}>{s.n}</div>
          <p style={{fontSize:".75rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"2px",color:"#C8392B",marginBottom:22}}>{s.n} — {s.lb}</p>
          <h3 style={{fontSize:"1.1rem",fontWeight:500,color:"white",marginBottom:14}}>{s.t}</h3>
          <p style={{fontSize:".88rem",lineHeight:1.7,color:"rgba(255,255,255,.55)"}}>{s.d}</p>
        </div>
      ))}
    </div>
  </section>

  {/* SERVICES */}
  <section id="services" className="sec" style={{padding:"110px 80px",background:"#F5EFE0"}}>
    <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:80,alignItems:"start"}}>
      <div className="gs rv" style={{position:"sticky",top:120}}>
        <p style={{fontSize:".7rem",fontWeight:500,textTransform:"uppercase",letterSpacing:3,color:"#C8392B",marginBottom:18}}>Servicios</p>
        <h2 className="pf" style={{fontSize:"clamp(2.2rem,3vw,3rem)",lineHeight:1.1}}>Todo lo que tu delivery necesita,<br/>en un solo lugar.</h2>
        <div style={{width:56,height:3,background:"#C8392B",margin:"28px 0"}}/>
        <p style={{fontSize:"1rem",lineHeight:1.7,color:"#5A4E3E",maxWidth:340}}>No somos una agencia. Somos expertos en el ecosistema de food apps con relaciones directas con sus equipos comerciales.</p>
        <button onClick={()=>goTo("contact")} style={{marginTop:36,background:"#C8392B",color:"white",padding:"14px 32px",border:"none",borderRadius:2,fontSize:".88rem",fontWeight:500,textTransform:"uppercase",letterSpacing:1,cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="#9B2335"} onMouseLeave={e=>e.currentTarget.style.background="#C8392B"}>Hablar con un experto</button>
      </div>
      <div>
        {svcs.map((s,i)=>(
          <div key={i} className="sr rv">
            <div className="si">{s.ico}</div>
            <div style={{paddingLeft:8}}>
              <h3 style={{fontSize:"1.08rem",fontWeight:500,marginBottom:10}}>{s.t}</h3>
              <p style={{fontSize:".88rem",lineHeight:1.7,color:"#5A4E3E"}}>{s.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* TESTIMONIAL */}
  <section style={{background:"#C8392B",color:"white",textAlign:"center",padding:"100px 80px"}}>
    <p className="pf rv" style={{fontStyle:"italic",fontSize:"clamp(1.6rem,2.8vw,2.8rem)",lineHeight:1.35,maxWidth:860,margin:"0 auto 36px"}}>"Con Sazon pasamos de 80 a 340 pedidos diarios en solo tres meses. Su equipo conoce cada detalle de las plataformas y sabe exactamente que palancas mover para crecer."</p>
    <p className="rv" style={{fontSize:".8rem",opacity:.65,textTransform:"uppercase",letterSpacing:2}}>Carlos Mendoza — Propietario · La Picada Cebicheria · Lima, Peru</p>
  </section>

  {/* PRICING */}
  <section id="pricing" className="sec" style={{padding:"110px 80px",background:"#EDE4CE"}}>
    <p className="rv" style={{fontSize:".7rem",fontWeight:500,textTransform:"uppercase",letterSpacing:3,color:"#C8392B",marginBottom:18}}>Planes y precios</p>
    <h2 className="pf rv" style={{fontSize:"clamp(2.2rem,3.5vw,3.4rem)",lineHeight:1.1}}>Inversion clara,<br/>resultados medibles.</h2>
    <p className="rv" style={{marginTop:18,maxWidth:500,fontSize:"1rem",lineHeight:1.7,color:"#5A4E3E"}}>Sin costos ocultos. Sin contratos de largo plazo. Pago seguro con Mercado Pago.</p>
    <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2,marginTop:64}}>
      {plans.map((p,i)=>(
        <div key={i} className="plc rv" style={{background:p.dark?"#1A1A1A":"#F5EFE0"}}>
          {p.badge&&<div style={{position:"absolute",top:-14,left:40,background:"#C8392B",color:"white",fontSize:".68rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1.5px",padding:"5px 14px"}}>{p.badge}</div>}
          <div className="pf" style={{fontSize:"1.6rem",fontWeight:700,marginBottom:8,color:p.dark?"white":"#1A1A1A"}}>{p.name}</div>
          <div style={{fontSize:".82rem",color:p.dark?"rgba(255,255,255,.5)":"#5A4E3E",marginBottom:32}}>{p.tag}</div>
          <div className="pf" style={{fontSize:"2.8rem",fontWeight:900,lineHeight:1,color:p.dark?"white":"#1A1A1A",marginBottom:4}}>{p.price}</div>
          <div style={{fontSize:".78rem",color:p.dark?"rgba(255,255,255,.4)":"#5A4E3E",marginBottom:4}}>{p.period}</div>
          <div style={{fontSize:".75rem",color:p.dark?"rgba(255,255,255,.35)":"#5A4E3E",marginBottom:28,fontStyle:"italic"}}>{p.fee}</div>
          <ul style={{listStyle:"none",marginBottom:28}}>
            {p.fts.map((f,j)=>(
              <li key={j} style={{fontSize:".88rem",padding:"10px 0",borderBottom:"1px solid "+(p.dark?"rgba(255,255,255,.08)":"rgba(0,0,0,.07)"),display:"flex",gap:12,alignItems:"flex-start",color:p.dark?"rgba(255,255,255,.75)":"#1A1A1A"}}>
                <span style={{color:f.ok?"#C8392B":(p.dark?"rgba(255,255,255,.2)":"rgba(0,0,0,.2)"),fontWeight:700,flexShrink:0}}>{f.ok?"✓":"—"}</span>{f.t}
              </li>
            ))}
          </ul>
          {p.mp?(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <a href={p.mp} target="_blank" rel="noreferrer" style={{display:"block",textAlign:"center",padding:"14px",background:"#009EE3",color:"white",fontSize:".82rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"1.5px",cursor:"pointer",borderRadius:2,textDecoration:"none",transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="#007DB3"} onMouseLeave={e=>e.currentTarget.style.background="#009EE3"}>Pagar con Mercado Pago</a>
              <button onClick={()=>goTo("contact")} style={{display:"block",width:"100%",textAlign:"center",padding:"11px",border:p.dark?"1px solid rgba(255,255,255,.2)":"1px solid rgba(0,0,0,.2)",background:"transparent",fontSize:".78rem",color:p.dark?"rgba(255,255,255,.5)":"#5A4E3E",cursor:"pointer",fontFamily:"DM Sans,sans-serif",borderRadius:2}}>o agendar diagnostico gratis →</button>
            </div>
          ):(
            <a href={WA_LINK+"?text="+encodeURIComponent("Hola! Quiero conocer el plan Pro para mi operacion.")} target="_blank" rel="noreferrer" style={{display:"block",textAlign:"center",padding:"15px",border:"1.5px solid #1A1A1A",background:"transparent",color:"#1A1A1A",fontSize:".82rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1.5px",cursor:"pointer",borderRadius:2,textDecoration:"none",transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.background="#1A1A1A";e.currentTarget.style.color="white";}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#1A1A1A";}}>Hablar con ventas →</a>
          )}
        </div>
      ))}
    </div>
    <p className="rv" style={{textAlign:"center",marginTop:28,fontSize:".82rem",color:"#5A4E3E"}}>Todos los planes incluyen onboarding sin costo. Sin permanencia minima los primeros 30 dias.</p>
  </section>

  {/* WHY */}
  <section id="why" className="g2" style={{background:"#1A1A1A",display:"grid",gridTemplateColumns:"1fr 1fr"}}>
    <div className="sec rv" style={{padding:"110px 80px",borderRight:"1px solid rgba(255,255,255,.07)"}}>
      <p style={{fontSize:".7rem",fontWeight:500,textTransform:"uppercase",letterSpacing:3,color:"#D4A547",marginBottom:18}}>Resultados reales</p>
      <div className="pf" style={{fontSize:"clamp(5rem,10vw,9rem)",fontWeight:900,lineHeight:1,color:"white",marginBottom:20}}>+40<span style={{color:"#C8392B"}}>%</span></div>
      <p style={{fontSize:"1rem",lineHeight:1.7,color:"rgba(255,255,255,.45)",maxWidth:360}}>Incremento promedio en ventas en los primeros 90 dias de trabajo conjunto.</p>
      <div style={{marginTop:20,color:"rgba(255,255,255,.3)",fontSize:".78rem",textTransform:"uppercase",letterSpacing:"1.5px"}}>Basado en 16+ restaurantes activos en Lima</div>
    </div>
    <div className="sec rv" style={{padding:"110px 80px"}}>
      <p style={{fontSize:".7rem",fontWeight:500,textTransform:"uppercase",letterSpacing:3,color:"#D4A547",marginBottom:18}}>Por que Sazon</p>
      <h2 className="pf" style={{fontSize:"clamp(2rem,3vw,3rem)",lineHeight:1.1,color:"white",marginBottom:48}}>Los ingredientes<br/>de nuestro exito.</h2>
      <div style={{display:"flex",flexDirection:"column",gap:2}}>
        {plrs.map((p,i)=>(
          <div key={i} className="pc">
            <span style={{fontSize:"1.5rem",flexShrink:0}}>{p.ico}</span>
            <div><h4 style={{fontSize:".98rem",fontWeight:500,color:"white",marginBottom:6}}>{p.t}</h4><p style={{fontSize:".85rem",color:"rgba(255,255,255,.42)",lineHeight:1.6}}>{p.d}</p></div>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* CLIENTS */}
  <section id="clients" className="sec" style={{padding:"110px 80px",background:"#F5EFE0"}}>
    <p className="rv" style={{fontSize:".7rem",fontWeight:500,textTransform:"uppercase",letterSpacing:3,color:"#C8392B",marginBottom:18}}>Clientes</p>
    <h2 className="pf rv" style={{fontSize:"clamp(2.2rem,3.5vw,3.4rem)",lineHeight:1.1}}>Restaurantes que ya le<br/>pusieron sazon a su delivery.</h2>
    <div className="g5" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:2,marginTop:64}}>
      {clts.map((c,i)=>(
        <div key={i} className="cc rv"><div style={{fontSize:"1.8rem",marginBottom:12}}>{c.ico}</div><div className="cn">{c.n}</div></div>
      ))}
    </div>
  </section>

  {/* CONTACT */}
  <section id="contact" className="sec" style={{padding:"110px 80px",background:"#F5EFE0"}}>
    <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80}}>
      <div>
        <p className="rv" style={{fontSize:".7rem",fontWeight:500,textTransform:"uppercase",letterSpacing:3,color:"#C8392B",marginBottom:18}}>Contacto</p>
        <h2 className="pf rv" style={{fontSize:"clamp(2.2rem,3.5vw,3.4rem)",lineHeight:1.1}}>Listo para que tu<br/>delivery despegue?</h2>
        <div className="rv" style={{width:56,height:3,background:"#C8392B",margin:"28px 0"}}/>
        <p className="rv" style={{fontSize:"1rem",lineHeight:1.7,color:"#5A4E3E",maxWidth:380,marginBottom:32}}>Completa el formulario y un Growth Manager te contactara en menos de 24 horas.</p>
        <div className="rv" style={{background:"#EDE4CE",border:"1px solid rgba(0,0,0,.1)",padding:"24px 28px",marginBottom:32}}>
          <p style={{fontSize:".7rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"2px",color:"#C8392B",marginBottom:12}}>Calculadora de ROI</p>
          <p style={{fontSize:".8rem",color:"#5A4E3E",marginBottom:14,lineHeight:1.5}}><strong>Formula:</strong> pedidos x ticket x 28% = ingreso extra mensual</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            <div>
              <label style={lbl}>Pedidos/mes</label>
              <select name="pedidos" value={form.pedidos} onChange={hi} style={inp} onFocus={e=>e.target.style.borderColor="#C8392B"} onBlur={e=>e.target.style.borderColor="rgba(0,0,0,.12)"}>
                <option value="50-100">50 a 100</option><option value="100-300">100 a 300</option><option value="300-1000">300 a 1000</option><option value="1000+">Mas de 1000</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Ticket S/</label>
              <input type="number" name="ticket" value={form.ticket} onChange={hi} placeholder="Ej: 42" style={inp} onFocus={e=>e.target.style.borderColor="#C8392B"} onBlur={e=>e.target.style.borderColor="rgba(0,0,0,.12)"}/>
            </div>
          </div>
          <div style={{background:"#C8392B",color:"white",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:".78rem",textTransform:"uppercase",letterSpacing:"1px"}}>Crecimiento proyectado</span>
            <span className="pf" style={{fontSize:"1.6rem",fontWeight:700}}>S/ {roiM.toLocaleString()}/mes</span>
          </div>
          <p style={{fontSize:".72rem",color:"#5A4E3E",marginTop:8,textAlign:"right"}}>S/ {roiA.toLocaleString()} adicionales al año</p>
        </div>
        {[{ico:"📱",txt:"+51 952 363 643",href:WA_LINK},{ico:"📧",txt:"hola@sazonpartner.com",href:"mailto:hola@sazonpartner.com"},{ico:"📍",txt:"Lima, Peru",href:null}].map((d,i)=>(
          <div key={i} style={{display:"flex",gap:16,alignItems:"center",padding:"18px 0",borderBottom:"1px solid rgba(0,0,0,.08)",borderTop:i===0?"1px solid rgba(0,0,0,.08)":"none"}}>
            <span style={{fontSize:"1.2rem"}}>{d.ico}</span>
            {d.href?<a href={d.href} target="_blank" rel="noreferrer" style={{color:"#1A1A1A",textDecoration:"none",fontSize:".95rem",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="#C8392B"} onMouseLeave={e=>e.target.style.color="#1A1A1A"}>{d.txt}</a>:<span style={{fontSize:".95rem"}}>{d.txt}</span>}
          </div>
        ))}
        <a href={WA_LINK+"?text="+encodeURIComponent("Hola! Quiero conocer mas sobre Sazon Growth Partner.")} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:10,marginTop:24,background:"#25D366",color:"white",padding:"14px 28px",borderRadius:2,textDecoration:"none",fontSize:".88rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="#1EB658"} onMouseLeave={e=>e.currentTarget.style.background="#25D366"}>
          <span>💬</span> Escribir por WhatsApp
        </a>
      </div>
      <div>
        {!sent?(
          <form className="rv" onSubmit={sub} style={{display:"flex",flexDirection:"column",gap:16}}>
            <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {[{l:"Nombre",n:"nombre",pl:"Tu nombre",t:"text"},{l:"Restaurante",n:"restaurante",pl:"Nombre del local",t:"text"}].map(f=>(
                <div key={f.n} style={{display:"flex",flexDirection:"column",gap:6}}>
                  <label style={lbl}>{f.l}</label>
                  <input name={f.n} type={f.t} placeholder={f.pl} value={form[f.n]} onChange={hi} style={inp} onFocus={e=>e.target.style.borderColor="#C8392B"} onBlur={e=>e.target.style.borderColor="rgba(0,0,0,.12)"}/>
                </div>
              ))}
            </div>
            <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {[{l:"Email",n:"email",pl:"tu@email.com",t:"email"},{l:"WhatsApp",n:"whatsapp",pl:"+51 999 999 999",t:"tel"}].map(f=>(
                <div key={f.n} style={{display:"flex",flexDirection:"column",gap:6}}>
                  <label style={lbl}>{f.l}</label>
                  <input name={f.n} type={f.t} placeholder={f.pl} value={form[f.n]} onChange={hi} style={inp} onFocus={e=>e.target.style.borderColor="#C8392B"} onBlur={e=>e.target.style.borderColor="rgba(0,0,0,.12)"}/>
                </div>
              ))}
            </div>
            {[{l:"Plataformas activas",n:"plataformas",opts:["Solo Rappi","Rappi + PedidosYa","3 o mas plataformas"]},{l:"Plan de interes",n:"plan",opts:["Starter - S/890/mes","Growth - S/1,790/mes","Pro - Cotizacion","No se aun"]}].map(f=>(
              <div key={f.n} style={{display:"flex",flexDirection:"column",gap:6}}>
                <label style={lbl}>{f.l}</label>
                <select name={f.n} value={form[f.n]} onChange={hi} style={inp} onFocus={e=>e.target.style.borderColor="#C8392B"} onBlur={e=>e.target.style.borderColor="rgba(0,0,0,.12)"}>
                  {f.opts.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <label style={lbl}>Cuentanos sobre tu operacion (opcional)</label>
              <textarea name="mensaje" value={form.mensaje} onChange={hi} placeholder="En que plataformas estas? Cuantos pedidos? Cual es tu mayor desafio?" rows={4} style={inp} onFocus={e=>e.target.style.borderColor="#C8392B"} onBlur={e=>e.target.style.borderColor="rgba(0,0,0,.12)"}/>
            </div>
            {err&&<div style={{fontSize:".85rem",color:"#C8392B",padding:"10px 14px",background:"rgba(200,57,43,.08)",border:"1px solid rgba(200,57,43,.2)",borderRadius:2}}>{err}</div>}
            <button type="submit" style={{background:"#C8392B",color:"white",border:"none",padding:"18px 40px",fontSize:".85rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1.5px",cursor:"pointer",fontFamily:"DM Sans,sans-serif",alignSelf:"flex-start",borderRadius:2,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="#9B2335"} onMouseLeave={e=>e.currentTarget.style.background="#C8392B"}>Enviar y agendar diagnostico →</button>
            <p style={{fontSize:".75rem",color:"#5A4E3E"}}>Al enviar, se abre WhatsApp. Un Growth Manager te contacta en menos de 24 horas.</p>
          </form>
        ):(
          <div style={{padding:"48px 40px",background:"#EDE4CE",border:"1px solid rgba(0,0,0,.08)",textAlign:"center"}}>
            <div style={{fontSize:52,marginBottom:16}}>✅</div>
            <div className="pf" style={{fontSize:"1.8rem",fontWeight:700,marginBottom:10}}>Mensaje enviado.</div>
            <p style={{fontSize:"1rem",color:"#5A4E3E",lineHeight:1.7}}>Un Growth Manager te contactara en menos de 24 horas.</p>
            <button onClick={()=>setSent(false)} style={{marginTop:24,background:"none",border:"1.5px solid #1A1A1A",padding:"10px 24px",fontSize:".82rem",textTransform:"uppercase",letterSpacing:"1.5px",cursor:"pointer",fontFamily:"DM Sans,sans-serif",borderRadius:2}}>Enviar otro</button>
          </div>
        )}
      </div>
    </div>
  </section>

  {/* FOOTER */}
  <footer style={{background:"#2D2D2D",color:"rgba(255,255,255,.4)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"28px 80px",fontSize:".78rem",flexWrap:"wrap",gap:12}}>
    <div className="pf" style={{fontWeight:900,fontSize:"1.1rem",color:"white"}}>Saz<span style={{fontFamily:"DM Sans,sans-serif"}}>ó</span>n<span style={{color:"#C8392B"}}>.</span> Growth Partner</div>
    <div>2025 Sazon. Todos los derechos reservados.</div>
    <div style={{display:"flex",gap:24}}>
      {["Privacidad","Terminos"].map(l=><a key={l} href="#" style={{color:"rgba(255,255,255,.4)",textDecoration:"none",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="white"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.4)"}>{l}</a>)}
    </div>
  </footer>

  {/* CARLOS CHAT WIDGET */}
  <div className="cw">
    {chatOpen&&(
      <div className="cwin">
        <div className="ch">
          <div className="cav">🌶️</div>
          <div>
            <div style={{fontSize:".9rem",fontWeight:700,color:"white"}}>Carlos</div>
            <div style={{fontSize:".72rem",color:"rgba(255,255,255,.5)",display:"flex",alignItems:"center",gap:5}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#25D366",display:"inline-block"}}/> Growth Executive
            </div>
          </div>
          <button onClick={()=>{setChatOpen(false);setHist([]);setStep("bienvenida");}} style={{marginLeft:"auto",background:"none",border:"none",color:"rgba(255,255,255,.5)",fontSize:"1.2rem",cursor:"pointer",lineHeight:1}}>×</button>
        </div>
        <div className="cm">
          {hist.map((m,i)=>(
            <div key={i} className={"mc"+(m.f==="u"?" u":"")}>
              <div className={"mb "+(m.f==="c"?"c":"u")}>{m.m}</div>
            </div>
          ))}
          {busy&&<div className="mc"><div className="mb c" style={{display:"flex",gap:5,alignItems:"center"}}><div className="dt"/><div className="dt"/><div className="dt"/></div></div>}
          <div ref={endRef}/>
        </div>
        {!busy&&cs?.opts?.length>0&&(
          <div className="co">
            {cs.opts.map((op,i)=><button key={i} onClick={()=>pick(op)}>{op.txt}</button>)}
            <a href={WA_LINK+"?text="+encodeURIComponent("Hola! Quiero hablar con un Growth Manager de Sazon.")} target="_blank" rel="noreferrer" style={{display:"block",textAlign:"center",padding:"8px",fontSize:".76rem",color:"#25D366",fontWeight:600,textDecoration:"none"}}>
              💬 Hablar directo por WhatsApp
            </a>
          </div>
        )}
      </div>
    )}
    <button className="cb" onClick={()=>setChatOpen(v=>!v)} title="Habla con Carlos">{chatOpen?"×":"💬"}</button>
    {!chatOpen&&<div style={{background:"#1A1A1A",color:"white",padding:"8px 14px",borderRadius:8,fontSize:".78rem",fontWeight:500,boxShadow:"0 4px 16px rgba(0,0,0,.2)",animation:"fDown .4s ease",whiteSpace:"nowrap"}}><span style={{color:"#D4A547"}}>Carlos</span> — calcula tu ROI gratis</div>}
  </div>
  </>);
}
