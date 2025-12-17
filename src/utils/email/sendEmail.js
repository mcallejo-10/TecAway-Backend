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

        // Verificar que las credenciales estén configuradas
        if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
            throw new Error('EMAIL_USERNAME or EMAIL_PASSWORD environment variables are not set');
        }

        console.log('Email config:', {
            user: process.env.EMAIL_USERNAME,
            from: process.env.FROM_EMAIL,
            hasPassword: !!process.env.EMAIL_PASSWORD
        });

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

        // Verificar la conexión (opcional, continuar si falla)
        try {
            await transporter.verify();
            console.log('SMTP connection verified successfully');
        } catch (verifyError) {
            console.warn('SMTP verification failed, but will try to send anyway:', verifyError.message);
        }

        // Leer y compilar el template
        console.log('Reading template file...');
        const source = readFileSync(templatePath, "utf8");
        console.log('Template read successfully, compiling...');
        const compiledTemplate = compile(source);
        console.log('Template compiled successfully');
        
        // Configurar el mensaje
        const mailOptions = {
            from: `"TecAway" <${process.env.FROM_EMAIL}>`,
            to: email,
            subject: subject,
            html: compiledTemplate(payload),
        };

        console.log('Mail options prepared, sending email...');
        
        // Enviar el email - nodemailer 7.x usa async/await nativamente
        const info = await transporter.sendMail(mailOptions);
        
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        
        return {
            success: true,
            messageId: info.messageId,
            response: info.response
        };
    } catch (error) {
        console.error('=== EMAIL ERROR ===');
        console.error('Error type:', error.name);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Errores específicos de nodemailer/SMTP
        if (error.code === 'EAUTH') {
            console.error('❌ Authentication failed. Check EMAIL_USERNAME and EMAIL_PASSWORD');
        } else if (error.code === 'ESOCKET') {
            console.error('❌ Socket error. Check network connection and SMTP server');
        } else if (error.code === 'ECONNECTION') {
            console.error('❌ Connection error. SMTP server may be unreachable');
        }
        
        throw error;
    }
};

export default sendEmail;