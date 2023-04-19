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
import { Document, DocumentStatus } from '@/models/core-services/documents';
import { SeraContext } from '@/contexts/SeraContext';

const documentsData: Document[] = [
  {
    partner: '0x3dC4696671ca3cb6C34674A0c1729bbFcC29EDdc',
    document: null,
    document_hash: 'QmaZe7nXMoatJ9vHSdwQmejKhPNAqc7CMWJoBbuSzRoVts',
    status: 'pending'
  }
];

const getStatusLabel = (documentStatus: DocumentStatus): JSX.Element => {
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

  const { text, color }: any = map[documentStatus];

  return <Label color={color}>{text}</Label>;
};

const applyPagination = (
  documents: Document[],
  page: number,
  limit: number
): Document[] => {
  return documents.slice(page * limit, page * limit + limit);
};

const DocumentsTable = () => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [searchText, setSearchText] = useState<string>('');
  const { documents, SetDocuments } = useContext(SeraContext);
  const [filteredPartner, setFilteredPartner] = useState<Document[]>([]);

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
    setFilteredPartner(
      documents.filter((item) => item.partner.includes(event.target.value))
    );
  };

  const paginatedBusinessPartner = applyPagination(
    filteredPartner,
    page,
    limit
  );

  useEffect(() => {
    SetDocuments(documentsData);
    setFilteredPartner(documentsData);
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
              <TableCell align="center">Partner</TableCell>
              <TableCell>Document</TableCell>
              <TableCell>Document Hash</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBusinessPartner.map((document, index) => {
              return (
                <TableRow hover key={index}>
                  <TableCell align="center">
                    <Tooltip title={document.partner} placement="top-start">
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {document.partner.substring(0, 5) +
                          ' ... ' +
                          document.partner.substring(38)}
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
                      {document.document}
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
                      {document.document_hash}
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
                      {getStatusLabel(document.status)}
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
          count={documents.length}
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
