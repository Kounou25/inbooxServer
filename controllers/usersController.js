import bcrypt from 'bcrypt';
import supabase  from '../supabaseClient.js'; // Ajoute .js à la fin
const saltRounds = 10;

export const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Nom, email et mot de passe sont requis." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const { data, error } = await supabase
            .from("users")
            .insert([{ full_name:name, email, password_hash: hashedPassword }]);

        if (error) {
            return res.status(500).json({ error: "Erreur lors de la création du compte : " + error.message });
        } else {
            return res.status(201).json({ message: "Compte créé avec succès !" });
        }

    } catch (error) {
        return res.status(500).json({ error: "Une erreur est survenue lors de la création du compte." });
    }
};




export const getUsers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select('*');  // Sélectionner tous les utilisateurs
        
        if (error) {
            return res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs : " + error.message });
        }

        return res.status(200).json(data);  // Retourner les utilisateurs récupérés
    } catch (error) {
        return res.status(500).json({ error: "Une erreur est survenue lors de la récupération des utilisateurs." });
    }
};

export default [createUser ,getUsers];
