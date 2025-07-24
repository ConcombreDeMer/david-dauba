const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
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

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur envoi email :', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};