import supabase  from '../supabaseClient.js'; // Ajoute .js à la fin
import { notifications } from './notifications.js';


export const createMessage = async (req, res) => {
    const { name,senderEmail,ownerEmail,subject,message, apiKey } = req.body;
    let notificationSubject = "inboox new message";
    let notificationTextOwner = `Hello, you have received a message from ${name} check it out on your dashboard ! \n`;

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
                    return res.status(404).json({error:"The api Key is no valide or doesn't exists !"})
                }else{

                    const {data:messageData,error:messageError} = await supabase
                    .from("emails_sent") .insert([{user_id:ApiKey.user_id,to_mail:senderEmail,sender_name:name,subject:subject,body:message}]);

                    if (messageError) {
                        return res.status(404).json({error:"The message was not sent !"})
                   
                    }else{
                        const sendNotification = notifications(ownerEmail,notificationSubject,notificationTextOwner);
                        return res.status(200).json({message:"The message was sent successfully !"})
                    }

                } 
        
    } catch (error) {
        
    }

    
};