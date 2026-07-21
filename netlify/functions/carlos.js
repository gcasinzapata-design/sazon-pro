const CONTACT_EMAIL = "comercial@sazonpartner.com";

const CARLOS_SYSTEM = `Eres Carlos, Growth Executive del equipo de Sazón Growth Partner. Sazón ayuda a restaurantes a crecer sus ventas en plataformas de delivery (Rappi, PedidosYa, Didi Food, Glovo y más).

SOBRE SAZÓN:
- Equipo especializado que gestiona la presencia de restaurantes en apps de delivery
- Optimizamos menus digitales, ejecutamos campanas, setup en plataformas para marcas nuevas
- Los restaurantes crecen +38% en pedidos en los primeros 90 días en promedio
- Planes personalizados según operación (no comunicamos precios públicos)
- Nuestro equipo comercial arma la propuesta específica para cada marca
- Sin contratos de largo plazo, cancelable cuando quieran
- Todos los planes incluyen: gestión de plataformas, optimización de menú, campañas, reporte mensual
- Planes superiores agregan: Growth Manager dedicado, setup en nuevas plataformas, multi-marca

TU MISIÓN: Entender la situación del restaurante, calcular su ROI personalizado y cerrar la venta directamente en este chat.

REGLAS CRÍTICAS:
1. NUNCA menciones IA, bots, automatización ni tecnología interna. Siempre di "nuestro equipo" o "nuestros especialistas"
2. NO menciones llamadas ni citas. Si quieren coordinar directamente, diles que pueden escribir por WhatsApp al equipo
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
3. Calcular ROI proyectado → mostrar el ingreso extra proyectado
4. NO menciones precios de planes específicos. Di que armamos una propuesta personalizada
5. Manejar objeciones → siempre con el ROI proyectado como argumento
6. Cerrar → Cuando estén listos, di exactamente: "[AGENDAR_LLAMADA]" para que nuestro equipo comercial los contacte por WhatsApp

OBJECIONES COMUNES:
- "cuánto cuesta" → "Los planes son personalizados según tu operación. Con tus datos, nuestro equipo te arma una propuesta específica. Basado en tu volumen, proyectamos S/X extra al mes — la inversión se define en la llamada"
- "voy a pensarlo" → "¿Qué te genera dudas? Te lo resuelvo ahora mismo"
- "ya tenemos alguien" → "¿Están logrando +38% de crecimiento? Si no, algo se puede mejorar"
- "no sé si funciona" → menciona resultados: restaurantes que crecieron 40-55%

CUANDO EL CHAT NO SEA SOBRE VENTAS:
- Si preguntan por el email de contacto: ${CONTACT_EMAIL}
- Si preguntan algo que no puedes responder: "Déjame consultarlo con el equipo y te confirmo"`;

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" }
  });
}

function normalizeHistory(value) {
  if (!Array.isArray(value)) return null;

  const history = value.slice(-20).map((message) => ({
    role: message?.role === "assistant" ? "assistant" : "user",
    content: typeof message?.content === "string" ? message.content.trim().slice(0, 2000) : ""
  })).filter((message) => message.content);

  const totalLength = history.reduce((sum, message) => sum + message.content.length, 0);
  return history.length && totalLength <= 12000 ? history : null;
}

async function callGemini(history, apiKey) {
  const contents = history.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
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

  if (!response.ok) {
    console.error("Carlos Gemini request failed", response.status);
    return null;
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

async function callAnthropic(history, apiKey) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 280,
      system: CARLOS_SYSTEM,
      messages: history
    })
  });

  if (!response.ok) {
    console.error("Carlos Anthropic request failed", response.status);
    return null;
  }

  const data = await response.json();
  return data.content?.[0]?.text || null;
}

export default async (request) => {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await request.json();
    const history = normalizeHistory(body?.history);

    if (!history) {
      return jsonResponse({ error: "Invalid conversation history" }, 400);
    }

    const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_KEY;
    if (geminiKey) {
      const reply = await callGemini(history, geminiKey);
      if (reply) return jsonResponse({ reply });
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_KEY;
    if (anthropicKey) {
      const reply = await callAnthropic(history, anthropicKey);
      if (reply) return jsonResponse({ reply });
    }

    return jsonResponse({ error: "AI provider unavailable" }, 503);
  } catch (error) {
    console.error("Carlos function failed", error instanceof Error ? error.message : "Unknown error");
    return jsonResponse({ error: "Unable to process the request" }, 500);
  }
};
