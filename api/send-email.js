// Função serverless para envio de e-mail usando Nodemailer
// Implante em um provedor como Vercel. Configure as variáveis de ambiente:
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO (se quiser fixo)

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Configurar CORS para permitir requisições do frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Método não permitido' });
        return;
    }

    try {
        const { name, email, subject, message } = req.body || {};

        // Validação dos campos
        if (!name || !email || !message) {
            res.status(400).json({ error: 'Campos obrigatórios ausentes (name, email, message).' });
            return;
        }

        // Verificar se as variáveis de ambiente estão configuradas
        const requiredEnvVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
        
        if (missingVars.length > 0) {
            console.error('Variáveis de ambiente ausentes:', missingVars);
            res.status(500).json({ 
                error: 'Configuração de e-mail não encontrada. Entre em contato com o administrador.' 
            });
            return;
        }

        // Configuração do transporter com logs detalhados
        const transporterConfig = {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            debug: true, // Ativa logs detalhados
            logger: true // Logs no console
        };

        console.log('Configuração SMTP:', {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            user: process.env.SMTP_USER,
            secure: transporterConfig.secure
        });

        const transporter = nodemailer.createTransport(transporterConfig);

        // Verificar conexão SMTP
        try {
            await transporter.verify();
            console.log('Conexão SMTP verificada com sucesso');
        } catch (verifyError) {
            console.error('Erro na verificação SMTP:', verifyError);
            res.status(500).json({ 
                error: 'Erro na configuração do servidor de e-mail. Tente novamente mais tarde.' 
            });
            return;
        }

        // Configuração de remetente
        const FROM_NAME = process.env.FROM_NAME || 'Carlos Daniel';
        const FROM_EMAIL = process.env.FROM_EMAIL || 'carlosdanielpaulo0000@gmail.com';
        const DEFAULT_TO = process.env.MAIL_TO || 'carlosdanielpaulo0000@gmail.com';

        const mailOptions = {
            from: `${FROM_NAME} <${process.env.SMTP_USER}>`,
            to: DEFAULT_TO,
            replyTo: email,
            subject: subject && subject.trim() ? `[Portfólio - ${FROM_NAME}] ${subject}` : `[Portfólio - ${FROM_NAME}] Nova mensagem`,
            text: `Nome: ${name}\nEmail: ${email}\n\n${message}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #8a2be2;">Nova mensagem do portfólio</h2>
                    <p><strong>Nome:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Assunto:</strong> ${subject || 'Não informado'}</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p><strong>Mensagem:</strong></p>
                    <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${String(message).replace(/\n/g, '<br/>')}</p>
                </div>
            `
        };

        console.log('Enviando e-mail para:', DEFAULT_TO);
        await transporter.sendMail(mailOptions);
        console.log('E-mail enviado com sucesso');
        
        res.status(200).json({ ok: true, message: 'E-mail enviado com sucesso!' });
    } catch (error) {
        console.error('Erro detalhado ao enviar e-mail:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode
        });
        
        // Mensagens de erro mais específicas
        let errorMessage = 'Erro interno ao enviar e-mail.';
        
        if (error.code === 'EAUTH') {
            errorMessage = 'Erro de autenticação. Verifique usuário e senha SMTP.';
        } else if (error.code === 'ECONNECTION') {
            errorMessage = 'Erro de conexão com servidor SMTP.';
        } else if (error.code === 'ETIMEDOUT') {
            errorMessage = 'Timeout na conexão SMTP.';
        }
        
        res.status(500).json({ error: errorMessage });
    }
};


