import * as React from 'react';
import { 
    Grid, 
    Typography, 
    makeStyles, 
    Theme, 
    createStyles, 
    Card, 
    CardContent 
} from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SpellcheckSharpIcon from '@material-ui/icons/SpellcheckSharp';
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

export default function HomePage() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={6} lg={6} >
        <Card style={{cursor:"pointer"}} onClick={ ()=> history.push('/solicitacoes')}>
            <CardContent>
             <AssignmentIcon style={{ fontSize: 100, opacity:"0.3" }}/> 
                <Typography align="center" variant="subtitle2" component="p">
                    Área do solicitante
                </Typography>
            </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
      <Card style={{cursor:"pointer"}} onClick={ ()=> history.push('/aprovacoes')}>
            <CardContent>
             <SpellcheckSharpIcon style={{ fontSize: 100, opacity:"0.3", alignSelf:"center"}}/> 
                <Typography align="center" variant="subtitle2" component="p">
                    Área do aprovador
                </Typography>
            </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
}
