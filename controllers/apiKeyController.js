import supabase  from '../supabaseClient.js'; // Ajoute .js à la fin
import crypto from 'crypto';

//fonction pour generer une cle apy unique et aleatoire
const generateKey = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
  };

export const createApiKey = async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: "l'identifiant et le nom sont sont requis." });
    }

    try {
       
        const prefixe = "InboOx";
        const key = prefixe + generateKey();
        const name = "YTREZA";

        const { data, error } = await supabase
            .from("api_keys")
            .insert([{ user_id, key, name }]);

        if (error) {
            return res.status(500).json({ error: "Error while creation Api key : " + error.message });
        } else {
            return res.status(201).json({ message: "Your key has been created successfully !" });
        }

    } catch (error) {
        return res.status(500).json({ error: "An error occured during key creation." });
    }
};