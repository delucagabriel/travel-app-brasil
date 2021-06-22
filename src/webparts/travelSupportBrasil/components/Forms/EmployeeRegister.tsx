import * as React from 'react';
import { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";
import { TextField, Button,
  Grid, Input, Paper, Snackbar, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { IEmployee } from '../../Interfaces/IEmployee';
import { getEmployeeInMdmApi, NewEmployee } from '../../services/EmployeesService';
import { ISnack } from '../../Interfaces/ISnack';

interface EmployeeApiMDM {
    FULL_NAME:string;
    MDM_ID:number;
    CPF:string;
    NETWORK_USER_IDENTIFIER:string;
    IAM_ACCESS_IDENTIFIER:string;
    SOURCE_SYSTEM_EMPLOYEE_IDEN:string;
    WORK_EMAIL_ADDRESS:string;
    COMPANY_CODE:string;
    COMPANY_DESC:string;
    ACTIVE_STATUS:string;
    EMPLOYMENT_TYPE_DESC:string;
    DEPARTMENT_NAME:string;
    POSITION_NAME:string;
    FACILITY_COUNTRY:string;
    FACILITY_PROVINCE:string;
    FACILITY_CITY:string;
    FACILITY_DESCRIPTION:string;
    JOB_FUNCTION:string;
    JOB_TASK:string;
    JOB_DESCRIPTION:string;
    Hire_Date:string;
    BIRTH_DATE:string;
    ADM_MANAGER_EMPLOYEE_IDEN:string;
    'hier - 1':string;
    'hier - 1 IAM_ID':string;
    'hier - 1 WORK_EMAIL_ADDRESS':string;
    'hier - 2':string;
    'hier - 2 IAM_ID':string;
    'hier - 2 WORK_EMAIL_ADDRESS':string;
    'hier - 3':string;
    'hier - 3 IAM_ID':string;
    'hier - 3 WORK_EMAIL_ADDRESS':string;
    'hier - 4':string;
    'hier - 4 IAM_ID':string;
    'hier - 4 WORK_EMAIL_ADDRESS':string;
    'hier - 5':string;
    'hier - 5 IAM_ID':string;
    'hier - 5 WORK_EMAIL_ADDRESS':string;
    'hier - 6':string;
    'hier - 6 IAM_ID':string;
    'hier - 6 WORK_EMAIL_ADDRESS':string;
    'hier - 7':string;
    'hier - 7 IAM_ID':string;
    'hier - 7 WORK_EMAIL_ADDRESS':string;
    'hier - 8':string;
    'hier - 8 IAM_ID':string;
    'hier - 8 WORK_EMAIL_ADDRESS':string;
  }

const schema: yup.ObjectSchema<IEmployee> = yup.object().shape({
    Id: yup.number().notRequired(),
    Title: yup.string().default("Cadastro Manual"),
    isAdmin:yup.boolean().required(),
    COMPANY_CODE:yup.string().required(),
    COMPANY_DESC:yup.string().required(),
    FULL_NAME:yup.string().required(),
    WORK_EMAIL_ADDRESS:yup.string().required(),
    APPROVAL_LEVEL_CODE:yup.string().required(),
    COST_CENTER_CODE:yup.string().min(10).required(),
    BUSINESS_UNIT:yup.string(),
    FACILITY_DESCRIPTION:yup.string().required(),
    IAM_ACCESS_IDENTIFIER:yup.string().required(),
    JOB_DESCRIPTION:yup.string().required(),
    DEPARTMENT_NAME:yup.string().required(),
    EMPLOYMENT_STATUS_DESC: yup.string(),
    FACILITY_CITY: yup.string().required(),
    FACILITY_COUNTRY: yup.string().required(),
    FACILITY_PROVINCE: yup.string().required(),
    UPDATE_DATE_TIME: yup.date().default(new Date()),
});

export default function EmployeeRegister(){
  const { register, handleSubmit, control, errors, setValue } = useForm<IEmployee>({
    resolver: yupResolver(schema)
  });
  const [employee, setEmployee] = useState<IEmployee>();
  const [snackMessage, setSnackMessage] = useState<ISnack>({
    open: false,
    message: "",
    severity:'info'
  });

  const handleGetEmployee = value => getEmployeeInMdmApi(value)
  .then((emp:EmployeeApiMDM) => {
    setEmployee({
        APPROVAL_LEVEL_CODE: "STAFF",
        BUSINESS_UNIT: "",
        COMPANY_CODE: emp.COMPANY_CODE,
        COMPANY_DESC: emp.COMPANY_DESC,
        COST_CENTER_CODE: "",
        DEPARTMENT_NAME: emp.DEPARTMENT_NAME,
        EMPLOYMENT_STATUS_DESC: "ACTIVE",
        FACILITY_CITY: emp.FACILITY_CITY,
        FACILITY_COUNTRY: emp.FACILITY_COUNTRY,
        FACILITY_DESCRIPTION: emp.FACILITY_DESCRIPTION,
        FACILITY_PROVINCE: emp.FACILITY_PROVINCE,
        FULL_NAME: emp.FULL_NAME,
        IAM_ACCESS_IDENTIFIER: emp.IAM_ACCESS_IDENTIFIER,
        JOB_DESCRIPTION: emp.JOB_DESCRIPTION,
        Title: emp.MDM_ID.toString(),
        UPDATE_DATE_TIME: new Date(),
        WORK_EMAIL_ADDRESS: emp.WORK_EMAIL_ADDRESS,
    });

    setValue("FULL_NAME", emp.FULL_NAME, {
      shouldDirty: true
    });
    setValue("WORK_EMAIL_ADDRESS", emp.WORK_EMAIL_ADDRESS, {
        shouldDirty: true
    });
    setValue("COMPANY_CODE", emp.COMPANY_CODE, {
        shouldDirty: true
    });
    setValue("COMPANY_DESC", emp.COMPANY_DESC, {
        shouldDirty: true
    });
    setValue("DEPARTMENT_NAME", emp.DEPARTMENT_NAME, {
        shouldDirty: true
    });
    setValue("FACILITY_CITY", emp.FACILITY_CITY, {
        shouldDirty: true
    });
    setValue("FACILITY_COUNTRY", emp.FACILITY_COUNTRY, {
        shouldDirty: true
    });
    setValue("FACILITY_DESCRIPTION", emp.FACILITY_DESCRIPTION, {
        shouldDirty: true
    });
    setValue("FACILITY_PROVINCE", emp.FACILITY_PROVINCE, {
        shouldDirty: true
    });
    setValue("JOB_DESCRIPTION", emp.JOB_DESCRIPTION, {
        shouldDirty: true
    });
      
  });

  const onSubmit = (data:IEmployee, e) => {
    NewEmployee(data)
      .then(res => setSnackMessage({open:true, message: 'Empregado cadastrado!', severity:"success"}))
      .catch(error => {
          setSnackMessage({open:true, message: String(error), severity:"error"});
          console.log(error);
      });
    e.target.reset();
  };
console.log(errors);

  return (
    <Paper>
      <div style={{padding:"20px"}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} justify="space-between">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
              <TextField
                variant="outlined"
                type="search"
                name="IAM_ACCESS_IDENTIFIER"
                label="Empregado: Matrícula"
                onBlur={ e=> handleGetEmployee(e.target.value) }
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.IAM_ACCESS_IDENTIFIER?true:false}
                helperText={errors.IAM_ACCESS_IDENTIFIER && errors.IAM_ACCESS_IDENTIFIER.message}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                name="FULL_NAME"
                label="Empregado: Nome"
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.FULL_NAME?true:false}
                helperText={errors.FULL_NAME && errors.FULL_NAME.message}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                name="WORK_EMAIL_ADDRESS"
                label="Empregado: E-mail"
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.WORK_EMAIL_ADDRESS?true:false}
                helperText={errors.WORK_EMAIL_ADDRESS && errors.WORK_EMAIL_ADDRESS.message}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                name="COMPANY_CODE"
                label="Empregado: Empresa (Cód)"
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.COMPANY_CODE?true:false}
                helperText={errors.COMPANY_CODE && errors.COMPANY_CODE.message}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                name="COMPANY_DESC"
                label="Empregado: Empresa (Nome)"
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.COMPANY_DESC?true:false}
                helperText={errors.COMPANY_DESC && errors.COMPANY_DESC.message}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                name="DEPARTMENT_NAME"
                label="Empregado: Departamento"
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.DEPARTMENT_NAME?true:false}
                helperText={errors.DEPARTMENT_NAME && errors.DEPARTMENT_NAME.message}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                name="FACILITY_PROVINCE"
                label="Empregado: Facility Province"
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.FACILITY_PROVINCE?true:false}
                helperText={errors.FACILITY_PROVINCE && errors.FACILITY_PROVINCE.message}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                name="FACILITY_CITY"
                label="Empregado: Facility City"
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.FACILITY_CITY?true:false}
                helperText={errors.FACILITY_CITY && errors.FACILITY_CITY.message}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                name="FACILITY_COUNTRY"
                label="Empregado: Facility Country"
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.FACILITY_COUNTRY?true:false}
                helperText={errors.FACILITY_COUNTRY && errors.FACILITY_COUNTRY.message}
              />
            </Grid>

            
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                name="FACILITY_DESCRIPTION"
                label="Empregado: Facility Description"
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.FACILITY_DESCRIPTION?true:false}
                helperText={errors.FACILITY_DESCRIPTION && errors.FACILITY_DESCRIPTION.message}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                name="COST_CENTER_CODE"
                label="Empregado: Centro de custos"
                placeholder="0001010376"
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.COST_CENTER_CODE?true:false}
                helperText={errors.COST_CENTER_CODE && errors.COST_CENTER_CODE.message}
              />
            </Grid>

            <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                name="JOB_DESCRIPTION"
                label="Empregado: Cargo"
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.JOB_DESCRIPTION?true:false}
                helperText={errors.JOB_DESCRIPTION && errors.JOB_DESCRIPTION.message}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <FormControl component="fieldset" error={errors.isAdmin?true:false}>
                    <FormLabel component="legend">Empregado: Nível de aprovação</FormLabel>
                    <RadioGroup aria-label="APPROVAL_LEVEL_CODE" name="APPROVAL_LEVEL_CODE" row>
                        <FormControlLabel value="DE" control={<Radio inputRef={register}/>} label="DE" />
                        <FormControlLabel value="D-1" control={<Radio inputRef={register}/>} label="D-1" />
                        <FormControlLabel value="D-2" control={<Radio inputRef={register}/>} label="D-2" />
                        <FormControlLabel value="D-3" control={<Radio inputRef={register}/>} label="D-3" />
                        <FormControlLabel value="D-4" control={<Radio inputRef={register}/>} label="D-4" />
                        <FormControlLabel value="D-5" control={<Radio inputRef={register}/>} label="D-5" />
                        <FormControlLabel value="SUP" control={<Radio inputRef={register}/>} label="SUP" />
                        <FormControlLabel value="STAFF" control={<Radio inputRef={register}/>} label="STAFF" />
                    </RadioGroup>
                </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <FormControl component="fieldset" error={errors.isAdmin?true:false}>
                <FormLabel component="legend">Empregado administrador do TSB?</FormLabel>
                <RadioGroup aria-label="isAdmin" name="isAdmin" row>
                <FormControlLabel value="true" control={<Radio inputRef={register}/>} label="Sim" />
                <FormControlLabel value="false" control={<Radio inputRef={register}/>} label="Não" />
                </RadioGroup>
                </FormControl>
            </Grid>


            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} ></Grid>
            <Grid item xs={12} sm={1} md={1} lg={1} xl={1}>
              <Button type="submit" variant="contained" color="primary"> Cadastrar </Button>
            </Grid>
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
