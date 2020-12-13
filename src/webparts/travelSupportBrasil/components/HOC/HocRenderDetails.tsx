import * as React from 'react';
import { CorporateCardDetails } from '../Details/CorporateCardDetails';
import { RequestDetailsComponent } from '../Details/RequestDetailsComponent';
import { TravelRequestDetails } from '../Details/TravelRequestDetails';
import { FuelCardDetails } from '../Details/FuelCardDetails';
import { AccountabilityDetails } from '../Details/AccountabilityDetails';
import { NormativeOrReportsDetails } from '../Details/NormativeOrReportsDetails';

export const HocRenderDetails = ({type, details, children=null})=> {
  if(type === 'Cartão corporativo') return <CorporateCardDetails requestDetails={details}>{children}</CorporateCardDetails>;

  if(type === 'Cartão combustível') return <FuelCardDetails requestDetails={details}>{children}</FuelCardDetails>;

  if(type === 'Prestação de contas') return <AccountabilityDetails requestDetails={details}>{children}</AccountabilityDetails>;

  if(type === 'Documentos normativos e relatórios') return <NormativeOrReportsDetails requestDetails={details}>{children}</NormativeOrReportsDetails>;

  if(type === 'Solicitação de viagem') return <TravelRequestDetails requestDetails={details}>{children}</TravelRequestDetails>;

  return <RequestDetailsComponent requestDetails={details}>{children}</RequestDetailsComponent>;
};
