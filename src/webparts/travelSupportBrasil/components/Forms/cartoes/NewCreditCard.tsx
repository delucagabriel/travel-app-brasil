import * as React from 'react';
import { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";
import { TextField, Select, MenuItem, FormLabel, Button,
  Grid, Input, Paper, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Context } from '../../Context';
import { getEmployee } from '../../../services/EmployeesService';
import { newRequest } from '../../../services/RequestServices';
import { IEmployee } from '../../../Interfaces/IEmployee';
import { ISnack } from '../../../Interfaces/ISnack';
import { IRequests } from '../../../Interfaces/IRequests';


const schema = yup.object().shape({
  MACROPROCESSO: yup.string().required(),
  PROCESSO: yup.string().required(),
  BENEFICIARIO_ID: yup.string().required(),
  BENEFICIARIO_NOME: yup.string().required(),
  BENEFICIARIO_EMPRESA_NOME: yup.string().required(),
  BENEFICIARIO_EMAIL: yup.string().email().notRequired(),
  APROVADOR_ID: yup.string().required(),
  APROVADOR_NOME: yup.string().required(),
  APROVADOR_LEVEL: yup.string().required().notOneOf(['STAFF','SUP', 'D-4'], 'Minimum level equal to D-3'),
  APROVADOR_EMPRESA: yup.string().required(),
  APROVADOR_EMAIL: yup.string().email().required(),
  CENTRO_DE_CUSTOS: yup.string().required(),
  END_CEP: yup.string().required(),
  END_LOGRADOURO: yup.string().required(),
  END_NUMERO: yup.string().required(),
  END_COMPLEMENTO: yup.string().required(),
  NOVO_LIMITE: yup.number()
    .positive()
    .min(5000)
    .max(100000)
    .required(),
    BENEFICIARIO_EMPRESA_COD: yup.string().required(),
  DATA_DE_UTILIZACAO: yup.date().required(),
  WF_APROVACAO: yup.boolean().default(true),

});

export default function NewCreditCard(){
  const { register, handleSubmit, control, errors, reset, getValues } = useForm<IRequests>({
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

  const handleGetEmployee = value => getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
  .then(emp => setEmployee(emp));

  const handleGetApprover = value => getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
  .then(emp => setApprover(emp));

  const onSubmit = (data:IRequests, e) => {
    newRequest(data)
      .then(res => {
        setSnackMessage({open:true, message: `Request successfully recorded under ID:${res.data.ID}`, severity:"success"});
        updateContext();
      })
      .catch(()=> {
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
                <FormLabel id="Macroprocess" component="legend">Macroprocesso</FormLabel>
                <Controller
                  as={
                    <Select disabled fullWidth>
                      <MenuItem value="Cartão corporativo"> Cartão corporativo </MenuItem>
                    </Select>
                  }
                  name="MACROPROCESSO"
                  defaultValue="Cartão corporativo"
                  rules={{ required: "this is required" }}
                  control={control}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                <FormLabel id="Process" component="legend">Process</FormLabel>
                <Controller
                  as={
                    <Select disabled fullWidth>
                      <MenuItem value="Novo cartão">Novo cartão</MenuItem>
                    </Select>
                  }
                  id="Process"
                  name="PROCESSO"
                  defaultValue="Novo cartão"
                  rules={{ required: "this is required" }}
                  control={control}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                <TextField
                  fullWidth
                  variant="outlined"
                  type="search"
                  name="BENEFICIARIO_ID"
                  label="Empregado: Matrícula"
                  onBlur={ e=> handleGetEmployee(e.target.value) }
                  inputRef={register}
                  error={errors.BENEFICIARIO_ID?true:false}
                  helperText={errors.BENEFICIARIO_ID && errors.BENEFICIARIO_ID.message}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                <TextField
                  fullWidth
                  variant="outlined" type="number" name="NOVO_LIMITE" label="Limite"
                  inputRef={register}
                  error={errors.NOVO_LIMITE?true:false}
                  helperText={errors.NOVO_LIMITE && errors.NOVO_LIMITE.message}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                <TextField
                  fullWidth
                  label="Data da viagem"
                  variant="outlined"
                  id="TravelDate"
                  type="date"
                  name="DATA_DE_UTILIZACAO"
                  inputRef={register}
                  InputLabelProps={{ shrink: true }}
                  error={errors.DATA_DE_UTILIZACAO?true:false}
                  helperText={errors.DATA_DE_UTILIZACAO && errors.DATA_DE_UTILIZACAO.message}
                />
              </Grid>
              <Grid item xs={12} sm={7} md={7} lg={7} xl={7} >
                <TextField
                  variant="outlined"
                  disabled
                  fullWidth
                  defaultValue=" "
                  type="text"
                  name="BENEFICIARIO_NOME"
                  label="Empregado: Nome"
                  value={employee && employee.FULL_NAME }
                  inputRef={register}
                  error={errors.BENEFICIARIO_NOME?true:false}
                  helperText={errors.BENEFICIARIO_NOME && errors.BENEFICIARIO_NOME.message}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={3} lg={4} xl={4} >
                <TextField
                  required
                  fullWidth
                  variant="outlined"
                  type="search"
                  name="APROVADOR_ID"
                  label="Aprovador: Matrícula"
                  onBlur={e=>handleGetApprover(e.target.value)}
                  inputRef={register}
                  error={errors.APROVADOR_ID?true:false}
                  helperText={errors.APROVADOR_ID && errors.APROVADOR_ID.message}
                />
              </Grid>


              <Grid item xs={12} sm={5} md={5} lg={5} xl={5} >
              <TextField
                  variant="outlined"
                  disabled
                  fullWidth
                  defaultValue=" "
                  type="text"
                  name="APROVADOR_NOME"
                  label="Aprovador: Nome"
                  value={approver && approver.FULL_NAME}
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
                  label="Aprovador: Nível"
                  value={approver && approver.APPROVAL_LEVEL_CODE}
                  InputLabelProps={{ shrink: true }}
                  inputRef={register}
                  error={errors.APROVADOR_LEVEL?true:false}
                  helperText={errors.APROVADOR_LEVEL && errors.APROVADOR_LEVEL.message}
                />
              </Grid>
              <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} justify="space-between">
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>

              <Input inputRef={register} readOnly type="hidden" id="EmployeeEmail" name="EmployeeEmail" value={employee && employee.WORK_EMAIL_ADDRESS } />
              <Input inputRef={register} readOnly type="hidden" id="CostCenter" name="CostCenter" value={employee && employee.COST_CENTER_CODE } />
              <Input inputRef={register} readOnly type="hidden" id="CompanyCode" name="CompanyCode" value={employee && employee.COMPANY_CODE } />
              <Input inputRef={register} readOnly type="hidden" id="CompanyName" name="CompanyName" value={employee && employee.COMPANY_DESC } />
              <Input inputRef={register} readOnly type="hidden" id="Location" name="Location" value={employee && employee.BUSINESS_UNIT + " - " + employee.FACILITY_DESCRIPTION } />
              <Input inputRef={register} readOnly type="hidden" id="ApproverEmail" name="ApproverEmail" value={approver && approver.WORK_EMAIL_ADDRESS } />

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
