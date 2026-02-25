import { useState, useEffect, useRef } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const WA_LINK       = "https://wa.me/51952363643";
const CONTACT_EMAIL = "comercial@sazonpartner.com";

// Mercado Pago — agrega en Netlify: Site settings → Environment variables
const MP_STARTER = import.meta.env.VITE_MP_STARTER || "";
const MP_GROWTH  = import.meta.env.VITE_MP_GROWTH  || "";

// ── OPCION 1 (GRATIS): Google Gemini — console.cloud.google.com
//    Crear proyecto → habilitar Gemini API → Credentials → Create API Key
//    Netlify env var: VITE_GEMINI_KEY
//    Limite gratuito: 1,500 requests/dia, sin tarjeta de credito
const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || "";

// ── OPCION 2 (PAGO): Anthropic Claude — console.anthropic.com
//    Netlify env var: VITE_ANTHROPIC_KEY
//    Sin clave, Carlos usa fallback inteligente (funciona sin costo)
const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_KEY || "";

// ─── PAGO: abre el link de MP evitando el link-expander de Netlify ───────────
// El error "resource /expand/..." ocurre porque Netlify intenta resolver
// shortlinks de mpago.la en el servidor. Soluciones:
//
// OPCION A (recomendada): Usa la URL larga de Mercado Pago:
//   - Abre tu shortlink mpago.la/xxx en el navegador
//   - Copia la URL final a la que redirige (empieza con mercadopago.com.pe/...)
//   - Usa esa URL como VITE_MP_STARTER / VITE_MP_GROWTH en Netlify
//
// OPCION B (este codigo): Crea un <a> en tiempo de ejecucion — el navegador
//   lo abre directamente sin pasar por Netlify
function openPayment(url) {
  if (!url) return;
  let full = url.trim();
  if (!full.startsWith("http")) full = "https://" + full;
  // Crear elemento <a> temporal — bypasea el link-expander del servidor
  const a = document.createElement("a");
  a.href = full;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { try { document.body.removeChild(a); } catch{} }, 200);
}

// ─── CARLOS: SYSTEM PROMPT ───────────────────────────────────────────────────
const CARLOS_SYSTEM = `Eres Carlos, Growth Executive del equipo de Sazón Growth Partner. Sazón ayuda a restaurantes a crecer sus ventas en plataformas de delivery (Rappi, PedidosYa, Didi Food, Glovo y más).

SOBRE SAZÓN:
- Equipo especializado que gestiona la presencia de restaurantes en apps de delivery
- Negociamos comisiones, optimizamos menús digitales, ejecutamos campañas
- Los restaurantes crecen +38% en pedidos en los primeros 90 días en promedio
- Plan Starter: S/890/mes — 1 plataforma, hasta 300 pedidos/mes
- Plan Growth: S/1,790/mes — hasta 3 plataformas, acompañamiento completo (MÁS POPULAR)
- Plan Pro: cotización a medida para cadenas, multi-local y dark kitchens
- Sin contratos de largo plazo. Pago mensual seguro.

TU MISIÓN: Entender la situación del restaurante, calcular su ROI personalizado y cerrar la venta directamente en este chat.

REGLAS CRÍTICAS:
1. NUNCA menciones IA, bots, automatización ni tecnología interna. Siempre di "nuestro equipo" o "nuestros especialistas"
2. NO agendes reuniones ni llamadas. Todo se resuelve por este chat
3. Respuestas CORTAS y conversacionales — máximo 3 oraciones
4. No compartas números de teléfono directos ni información interna
5. Responde SIEMPRE en español latinoamericano natural y cálido
6. No seas vendedor agresivo — sé consultivo, como un amigo experto

CÓMO CALCULAR EL ROI (hazlo siempre que tengas los datos):
Formula: pedidos_mes × ticket_promedio × 0.28 = ingreso_extra_mensual
Ejemplo: 200 pedidos × S/42 ticket = S/2,352 extras al mes

FLUJO NATURAL DE VENTAS:
1. Saludo → preguntar en qué plataformas están
2. Entender volumen → pedidos/mes y ticket promedio
3. Calcular ROI exacto → mostrar el número real
4. Recomendar plan → Starter si <300 pedidos/mes, Growth si >300 o ya en 2+ plataformas
5. Manejar objeciones → siempre con el ROI como argumento
6. Cerrar → Cuando estén listos, di exactamente: "[PAGO_STARTER]" para Starter o "[PAGO_GROWTH]" para Growth

OBJECIONES COMUNES:
- "muy caro" → calcula cuánto más van a ganar vs el costo. Ej: "Pagas S/890 para generar S/2,352 extra — eso es 264% de retorno"
- "voy a pensarlo" → "¿Qué te genera dudas? Te lo resuelvo ahora mismo"
- "ya tenemos alguien" → "¿Están logrando +38% de crecimiento? Si no, algo se puede mejorar"
- "no sé si funciona" → mencion resultados: restaurantes que crecieron 40-55%

CUANDO EL CHAT NO SEA SOBRE VENTAS:
- Si preguntan por el email de contacto: ${CONTACT_EMAIL}
- Si preguntan algo que no puedes responder: "Déjame consultarlo con el equipo y te confirmo"`;

// ─── CARLOS: GEMINI API (GRATIS) ────────────────────────────────────────────
// google.com/aistudio → Get API Key → sin tarjeta, 1500 requests/dia gratis
async function callGeminiAPI(history) {
  if (!GEMINI_KEY) return null;
  try {
    // Convertir historial al formato de Gemini (user/model en vez de user/assistant)
    const contents = history.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: CARLOS_SYSTEM }] },
          contents,
          generationConfig: { maxOutputTokens: 280, temperature: 0.75 }
        })
      }
    );
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

// ─── CARLOS: ANTHROPIC API (PAGO) ────────────────────────────────────────────
async function callAnthropicAPI(history) {
  if (!ANTHROPIC_KEY) return null;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 280,
        system: CARLOS_SYSTEM,
        messages: history
      })
    });
    const data = await res.json();
    return data.content?.[0]?.text || null;
  } catch {
    return null;
  }
}

