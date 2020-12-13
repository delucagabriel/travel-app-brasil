import { IRequests } from './IRequests';

export interface IRequest_RequestApproval extends IRequests{
  STATUS_APROVACAO: string;
  DATA_DE_APROVACAO: Date;
  APROVACAO_COMENTARIOS: string;
  APROVADOR_ID: string;
  APROVADOR_NOME: string;
  APROVADOR_EMAIL: string;
  APROVADOR_LEVEL: string;
  APROVADOR_EMPRESA_COD: string;
  APROVADOR_EMPRESA_NOME: string;
}
