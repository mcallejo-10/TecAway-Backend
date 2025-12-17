import sendEmail from '../utils/email/sendEmail.js';
import User from '../models/userModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendContactMessage = async (req, res) => {
    try {
        const { senderName, senderEmail, message, userId } = req.body;

        // Find the registered user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prepare template data
        const payload = {
            userName: user.name,
            senderName: senderName,
            senderEmail: senderEmail,
            message: message
        };

        // Calculate absolute path to template
        const templatePath = path.join(__dirname, '..', 'utils', 'email', 'template', 'sendMessage.handlebars');

        console.log('=== CALLING sendEmail function ===');
        
        // Use the existing sendEmail function
        try {
            const result = await sendEmail(
                user.email,
                'Tienes un nuevo mensaje a través TecAway',
                payload,
                templatePath
            );
            
            console.log('=== EMAIL SENT SUCCESSFULLY ===');
            console.log('Result:', result);
            
            res.status(200).json({
                success: true,
                message: 'Message sent successfully',
                emailResult: result
            });
        } catch (emailError) {
            console.error('=== EMAIL SENDING FAILED ===');
            console.error('Email error:', emailError);
            throw emailError; // Re-throw para que lo capture el catch exterior
        }
    } catch (error) {
        console.error('=== CONTACT CONTROLLER ERROR ===');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        res.status(500).json({
            success: false,
            message: 'Error sending message',
            error: error.message,
            errorType: error.name
        });
    }
};