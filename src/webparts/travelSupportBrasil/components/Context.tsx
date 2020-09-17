import * as React from 'react';
import { createContext } from 'react';
import { useEffect, useState } from 'react';
import { sp } from "@pnp/sp";
import { getEmployee, handleGetMyInfos } from '../services/EmployeesService';
import { IEmployee } from '../Interfaces/IEmployee';
import { handleGetAllRequests } from '../services/RequestServices';

interface User {
  Email:string;
  Title:string;
  Photo:string;
}
interface Employee extends User, IEmployee{}

const Context = createContext(null);

const Provider = ({children}) => {
  const [myInfos, setMyInfos] = useState<User>();
  const [employeeInfos, setEmployeeInfos] = useState<Employee>();
  const [myRequests, setMyRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
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

  useEffect(()=> {handleGetMyInfos()
    .then(res => setMyInfos(res));
  },[]);

  useEffect(
    ()=> {
      const fields = ["COMPANY_DESC", "COST_CENTER_CODE", "FACILITY_CITY", "FACILITY_PROVINCE", "FACILITY_COUNTRY", "IAM_ACCESS_IDENTIFIER", "JOB_DESCRIPTION", "APPROVAL_LEVEL_CODE", "DEPARTMENT_NAME", "isAdmin"];

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
        handleGetMyRequests();
        setLoading(false);
      },[employeeInfos, updateInfos]);

  const updateContext = ():void=> setUpdateInfos(!updateInfos);


  return (
    <Context.Provider
    value={{
      employeeInfos,
      myRequests,
      allRequests,
      loading,
      updateContext
    }}>
      {children}
    </Context.Provider>
  );
};

export { Context, Provider };
