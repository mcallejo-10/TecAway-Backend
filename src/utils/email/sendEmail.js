import nodemailer from "nodemailer";
import pkg from "handlebars";
const { compile } = pkg;
import { readFileSync, existsSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

const sendEmail = async (email, subject, payload, templatePath) => {
    try {
        console.log('=== SENDING EMAIL ===');
        console.log('To:', email);
        console.log('Subject:', subject);
        console.log('Template path:', templatePath);
        
        // Verificar que el template existe
        if (!existsSync(templatePath)) {
            throw new Error(`Template file not found: ${templatePath}`);
        }

        // Configuración del transporter para nodemailer 7.x
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true para puerto 465, false para otros puertos
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            },
            logger: false, // Habilitar para debug
            debug: false // Habilitar para debug
        });

        // Verificar la conexión
        await transporter.verify();
        console.log('SMTP connection verified successfully');

        // Leer y compilar el template
        const source = readFileSync(templatePath, "utf8");
        const compiledTemplate = compile(source);
        
        // Configurar el mensaje
        const mailOptions = {
            from: `"TecAway" <${process.env.FROM_EMAIL}>`,
            to: email,
            subject: subject,
            html: compiledTemplate(payload),
        };

        // Enviar el email - nodemailer 7.x usa async/await nativamente
        const info = await transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        
        return {
            success: true,
            messageId: info.messageId,
            response: info.response
        };
    } catch (error) {
        console.error('=== EMAIL ERROR ===');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        throw error;
    }
};

export default sendEmail;