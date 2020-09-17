import * as React from 'react';
import { useState, useContext } from 'react';
import { TextField, Select, MenuItem, FormLabel, Button, Grid, Input, Paper, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";
import { Context } from '../../Context';
import { getEmployee } from '../../../services/EmployeesService';
import { newRequest } from '../../../services/RequestServices';
import { IEmployee } from '../../../Interfaces/IEmployee';
import { IRequests } from '../../../Interfaces/IRequests';
import { ISnack } from '../../../Interfaces/ISnack';

const schema = yup.object().shape({
  MACROPROCESSO: yup.string().required(),
  PROCESSO: yup.string().required(),
  BENEFICIARIO_ID: yup.string().required(),
  BENEFICIARIO_NOME: yup.string().required(),
  BENEFICIARIO_EMPRESA_COD: yup.string().required(),
  BENEFICIARIO_EMPRESA_NOME: yup.string().required(),
  APROVADOR: yup.string().required(),
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
  const { register, handleSubmit, control, errors, reset } = useForm<IRequests>({
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

  const onSubmit = (data:IRequests, e) => {
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
            <FormLabel id="MACROPROCESSO" component="legend">MACROPROCESSO</FormLabel>
            <Controller
              as={
                <Select disabled fullWidth>
                  <MenuItem value="Corporate Card"> Corporate Card </MenuItem>
                </Select>
              }
              name="MACROPROCESSO"
              defaultValue="Corporate Card"
              control={control}
              error={errors.MACROPROCESSO?true:false}
              helperText={errors.MACROPROCESSO && errors.MACROPROCESSO.message}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
            <FormLabel id="Process" component="legend">Process</FormLabel>
            <Controller
              as={
                <Select disabled fullWidth>
                  <MenuItem value="Alterar limite">Change limit</MenuItem>
                </Select>
              }
              id="Process"
              name="PROCESSO"
              defaultValue="Alterar limite"
              control={control}
              error={errors.PROCESSO?true:false}
              helperText={errors.PROCESSO && errors.PROCESSO.message}
            />
          </Grid>

          <Grid item xs={12} sm={3} md={3} lg={3} xl={3} >
          <TextField fullWidth type="text" required name="BENEFICIARIO_ID" variant="outlined"
              label="Employee" onBlur={ e=> handleGetEmployee(e.target.value) }
              inputRef={register}
              error={errors.BENEFICIARIO_ID?true:false}
              helperText={errors.BENEFICIARIO_ID && errors.BENEFICIARIO_ID.message}
            />
          </Grid>
          <Grid item xs={12} sm={5} md={5} lg={5} xl={5} >
            <TextField disabled fullWidth type="text" name="BENEFICIARIO_NOME"
              label="Empregado: Nome" variant="outlined"
              value={employee? employee.FULL_NAME : ""}
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_NOME?true:false}
              helperText={errors.BENEFICIARIO_NOME && errors.BENEFICIARIO_NOME.message}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
            <TextField disabled fullWidth type="text" name="BENEFICIARIO_EMAIL" label="Empregado: e-mail" variant="outlined"
              value={employee ? employee.WORK_EMAIL_ADDRESS : "" }
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_EMAIL?true:false}
              helperText={errors.BENEFICIARIO_EMAIL && errors.BENEFICIARIO_EMAIL.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField fullWidth type="number" required name="NOVO_LIMITE" label="Novo limite" variant="outlined"
            error={errors.NOVO_LIMITE?true:false}
            helperText={errors.NOVO_LIMITE && errors.NOVO_LIMITE.message}
            inputRef={register}/>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField fullWidth id="EndDate" type="date" name="PERIODO" label="End Date"
            variant="outlined" InputLabelProps={{ shrink: true }} inputRef={register}
            error={errors.PERIODO?true:false}
            helperText={errors.PERIODO && errors.PERIODO.message}
            >End Date</TextField>
          </Grid>

          <Grid item xs={12} sm={3} md={3} lg={3} xl={3} >
            <TextField fullWidth type="search" required name="APROVADOR_ID" variant="outlined" label="Approver"
              error={errors.APROVADOR_ID?true:false}
              helperText={errors.APROVADOR_ID && errors.APROVADOR_ID.message}
              inputRef={register}
              onBlur={e=>handleGetApprover(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={5} md={5} lg={5} xl={5} >
              <TextField
                disabled
                fullWidth
                type="text"
                name="APROVADOR_NOME"
                label="Approver name"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={approver ? approver.FULL_NAME : "" }
                inputRef={register}
                error={errors.APROVADOR_NOME?true:false}
                helperText={errors.APROVADOR_NOME && errors.APROVADOR_NOME.message}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={3} lg={3} xl={3} >
              <TextField
                variant="outlined"
                disabled
                fullWidth
                type="text"
                name="APROVADOR_LEVEL"
                label="Approver Level"
                value={approver && approver.APPROVAL_LEVEL_CODE}
                InputLabelProps={{ shrink: true }}
                inputRef={register}
                error={errors.APROVADOR_LEVEL?true:false}
                helperText={errors.APROVADOR_LEVEL && errors.APROVADOR_LEVEL.message}
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
