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
      text: "Cancelar cartão",
      icon: <Cancel />,
      path: "/cancelarCartao"
    },
    {
      text: "Alterar limite",
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
        text: "Dificuldade de acesso ao sistema",
        icon: <AirplanemodeInactiveIcon />,
        path: "/DificuldadeDeAcessoAoSistema"
      },
      {
        text: "Delegar aprovação da viagem",
        icon: <TransferWithinAStationIcon />,
        path: "/DelegacaoDaAprovacaoDaViagem"
      },
      {
        text: "Locação de veículo",
        icon:<DriveEtaIcon />,
        path: "/LocacaoDeVeiculo"
      },
      {
        text: "Emissão de visto",
        icon:<GavelIcon />,
        path: "/EmissaoDeVisto"
      },
      {
        text: "Seguro viagem",
        icon:<SecurityIcon />,
        path: "/SeguroViagem"
      },
      {
        text: "Dúvida na solicitação",
        icon:<ContactSupportIcon />,
        path: "/DuvidaNaSolicitacao"
      },
      {
        text: "Aprovador inexistente",
        icon:<AssignmentIndIcon />,
        path: "/AprovadorInexistente"
      },
      {
        text: "Tratamento de exceções",
        icon:<NewReleasesIcon />,
        path: "/TratamentoDeExcecoes"
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
