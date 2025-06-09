import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://rpaicoqbwyrsgznuhzfo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwYWljb3Fid3lyc2d6bnVoemZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMTUyNDIsImV4cCI6MjA2NDU5MTI0Mn0.R2tZihtRJ3Cs-vsrKm8J6fqhFYnNpinzs4wv6cZ_w04';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };