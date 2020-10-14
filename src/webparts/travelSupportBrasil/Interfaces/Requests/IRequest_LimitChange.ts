import { IRequests } from './IRequests';

export interface IRequest_LimitChange extends IRequests{
  APROVADOR_ID: string;
  APROVADOR_NOME: string;
  APROVADOR_EMAIL: string;
  APROVADOR_EMPRESA_COD: string;
  APROVADOR_EMPRESA_NOME: string;
  APROVADOR_LEVEL: string;
  BENEFICIARIO_ID: string;
  BENEFICIARIO_NOME: string;
  BENEFICIARIO_EMAIL: string;
  BENEFICIARIO_EMPRESA_COD: string;
  BENEFICIARIO_EMPRESA_NOME: string;
  TIPO_DE_LIMITE: string;
  TIPO_LIMITE_VALOR: string;
  NOVO_LIMITE: number;
  VALIDADE_NOVO_LIMITE: string;
  ULTIMOS_DIGITOS_DO_CARTAO: string;
  CPF: string;
}
