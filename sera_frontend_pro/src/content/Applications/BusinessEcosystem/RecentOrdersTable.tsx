import { FC, ChangeEvent, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  Rating,
  Tooltip
} from '@mui/material';

import { BusinessPartner } from '@/models/business_partner';

interface RecentOrdersTableProps {
  className?: string;
  businessPartner: BusinessPartner[];
}

const applyPagination = (
  businessPartner: BusinessPartner[],
  page: number,
  limit: number
): BusinessPartner[] => {
  return businessPartner.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ businessPartner }) => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const paginatedBusinessPartner = applyPagination(
    businessPartner,
    page,
    limit
  );

  return (
    <>
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
            {paginatedBusinessPartner.map((businessPartner) => {
              return (
                <TableRow hover key={businessPartner.id}>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {businessPartner.t_name}
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
                      {businessPartner.l_name}
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
                      {businessPartner.country}
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
                      {businessPartner.state_town}
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
                      {businessPartner.b_number}
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
                      {businessPartner.email}
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
                      {businessPartner.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={businessPartner.w_address}
                      placement="top-start"
                    >
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {businessPartner.w_address.substring(0, 5) +
                          ' ... ' +
                          businessPartner.w_address.substring(38)}
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
                        value={businessPartner.reputation}
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
          count={businessPartner.length}
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

RecentOrdersTable.propTypes = {
  businessPartner: PropTypes.array.isRequired
};

RecentOrdersTable.defaultProps = {
  businessPartner: []
};

export default RecentOrdersTable;
