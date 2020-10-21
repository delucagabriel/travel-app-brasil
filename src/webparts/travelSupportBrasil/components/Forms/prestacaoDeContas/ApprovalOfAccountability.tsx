import * as React from 'react';
import { TextField, Select, MenuItem, FormLabel, Grid, Button, Input, Paper, Typography, Snackbar, FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { useState, useContext, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Alert } from '@material-ui/lab';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers';
import { getEmployee } from '../../../services/EmployeesService';
import { newRequest } from '../../../services/RequestServices';
import { IEmployee } from '../../../Interfaces/IEmployee';
import { IRequests_AllFields } from '../../../Interfaces/Requests/IRequests';
import { ISnack } from '../../../Interfaces/ISnack';
import { Context } from '../../Context';
import HocDialog from '../../HOC/HocDialog';



const schema: yup.ObjectSchema<IRequests_AllFields> = yup.object().shape({
  MACROPROCESSO: yup.string().required(),
  PROCESSO: yup.string().required(),
  SLA: yup.number().default(24),
  AREA_RESOLVEDORA: yup.string().default("Viagens Corporativas"),
  ALCADA_APROVACAO: yup.string().default(""),
  WF_APROVACAO: yup.boolean().default(false),
  DATA_DE_APROVACAO: yup.date().default(new Date()),
  STATUS_APROVACAO: yup.string().default('Aprovado'),

  BENEFICIARIO_ID: yup.string().required(),
  BENEFICIARIO_NOME: yup.string().required(),
  BENEFICIARIO_EMAIL: yup.string().email().required(),
  BENEFICIARIO_EMPRESA_COD: yup.string(),
  BENEFICIARIO_EMPRESA_NOME: yup.string(),

  APROVADOR_ID: yup.string().required(),
  APROVADOR_NOME: yup.string().required(),
  APROVADOR_EMAIL: yup.string().email().required(),
  APROVADOR_EMPRESA_COD: yup.string().required(),
  APROVADOR_EMPRESA_NOME: yup.string().required(),

  MOTIVO: yup.string()
  .min(50)
  .required()
});


export default function ApprovalOfAccountability() {
  const { register, handleSubmit, control, errors, reset, setValue } = useForm<IRequests_AllFields>({
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
    .then(emp => {
      setEmployee(emp);
      setValue("BENEFICIARIO_NOME", emp?emp.FULL_NAME:"", {
        shouldDirty: true
      });
      setValue("BENEFICIARIO_EMAIL", emp?emp.WORK_EMAIL_ADDRESS:"", {
        shouldDirty: true
      });
    });

  const handleGetApprover = value => getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
  .then(emp => setApprover(emp));

  const onSubmit = (data:IRequests_AllFields, e) => {
    newRequest(data)
      .then(res => {
        setSnackMessage({open:true, message: `Solicitação gravada com sucesso! ID:${res.data.ID}`, severity:"success"});
        updateContext();
      })
      .catch(error => {
        setSnackMessage({open:true, message: "Falha ao tentar gravar a solicitação", severity:"error"});
        console.log(error);
      });
    e.target.reset();
  };

  return (
    <Paper>
      <HocDialog>
        <Typography variant='body2'>
          Consulte os materiais de apoio para prestação de contas, disponíveis na intranet, em Institucional e serviços > Viagens > Prestação de contas e relatórios.
        </Typography>
      </HocDialog>
      <div style={{padding:"20px"}}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} justify="space-between">
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <FormLabel id="Macroprocesso" component="legend">Macroprocesso</FormLabel>
            <Controller
              as={
                <Select disabled fullWidth>
                  <MenuItem value="Prestação de contas"> Prestação de contas </MenuItem>
                </Select>
              }
              name="MACROPROCESSO"
              defaultValue="Prestação de contas"
              control={control}
              error={errors.MACROPROCESSO?true:false}
              helperText={errors.MACROPROCESSO && errors.MACROPROCESSO.message}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <FormLabel id="PROCESSO" component="legend">Processo</FormLabel>
            <Controller
              as={
                <Select disabled fullWidth >
                  <MenuItem value="Aprovação da prestação">{"Aprovação da prestação"}</MenuItem>
                </Select>
              }
              id="Process"
              name="PROCESSO"
              defaultValue="Aprovação da prestação"
              control={control}
              error={errors.PROCESSO?true:false}
              helperText={errors.PROCESSO && errors.PROCESSO.message}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField
              type="text"
              name="BENEFICIARIO_ID"
              variant="outlined"
              label="Empregado: Matrícula"
              onBlur={ e=> handleGetEmployee(e.target.value) }
              inputRef={register}
              error={errors.BENEFICIARIO_ID?true:false}
              helperText={errors.BENEFICIARIO_ID && errors.BENEFICIARIO_ID.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField
              disabled
              fullWidth
              type="text"
              name="BENEFICIARIO_NOME"
              label="Empregado: Nome"
              variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_NOME?true:false}
              helperText={errors.BENEFICIARIO_NOME && errors.BENEFICIARIO_NOME.message}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField
              disabled
              fullWidth
              type="email"
              name="BENEFICIARIO_EMAIL"
              label="Empregado: E-mail"
              variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_EMAIL?true:false}
              helperText={errors.BENEFICIARIO_EMAIL && errors.BENEFICIARIO_EMAIL.message}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField type="search" name="APROVADOR_ID" variant="outlined" label="Aprovador: Matrícula"
              error={errors.APROVADOR_ID?true:false}
              helperText={errors.APROVADOR_ID && errors.APROVADOR_ID.message}
              inputRef={register}
              onBlur={e=>handleGetApprover(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField
              disabled
              fullWidth
              type="text"
              name="APROVADOR_NOME"
              label="Aprovador: Nome"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={approver ? approver.FULL_NAME : "" }
              inputRef={register}
              error={errors.APROVADOR_NOME?true:false}
              helperText={errors.APROVADOR_NOME && errors.APROVADOR_NOME.message}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField
              disabled
              fullWidth
              type="text"
              name="APROVADOR_EMAIL"
              label="Aprovador: E-mail"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={approver ? approver.WORK_EMAIL_ADDRESS : "" }
              inputRef={register}
              error={errors.APROVADOR_EMAIL?true:false}
              helperText={errors.APROVADOR_EMAIL && errors.APROVADOR_EMAIL.message}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField fullWidth variant="outlined" type="text"
            multiline rows={5}
            name="MOTIVO" label="Descrição detalhada do problema" inputRef={register}
              error={errors.MOTIVO?true:false}
              helperText={errors.MOTIVO && errors.MOTIVO.message}
            />
          </Grid>

          <Grid xs={12} sm={12} md={12} lg={12} xl={12} item justify="flex-end" alignItems="flex-end">
            <Button type="submit"
            variant="contained" color="primary" style={{float:'right'}}> Enviar </Button>
          </Grid>

          <Input inputRef={register} readOnly type="hidden" id="BENEFICIARIO_EMPRESA_COD" name="BENEFICIARIO_EMPRESA_COD"
            value={employee && employee.COMPANY_CODE }
          />
          <Input inputRef={register} readOnly type="hidden" id="BENEFICIARIO_EMPRESA_NOME" name="BENEFICIARIO_EMPRESA_NOME"
            value={employee && employee.COMPANY_DESC } />
        </Grid >


        <Input inputRef={register} readOnly type="hidden" id="APROVADOR_EMPRESA_COD" name="APROVADOR_EMPRESA_COD" value={approver && approver.COMPANY_CODE } />
        <Input inputRef={register} readOnly type="hidden" id="APROVADOR_EMPRESA_NOME" name="APROVADOR_EMPRESA_NOME" value={approver && approver.COMPANY_DESC } />

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

