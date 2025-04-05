const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ilylxztwgcmgdtqrlsah.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlseWx4enR3Z2NtZ2R0cXJsc2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MDM2MDAsImV4cCI6MjA1OTM3OTYwMH0.q01lW7GcXcmsiXiramCICbGu1IC8E4YqtZAddL4_Qog'; 
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
