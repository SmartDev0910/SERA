export type ContractStatus = 'received' | 'issued';

export interface Proposals {
  id: string;
  buyer: string;
  supplier: string;
  country: string;
  delivery_term: object;
  payment_term: string;
  start_date: string;
  end_date: string;
  status: ContractStatus;
}

export interface RFQ {
  id: string;
  buyer: string;
  material: [];
  w_address: string;
}
