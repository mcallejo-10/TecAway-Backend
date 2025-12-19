import { Resend } from 'resend';
import pkg from "handlebars";
const { compile } = pkg;
import { readFileSync, existsSync } from "fs";

const sendEmail = async (email, subject, payload, templatePath) => {
    try {
        if (!existsSync(templatePath)) {
            throw new Error(`Template file not found: ${templatePath}`);
        }
        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY environment variable is not set');
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const source = readFileSync(templatePath, "utf8");
        const compiledTemplate = compile(source);

        const { data, error } = await resend.emails.send({
            from: `TecAway <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`,
            to: email,
            subject: subject,
            html: compiledTemplate(payload),
        });

        if (error) {
            throw new Error(`Resend API error: ${error.message}`);
        }
        
        console.log('✅ Email sent successfully to:', email);
        
        return {
            success: true,
            emailId: data.id,
            provider: 'resend'
        };
    } catch (error) {
        console.error('❌ Email error:', error.message);
        throw error;
    }
};

export default sendEmail;