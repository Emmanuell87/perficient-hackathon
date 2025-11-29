import { z } from 'zod';

export const inventoryTransferSchema = z.object({
  fromDomeId: z.uuid(),
  toDomeId: z.uuid(),
  resourceId: z.uuid(),
  amount: z.number().positive(),
  operatorId: z.uuid().optional(),
});

export type InventoryTransferInput = z.infer<typeof inventoryTransferSchema>;
