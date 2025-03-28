import nodemailer from 'nodemailer';

const enviarEmail = async (email: string, codigo: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: 'suporte@seusite.com',
        to: email,
        subject: 'Código de verificação',
        text: `Seu código de verificação é: ${codigo}. Ele expira em 10 minutos.`,
    });
};

export default enviarEmail;
