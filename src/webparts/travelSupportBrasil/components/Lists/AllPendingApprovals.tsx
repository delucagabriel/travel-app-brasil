import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Context } from '../Context';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Grid, Dialog, Hidden, Button, Snackbar, Select, MenuItem, FormLabel, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import { HocRenderDetails } from '../HOC/HocRenderDetails';
import { ISnack } from '../../Interfaces/ISnack';
import { IRequests_AllFields } from '../../Interfaces/Requests/IRequests';
import RequestApproval from '../Forms/RequestApproval';

export default function AllPendingApprovals() {
  const { myApprovals } = useContext(Context);
  const [requestDetails, setRequestDetails] = useState({...myApprovals[0], open:false});
  const [filter, setFilter] = useState('');
  const [solicitacoesFiltradas, setSolicitacoesFiltradas] = useState<IRequests_AllFields[]>(
    myApprovals.filter( (req:IRequests_AllFields) => req.STATUS_APROVACAO.toLocaleLowerCase() === "pendente")
    );
  const [snackMessage, setSnackMessage] = useState<ISnack>({
    open: false,
    message: "",
    severity:'info'
  });
  const handleFilterId= event => setFilter(event.target.value as string);

  useEffect(()=>setSolicitacoesFiltradas(
    myApprovals.filter( (req:IRequests_AllFields) => req.STATUS_APROVACAO.toLocaleLowerCase() === "pendente")
  ), [myApprovals]);

  useEffect(()=>setSolicitacoesFiltradas(myApprovals
    .filter( (req:IRequests_AllFields) => req.STATUS_APROVACAO.toLocaleLowerCase() === "pendente")
    .filter(request => String(request.Id).includes(filter))
  ), [filter]);

  const onChildChanged = callback => {
    setSnackMessage(callback.snack);
    setRequestDetails({...requestDetails, open:callback.dialogOpen});
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <TextField label="Nº Chamado" type="text" variant="outlined" onChange={handleFilterId}/>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell variant="head">#</TableCell>
                <TableCell variant="head" align="center">Status</TableCell>
                <TableCell variant="head" align="center">Macroprocesso</TableCell>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Processo</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Criado em</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Modificado em</TableCell>
                </Hidden>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                solicitacoesFiltradas
                  .reverse()
                  .map((row) => (
                    <TableRow key={row.Id}
                      onClick={() =>setRequestDetails({...row, open:true})}
                    >
                      <TableCell variant="body" align="center">{row.Id}</TableCell>
                      <TableCell variant="body" align="center">{row.STATUS}</TableCell>
                      <TableCell variant="body" align="center">{row.MACROPROCESSO}</TableCell>
                      <Hidden smDown>
                        <TableCell variant="body" align="center">{row.PROCESSO}</TableCell>
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
        <Dialog fullScreen open={requestDetails.open} onClose={()=> setRequestDetails({...requestDetails, open:false})}
          aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
        >
          <Button variant="contained"
          onClick={()=> setRequestDetails({...requestDetails, open:false})}
          >
            <CloseIcon/>
          </Button>
            <HocRenderDetails type={requestDetails.MACROPROCESSO} details={requestDetails}>
              <RequestApproval request={requestDetails} callbackParent={cb => onChildChanged(cb)}/>
            </HocRenderDetails>
        </Dialog>
      </Grid>

      <Snackbar
        anchorOrigin={{ vertical:'top', horizontal:'right' }}
        open={snackMessage.open}
        onClose={()=>setSnackMessage({...snackMessage, open:false})}
        key={'top' + 'right'}
      >
        <Alert onClose={()=>setSnackMessage({...snackMessage, open:false})} severity={snackMessage.severity}>
          {snackMessage.message}
        </Alert>
      </Snackbar>

    </Grid>

  );
}

