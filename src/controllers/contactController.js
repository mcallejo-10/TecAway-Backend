import sendEmail from '../utils/email/sendEmail.js';
import User from '../models/userModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendContactMessage = async (req, res) => {
    try {
        const { senderName, senderEmail, message, userId } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const payload = {
            userName: user.name,
            senderName: senderName,
            senderEmail: senderEmail,
            message: message
        };

        const templatePath = path.join(__dirname, '..', 'utils', 'email', 'template', 'sendMessage.handlebars');
        
        const result = await sendEmail(
            user.email,
            'Tienes un nuevo mensaje a través TecAway',
            payload,
            templatePath
        );
        
        res.status(200).json({
            success: true,
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error('Contact message error:', error.message);
        
        res.status(500).json({
            success: false,
            message: 'Error sending message',
            error: error.message
        });
    }
};