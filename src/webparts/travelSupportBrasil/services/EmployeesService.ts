import { IEmployee } from '../Interfaces/IEmployee';
import Sleep from "../Utils/Sleep";
import { sp } from '@pnp/sp';

const listName = 'MDM';

export const handleGetMyInfos = async()=> {
  const {Email, Title} = await sp.web.currentUser.get();
  const Photo = await `https://outlook.office.com/owa/service.svc/s/GetPersonaPhoto?email=${Email}`;
  return {Email, Title, Photo};
};

export const getEmployee = (key:string, value:string, fields?:string[]):Promise<IEmployee> => sp.web.lists.getByTitle(listName)
  .items
  .filter(`${key} eq '${value}'`)
  .top(1)
  .select(...fields)
  .get()
  .then( resp => resp[0] );

  export const NewEmployee = (employee:IEmployee) => sp.web.lists.getByTitle(listName).items
  .add(employee);

export const GetAllEmployees = async()=>{
  let employees = [];
  let items = await sp.web.lists.getByTitle(listName).items
      .top(4999)
      .getPaged();
  items.results.map(res => employees.push(res));
  while(items.hasNext) {
    items = await items.getNext();
    items.results.map(res => employees.push(res));
  }
  return employees;
};

export const batchInsertEmployees = async (data:IEmployee[]) => {
  const list = sp.web.lists.getByTitle(listName);
  const entityTypeFullName = await list.getListItemEntityTypeFullName();
  const batch = sp.web.createBatch();
  const results = [];
  data.map(employee =>
  {
    if(employee.IAM_ACCESS_IDENTIFIER){
      list.items.inBatch(batch).add(employee, entityTypeFullName)
      .then(res => res)
      .catch(error => console.log('Insert Error:', error));
    }
  });
  Sleep(500);
  await batch.execute();
  return results;
};

export const batchUpdateEmployees = async (data:IEmployee[]) => {
  const list = sp.web.lists.getByTitle(listName);
  const entityTypeFullName = await list.getListItemEntityTypeFullName();
  const batch = sp.web.createBatch();
  const results = [];
  data.map(employee =>
  {
    if(employee.IAM_ACCESS_IDENTIFIER){
      list.items.getById(employee.Id).inBatch(batch).update(employee, "*", entityTypeFullName)
      .then(res => results.push(res))
      .catch(error => console.log('Update Error:', error));
    }
  });
  Sleep(500);
  await batch.execute();
  return results;
};

export const getEmployeeInMdmApi = (iamAccessId: string) => 
fetch(
  `https://mdm-prod-api.valedigital.io/mdm-api/mdm?iamAccessIdentifier=${iamAccessId}`, 
  {
    method:'GET', 
    headers: {'Authorization': 'Basic ' + btoa('coviduser:5C2BAB54-39E7-4245-A773-E14C37CCA0ED')}
  })
.then(response => response.json())
.then(employee => employee[0]);