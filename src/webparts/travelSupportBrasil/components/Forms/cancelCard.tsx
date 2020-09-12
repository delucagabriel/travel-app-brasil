import * as React from 'react';
import { TextField, Select, MenuItem, FormLabel, Grid, Button, Input, Paper, Typography, Snackbar } from '@material-ui/core';
import { useState, useContext } from 'react';
import { getEmployee } from '../services/EmployeesService';
import { useForm, Controller } from "react-hook-form";
import { newRequest } from '../services/RequestServices';
import { IEmployee } from '../Interfaces/IEmployee';
import { AlertProps, Alert } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";
import { Context } from '../Utils/Context';

interface IFormInputs {
  Macroprocess:string;
  Process:string;
  CardType:string;
  BeneficiaryID:string;
  EndDate:Date;
  EmployeeName:string;
  EmployeeEmail:string;
  CompanyCode:number;
  CompanyName:string;
  ApprovalWorkflow:boolean;
  Last4Digits:string;
  Reason: string;
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
  CompanyName: yup.string().required(),
  CompanyCode: yup.number()
    .integer()
    .positive()
    .required(),
  Last4Digits: yup.string()
    .length(4)
    .matches(/\d/, "Only numbers")
    .required(),
  Reason: yup.string()
  .min(10)
  .required(),
  ApprovalWorkflow: yup.boolean().default(false),
  ApprovedAt: yup.date().default(new Date()),
  ApprovalStatus: yup.string().default('Approved')

});

export default function CancelCard() {
  const { register, handleSubmit, control, errors, reset } = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  });
  const [employee, setEmployee] = useState<IEmployee>();
  const [snackMessage, setSnackMessage] = useState<ISnack>({
    open: false,
    message: "",
    severity:'info'
  });
  const { updateContext } = useContext(Context);

  const handleGetEmployee = value =>getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
    .then(emp => setEmployee(emp));


  const onSubmit = (data:IFormInputs, e) => {
    newRequest(data)
      .then(res => {
        setSnackMessage({open:true, message: `Request successfully recorded under ID:${res.data.ID}`, severity:"success"});
        updateContext();
      })
      .catch(error => {
        setSnackMessage({open:true, message: "Request failed", severity:"error"});
        console.log(error);
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
              rules={{ required: "this is required" }}
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
                  <MenuItem value="Cancel Card">Cancel Card</MenuItem>
                </Select>
              }
              id="Process"
              name="Process"
              defaultValue="Cancel Card"
              rules={{ required: "this is required" }}
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
              rules={{ required: "this is required" }}
              control={control}
              error={errors.CardType?true:false}
              helperText={errors.CardType && errors.CardType.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField fullWidth type="text" required name="BeneficiaryID" variant="outlined"
              label="Beneficiary ID" onBlur={ e=> handleGetEmployee(e.target.value) }
              inputRef={register}
              error={errors.BeneficiaryID?true:false}
              helperText={errors.BeneficiaryID && errors.BeneficiaryID.message}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
            <TextField fullWidth variant="outlined" type="text" required name="Last4Digits" label="Last 4 digits"
              inputRef={register}
              error={errors.Last4Digits?true:false}
              helperText={errors.Last4Digits && errors.Last4Digits.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField disabled fullWidth type="text" name="EmployeeName" label="Employee name" variant="outlined"
              value={employee? employee.FULL_NAME: ""}
              inputRef={register}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
              error={errors.EmployeeName?true:false}
              helperText={errors.EmployeeName && errors.EmployeeName.message}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField disabled fullWidth type="text" name="EmployeeEmail" label="Employee e-mail"
              variant="outlined"  value={employee ? employee.WORK_EMAIL_ADDRESS : "" }
              inputRef={register}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
              error={errors.EmployeeEmail?true:false}
              helperText={errors.EmployeeEmail && errors.EmployeeEmail.message}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField fullWidth variant="outlined" type="text" name="Reason" label="Reason" inputRef={register}
              error={errors.Reason?true:false}
              helperText={errors.Reason && errors.Reason.message}
            />
          </Grid>

          <Grid xs={12} sm={12} md={12} lg={12} xl={12} item justify="flex-end" alignItems="flex-end">
            <Button type="submit"
            variant="contained" color="primary" style={{float:'right'}}> Submit </Button>
          </Grid>

          <Input inputRef={register} readOnly type="hidden" id="CompanyCode" name="CompanyCode"
            value={employee && employee.COMPANY_CODE }
          />
          <Input inputRef={register} readOnly type="hidden" id="CompanyName" name="CompanyName"
            value={employee && employee.COMPANY_DESC } />
        </Grid >
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
