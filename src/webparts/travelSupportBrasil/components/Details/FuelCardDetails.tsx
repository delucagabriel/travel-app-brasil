import * as React from 'react';
import { BaseClosureDetails } from './FuelCard/BaseClosureDetail';
import { BaseCreationDetails } from './FuelCard/BaseCreationDetails';
import { BaseContractLimitChangeDetails } from './FuelCard/BaseContractLimitChangeDetails';
import { MasterAccessReleaseDetails } from './FuelCard/MasterAccessReleaseDetails';
import { ChangeOfBaseManagerDetails } from './FuelCard/ChangeOfBaseManagerDetails';


export const FuelCardDetails = ({requestDetails, children=null})=>{

  if(requestDetails.PROCESSO === 'Encerramento de base')
    return <BaseClosureDetails requestDetails={requestDetails}>{children}</BaseClosureDetails>;

  if(requestDetails.PROCESSO === 'Alteração de limite do contrato da base')
    return <BaseContractLimitChangeDetails requestDetails={requestDetails}>{children}</BaseContractLimitChangeDetails>;

  if(requestDetails.PROCESSO === 'Criação de base para emissão do cartão')
    return <BaseCreationDetails requestDetails={requestDetails}>{children}</BaseCreationDetails>;

  if(requestDetails.PROCESSO === 'Alteração de gestor de base')
    return <ChangeOfBaseManagerDetails requestDetails={requestDetails}>{children}</ChangeOfBaseManagerDetails>;

  if(requestDetails.PROCESSO === 'Liberação de acesso master')
    return <MasterAccessReleaseDetails requestDetails={requestDetails}>{children}</MasterAccessReleaseDetails>;


  return <></>;
};
