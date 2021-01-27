import { IRequests } from './IRequests';

export interface IRequest_NewCard extends IRequests{
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
  BENEFICIARIO_LEVEL: string;
  BENEFICIARIO_NASCIMENTO: Date;
  BENEFICIARIO_CARGO: string;
  CPF: string;
  TELEFONE: string;
  CENTRO_DE_CUSTOS: string;
  TIPO_LIMITE_VALOR: string;
  END_CEP: string;
  END_LOGRADOURO: string;
  END_NUMERO: number;
  END_COMPLEMENTO: string;
  VISA_INFINITE: string;
}
