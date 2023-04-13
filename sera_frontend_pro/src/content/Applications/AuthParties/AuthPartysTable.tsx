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
import { AuthParty } from '@/models/auth_parties';
import { SeraContext } from '@/contexts/SeraContext';

const authPartiesData: AuthParty[] = [
  {
    id: '1',
    t_name: 'Trade 3DC',
    country: 'Canada',
    state_town: 'Toronto',
    email: 'testman3dc@gmail.com',
    phone: '(+1) 392 493 2933',
    w_address: '0x3dC4696671ca3cb6C34674A0c1729bbFcC29EDdc'
  },
  {
    id: '2',
    t_name: 'Trade 166',
    country: 'Canada',
    state_town: 'Toronto',
    email: 'testman166@gmail.com',
    phone: '(+1) 392 493 2933',
    w_address: '0x1663CE5485ef8c7b8C390F1132e716d84fC357E8'
  }
];

const applyPagination = (
  authParties: AuthParty[],
  page: number,
  limit: number
): AuthParty[] => {
  return authParties.slice(page * limit, page * limit + limit);
};

const AuthPartysTable = () => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [searchText, setSearchText] = useState<string>('');
  const { authParties, SetAuthParties } = useContext(SeraContext);
  const [filteredParties, setFilteredParties] = useState<AuthParty[]>([]);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
    setFilteredParties(
      authParties.filter((item) => item.w_address.includes(event.target.value))
    );
  };

  const paginatedAuthParty = applyPagination(filteredParties, page, limit);

  useEffect(() => {
    SetAuthParties(authPartiesData);
    setFilteredParties(authPartiesData);
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
              <TableCell>Country</TableCell>
              <TableCell>State/Town</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Wallet Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAuthParty.map((item) => {
              return (
                <TableRow hover key={item.id}>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {item.t_name}
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
                      {item.country}
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
                      {item.state_town}
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
                      {item.email}
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
                      {item.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={item.w_address} placement="top-start">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {item.w_address.substring(0, 5) +
                          ' ... ' +
                          item.w_address.substring(38)}
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
          count={authParties.length}
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

export default AuthPartysTable;
