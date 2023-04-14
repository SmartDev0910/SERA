import { ChangeEvent, useState, useEffect, useContext } from 'react';
import {
  Box,
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
      rfqs.filter((item) => item.buyer.includes(event.target.value))
    );
  };

  const paginatedRFQ = applyPagination(filteredPartner, page, limit);

  useEffect(() => {
    SetRFQs(rfq);
    setFilteredRFQ(rfq);
  }, []);

  return (
    <>
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
              <TableCell>Trade Name</TableCell>
              <TableCell>Legal Name</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>State/Town</TableCell>
              <TableCell>Building Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Wallet Address</TableCell>
              <TableCell>Reputation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRFQ.map((rfq) => {
              return (
                <TableRow hover key={rfq.id}>
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
    </>
  );
};

export default RFQsTable;
