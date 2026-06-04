const nodemailer = require("nodemailer");

exports.handler = async function(event) {
  // Only POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  // CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  try {
    const { code, to_email } = JSON.parse(event.body || "{}");

    // Validate
    if (!code || !to_email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing code or email" }) };
    }

    // Only allow the configured admin email
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "gc.asin.zapata@gmail.com";
    if (to_email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return { statusCode: 403, headers, body: JSON.stringify({ error: "Unauthorized" }) };
    }

    // Gmail credentials from Netlify env vars
    const GMAIL_USER = process.env.GMAIL_USER || ADMIN_EMAIL;
    const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD;

    if (!GMAIL_PASS) {
      return {
        statusCode: 500, headers,
        body: JSON.stringify({ error: "GMAIL_APP_PASSWORD no configurado en Netlify" })
      };
    }

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_PASS }
    });

    await transporter.sendMail({
      from: `"Sazón Admin" <${GMAIL_USER}>`,
      to: to_email,
      subject: `🔐 Código de acceso Admin: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 32px;">
          <div style="font-size: 1.5rem; font-weight: 900; margin-bottom: 4px;">
            Sazón<span style="color:#C8392B;">.</span>
          </div>
          <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 3px; color: #888; margin-bottom: 28px;">
            Admin · Código de acceso
          </div>
          <p style="font-size: 0.9rem; color: #444; margin-bottom: 20px;">
            Tu código de acceso al panel de administración es:
          </p>
          <div style="background: #0F0F0D; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <div style="font-size: 2.5rem; font-weight: 900; letter-spacing: 0.4em; color: #D4A547; font-family: monospace;">
              ${code}
            </div>
          </div>
          <p style="font-size: 0.78rem; color: #888; line-height: 1.6;">
            Válido por <strong>5 minutos</strong>.<br>
            Si no solicitaste este código, ignora este mensaje.
          </p>
          <div style="border-top: 1px solid #eee; margin-top: 24px; padding-top: 16px; font-size: 0.7rem; color: #aaa;">
            Sazón Growth Partner · sazonpartner.com
          </div>
        </div>
      `
    });

    return {
      statusCode: 200, headers,
      body: JSON.stringify({ success: true, message: "Código enviado correctamente" })
    };

  } catch (err) {
    console.error("send-otp error:", err);
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: "Error al enviar email: " + err.message })
    };
  }
};
