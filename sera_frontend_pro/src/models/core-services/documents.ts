export type DocumentStatus = 'completed' | 'pending' | 'failed';

export interface Document {
  partner: string;
  document: object;
  document_hash: string;
  status: DocumentStatus;
}
