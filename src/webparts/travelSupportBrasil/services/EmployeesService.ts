import { IEmployee } from '../Interfaces/IEmployee';
import Sleep from "../Utils/Sleep";
import { sp } from '@pnp/sp';

const listName = 'MDM';

export const handleGetMyInfos = async()=> {
  const {Email, Title} = await sp.web.currentUser.get();
  const Photo = `https://outlook.office.com/owa/service.svc/s/GetPersonaPhoto?email=${Email}`;
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


const deleteEmployee = (ids:number[]) =>{
  const list = sp.web.lists.getByTitle(listName);
  const batch = sp.web.createBatch();
  ids.map(id => list.items.getById(id).inBatch(batch).delete()
    .then(() =>console.log("Sucesso"))
    .catch(()=> console.log("Erro")));
  batch.execute();
  
};




export async function deleteEmployeeExcel(){

  interface Dados{
    id: number;
    email: string;
  }
  let batchData = [];


  const lastCell = 2000;
  const dados: Dados[] = [];
  const qtd_linhas = 500;

  for(let firstCellIndex=2, lastCellIndex=qtd_linhas+1;
    lastCellIndex<=lastCell + (((lastCell%qtd_linhas)-qtd_linhas)*-1);
    firstCellIndex+=qtd_linhas, lastCellIndex+=qtd_linhas){
    
    Sleep(3000);
    let results = await fetch(`/teams/portal_viagens/_vti_bin/ExcelRest.aspx/Documentos%20Compartilhados/EMPREGADOS_DUPLICADOS.xlsx/model/Ranges('Planilha1!A${firstCellIndex}:Q${lastCellIndex}')?$format=json`);
    let prev_data = await results.json();
    let data = await prev_data.rows;
      
    if(data){
      for(let d of data){
      dados.push(
        {
          "id": Number(d[0].v),
          "email": d[1].v,
        }
        );
      }
    }
  }
  dados.map((dado, index) => {
    batchData.push(dado.id);
    if(batchData.length % 100 === 0){
      deleteEmployee(batchData);
      batchData = [];
    }
    //dados.splice(index);
  });
}
