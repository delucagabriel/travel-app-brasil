import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Context } from '../Context';
import { CSVLink } from "react-csv";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Grid, Dialog, Hidden, TextField, Button } from '@material-ui/core';
import { RequestDetailsComponent } from '../Details/RequestDetailsComponent';
import CloseIcon from '@material-ui/icons/Close';



export default function AllCompletedRequests() {
  const { allRequests } = useContext(Context);
  const [requestDetails, setRequestDetails] = useState({...allRequests[0], open:false});
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredDownload, setFilteredDownload] = useState(filteredRequests);


  useEffect(()=>{
    setFilteredRequests(allRequests.filter(request => request.STATUS === "Sucesso" || request.STATUS === "Rejeitado" ));
  }, [allRequests]);

  const handleFilter= event => setFilter(event.target.value.toLowerCase());

  useEffect(()=>{
    setFilteredDownload(filteredRequests.filter( row => row.BENEFICIARIO_NOME.includes(filter) ));
  }, [filter]);

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <TextField label="Beneficiário" variant="outlined" onChange={handleFilter}/>
        <Button color='secondary' style={{float:'right'}}>
          <CSVLink
            data={filteredDownload}
            filename={"TS+Brasil_SOLICITACOES.csv"}
            style={{textDecoration:'none'}}
          >
            Export
          </CSVLink>
        </Button>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="center">Status</TableCell>
              <Hidden smDown>
                  <TableCell variant="head" align="center">Processo</TableCell>
                </Hidden>
              <Hidden smDown>
                  <TableCell variant="head" align="center">Status de aprovação</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Status do atendimento</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Beneficiário</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Data de abertura</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Data da última modificação</TableCell>
                </Hidden>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests
              .filter(row => row.BENEFICIARIO_NOME.toLowerCase().includes(filter))
              .map((row) => (
              <TableRow key={row.Id} onClick={() =>setRequestDetails({...row, open:true})}>
                <TableCell align="center">{row.Id}</TableCell>
                <TableCell align="center">{row.STATUS}</TableCell>
                <Hidden smDown>
                    <TableCell variant="body" align="center">{row.PROCESSO}</TableCell>
                  </Hidden>
                  <Hidden smDown>
                    <TableCell variant="body" align="center">{row.STATUS_APROVACAO}</TableCell>
                  </Hidden>
                  <Hidden smDown>
                    <TableCell variant="body" align="center">{row.STATUS_ATENDIMENTO}</TableCell>
                  </Hidden>
                  <Hidden smDown>
                    <TableCell variant="body" align="center">{row.BENEFICIARIO_NOME}</TableCell>
                  </Hidden>
                  <Hidden smDown>
                    <TableCell variant="body" align="center">{row.Created}</TableCell>
                  </Hidden>
                  <Hidden smDown>
                    <TableCell variant="body" align="center">{row.Modified}</TableCell>
                  </Hidden>
              </TableRow>
            ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        fullScreen
        open={requestDetails.open}
        onClose={()=> setRequestDetails({...requestDetails, open:false})}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Button variant="contained"
          onClick={()=> setRequestDetails({...requestDetails, open:false})}
          >
          <CloseIcon/>
        </Button>
        <RequestDetailsComponent requestDetails={requestDetails}/>
      </Dialog>
      </Grid>
    </Grid>

  );
}


