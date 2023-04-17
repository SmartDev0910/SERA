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
  CardHeader,
  Tooltip,
  Divider
} from '@mui/material';
import { RFQ } from '@/models/contracts';
import { SeraContext } from '@/contexts/SeraContext';

const rfq: RFQ[] = [
  {
    id: '1',
    buyer: 'Trade 3DC',
    material: null,
    w_address: '0x3dC4696671ca3cb6C34674A0c1729bbFcC29EDdc'
  },
  {
    id: '2',
    buyer: 'Trade 3DC',
    material: null,
    w_address: '0x3dC4696671ca3cb6C34674A0c1729bbFcC29EDdc'
  }
];

const applyPagination = (rfqs: RFQ[], page: number, limit: number): RFQ[] => {
  return rfqs.slice(page * limit, page * limit + limit);
};

const RFQsTable = () => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [searchText, setSearchText] = useState<string>('');
  const { rfqs, SetRFQs } = useContext(SeraContext);
  const [filteredPartner, setFilteredRFQ] = useState<RFQ[]>([]);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
    setFilteredRFQ(
      rfqs.filter((item) => item.w_address.includes(event.target.value))
    );
  };

  const paginatedRFQ = applyPagination(filteredPartner, page, limit);

  useEffect(() => {
    SetRFQs(rfq);
    setFilteredRFQ(rfq);
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
      <CardHeader title="Recent RFQs" />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">RFQ ID</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell>Material</TableCell>
              <TableCell>Wallet Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRFQ.map((rfq) => {
              return (
                <TableRow hover key={rfq.id}>
                  <TableCell align="center">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {rfq.id}
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
                      {rfq.buyer}
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
                      {rfq.buyer}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={rfq.w_address} placement="top-start">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {rfq.w_address.substring(0, 5) +
                          ' ... ' +
                          rfq.w_address.substring(38)}
                      </Typography>
                    </Tooltip>
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
          count={rfqs.length}
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

export default RFQsTable;
