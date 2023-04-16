export type InvoiceStatus = 'completed' | 'pending' | 'failed';

export interface Invoice {
  id: string;
  bus_parter: string;
  delivery_term: object;
  payment_term: string;
  due_date: string;
  status: InvoiceStatus;
}
