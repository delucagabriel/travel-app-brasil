import * as React from 'react';
import HocCard from '../HOC/HocCardCard';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { Grid, Avatar, Paper, Typography, makeStyles, Theme, createStyles, Card, CardContent } from '@material-ui/core';
import { useContext, useState, useEffect } from 'react';
import { Context } from '../Context';
import DoneAllSharpIcon from '@material-ui/icons/DoneAllSharp';
import PersonAddSharpIcon from '@material-ui/icons/PersonAddSharp';
import TimerIcon from '@material-ui/icons/Timer';
import { useHistory } from 'react-router-dom';

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
  const history = useHistory();
  const { employeeInfos, allRequests } = useContext(Context);
  const [pendingReqTotal, setPendingReqTotal] = useState(0);
  const [completedReqTotal, setCompletedReqTotal] = useState(0);
  const [allReqTotal, setAllReqTotal] = useState(0);

  const handleStatistics = async()=>{
    setPendingReqTotal( allRequests.filter( req => req.STATUS_APROVACAO === "Aprovado" && req.STATUS != "Sucesso" && req.STATUS != "Rejeitado" ).length );
    setCompletedReqTotal( allRequests.filter( req => req.STATUS == "Sucesso" || req.STATUS == "Rejeitado" ).length );
    setAllReqTotal( allRequests.length );
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
                    Aqui está o que precisamos resolver
                  </Typography>
              </Grid>
          </Grid>
        </Paper>
      </Grid>
      
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Card style={{cursor:"pointer"}} onClick={ ()=> history.push('/cadastrarEmpregado')}>
            <CardContent>
              <PersonAddSharpIcon style={{ fontSize: 100, opacity:"0.3", alignSelf:"center"}}/> 
                <Typography align="center" variant="subtitle1" component="p">
                    Cadastrar Empregado
                </Typography>
            </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <HocCard content="Solicitações pendentes" 
          qtd={pendingReqTotal} 
          destination="/todasSolicitacoesPendentes" 
          icon={<TimerIcon style={{ fontSize: 60, opacity:"0.3" }}/>}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <HocCard content="Solicitações concluídas" 
          qtd={completedReqTotal} 
          destination="/todasSolicitacoesConcluidas" 
          icon={<DoneAllSharpIcon style={{ fontSize: 60, opacity:"0.3" }}/>}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <HocCard content="Todas solicitações" 
          qtd={allReqTotal} 
          destination="/todasSolicitacoes" 
          icon={<ClearAllIcon style={{ fontSize: 100, opacity:"0.3" }}/>}
        />
      </Grid>
      

    </Grid>
  );
}
