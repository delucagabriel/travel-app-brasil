import * as React from 'react';
import { createContext } from 'react';
import { useEffect, useState } from 'react';
import { sp } from "@pnp/sp";
import { getEmployee, handleGetMyInfos } from '../services/EmployeesService';
import { IEmployee } from '../Interfaces/IEmployee';
import { handleGetAllRequests } from '../services/RequestServices';
import { IRequests_AllFields } from '../Interfaces/Requests/IRequests';

interface User {
  Email:string;
  Title:string;
  Photo:string;
}
interface Employee extends User, IEmployee{}

import { GetCorporateCardConfig } from "../services/ConfigService";
export var globalTipoCartao: any = {};



const Context = createContext(null);

const Provider = ({children}) => {
  const [myInfos, setMyInfos] = useState<User>();
  const [employeeInfos, setEmployeeInfos] = useState<Employee>();
  const [myRequests, setMyRequests] = useState<IRequests_AllFields[]>([]);
  const [myApprovals, setMyApprovals] = useState<IRequests_AllFields[]>([]);
  const [allRequests, setAllRequests] = useState<IRequests_AllFields[]>([]);
  const [allRequestsBradesco, setAllRequestsBradesco] = useState<IRequests_AllFields[]>([]);
  const [allRequestsTicketLog, setAllRequestsTicketLog] = useState<IRequests_AllFields[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateInfos, setUpdateInfos] = useState(true);


  const handleGetMyRequests = ()=> {
    myInfos? sp.web.lists.getByTitle("SOLICITACOES").items
    .filter(`Author/EMail eq '${employeeInfos && employeeInfos.Email}' or BENEFICIARIO_ID eq '${employeeInfos && employeeInfos.IAM_ACCESS_IDENTIFIER}'`)
    .select('*', 'Author/Title', 'Editor/Title')
    .expand('Author', 'Editor')
    .top(4999)
    .getAll()
    .then(res =>setMyRequests(res))
  :setLoading(true);
  setLoading(false);
  };

  const handleGetMyApprovals = ()=> {
    myInfos? sp.web.lists.getByTitle("SOLICITACOES").items
    .filter(`APROVADOR_EMAIL eq '${employeeInfos && employeeInfos.Email}'`)
    .select('*', 'Author/Title', 'Editor/Title')
    .expand('Author', 'Editor')
    .top(4999)
    .getAll()
    .then(res =>setMyApprovals(res))
  :setLoading(true);
  setLoading(false);
  };

  useEffect(()=> {
    handleGetMyInfos()
    .then(res => setMyInfos(res));

    GetCorporateCardConfig().then(configs => {
      configs.map(
        limiteConfig => {
          globalTipoCartao[String(limiteConfig.Title).replace(' ', '_')] = `${limiteConfig.Title} - ${limiteConfig.Limite.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
        });
    });
      
  },[]);

  useEffect(
    ()=> {
      const fields = [
        "COMPANY_DESC", "COMPANY_CODE", "COST_CENTER_CODE", "FACILITY_CITY",
        "FACILITY_PROVINCE", "FACILITY_COUNTRY", "IAM_ACCESS_IDENTIFIER",
        "JOB_DESCRIPTION", "APPROVAL_LEVEL_CODE", "DEPARTMENT_NAME",
        "FULL_NAME","isAdmin"
      ];

      myInfos? getEmployee('WORK_EMAIL_ADDRESS', myInfos.Email, fields)
      .then(emp => {
            setEmployeeInfos({...myInfos, ...emp});
            })
          :setLoading(true);
    },[myInfos]);

    useEffect(
      ()=> {
        if(employeeInfos && employeeInfos.isAdmin)
        {
          setLoading(true);
          handleGetAllRequests().then(res => setAllRequests(res));
          setLoading(false);
        }

        if(employeeInfos ){
          setLoading(true);
          handleGetAllRequests().then(res => setAllRequestsBradesco(res.filter((req:IRequests_AllFields) => req.AREA_RESOLVEDORA === 'Bradesco')));
          setLoading(false);
        }

        if(employeeInfos && employeeInfos.COMPANY_DESC === 'TicketLog'){
          setLoading(true);
          handleGetAllRequests().then(res => setAllRequestsTicketLog(res.filter((req:IRequests_AllFields) => req.AREA_RESOLVEDORA === 'TicketLog')));
          setLoading(false);
        }

        handleGetMyRequests();
        setLoading(false);

        if(employeeInfos && employeeInfos.APPROVAL_LEVEL_CODE.toLowerCase() !== 'staff')
        {
          setLoading(true);
          handleGetMyApprovals();
          setLoading(false);
        }

      },[employeeInfos, updateInfos]);

  const updateContext = ():void=> setUpdateInfos(!updateInfos);


  return (
    <Context.Provider
    value={{
      employeeInfos,
      myRequests,
      allRequests,
      allRequestsBradesco,
      allRequestsTicketLog,
      myApprovals,
      loading,
      updateContext
    }}>
      {children}
    </Context.Provider>
  );
};

export { Context, Provider };
