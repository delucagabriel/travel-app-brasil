import * as React from 'react';
import HocCard from '../HOC/HocCardCard';
import { Grid, Avatar, Paper, Typography, makeStyles, Theme, createStyles, Card, CardContent } from '@material-ui/core';
import { useContext, useState, useEffect } from 'react';
import { Context } from '../Utils/Context';
import DoneAllSharpIcon from '@material-ui/icons/DoneAllSharp';
import TimerIcon from '@material-ui/icons/Timer';
import * as moment from 'moment';

const countOccurrences = arr => arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {});
const unique = arr => arr.reduce((acc, el) => acc.includes(el) ? acc : [...acc, el], []);
const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
const averagePerDay = arr => {
  const occurrences = countOccurrences( arr.map( req => moment(req.Created).format('YYYY-MM-DD') ) );
  return Math.round( average( Object.keys(occurrences).map(key => occurrences[key]) ) );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    informationDiv: {
      [theme.breakpoints.up('sm')]: {
        justify:"space-between"
      },
      [theme.breakpoints.down('xs')]: {
        alignItems:"center",
        justify:"center",
        alignContent:"center"
      },

    },
    information: {
      [theme.breakpoints.down('xs')]: {
        display:"none"
      },
    }
  })
);

export function SupportHome() {
  const classes = useStyles();
  const { employeeInfos, allRequests } = useContext(Context);
  const [pendingReqTotal, setPendingReqTotal] = useState(0);
  const [completedReqTotal, setCompletedReqTotal] = useState(0);
  const [uniqueRequesters, setUniqueRequesters] = useState(0);
  const [employeesServed, setEmployeesServed] = useState(0);
  const [averageRequestsPerDay, setAverageRequestsPerDay] = useState(0);
  const [requestsInThisYear, setRequestsInThisYear] = useState(0);

  const handleStatistics = async()=>{
    setUniqueRequesters( unique( allRequests.map( req => req.Author.Title ) ).length );
    setEmployeesServed( unique( allRequests.map( req => req.BeneficiaryID ) ).length );
    setAverageRequestsPerDay( averagePerDay( allRequests ) );
    setRequestsInThisYear( allRequests.filter( req => moment(req.Created).year === moment().year ).length );
    setPendingReqTotal( allRequests.filter( req => req.ApprovalStatus === 'Approved' && ( req.Status !== 'Success' && req.Status !== 'Unsuccess' ) ).length );
    setCompletedReqTotal( allRequests.filter( req => req.Status === 'Success' || req.Status === 'Unsuccess' ).length );
  };

  useEffect(()=> {
    handleStatistics();
  }, [allRequests]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={12} >
        <Paper style={{ padding:"10px" }}>
          <Grid className={classes.informationDiv} container xs={12} sm={12} md={12} lg={12} spacing={2}>
              <Grid container item xs={12} sm={12} md={12} lg={12} direction="column" alignItems="center" justify="center" alignContent="center">
                <Avatar style={{height:"80px", width:"80px"}} alt={employeeInfos && employeeInfos.Title}
                src={employeeInfos && employeeInfos.Photo} />
                  <Typography variant="subtitle1">
                    Hello, { employeeInfos && employeeInfos.Title.split(" ")[0]}!
                  </Typography>
                  <Typography variant="subtitle2">
                    This is what we have to do
                  </Typography>
              </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <HocCard content="Pending  requests " qtd={pendingReqTotal} destination="/all-pending-requests" icon={<TimerIcon style={{ fontSize: 60, opacity:"0.3" }}/>}/>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <HocCard content="Completed requests" qtd={completedReqTotal} destination="/all-completed-requests" icon={<DoneAllSharpIcon style={{ fontSize: 60, opacity:"0.3" }}/>}/>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Card>
          <CardContent>
            <Typography align="center" variant="h6" component="header">
              Some Statistics
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Card>
          <CardContent>
            <Typography align="center" variant="h5" component="p">
              { uniqueRequesters }
            </Typography>
            <Typography align="center" variant="subtitle1" component="p">
              Unique requesters
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Card>
          <CardContent>
            <Typography align="center" variant="h5" component="p">
            { employeesServed }
            </Typography>
            <Typography align="center" variant="subtitle1" component="p">
              Employees served
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Card>
          <CardContent>
            <Typography align="center" variant="h5" component="p">
            { averageRequestsPerDay }
            </Typography>
            <Typography align="center" variant="subtitle1" component="p">
              Average requests per day
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <Card>
          <CardContent>
            <Typography align="center" variant="h5" component="p">
            { requestsInThisYear }
            </Typography>
            <Typography align="center" variant="subtitle1" component="p">
              Requests in this year
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
