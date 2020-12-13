import * as React from 'react';
import { QuestionAboutNormativeDocumentsDetails } from './ReportsAndNormativeDocuments/QuestionsAboutNormativeDocumentsDetails';
import { TravelReportsDetails } from './ReportsAndNormativeDocuments/TravelReportsDetails';


export const NormativeOrReportsDetails = ({requestDetails, children=null})=>{
  if(requestDetails.PROCESSO === 'Dúvida sobre documentos normativos de Viagens')
    return <QuestionAboutNormativeDocumentsDetails requestDetails={requestDetails}>{children}</QuestionAboutNormativeDocumentsDetails>;

  if(requestDetails.PROCESSO === 'Relatórios de viagens')
    return <TravelReportsDetails requestDetails={requestDetails}>{children}</TravelReportsDetails>;

  return <></>;
};
