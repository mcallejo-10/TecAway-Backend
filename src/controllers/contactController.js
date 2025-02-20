import sendEmail from '../utils/email/sendEmail.js';
import User from '../models/userModel.js';

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

        // Use the existing sendEmail function
        await sendEmail(
            user.email,
            'Tienes un nuevo mensaje a través TecAway',
            payload,
            'email/template/sendMessage.handlebars'
        );

        res.status(200).json({
            success: true,
            message: 'Message sent successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error sending message',
            error: error.message
        });
    }
};