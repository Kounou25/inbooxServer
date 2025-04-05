import supabase  from '../supabaseClient.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


function OtpGenerator() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;

}

async function otpSender(email, otp) {
    const to = email;
    const subject = "Inboox OTP verification";
    const text = `your OTP verification code is:${otp}`;
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
    
        return "Otp verification code has been sent successfully !";
      } catch (error) {
        console.error(error);
        return "sorry ! an error occured while sendin otp verification code";
      }
}

export const createOtp = async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: " l'email est requis." });
    }
  
    try {
      // Génération du code OTP
      const otpCode = OtpGenerator();
  
      // Date d'expiration (5 minutes)
      const now = new Date();
      const expireDate = new Date(now.getTime() + 5 * 60000);
  
      // Insertion dans la base
      const { data, error } = await supabase
        .from("otp_codes")
        .insert([{ email, code: otpCode, expires_at: expireDate }]);
  
      if (error) {
        return res.status(500).json({ error: "Erreur lors de la création du OTP : " + error.message });
      }
  
      // Envoi du code OTP par mail
      await otpSender(email, otpCode);
  
      return res.status(201).json({ message: "OTP créé avec succès !" });
  
    } catch (error) {
      console.error("Erreur:", error);
      return res.status(500).json({ error: "Une erreur est survenue lors de la création du OTP." });
    }
  };
  