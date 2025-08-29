// Função serverless para envio de e-mail usando Nodemailer
// Implante em um provedor como Vercel. Configure as variáveis de ambiente:
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO (se quiser fixo)

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Método não permitido' });
        return;
    }

    try {
        const { name, email, subject, message } = req.body || {};

        if (!name || !email || !message) {
            res.status(400).json({ error: 'Campos obrigatórios ausentes (name, email, message).' });
            return;
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: Number(process.env.SMTP_PORT) === 465, // true para 465, false para outros
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Configuração de remetente: usa valores fixos informados pelo usuário,
        // caindo para SMTP_USER se o provedor exigir o mesmo remetente do login
        const FROM_NAME = process.env.FROM_NAME || 'Carlos Daniel';
        const FROM_EMAIL = process.env.FROM_EMAIL || 'carlosdanielpaulo0000@gmail.com';

        const DEFAULT_TO = process.env.MAIL_TO || 'carlosdanielpaulo0000@gmail.com';

        const mailOptions = {
            from: `${FROM_NAME} <${process.env.SMTP_USER || FROM_EMAIL}>`,
            to: DEFAULT_TO,
            replyTo: email,
            subject: subject && subject.trim() ? `[Portfólio - ${FROM_NAME}] ${subject}` : `[Portfólio - ${FROM_NAME}] Nova mensagem`,
            text: `Nome: ${name}\nEmail: ${email}\n\n${message}`,
            html: `<p><strong>Nome:</strong> ${name}</p>
                   <p><strong>Email:</strong> ${email}</p>
                   <p><strong>Mensagem:</strong></p>
                   <p>${String(message).replace(/\n/g, '<br/>')}</p>`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).json({ error: 'Erro interno ao enviar e-mail.' });
    }
};


