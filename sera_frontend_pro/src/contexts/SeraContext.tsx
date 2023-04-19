import { useState, ReactNode, createContext } from 'react';
import { BusinessPartner } from '@/models/applications/business_partner';
import { AuthParty } from '@/models/applications/auth_parties';
import { Proposals, RFQ } from '@/models/applications/contracts';
import { Materials } from '@/models/applications/materials';
import { PurhcaseOrder } from '@/models/applications/purhcase_orders';
import { Invoice } from '@/models/applications/invoices';

type SeraContext = {
  openAPDialog: any;
  busPartners: BusinessPartner[];
  authParties: AuthParty[];
  proposals: Proposals[];
  rfqs: RFQ[];
  materials: Materials[];
  purchaseOrders: PurhcaseOrder[];
  invoices: Invoice[];
  SetBusPartners: (data: BusinessPartner[]) => void;
  SetAuthParties: (data: AuthParty[]) => void;
  SetProposals: (data: Proposals[]) => void;
  SetRFQs: (data: RFQ[]) => void;
  SetMaterials: (data: Materials[]) => void;
  SetPurchaseOrders: (data: PurhcaseOrder[]) => void;
  SetInvoices: (data: Invoice[]) => void;
  handleOpenAPDialog: () => void;
  handleCloseAPDialog: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SeraContext = createContext<SeraContext>({} as SeraContext);

type Props = {
  children: ReactNode;
};

export function SeraContextProvider({ children }: Props) {
  const [openAPDialog, setOpenAPDialog] = useState<boolean>(false);
  const [busPartners, setBusPartners] = useState<BusinessPartner[]>([]);
  const [authParties, setAuthParties] = useState<AuthParty[]>([]);
  const [proposals, setProposals] = useState<Proposals[]>([]);
  const [rfqs, setRFQs] = useState<RFQ[]>([]);
  const [materials, setMaterials] = useState<Materials[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurhcaseOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const SetInvoices = (data: Invoice[]) => {
    setInvoices(data);
  };

  const SetPurchaseOrders = (data: PurhcaseOrder[]) => {
    setPurchaseOrders(data);
  };

  const SetMaterials = (data: Materials[]) => {
    setMaterials(data);
  };

  const SetRFQs = (data: RFQ[]) => {
    setRFQs(data);
  };

  const SetProposals = (data: Proposals[]) => {
    setProposals(data);
  };

  const SetAuthParties = (data: AuthParty[]) => {
    setAuthParties(data);
  };

  const SetBusPartners = (data: BusinessPartner[]) => {
    setBusPartners(data);
  };

  const handleOpenAPDialog = () => {
    setOpenAPDialog(true);
  };

  const handleCloseAPDialog = () => {
    setOpenAPDialog(false);
  };

  return (
    <SeraContext.Provider
      value={{
        openAPDialog,
        busPartners,
        authParties,
        proposals,
        rfqs,
        materials,
        purchaseOrders,
        invoices,
        SetAuthParties,
        SetBusPartners,
        SetProposals,
        SetRFQs,
        SetMaterials,
        SetInvoices,
        SetPurchaseOrders,
        handleOpenAPDialog,
        handleCloseAPDialog
      }}
    >
      {children}
    </SeraContext.Provider>
  );
}
