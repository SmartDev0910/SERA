import { useState, ReactNode, createContext } from 'react';
import { BusinessPartner } from '@/models/business_partner';

type SeraContext = {
  openAPDialog: any;
  busPartners: BusinessPartner[];
  SetBusPartners: (data: BusinessPartner[]) => void;
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
        SetBusPartners,
        handleOpenAPDialog,
        handleCloseAPDialog
      }}
    >
      {children}
    </SeraContext.Provider>
  );
}
