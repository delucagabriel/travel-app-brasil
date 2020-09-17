import { sp } from "@pnp/sp";

export const newRequest = data => sp.web.lists.getByTitle('SOLICITACOES').items.add(data);

export const updateRequest = data => sp.web.lists.getByTitle('SOLICITACOES').items
  .getById(data.Id)
  .update(data);

  export const handleGetAllRequests = async ()=>{
    let requests = [];
    let items = await sp.web.lists.getByTitle("SOLICITACOES").items
        .select(
          'ID',
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
          'END_CEP',
          'END_LOGRADOURO',
          'END_NUMERO',
          'END_COMPLEMENTO',
          'NOVO_LIMITE',
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
          'CODIGO_DO_RAMO_DE_ATIVIDADE',
          'CPF',
          'DATA_DE_UTILIZACAO',
          'DATA_DO_DESCONTO',
          'DONO_DA_DESPESA_EMAIL',
          'DONO_DA_DESPESA_EMPRESA_COD',
          'DONO_DA_DESPESA_EMPRESA_NOME',
          'DONO_DA_DESPESA_ID',
          'DONO_DA_DESPESA_NOME',
          'EMPREGADO_ATIVO',
          'ESTABELECIMENTO',
          'GESTOR_DA_BASE_EMAIL',
          'GESTOR_DA_BASE_EMPRESA_COD',
          'GESTOR_DA_BASE_EMPRESA_NOME',
          'GESTOR_DA_BASE_ID',
          'GESTOR_DA_BASE_NOME',
          'MOTIVO',
          'NACIONAL_INTERNACIONAL',
          'PERIODO',
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
          'ULTIMO_PERIODO_DA_MEDICAO',
          'ULTIMOS_DIGITOS_DO_CARTAO',
          'VALOR',
          'Author/Title',
          'Editor/Title'
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
