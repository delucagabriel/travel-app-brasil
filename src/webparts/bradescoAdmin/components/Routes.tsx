import "../../travelSupportBrasil/components/globalStyles.module.scss";
import * as React from 'react';
import { useContext } from 'react';
import { Switch, Route, HashRouter, Redirect } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Context } from "../../travelSupportBrasil/components/Context";
import AllPendingRequestsBradesco from "./Lists/bradesco/AllPendingRequestsBradesco";
import MenuBradesco from "./Menu/MenuBradesco";
import { pink, red } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: red[800],
    },
    secondary: {
      main: pink[900],
    },
    
  },
});


const NotFound = ()=> <h1>Página não encontrada :( </h1>;


export const Routes = ()=>{
  const { employeeInfos } = useContext(Context);


  function BradescoRoute({ children, ...rest }) {
    return (
      <Route {...rest } render={
        ({ location }) => employeeInfos && employeeInfos.isAdmin
         //&& ( employeeInfos.COMPANY_DESC === 'Bradesco' 
         //|| employeeInfos.COMPANY_DESC === 'TicketLog' 
         //)
        ? ( children )
        : ( <NotFound /> )
        }
      />
    );
  }


  return (
    <HashRouter>
      <ThemeProvider theme={theme}>
        <Switch>
          <BradescoRoute path="/" exact={true}>
            <MenuBradesco />
            <AllPendingRequestsBradesco/>
          </BradescoRoute>
        </Switch>
      </ThemeProvider>
    </ HashRouter>
  );
};
