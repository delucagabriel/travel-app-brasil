import * as React from "react";
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Cancel from '@material-ui/icons/CancelPresentation';
import Swap from '@material-ui/icons/SwapVerticalCircle';
import AirplanemodeInactiveIcon from '@material-ui/icons/AirplanemodeInactive';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import GavelIcon from '@material-ui/icons/Gavel';
import SecurityIcon from '@material-ui/icons/Security';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import CardTravelIcon from '@material-ui/icons/CardTravel';
import AirplayIcon from '@material-ui/icons/Airplay';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import ErrorIcon from '@material-ui/icons/Error';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import SyncProblemIcon from '@material-ui/icons/SyncProblem';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import CancelScheduleSendIcon from '@material-ui/icons/CancelScheduleSend';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PaymentIcon from '@material-ui/icons/Payment';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import SendIcon from '@material-ui/icons/Send';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import AddLocationIcon from '@material-ui/icons/AddLocation';

const CreateServices = ()=> {
  const cartaoCorporativo =
  {
    name: 'Cartão corporativo' ,
    process:[
    {
      text: "Novo cartão",
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
      text: "Liberar compra pela internet",
      icon:<LockOpenIcon />,
      path: "/liberarCompraPelaInternet"
    },
    {
      text: "Problemas com cartão corporativo",
      icon:<ReportProblemIcon />,
      path: "/ProblemasComCartaoCorporativo"
    }
  ]};

  const cartaoCombustivel = {
    name: 'Cartão combustível' ,
    process:[
      {
        text: "Novo cartão",
        icon: <AddBoxIcon />,
        path: "/novoCartao"
      },
      {
        text: "Cancelar cartão",
        icon: <Cancel />,
        path: "/cancelarCartao"
      },
      {
        text: "Alterar limite",
        icon:<Swap />,
        path: "/alterarLimite"
      }]
  };

  const prestacaoDeContas = {
    name: 'Prestação de contas',
    process: [
      {
        text: "Delegação da aprovação",
        icon: <SwapVertIcon />,
        path: "/DelegacaoDaAprovacao"
      },
      {
        text: "Delegação da prestação de contas",
        icon: <SwapHorizIcon />,
        path: "/DelegacaoDaPrestacao"
      },
      {
        text: "Problemas na prestação (Empregado Ativo)",
        icon:<ErrorIcon />,
        path: "/ProblemasNaPrestacaoEmpregadoAtivo"
      },
      {
        text: "Problemas na prestação (Empregado Desligado)",
        icon:<ErrorOutlineIcon />,
        path: "/ProblemasNaPrestacaoEmpregadoDesligado"
      },
      {
        text: "Problemas na prestação (Empregado Transferido/Expatriado)",
        icon:<SyncProblemIcon />,
        path: "/ProblemasNaPrestacaoEmpregadoTransferido"
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
        text: "Despesa não disponível",
        icon:<MoneyOffIcon />,
        path: "/DespesaNaoDisponivel"
      },
      {
        text: "Reembolso (Empregado ativo)",
        icon:<PaymentIcon />,
        path: "/ReembolsoEmpregadoAtivo"
      },
      {
        text: "Reembolso (Empregado desligado)",
        icon:<AttachMoneyIcon />,
        path: "/ReembolsoEmpregadoDesligado"
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
      {
        text: "Cadastrar cidade no Concur",
        icon:<AddLocationIcon />,
        path: "/CadastrarCidadeNoConcur"
      },
    ]
  };

  const normativo_relatorios = {
    name: 'Normativo / Relatórios',
    process:[
      {
        text: "Novo cartão",
        icon: <AddBoxIcon />,
        path: "/novoCartao"
      },
      {
        text: "Cancelar cartão",
        icon: <Cancel />,
        path: "/cancelarCartao"
      },
      {
        text: "Alterar limite",
        icon:<Swap />,
        path: "/alterarLimite"
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
        text: "Delegar aprovação da viagem",
        icon: <TransferWithinAStationIcon />,
        path: "/DelegacaoDaAprovacaoDaViagem"
      },
      {
        text: "Aprovador inexistente",
        icon:<AssignmentIndIcon />,
        path: "/AprovadorInexistente"
      },
      {
        text: "Tratamento de exceções - Cartão virtual de hospedagem",
        icon:<CardTravelIcon />,
        path: "/emissaoBTB"
      },
      {
        text: "Tratamento de exceções - Regularização de hospedagem",
        icon:<NewReleasesIcon />,
        path: "/RegularizacaoBTB"
      },
      {
        text: "Tratamento de exceções - Cia Aérea não preferencial",
        icon:<AirplanemodeInactiveIcon />,
        path: "/CiaAereaNaoPreferencial"
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
