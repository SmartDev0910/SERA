import { Card } from '@mui/material';
import { BusinessPartner } from '@/models/business_partner';
import RecentOrdersTable from './RecentOrdersTable';

function RecentOrders() {
  const businessPartner: BusinessPartner[] = [
    {
      id: '1',
      t_name: 'Trade 3DC',
      l_name: 'Legal 3DC',
      country: 'Canada',
      state_town: 'Toronto',
      b_number: 'BDS332',
      email: 'testman3dc@gmail.com',
      phone: '(+1) 392 493 2933',
      w_address: '0x3dC4696671ca3cb6C34674A0c1729bbFcC29EDdc',
      reputation: 2
    },
    {
      id: '2',
      t_name: 'Trade 166',
      l_name: 'Legal 166',
      country: 'Canada',
      state_town: 'Toronto',
      b_number: 'TR 166',
      email: 'testman166@gmail.com',
      phone: '(+1) 392 493 2933',
      w_address: '0x1663CE5485ef8c7b8C390F1132e716d84fC357E8',
      reputation: 2
    }
  ];

  return (
    <Card>
      <RecentOrdersTable businessPartner={businessPartner} />
    </Card>
  );
}

export default RecentOrders;
