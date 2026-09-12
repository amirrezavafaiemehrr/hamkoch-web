import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rdifdufgzizwrefpeojj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaWZkdWZneml6d3JlZnBlb2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2NzM4NTcsImV4cCI6MjEwNDI0OTg1N30.nX8LxxYyFVoIRvHVFHfUryO_SxYOrtXK7aqmDbvHnoA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
