import 'dotenv/config';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const env = {
  port: parseInt(process.env.PORT ?? '4000', 10),
  supabaseUrl: required('SUPABASE_URL'),
  supabaseApiKey: required('API_KEY'),
};
