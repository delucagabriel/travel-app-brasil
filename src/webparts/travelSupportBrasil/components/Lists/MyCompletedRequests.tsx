import * as React from 'react';
import { useContext, useState } from 'react';
import { Context } from '../Context';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Grid, Dialog, Hidden, Button } from '@material-ui/core';
import { RequestDetailsComponent } from '../Details/RequestDetailsComponent';
import CloseIcon from '@material-ui/icons/Close';



export default function MyCompletedRequests() {
  const { myRequests } = useContext(Context);
  const [requestDetails, setRequestDetails] = useState({...myRequests[0], open:false});
  return (
    <Grid container>
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
                  <TableCell variant="head" align="center">Status: Aprovação</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Status: Atendimento</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Empregado</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Criação</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Modificação</TableCell>
                </Hidden>
            </TableRow>
          </TableHead>
          <TableBody>
            {myRequests
            .filter(request => request.STATUS === "Sucesso" || request.STATUS === "Rejeitado" )
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


