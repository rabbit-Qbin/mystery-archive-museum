import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uolywqzcdsqyoapvfsgz.supabase.co';
const supabaseAnonKey = 'sb_publishable_ctimr5stynGdP2mRDX7FWQ_IeXwy_Kb';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
