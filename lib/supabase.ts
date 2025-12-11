import { createClient } from '@supabase/supabase-js';

// Replace these with your project's URL and Anon Key from Supabase Dashboard -> Settings -> API
// For production, use process.env.REACT_APP_SUPABASE_URL (or similar based on build tool)
// Warning: In a real app, never hardcode keys if not using environment variables.
const supabaseUrl = process.env.SUPABASE_URL || 'https://tmhozuzkctoxtfxyjint.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtaG96dXprY3RveHRmeHlqaW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MjU2NDMsImV4cCI6MjA4MTAwMTY0M30.HUoPe-nA2mES7Tt1oT_FwQG7b6KyKd5F0ogwv4QvIzw';

export const supabase = createClient(supabaseUrl, supabaseKey);



