export interface IEmployee {
  Id?: number;
  Title:string;
  isAdmin?:boolean;
  COMPANY_CODE:string;
  COMPANY_DESC:string;
  FULL_NAME:string;
  WORK_EMAIL_ADDRESS:string;
  APPROVAL_LEVEL_CODE:string;
  COST_CENTER_CODE:string;
  BUSINESS_UNIT:string;
  FACILITY_DESCRIPTION:string;
  IAM_ACCESS_IDENTIFIER:string;
  JOB_DESCRIPTION:string;
  DEPARTMENT_NAME:string;
  EMPLOYMENT_STATUS_DESC: string;
  FACILITY_CITY: string;
  FACILITY_COUNTRY: string;
  FACILITY_PROVINCE: string;
  UPDATE_DATE_TIME:Date;
}
