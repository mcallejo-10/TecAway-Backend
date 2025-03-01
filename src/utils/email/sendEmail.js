import { createTransport } from "nodemailer";
import pkg from "handlebars";
const { compile } = pkg;
import { readFileSync } from "fs";
import { join } from "path";

const sendEmail = async (email, subject, payload, templatePath) => {
    try {
        const transporter = createTransport({
            host: 'smtp.gmail.com',  // Added quotes here
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const source = readFileSync(templatePath, "utf8");
        const compiledTemplate = compile(source);
        const options = () => {
            return {
                from: process.env.FROM_EMAIL,
                to: email,
                subject: subject,
                html: compiledTemplate(payload),
            };
        };

        // Send email
        return new Promise((resolve,reject)=>{
            transporter.sendMail(options(), (error, info) => {
                if (error) {
                    console.error('Email error:', error);  // Added error logging
                    reject(error);
                } else {
                    resolve('OK');
                }
            });
        });
    } catch (error) {
        console.error('SendEmail configuration error:', error);  // Added error logging
        throw error;
    }
};

export default sendEmail;