import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Context } from '../Utils/Context';
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
    setFilteredRequests(allRequests.filter(request => request.Status === "Success" || request.Status === "Unsuccess" ));
  }, [allRequests]);

  const handleFilter= event => setFilter(event.target.value.toLowerCase());

  useEffect(()=>{
    setFilteredDownload(filteredRequests.filter( row => row.EmployeeName.includes(filter) ));
  }, [filter]);

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <TextField label="Beneficiary filter" variant="outlined" onChange={handleFilter}/>
        <Button color='secondary' style={{float:'right'}}>
          <CSVLink
            data={filteredDownload}
            filename={"requests.csv"}
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
                  <TableCell variant="head" align="center">Process</TableCell>
                </Hidden>
              <Hidden smDown>
                  <TableCell variant="head" align="center">Approval Status</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Service Status</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell variant="head" align="center">Beneficiary</TableCell>
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
            {filteredRequests
              .filter(row => row.EmployeeName.toLowerCase().includes(filter))
              .map((row) => (
              <TableRow key={row.Id} onClick={() =>setRequestDetails({...row, open:true})}>
                <TableCell align="center">{row.Id}</TableCell>
                <TableCell align="center">{row.Status}</TableCell>
                <Hidden smDown>
                    <TableCell variant="body" align="center">{row.Process}</TableCell>
                  </Hidden>
                  <Hidden smDown>
                    <TableCell variant="body" align="center">{row.ApprovalStatus}</TableCell>
                  </Hidden>
                  <Hidden smDown>
                    <TableCell variant="body" align="center">{row.ServiceStatus}</TableCell>
                  </Hidden>
                  <Hidden smDown>
                    <TableCell variant="body" align="center">{row.EmployeeName}</TableCell>
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


