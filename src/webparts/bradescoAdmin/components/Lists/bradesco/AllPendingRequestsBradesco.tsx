import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Grid, Dialog, Hidden, Button, Snackbar, Select, MenuItem, FormLabel } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import { Context } from '../../../../travelSupportBrasil/components/Context';
import ServiceApproval from '../../../../travelSupportBrasil/components/Forms/ServiceApproval';
import { HocRenderDetails } from '../../../../travelSupportBrasil/components/HOC/HocRenderDetails';
import { ISnack } from '../../../../travelSupportBrasil/Interfaces/ISnack';
import { IRequests_AllFields } from '../../../../travelSupportBrasil/Interfaces/Requests/IRequests';


export default function AllPendingRequestsBradesco() {
  const { allRequestsBradesco } = useContext(Context);
  const [requestDetails, setRequestDetails] = useState({...allRequestsBradesco[0], open:false});
  const [filter, setFilter] = useState({
    macroprocesso: '',
    processo: ''
  });
  const [solicitacoesFiltradas, setSolicitacoesFiltradas] = useState<IRequests_AllFields[]>(
    allRequestsBradesco.filter( (req:IRequests_AllFields) => req.STATUS_APROVACAO === "Aprovado" && ( req.STATUS !== "Sucesso" && req.STATUS !== "Rejeitado"))
    );
  const [snackMessage, setSnackMessage] = useState<ISnack>({
    open: false,
    message: "",
    severity:'info'
  });

  useEffect(()=>setSolicitacoesFiltradas(allRequestsBradesco.filter( (req:IRequests_AllFields) => req.STATUS_APROVACAO === "Aprovado" && ( req.STATUS !== "Sucesso" && req.STATUS !== "Rejeitado") && req.AREA_RESOLVEDORA === 'Bradesco')) , [allRequestsBradesco]);

  useEffect(()=>setSolicitacoesFiltradas(allRequestsBradesco
    .filter( (req:IRequests_AllFields) => req.STATUS_APROVACAO === "Aprovado" && ( req.STATUS !== "Sucesso" && req.STATUS !== "Rejeitado"))
    .filter(request => request.MACROPROCESSO.includes(filter.macroprocesso))
    .filter(request => request.PROCESSO.includes(filter.processo))), [filter]);

  const onChildChanged = callback => {
    setSnackMessage(callback.snack);
    setRequestDetails({...requestDetails, open:callback.dialogOpen});
  };

  const unique = arr => arr.filter((el, i, array) => array.indexOf(el) === i);
  const uniqueMacroprocesso = unique(allRequestsBradesco.map(row => row.MACROPROCESSO));
  const uniqueProcesso = unique(solicitacoesFiltradas.map(row => row.PROCESSO));

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
        <FormLabel id="filtro_macro" component="legend">Macroprocesso</FormLabel>
        <Select
          fullWidth
          id="filtro_macro"
          onChange={e=> setFilter({...filter, macroprocesso:String(e.target.value)})}>
            <MenuItem value=''>Tudo</MenuItem>
            {
              uniqueMacroprocesso.map(row => <MenuItem value={row}>{row}</MenuItem>)
            }
        </Select>
      </Grid>
      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
        <FormLabel id="filtro_processo" component="legend">Processo</FormLabel>
        <Select
          fullWidth
          id="filtro_processo"
          onChange={e=> setFilter({...filter, processo:String(e.target.value)})}
        >
          <MenuItem value=''>Tudo</MenuItem>
          {
            uniqueProcesso.map(row => <MenuItem value={row}>{row}</MenuItem>)
          }
        </Select>
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
                  <TableCell variant="head" align="center">Data da aprovação</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Data limite (SLA)</TableCell>
                </Hidden>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                solicitacoesFiltradas
                  .sort((a, b) => {
                    let r = 0;
                    if(a.DATA_FIM_ATENDIMENTO < b.DATA_FIM_ATENDIMENTO) r = -1;
                    if(a.DATA_FIM_ATENDIMENTO > b.DATA_FIM_ATENDIMENTO) r = 1;
                    return r;
                  })
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
                        <TableCell variant="body" align="center">{row.DATA_DE_APROVACAO}</TableCell>
                      </Hidden>
                      <Hidden smDown>
                        <TableCell variant="body" align="center">{row.DATA_FIM_ATENDIMENTO}</TableCell>
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
              <ServiceApproval request={requestDetails} callbackParent={cb => onChildChanged(cb)}/>
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

