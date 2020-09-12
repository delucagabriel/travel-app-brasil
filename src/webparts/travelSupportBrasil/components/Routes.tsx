import * as React from 'react';
import Home from './HomeUsers/Home';
import MyPendingRequests from './Lists/MyPendingRequests';
import MyCompletedRequests from './Lists/MyCompletedRequests';
import NewCreditCard from './Forms/newCreditCard';
import CancelCard from './Forms/cancelCard';
import ChangeLimit from './Forms/changeLimit';
import { Switch, Route, HashRouter, Redirect } from 'react-router-dom';
import Menu from './Drawer/Menu';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { SupportHome } from './AdminTravel/SupportHome';
import AllPendingRequests from './Lists/AllPendingRequests';
import AllCompletedRequests from './Lists/AllCompletedRequests';
import { InsertOrUpdateEmployees } from './InsertOrUpdateEmployees';
import { useContext } from 'react';
import { Context } from './Utils/Context';

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

const NotFound = ()=> <h1>Page Not Found :( </h1>;


export const Routes = ()=>{
  const { employeeInfos } = useContext(Context);

  function PrivateRoute({ children, ...rest }) {
    return (
      <Route {...rest } render={
        ({ location }) => employeeInfos.isAdmin ? ( children ) : ( <Redirect to={{ pathname: "/",  state: { from: location } }} /> )
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
            <Route path="/my-pending-requests" exact={true} component={MyPendingRequests} />
            <Route path="/my-completed-requests" exact={true} component={MyCompletedRequests} />
            <Route path="/newCreditCard" exact={true} component={NewCreditCard} />
            <Route path="/CancelCard" exact={true} component={CancelCard} />
            <Route path="/ChangeLimit" exact={true} component={ChangeLimit} />
            {/* <Route path="/all-pending-requests" exact={true} component={AllPendingRequests} />
            <Route path="/all-completed-requests" exact={true} component={AllCompletedRequests} /> */}
          {/* { Private routes } */}
            <PrivateRoute path="/all-pending-requests" exact={true} >
              <AllPendingRequests/>
            </PrivateRoute>
            <PrivateRoute path="/all-completed-requests" exact={true} >
              <AllCompletedRequests/>
            </PrivateRoute>
            <PrivateRoute path="/support" exact={true} >
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
