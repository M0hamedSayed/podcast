const nodemailer = require("nodemailer");
const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            port: 587,
            secure: true,
            auth: {
                user: process.env.Admin_email,
                pass: process.env.Admin_pass,
            },
        });

        await transporter.sendMail({
            from: process.env.Admin_email,
            to: email,
            subject: subject,
            text: text,
        });
        console.log("email sent sucessfully");
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
};

module.exports = sendEmail;