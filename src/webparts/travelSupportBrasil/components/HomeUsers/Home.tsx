import * as React from 'react';
import HocCard from '../HOC/HocCardCard';
import { Grid, Avatar, Paper, Typography, makeStyles, Theme, createStyles } from '@material-ui/core';
import { useContext, useState, useEffect } from 'react';
import { Context } from '../Context';
import DoneAllSharpIcon from '@material-ui/icons/DoneAllSharp';
import TimerIcon from '@material-ui/icons/Timer';

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

export default function Home() {
  const classes = useStyles();
  const { employeeInfos, myRequests } = useContext(Context);
  const [pendingReqTotal, setPendingReqTotal] = useState(0);
  const [completedReqTotal, setCompletedReqTotal] = useState(0);

  useEffect(()=> {
    setPendingReqTotal(myRequests.filter(req => req.STATUS.toLowerCase() !== 'sucesso' && req.STATUS.toLowerCase() !== 'rejeitado').length);
    setCompletedReqTotal(myRequests.filter(req => req.STATUS.toLowerCase() == 'sucesso' || req.STATUS.toLowerCase() == 'rejeitado').length);
  }, [myRequests]);


  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={12} >
        <Paper style={{ padding:"10px" }}>
          <Grid className={classes.informationDiv} container xs={12} sm={12} md={12} lg={12} spacing={2}>
              <Grid container item xs={12} sm={6} md={6} lg={6} direction="column" alignItems="center" justify="center" alignContent="center">
                <Avatar style={{height:"80px", width:"80px"}} alt={employeeInfos && employeeInfos.Title}
                src={employeeInfos && employeeInfos.Photo} />
                  <Typography variant="subtitle1">
                    Olá, { employeeInfos && employeeInfos.Title.split(" ")[0]}!
                  </Typography>
                  <Typography variant="subtitle2">
                    Essa é a sua história aqui conosco
                  </Typography>
              </Grid>
              <Grid className={classes.information} item xs={6} sm={6} md={6} lg={6} direction="column" >
                <Typography variant="body2">
                  ID: {employeeInfos && employeeInfos.IAM_ACCESS_IDENTIFIER}
                </Typography>
                <Typography variant="body2">
                  Função: {employeeInfos && employeeInfos.JOB_DESCRIPTION}
                </Typography>
                <Typography variant="body2">
                  Empresa: {employeeInfos && employeeInfos.COMPANY_DESC}
                </Typography>
                <Typography variant="body2">
                  País: {employeeInfos && employeeInfos.FACILITY_COUNTRY}
                </Typography>
                <Typography variant="body2">
                  UF: {employeeInfos && employeeInfos.FACILITY_PROVINCE}
                </Typography>
                <Typography variant="body2">
                  Cidade: {employeeInfos && employeeInfos.FACILITY_CITY}
                </Typography>
              </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <HocCard content="Solicitações pendentes" qtd={pendingReqTotal} destination="/minhasSolicitacoesPendentes" icon={<TimerIcon style={{ fontSize: 60, opacity:"0.3" }}/>}/>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <HocCard content="Solicitações concluídas" qtd={completedReqTotal} destination="/minhasSolicitacoesConcluidas" icon={<DoneAllSharpIcon style={{ fontSize: 60, opacity:"0.3" }}/>}/>
      </Grid>

    </Grid>
  );
}
