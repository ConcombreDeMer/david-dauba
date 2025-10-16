const nodemailer = require('nodemailer');

// Helper to set CORS headers for Vercel serverless functions
function setCors(res) {
  const origin = process.env.CORS_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  setCors(res);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  // Basic env validation to fail fast in serverless environment
  const missing = [];
  ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'EMAIL_TO'].forEach((k) => {
    if (!process.env[k]) missing.push(k);
  });
  if (missing.length) {
    console.error('Missing env vars for send-email:', missing.join(', '));
    return res.status(500).json({ error: `Server misconfiguration: missing ${missing.join(', ')}` });
  }

  const port = parseInt(process.env.SMTP_PORT, 10) || 587;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // In serverless envs, don't use pooling by default
    pool: false,
    tls: {
      // allow self-signed certificates if explicitly opted-out
      rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false',
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`, // expéditeur visible
      replyTo: email, // pour que le photographe puisse répondre directement au client
      to: process.env.EMAIL_TO, // destinataire final
      subject: `Nouveau message via le site - ${name}`,
      text: message,
    });

    // Close transport to avoid keeping the lambda warm unnecessarily
    try {
      if (typeof transporter.close === 'function') transporter.close();
    } catch (e) {
      // ignore
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur envoi email :', err);
    try {
      if (typeof transporter.close === 'function') transporter.close();
    } catch (e) {
      // ignore
    }
    return res.status(500).json({ success: false, error: err && err.message ? err.message : String(err) });
  }
};