export type TokenStatus = 'completed' | 'pending' | 'failed';
export type ContractType = 'fungible' | 'non_fungible' | 'semi_fungible';

export interface Token {
  invoice_id: string;
  name: string;
  symbol: string;
  contract_type: ContractType;
  address: string;
  status: TokenStatus;
}
