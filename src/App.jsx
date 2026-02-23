import { useState, useEffect } from "react";

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || "51952363643";

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    platforms: "Solo Rappi",
    orders: "100-300",
    ticket: "",
  });
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
      (entries) =>
        entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
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
    if (!form.name.trim()) {
      setFormError("Escribe el nombre de tu restaurante");
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 9) {
      setFormError("Ingresa un WhatsApp valido (9 digitos)");
      return;
    }
    const orderMap = {
      "50-100": 75,
      "100-300": 200,
      "300-1000": 650,
      "1000+": 1000,
    };
    const pedidos = orderMap[form.orders] || 200;
    const ticket = parseFloat(form.ticket) || 40;
    const roi = Math.round(pedidos * ticket * 0.28 * 12).toLocaleString();
    const msg = encodeURIComponent(
      "Hola! Quiero crecer en delivery.\n\n" +
        "Restaurante: " + form.name + "\n" +
        "Plataformas: " + form.platforms + "\n" +
        "Pedidos/mes: " + form.orders + "\n" +
        "Ticket: S/" + (form.ticket || "?") + "\n" +
        "ROI estimado: S/" + roi + "/anio\n\n" +
        "Me interesa el analisis gratuito."
    );
    window.open("https://wa.me/" + WA + "?text=" + msg, "_blank");
    setSent(true);
  }

  const bg = "#120b04";
  const bg2 = "#1e1208";
  const bg3 = "#2a1a0c";
  const bg4 = "#321f10";
  const txt = "#ede0c4";
  const txt2 = "#f5e8d0";
  const muted = "rgba(237,224,196,.45)";
  const dim = "rgba(237,224,196,.25)";
  const border = "rgba(255,255,255,.07)";
  const border2 = "rgba(255,255,255,.13)";
  const fire = "#e8420c";
  const gold = "#eaaa30";

  const Tag = ({ children }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 14,
      }}
    >
      <span
        style={{ width: 28, height: 1.5, background: fire, flexShrink: 0 }}
      />
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "3.5px",
          textTransform: "uppercase",
          color: fire,
        }}
      >
        {children}
      </span>
    </div>
  );

  const Label = ({ children }) => (
    <label
      style={{
        display: "block",
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: ".8px",
        textTransform: "uppercase",
        color: muted,
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );

  const stats = [
    { n: "+38%", l: "pedidos en 3 meses" },
    { n: "-4pp", l: "comision negociada" },
    { n: "16", l: "restaurantes activos" },
    { n: "<2min", l: "tiempo de respuesta" },
  ];

  const testimonios = [
    {
      n: "+38%",
      m: "pedidos en 3 meses",
      q: "Pasamos de 280 a 412 pedidos al mes. Lograron bajar nuestra comision con Rappi del 27% al 24%. Eso solo ya cubre lo que les pagamos.",
      nm: "Marco Vargas",
      bz: "La Brasa del Barrio - Miraflores",
      ic: "🥩",
    },
    {
      n: "4.8",
      m: "rating en todas las plataformas",
      q: "Antes me enteraba de los problemas cuando ya era tarde. Ahora me avisan antes de que afecten los pedidos.",
      nm: "Lucia Mendoza",
      bz: "Green Bowl - San Isidro",
      ic: "🥗",
    },
    {
      n: "+24%",
      m: "pedidos en 5 meses",
      q: "Tarde 5 meses en decidirme. El analisis de mi menu solo valio el costo del primer mes.",
      nm: "Kenji Nakashima",
      bz: "Wok & Roll - Surco",
      ic: "🍜",
    },
  ];

  const pasos = [
    {
      n: "1",
      t: "Analisis gratuito en 24h",
      d: "Revisamos tu menu, metricas y competencia. Te decimos exactamente que cambiaremos y cuanto puedes crecer.",
    },
    {
      n: "2",
      t: "Setup completo en 48 horas",
      d: "Conectamos tus plataformas y optimizamos fotos y descripciones. Sin que hagas nada tecnico.",
    },
    {
      n: "3",
      t: "Primera campana esa misma semana",
      d: "Lanzamos una campana de arranque para impulso inmediato mientras optimizamos la base.",
    },
    {
      n: "4",
      t: "Reporte el 1 de cada mes",
      d: "PDF con todo lo que paso y el plan del proximo mes. Sin tener que preguntar nada.",
    },
  ];

  const planes = [
    {
      name: "Starter",
      price: "890",
      plus: "+ 3% sobre el crecimiento generado",
      features: [
        "1 plataforma de delivery",
        "Analisis semanal de metricas",
        "Optimizacion de menu e imagenes",
        "2 campanas por mes",
        "Reporte mensual automatico",
        "Gestion de resenas negativas",
      ],
      featured: false,
    },
    {
      name: "Growth",
      price: "1,790",
      plus: "+ 2.5% sobre el crecimiento generado",
      features: [
        "Todo Starter incluido",
        "Hasta 4 plataformas",
        "Negociacion de comisiones",
        "Campanas ilimitadas",
        "KAM dedicada por WhatsApp",
        "Dashboard en tiempo real",
      ],
      featured: true,
    },
  ];

  const chatMsgs = [
    { t: "Hola! En que plataformas estan activos?", out: false },
    { t: "Solo Rappi, unos 200 pedidos/mes", out: true },
    { t: "Proyectamos 280-310 en 90 dias. Cual es tu ticket promedio?", out: false },
    { t: "Como S/42", out: true },
    { t: "Perfecto. Son ~S/3,000 extra/mes. Plan Starter ideal. Te mando el link", out: false },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,600&family=Syne:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Syne', sans-serif; background: #120b04; color: #ede0c4; overflow-x: hidden; }
        .sf { font-family: 'Cormorant Garamond', serif !important; }
        .reveal { opacity: 0; transform: translateY(20px); transition: opacity .7s, transform .7s; }
        .reveal.visible { opacity: 1; transform: none; }
        .d1 { transition-delay: .12s; }
        .d2 { transition-delay: .22s; }
        .d3 { transition-delay: .32s; }
        @keyframes mq { to { transform: translateX(-50%); } }
        .mq { display: flex; white-space: nowrap; animation: mq 26s linear infinite; width: max-content; }
        @keyframes glow { 0%,100% { box-shadow: 0 0 0 0 rgba(232,66,12,.5); } 50% { box-shadow: 0 0 0 10px rgba(232,66,12,0); } }
        .glow { animation: glow 3s ease-in-out infinite; }
        @keyframes ulanim { to { transform: scaleX(1); } }
        .ul::after { content: ''; position: absolute; bottom: -3px; left: 0; right: 0; height: 3px; background: #e8420c; border-radius: 9px; transform: scaleX(0); transform-origin: left; animation: ulanim 1s .9s cubic-bezier(.22,1,.36,1) forwards; }
        input, select { width: 100%; padding: 12px 16px; background: #2a1a0c; border: 1.5px solid rgba(245,230,200,.14); border-radius: 12px; color: #ede0c4; font-family: 'Syne', sans-serif; font-size: 14px; outline: none; transition: border-color .2s; -webkit-appearance: none; }
        input:focus, select:focus { border-color: rgba(232,66,12,.5); }
        input::placeholder { color: rgba(237,224,196,.3); }
        select option { background: #2a1a0c; }
        .hov { transition: transform .3s, border-color .3s; }
        .hov:hover { transform: translateY(-3px); }
        .hov .bar { transform: scaleX(0); transform-origin: left; transition: transform .35s; }
        .hov:hover .bar { transform: scaleX(1); }
        @media (max-width: 768px) {
          .nomob { display: none !important; }
          .gcol { grid-template-columns: 1fr !important; }
          .pmob { padding: 64px 24px !important; }
          .pnav { padding: 14px 24px !important; }
        }
      `}</style>

      {/* NAV */}
      <nav
        className="pnav"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: scrolled ? "12px 52px" : "20px 52px",
          background: scrolled ? "rgba(18,11,4,.92)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,.05)" : "none",
          transition: "all .3s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            className="glow"
            style={{ width: 32, height: 32, borderRadius: "50%", background: fire, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}
          >
            🌶️
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: txt }}>
            Sazon <span style={{ color: fire }}>Growth</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <button
            className="nomob"
            onClick={() => goTo("como")}
            style={{ background: "none", border: "none", color: muted, fontSize: 13, cursor: "pointer", fontFamily: "Syne, sans-serif" }}
          >
            Como funciona
          </button>
          <button
            className="nomob"
            onClick={() => goTo("planes")}
            style={{ background: "none", border: "none", color: muted, fontSize: 13, cursor: "pointer", fontFamily: "Syne, sans-serif" }}
          >
            Planes
          </button>
          <button
            onClick={() => goTo("formulario")}
            style={{ padding: "10px 22px", borderRadius: 100, background: fire, color: "white", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "Syne, sans-serif" }}
          >
            Quiero crecer
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="pmob"
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "110px 52px 70px", position: "relative", overflow: "hidden", background: bg }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.035, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(245,230,200,.6) 79px,rgba(245,230,200,.6) 80px),repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(245,230,200,.6) 79px,rgba(245,230,200,.6) 80px)" }} />
        <div
          className="sf nomob"
          style={{ position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)", fontSize: "clamp(160px,19vw,290px)", fontStyle: "italic", fontWeight: 700, lineHeight: 1, color: "transparent", WebkitTextStroke: "1px rgba(232,66,12,.09)", pointerEvents: "none", userSelect: "none" }}
        >
          +38%
        </div>
        <div style={{ position: "absolute", top: 130, left: 52 }}>
          <span style={{ padding: "5px 14px", borderRadius: 100, border: "1px solid rgba(232,66,12,.3)", background: "rgba(232,66,12,.1)", fontSize: 10, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#f07050" }}>
            Lima - Delivery
          </span>
        </div>
        <div className="reveal" style={{ position: "relative", zIndex: 1, maxWidth: 820 }}>
          <h1
            className="sf"
            style={{ fontSize: "clamp(50px,7vw,104px)", lineHeight: 1.02, fontWeight: 600, color: txt2, marginBottom: 24 }}
          >
            Mas pedidos.
            <br />
            Menos{" "}
            <em style={{ fontStyle: "italic", color: gold }}>comision.</em>
            <br />
            <span className="ul" style={{ color: fire, fontStyle: "normal", fontWeight: 700, position: "relative" }}>
              Sin excusas.
            </span>
          </h1>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.75, maxWidth: 500, marginBottom: 40 }}>
            Gestionamos tu restaurante en Rappi, PedidosYa, Didi y Glovo para que crezcas 25-40% en los primeros 90 dias. Sin contratos de permanencia.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={() => goTo("formulario")}
              style={{ padding: "15px 34px", borderRadius: 100, background: fire, color: "white", border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "Syne, sans-serif", boxShadow: "0 8px 32px rgba(232,66,12,.3)" }}
            >
              Calcular cuanto puedo crecer
            </button>
            <button
              onClick={() => goTo("como")}
              style={{ padding: "13px 28px", borderRadius: 100, border: "1.5px solid rgba(255,255,255,.2)", background: "transparent", color: muted, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Syne, sans-serif" }}
            >
              Ver como funciona
            </button>
          </div>
        </div>
        <div
          className="reveal d1"
          style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", marginTop: 52, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,.07)" }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{ paddingRight: 32, marginRight: 32, borderRight: i < 3 ? "1px solid rgba(255,255,255,.08)" : "none" }}
            >
              <div className="sf" style={{ fontStyle: "italic", fontWeight: 700, fontSize: 34, lineHeight: 1, color: fire, marginBottom: 4 }}>
                {s.n}
              </div>
              <div style={{ fontSize: 11, color: dim }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", borderBottom: "1px solid rgba(255,255,255,.06)", padding: "12px 0", background: bg2, overflow: "hidden" }}>
        <div className="mq">
          {[
            "Rappi", "PedidosYa", "Didi Food", "Glovo",
            "Optimizacion de menu", "Negociacion de comisiones",
            "Campanas de crecimiento", "Reportes automaticos",
            "Rappi", "PedidosYa", "Didi Food", "Glovo",
            "Optimizacion de menu", "Negociacion de comisiones",
            "Campanas de crecimiento", "Reportes automaticos",
          ].map((item, i) => (
            <span
              key={i}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "0 28px", fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: dim }}
            >
              {item}
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(232,66,12,.5)", flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </div>

      {/* TESTIMONIOS */}
      <section className="pmob" style={{ padding: "96px 52px", background: bg2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal"><Tag>Resultados reales</Tag></div>
          <h2 className="sf reveal" style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 600, lineHeight: 1.1, color: txt2, marginBottom: 10 }}>
            Lo que dicen los restaurantes
            <br />
            que <em style={{ fontStyle: "italic", color: gold }}>crecieron.</em>
          </h2>
          <p className="reveal d1" style={{ fontSize: 15, color: muted, lineHeight: 1.7, maxWidth: 480, marginBottom: 52 }}>
            Numeros reales. Sin retoque. Restaurantes en Lima con 2 a 8 meses usando Sazon.
          </p>
          <div className="gcol" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {testimonios.map((t, i) => (
              <div
                key={i}
                className={`reveal hov d${i}`}
                style={{ background: bg3, border: "1px solid rgba(255,255,255,.07)", borderRadius: 20, padding: 28, position: "relative", overflow: "hidden" }}
              >
                <div className="bar" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#e8420c,#d49018)" }} />
                <div className="sf" style={{ fontStyle: "italic", fontWeight: 700, fontSize: 46, lineHeight: 1, color: fire, marginBottom: 4 }}>{t.n}</div>
                <div style={{ fontSize: 12, color: muted, marginBottom: 18 }}>{t.m}</div>
                <p className="sf" style={{ fontStyle: "italic", fontSize: 15, color: "rgba(237,224,196,.75)", lineHeight: 1.7, marginBottom: 18 }}>"{t.q}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.06)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: bg4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{t.ic}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{t.nm}</div>
                    <div style={{ fontSize: 11, color: muted }}>{t.bz}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como" className="pmob" style={{ padding: "96px 52px" }}>
        <div className="gcol" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div className="reveal"><Tag>Como funciona</Tag></div>
            <h2 className="sf reveal" style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 600, lineHeight: 1.1, color: txt2, marginBottom: 10 }}>
              Resultados desde
              <br />
              <em style={{ fontStyle: "italic", color: gold }}>la primera semana.</em>
            </h2>
            <p className="reveal d1" style={{ fontSize: 15, color: muted, lineHeight: 1.7, marginBottom: 44 }}>
              Sin reuniones eternas. Tu sigues cocinando, nosotros hacemos crecer los numeros.
            </p>
            {pasos.map((s, i) => (
              <div
                key={i}
                className={`reveal d${i}`}
                style={{ display: "flex", gap: 20, padding: "22px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,.06)" : "none" }}
              >
                <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <span className="sf" style={{ fontStyle: "italic", fontSize: 18, color: dim }}>{s.n}</span>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: txt2, marginBottom: 6 }}>{s.t}</div>
                  <div style={{ fontSize: 13, color: muted, lineHeight: 1.65 }}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Phone mockup */}
          <div className="reveal d2 nomob" style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", padding: "24px 48px" }}>
              <div style={{ position: "absolute", top: -8, right: -16, background: bg3, border: "1px solid rgba(255,255,255,.13)", borderRadius: 16, padding: "12px 16px", boxShadow: "0 20px 40px rgba(0,0,0,.4)", zIndex: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: muted, marginBottom: 2 }}>Respuesta de Carlos</div>
                <div className="sf" style={{ fontStyle: "italic", fontWeight: 700, fontSize: 22, lineHeight: 1, color: fire }}>menos de 2min</div>
                <div style={{ fontSize: 9, color: dim, marginTop: 2 }}>24/7 activo</div>
              </div>
              <div style={{ width: 238, background: bg3, border: "1px solid rgba(255,255,255,.13)", borderRadius: 32, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.5)" }}>
                <div style={{ background: "#1a3a22", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#e8420c,#d49018)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🌶️</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "white" }}>Carlos - Sazon</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "rgba(255,255,255,.5)" }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#25d366", display: "inline-block" }} />
                      {" "}en linea
                    </div>
                  </div>
                </div>
                <div style={{ background: "#e5ddd5", padding: "12px 10px", display: "flex", flexDirection: "column", gap: 7, minHeight: 240 }}>
                  {chatMsgs.map((m, i) => (
                    <div
                      key={i}
                      style={{ maxWidth: "88%", alignSelf: m.out ? "flex-end" : "flex-start", background: m.out ? "#d9fdd3" : "white", borderRadius: m.out ? "10px 10px 0 10px" : "0 10px 10px 10px", padding: "8px 11px", fontSize: 11.5, color: "#111", lineHeight: 1.55 }}
                    >
                      {m.t}
                    </div>
                  ))}
                </div>
                <div style={{ background: "#f0f0f0", padding: "8px 12px", display: "flex", gap: 6, alignItems: "center" }}>
                  <div style={{ flex: 1, background: "white", borderRadius: 18, padding: "7px 12px", fontSize: 11, color: "#aaa" }}>Escribe...</div>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#25d366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>send</div>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: 10, left: -16, background: bg3, border: "1px solid rgba(255,255,255,.13)", borderRadius: 16, padding: "12px 16px", boxShadow: "0 20px 40px rgba(0,0,0,.4)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: muted, marginBottom: 2 }}>Crecimiento promedio</div>
                <div className="sf" style={{ fontStyle: "italic", fontWeight: 700, fontSize: 22, lineHeight: 1, color: fire }}>+31%</div>
                <div style={{ fontSize: 9, color: dim, marginTop: 2 }}>en 90 dias</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" className="pmob" style={{ padding: "96px 52px", background: bg2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal"><Tag>Precios</Tag></div>
          <h2 className="sf reveal" style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 600, lineHeight: 1.1, color: txt2, marginBottom: 10 }}>
            Sin contratos largos.
            <br />
            <em style={{ fontStyle: "italic", color: gold }}>Sin letras pequenas.</em>
          </h2>
          <p className="reveal d1" style={{ fontSize: 15, color: muted, lineHeight: 1.7, maxWidth: 480, marginBottom: 52 }}>
            Mes a mes. Si en 90 dias no creciste al menos 15%, te devolvemos el ultimo mes.
          </p>
          <div className="gcol" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 760 }}>
            {planes.map((p, i) => (
              <div
                key={i}
                className={`reveal d${i}`}
                style={{ background: p.featured ? bg4 : bg3, border: "1.5px solid " + (p.featured ? "rgba(232,66,12,.3)" : "rgba(255,255,255,.08)"), borderRadius: 22, padding: 34, position: "relative" }}
              >
                {p.featured && (
                  <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: fire, color: "white", padding: "3px 16px", borderRadius: 100, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>
                    Mas popular
                  </div>
                )}
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: muted, marginBottom: 10 }}>{p.name}</div>
                <div className="sf" style={{ fontStyle: "italic", fontWeight: 700, fontSize: 50, lineHeight: 1, color: txt2, marginBottom: 4 }}>
                  <sup style={{ fontSize: 20, verticalAlign: "top", marginTop: 12, fontStyle: "normal" }}>S/</sup>
                  {p.price}
                  <sub style={{ fontSize: 16, color: muted, fontStyle: "normal" }}>/mes</sub>
                </div>
                <div style={{ fontSize: 12, color: muted, marginBottom: 22 }}>{p.plus}</div>
                <div style={{ height: 1, background: border, marginBottom: 22 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", gap: 9, fontSize: 13, color: muted }}>
                      <span style={{ color: "#2d9e58", fontWeight: 800, flexShrink: 0 }}>v</span>
                      {f}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => goTo("formulario")}
                  style={{ width: "100%", padding: 14, borderRadius: 100, background: p.featured ? fire : "transparent", border: p.featured ? "none" : "1.5px solid " + border2, color: p.featured ? "white" : muted, fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                >
                  Empezar con {p.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section id="formulario" className="pmob" style={{ padding: "96px 52px", background: bg, position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(232,66,12,.3),rgba(212,144,24,.3),transparent)" }} />
        <div className="gcol" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 460px", gap: 80, alignItems: "start" }}>
          <div>
            <div className="reveal"><Tag>Analisis gratuito</Tag></div>
            <h2 className="sf reveal" style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 600, lineHeight: 1.1, color: txt2, marginBottom: 10 }}>
              Calcula cuanto
              <br />
              <em style={{ fontStyle: "italic", color: gold }}>puedes crecer.</em>
            </h2>
            <p className="reveal d1" style={{ fontSize: 15, color: muted, lineHeight: 1.7, maxWidth: 420, marginBottom: 44 }}>
              Completa el formulario y en menos de 2 minutos recibes un WhatsApp con la proyeccion especifica para tu restaurante.
            </p>
            {[
              { ic: "⚡", t: "Respuesta en menos de 2 minutos", d: "Carlos analiza tu restaurante al instante y te manda el diagnostico al WhatsApp." },
              { ic: "📊", t: "Proyeccion real con tus datos", d: "Calculamos con tu ticket, plataformas y benchmark de tu categoria." },
              { ic: "🔒", t: "Sin spam ni llamadas no solicitadas", d: "Solo recibiras el analisis. Si no quieres continuar, simplemente no respondas." },
            ].map((pr, i) => (
              <div key={i} className={`reveal d${i}`} style={{ display: "flex", gap: 14, marginBottom: 22 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(232,66,12,.1)", border: "1px solid rgba(232,66,12,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{pr.ic}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: txt2, marginBottom: 4 }}>{pr.t}</div>
                  <div style={{ fontSize: 12.5, color: muted, lineHeight: 1.6 }}>{pr.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal d2" style={{ background: bg2, border: "1.5px solid " + border2, borderRadius: 24, padding: 36, boxShadow: "0 40px 80px rgba(0,0,0,.3)", position: "sticky", top: 90 }}>
            {!sent ? (
              <form onSubmit={submit}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: txt2, marginBottom: 4, lineHeight: 1.2 }}>
                  Tu analisis gratuito
                </div>
                <div style={{ fontSize: 12.5, color: muted, marginBottom: 24 }}>Menos de 60 segundos para completarlo</div>
                <div style={{ marginBottom: 14 }}>
                  <Label>Nombre del restaurante</Label>
                  <input name="name" value={form.name} onChange={handleInput} placeholder="Ej: La Brasa del Barrio" type="text" />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <Label>Tu WhatsApp</Label>
                  <input name="phone" value={form.phone} onChange={handleInput} placeholder="999 999 999" type="tel" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  <div>
                    <Label>Plataformas</Label>
                    <select name="platforms" value={form.platforms} onChange={handleInput}>
                      <option value="Solo Rappi">Solo Rappi</option>
                      <option value="Rappi + PedidosYa">Rappi + PedidosYa</option>
                      <option value="3 o mas">3 o mas</option>
                    </select>
                  </div>
                  <div>
                    <Label>Pedidos/mes</Label>
                    <select name="orders" value={form.orders} onChange={handleInput}>
                      <option value="50-100">50 a 100</option>
                      <option value="100-300">100 a 300</option>
                      <option value="300-1000">300 a 1000</option>
                      <option value="1000+">Mas de 1000</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 6 }}>
                  <Label>Ticket promedio (soles)</Label>
                  <input name="ticket" value={form.ticket} onChange={handleInput} placeholder="Ej: 45" type="number" />
                </div>
                {formError && (
                  <div style={{ fontSize: 12, color: "#f07060", marginBottom: 8, padding: "8px 12px", background: "rgba(232,66,12,.08)", borderRadius: 8, border: "1px solid rgba(232,66,12,.2)" }}>
                    {formError}
                  </div>
                )}
                <button
                  type="submit"
                  style={{ width: "100%", marginTop: 8, padding: 15, borderRadius: 100, background: fire, color: "white", border: "none", fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 28px rgba(232,66,12,.3)" }}
                >
                  Quiero mi analisis gratuito
                </button>
                <p style={{ fontSize: 10.5, color: dim, textAlign: "center", marginTop: 10, lineHeight: 1.6 }}>
                  Carlos te contactara por WhatsApp en menos de 2 minutos.
                </p>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>🌶️</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: txt2, marginBottom: 8, lineHeight: 1.2 }}>
                  Listo! Carlos ya esta en camino.
                </div>
                <p style={{ fontSize: 14, color: muted, lineHeight: 1.7, marginBottom: 18 }}>
                  Recibiras un WhatsApp en los proximos 2 minutos con tu proyeccion personalizada.
                </p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 100, background: "rgba(37,211,102,.1)", border: "1px solid rgba(37,211,102,.2)", fontSize: 12, fontWeight: 700, color: "#50d080" }}>
                  Revisa tu WhatsApp
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 52px", borderTop: "1px solid rgba(255,255,255,.06)", background: bg2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 14 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: fire, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>🌶️</div>
          Sazon <span style={{ color: fire }}>Growth</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Como funciona", "Planes", "Contacto"].map((l, i) => (
            <button
              key={i}
              onClick={() => goTo(["como", "planes", "formulario"][i])}
              style={{ background: "none", border: "none", color: muted, fontSize: 12, cursor: "pointer", fontFamily: "Syne, sans-serif" }}
            >
              {l}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: dim }}>Lima, Peru - sazonpartner.com</div>
      </footer>
    </>
  );
}
