export type ShipmentStatus = 'completed' | 'pending' | 'failed';

export interface Shipment {
  po_id: string;
  importer: string;
  delivery_term: object;
  payment_term: string;
  status: ShipmentStatus;
}
