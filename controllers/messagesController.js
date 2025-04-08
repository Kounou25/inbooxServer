import supabase  from '../supabaseClient.js'; // Ajoute .js à la fin
import { notifications } from './notifications.js';


export const createMessage = async (req, res) => {
    const { name,senderEmail,ownerEmail,subject,message, apiKey } = req.body;
    let notificationSubject = "inboox new message";
    let notificationTextOwner = `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f7fa; padding: 40px 30px; border-radius: 8px; color: #333; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://your-logo-url.com/logo.png" alt="Inboox" style="height: 40px;" />
      </div>
  
      <h2 style="color: #2E7D32; font-size: 22px; margin-bottom: 10px;">📩 Nouveau message reçu</h2>
      <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">
        Bonjour,
      </p>
  
      <p style="font-size: 16px; line-height: 1.6;">
        Vous avez reçu un nouveau message de <strong>${name}</strong> via votre espace Inboox.
      </p>
  
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://your-dashboard-url.com" 
           style="background-color: #2E7D32; color: #fff; padding: 14px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: 600;">
           Consulter le message
        </a>
      </div>
  
      <p style="font-size: 14px; color: #666; line-height: 1.5;">
        Si vous ne parvenez pas à cliquer sur le bouton, copiez et collez ce lien dans votre navigateur :
        <br>
        <a href="https://your-dashboard-url.com" style="color: #2E7D32;">https://your-dashboard-url.com</a>
      </p>
  
      <hr style="border: none; border-top: 1px solid #ddd; margin: 40px 0;"/>
  
      <p style="font-size: 13px; color: #999; text-align: center;">
        Cet e-mail a été généré automatiquement par <strong>Inboox</strong>. Merci de ne pas y répondre.
      </p>
    </div>
  `;
  
    if (!name || !senderEmail ||!ownerEmail || !subject || !message || !apiKey ) {
        return res.status(400).json({ error: "All data are required" });
    }

    try {

        const {data:ApiKey,error:errorApiKey} = await supabase
                .from("api_keys")
                .select("*")
                .eq("key",apiKey)
                .single();

                if (errorApiKey) {
                    return res.status(404).json({error:"The api Key is no valide or doesn't exists !",errorApiKey:errorApiKey.message});
                }else{

                    const {data:messageData,error:messageError} = await supabase
                    .from("emails_sent") .insert([{user_id:ApiKey.user_id,to_email:senderEmail,sender_name:name,subject:subject,body:message}]);

                    if (messageError) {
                        return res.status(404).json({error:"The message was not sent !"})
                   
                    }else{
                        const sendNotification = await notifications(ownerEmail,notificationSubject,notificationTextOwner);
                        return res.status(200).json({message:"The message was sent successfully !"})
                    }

                } 
        
    } catch (error) {
        return res.status(500).json({message:"internal server error !",error:error.message});

    }

    
};