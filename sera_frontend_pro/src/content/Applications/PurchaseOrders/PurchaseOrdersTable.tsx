import { ChangeEvent, useState, useEffect, useContext } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TextField,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  Tooltip,
  Divider
} from '@mui/material';
import Label from '@/components/Label';
import {
  PurhcaseOrder,
  PurchaseOrderStatus
} from '@/models/applications/purhcase_orders';
import { SeraContext } from '@/contexts/SeraContext';

const purOrderData: PurhcaseOrder[] = [
  {
    pr_id: '1',
    c_id: '2',
    buyer: 'Trade 3DC',
    supplier: 'Trade 166',
    delivery_term: null,
    payment_term: '12323',
    status: 'pending'
  },
  {
    pr_id: '2',
    c_id: '3',
    buyer: 'Trade 3DC',
    supplier: 'Trade 166',
    delivery_term: null,
    payment_term: '12323',
    status: 'completed'
  }
];

const getStatusLabel = (purOrderStatus: PurchaseOrderStatus): JSX.Element => {
  const map = {
    failed: {
      text: 'Failed',
      color: 'error'
    },
    completed: {
      text: 'Completed',
      color: 'success'
    },
    pending: {
      text: 'Pending',
      color: 'warning'
    }
  };

  const { text, color }: any = map[purOrderStatus];

  return <Label color={color}>{text}</Label>;
};

const applyPagination = (
  purchaseOrders: PurhcaseOrder[],
  page: number,
  limit: number
): PurhcaseOrder[] => {
  return purchaseOrders.slice(page * limit, page * limit + limit);
};

const PurhcaseOrdersTable = () => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [searchText, setSearchText] = useState<string>('');
  const { purchaseOrders, SetPurchaseOrders } = useContext(SeraContext);
  const [filteredPartner, setFilteredPartner] = useState<PurhcaseOrder[]>([]);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
    setFilteredPartner(
      purchaseOrders.filter((item) => item.buyer.includes(event.target.value))
    );
  };

  const paginatedBusinessPartner = applyPagination(
    filteredPartner,
    page,
    limit
  );

  useEffect(() => {
    SetPurchaseOrders(purOrderData);
    setFilteredPartner(purOrderData);
  }, []);

  return (
    <Card>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '30%', float: 'right' }
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Search By Wallet Address."
          variant="outlined"
          value={searchText}
          onChange={handleSearch}
        />
      </Box>
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Purchase Order ID</TableCell>
              <TableCell align="center">Contract ID</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Delivery Term</TableCell>
              <TableCell>Payment Term</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBusinessPartner.map((purOrder, index) => {
              return (
                <TableRow hover key={index}>
                  <TableCell align="center">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {purOrder.pr_id}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {purOrder.c_id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {purOrder.buyer}
                    </Typography>
                    <Tooltip
                      title={'0x3dC4696671ca3cb6C34674A0c1729bbFcC29EDdc'}
                      placement="top-start"
                    >
                      <Typography variant="body2" color="text.secondary" noWrap>
                        0x3dC ... Ddc
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {purOrder.supplier}
                    </Typography>
                    <Tooltip
                      title={'0x1663CE5485ef8c7b8C390F1132e716d84fC357E8'}
                      placement="top-start"
                    >
                      <Typography variant="body2" color="text.secondary" noWrap>
                        0x166 ... 57E8
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {purOrder.delivery_term}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {purOrder.payment_term}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {getStatusLabel(purOrder.status)}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={purchaseOrders.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

export default PurhcaseOrdersTable;
