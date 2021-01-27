import * as React from "react";
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Cancel from '@material-ui/icons/CancelPresentation';
import Swap from '@material-ui/icons/SwapVerticalCircle';
import AirplanemodeInactiveIcon from '@material-ui/icons/AirplanemodeInactive';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import CardTravelIcon from '@material-ui/icons/CardTravel';
import AirplayIcon from '@material-ui/icons/Airplay';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import ErrorIcon from '@material-ui/icons/Error';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import CancelScheduleSendIcon from '@material-ui/icons/CancelScheduleSend';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import PaymentIcon from '@material-ui/icons/Payment';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import SendIcon from '@material-ui/icons/Send';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DescriptionSharpIcon from '@material-ui/icons/DescriptionSharp';
import HotelIcon from '@material-ui/icons/Hotel';
import HomeWorkIcon from '@material-ui/icons/HomeWork';

const CreateServices = ()=> {
  const cartaoCorporativo =
  {
    name: 'Cartão corporativo' ,
    process:[
    {
      text: "Emissão de cartão corporativo",
      icon: <AddBoxIcon />,
      path: "/novoCartao"
    },
    {
      text: "Cancelamento do cartão corporativo",
      icon: <Cancel />,
      path: "/cancelarCartao"
    },
    {
      text: "Alteração do limite do cartão corporativo",
      icon:<Swap />,
      path: "/alterarLimite"
    },
    {
      text: "Liberação de compra pela internet",
      icon:<LockOpenIcon />,
      path: "/liberarCompraPelaInternet"
    },
    {
      text: "Problema no cartão corporativo",
      icon:<ReportProblemIcon />,
      path: "/ProblemasComCartaoCorporativo"
    }
  ]};

  const cartaoCombustivel = {
    name: 'Cartão combustível' ,
    process:[
      {
        text: "Criação de base para emissão do cartão combustível",
        icon: <LibraryAddIcon />,
        path: "/criacaoDeBase"
      },
      {
        text: "Alteração de limite do contrato da base",
        icon:<PaymentIcon />,
        path: "/alterarLimiteDoContratoDaBase"
      },
      {
        text: "Liberação de acesso master",
        icon: <AssignmentIndIcon />,
        path: "/liberarAcessoMaster"
      },
      {
        text: "Alteração de gestor de base",
        icon: <PeopleAltIcon />,
        path: "/alterarGestorDeBase"
      },
      {
        text: "Encerramento de base",
        icon: <ExitToAppIcon />,
        path: "/encerramentoDeBase"
      },
    ]
  };

  const prestacaoDeContas = {
    name: 'Prestação de contas',
    process: [
      {
        text: "Delegação da prestação / aprovação",
        icon: <SwapHorizIcon />,
        path: "/DelegacaoDaPrestacao"
      },
      {
        text: "Prestação de contas de empregado ativo",
        icon:<ErrorIcon />,
        path: "/PrestacaoDeContasEmpregadoAtivo"
      },
      {
        text: "Prestação de contas de empregado desligado / transferido / expatriado",
        icon:<ErrorOutlineIcon />,
        path: "/PrestacaoEmpregadoDesligadoExpatriado"
      },
      {
        text: "Pagamento de reembolso (Empregado Ativo)",
        icon:<PaymentIcon />,
        path: "/PagamentoDeReembolsoEmpregadoAtivo"
      },
      {
        text: "Pagamento de reembolso (Empregado desligado)",
        icon:<LocalAtmIcon />,
        path: "/PagamentoDeReembolsoEmpregadoDesligado"
      },
      {
        text: "Despesa não reconhecida",
        icon:<HelpOutlineIcon />,
        path: "/DespesaNaoReconhecida"
      },
      {
        text: "Falha na contabilização",
        icon:<CancelScheduleSendIcon />,
        path: "/FalhaNaContabilizacao"
      },
      {
        text: "Despesas não disponíveis",
        icon:<MoneyOffIcon />,
        path: "/DespesasNaoDisponiveis"
      },
      {
        text: "Consulta a desconto de viagens",
        icon:<FindInPageIcon />,
        path: "/ConsultaADescontoDeViagens"
      },
      {
        text: "Envio de valor para desconto manual",
        icon:<SendIcon />,
        path: "/EnvioDeValorParaDesconto"
      },
      {
        text: "Desbloqueio de cartão e sistema",
        icon:<CardTravelIcon />,
        path: "/DesbloqueioDeCartaoESistema"
      },
      {
        text: "Aprovação da prestação de contas",
        icon:<PlaylistAddCheckIcon />,
        path: "/AprovacaoDaPrestacao"
      },
    ]
  };

  const normativo_relatorios = {
    name: 'Normativo / Relatórios',
    process:[
      {
        text: "Dúvida sobre documentos normativos de Viagens",
        icon: <DescriptionSharpIcon />,
        path: "/DuvidasSobreDocumentosNormativos"
      },
      {
        text: "Relatórios de viagens",
        icon: <DashboardIcon />,
        path: "/RelatoriosDeViagens"
      },
    ]
  };

  const solicitacaoDeViagem = {
    name: 'Solicitação de viagem',
    process: [
      {
        text: "Problemas na solicitação",
        icon: <AirplayIcon />,
        path: "/ProblemasNaSolicitacao"
      },
      {
        text: "Delegação da aprovação da viagem",
        icon: <TransferWithinAStationIcon />,
        path: "/DelegacaoDaAprovacaoDaViagem"
      },
      {
        text: "Aprovador inexistente ou incorreto",
        icon:<AssignmentIndIcon />,
        path: "/AprovadorInexistente"
      },
      {
        text: "Tratamento de exceções: Cartão virtual para empregados",
        icon:<CardTravelIcon />,
        path: "/emissaoBTB"
      },
      {
        text: "Tratamento de exceções: Regularização de hospedagem",
        icon:<HotelIcon />,
        path: "/regularizacaoDeHospedagem"
      },
      {
        text: "Cia Aérea não preferencial",
        icon:<AirplanemodeInactiveIcon />,
        path: "/CiaAereaNaoPreferencial"
      },
      {
        text: "Airbnb para hospedagem acima de 30 dias",
        icon:<HomeWorkIcon />,
        path: "/Airbnb"
      },
    ]
  };

  return [
    cartaoCorporativo,
    cartaoCombustivel,
    prestacaoDeContas,
    normativo_relatorios,
    solicitacaoDeViagem
  ];
};

export const services = CreateServices();
