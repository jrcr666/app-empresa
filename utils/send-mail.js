const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jrcr666@gmail.com',
        pass: 'locura9865321987'
    }
});

const createEmailParams = ({ htmlText, subject, text, to }) => {
    const mailOptions = {
        from: 'jrcr666@gmail.com',
        to,
        subject,
        text,
        html: `

            <div style="background-color: #f7f722; color: red; width: 100%;">
                ${htmlText}
            </div>
            `};

    return mailOptions;
}

const sendEmail = () => {
    const params = {
        to: 'jrcr_87@hotmail.com',
        subject: 'Marta, aquí tienes tu factura nº 54678',
        text: 'That was easy!',
        htmlText: 'Caracola'
    };

    transporter.sendMail(createEmailParams(params), function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info);
        }
    });
}

// sendEmail();

module.exports = { sendEmail }