import * as React from 'react';
import { ApprovalDelegationDetails } from './TravelRequests/ApprovalDelegationDetails';
import { HostingRegularizationDetails } from './TravelRequests/HostingRegularizationDetails';
import { NonExistentApproverDetails } from './TravelRequests/NonExistentApproverDetails';
import { NonPreferredAirlineDetails } from './TravelRequests/NonPreferredAirlineDetails';
import { VirtualHostingCardDetails } from './TravelRequests/VirtualHostingCardDetails';
import { TravelRequestIssueDetails } from './TravelRequests/TravelRequestIssueDetails';


export const TravelRequestDetails = ({requestDetails, children=null})=>{
  if(requestDetails.PROCESSO === 'Delegação da aprovação da viagem')
    return <ApprovalDelegationDetails requestDetails={requestDetails}>{children}</ApprovalDelegationDetails>;

  if(requestDetails.PROCESSO === 'Regularização de hospedagem')
    return <HostingRegularizationDetails requestDetails={requestDetails}>{children}</HostingRegularizationDetails>;

  if(requestDetails.PROCESSO === 'Aprovador inexistente ou incorreto')
    return <NonExistentApproverDetails requestDetails={requestDetails}>{children}</NonExistentApproverDetails>;

  if(requestDetails.PROCESSO === 'Cia aérea não preferencial')
    return <NonPreferredAirlineDetails requestDetails={requestDetails}>{children}</NonPreferredAirlineDetails>;

  if(requestDetails.PROCESSO === 'Cartão virtual para empregados')
    return <VirtualHostingCardDetails requestDetails={requestDetails}>{children}</VirtualHostingCardDetails>;

  return <TravelRequestIssueDetails requestDetails={requestDetails}>{children}</TravelRequestIssueDetails>;
};
