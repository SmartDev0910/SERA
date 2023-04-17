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
  Divider,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Label from '@/components/Label';
import { ContractStatus, Proposals } from '@/models/contracts';
import { SeraContext } from '@/contexts/SeraContext';

interface Filters {
  status?: ContractStatus;
}

const contract: Proposals[] = [
  {
    id: '1',
    buyer: 'Trade 3DC',
    supplier: 'Trade 166',
    country: 'Canada',
    delivery_term: null,
    payment_term: '1123123',
    start_date: '2023/1/5',
    end_date: '2023/1/15',
    status: 'issued'
  },
  {
    id: '2',
    buyer: 'Trade 166c',
    supplier: 'Trade 166',
    country: 'Canada',
    delivery_term: null,
    payment_term: '1123123',
    start_date: '2023/1/5',
    end_date: '2023/1/15',
    status: 'received'
  }
];

const statusOptions = [
  {
    id: 'all',
    name: 'All'
  },
  {
    id: 'received',
    name: 'Received'
  },
  {
    id: 'issued',
    name: 'Issued'
  }
];

const getStatusLabel = (contractStatus: ContractStatus): JSX.Element => {
  const map = {
    received: {
      text: 'Received',
      color: 'success'
    },
    issued: {
      text: 'Issued',
      color: 'warning'
    }
  };
  const { text, color }: any = map[contractStatus];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (
  proposals: Proposals[],
  filters: Filters
): Proposals[] => {
  return proposals.filter((proposal) => {
    let matches = true;

    if (filters.status && proposal.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  proposals: Proposals[],
  page: number,
  limit: number
): Proposals[] => {
  return proposals.slice(page * limit, page * limit + limit);
};

const ProposalssTable = () => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [searchText, setSearchText] = useState<string>('');
  const { proposals, SetProposals } = useContext(SeraContext);
  const [filteredProposals, setFilteredProposals] = useState<Proposals[]>([]);
  const [filters, setFilters] = useState<Filters>({
    status: null
  });

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
    setFilteredProposals(
      proposals.filter((item) => item.buyer.includes(event.target.value))
    );
  };

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const paginatedProposals = applyPagination(
    applyFilters(filteredProposals, filters),
    page,
    limit
  );

  useEffect(() => {
    SetProposals(contract);
    setFilteredProposals(contract);
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
          label="Search By Buyer."
          variant="outlined"
          value={searchText}
          onChange={handleSearch}
        />
      </Box>
      <CardHeader
        action={
          <Box width={150}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status || 'all'}
                onChange={handleStatusChange}
                label="Status"
                autoWidth
              >
                {statusOptions.map((statusOption) => (
                  <MenuItem key={statusOption.id} value={statusOption.id}>
                    {statusOption.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        }
        title="Recent Proposals"
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Proposal ID</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Delivery Term</TableCell>
              <TableCell>Payment Term</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProposals.map((contract, index) => {
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
                      {contract.id}
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
                      {contract.buyer}
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
                      {contract.supplier}
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
                      {contract.country}
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
                      {contract.delivery_term}
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
                      {contract.payment_term}
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
                      {contract.start_date}
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
                      {contract.end_date}
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
                      {getStatusLabel(contract.status)}
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
          count={proposals.length}
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

export default ProposalssTable;
