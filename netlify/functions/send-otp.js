// send-otp.js — Netlify Serverless Function (ESM)
// Uses EmailJS REST API — no npm packages needed
// Env vars in Netlify: EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };

  try {
    const body = JSON.parse(event.body || "{}");
    const { code, to_email } = body;

    if (!code || !to_email) {
      return { statusCode: 400, headers,
        body: JSON.stringify({ error: "Missing code or email" }) };
    }

    const ADMIN_EMAIL   = process.env.ADMIN_EMAIL     || "gc.asin.zapata@gmail.com";
    const PUBLIC_KEY    = process.env.EMAILJS_PUBLIC_KEY;
    const SERVICE_ID    = process.env.EMAILJS_SERVICE_ID;
    const TEMPLATE_ID   = process.env.EMAILJS_TEMPLATE_ID;

    if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
      return { statusCode: 500, headers,
        body: JSON.stringify({
          error: "Variables de entorno faltantes en Netlify. Agrega: EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID"
        })
      };
    }

    if (to_email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return { statusCode: 403, headers,
        body: JSON.stringify({ error: "Email no autorizado" }) };
    }

    // Call EmailJS REST API
    const ejsRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", "origin": "http://localhost" },
      body: JSON.stringify({
        service_id:  SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id:     PUBLIC_KEY,
        template_params: {
          to_email:   to_email,
          code:       code,
          admin_name: "Admin"
        }
      })
    });

    const ejsText = await ejsRes.text();

    if (ejsRes.ok) {
      return { statusCode: 200, headers,
        body: JSON.stringify({ success: true }) };
    } else {
      return { statusCode: 500, headers,
        body: JSON.stringify({ error: "EmailJS: " + ejsText }) };
    }

  } catch (err) {
    console.error("send-otp error:", err.message);
    return { statusCode: 500, headers,
      body: JSON.stringify({ error: err.message }) };
  }
};
