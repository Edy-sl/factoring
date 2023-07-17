import nodemailer from 'nodemailer';
export const recuperaSenha = async (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        host: 'smtp.office.365.com',
        port: 587,
        auth: {
            user: 'edy.sl@hotmail.com',
            pass: '233454edyslima',
        },
    });

    const mailData = await transporter.sendMail({
        from: 'edy.sl@hotmail,com',
        to: 'edy.sl@hotmail.com',
        subject: 'teste',
        text: 'teste dfsdfdfsdfsdf',
    });

    return mailData;
};
