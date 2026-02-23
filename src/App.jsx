import { useState, useEffect } from "react";

const WA = import.meta.env.VITE_WHATSAPP_NUMBER || "51952363643";

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "",
    platforms: "Solo Rappi",
    orders: "100 - 300",
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
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
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
    if (!form.name.trim()) { setFormError("Escribe el nombre de tu restaurante"); return; }
    if (form.phone.replace(/\D/g, "").length < 9) {
      setFormError("Ingresa un WhatsApp valido (9 digitos)");
      return;
    }
    const orderMap = { "50 - 100": 75, "100 - 300": 200, "300 - 1000": 650, "Mas de 1000": 1000 };
    const pedidos = orderMap[form.orders] || 200;
    const ticket = parseFloat(form.ticket) || 40;
    const roi = Math.round(pedidos * ticket * 0.28 * 12).toLocaleString();
    const msg = encodeURIComponent(
      "Hola! Quiero crecer en delivery.\n\n" +
      "Restaurante: " + form.name + "\n" +
      "Plataformas: " + form.platforms + "\n" +
      "Pedidos/mes: " + form.orders + "\n" +
      "Ticket: S/" + (form.ticket || "?") + "\n" +
      "ROI estimado: S/" + roi + "/año\n\n" +
      "Me interesa el analisis gratuito."
    );
    window.open("https://wa.me/" + WA + "?text=" + msg, "_blank");
    setSent(true);
  }

  const C = {
    bg: "#120b04", bg2: "#1e1208", bg3: "#2a1a0c", bg4: "#321f10",
    txt: "#ede0c4", txt2: "#f5e8d0",
    muted: "rgba(237,224,196,.45)", dim: "rgba(237,224,196,.25)",
    border: "rgba(255,255,255,.07)", border2: "rgba(255,255,255,.13)",
    fire: "#e8420c", gold: "#eaaa30",
  };

  return (
    <>
      

      {/* NAV */}
      

        

          
🌶️

          Sazón Growth
        

        

          goTo("como")} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",fontFamily:"Syne,sans-serif"}}>Cómo funciona
          goTo("planes")} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",fontFamily:"Syne,sans-serif"}}>Planes
          goTo("formulario")} style={{padding:"10px 22px",borderRadius:100,background:"#e8420c",color:"white",border:"none",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"Syne,sans-serif"}}>Quiero crecer →
        

      


      {/* HERO */}
      

        

        
+38%

        

          Lima · Delivery
        

        

          

            Más pedidos.

            Menos comisión.

            Sin excusas.
          

          

            Gestionamos tu restaurante en Rappi, PedidosYa, Didi y Glovo para que crezcas 25–40% en los primeros 90 días. Sin contratos de permanencia.
          


          

            goTo("formulario")} style={{padding:"15px 34px",borderRadius:100,background:"#e8420c",color:"white",border:"none",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"Syne,sans-serif",boxShadow:"0 8px 32px rgba(232,66,12,.3)"}}>
              Calcular cuánto puedo crecer →
            
            goTo("como")} style={{padding:"13px 28px",borderRadius:100,border:"1.5px solid rgba(255,255,255,.2)",background:"transparent",color:C.muted,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"Syne,sans-serif"}}>
              Ver cómo funciona
            
          

        

        

          {[{n:"+38%",l:"pedidos en 3 meses"},{n:"-4pp",l:"comisión negociada"},{n:"16",l:"restaurantes activos"},{n:"<2min",l:"tiempo de respuesta"}].map((s,i)=>(
            

              
{s.n}

              
{s.l}

            

          ))}
        

      


      {/* MARQUEE */}
      

        

          {["Rappi","PedidosYa","Didi Food","Glovo","Optimización de menú","Negociación de comisiones","Campañas de crecimiento","Reportes automáticos","Rappi","PedidosYa","Didi Food","Glovo","Optimización de menú","Negociación de comisiones","Campañas de crecimiento","Reportes automáticos"].map((item,i)=>(
            
              {item}
            
          ))}
        

      


      {/* TESTIMONIOS */}
      

        

          

            
            Resultados reales
          

          

            Lo que dicen los restaurantes
que crecieron.
          

          
Números reales. Sin retoque. Restaurantes en Lima con 2 a 8 meses usando Sazón.


          

            {[
              {n:"+38%",m:"pedidos en 3 meses",q:"Pasamos de 280 a 412 pedidos al mes. Lograron bajar nuestra comisión con Rappi del 27% al 24%.",nm:"Marco Vargas",bz:"La Brasa del Barrio · Miraflores",ic:"🥩",d:""},
              {n:"4.8⭐",m:"rating en todas las plataformas",q:"Antes me enteraba de los problemas cuando ya era tarde. Ahora me avisan antes de que afecten los pedidos.",nm:"Lucía Mendoza",bz:"Green Bowl · San Isidro",ic:"🥗",d:"d1"},
              {n:"+24%",m:"pedidos en 5 meses",q:"Tardé 5 meses en decidirme. El análisis de mi menú solo valió el costo del primer mes.",nm:"Kenji Nakashima",bz:"Wok & Roll · Surco",ic:"🍜",d:"d2"},
            ].map((t,i)=>(
              

                

                
{t.n}

                
{t.m}

                
"{t.q}"


                

                  
{t.ic}

                  

                    
{t.nm}

                    
{t.bz}

                  

                

              

            ))}
          

        

      


      {/* COMO FUNCIONA */}
      

        

          

            

              
              Cómo funciona
            

            

              Resultados desde
