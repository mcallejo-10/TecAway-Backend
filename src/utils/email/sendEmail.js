import { Resend } from 'resend';
import pkg from "handlebars";
const { compile } = pkg;
import { readFileSync, existsSync } from "fs";

const sendEmail = async (email, subject, payload, templatePath) => {
    try {
        console.log('=== SENDING EMAIL WITH RESEND ===');
        console.log('To:', email);
        console.log('Subject:', subject);
        console.log('Template path:', templatePath);
        
        // Verificar que el template existe
        if (!existsSync(templatePath)) {
            throw new Error(`Template file not found: ${templatePath}`);
        }

        // Verificar que la API key de Resend esté configurada
        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY environment variable is not set');
        }

        console.log('Resend config:', {
            hasApiKey: !!process.env.RESEND_API_KEY,
            from: process.env.FROM_EMAIL || 'onboarding@resend.dev'
        });

        // Inicializar Resend
        const resend = new Resend(process.env.RESEND_API_KEY);
        console.log('Resend client initialized successfully');

        // Leer y compilar el template
        console.log('Reading template file...');
        const source = readFileSync(templatePath, "utf8");
        console.log('Template read successfully, compiling...');
        const compiledTemplate = compile(source);
        console.log('Template compiled successfully');

        // Enviar el email con Resend
        console.log('Sending email via Resend...');
        const { data, error } = await resend.emails.send({
            from: `TecAway <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`,
            to: email,
            subject: subject,
            html: compiledTemplate(payload),
        });

        if (error) {
            throw new Error(`Resend API error: ${error.message}`);
        }
        
        console.log('✅ Email sent successfully via Resend!');
        console.log('Email ID:', data.id);
        
        return {
            success: true,
            emailId: data.id,
            provider: 'resend'
        };
    } catch (error) {
        console.error('=== EMAIL ERROR ===');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        if (error.message.includes('RESEND_API_KEY')) {
            console.error('❌ Resend API key is missing. Add RESEND_API_KEY to environment variables');
        }
        
        throw error;
    }
};

export default sendEmail;