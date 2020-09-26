import { IRequests } from './IRequests';

export interface IRequest_CancelCard extends IRequests{
  BENEFICIARIO_ID: string;
  BENEFICIARIO_NOME: string;
  BENEFICIARIO_EMAIL: string;
  BENEFICIARIO_EMPRESA_COD: string;
  BENEFICIARIO_EMPRESA_NOME: string;

  ULTIMOS_DIGITOS_DO_CARTAO: string;
  MOTIVO: string;
}
