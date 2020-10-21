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
import AddLocationIcon from '@material-ui/icons/AddLocation';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';

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
        text: "Despesa não disponível",
        icon:<MoneyOffIcon />,
        path: "/DespesaNaoDisponivel"
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
        text: "Tratamento de exceções",
        icon:<CardTravelIcon />,
        path: "/emissaoBTB"
      },
      {
        text: "Cia Aérea não preferencial",
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
