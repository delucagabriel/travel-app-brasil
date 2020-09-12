import { sp } from "@pnp/sp";

export const newRequest = data => sp.web.lists.getByTitle('Requests').items.add(data);

export const updateRequest = data => sp.web.lists.getByTitle('Requests').items
  .getById(data.Id)
  .update(data);

  export const handleGetAllRequests = async ()=>{
    let requests = [];
    let items = await sp.web.lists.getByTitle("Requests").items
        .select('ID', 'Created', 'Modified', 'Status', 'ApprovalStatus', 'ApprovedAt', 'ApprovalNotes', 'ServiceStatus', 'AttendedAt', 'ServiceNotes','AttendanceDuration', 'Macroprocess', 'Process', 'CardType', 'BeneficiaryID', 'EmployeeName', 'EmployeeEmail', 'PhoneNumber', 'CompanyCode', 'CompanyName', 'Location', 'NewLimit', 'Approver', 'ApproverLevel', 'ApproverName', 'ApproverEmail', 'CostCenter', 'TravelDate', 'Last4Digits', 'Reason', 'EndDate', 'AcceptedTerm', 'ApprovalWorkflow', 'Author/Title', 'Editor/Title')
        .expand('Author', 'Editor')
        .top(4999)
        .getPaged();
    items.results.map(res => requests.push(res));
    while(items.hasNext) {
      items = await items.getNext();
      items.results.map(res => requests.push(res));
    }
    return requests;
  };
