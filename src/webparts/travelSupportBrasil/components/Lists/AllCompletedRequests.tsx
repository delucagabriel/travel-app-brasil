import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Context } from '../Context';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Grid, Dialog, Hidden, TextField, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { HocRenderDetails } from '../HOC/HocRenderDetails';
import { IRequests_AllFields } from '../../Interfaces/Requests/IRequests';

interface IRequest extends IRequests_AllFields {
  open:boolean;
}

export default function AllCompletedRequests() {
  const { allRequests } = useContext(Context);
  const [requestDetails, setRequestDetails] = useState<IRequest>({...allRequests[0], open:false});
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(()=>{
    setFilteredRequests(allRequests.filter(request => request.STATUS.toLowerCase() === "sucesso" || request.STATUS.toLowerCase() === "rejeitado" ));
  }, [allRequests]);

  const handleFilter= event => setFilter(event.target.value as string);

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <TextField label="Nº Chamado" type="text" variant="outlined" onChange={handleFilter}/>
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
                  <TableCell variant="head" align="center">Data de abertura</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Data da última modificação</TableCell>
                </Hidden>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests
              .filter( row => String(row.Id).includes( filter ))
              .reverse()
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
        <HocRenderDetails
          type={requestDetails.MACROPROCESSO}
          details={requestDetails}
        />
      </Dialog>
      </Grid>
    </Grid>

  );
}


