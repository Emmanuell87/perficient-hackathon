import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import { env } from './env';

export const supabaseAdmin = createClient<Database>(
  env.supabaseUrl,
  env.supabaseApiKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
