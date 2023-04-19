export type PurchaseOrderStatus = 'completed' | 'pending' | 'failed';

export interface PurhcaseOrder {
  pr_id: string;
  c_id: string;
  buyer: string;
  supplier: string;
  delivery_term: object;
  payment_term: string;
  status: PurchaseOrderStatus;
}
