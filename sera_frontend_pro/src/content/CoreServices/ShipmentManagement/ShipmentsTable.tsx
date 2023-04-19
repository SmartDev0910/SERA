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
import { Shipment, ShipmentStatus } from '@/models/core-services/shipment';
import { SeraContext } from '@/contexts/SeraContext';

const shipmentsData: Shipment[] = [
  {
    po_id: '1',
    importer: 'Trade 3DC',
    delivery_term: null,
    payment_term: '12000',
    status: 'pending'
  }
];

const getStatusLabel = (shipmentStatus: ShipmentStatus): JSX.Element => {
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

  const { text, color }: any = map[shipmentStatus];

  return <Label color={color}>{text}</Label>;
};

const applyPagination = (
  shipments: Shipment[],
  page: number,
  limit: number
): Shipment[] => {
  return shipments.slice(page * limit, page * limit + limit);
};

const ShipmentsDialog = () => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [searchText, setSearchText] = useState<string>('');
  const { shipments, SetShipments } = useContext(SeraContext);
  const [filteredPartner, setFilteredPartner] = useState<Shipment[]>([]);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
    setFilteredPartner(
      shipments.filter((item) => item.importer.includes(event.target.value))
    );
  };

  const paginatedShipment = applyPagination(filteredPartner, page, limit);

  useEffect(() => {
    SetShipments(shipmentsData);
    setFilteredPartner(shipmentsData);
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
              <TableCell>Importer</TableCell>
              <TableCell>Delivery Term</TableCell>
              <TableCell>Payment Term</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedShipment.map((shipment, index) => {
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
                      {shipment.po_id}
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
                      {shipment.importer}
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
                      {shipment.delivery_term}
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
                      {shipment.payment_term}
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
                      {getStatusLabel(shipment.status)}
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
          count={shipments.length}
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

export default ShipmentsDialog;
