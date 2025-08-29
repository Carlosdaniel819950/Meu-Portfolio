# 🔧 Configuração Vercel - Variáveis de Ambiente

## ⚠️ ERRO ATUAL: "Erro interno ao enviar e-mail"

Este erro acontece porque as variáveis de ambiente não estão configuradas na Vercel.

## 📋 Passo a Passo para Configurar

### 1. Acesse o Dashboard da Vercel
- Vá para [vercel.com](https://vercel.com)
- Faça login e acesse seu projeto

### 2. Configure as Variáveis de Ambiente
- Clique em **Settings** (⚙️)
- Vá para **Environment Variables**
- Adicione cada variável:

| Nome | Valor | Descrição |
|------|-------|-----------|
| `SMTP_HOST` | `smtp.gmail.com` | Servidor SMTP do Gmail |
| `SMTP_PORT` | `587` | Porta para TLS |
| `SMTP_USER` | `carlosdanielpaulo0000@gmail.com` | Seu e-mail Gmail |
| `SMTP_PASS` | `sua-senha-de-app` | Senha de app do Gmail |
| `MAIL_TO` | `carlosdanielpaulo0000@gmail.com` | Destinatário dos e-mails |
| `FROM_NAME` | `Carlos Daniel` | Nome do remetente |
| `FROM_EMAIL` | `carlosdanielpaulo0000@gmail.com` | E-mail do remetente |

### 3. Como Gerar Senha de App no Gmail
1. Acesse [myaccount.google.com](https://myaccount.google.com)
2. Vá em **Segurança**
3. Ative **Verificação em duas etapas** (se não estiver ativa)
4. Vá em **Senhas de app**
5. Gere uma senha para "Email"
6. Use essa senha no `SMTP_PASS`

### 4. Redeploy
- Após salvar as variáveis, clique em **Redeploy**
- Ou faça um novo commit no GitHub

### 5. Teste
- Acesse seu site
- Vá na aba **Contato**
- Preencha e envie o formulário
- Deve funcionar agora! ✅

## 🔍 Verificar Logs
Se ainda der erro:
- Vá em **Functions** → **Logs**
- Procure por erros relacionados ao SMTP
- Verifique se as variáveis estão corretas

## 📧 E-mails Alternativos
Se não quiser usar Gmail, pode usar:
- **Outlook**: `smtp-mail.outlook.com`, porta `587`
- **Yahoo**: `smtp.mail.yahoo.com`, porta `587`
- **Provedor próprio**: consulte as configurações SMTP
