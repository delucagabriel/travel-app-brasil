import * as React from 'react';
import { batchInsertEmployees, GetAllEmployees, batchUpdateEmployees } from './services/EmployeesService';
import { IEmployee } from './Interfaces/IEmployee';
import * as moment from 'moment';

let Employees:IEmployee[];
let employeesToAdd:IEmployee[]= [];
let employeesToUpdate:IEmployee[]= [];

async function getExcelData (start, end):Promise<any>{
  const results = await fetch(`/teams/travel_support/_vti_bin/ExcelRest.aspx/Shared%20Documents/MDM.xlsx/model/Ranges('Planilha1!A${start}:Q${end}')?$format=json`);
  const data = await results.json();
  return data.rows;
}

const handleInsertOrUpdateEmployees = ()=>{
  const callEmployeesServices:Promise<any>[]= [];
  const GetAndCompareInformation:Promise<any>[]=[];
  let lastCell;

  GetAndCompareInformation.push(GetAllEmployees().then(res => Employees = res));

  const dados = [];
  fetch(`/teams/travel_support/_vti_bin/ExcelRest.aspx/Shared%20Documents/MDM.xlsx/Model/Ranges('Planilha2!A1')?$format=json`)
  .then(res =>
    res.json().then(data => {
      data.rows[0].map(cell => lastCell = cell.v);
  }))
  .then(()=>{
    for(let firstCellIndex=1, lastCellIndex=500;
      lastCellIndex<=lastCell + (((lastCell%500)-500)*-1);
      firstCellIndex+=500, lastCellIndex+=500){
      GetAndCompareInformation.push(
        getExcelData(firstCellIndex, lastCellIndex).then(data =>{
        if(data){
          for(let d of data){
          dados.push(
            {
              "Title":String(d[0].v),
              "COMPANY_CODE":d[1].v,
              "COMPANY_DESC":d[2].v,
              "FULL_NAME":d[3].v,
              "EMPLOYMENT_STATUS_DESC":d[4].v,
              "DEPARTMENT_NAME":d[5].v,
              "JOB_DESCRIPTION":d[6].v,
              "WORK_EMAIL_ADDRESS":String(d[7].v).toLowerCase(),
              "FACILITY_COUNTRY":d[8].v,
              "FACILITY_PROVINCE":d[9].v,
              "FACILITY_CITY":d[10].v,
              "IAM_ACCESS_IDENTIFIER":d[11].v,
              "COST_CENTER_CODE":d[12].v,
              "BUSINESS_UNIT":d[13].v,
              "FACILITY_DESCRIPTION":d[14].v,
              "APPROVAL_LEVEL_CODE":d[15].v,
              "UPDATE_DATE_TIME":new Date(d[16].v),
            }
            );
          }
        }
      }));
    }}
  );

  Promise.all(GetAndCompareInformation)
    .then(()=> {
      dados
      .filter(dado =>
        dado.IAM_ACCESS_IDENTIFIER !== 'IAM_ACCESS_IDENTIFIER' &&
        dado.IAM_ACCESS_IDENTIFIER !== '' &&
        dado.IAM_ACCESS_IDENTIFIER !== null)
      .map((dado, index, arr ) => {
        let tempEmployeesAdd = Employees.filter(emp => emp.IAM_ACCESS_IDENTIFIER === dado.IAM_ACCESS_IDENTIFIER);
        let tempEmployeeUpdate = tempEmployeesAdd.filter(emp => moment(emp.UPDATE_DATE_TIME) !== moment(dado.UPDATE_DATE_TIME));

        if(tempEmployeesAdd.length === 0){
          employeesToAdd.push(dado);
        }
        else if(tempEmployeeUpdate.length > 0){
          let employeeID = tempEmployeeUpdate[0].Id;
          employeesToUpdate.push({'Id':employeeID, ...dado});
        }

        if (employeesToUpdate.length === 100){
          callEmployeesServices.push(batchUpdateEmployees(employeesToUpdate));
          employeesToUpdate = [];
        }

        if (employeesToAdd.length === 100){
          callEmployeesServices.push(batchInsertEmployees(employeesToAdd));
          employeesToAdd = [];
        }

        if(index === arr.length && (employeesToAdd.length < 100 || employeesToUpdate.length < 100)){
          callEmployeesServices.push(batchInsertEmployees(employeesToAdd));
          callEmployeesServices.push(batchUpdateEmployees(employeesToUpdate));
          employeesToAdd = [];
          employeesToUpdate = [];
        }
      });
    })
    .then(()=> {
      Employees =[];
      Promise.all(callEmployeesServices)
        .then(()=> alert('###### Finish All!!!! ######'))
        .catch(error => console.log(error));
    })
    .catch(error=>console.log('Erro:', error));
};


export const InsertOrUpdateEmployees = () => {
  return(
  <>
    <button onClick={handleInsertOrUpdateEmployees}> Insert/Update </button>
  </>);

};


