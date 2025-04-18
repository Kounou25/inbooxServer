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




// controllers/usersController.js
export const getUserByEmail = async (req, res) => {
    const { email } = req.params;
  
    if (!email) {
      return res.status(400).json({ error: "Email requis." });
    }
  
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single(); // <- pour ne retourner qu’un seul résultat
  
      if (error) {
        return res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur : " + error.message });
      }
  
      if (!data) {
        return res.status(404).json({ error: "Utilisateur non trouvé." });
      }
  
      res.status(200).json(data);
  
    } catch (err) {
      res.status(500).json({ error: "Erreur serveur." });
    }
  };



  //login


export const login = async (req, res) => {
  const { email, password } = req.body;

  // Vérification des champs requis
  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis." });
  }

  try {
    // Chercher l'utilisateur via l'email
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Identifiants invalides." });
    }

    // Comparer les mots de passe (hashé vs entré)
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Identifiants invalides." });
    }

    // Si tout est ok : connexion réussie
    return res.status(200).json({
      message: "Connexion réussie.",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        // tu peux ajouter d'autres champs si nécessaire
      }
    });

  } catch (err) {
    return res.status(500).json({ error: "Erreur lors de la connexion." });
  }
};

  

export default [createUser ,getUsers, getUserByEmail,login];
