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
import { SeraContext } from '@/contexts/SeraContext';
import { Materials } from '@/models/applications/materials';

const materialsData: Materials[] = [
  {
    id: '1',
    name: 'MATERIAL1',
    pub_number: 'MAT1',
    producer: '0x3dC4696671ca3cb6C34674A0c1729bbFcC29EDdc'
  },
  {
    id: '2',
    name: 'MATERIAL1',
    pub_number: 'MAT1',
    producer: '0x3dC4696671ca3cb6C34674A0c1729bbFcC2weDdc'
  }
];

const applyPagination = (
  materials: Materials[],
  page: number,
  limit: number
): Materials[] => {
  return materials.slice(page * limit, page * limit + limit);
};

const MaterialssTable = () => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [searchText, setSearchText] = useState<string>('');
  const { materials, SetMaterials } = useContext(SeraContext);
  const [filteredMaterials, setFilteredMaterial] = useState<Materials[]>([]);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
    setFilteredMaterial(
      materials.filter((item) => item.producer.includes(event.target.value))
    );
  };

  const paginatedMaterials = applyPagination(filteredMaterials, page, limit);

  useEffect(() => {
    SetMaterials(materialsData);
    setFilteredMaterial(materialsData);
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
              <TableCell align="center">Material ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Publish Number</TableCell>
              <TableCell>Producer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedMaterials.map((material) => {
              return (
                <TableRow hover key={material.id}>
                  <TableCell align="center">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {material.id}
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
                      {material.name}
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
                      {material.pub_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={material.producer} placement="top-start">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {material.producer.substring(0, 5) +
                          ' ... ' +
                          material.producer.substring(38)}
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
          count={materials.length}
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

export default MaterialssTable;
