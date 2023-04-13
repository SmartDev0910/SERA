import { useState, ReactNode, createContext } from 'react';
import { BusinessPartner } from '@/models/business_partner';
import { AuthParty } from '@/models/auth_parties';

type SeraContext = {
  openAPDialog: any;
  busPartners: BusinessPartner[];
  authParties: AuthParty[];
  SetBusPartners: (data: BusinessPartner[]) => void;
  SetAuthParties: (data: AuthParty[]) => void;
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
        SetAuthParties,
        SetBusPartners,
        handleOpenAPDialog,
        handleCloseAPDialog
      }}
    >
      {children}
    </SeraContext.Provider>
  );
}
