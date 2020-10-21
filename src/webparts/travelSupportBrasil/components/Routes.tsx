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
import ApprovalDelegation from './Forms/solicitacaoDeViagem/ApprovalDelegation';
import NonExistentApprover from './Forms/solicitacaoDeViagem/NonExistentApprover';
import VirtualHostingCard from './Forms/solicitacaoDeViagem/VirtualHostingCard';
import NonPreferredAirline from './Forms/solicitacaoDeViagem/NonPreferredAirline';
import TravelRequestIssue from './Forms/solicitacaoDeViagem/TravelRequestIssue';
import EmployeeRefund from './Forms/prestacaoDeContas/EmployeeRefund';
import DelegationOfAccountability from './Forms/prestacaoDeContas/DelegationOfAccountability';
import AccountabilityProblemsActiveEmployee from './Forms/prestacaoDeContas/AccountabilityProblems_ActiveEmployee';
import AccountabilityProblemsTransferredOrTerminated from './Forms/prestacaoDeContas/AccountabilityProblems_TransferredOrTerminated';
import ActiveEmployeeReimbursement from './Forms/prestacaoDeContas/ActiveEmployeeReimbursement';
import UnrecognizedExpense from './Forms/prestacaoDeContas/UnrecognizedExpense';
import ApprovalOfAccountability from './Forms/prestacaoDeContas/ApprovalOfAccountability';
import CardAndSystemUnlock from './Forms/prestacaoDeContas/CardAndSystemUnlock';
import TravelDiscountConsultation from './Forms/prestacaoDeContas/TravelDiscountConsultation';
import SendingValueForDiscount from './Forms/prestacaoDeContas/SendingValueForDiscount';
import AccountingFailure from './Forms/prestacaoDeContas/AccountingFailure';

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
            <Route path="/ProblemasNaSolicitacao" exact={true} component={TravelRequestIssue} />
            <Route path="/DelegacaoDaAprovacaoDaViagem" exact={true} component={ApprovalDelegation} />
            <Route path="/AprovadorInexistente" exact={true} component={NonExistentApprover} />
            <Route path="/emissaoBTB" exact={true} component={VirtualHostingCard} />
            <Route path="/CiaAereaNaoPreferencial" exact={true} component={NonPreferredAirline} />

            {/*  Prestação de contas  */}
            <Route path="/DelegacaoDaPrestacao" exact={true} component={DelegationOfAccountability} />
            <Route path="/PagamentoDeReembolsoEmpregadoAtivo" exact={true} component={ActiveEmployeeReimbursement} />
            <Route path="/PagamentoDeReembolsoEmpregadoDesligado" exact={true} component={EmployeeRefund} />
            <Route path='/PrestacaoDeContasEmpregadoAtivo' exact={true} component={AccountabilityProblemsActiveEmployee} />
            <Route path='/PrestacaoEmpregadoDesligadoExpatriado' exact={true} component={AccountabilityProblemsTransferredOrTerminated} />
            <Route path='/DespesaNaoReconhecida' exact={true} component={UnrecognizedExpense} />
            <Route path='/AprovacaoDaPrestacao' exact={true} component={ApprovalOfAccountability} />
            <Route path='/DesbloqueioDeCartaoESistema' exact={true} component={CardAndSystemUnlock} />
            <Route path='/ConsultaADescontoDeViagens' exact={true} component={TravelDiscountConsultation} />
            <Route path='/EnvioDeValorParaDesconto' exact={true} component={SendingValueForDiscount} />
            <Route path='/FalhaNaContabilizacao' exact={true} component={AccountingFailure} />
            <Route path='/DespesaNaoDisponivel' exact={true} component={CardAndSystemUnlock} />



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
