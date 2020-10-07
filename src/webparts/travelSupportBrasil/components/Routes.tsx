import * as React from 'react';
import { useContext } from 'react';
import { Switch, Route, HashRouter, Redirect } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Home from './HomeUsers/Home';
import MyPendingRequests from './Lists/MyPendingRequests';
import MyCompletedRequests from './Lists/MyCompletedRequests';
import NewCreditCard from './Forms/cartoes/NewCreditCard';
import CancelCard from './Forms/cartoes/CancelCard';
import LimitChange from './Forms/cartoes/LimitChange';
import Menu from './Drawer/Menu';

import { SupportHome } from './AdminTravel/SupportHome';
import AllPendingRequests from './Lists/AllPendingRequests';
import AllCompletedRequests from './Lists/AllCompletedRequests';
import { InsertOrUpdateEmployees } from './InsertOrUpdateEmployees';
import { Context } from './Context';
import InternetPurchaseUnlock from './Forms/cartoes/InternetPurchaseUnlock';
import CorporateCardProblems from './Forms/cartoes/CorporateCardProblems';
import TravelSystemAccessDificulty from './Forms/solicitacaoDeViagem/TravelSystemAccessDificulty';
import ApprovalDelegation from './Forms/solicitacaoDeViagem/ApprovalDelegation';
import CarRental from './Forms/solicitacaoDeViagem/CarRental';
import VisaIssue from './Forms/solicitacaoDeViagem/VisaIssue';
import TravelInsurance from './Forms/solicitacaoDeViagem/TravelInsurance';
import QuestionsInRequest from './Forms/solicitacaoDeViagem/QuestionsInRequest';
import NonExistentApprover from './Forms/solicitacaoDeViagem/NonExistentApprover';
import VirtualHostingCard from './Forms/solicitacaoDeViagem/VirtualHostingCard';
import HostingRegularization from './Forms/solicitacaoDeViagem/HostingRegularization';
import NonPreferredAirline from './Forms/solicitacaoDeViagem/NonPreferredAirline';

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
            {/*  Listas  */}
            <Route path="/" exact={true} component={Home} />
            <Route path="/minhasSolicitacoesPendentes" exact={true} component={MyPendingRequests} />
            <Route path="/minhasSolicitacoesConcluidas" exact={true} component={MyCompletedRequests} />

            {/*  Cartões  */}
            <Route path="/novoCartao" exact={true} component={NewCreditCard} />
            <Route path="/cancelarCartao" exact={true} component={CancelCard} />
            <Route path="/alterarLimite" exact={true} component={LimitChange} />
            <Route path="/liberarCompraPelaInternet" exact={true} component={InternetPurchaseUnlock} />
            <Route path="/ProblemasComCartaoCorporativo" exact={true} component={CorporateCardProblems} />

            {/*  Solicitaçao de viagem  */}
            <Route path="/DificuldadeDeAcessoAoSistema" exact={true} component={TravelSystemAccessDificulty} />
            <Route path="/DelegacaoDaAprovacaoDaViagem" exact={true} component={ApprovalDelegation} />
            <Route path="/LocacaoDeVeiculo" exact={true} component={CarRental} />
            <Route path="/EmissaoDeVisto" exact={true} component={VisaIssue} />
            <Route path="/SeguroViagem" exact={true} component={TravelInsurance} />
            <Route path="/DuvidaNaSolicitacao" exact={true} component={QuestionsInRequest} />
            <Route path="/AprovadorInexistente" exact={true} component={NonExistentApprover} />
            <Route path="/emissaoBTB" exact={true} component={VirtualHostingCard} />
            <Route path="/RegularizacaoBTB" exact={true} component={HostingRegularization} />
            <Route path="/CiaAereaNaoPreferencial" exact={true} component={NonPreferredAirline} />

          {/* { Private routes } */}
            {/*  Listas  */}
            <PrivateRoute path="/todasSolicitacoesPendentes" exact={true} >
              <AllPendingRequests/>
            </PrivateRoute>
            <PrivateRoute path="/todasSolicitacoesConcluidas" exact={true} >
              <AllCompletedRequests/>
            </PrivateRoute>

            {/*  Atendimento  */}
            <PrivateRoute path="/atendimento" exact={true} >
              <SupportHome/>
            </PrivateRoute>

            {/*  Atualização de empregados  */}
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