// ─── CARLOS: ROUTER — Gemini gratis → Anthropic → Fallback inteligente ────────
async function callCarlosAPI(history) {
  // 1. Intentar Gemini (gratis, sin tarjeta)
  if (GEMINI_KEY) {
    const r = await callGeminiAPI(history);
    if (r) return r;
  }
  // 2. Intentar Anthropic (si configurado)
  if (ANTHROPIC_KEY) {
    const r = await callAnthropicAPI(history);
    if (r) return r;
  }
  // 3. Fallback inteligente local (siempre funciona)
  return null;
}

// ─── CARLOS: FALLBACK INTELIGENTE (sin API) ───────────────────────────────────
function carlosFallback(history) {
  const full = history.map(m => m.content).join(" ").toLowerCase();
  const last = history[history.length - 1]?.content?.toLowerCase() || "";

  // Extraer datos numericos de la conversacion
  const pedM = full.match(/(\d{2,4})\s*(pedidos|ordenes|ventas|al\s*mes|por\s*mes)/);
  const pedidos = pedM ? parseInt(pedM[1]) : null;
  const tickM = full.match(/(?:s\/|soles|ticket[^0-9]*|promedio[^0-9]*|cobra[^0-9]*|cuesta[^0-9]*)(\d{2,3})/);
  const ticket = tickM ? parseInt(tickM[1]) : null;
  const plats = [];
  if (/rappi/.test(full)) plats.push("Rappi");
  if (/pedidosya|pedidos ya/.test(full)) plats.push("PedidosYa");
  if (/didi/.test(full)) plats.push("Didi Food");
  if (/glovo/.test(full)) plats.push("Glovo");
  if (/uber/.test(full)) plats.push("Uber Eats");

  // Con todos los datos: calcular ROI y recomendar
  if (pedidos && ticket) {
    const roi = Math.round(pedidos * ticket * 0.28);
    const plan = pedidos < 300 ? "Starter" : "Growth";
    const precio = pedidos < 300 ? "890" : "1,790";
    const retorno = Math.round((roi / parseInt(precio.replace(",","")))*100);
    if (/caro|costoso|mucho|presupuesto|no puedo/.test(last)) {
      return `Entiendo la preocupacion. Mira los numeros: con ${pedidos} pedidos a S/${ticket} de ticket, proyectamos S/${roi.toLocaleString()} extra al mes para tu restaurante. El plan cuesta S/${precio}. Estas invirtiendo S/${precio} para generar S/${roi.toLocaleString()} — un retorno del ${retorno}%. ¿Quieres comenzar?`;
    }
    if (/contrat|pagar|empez|comenzar|listo|quiero iniciar|cuand/.test(last)) {
      const token = plan === "Starter" ? "[PAGO_STARTER]" : "[PAGO_GROWTH]";
      return `Perfecto! Basado en tu operacion recomendamos el plan ${plan} a S/${precio}/mes. Proyectamos S/${roi.toLocaleString()} adicionales al mes para tu restaurante. Para activar tu cuenta: ${token}`;
    }
    if (!(/ya calc|ya supe|ya vi/.test(full))) {
      return `Con ${pedidos} pedidos y S/${ticket} de ticket, nuestro equipo proyecta S/${roi.toLocaleString()} de ingresos adicionales al mes para tu restaurante. El plan ${plan} (S/${precio}/mes) es el ideal para ti — eso es un retorno del ${retorno}%. ¿Lo activamos?`;
    }
  }

  // Con pedidos pero sin ticket
  if (pedidos && !ticket) {
    return `Bien, ${pedidos} pedidos al mes es un buen punto de partida. Para calcularte el ROI exacto, ¿cual es el ticket promedio de tus pedidos? (cuanto gasta en promedio cada cliente)`;
  }

  // Con plataformas pero sin volumen
  if (plats.length > 0 && !pedidos) {
    return `Bien, ${plats.join(" y ")}! Para calcularte exactamente cuanto podrias crecer, ¿cuantos pedidos reciben por mes aproximadamente?`;
  }

  // Intents por palabras clave
  if (/hola|buenas|buenos|hi |hey |saludos|inicio/.test(last)) {
    return "Hola! Soy Carlos del equipo de Sazon. Ayudamos a restaurantes a crecer sus ventas en delivery. ¿En que plataformas estan activos actualmente? (Rappi, PedidosYa, Didi...)";
  }
  if (/precio|plan|costo|cuanto cobr|tarifa|mensual|que ofrecen|que planes/.test(last)) {
    return "Tenemos Starter a S/890/mes (1 plataforma) y Growth a S/1,790/mes (hasta 3 plataformas). Pero antes de recomendarte, cuéntame: ¿cuántos pedidos recibes por mes y en qué plataformas estás?";
  }
  if (/servicio|que hacen|incluye|gestion|como funciona/.test(last)) {
    return "Nuestro equipo gestiona todo: negocia tus comisiones con las apps, optimiza tu menu digital, ejecuta campañas y te da reportes mensuales. Tú sigues cocinando, nosotros hacemos crecer las ventas. ¿En qué plataformas estás?";
  }
  if (/funciona|resultado|garantia|prueba|caso|exito|crec/.test(last)) {
    return "Los restaurantes que trabajan con nosotros crecen en promedio +38% en pedidos en los primeros 90 dias. Algunos superan el +55%. Si me das tu volumen actual, te calculo exactamente cuanto serian para ti.";
  }
  if (/pens|despues|luego|mas tarde|no se|dud/.test(last)) {
    return "¿Qué te genera dudas? Cuéntame y te lo resuelvo ahora mismo. No hay ningún compromiso en preguntar.";
  }
  if (/ningun|no estoy|no tengo|quiero entrar|empezar en delivery/.test(last)) {
    return "Perfecto para empezar desde cero. Tenemos experiencia montando operaciones completas en Rappi y PedidosYa. El plan Starter a S/890/mes incluye todo el setup inicial. ¿Cuántos pedidos físicos recibe tu restaurante por día?";
  }
  if (/contrat|pagar|empez|comenzar|listo|quiero iniciar/.test(last)) {
    return "Excelente! Para recomendarte el plan exacto necesito saber: ¿cuántos pedidos recibes por mes y en qué plataformas estás? Con eso te paso el link de pago y arrancamos esta semana.";
  }
  if (/email|correo|mail|contacto/.test(last)) {
    return `Claro, puedes escribirnos también a ${CONTACT_EMAIL}. Pero estoy aqui ahora mismo — ¿en qué te puedo ayudar?`;
  }
  if (/cadena|varios locales|franquicia|multi|dark kitchen/.test(last)) {
    return "Para operaciones multi-local y cadenas tenemos el plan Pro, que incluye gestion de plataformas ilimitadas y equipo dedicado. ¿Cuántos locales tienen y en qué plataformas?";
  }

  // Defaults variados
  const defs = [
    "Cuéntame sobre tu restaurante: ¿en qué plataformas estás y cuántos pedidos recibes por mes?",
    "Para ayudarte mejor, necesito entender tu operacion. ¿Cuántos pedidos al mes y en qué apps de delivery estás?",
    "¿Qué plataformas de delivery usan actualmente y cuántos pedidos manejan por mes? Con eso te armo el análisis.",
  ];
  return defs[Math.floor(Math.random() * defs.length)];
}

