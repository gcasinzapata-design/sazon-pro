// send-otp.js — Netlify Serverless Function
// Sends OTP code via EmailJS REST API (no npm packages needed)
// Env vars required in Netlify:
//   EMAILJS_PUBLIC_KEY   — Account → API Keys
//   EMAILJS_SERVICE_ID   — Email Services → Service ID
//   EMAILJS_TEMPLATE_ID  — Email Templates → Template ID

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };

  try {
    const { code, to_email } = JSON.parse(event.body || "{}");

    if (!code || !to_email) {
      return { statusCode: 400, headers,
        body: JSON.stringify({ error: "Missing code or email" }) };
    }

    const ADMIN_EMAIL   = process.env.ADMIN_EMAIL    || "gc.asin.zapata@gmail.com";
    const PUBLIC_KEY    = process.env.EMAILJS_PUBLIC_KEY;
    const SERVICE_ID    = process.env.EMAILJS_SERVICE_ID;
    const TEMPLATE_ID   = process.env.EMAILJS_TEMPLATE_ID;

    if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
      return { statusCode: 500, headers,
        body: JSON.stringify({
          error: "Faltan variables de entorno en Netlify: EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID"
        })
      };
    }

    if (to_email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return { statusCode: 403, headers,
        body: JSON.stringify({ error: "Email no autorizado" }) };
    }

    // Call EmailJS REST API — no npm needed
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    if (response.ok) {
      return { statusCode: 200, headers,
        body: JSON.stringify({ success: true }) };
    } else {
      const errText = await response.text();
      console.error("EmailJS error:", errText);
      return { statusCode: 500, headers,
        body: JSON.stringify({ error: "EmailJS error: " + errText }) };
    }

  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, headers,
      body: JSON.stringify({ error: err.message }) };
  }
};
