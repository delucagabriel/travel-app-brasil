import * as React from 'react';
import { CorporateCardDetails } from '../Details/CorporateCardDetails';
import { RequestDetailsComponent } from '../Details/RequestDetailsComponent';

export const HocRenderDetails = ({type, details, children=null})=> {
  if(type === 'Cartão corporativo') return <CorporateCardDetails requestDetails={details}>{children}</CorporateCardDetails>;

  if(type === 'Cartão combustível') return <CorporateCardDetails requestDetails={details}>{children}</CorporateCardDetails>;

  if(type === 'Prestação de contas') return <CorporateCardDetails requestDetails={details}>{children}</CorporateCardDetails>;

  if(type === 'Normativo/Relatórios') return <CorporateCardDetails requestDetails={details}>{children}</CorporateCardDetails>;

  if(type === 'Solicitação de viagem') return <CorporateCardDetails requestDetails={details}>{children}</CorporateCardDetails>;

  return <RequestDetailsComponent requestDetails={details}>{children}</RequestDetailsComponent>;
};
