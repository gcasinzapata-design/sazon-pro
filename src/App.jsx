import { useState, useEffect, useRef } from "react";

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || "51952363643";

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name: "", restaurant: "", phone: "", platforms: "Solo Rappi", orders: "100-300", ticket: "", mensaje: "" });
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("vis"), Math.min(i * 60, 300));
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  function goTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function handleInput(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  }

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) { setFormError("Escribe tu nombre"); return; }
    if (!form.restaurant.trim()) { setFormError("Escribe el nombre de tu restaurante"); return; }
    if (form.phone.replace(/\D/g, "").length < 9) { setFormError("Ingresa un WhatsApp válido"); return; }
    const orderMap = { "50-100": 75, "100-300": 200, "300-1000": 650, "1000+": 1000 };
    const pedidos = orderMap[form.orders] || 200;
    const ticket = parseFloat(form.ticket) || 40;
    const extra = Math.round(pedidos * 0.28);
    const roi = Math.round(extra * ticket * 12).toLocaleString();
    const msg = encodeURIComponent(
      "Hola! Quiero hacer crecer mi delivery.\n\n" +
      "Nombre: " + form.name + "\n" +
      "Restaurante: " + form.restaurant + "\n" +
      "Plataformas: " + form.platforms + "\n" +
      "Pedidos/mes: " + form.orders + "\n" +
      "Ticket promedio: S/" + (form.ticket || "?") + "\n" +
      "ROI estimado: S/" + roi + " extra por año\n\n" +
      (form.mensaje ? "Mensaje: " + form.mensaje + "\n\n" : "") +
      "Me interesa el diagnóstico gratuito."
    );
    window.open("https://wa.me/" + WA + "?text=" + msg, "_blank");
    setSent(true);
  }

  const services = [
    { ico: "📊", t: "Gestión integral de plataformas", d: "Administramos tu presencia en Rappi, PedidosYa, Didi y Glovo. Configuración, operación diaria y soporte continuo." },
    { ico: "🤝", t: "Negociación con aplicativos", d: "Acceso directo a los equipos comerciales. Negociamos comisiones y condiciones exclusivas en tu nombre." },
    { ico: "🍽️", t: "Optimización de menú digital", d: "Rediseñamos tu carta para el canal online: fotos, descripciones persuasivas, precios ancla y estructura que incrementa el ticket." },
    { ico: "📣", t: "Campañas dentro de las food apps", d: "Planificamos y ejecutamos tus inversiones publicitarias para maximizar visibilidad y volumen de pedidos." },
    { ico: "📈", t: "Reportes y análisis de datos", d: "Dashboard mensual con métricas clave: ventas, conversión, calificaciones y benchmarks del sector." },
    { ico: "🗓️", t: "Plan comercial mensual", d: "Cada mes presentamos un plan de acción basado en los resultados del período anterior." },
  ];

  const steps = [
    { n: "01", t: "Diagnóstico profundo", d: "Auditamos tu operación en todas las plataformas. Detectamos qué frena tus ventas y dónde están las oportunidades sin explotar." },
    { n: "02", t: "Estrategia personalizada", d: "Diseñamos un plan a medida: pricing, menú digital, campañas y negociaciones. Cada acción respaldada en datos reales." },
    { n: "03", t: "Ejecución integral", d: "Un Growth Manager dedicado opera tu presencia en los aplicativos. Tú cocinas, nosotros hacemos que se venda." },
    { n: "04", t: "Mejora continua", d: "Medimos ticket, conversión y recompra. Ajustamos en tiempo real para maximizar resultados cada semana." },
  ];

  const planes = [
    {
      name: "Starter", price: "890", currency: "S/", period: "mes",
      tag: "Para restaurantes que quieren arrancar con el pie derecho",
      plus: "+ 3% sobre el crecimiento generado",
      features: ["Gestión de 1 plataforma", "Diagnóstico inicial", "Optimización básica de menú", "2 campañas por mes", "Reporte mensual de métricas", "Gestión de reseñas"],
      nofeatures: ["Growth Manager dedicado", "Negociación de comisiones"],
      featured: false, cta: "Empezar con Starter",
    },
    {
      name: "Growth", price: "1,790", currency: "S/", period: "mes",
      tag: "Para restaurantes que quieren escalar rápido",
      plus: "+ 2.5% sobre el crecimiento generado",
      features: ["Todo Starter incluido", "Hasta 4 plataformas", "Growth Manager dedicado", "Negociación de comisiones", "Campañas ilimitadas", "Dashboard en tiempo real", "Plan comercial mensual", "Soporte WhatsApp prioritario"],
      nofeatures: [],
      featured: true, cta: "Empezar con Growth",
    },
    {
      name: "Pro", price: "A medida", currency: "", period: "cotización",
      tag: "Para cadenas, multi-locales y dark kitchens",
      plus: "Condiciones personalizadas",
      features: ["Todo Growth incluido", "Locales ilimitados", "Equipo dedicado exclusivo", "Integración con POS y tech stack", "Estrategia de expansión", "Reunión semanal de seguimiento"],
      nofeatures: [],
      featured: false, cta: "Hablar con ventas",
    },
  ];

  const clients = [
    { ic: "🍣", n: "La Picada Cebichería" },
    { ic: "☕", n: "Buena Vista Café" },
    { ic: "🍪", n: "Puqui Cookies House" },
    { ic: "🍷", n: "Victoriano Taberna" },
    { ic: "🎂", n: "La Dosis Dulce" },
    { ic: "🍕", n: "Veggie Pizza" },
    { ic: "🥩", n: "Más Que Bueno" },
    { ic: "🍝", n: "Piacere Perú" },
    { ic: "🍳", n: "Cookery Perú" },
    { ic: "🥐", n: "Pancracia Panes" },
  ];

  const red = "#C8392B";
  const redDark = "#9B2335";
  const cream = "#F5EFE0";
  const creamDark = "#EDE4CE";
  const charcoal = "#1A1A1A";
  const charcoalMid = "#2D2D2D";
  const gold = "#D4A547";
  const textSoft = "#5A4E3E";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: #F5EFE0; color: #1A1A1A; overflow-x: hidden; }
        .pf { font-family: 'Playfair Display', serif !important; }
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity .65s ease, transform .65s ease; }
        .reveal.vis { opacity: 1; transform: none; }
        @keyframes fadeDown { from { opacity:0; transform:translateY(-14px); } to { opacity:1; transform:none; } }
        @keyframes ticker { to { transform: translateX(-50%); } }
        @keyframes pulse { 0%,100% { transform:translate(-50%,-50%) scale(1); opacity:1; } 50% { transform:translate(-50%,-50%) scale(1.2); opacity:.6; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } }
        input, select, textarea { font-family: 'DM Sans', sans-serif; font-size: .9rem; color: #1A1A1A; outline: none; }
        select option { background: #EDE4CE; }
        button { font-family: 'DM Sans', sans-serif; }
        @media (max-width: 900px) {
          .hide-mob { display: none !important; }
          .mob-col { grid-template-columns: 1fr !important; }
          .mob-pad { padding: 70px 24px !important; }
          .mob-nav { padding: 14px 24px !important; }
          .mob-wrap { flex-direction: column !important; text-align: center; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 60px",
        background: scrolled ? "rgba(245,239,224,.95)" : "rgba(245,239,224,.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(200,57,43,.15)",
        animation: "fadeDown .6s ease both",
      }} className="mob-nav">
        <div className="pf" style={{ fontSize: "1.3rem", fontWeight: 900, color: charcoal }}>
          Sazón<span style={{ color: red }}>.</span>
        </div>
        <div className="hide-mob" style={{ display: "flex", gap: 32, listStyle: "none" }}>
          {[["#how", "Cómo trabajamos"], ["#services", "Servicios"], ["#pricing", "Planes"], ["#clients", "Clientes"], ["#contact", "Contacto"]].map(([href, label]) => (
            <a key={href} href={href} style={{ fontSize: ".82rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "1.5px", color: charcoal, textDecoration: "none" }}>{label}</a>
          ))}
        </div>
        <a href="#contact" style={{ background: red, color: "white", padding: "11px 26px", fontSize: ".82rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "1.5px", textDecoration: "none" }}>
          Quiero crecer
        </a>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", background: charcoal, overflow: "hidden" }} className="mob-col">
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "140px 80px 100px", zIndex: 2 }} className="mob-pad">
          <p style={{ fontSize: ".75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "3px", color: gold, marginBottom: 28, animation: "fadeUp .8s .2s ease both", opacity: 0, animationFillMode: "both" }}>
            Growth Partner para Restaurantes · Lima
          </p>
          <h1 className="pf" style={{ fontSize: "clamp(2.8rem,5vw,5rem)", lineHeight: 1.05, color: "white", animation: "fadeUp .8s .35s ease both", opacity: 0, animationFillMode: "both" }}>
            Tu delivery,<br />al <em style={{ fontStyle: "italic", color: red }}>máximo</em><br />rendimiento.
          </h1>
          <p style={{ marginTop: 28, fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,.6)", maxWidth: 400, animation: "fadeUp .8s .5s ease both", opacity: 0, animationFillMode: "both" }}>
            Somos tu equipo especializado en hacer crecer tus ventas en Rappi, PedidosYa, Didi y Glovo. No somos consultores, somos tu partner real de crecimiento.
          </p>
          <div style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 48, flexWrap: "wrap", animation: "fadeUp .8s .65s ease both", opacity: 0, animationFillMode: "both" }}>
            <a href="#contact" style={{ background: red, color: "white", padding: "16px 36px", fontSize: ".9rem", fontWeight: 500, letterSpacing: "1px", textDecoration: "none", textTransform: "uppercase" }}>
              Agendar diagnóstico
            </a>
            <a href="#how" style={{ color: "rgba(255,255,255,.65)", fontSize: ".9rem", textDecoration: "none" }}>
              Cómo lo hacemos →
            </a>
          </div>
        </div>

        {/* Right - Stats */}
        <div style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }} className="hide-mob">
          <div style={{ position: "absolute", bottom: -30, right: -20, fontFamily: "'Playfair Display',serif", fontSize: "26vw", fontWeight: 900, lineHeight: 1, color: "rgba(255,255,255,.03)", pointerEvents: "none", userSelect: "none" }}>SZN</div>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 380, height: 380, background: "radial-gradient(circle,rgba(200,57,43,.3) 0%,transparent 70%)", borderRadius: "50%", animation: "pulse 4s ease-in-out infinite" }} />
          <div style={{ position: "relative", zIndex: 2, display: "flex", gap: 2, marginBottom: 60, animation: "fadeUp .9s .8s ease both", opacity: 0, animationFillMode: "both" }}>
            {[{ n: "+38%", l: "Ventas promedio" }, { n: "16", l: "Restaurantes activos" }, { n: "90d", l: "Para ver resultados" }].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", padding: "28px 32px", textAlign: "center", backdropFilter: "blur(8px)" }}>
                <strong className="pf" style={{ display: "block", fontSize: "2.2rem", fontWeight: 700, color: "white", marginBottom: 6 }}>{s.n}</strong>
                <span style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,.45)" }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOGOS BELT */}
      <div style={{ background: creamDark, borderTop: "1px solid rgba(0,0,0,.08)", borderBottom: "1px solid rgba(0,0,0,.08)", padding: "16px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 56, alignItems: "center", animation: "ticker 22s linear infinite", width: "max-content" }}>
          {["Rappi", "·", "PedidosYa", "·", "Didi Food", "·", "Glovo", "·", "Uber Eats", "·", "iFood", "·", "Deliveroo", "·", "Just Eat",
            "Rappi", "·", "PedidosYa", "·", "Didi Food", "·", "Glovo", "·", "Uber Eats", "·", "iFood", "·", "Deliveroo", "·", "Just Eat"].map((p, i) => (
            <span key={i} style={{ fontSize: ".75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "2px", color: textSoft, opacity: .65, whiteSpace: "nowrap" }}>{p}</span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: charcoal, padding: "110px 80px" }} className="mob-pad">
        <p className="reveal" style={{ fontSize: ".7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "3px", color: gold, marginBottom: 14 }}>Metodología</p>
        <h2 className="pf reveal" style={{ fontSize: "clamp(2rem,3.5vw,3.2rem)", lineHeight: 1.1, color: "white", marginBottom: 14 }}>La receta del<br />crecimiento en 4 pasos.</h2>
        <p className="reveal" style={{ maxWidth: 500, fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,.5)", marginBottom: 60 }}>Un proceso claro, medible y sin sorpresas. De la diagnosis al resultado.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }} className="mob-col">
          {steps.map((s, i) => (
            <div key={i} className="reveal" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.09)", padding: "44px 32px", position: "relative", overflow: "hidden", transition: "background .25s", cursor: "default" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(200,57,43,.12)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.04)"}
            >
              <div style={{ position: "absolute", bottom: -16, right: 14, fontFamily: "'Playfair Display',serif", fontSize: "8rem", fontWeight: 900, color: "rgba(255,255,255,.04)", lineHeight: 1, pointerEvents: "none" }}>{s.n}</div>
              <p style={{ fontSize: ".75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "2px", color: red, marginBottom: 20 }}>{s.n} - {i === 0 ? "Analizamos" : i === 1 ? "Diagnosticamos" : i === 2 ? "Ejecutamos" : "Optimizamos"}</p>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 500, color: "white", marginBottom: 12 }}>{s.t}</h3>
              <p style={{ fontSize: ".87rem", lineHeight: 1.7, color: "rgba(255,255,255,.55)" }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ background: cream, padding: "110px 80px" }} className="mob-pad">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }} className="mob-col">
          <div style={{ position: "sticky", top: 120 }}>
            <p className="reveal" style={{ fontSize: ".7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "3px", color: red, marginBottom: 14 }}>Servicios</p>
            <h2 className="pf reveal" style={{ fontSize: "clamp(2rem,3vw,3rem)", lineHeight: 1.1, color: charcoal, marginBottom: 0 }}>Todo lo que tu delivery necesita,<br />en un solo lugar.</h2>
            <div className="reveal" style={{ width: 56, height: 3, background: red, margin: "24px 0" }} />
            <p className="reveal" style={{ fontSize: "1rem", lineHeight: 1.7, color: textSoft, marginBottom: 32 }}>No somos una agencia. Somos expertos en el ecosistema de food apps con relaciones directas con sus equipos comerciales.</p>
            <a href="#contact" style={{ background: red, color: "white", padding: "14px 32px", fontSize: ".85rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "1px", textDecoration: "none", display: "inline-block" }}>
              Hablar con un experto
            </a>
          </div>
          <div>
            {services.map((s, i) => (
              <div key={i} className="reveal" style={{ display: "grid", gridTemplateColumns: "64px 1fr", borderTop: "1px solid rgba(0,0,0,.1)", padding: "32px 0", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.querySelector(".svc-ico").style.background = red; e.currentTarget.querySelector(".svc-ico").style.color = "white"; }}
                onMouseLeave={e => { e.currentTarget.querySelector(".svc-ico").style.background = "transparent"; e.currentTarget.querySelector(".svc-ico").style.color = red; }}
              >
                <div className="svc-ico" style={{ width: 44, height: 44, border: "1.5px solid " + red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", color: red, marginTop: 2, transition: "all .2s", flexShrink: 0 }}>{s.ico}</div>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 500, marginBottom: 8, color: charcoal }}>{s.t}</h3>
                  <p style={{ fontSize: ".87rem", lineHeight: 1.7, color: textSoft }}>{s.d}</p>
                </div>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(0,0,0,.1)" }} />
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section style={{ background: red, color: "white", textAlign: "center", padding: "100px 80px" }} className="mob-pad">
        <p className="pf reveal" style={{ fontStyle: "italic", fontSize: "clamp(1.5rem,2.8vw,2.6rem)", lineHeight: 1.35, maxWidth: 840, margin: "0 auto 32px" }}>
          "Con Sazón pasamos de 280 a 412 pedidos al mes. Lograron bajar nuestra comisión con Rappi del 27% al 24%. Eso solo ya cubre lo que les pagamos."
        </p>
        <p style={{ fontSize: ".8rem", opacity: .65, textTransform: "uppercase", letterSpacing: "2px" }}>Marco Vargas - La Brasa del Barrio · Miraflores, Lima</p>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ background: creamDark, padding: "110px 80px" }} className="mob-pad">
        <p className="reveal" style={{ fontSize: ".7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "3px", color: red, marginBottom: 14 }}>Planes y precios</p>
        <h2 className="pf reveal" style={{ fontSize: "clamp(2rem,3.5vw,3.2rem)", lineHeight: 1.1, color: charcoal, marginBottom: 14 }}>Inversión clara,<br />resultados medibles.</h2>
        <p className="reveal" style={{ maxWidth: 500, fontSize: "1rem", lineHeight: 1.7, color: textSoft, marginBottom: 60 }}>Sin costos ocultos. Sin contratos de largo plazo. Elige el plan que se adapta a tu operación.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }} className="mob-col">
          {planes.map((p, i) => (
            <div key={i} className="reveal" style={{ background: p.featured ? charcoal : cream, padding: "44px 38px", border: "1px solid " + (p.featured ? "transparent" : "rgba(0,0,0,.08)"), position: "relative", transition: "transform .2s" }}
              onMouseEnter={e => { if (!p.featured) e.currentTarget.style.transform = "translateY(-6px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
            >
              {p.featured && (
                <div style={{ position: "absolute", top: -14, left: 38, background: red, color: "white", fontSize: ".68rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "1.5px", padding: "5px 14px" }}>Más popular</div>
              )}
              <div className="pf" style={{ fontSize: "1.5rem", fontWeight: 700, color: p.featured ? "white" : charcoal, marginBottom: 6 }}>{p.name}</div>
              <p style={{ fontSize: ".82rem", color: p.featured ? "rgba(255,255,255,.5)" : textSoft, marginBottom: 28 }}>{p.tag}</p>
              {p.currency ? (
                <div className="pf" style={{ fontSize: "2.6rem", fontWeight: 900, lineHeight: 1, color: p.featured ? "white" : charcoal, marginBottom: 2 }}>
                  <sup style={{ fontSize: "1.2rem", verticalAlign: "top", marginTop: 10, fontStyle: "normal" }}>{p.currency}</sup>{p.price}
                </div>
              ) : (
                <div className="pf" style={{ fontSize: "2.2rem", fontWeight: 900, lineHeight: 1, color: p.featured ? "white" : charcoal, marginBottom: 2 }}>{p.price}</div>
              )}
              <p style={{ fontSize: ".78rem", color: p.featured ? "rgba(255,255,255,.4)" : textSoft, marginBottom: 6 }}>/{p.period}</p>
              <p style={{ fontSize: ".78rem", color: p.featured ? "rgba(255,255,255,.5)" : red, marginBottom: 30, fontWeight: 500 }}>{p.plus}</p>
              <div style={{ height: 1, background: p.featured ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.07)", marginBottom: 28 }} />
              <ul style={{ listStyle: "none", marginBottom: 36 }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ fontSize: ".87rem", padding: "10px 0", borderBottom: "1px solid " + (p.featured ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.06)"), display: "flex", gap: 12, color: p.featured ? "rgba(255,255,255,.75)" : charcoal }}>
                    <span style={{ color: red, fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
                {p.nofeatures.map((f, j) => (
                  <li key={"no" + j} style={{ fontSize: ".87rem", padding: "10px 0", borderBottom: "1px solid " + (p.featured ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.06)"), display: "flex", gap: 12, color: "rgba(0,0,0,.25)" }}>
                    <span style={{ flexShrink: 0 }}>-</span>{f}
                  </li>
                ))}
              </ul>
              <a href="#contact" style={{ display: "block", textAlign: "center", textDecoration: "none", padding: "14px", border: "1.5px solid " + (p.featured ? red : charcoal), fontSize: ".82rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "1.5px", color: p.featured ? "white" : charcoal, background: p.featured ? red : "transparent" }}>
                {p.cta} →
              </a>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", marginTop: 24, fontSize: ".82rem", color: textSoft }}>✦ Todos los planes incluyen onboarding sin costo. Si en 90 días no creciste al menos 15%, te devolvemos el último mes.</p>
      </section>

      {/* WHY */}
      <section id="why" style={{ background: charcoal, display: "grid", gridTemplateColumns: "1fr 1fr", padding: 0 }} className="mob-col">
        <div style={{ padding: "110px 80px", borderRight: "1px solid rgba(255,255,255,.07)" }} className="mob-pad reveal">
          <p style={{ fontSize: ".7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "3px", color: gold, marginBottom: 18 }}>Resultados reales</p>
          <div className="pf" style={{ fontSize: "clamp(5rem,10vw,8.5rem)", fontWeight: 900, lineHeight: 1, color: "white", marginBottom: 18 }}>
            +38<span style={{ color: red }}>%</span>
          </div>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,.45)", maxWidth: 380, marginBottom: 14 }}>
            Incremento promedio en ventas que logran nuestros clientes en los primeros 90 días de trabajo conjunto.
          </p>
          <p style={{ fontSize: ".78rem", color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: "1.5px" }}>Basado en 16+ restaurantes en Lima</p>
        </div>
        <div style={{ padding: "110px 80px" }} className="mob-pad">
          <p className="reveal" style={{ fontSize: ".7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "3px", color: gold, marginBottom: 14 }}>Por qué Sazón</p>
          <h2 className="pf reveal" style={{ fontSize: "clamp(2rem,3vw,3rem)", lineHeight: 1.1, color: "white", marginBottom: 14 }}>Los ingredientes<br />de nuestro éxito.</h2>
          <p className="reveal" style={{ fontSize: ".95rem", lineHeight: 1.7, color: "rgba(255,255,255,.45)", marginBottom: 40 }}>Expertise, datos y acceso directo a las plataformas.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { ic: "🔬", t: "Expertise en Foodtech", d: "Conocemos los algoritmos de cada plataforma, sus temporadas y las palancas que realmente mueven los números." },
              { ic: "📡", t: "Data-Driven al 100%", d: "Cada decisión se basa en métricas. Solo acciones que generan ROI comprobable." },
              { ic: "🤝", t: "Acceso directo a las APPs", d: "Relaciones directas con Rappi, PedidosYa y Didi. Accedes a beneficios y condiciones exclusivas." },
              { ic: "📋", t: "Transparencia total", d: "Reportes claros, seguimiento constante y acceso completo a todos tus datos. Sin sorpresas." },
            ].map((pi, i) => (
              <div key={i} className="reveal" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", padding: "22px 26px", display: "flex", gap: 20, alignItems: "flex-start", transition: "background .2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(200,57,43,.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.04)"}
              >
                <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{pi.ic}</span>
                <div>
                  <h4 style={{ fontSize: ".95rem", fontWeight: 500, color: "white", marginBottom: 5 }}>{pi.t}</h4>
                  <p style={{ fontSize: ".84rem", color: "rgba(255,255,255,.42)", lineHeight: 1.6 }}>{pi.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section id="clients" style={{ background: cream, padding: "110px 80px" }} className="mob-pad">
        <p className="reveal" style={{ fontSize: ".7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "3px", color: red, marginBottom: 14 }}>Clientes</p>
        <h2 className="pf reveal" style={{ fontSize: "clamp(2rem,3.5vw,3.2rem)", lineHeight: 1.1, color: charcoal, marginBottom: 60 }}>Restaurantes que ya le<br />pusieron sazón a su delivery.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 2 }} className="mob-col">
          {clients.map((c, i) => (
            <div key={i} className="reveal" style={{ background: creamDark, padding: "28px 16px", textAlign: "center", transition: "background .2s", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.background = charcoal; e.currentTarget.querySelector(".cn").style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.background = creamDark; e.currentTarget.querySelector(".cn").style.color = charcoal; }}
            >
              <div style={{ fontSize: "1.7rem", marginBottom: 10 }}>{c.ic}</div>
              <div className="cn" style={{ fontSize: ".8rem", fontWeight: 500, color: charcoal, transition: "color .2s" }}>{c.n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT / FORM */}
      <section id="contact" style={{ background: cream, padding: "110px 80px" }} className="mob-pad">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }} className="mob-col">
          <div>
            <p className="reveal" style={{ fontSize: ".7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "3px", color: red, marginBottom: 14 }}>Contacto</p>
            <h2 className="pf reveal" style={{ fontSize: "clamp(2rem,3.5vw,3.2rem)", lineHeight: 1.1, color: charcoal }}>¿Listo para que<br />tu delivery despegue?</h2>
            <div className="reveal" style={{ width: 56, height: 3, background: red, margin: "24px 0" }} />
            <p className="reveal" style={{ fontSize: "1rem", lineHeight: 1.7, color: textSoft, maxWidth: 420, marginBottom: 32 }}>
              Completa el formulario y calcularemos el ROI estimado para tu restaurante. Carlos te responde en menos de 2 minutos por WhatsApp.
            </p>
            <div style={{ fontSize: ".82rem", color: textSoft, marginTop: 8 }}>
              <p style={{ marginBottom: 12, fontSize: ".78rem", textTransform: "uppercase", letterSpacing: "1.5px", color: red, fontWeight: 500 }}>¿Cómo calculamos el ROI?</p>
              <p style={{ lineHeight: 1.7, color: textSoft }}>
                Tomamos tus pedidos actuales × tu ticket promedio × 28% de crecimiento proyectado × 12 meses. Eso es el ingreso extra anual que proyectamos para tu restaurante. El 28% es el crecimiento promedio real de nuestros clientes en los primeros 90 días.
              </p>
            </div>
            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { ic: "📱", label: "WhatsApp", val: "+51 952 363 643", href: "https://wa.me/51952363643" },
                { ic: "📍", label: "Ubicación", val: "Lima, Perú - Operamos en toda LATAM", href: null },
              ].map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "16px 0", borderTop: i === 0 ? "1px solid rgba(0,0,0,.08)" : "none", borderBottom: "1px solid rgba(0,0,0,.08)", marginTop: i === 0 ? 24 : 0 }}>
                  <span style={{ fontSize: "1.1rem" }}>{d.ic}</span>
                  {d.href ? <a href={d.href} style={{ color: charcoal, textDecoration: "none", fontSize: ".95rem" }}>{d.val}</a> : <span style={{ fontSize: ".95rem", color: charcoal }}>{d.val}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* FORM */}
          <div className="reveal">
            {!sent ? (
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {[
                    { label: "Nombre", name: "name", placeholder: "Tu nombre", type: "text" },
                    { label: "Restaurante", name: "restaurant", placeholder: "Nombre del local", type: "text" },
                  ].map((f) => (
                    <div key={f.name} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 500, color: textSoft }}>{f.label}</label>
                      <input name={f.name} value={form[f.name]} onChange={handleInput} placeholder={f.placeholder} type={f.type}
                        style={{ background: creamDark, border: "1px solid rgba(0,0,0,.12)", padding: "13px 16px", borderRadius: 2, transition: "border-color .2s" }}
                        onFocus={e => e.target.style.borderColor = red} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,.12)"} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 500, color: textSoft }}>WhatsApp</label>
                  <input name="phone" value={form.phone} onChange={handleInput} placeholder="+51 999 999 999" type="tel"
                    style={{ background: creamDark, border: "1px solid rgba(0,0,0,.12)", padding: "13px 16px", borderRadius: 2, transition: "border-color .2s" }}
                    onFocus={e => e.target.style.borderColor = red} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,.12)"} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 500, color: textSoft }}>Plataformas</label>
                    <select name="platforms" value={form.platforms} onChange={handleInput} style={{ background: creamDark, border: "1px solid rgba(0,0,0,.12)", padding: "13px 16px", borderRadius: 2, cursor: "pointer", WebkitAppearance: "none" }}>
                      <option value="Solo Rappi">Solo Rappi</option>
                      <option value="Rappi + PedidosYa">Rappi + PedidosYa</option>
                      <option value="3 o más plataformas">3 o más plataformas</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 500, color: textSoft }}>Pedidos / mes</label>
                    <select name="orders" value={form.orders} onChange={handleInput} style={{ background: creamDark, border: "1px solid rgba(0,0,0,.12)", padding: "13px 16px", borderRadius: 2, cursor: "pointer", WebkitAppearance: "none" }}>
                      <option value="50-100">50 a 100</option>
                      <option value="100-300">100 a 300</option>
                      <option value="300-1000">300 a 1,000</option>
                      <option value="1000+">Más de 1,000</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 500, color: textSoft }}>Ticket promedio (soles)</label>
                  <input name="ticket" value={form.ticket} onChange={handleInput} placeholder="Ej: 45" type="number"
                    style={{ background: creamDark, border: "1px solid rgba(0,0,0,.12)", padding: "13px 16px", borderRadius: 2, transition: "border-color .2s" }}
                    onFocus={e => e.target.style.borderColor = red} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,.12)"} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 500, color: textSoft }}>Cuéntanos sobre tu operación (opcional)</label>
                  <textarea name="mensaje" value={form.mensaje} onChange={handleInput} placeholder="En qué plataformas estás, cuál es tu mayor desafío hoy..." rows={3}
                    style={{ background: creamDark, border: "1px solid rgba(0,0,0,.12)", padding: "13px 16px", borderRadius: 2, resize: "vertical", transition: "border-color .2s" }}
                    onFocus={e => e.target.style.borderColor = red} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,.12)"} />
                </div>
                {formError && (
                  <div style={{ fontSize: ".85rem", color: red, padding: "10px 14px", background: "rgba(200,57,43,.06)", border: "1px solid rgba(200,57,43,.2)" }}>{formError}</div>
                )}
                <button type="submit" style={{ background: red, color: "white", border: "none", padding: "17px 36px", fontSize: ".85rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "1.5px", cursor: "pointer", alignSelf: "flex-start" }}>
                  Enviar y calcular ROI →
                </button>
                <p style={{ fontSize: ".78rem", color: textSoft, opacity: .7 }}>Carlos te responde por WhatsApp en menos de 2 minutos con tu proyección personalizada.</p>
              </form>
            ) : (
              <div style={{ padding: "40px", background: creamDark, border: "1px solid rgba(0,0,0,.08)", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🌶️</div>
                <div className="pf" style={{ fontSize: "1.8rem", fontWeight: 700, color: charcoal, marginBottom: 10 }}>¡Listo! Mensaje enviado.</div>
                <p style={{ fontSize: ".95rem", color: textSoft, lineHeight: 1.7 }}>Carlos ya recibió tus datos y te contactará en menos de 2 minutos con la proyección de crecimiento para tu restaurante.</p>
                <div style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "rgba(37,211,102,.1)", border: "1px solid rgba(37,211,102,.3)", fontSize: ".85rem", fontWeight: 600, color: "#1a7a3c" }}>
                  📱 Revisa tu WhatsApp
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: charcoalMid, color: "rgba(255,255,255,.4)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 60px", fontSize: ".78rem", flexWrap: "wrap", gap: 12 }}>
        <div className="pf" style={{ fontWeight: 900, fontSize: "1.1rem", color: "white" }}>
          Sazón<span style={{ color: red }}>.</span> Growth Partner
        </div>
        <div>© 2025 Sazón. Todos los derechos reservados.</div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacidad", "Términos"].map((l) => (
            <a key={l} href="#" style={{ color: "rgba(255,255,255,.4)", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>
    </>
  );
}
