import * as React from 'react';
import { CancelCardDetails } from './CorporateCard/CancelCardDetails';
import { CorporateCardProblemsDetails } from './CorporateCard/CorporateCardProblemsDetails';
import { InternetPurchaseUnlockDetails } from './CorporateCard/InternetPurchaseUnlockDetails';
import { LimitChangeDetails } from './CorporateCard/LimitChangeDetails';
import { NewCreditCardDetails } from './CorporateCard/NewCreditCardDetails';


export const CorporateCardDetails = ({requestDetails, children=null})=>{

  if(requestDetails.PROCESSO === 'Cancelamento do cartão corporativo')
    return <CancelCardDetails requestDetails={requestDetails}>{children}</CancelCardDetails>;

  if(requestDetails.PROCESSO === 'Problema no cartão corporativo')
    return <CorporateCardProblemsDetails requestDetails={requestDetails}>{children}</CorporateCardProblemsDetails>;

  if(requestDetails.PROCESSO === 'Liberação de compra pela internet')
    return <InternetPurchaseUnlockDetails requestDetails={requestDetails}>{children}</InternetPurchaseUnlockDetails>;

  if(requestDetails.PROCESSO === 'Alteração de limite')
    return <LimitChangeDetails requestDetails={requestDetails}>{children}</LimitChangeDetails>;

  if(requestDetails.PROCESSO === 'Emissão de cartão corporativo')
    return <NewCreditCardDetails requestDetails={requestDetails}>{children}</NewCreditCardDetails>;


  return <></>;
};
