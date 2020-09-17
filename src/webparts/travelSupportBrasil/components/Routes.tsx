import * as React from 'react';
import { useContext } from 'react';
import { Switch, Route, HashRouter, Redirect } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Home from './HomeUsers/Home';
import MyPendingRequests from './Lists/MyPendingRequests';
import MyCompletedRequests from './Lists/MyCompletedRequests';
import NewCreditCard from './Forms/cartoes/NewCreditCard';
import CancelCard from './Forms/cartoes/CancelCard';
import ChangeLimit from './Forms/cartoes/LimitChange';
import Menu from './Drawer/Menu';

import { SupportHome } from './AdminTravel/SupportHome';
import AllPendingRequests from './Lists/AllPendingRequests';
import AllCompletedRequests from './Lists/AllCompletedRequests';
import { InsertOrUpdateEmployees } from './InsertOrUpdateEmployees';
import { Context } from './Context';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#007e7a',
    },
    secondary: {
      main: '#ff9800',
    },
  },
});

const NotFound = ()=> <h1>Página não encontrada :( </h1>;


export const Routes = ()=>{
  const { employeeInfos } = useContext(Context);

  function PrivateRoute({ children, ...rest }) {
    return (
      <Route {...rest } render={
        ({ location }) => employeeInfos && employeeInfos.isAdmin ? ( children ) : ( <Redirect to={{ pathname: "/",  state: { from: location } }} /> )
        }
      />
    );
  }

  return (
    <HashRouter>
      <ThemeProvider theme={theme}>
        <Menu>
          <Switch>
          {/* { Public routes } */}
            <Route path="/" exact={true} component={Home} />
            <Route path="/minhasSolicitacoesPendentes" exact={true} component={MyPendingRequests} />
            <Route path="/minhasSolicitacoesConcluidas" exact={true} component={MyCompletedRequests} />
            <Route path="/novoCartao" exact={true} component={NewCreditCard} />
            <Route path="/cancelarCartao" exact={true} component={CancelCard} />
            <Route path="/alterarLimite" exact={true} component={ChangeLimit} />

          {/* { Private routes } */}
            <PrivateRoute path="/todasSolicitacoesPendentes" exact={true} >
              <AllPendingRequests/>
            </PrivateRoute>
            <PrivateRoute path="/todasSolicitacoesConcluidas" exact={true} >
              <AllCompletedRequests/>
            </PrivateRoute>
            <PrivateRoute path="/atendimento" exact={true} >
              <SupportHome/>
            </PrivateRoute>
            <PrivateRoute path="/InsertOrUpdateEmployees" exact={true} >
              <InsertOrUpdateEmployees/>
            </PrivateRoute>

            <Route component={NotFound}/>
          </Switch>
        </Menu>
      </ThemeProvider>
    </ HashRouter>
  );
};
