import nodemailer from 'nodemailer';
import dotenv from 'dotenv';



export async function notifications(ReceiverEmail, subject, text) {
    const to = ReceiverEmail;
   
    try {
        // Configuration du transporteur SMTP
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
    
        // Détails du mail
        let mailOptions = {
          from: process.env.EMAIL_USER,
          to,
          subject,
          text
        };
    
        // Envoi de l'email
        let info = await transporter.sendMail(mailOptions);
    
        return "message has been sent successfully !";
      } catch (error) {
        console.error(error);
        return "sorry ! an error occured while sending notification";
      }
}