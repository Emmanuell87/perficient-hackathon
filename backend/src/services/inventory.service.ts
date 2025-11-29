import crypto from 'crypto';
import { supabaseAdmin } from '../config/supabase';
import { InventoryTransferInput } from '../models/inventory.models';

export class InventoryService {
  async getInventoryByDome(domeId: string) {
    const { data, error } = await supabaseAdmin
      .from('inventory')
      .select(
        'id, dome_id, resource_id, quantity, min_threshold, max_threshold'
      )
      .eq('dome_id', domeId);

    if (error) throw error;
    return data;
  }

  async transferResources(input: InventoryTransferInput) {
    const { fromDomeId, toDomeId, resourceId, amount, operatorId } = input;

    if (fromDomeId === toDomeId) {
      throw new Error('Source and target dome must be different');
    }

    // 1) source inventory
    const { data: src, error: srcErr } = await supabaseAdmin
      .from('inventory')
      .select('id, quantity')
      .eq('dome_id', fromDomeId)
      .eq('resource_id', resourceId)
      .single();

    if (srcErr) throw srcErr;
    if (src.quantity < amount) {
      throw new Error('Insufficient quantity in source dome');
    }

    // 2) update source
    const { error: updSrcErr } = await supabaseAdmin
      .from('inventory')
      .update({ quantity: src.quantity - amount })
      .eq('id', src.id);

    if (updSrcErr) throw updSrcErr;

    // 3) update target (upsert)
    const { data: tgt, error: tgtSelErr } = await supabaseAdmin
      .from('inventory')
      .select('id, quantity')
      .eq('dome_id', toDomeId)
      .eq('resource_id', resourceId)
      .maybeSingle();

    if (tgtSelErr) throw tgtSelErr;

    if (!tgt) {
      const { error: insErr } = await supabaseAdmin.from('inventory').insert({
        dome_id: toDomeId,
        resource_id: resourceId,
        quantity: amount,
      });
      if (insErr) throw insErr;
    } else {
      const { error: updErr } = await supabaseAdmin
        .from('inventory')
        .update({ quantity: tgt.quantity + amount })
        .eq('id', tgt.id);
      if (updErr) throw updErr;
    }

    // 4) logs
    const transferGroup = crypto.randomUUID();

    const { error: logErr } = await supabaseAdmin.from('resource_logs').insert([
      {
        resource_id: resourceId,
        dome_id: fromDomeId,
        log_type: 'TRANSFER_OUT',
        amount: -amount,
        operator_id: operatorId ?? null,
        transfer_group: transferGroup,
        notes: 'Transfer from dome',
      },
      {
        resource_id: resourceId,
        dome_id: toDomeId,
        log_type: 'TRANSFER_IN',
        amount,
        operator_id: operatorId ?? null,
        transfer_group: transferGroup,
        notes: 'Transfer to dome',
      },
    ]);

    if (logErr) throw logErr;

    const [sourceInventory, targetInventory] = await Promise.all([
      this.getInventoryByDome(fromDomeId),
      this.getInventoryByDome(toDomeId),
    ]);

    return {
      transferGroup,
      fromDomeId,
      toDomeId,
      resourceId,
      amount,
      sourceInventory,
      targetInventory,
    };
  }
}
