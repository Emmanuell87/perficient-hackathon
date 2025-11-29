import { supabaseAdmin } from '../config/supabase';

export class DomeService {
  async getAllDomes() {
    const { data, error } = await supabaseAdmin
      .from('domes')
      .select('*')
      .order('code', { ascending: true });

    if (error) throw error;
    return data;
  }

  async getDomeById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('domes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}
