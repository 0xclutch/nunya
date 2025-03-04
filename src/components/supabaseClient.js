import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mkzrsppxtzvdfmraueiv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1renJzcHB4dHp2ZGZtcmF1ZWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMzNzcyNDMsImV4cCI6MjAzODk1MzI0M30.jCheBzxYFXUS63z-ISo9MXgxFosrXdu8LPobRFyUNro";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
