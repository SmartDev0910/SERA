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
  Rating,
  Tooltip,
  Divider
} from '@mui/material';
import { BusinessPartner } from '@/models/business_partner';
import { SeraContext } from '@/contexts/SeraContext';

const busPartner: BusinessPartner[] = [
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

const applyPagination = (
  busPartners: BusinessPartner[],
  page: number,
  limit: number
): BusinessPartner[] => {
  return busPartners.slice(page * limit, page * limit + limit);
};

const DocumentsTable = () => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [searchText, setSearchText] = useState<string>('');
  const { busPartners, SetBusPartners } = useContext(SeraContext);
  const [filteredPartner, setFilteredPartner] = useState<BusinessPartner[]>([]);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
    setFilteredPartner(
      busPartners.filter((item) => item.w_address.includes(event.target.value))
    );
  };

  const paginatedBusinessPartner = applyPagination(
    filteredPartner,
    page,
    limit
  );

  useEffect(() => {
    SetBusPartners(busPartner);
    setFilteredPartner(busPartner);
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
            {paginatedBusinessPartner.map((busPartner) => {
              return (
                <TableRow hover key={busPartner.id}>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {busPartner.t_name}
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
                      {busPartner.l_name}
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
                      {busPartner.country}
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
                      {busPartner.state_town}
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
                      {busPartner.b_number}
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
                      {busPartner.email}
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
                      {busPartner.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={busPartner.w_address} placement="top-start">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {busPartner.w_address.substring(0, 5) +
                          ' ... ' +
                          busPartner.w_address.substring(38)}
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
                      <Rating
                        name="read-only"
                        value={busPartner.reputation}
                        readOnly
                      />
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
          count={busPartners.length}
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

export default DocumentsTable;
