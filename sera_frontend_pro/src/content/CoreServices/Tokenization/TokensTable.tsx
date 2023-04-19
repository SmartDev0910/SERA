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
import { ContractType, TokenStatus, Token } from '@/models/core-services/token';
import { SeraContext } from '@/contexts/SeraContext';

const tokenData: Token[] = [
  {
    invoice_id: '1',
    name: 'SERA TOKEN',
    symbol: 'SERA',
    contract_type: 'fungible',
    address: '0x3dC4696671ca3cb6C34674A0c1729bbFcC29EDdc',
    status: 'pending'
  }
];

const getStatusLabel = (tokenStatus: TokenStatus): JSX.Element => {
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

  const { text, color }: any = map[tokenStatus];

  return <Label color={color}>{text}</Label>;
};

const getContractTypeLabel = (contractType: ContractType): JSX.Element => {
  const map = {
    non_fungible: {
      text: 'Non Fungible',
      color: 'error'
    },
    fungible: {
      text: 'Fungible',
      color: 'success'
    },
    semi_fungible: {
      text: 'Semi Fungible',
      color: 'warning'
    }
  };

  const { text, color }: any = map[contractType];

  return <Label color={color}>{text}</Label>;
};

const applyPagination = (
  tokens: Token[],
  page: number,
  limit: number
): Token[] => {
  return tokens.slice(page * limit, page * limit + limit);
};

const TokensTable = () => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [searchText, setSearchText] = useState<string>('');
  const { tokens, SetTokens } = useContext(SeraContext);
  const [filteredPartner, setFilteredPartner] = useState<Token[]>([]);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
    setFilteredPartner(
      tokens.filter((item) => item.address.includes(event.target.value))
    );
  };

  const paginatedToken = applyPagination(filteredPartner, page, limit);

  useEffect(() => {
    SetTokens(tokenData);
    setFilteredPartner(tokenData);
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
              <TableCell>Token Name</TableCell>
              <TableCell align="center">Token Symbol</TableCell>
              <TableCell>Contract Type</TableCell>
              <TableCell>Token Address</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedToken.map((token, index) => {
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
                      {token.invoice_id}
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
                      {token.name}
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
                      {token.symbol}
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
                      {getContractTypeLabel(token.contract_type)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={token.address} placement="top-start">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {token.address.substring(0, 5) +
                          ' ... ' +
                          token.address.substring(38)}
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
                      {getStatusLabel(token.status)}
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
          count={tokens.length}
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

export default TokensTable;
