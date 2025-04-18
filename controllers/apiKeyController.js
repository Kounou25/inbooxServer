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


//recuperation de toutes les cle api

export const getApiKeys = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("api_keys")
            .select('*');  // Sélectionner toutes les clés API
        
        if (error) {
            return res.status(500).json({ error: "Error while getting apis keys : " + error.message });
        }

        return res.status(200).json(data);  // Retourner les clés API récupérées
    } catch (error) {
        return res.status(500).json({ error: "An error occured while getting api keys." });
    }
};


// recuperation de la cle api par user_id

export const getApiKeyByuuid = async (req, res) => {
    const { user_id } = req.params;
  
    if (!user_id) {
      return res.status(400).json({ error: "L'identifiant utilisateur (uuid) est requis." });
    }
  
    try {
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .eq("user_id", user_id)
        .single(); // on suppose une seule api_key par user
  
      if (error) {
        console.error("Erreur Supabase :", error);
        return res.status(500).json({ error: "Error occured while getting api key." });
      }
  
      if (!data) {
        return res.status(404).json({ error: "No key found for this user." });
      }
  
      return res.status(200).json(data);
  
    } catch (err) {
      console.error("Server error :", err);
      return res.status(500).json({ error: "Internal server error." });
    }
  };
  