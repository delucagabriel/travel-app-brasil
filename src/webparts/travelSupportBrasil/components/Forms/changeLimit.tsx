import * as React from 'react';
import {
  TextField, Select, MenuItem, FormLabel, Button,
  Grid, Input, Paper, Snackbar
} from '@material-ui/core';
import { useState, useContext } from 'react';
import { getEmployee } from '../services/EmployeesService';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";
import { newRequest } from '../services/RequestServices';
import { AlertProps, Alert } from '@material-ui/lab';
import { IEmployee } from '../Interfaces/IEmployee';
import { Context } from '../Utils/Context';


interface IFormInputs {
  Macroprocess:string;
  Process:string;
  CardType:string;
  BeneficiaryID:string;
  NewLimit:number;
  EndDate:Date;
  EmployeeName:string;
  EmployeeEmail:string;
  Approver:string;
  ApproverName:string;
  ApproverEmail:string;
  ApproverLevel:string;
  CompanyCode:number;
  CompanyName:string;
  ApprovalWorkflow:boolean;
}

interface ISnack extends AlertProps {
  open: boolean;
  message: string;
}

const schema = yup.object().shape({
  Macroprocess: yup.string().required(),
  Process: yup.string().required(),
  CardType: yup.string().required(),
  BeneficiaryID: yup.string().required(),
  EmployeeName: yup.string().required(),
  EmployeeEmail: yup.string().required(),
  Approver: yup.string().required(),
  ApproverName: yup.string().required(),
  ApproverEmail: yup.string().email().required(),
  ApproverLevel: yup.string().required().notOneOf(['STAFF','SUP', 'D-4'], 'Minimum level equal to D-3'),
  CompanyName: yup.string().required(),
  NewLimit: yup.number()
    .positive()
    .min(5000)
    .max(100000)
    .required(),
  CompanyCode: yup.number()
    .integer()
    .positive()
    .required(),
  EndDate: yup.date().min(new Date()).required(),
  ApprovalWorkflow: yup.boolean().default(true)
});

