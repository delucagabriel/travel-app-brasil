import { IRequests } from './IRequests';

export interface IRequest_ServiceApproval extends IRequests{
  STATUS_ATENDIMENTO: string;
  DATA_DE_ATENDIMENTO: Date;
  ATENDIMENTO_COMENTARIOS: string;
}
