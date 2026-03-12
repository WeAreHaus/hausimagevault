import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://iebshpjpswufufovlbzl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Vh3XYaawojYJBAkchmkHXA_dpoKl1nh";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
