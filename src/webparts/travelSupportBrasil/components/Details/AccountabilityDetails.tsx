import * as React from 'react';
import { AccProblems_ActiveEmployeeDetails } from './Accountability/AccProblems_ActiveEmployeeDetails';
import { AccProblems_TerminatedEmployeeDetails } from './Accountability/AccProblems_TerminatedEmployeeDetails';
import { AccountingFailureDetails } from './Accountability/AccountingFailureDetails';
import { ActiveEmployeeReimbursementDetails } from './Accountability/ActiveEmployeeReimbursementDetails';
import { ApprovalOfAccountabilityDetails } from './Accountability/ApprovalOfAccountabilityDetails';
import { CardAndSystemUnlockDetails } from './Accountability/CardAndSystemUnlockDetails';
import { DelegationOfAccountabilityDetails } from './Accountability/DelegationOfAccountabilityDetails';
import { EmployeeRefundDetails } from './Accountability/EmployeeRefundDetails';
import { ExpensesNotAvailableDetails } from './Accountability/ExpensesNotAvailableDetails';
import { SendingValueForDiscountDetails } from './Accountability/SendindValueForDiscountDetails';
import { TravelDiscountConsultationDetails } from './Accountability/TravelDiscountConsultationDetails';
import { UnrecognizedExpenseDetails } from './Accountability/UnrecognizedExpenseDetails';

export const AccountabilityDetails = ({requestDetails, children=null})=>{
  if(requestDetails.PROCESSO === 'Prestação de contas (Empregado ativo)')
    return <AccProblems_ActiveEmployeeDetails requestDetails={requestDetails}>{children}</AccProblems_ActiveEmployeeDetails>;

  if(requestDetails.PROCESSO === 'Prestação de contas (Empregado Desligado/Transferido/Expatriado)')
    return <AccProblems_TerminatedEmployeeDetails requestDetails={requestDetails}>{children}</AccProblems_TerminatedEmployeeDetails>;

  if(requestDetails.PROCESSO === 'Falha na contabilização')
    return <AccountingFailureDetails requestDetails={requestDetails}>{children}</AccountingFailureDetails>;

  if(requestDetails.PROCESSO === 'Pagamento de reembolso (Empregado ativo)')
    return <ActiveEmployeeReimbursementDetails requestDetails={requestDetails}>{children}</ActiveEmployeeReimbursementDetails>;

  if(requestDetails.PROCESSO === 'Aprovação da prestação')
    return <ApprovalOfAccountabilityDetails requestDetails={requestDetails}>{children}</ApprovalOfAccountabilityDetails>;

  if(requestDetails.PROCESSO === 'Desbloqueio do cartão e sistema')
  return <CardAndSystemUnlockDetails requestDetails={requestDetails}>{children}</CardAndSystemUnlockDetails>;

  if(requestDetails.PROCESSO === 'Delegação da prestação de contas')
  return <DelegationOfAccountabilityDetails requestDetails={requestDetails}>{children}</DelegationOfAccountabilityDetails>;

  if(requestDetails.PROCESSO === 'Delegação da aprovação')
  return <DelegationOfAccountabilityDetails requestDetails={requestDetails}>{children}</DelegationOfAccountabilityDetails>;

  if(requestDetails.PROCESSO === 'Pagamento de reembolso (Empregado desligado)')
  return <EmployeeRefundDetails requestDetails={requestDetails}>{children}</EmployeeRefundDetails>;

  if(requestDetails.PROCESSO === 'Despesas não disponíveis')
  return <ExpensesNotAvailableDetails requestDetails={requestDetails}>{children}</ExpensesNotAvailableDetails>;

  if(requestDetails.PROCESSO === 'Envio de valor para desconto em folha manual')
  return <SendingValueForDiscountDetails requestDetails={requestDetails}>{children}</SendingValueForDiscountDetails>;

  if(requestDetails.PROCESSO === 'Consulta a desconto de viagens')
  return <TravelDiscountConsultationDetails requestDetails={requestDetails}>{children}</TravelDiscountConsultationDetails>;

  if(requestDetails.PROCESSO === 'Despesa não reconhecida')
  return <UnrecognizedExpenseDetails requestDetails={requestDetails}>{children}</UnrecognizedExpenseDetails>;

  return <></>;
};