// ─── CARLOS: RENDER DE MENSAJE (convierte tokens a botones) ───────────────────
function CarlosMsg({ text }) {
  if (!text) return null;
  if (!text.includes("[PAGO_")) {
    return <span>{text}</span>;
  }
  const parts = text.split(/(\[PAGO_STARTER\]|\[PAGO_GROWTH\])/g);
  return (
    <span>
      {parts.map((p, i) => {
        if (p === "[PAGO_STARTER]") {
          return MP_STARTER ? (
            <button key={i} onClick={() => openPayment(MP_STARTER)}
              style={{ display:"inline-block", marginTop:8, padding:"10px 20px", background:"#009EE3", color:"white", borderRadius:8, fontSize:".82rem", fontWeight:700, textDecoration:"none", textTransform:"uppercase", letterSpacing:1, border:"none", cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
              Pagar Starter — S/890/mes ↗
            </button>
          ) : (
            <span key={i} style={{ display:"inline-block", marginTop:8, padding:"10px 18px", background:"rgba(0,158,227,.2)", color:"#60d4f7", borderRadius:8, fontSize:".8rem", border:"1px solid rgba(0,158,227,.3)" }}>
              Configura VITE_MP_STARTER en Netlify
            </span>
          );
        }
        if (p === "[PAGO_GROWTH]") {
          return MP_GROWTH ? (
            <button key={i} onClick={() => openPayment(MP_GROWTH)}
              style={{ display:"inline-block", marginTop:8, padding:"10px 20px", background:"#009EE3", color:"white", borderRadius:8, fontSize:".82rem", fontWeight:700, textDecoration:"none", textTransform:"uppercase", letterSpacing:1, border:"none", cursor:"pointer", fontFamily:"DM Sans,sans-serif" }}>
              Pagar Growth — S/1,790/mes ↗
            </button>
          ) : (
            <span key={i} style={{ display:"inline-block", marginTop:8, padding:"10px 18px", background:"rgba(0,158,227,.2)", color:"#60d4f7", borderRadius:8, fontSize:".8rem", border:"1px solid rgba(0,158,227,.3)" }}>
              Configura VITE_MP_GROWTH en Netlify
            </span>
          );
        }
        return p ? <span key={i}>{p}</span> : null;
      })}
    </span>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled,  setScrolled]  = useState(false);
  const [chatOpen,  setChatOpen]  = useState(false);
  const [chatHist,  setChatHist]  = useState([]);   // [{from:"carlos"|"user", text}]
  const [apiHist,   setApiHist]   = useState([]);   // [{role,content}] para Claude API
  const [chatBusy,  setChatBusy]  = useState(false);
  const [inputVal,  setInputVal]  = useState("");
  const [formSent,  setFormSent]  = useState(false);
  const [formErr,   setFormErr]   = useState("");
  const [form, setForm] = useState({
    nombre:"", restaurante:"", email:"", whatsapp:"",
    plan:"Starter", plataformas:"Solo Rappi",
    pedidos:"100-300", ticket:"", mensaje:"",
  });
  const endRef   = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 55);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".rv");
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) {
        const s = Array.from(e.target.parentElement?.querySelectorAll(".rv") || []);
        const i = s.indexOf(e.target);
        setTimeout(() => e.target.classList.add("vis"), Math.min(i * 80, 360));
        obs.unobserve(e.target);
      }
    }), { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Abrir chat con mensaje de bienvenida
  useEffect(() => {
    if (chatOpen && chatHist.length === 0) {
      setTimeout(() => {
        const welcome = "Hola! Soy Carlos del equipo de Sazón. Ayudamos a restaurantes a crecer en delivery. ¿En qué plataformas están activos actualmente?";
        setChatHist([{ from: "carlos", text: welcome }]);
      }, 350);
    }
  }, [chatOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHist]);

  const goTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  async function sendMsg() {
    const msg = inputVal.trim();
    if (!msg || chatBusy) return;
    setInputVal("");
    setChatBusy(true);

    const newDisplay = [...chatHist, { from: "user", text: msg }];
    setChatHist(newDisplay);

    const newApiHist = [...apiHist, { role: "user", content: msg }];
    setApiHist(newApiHist);

    // Gemini gratis → Anthropic → Fallback inteligente local
    let reply = await callCarlosAPI(newApiHist);
    if (!reply) {
      reply = carlosFallback(newApiHist);
    }

    const finalApiHist = [...newApiHist, { role: "assistant", content: reply }];
    setApiHist(finalApiHist);
    setChatHist([...newDisplay, { from: "carlos", text: reply }]);
    setChatBusy(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
  }

  const hi = e => { setForm({ ...form, [e.target.name]: e.target.value }); setFormErr(""); };

  function calcFormROI() {
    const mp = { "50-100": 75, "100-300": 200, "300-1000": 650, "1000+": 1000 };
    const p = mp[form.pedidos] || 200;
    const t = parseFloat(form.ticket) || 40;
    const m = Math.round(p * t * 0.28);
    return { m, a: m * 12 };
  }

  function submitForm(e) {
    e.preventDefault();
    if (!form.nombre.trim()) { setFormErr("Ingresa tu nombre"); return; }
    if (!form.restaurante.trim()) { setFormErr("Ingresa el nombre del restaurante"); return; }
    if (form.whatsapp.replace(/\D/g, "").length < 9) { setFormErr("WhatsApp invalido"); return; }
    const { m, a } = calcFormROI();
    const txt = encodeURIComponent(
      "Hola! Solicito mi diagnostico gratuito.\n\n" +
      "Nombre: " + form.nombre + "\n" +
      "Restaurante: " + form.restaurante + "\n" +
      "Plataformas: " + form.plataformas + "\n" +
      "Pedidos/mes: " + form.pedidos + "\n" +
      "Ticket: S/" + (form.ticket || "?") + "\n" +
      "ROI proyectado: S/" + m.toLocaleString() + "/mes\n" +
      "Plan: " + form.plan + "\n\n" +
      (form.mensaje || "Me interesa el analisis gratuito.")
    );
    window.open(WA_LINK + "?text=" + txt, "_blank");
    setFormSent(true);
  }

  const { m: roiM, a: roiA } = calcFormROI();

  // ─── DATA ───────────────────────────────────────────────────────────────────
  const plats  = ["Rappi","PedidosYa","Didi Food","Uber Eats","iFood","Glovo","Rappi","PedidosYa","Didi Food","Uber Eats","iFood","Glovo"];
  const steps4 = [
    { n:"01",lb:"Analizamos",  t:"Diagnostico Profundo",    d:"Auditamos tu operacion en todas las plataformas. Detectamos que frena tus ventas y donde estan las oportunidades sin explotar." },
    { n:"02",lb:"Disenamos",   t:"Estrategia Personalizada",d:"Creamos un plan a medida: precios, menu digital, campañas y negociaciones. Cada accion respaldada en datos reales." },
    { n:"03",lb:"Ejecutamos",  t:"Gestion Integral",         d:"Un Growth Manager dedicado opera tu presencia en los aplicativos. Tu cocinas, nosotros hacemos que se venda." },
    { n:"04",lb:"Optimizamos", t:"Mejora Continua",          d:"Medimos ticket, conversion, recompra y visibilidad. Ajustamos en tiempo real para maximizar resultados cada semana." },
  ];
  const svcs = [
    { ico:"📊",t:"Gestion Integral de Plataformas",  d:"Administramos tu presencia en todas las apps de delivery. Configuracion, operacion diaria y soporte continuo." },
    { ico:"🤝",t:"Negociacion con Aplicativos",      d:"Acceso directo a los equipos comerciales de Rappi, PedidosYa y Didi. Negociamos comisiones y condiciones exclusivas." },
    { ico:"🍽️",t:"Optimizacion de Menu Digital",    d:"Rediseniamos tu carta: fotografias, descripciones persuasivas, precios ancla que incrementa el ticket promedio." },
    { ico:"📣",t:"Campañas en las Food Apps",        d:"Planificamos y ejecutamos campañas pagas para maximizar visibilidad, conversion y volumen de pedidos." },
    { ico:"📈",t:"Reportes y Analisis de Datos",     d:"Reporte mensual con metricas clave: ventas, pedidos, calificaciones, conversion y benchmarks del sector." },
    { ico:"🗓️",t:"Plan Comercial Mensual",          d:"Cada mes presentamos un plan de accion con objetivos y tacticas basadas en los resultados del periodo anterior." },
  ];
  const clts = [
    { n:"Mr Smash",          url:"https://www.instagram.com/mrsmash.pe/",              ico:"🍔" },
    { n:"D'Tinto y Bife",    url:"https://www.instagram.com/dtintoybife/",              ico:"🍷" },
    { n:"Amaia Bakery",      url:"https://www.instagram.com/amaia_bakerype/",           ico:"🥐" },
    { n:"Terminal Pesquero", url:"https://www.instagram.com/terminalpesqueroperu/",     ico:"🦐" },
    { n:"Tokuyo",            url:"https://www.instagram.com/tokuyolima/",              ico:"🍣" },
  ];
  const plrs = [
    { ico:"🔬",t:"Expertise en Foodtech",  d:"Conocemos los algoritmos de cada plataforma y las palancas que mueven el volumen de pedidos." },
    { ico:"📡",t:"Data-Driven al 100%",    d:"Cada decision se basa en metricas. Solo acciones que generan ROI comprobable." },
    { ico:"🤝",t:"Acceso Directo a APPs",  d:"Relaciones directas con Rappi, PedidosYa y Didi. Condiciones exclusivas para nuestros clientes." },
    { ico:"📋",t:"Transparencia Total",    d:"Reportes claros y acceso completo a todos tus datos. Sin letra chica ni sorpresas." },
  ];
  const plans = [
    {
      name:"Starter", tag:"1 plataforma · hasta 300 pedidos/mes",
      price:"S/ 890", period:"/mes", fee:"+3% del crecimiento generado",
      badge:null, dark:false, mpLink: MP_STARTER,
      fts:[{t:"Diagnostico inicial",ok:true},{t:"1 plataforma de delivery",ok:true},{t:"Optimizacion basica de menu",ok:true},{t:"Reporte mensual",ok:true},{t:"1 campaña mensual",ok:true},{t:"Growth Manager dedicado",ok:false},{t:"Negociacion comisiones",ok:false}],
    },
    {
      name:"Growth", tag:"Hasta 3 plataformas · escala rapida",
      price:"S/ 1,790", period:"/mes", fee:"+2.5% del crecimiento generado",
      badge:"Mas popular", dark:true, mpLink: MP_GROWTH,
      fts:[{t:"Diagnostico completo",ok:true},{t:"Hasta 3 plataformas",ok:true},{t:"Optimizacion menu foto+copy+precio",ok:true},{t:"Growth Manager dedicado",ok:true},{t:"Negociacion comisiones",ok:true},{t:"Plan comercial mensual",ok:true},{t:"Hasta 3 campañas mensuales",ok:true}],
    },
    {
      name:"Pro", tag:"Cadenas · multi-local · dark kitchens",
      price:"A medida", period:"cotizacion", fee:"Negociable segun operacion",
      badge:null, dark:false, mpLink: null,
      fts:[{t:"Todo Growth incluido",ok:true},{t:"Plataformas ilimitadas",ok:true},{t:"Dark kitchens y marcas virtuales",ok:true},{t:"Equipo dedicado exclusivo",ok:true},{t:"Campañas ilimitadas",ok:true},{t:"Integracion con POS y tech stack",ok:true},{t:"Reunion semanal de seguimiento",ok:true}],
    },
  ];

  const inp = { background:"#EDE4CE", border:"1px solid rgba(0,0,0,.12)", padding:"14px 18px", fontFamily:"DM Sans,sans-serif", fontSize:".9rem", color:"#1A1A1A", outline:"none", borderRadius:2, width:"100%", transition:"border-color .2s" };
  const lbl = { fontSize:".7rem", textTransform:"uppercase", letterSpacing:"1.5px", fontWeight:500, color:"#5A4E3E", display:"block", marginBottom:6 };

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
    @keyframes fDn{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:none}}
    @keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @keyframes pls{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.2);opacity:.6}}
    @keyframes cpop{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:none}}
    @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
    .a1{animation:fUp .8s .2s both}.a2{animation:fUp .8s .35s both}
    .a3{animation:fUp .8s .5s both}.a4{animation:fUp .8s .65s both}
    .a5{animation:fUp .9s .8s both}.anav{animation:fDn .6s both}
    .sc{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);padding:48px 36px;position:relative;overflow:hidden;transition:background .25s;cursor:default;}
    .sc:hover{background:rgba(200,57,43,.12);}
    .sr{display:grid;grid-template-columns:72px 1fr;border-top:1px solid rgba(0,0,0,.1);padding:36px 0;transition:all .2s;}
    .sr:last-child{border-bottom:1px solid rgba(0,0,0,.1);}
    .si{width:48px;height:48px;border:1.5px solid #C8392B;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:#C8392B;transition:all .2s;margin-top:4px;}
    .sr:hover .si{background:#C8392B;color:white;}
    .pc{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);padding:26px 30px;display:flex;gap:22px;align-items:flex-start;transition:background .2s;}
    .pc:hover{background:rgba(200,57,43,.1);}
    .plc{padding:48px 40px;border:1px solid rgba(0,0,0,.08);position:relative;transition:transform .2s;}
    .plc:hover{transform:translateY(-6px);}
    input:focus,select:focus,textarea:focus{border-color:#C8392B!important;}
    textarea{resize:vertical;}
    select{appearance:none;-webkit-appearance:none;}
    .cw{position:fixed;bottom:28px;right:28px;z-index:999;display:flex;flex-direction:column;align-items:flex-end;gap:10px;}
    .cb{width:62px;height:62px;border-radius:50%;background:#C8392B;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.6rem;box-shadow:0 8px 28px rgba(200,57,43,.4);transition:transform .2s,background .2s;}
    .cb:hover{transform:scale(1.08);background:#9B2335;}
    .cwin{animation:cpop .3s ease;width:360px;background:white;border-radius:18px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.2);display:flex;flex-direction:column;max-height:540px;}
    .ch{background:#1A1A1A;padding:15px 18px;display:flex;align-items:center;gap:11px;}
    .cav{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#C8392B,#D4A547);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;}
    .cm{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#f9f6f0;}
    .mc{display:flex;gap:8px;max-width:86%;}
    .mc.u{align-self:flex-end;flex-direction:row-reverse;}
    .mb{padding:10px 13px;border-radius:12px;font-size:.84rem;line-height:1.55;}
    .mb.c{background:white;border-radius:4px 12px 12px 12px;box-shadow:0 1px 4px rgba(0,0,0,.08);color:#1A1A1A;}
    .mb.u{background:#C8392B;color:white;border-radius:12px 4px 12px 12px;}
    .cinp{display:flex;gap:8px;padding:12px;border-top:1px solid #f0ebe0;background:white;}
    .cinp textarea{flex:1;border:1.5px solid rgba(0,0,0,.1);border-radius:10px;padding:10px 13px;font-family:'DM Sans',sans-serif;font-size:.84rem;resize:none;outline:none;transition:border-color .2s;color:#1A1A1A;background:#f9f6f0;min-height:40px;max-height:100px;}
    .cinp textarea:focus{border-color:#C8392B;}
    .csend{width:40px;height:40px;border-radius:10px;background:#C8392B;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem;color:white;flex-shrink:0;transition:background .2s;align-self:flex-end;}
    .csend:hover{background:#9B2335;}
    .csend:disabled{opacity:.4;cursor:default;}
    .dt{width:7px;height:7px;border-radius:50%;background:#ccc;animation:bounce 1.2s ease infinite;}
    .dt:nth-child(2){animation-delay:.15s;}.dt:nth-child(3){animation-delay:.3s;}
    @media(max-width:900px){
      .nomob{display:none!important;}nav{padding:14px 22px!important;}
      .nl{display:none!important;}.sec{padding:68px 22px!important;}
      .hl{padding:120px 22px 60px!important;}
      .g2{grid-template-columns:1fr!important;}.g3{grid-template-columns:1fr!important;}
      .g4{grid-template-columns:1fr 1fr!important;}.g5{grid-template-columns:repeat(3,1fr)!important;}
      .gs{position:static!important;}
      footer{padding:22px 22px!important;flex-direction:column!important;gap:12px!important;text-align:center!important;}
      .cwin{width:calc(100vw - 32px);}.cw{bottom:16px;right:14px;}
    }
  `}</style>

  {/* ═══ NAV ═══ */}
  <nav className="anav" style={{position:"fixed",top:0,width:"100%",zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:scrolled?"13px 60px":"20px 60px",background:"rgba(245,239,224,.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(200,57,43,.15)",transition:"padding .3s"}}>
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

  {/* ═══ HERO ═══ */}
  <section id="hero" className="g2" style={{minHeight:"100vh",display:"grid",gridTemplateColumns:"1fr 1fr",background:"#1A1A1A",overflow:"hidden"}}>
    <div className="hl" style={{display:"flex",flexDirection:"column",justifyContent:"center",padding:"140px 80px 100px",zIndex:2}}>
      <p className="a1" style={{fontSize:".75rem",fontWeight:500,textTransform:"uppercase",letterSpacing:3,color:"#D4A547",marginBottom:28}}>Growth Partner para Restaurantes</p>
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
        {[{n:"+40%",l:"Ventas promedio"},{n:"16+",l:"Restaurantes activos"},{n:"Top 10%",l:"En sus categorias"}].map((s,i)=>(
          <div key={i} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",padding:"28px 36px",textAlign:"center",backdropFilter:"blur(8px)"}}>
            <strong className="pf" style={{display:"block",fontSize:"2.4rem",fontWeight:700,color:"white"}}>{s.n}</strong>
            <span style={{fontSize:".72rem",textTransform:"uppercase",letterSpacing:"1.5px",color:"rgba(255,255,255,.45)"}}>{s.l}</span>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* ═══ MARQUEE ═══ */}
  <div style={{background:"#EDE4CE",borderTop:"1px solid rgba(0,0,0,.08)",borderBottom:"1px solid rgba(0,0,0,.08)",padding:"18px 0",overflow:"hidden"}}>
    <div style={{display:"flex",gap:56,alignItems:"center",animation:"tick 22s linear infinite",width:"max-content"}}>
      {plats.map((p,i)=><span key={i} style={{fontSize:".75rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"2px",color:"#5A4E3E",opacity:.65,whiteSpace:"nowrap"}}>{p}</span>)}
    </div>
  </div>

  {/* ═══ HOW ═══ */}
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

  {/* ═══ SERVICES ═══ */}
  <section id="services" className="sec" style={{padding:"110px 80px",background:"#F5EFE0"}}>
    <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:80,alignItems:"start"}}>
      <div className="gs rv" style={{position:"sticky",top:120}}>
        <p style={{fontSize:".7rem",fontWeight:500,textTransform:"uppercase",letterSpacing:3,color:"#C8392B",marginBottom:18}}>Servicios</p>
        <h2 className="pf" style={{fontSize:"clamp(2.2rem,3vw,3rem)",lineHeight:1.1}}>Todo lo que tu delivery necesita,<br/>en un solo lugar.</h2>
        <div style={{width:56,height:3,background:"#C8392B",margin:"28px 0"}}/>
        <p style={{fontSize:"1rem",lineHeight:1.7,color:"#5A4E3E",maxWidth:340}}>No somos una agencia. Somos expertos en el ecosistema de food apps con relaciones directas con sus equipos comerciales.</p>
        <button onClick={()=>goTo("contact")} style={{marginTop:36,background:"#C8392B",color:"white",padding:"14px 32px",border:"none",borderRadius:2,fontSize:".88rem",fontWeight:500,textTransform:"uppercase",letterSpacing:1,cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="#9B2335"} onMouseLeave={e=>e.currentTarget.style.background="#C8392B"}>Hablar con el equipo</button>
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

  {/* ═══ TESTIMONIAL ═══ */}
  <section style={{background:"#C8392B",color:"white",textAlign:"center",padding:"100px 80px"}}>
    <p className="pf rv" style={{fontStyle:"italic",fontSize:"clamp(1.6rem,2.8vw,2.8rem)",lineHeight:1.35,maxWidth:860,margin:"0 auto 36px"}}>"Con Sazon pasamos de 80 a 340 pedidos diarios en solo tres meses. Su equipo conoce cada detalle de las plataformas y sabe exactamente que palancas mover para crecer."</p>
    <p className="rv" style={{fontSize:".8rem",opacity:.65,textTransform:"uppercase",letterSpacing:2}}>Mauricio Aguila — Fundador · Mr Smash</p>
  </section>

  {/* ═══ PRICING ═══ */}
  <section id="pricing" className="sec" style={{padding:"110px 80px",background:"#EDE4CE"}}>
    <p className="rv" style={{fontSize:".7rem",fontWeight:500,textTransform:"uppercase",letterSpacing:3,color:"#C8392B",marginBottom:18}}>Planes y precios</p>
    <h2 className="pf rv" style={{fontSize:"clamp(2.2rem,3.5vw,3.4rem)",lineHeight:1.1}}>Inversion clara,<br/>resultados medibles.</h2>
    <p className="rv" style={{marginTop:18,maxWidth:500,fontSize:"1rem",lineHeight:1.7,color:"#5A4E3E"}}>Sin costos ocultos. Sin contratos de largo plazo. Pago mensual seguro.</p>
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
          {p.mpLink ? (
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <button onClick={()=>openPayment(p.mpLink)} style={{display:"block",width:"100%",textAlign:"center",padding:"14px",background:"#009EE3",color:"white",fontSize:".82rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"1.5px",cursor:"pointer",borderRadius:2,border:"none",fontFamily:"DM Sans,sans-serif",transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="#007DB3"} onMouseLeave={e=>e.currentTarget.style.background="#009EE3"}>💳 Pagar con Mercado Pago</button>
              <button onClick={()=>setChatOpen(true)} style={{display:"block",width:"100%",textAlign:"center",padding:"11px",border:p.dark?"1px solid rgba(255,255,255,.2)":"1px solid rgba(0,0,0,.2)",background:"transparent",fontSize:".78rem",color:p.dark?"rgba(255,255,255,.5)":"#5A4E3E",cursor:"pointer",fontFamily:"DM Sans,sans-serif",borderRadius:2}}>o consultar con Carlos →</button>
            </div>
          ) : !p.mpLink && p.name!=="Pro" ? (
            <div style={{padding:"12px",background:"rgba(0,0,0,.06)",borderRadius:2,fontSize:".78rem",color:p.dark?"rgba(255,255,255,.4)":"#5A4E3E",textAlign:"center"}}>Configura tu link de MP en Netlify</div>
          ) : (
            <button onClick={()=>setChatOpen(true)} style={{display:"block",width:"100%",textAlign:"center",padding:"15px",border:"1.5px solid #1A1A1A",background:"transparent",color:"#1A1A1A",fontSize:".82rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1.5px",cursor:"pointer",fontFamily:"DM Sans,sans-serif",borderRadius:2,transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.background="#1A1A1A";e.currentTarget.style.color="white";}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#1A1A1A";}}>Hablar con Carlos →</button>
          )}
        </div>
      ))}
    </div>
    <p className="rv" style={{textAlign:"center",marginTop:28,fontSize:".82rem",color:"#5A4E3E"}}>Todos los planes incluyen onboarding sin costo. Sin permanencia minima los primeros 30 dias.</p>
  </section>

  {/* ═══ WHY ═══ */}
  <section id="why" className="g2" style={{background:"#1A1A1A",display:"grid",gridTemplateColumns:"1fr 1fr"}}>
    <div className="sec rv" style={{padding:"110px 80px",borderRight:"1px solid rgba(255,255,255,.07)"}}>
      <p style={{fontSize:".7rem",fontWeight:500,textTransform:"uppercase",letterSpacing:3,color:"#D4A547",marginBottom:18}}>Resultados reales</p>
      <div className="pf" style={{fontSize:"clamp(5rem,10vw,9rem)",fontWeight:900,lineHeight:1,color:"white",marginBottom:20}}>+40<span style={{color:"#C8392B"}}>%</span></div>
      <p style={{fontSize:"1rem",lineHeight:1.7,color:"rgba(255,255,255,.45)",maxWidth:360}}>Incremento promedio en ventas en los primeros 90 dias de trabajo conjunto.</p>
      <div style={{marginTop:20,color:"rgba(255,255,255,.3)",fontSize:".78rem",textTransform:"uppercase",letterSpacing:"1.5px"}}>Basado en 16+ restaurantes activos</div>
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

  {/* ═══ CLIENTS ═══ */}
  <section id="clients" className="sec" style={{padding:"110px 80px",background:"#F5EFE0"}}>
    <p className="rv" style={{fontSize:".7rem",fontWeight:500,textTransform:"uppercase",letterSpacing:3,color:"#C8392B",marginBottom:18}}>Clientes</p>
    <h2 className="pf rv" style={{fontSize:"clamp(2.2rem,3.5vw,3.4rem)",lineHeight:1.1}}>Restaurantes que ya le<br/>pusieron sazon a su delivery.</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:2,marginTop:64}} className="g5">
      {clts.map((c,i)=>(
        <a key={i} href={c.url} target="_blank" rel="noreferrer" className="rv"
          style={{background:"#EDE4CE",padding:"32px 20px",textAlign:"center",transition:"background .2s, transform .2s",cursor:"pointer",display:"block",textDecoration:"none",color:"inherit"}}
          onMouseEnter={e=>{e.currentTarget.style.background="#1A1A1A";e.currentTarget.querySelector(".cn").style.color="white";e.currentTarget.style.transform="translateY(-4px)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="#EDE4CE";e.currentTarget.querySelector(".cn").style.color="#1A1A1A";e.currentTarget.style.transform="none";}}>
          <div style={{fontSize:"1.8rem",marginBottom:12}}>{c.ico}</div>
          <div className="cn" style={{fontSize:".82rem",fontWeight:500,transition:"color .2s",color:"#1A1A1A"}}>{c.n}</div>
          <div style={{fontSize:".68rem",marginTop:6,opacity:.45,transition:"opacity .2s"}}>Ver en Instagram ↗</div>
        </a>
      ))}
    </div>
  </section>

  {/* ═══ CONTACT ═══ */}
  <section id="contact" className="sec" style={{padding:"110px 80px",background:"#F5EFE0"}}>
    <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80}}>
      <div>
        <p className="rv" style={{fontSize:".7rem",fontWeight:500,textTransform:"uppercase",letterSpacing:3,color:"#C8392B",marginBottom:18}}>Contacto</p>
        <h2 className="pf rv" style={{fontSize:"clamp(2.2rem,3.5vw,3.4rem)",lineHeight:1.1}}>Listo para que tu<br/>delivery despegue?</h2>
        <div className="rv" style={{width:56,height:3,background:"#C8392B",margin:"28px 0"}}/>
        <p className="rv" style={{fontSize:"1rem",lineHeight:1.7,color:"#5A4E3E",maxWidth:380,marginBottom:32}}>Completa el formulario y nuestro equipo te contacta en menos de 24 horas para una sesion de diagnostico gratuita.</p>

        {/* ROI CALCULATOR */}
        <div className="rv" style={{background:"#EDE4CE",border:"1px solid rgba(0,0,0,.1)",padding:"24px 28px",marginBottom:32}}>
          <p style={{fontSize:".7rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"2px",color:"#C8392B",marginBottom:12}}>Calculadora de ROI</p>
          <p style={{fontSize:".8rem",color:"#5A4E3E",marginBottom:14,lineHeight:1.5}}><strong>Formula:</strong> pedidos x ticket x 28% = ingreso extra mensual</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            <div>
              <label style={lbl}>Pedidos/mes</label>
              <select name="pedidos" value={form.pedidos} onChange={hi} style={inp} onFocus={e=>e.target.style.borderColor="#C8392B"} onBlur={e=>e.target.style.borderColor="rgba(0,0,0,.12)"}>
                <option value="50-100">50 a 100</option><option value="100-300">100 a 300</option>
                <option value="300-1000">300 a 1000</option><option value="1000+">Mas de 1000</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Ticket promedio S/</label>
              <input type="number" name="ticket" value={form.ticket} onChange={hi} placeholder="Ej: 42" style={inp} onFocus={e=>e.target.style.borderColor="#C8392B"} onBlur={e=>e.target.style.borderColor="rgba(0,0,0,.12)"}/>
            </div>
          </div>
          <div style={{background:"#C8392B",color:"white",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:".78rem",textTransform:"uppercase",letterSpacing:"1px"}}>Crecimiento proyectado</span>
            <span className="pf" style={{fontSize:"1.6rem",fontWeight:700}}>S/ {roiM.toLocaleString()}/mes</span>
          </div>
          <p style={{fontSize:".72rem",color:"#5A4E3E",marginTop:8,textAlign:"right"}}>S/ {roiA.toLocaleString()} adicionales al año</p>
        </div>

        {/* CONTACT ACTIONS — sin numero visible */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <button onClick={()=>setChatOpen(true)} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"15px 28px",background:"#C8392B",color:"white",border:"none",borderRadius:2,fontSize:".88rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="#9B2335"} onMouseLeave={e=>e.currentTarget.style.background="#C8392B"}>
            <span>💬</span> Hablar con Carlos ahora
          </button>
          <a href={"mailto:"+CONTACT_EMAIL} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"14px 28px",border:"1.5px solid rgba(0,0,0,.18)",color:"#1A1A1A",borderRadius:2,fontSize:".88rem",fontWeight:500,textDecoration:"none",transition:"all .2s",textAlign:"center"}} onMouseEnter={e=>{e.currentTarget.style.background="#1A1A1A";e.currentTarget.style.color="white";}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#1A1A1A";}}>
            <span>📧</span> {CONTACT_EMAIL}
          </a>
        </div>
      </div>

      {/* FORM */}
      <div>
        {!formSent ? (
          <form className="rv" onSubmit={submitForm} style={{display:"flex",flexDirection:"column",gap:16}}>
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
            {[
              {l:"Plataformas activas",n:"plataformas",opts:["Solo Rappi","Rappi + PedidosYa","3 o mas plataformas","Ninguna aun"]},
              {l:"Plan de interes",n:"plan",opts:["Starter - S/890/mes","Growth - S/1,790/mes","Pro - Cotizacion","Quiero que me recomienden"]},
            ].map(f=>(
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
            {formErr&&<div style={{fontSize:".85rem",color:"#C8392B",padding:"10px 14px",background:"rgba(200,57,43,.08)",border:"1px solid rgba(200,57,43,.2)",borderRadius:2}}>{formErr}</div>}
            <button type="submit" style={{background:"#C8392B",color:"white",border:"none",padding:"18px 40px",fontSize:".85rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1.5px",cursor:"pointer",fontFamily:"DM Sans,sans-serif",alignSelf:"flex-start",borderRadius:2,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background="#9B2335"} onMouseLeave={e=>e.currentTarget.style.background="#C8392B"}>Solicitar diagnostico gratuito →</button>
            <p style={{fontSize:".75rem",color:"#5A4E3E"}}>Al enviar, nuestro equipo te contacta en menos de 24 horas.</p>
          </form>
        ) : (
          <div style={{padding:"48px 40px",background:"#EDE4CE",border:"1px solid rgba(0,0,0,.08)",textAlign:"center"}}>
            <div style={{fontSize:52,marginBottom:16}}>✅</div>
            <div className="pf" style={{fontSize:"1.8rem",fontWeight:700,marginBottom:10}}>Solicitud enviada.</div>
            <p style={{fontSize:"1rem",color:"#5A4E3E",lineHeight:1.7}}>Nuestro equipo te contactara en menos de 24 horas.</p>
            <button onClick={()=>setFormSent(false)} style={{marginTop:24,background:"none",border:"1.5px solid #1A1A1A",padding:"10px 24px",fontSize:".82rem",textTransform:"uppercase",letterSpacing:"1.5px",cursor:"pointer",fontFamily:"DM Sans,sans-serif",borderRadius:2}}>Enviar otro</button>
          </div>
        )}
      </div>
    </div>
  </section>

  {/* ═══ FOOTER ═══ */}
  <footer style={{background:"#2D2D2D",color:"rgba(255,255,255,.4)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"28px 80px",fontSize:".78rem",flexWrap:"wrap",gap:12}}>
    <div className="pf" style={{fontWeight:900,fontSize:"1.1rem",color:"white"}}>Saz<span style={{fontFamily:"DM Sans,sans-serif"}}>ó</span>n<span style={{color:"#C8392B"}}>.</span> Growth Partner</div>
    <div>2025 Sazon Growth Partner. Todos los derechos reservados.</div>
    <div style={{display:"flex",gap:24,alignItems:"center"}}>
      <a href={"mailto:"+CONTACT_EMAIL} style={{color:"rgba(255,255,255,.4)",textDecoration:"none",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="white"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.4)"}>{CONTACT_EMAIL}</a>
      {["Privacidad","Terminos"].map(l=><a key={l} href="#" style={{color:"rgba(255,255,255,.4)",textDecoration:"none",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="white"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.4)"}>{l}</a>)}
    </div>
  </footer>

  {/* ═══ CARLOS CHAT WIDGET ═══ */}
  <div className="cw">
    {chatOpen && (
      <div className="cwin">
        <div className="ch">
          <div className="cav">🌶️</div>
          <div style={{flex:1}}>
            <div style={{fontSize:".9rem",fontWeight:700,color:"white"}}>Carlos</div>
            <div style={{fontSize:".72rem",color:"rgba(255,255,255,.5)",display:"flex",alignItems:"center",gap:5}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#25D366",display:"inline-block"}}/>
              <span>Growth Executive · Sazon</span>
            </div>
          </div>
          <button onClick={()=>{setChatOpen(false);setChatHist([]);setApiHist([]);}} style={{background:"none",border:"none",color:"rgba(255,255,255,.5)",fontSize:"1.3rem",cursor:"pointer",lineHeight:1,padding:"0 4px"}}>×</button>
        </div>

        <div className="cm">
          {chatHist.map((m,i)=>(
            <div key={i} className={"mc" + (m.from==="user"?" u":"")}>
              {m.from==="carlos" && <div className="cav" style={{width:28,height:28,fontSize:".8rem"}}>🌶️</div>}
              <div className={"mb "+(m.from==="carlos"?"c":"u")}>
                {m.from==="carlos" ? <CarlosMsg text={m.text}/> : m.text}
              </div>
            </div>
          ))}
          {chatBusy && (
            <div className="mc">
              <div className="cav" style={{width:28,height:28,fontSize:".8rem"}}>🌶️</div>
              <div className="mb c" style={{display:"flex",gap:5,alignItems:"center",padding:"12px 14px"}}>
                <div className="dt"/><div className="dt"/><div className="dt"/>
              </div>
            </div>
          )}
          <div ref={endRef}/>
        </div>

        <div className="cinp">
          <textarea
            ref={inputRef}
            value={inputVal}
            onChange={e=>setInputVal(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Escribe tu pregunta aqui..."
            rows={1}
            disabled={chatBusy}
            style={{opacity:chatBusy?0.6:1}}
          />
          <button className="csend" onClick={sendMsg} disabled={chatBusy || !inputVal.trim()} title="Enviar (Enter)">→</button>
        </div>
      </div>
    )}

    <button className="cb" onClick={()=>setChatOpen(v=>!v)} title="Habla con Carlos">
      {chatOpen ? "×" : "💬"}
    </button>
    {!chatOpen && (
      <div style={{background:"#1A1A1A",color:"white",padding:"8px 14px",borderRadius:8,fontSize:".78rem",fontWeight:500,boxShadow:"0 4px 16px rgba(0,0,0,.2)",whiteSpace:"nowrap"}}>
        <span style={{color:"#D4A547"}}>Carlos</span> — te calcula el ROI gratis
      </div>
    )}
  </div>
  </>);
}