la primera semana.
            

            
Sin reuniones eternas. Tú sigues cocinando, nosotros hacemos crecer los números.


            {[
              {n:"1",t:"Análisis gratuito en 24h",d:"Revisamos tu menú, métricas y competencia. Te decimos exactamente qué cambiaríamos y cuánto puedes crecer."},
              {n:"2",t:"Setup completo en 48 horas",d:"Conectamos tus plataformas y optimizamos fotos y descripciones. Sin que hagas nada técnico."},
              {n:"3",t:"Primera campaña esa misma semana",d:"Lanzamos una campaña de arranque para impulso inmediato mientras optimizamos la base."},
              {n:"4",t:"Reporte el 1° de cada mes",d:"PDF con todo lo que pasó y el plan del próximo mes. Sin tener que preguntar nada."},
            ].map((s,i)=>(
              

                

                  {s.n}
                

                

                  
{s.t}

                  
{s.d}

                

              

            ))}
          

          

            

              

                
Respuesta de Carlos

                
<2 min

                
24/7 activo

              

              

                

                  
🌶️

                  

                    
Carlos · Sazón

                    

                       en línea
                    

                  

                

                

                  {[
                    {t:"Hola! 👋 ¿En qué plataformas están?",out:false},
                    {t:"Solo Rappi, ~200 pedidos/mes",out:true},
                    {t:"Proyectamos 280–310 en 90 días. ¿Ticket promedio?",out:false},
                    {t:"Como S/42",out:true},
                    {t:"🎯 ~S/3,000 extra/mes. Plan Starter ideal. Te mando el link 👇",out:false},
                  ].map((m,i)=>(
                    
{m.t}

                  ))}
                

                

                  
Escribe...

                  
➤

                

              

              

                
Crecimiento promedio

                
+31%

                
en 90 días

              

            

          

        

      


      {/* PLANES */}
      

        

          

            
            Precios
          

          

            Sin contratos largos.
Sin letras pequeñas.
          

          
Mes a mes. Si en 90 días no creciste al menos 15%, te devolvemos el último mes.


          

            {[
              {name:"Starter",price:"890",plus:"+ 3% sobre el crecimiento generado",features:["1 plataforma de delivery","Análisis semanal de métricas","Optimización de menú e imágenes","2 campañas por mes","Reporte mensual automático","Gestión de reseñas negativas"],featured:false,d:""},
              {name:"Growth",price:"1,790",plus:"+ 2.5% sobre el crecimiento generado",features:["Todo Starter incluido","Hasta 4 plataformas","Negociación de comisiones","Campañas ilimitadas","KAM dedicada por WhatsApp","Dashboard en tiempo real"],featured:true,d:"d1"},
            ].map((p,i)=>(
              

                {p.featured&&
Más popular
}
                
{p.name}

                

                  S/{p.price}
                  /mes
                

                
{p.plus}

                

                

                  {p.features.map((f,j)=>(
                    

                      ✓{f}
                    

                  ))}
                

                goTo("formulario")} style={{width:"100%",padding:14,borderRadius:100,background:p.featured?"#e8420c":"transparent",border:p.featured?"none":`1.5px solid ${C.border2}`,color:p.featured?"white":C.muted,fontFamily:"Syne,sans-serif",fontSize:14,fontWeight:700,cursor:"pointer"}}>
                  Empezar con {p.name} →
                
              

            ))}
          

        

      


      {/* FORMULARIO */}
      

        

        

          

            

              
              Análisis gratuito
            

            

              Calcula cuánto
puedes crecer.
            

            

              Completa el formulario y en menos de 2 minutos recibes un WhatsApp con la proyección específica para tu restaurante.
            


            {[
              {ic:"⚡",t:"Respuesta en menos de 2 minutos",d:"Carlos analiza tu restaurante al instante y te manda el diagnóstico al WhatsApp."},
              {ic:"📊",t:"Proyección real con tus datos",d:"Calculamos con tu ticket, plataformas y benchmark de tu categoría."},
              {ic:"🔒",t:"Sin spam ni llamadas no solicitadas",d:"Solo recibirás el análisis. Si no quieres continuar, simplemente no respondas."},
            ].map((pr,i)=>(
              

                
{pr.ic}

                

                  
{pr.t}

                  
{pr.d}

                

              

            ))}
          

          

            {!sent?(
              

                
Tu análisis gratuito

                
Menos de 60 segundos para completarlo

                {[
                  {label:"Nombre del restaurante",name:"name",placeholder:"Ej: La Brasa del Barrio",type:"text"},
                  {label:"Tu WhatsApp",name:"phone",placeholder:"999 999 999",type:"tel"},
                ].map((f,i)=>(
                  

                    {f.label}
                    
{form[f.name]}

                  

                ))}
                

                  

                    Plataformas
                    
Solo Rappi

                  

                  

                    Pedidos/mes
                    
50 - 100

                  

                

                

                  Ticket promedio (soles)
                  
Ej: 45

                

                {formError&&
{formError}
}
                
                  Quiero mi análisis gratuito →
                
                
Carlos te contactará por WhatsApp en menos de 2 minutos.


              

            ):(
              

                
🌶️

                
¡Listo! Carlos ya está en camino.

                
Recibirás un WhatsApp en los próximos 2 minutos con tu proyección personalizada.


                
📱 Revisa tu WhatsApp

              

            )}
          

        

      


      {/* FOOTER */}
      

        

          
🌶️

          Sazón Growth
        

        

          {["Cómo funciona","Planes","Contacto"].map((l,i)=>(
            goTo(["como","planes","formulario"][i])} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",fontFamily:"Syne,sans-serif"}}>{l}
          ))}
        

        
Lima, Perú · sazonpartner.com

      

    
  );
}