export default function ChangeLimit() {
  const { register, handleSubmit, control, errors, reset } = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  });
  const [employee, setEmployee] = useState<IEmployee>();
  const [approver, setApprover] = useState<IEmployee>();
  const [snackMessage, setSnackMessage] = useState<ISnack>({
    open: false,
    message: "",
    severity:'info'
  });
  const { updateContext } = useContext(Context);

  const handleGetEmployee = value =>getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
  .then(emp => setEmployee(emp));

  const handleGetApprover = value =>getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
  .then(emp => setApprover(emp));

  const onSubmit = (data:IFormInputs, e) => {
    newRequest(data)
      .then(res => {
        setSnackMessage({open:true, message: `Request successfully recorded under ID:${res.data.ID}`, severity:"success"});
        updateContext();
      })
      .catch(error => {
        setSnackMessage({open:true, message: "Request failed", severity:"error"});
      });
      e.target.reset();
  };
  return (
    <Paper>
      <div style={{padding:"20px"}}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} justify="space-between">
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
            <FormLabel id="Macroprocess" component="legend">Macroprocess</FormLabel>
            <Controller
              as={
                <Select disabled fullWidth>
                  <MenuItem value="Corporate Card"> Corporate Card </MenuItem>
                </Select>
              }
              name="Macroprocess"
              defaultValue="Corporate Card"
              control={control}
              error={errors.Macroprocess?true:false}
              helperText={errors.Macroprocess && errors.Macroprocess.message}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
            <FormLabel id="Process" component="legend">Process</FormLabel>
            <Controller
              as={
                <Select disabled fullWidth>
                  <MenuItem value="Change Limit">Change limit</MenuItem>
                </Select>
              }
              id="Process"
              name="Process"
              defaultValue="Change Limit"
              control={control}
              error={errors.Process?true:false}
              helperText={errors.Process && errors.Process.message}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
            <FormLabel id="CardTypeLabel" component="legend">Card Type</FormLabel>
            <Controller
              as={
                <Select fullWidth>
                  <MenuItem value="TCard">TCard</MenuItem>
                  <MenuItem value="PCard">PCard</MenuItem>
                </Select>
              }
              name="CardType"
              control={control}
              error={errors.CardType?true:false}
              helperText={errors.CardType && errors.CardType.message}
            />
          </Grid>

          <Grid item xs={12} sm={3} md={3} lg={3} xl={3} >
          <TextField fullWidth type="text" required name="BeneficiaryID" variant="outlined"
              label="Employee" onBlur={ e=> handleGetEmployee(e.target.value) }
              inputRef={register}
              error={errors.BeneficiaryID?true:false}
              helperText={errors.BeneficiaryID && errors.BeneficiaryID.message}
            />
          </Grid>
          <Grid item xs={12} sm={5} md={5} lg={5} xl={5} >
            <TextField disabled fullWidth type="text" name="EmployeeName"
              label="Employee name" variant="outlined"
              value={employee? employee.FULL_NAME : ""}
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.EmployeeName?true:false}
              helperText={errors.EmployeeName && errors.EmployeeName.message}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
            <TextField disabled fullWidth type="text" name="EmployeeEmail" label="Employee e-mail" variant="outlined"
              value={employee ? employee.WORK_EMAIL_ADDRESS : "" }
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.EmployeeEmail?true:false}
              helperText={errors.EmployeeEmail && errors.EmployeeEmail.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField fullWidth type="number" required name="NewLimit" label="New Limit" variant="outlined"
            error={errors.NewLimit?true:false}
            helperText={errors.NewLimit && errors.NewLimit.message}
            inputRef={register}/>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField fullWidth id="EndDate" type="date" name="EndDate" label="End Date"
            variant="outlined" InputLabelProps={{ shrink: true }} inputRef={register}
            error={errors.EndDate?true:false}
            helperText={errors.EndDate && errors.EndDate.message}
            >End Date</TextField>
          </Grid>

          <Grid item xs={12} sm={3} md={3} lg={3} xl={3} >
            <TextField fullWidth type="search" required name="Approver" variant="outlined" label="Approver"
              error={errors.Approver?true:false}
              helperText={errors.Approver && errors.Approver.message}
              inputRef={register}
              onBlur={e=>handleGetApprover(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={5} md={5} lg={5} xl={5} >
              <TextField
                disabled
                fullWidth
                type="text"
                name="ApproverName"
                label="Approver name"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={approver ? approver.FULL_NAME : "" }
                inputRef={register}
                error={errors.ApproverName?true:false}
                helperText={errors.ApproverName && errors.ApproverName.message}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={3} lg={3} xl={3} >
              <TextField
                variant="outlined"
                disabled
                fullWidth
                type="text"
                name="ApproverLevel"
                label="Approver Level"
                value={approver && approver.APPROVAL_LEVEL_CODE}
                InputLabelProps={{ shrink: true }}
                inputRef={register}
                error={errors.ApproverLevel?true:false}
                helperText={errors.ApproverLevel && errors.ApproverLevel.message}
              />
            </Grid>
            <Grid xs={12} sm={12} md={12} lg={12} xl={12} item justify="flex-end" alignItems="flex-end">
              <Button type="submit" style={{float:'right'}}
              variant="contained" color="primary"> Submit </Button>
            </Grid>
        </Grid >
        <Input inputRef={register} readOnly type="hidden" id="CompanyCode" name="CompanyCode" value={employee && employee.COMPANY_CODE } />
        <Input inputRef={register} readOnly type="hidden" id="CompanyName" name="CompanyName" value={employee && employee.COMPANY_DESC } />
        <Input inputRef={register} readOnly type="hidden" id="ApproverEmail" name="ApproverEmail" value={approver && approver.WORK_EMAIL_ADDRESS } />
      </form>

      <Snackbar
        anchorOrigin={{ vertical:'top', horizontal:'right' }}
        open={snackMessage.open}
        onClose={()=>setSnackMessage({...snackMessage, open:false})}
        key={'top' + 'right'}
      >
        <Alert onClose={()=>setSnackMessage({...snackMessage, open:false})} severity={snackMessage.severity}>
          {snackMessage.message}
        </Alert>
      </Snackbar>

      </div>
    </Paper>

  );
}
