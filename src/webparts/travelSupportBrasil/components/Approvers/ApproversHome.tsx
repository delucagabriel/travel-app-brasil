import * as React from 'react';
import HocCard from '../HOC/HocCardCard';
import { Grid, Avatar, Paper, Typography, makeStyles, Theme, createStyles, Card, CardContent } from '@material-ui/core';
import { useContext, useState, useEffect } from 'react';
import { Context } from '../Context';
import DoneAllSharpIcon from '@material-ui/icons/DoneAllSharp';
import TimerIcon from '@material-ui/icons/Timer';
import * as moment from 'moment';
import { IRequests_AllFields } from '../../Interfaces/Requests/IRequests';

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

export function ApproversHome() {
  const classes = useStyles();
  const { employeeInfos, allRequests, myApprovals } = useContext(Context);
  const [pendingReqTotal, setPendingReqTotal] = useState(0);
  const [completedReqTotal, setCompletedReqTotal] = useState(0);

  const handleStatistics = async()=>{
    setPendingReqTotal( myApprovals.filter( (req:IRequests_AllFields) => req.STATUS_APROVACAO.toLowerCase() === "pendente").length );
    setCompletedReqTotal( myApprovals.filter( (req:IRequests_AllFields) => req.STATUS_APROVACAO.toLowerCase() !== "pendente" 
      && req.STATUS_APROVACAO.toLowerCase() !== "cancelado" ).length );
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
                    Olá, { employeeInfos && employeeInfos.Title.split(" ")[0]}!
                  </Typography>
                  <Typography variant="subtitle2">
                    Aqui estão os números relacionados à aprovações
                  </Typography>
              </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <HocCard content="Aprovações pendentes" 
          qtd={pendingReqTotal} 
          destination="/aprovacoesPendentes" 
          icon={<TimerIcon style={{ fontSize: 60, opacity:"0.3" }}/>}/>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <HocCard content="Aprovações concluídas" 
          qtd={completedReqTotal} 
          destination="/aprovacoesConcluidas" 
          icon={<DoneAllSharpIcon style={{ fontSize: 60, opacity:"0.3" }}/>}/>
      </Grid>

      
    </Grid>
  );
}
