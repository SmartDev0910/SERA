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
import { Invoice, InvoiceStatus } from '@/models/applications/invoices';
import { SeraContext } from '@/contexts/SeraContext';

const invoicesData: Invoice[] = [
  {
    id: '1',
    bus_parter: 'Trade',
    delivery_term: null,
    payment_term: '12341231',
    due_date: '2023/1/15',
    status: 'pending'
  },
  {
    id: '2',
    bus_parter: 'Trade',
    delivery_term: null,
    payment_term: '12341231',
    due_date: '2023/1/15',
    status: 'pending'
  }
];

const getStatusLabel = (invoiceStatus: InvoiceStatus): JSX.Element => {
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

  const { text, color }: any = map[invoiceStatus];

  return <Label color={color}>{text}</Label>;
};
const applyPagination = (
  invoices: Invoice[],
  page: number,
  limit: number
): Invoice[] => {
  return invoices.slice(page * limit, page * limit + limit);
};

const InvoicesTable = () => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [searchText, setSearchText] = useState<string>('');
  const { invoices, SetInvoices } = useContext(SeraContext);
  const [filteredPartner, setFilteredPartner] = useState<Invoice[]>([]);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
    setFilteredPartner(
      invoices.filter((item) => item.bus_parter.includes(event.target.value))
    );
  };

  const paginatedBusinessPartner = applyPagination(
    filteredPartner,
    page,
    limit
  );

  useEffect(() => {
    SetInvoices(invoicesData);
    setFilteredPartner(invoicesData);
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
              <TableCell align="center">Invoice ID</TableCell>
              <TableCell>Business Partner</TableCell>
              <TableCell>Delivery Term</TableCell>
              <TableCell>Payment Term</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBusinessPartner.map((invoices, index) => {
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
                      {invoices.id}
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
                      {invoices.bus_parter}
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
                      {invoices.delivery_term}
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
                      {invoices.payment_term}
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
                      {invoices.due_date}
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
                      {getStatusLabel(invoices.status)}
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
          count={invoices.length}
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

export default InvoicesTable;
