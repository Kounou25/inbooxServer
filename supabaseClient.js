const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xyzcompany.supabase.co'; // remplace avec ton URL
const supabaseKey = 'ta-cle-anon'; // remplace avec ta clé
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
