import { sp } from "@pnp/sp";
import { IRequests_AllFields } from '../Interfaces/Requests/IRequests';
import { Log } from "./LogService";

const requestFields = [
  'Id',
  'Created',
  'Modified',
  'STATUS',
  'STATUS_APROVACAO',
  'DATA_DE_APROVACAO',
  'APROVACAO_COMENTARIOS',
  'STATUS_ATENDIMENTO',
  'DATA_DE_ATENDIMENTO',
  'ATENDIMENTO_COMENTARIOS',
  'TEMPO_ATENDIMENTO',
  'MACROPROCESSO',
  'PROCESSO',
  'BENEFICIARIO_ID',
  'BENEFICIARIO_NOME',
  'BENEFICIARIO_EMAIL',
  'BENEFICIARIO_EMPRESA_COD',
  'BENEFICIARIO_EMPRESA_NOME',
  'BENEFICIARIO_LEVEL',
  'BENEFICIARIO_DOC_IDENTIF',
  'BENEFICIARIO_NASCIMENTO',
  'BENEFICIARIO_NACIONALIDADE',
  'TIPO_PRESTACAO_DE_CONTAS',
  'DESPESAS_INDISPONIVEIS',
  'VIAGEM_IDA_E_VOLTA',
  'LIMITE_ATUAL',
  'HORARIO',
  'SOLICITANTE_ID',
  'SOLICITANTE_NOME',
  'SOLICITANTE_EMAIL',
  'SOLICITANTE_EMPRESA_COD',
  'SOLICITANTE_EMPRESA_NOME',
  'END_CEP',
  'END_LOGRADOURO',
  'END_NUMERO',
  'END_COMPLEMENTO',
  'LIMITE_ATUAL',
  'NOVO_LIMITE',
  'TIPO_DE_LIMITE',
  'TIPO_LIMITE_VALOR',
  'TIPO_DE_VIAJANTE',
  'APROVADOR_ID',
  'APROVADOR_LEVEL',
  'APROVADOR_NOME',
  'APROVADOR_EMAIL',
  'APROVADOR_EMPRESA_COD',
  'APROVADOR_EMPRESA_NOME',
  'ACOMPANHANTES',
  'ALCADA_APROVACAO',
  'AREA_RESOLVEDORA',
  'CNPJ_DE_FATURAMENTO',
  'COD_DO_DESCONTO_NO_CONTRACHEQUE',
  'CODIGO_DA_BASE',
  'COD_DO_RAMO_DE_ATIVIDADE',
  'CPF',
  'DATA_DE_UTILIZACAO',
  'DATA_DO_DESCONTO',
  'DONO_DA_DESPESA_EMAIL',
  'DONO_DA_DESPESA_EMPRESA_COD',
  'DONO_DA_DESPESA_EMPRESA_NOME',
  'DONO_DA_DESPESA_ID',
  'DONO_DA_DESPESA_NOME',
  'DONO_DA_DESPESA_LEVEL',
  'EMPREGADO_ATIVO',
  'ESTABELECIMENTO',
  'GESTOR_DA_BASE_EMAIL',
  'GESTOR_DA_BASE_EMPRESA_COD',
  'GESTOR_DA_BASE_EMPRESA_NOME',
  'GESTOR_DA_BASE_ID',
  'GESTOR_DA_BASE_NOME',
  'MOTIVO',
  'MOTIVO_DA_VIAGEM',
  'NACIONAL_INTERNACIONAL',
  'PERIODO_INICIO',
  'PERIODO_FIM',
  'QUANTIDADE_DE_CARTOES',
  'RELATORIO_CONCUR',
  'RESP_MEDICAO_EMAIL',
  'RESP_MEDICAO_EMPRESA_COD',
  'RESP_MEDICAO_EMPRESA_NOME',
  'RESP_MEDICAO_ID',
  'RESP_MEDICAO_NOME',
  'SLA',
  'TELEFONE',
  'TIPO_DE_DELEGACAO',
  'TIPO_DE_SOLICITACAO',
  'ULTIMOS_DIGITOS_DO_CARTAO',
  'VALOR',
  'VALIDADE_NOVO_LIMITE',
  'VIA_CARTAO',
  'OBS_PARA_SOLICITACAO',
  'ID_SOLICITACAO_CARTAO',
  'TIPO_SOLICITACAO_CARTAO',
  'PORTADOR_SOLIC_CARTAO',
  'TFD',
  'CENTRO_DE_CUSTOS',
  'DATA_FIM_ATENDIMENTO',
  'Author/Title',
  'Author/EMail',
  'Editor/Title',
  'Editor/EMail',
];

export const newRequest = (data:IRequests_AllFields) => sp.web.lists.getByTitle('SOLICITACOES').items
  .add(data)
  .then(res => { 
    Log({Title: "Success", Request: JSON.stringify(data), Response: JSON.stringify(res.data)});
    return res;
  })
  .catch(error=>{
    Log({Title: "Error", Request: JSON.stringify(data), Response: JSON.stringify(error)});
    return error;
  })
  
  ;

export const updateRequest = (data:IRequests_AllFields) => sp.web.lists.getByTitle('SOLICITACOES').items
  .getById(data.Id)
  .update(data);

  export const handleGetAllRequests = async ()=>{
    let requests = [];
    let items = await sp.web.lists.getByTitle("SOLICITACOES").items
        .select(
          ...requestFields
        )
        .expand('Author', 'Editor')
        .top(4999)
        .getPaged();
    items.results.map(res => requests.push(res));
    while(items.hasNext) {
      items = await items.getNext();
      items.results.map(res => requests.push(res));
    }
    return requests;
  };

  export const getRequestById = async (id:number) => sp.web.lists.getByTitle('SOLICITACOES').items
  .getById(id)
  .select(
    ...requestFields
  )
  .expand('Author', 'Editor')
  .get();
