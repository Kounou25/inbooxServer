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
    const text = `
  <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); color: #333;">
    
    <h2 style="color: #4CAF50; font-size: 22px; text-align: center;">🔐 Vérification de sécurité</h2>
    
    <p style="font-size: 16px; line-height: 1.6;">
      Bonjour,
      <br><br>
      Pour continuer, veuillez utiliser le code de vérification ci-dessous :
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #4CAF50;">
        ${otp}
      </span>
    </div>

    <p style="font-size: 15px; line-height: 1.6; color: #666;">
      Ce code est valable pendant <strong>10 minutes</strong>. Ne le partagez avec personne pour des raisons de sécurité.
    </p>

    <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;"/>

    <p style="font-size: 13px; text-align: center; color: #999;">
      Cet e-mail a été généré automatiquement – merci de ne pas y répondre.
    </p>
  </div>
`;

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
          html:text
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




  //fonction de verification du code otp entree

  async function updateOtpStatus(email) {
    const now = new Date().toISOString(); // Format ISO, compatible avec Supabase
    
     const {data:updateData, error:updateError}= await supabase
      .from("otp_codes")
      .update({ is_used: true })
      .eq("email", email)
      .gt("expires_at", now) 
      .order("expires_at", { ascending: false })
      .limit(1);
  }

  export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const now = new Date().toISOString();

  
    if (!email || !otp) {
      return res.status(400).json({ error: "Email et OTP sont requis." });
    }
  
    try {
      // Cherche l'utilisateur avec le code OTP correspondant, non expiré
      const { data:dataOtp, error } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("code", otp)
      .eq("email", email)
      .gt("expires_at", now) 
      .order("expires_at", { ascending: false })
      .limit(1);
  
      if (error) {
        return res.status(500).json({ error: "Erreur lors de la vérification.",error });
      }
  
      if (!dataOtp || dataOtp.length === 0) {
        return res.status(400).json({ error: "OTP invalide ou expiré." });
      }
        

      updateOtpStatus(email);

      return res.status(200).json({ message: "OTP valide ✅" });
    } catch (err) {
      return res.status(500).json({ error: "Une erreur est survenue.",err });
    }
  };
  
  