import * as React from 'react';
import { useContext, useState } from 'react';
import { Context } from '../Context';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Grid, Dialog, Hidden, Button, Snackbar } from '@material-ui/core';
import { RequestDetailsComponent } from '../Details/RequestDetailsComponent';
import ServiceApproval from '../Forms/ServiceApproval';
import { Alert, AlertProps } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';


interface ISnack extends AlertProps {
  open: boolean;
  message: string;
}

export default function AllPendingRequests() {
  const { allRequests } = useContext(Context);
  const [requestDetails, setRequestDetails] = useState({...allRequests[0], open:false});
  const [filter, setFilter] = useState('');
  const [snackMessage, setSnackMessage] = useState<ISnack>({
    open: false,
    message: "",
    severity:'info'
  });

  const onChildChanged = callback => {
    setSnackMessage(callback.snack);
    setRequestDetails({...requestDetails, open:callback.dialogOpen});
  };

  const unique = arr => arr.filter((el, i, array) => array.indexOf(el) === i);

  const processButtons = unique(allRequests.filter(request => request.STATUS_APROVACAO === 'Aprovado' && (request.STATUS !== "Successo" && request.STATUS !=="Rejeitado")).map(row => row.PROCESSO));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Grid container xs={12} sm={12} md={12} lg={12} xl={12} justify='space-between' alignItems="center">
        <Button variant="outlined" color="secondary" onClick={()=> setFilter('')}> All </Button>
        {
          processButtons.map(row => <Button variant="outlined" color="secondary" onClick={()=> setFilter(row)}> { row } </Button>)
        }
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell variant="head">#</TableCell>
                <TableCell variant="head" align="center">Status</TableCell>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Processo</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Status da aprovação</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Status do atendimento</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Beneficiário</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Created</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Modified</TableCell>
                </Hidden>
              </TableRow>
            </TableHead>
            <TableBody>
              {allRequests
              .filter(request => request.STATUS_APROVACAO === 'Aprovado' && (request.STATUS !== "Successo" && request.STATUS !=="Rejeitado") )
              .filter(request => request.PROCESSO.includes(filter))
              .map((row) => (
                <TableRow key={row.Id}
                  onClick={() =>setRequestDetails({...row, open:true})}
                >
                  <TableCell variant="body" align="center">{row.Id}</TableCell>
                  <TableCell variant="body" align="center">{row.STATUS}</TableCell>
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
        <Dialog fullScreen open={requestDetails.open} onClose={()=> setRequestDetails({...requestDetails, open:false})}
          aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
        >
          <Button variant="contained"
          onClick={()=> setRequestDetails({...requestDetails, open:false})}
          >
            <CloseIcon/>
          </Button>
          <RequestDetailsComponent requestDetails={requestDetails}>
            <ServiceApproval request={requestDetails} callbackParent={cb => onChildChanged(cb)}/>
          </RequestDetailsComponent>

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

