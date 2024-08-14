
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: '@gmail.com',
        pass: ''
    }
});

const sendEmail = (subject, body) => {
    const mailOptions = {
        from: '@gmail.com',
        to: '@gmail.com',
        subject: subject,
        text: body
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };