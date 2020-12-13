import * as React from 'react';
import { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";
import { TextField, Select, MenuItem, FormLabel, Button,
  Grid, Input, Paper, Snackbar, Backdrop, Typography, CircularProgress, makeStyles, Theme, createStyles, InputLabel } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Context } from '../../Context';
import { getEmployee } from '../../../services/EmployeesService';
import { newRequest } from '../../../services/RequestServices';
import { IEmployee } from '../../../Interfaces/IEmployee';
import { ISnack } from '../../../Interfaces/ISnack';
import { IRequests_AllFields } from '../../../Interfaces/Requests/IRequests';
import { yup_pt_br } from '../../../Utils/yup_pt_br';
import { setLocale } from 'yup';
import HocDialog from '../../HOC/HocDialog';

setLocale(yup_pt_br);

const schema: yup.ObjectSchema<IRequests_AllFields> = yup.object().shape({
  MACROPROCESSO: yup.string().required(),
  PROCESSO: yup.string().required(),
  ALCADA_APROVACAO: yup.string().default("D-3"),
  SLA: yup.number().default(48),
  AREA_RESOLVEDORA: yup.string().default("Viagens Corporativas"),
  WF_APROVACAO: yup.boolean().default(true),

  GESTOR_DA_BASE_ID: yup.string().required(),
  GESTOR_DA_BASE_NOME: yup.string().required(),
  GESTOR_DA_BASE_EMPRESA_NOME: yup.string().required(),
  GESTOR_DA_BASE_EMPRESA_COD: yup.string().required(),
  GESTOR_DA_BASE_EMAIL: yup.string().email().notRequired(),

  APROVADOR_ID: yup.string().required(),
  APROVADOR_NOME: yup.string().required(),
  APROVADOR_EMAIL: yup.string().email().required(),
  APROVADOR_EMPRESA_COD: yup.string().required(),
  APROVADOR_EMPRESA_NOME: yup.string().required(),
  APROVADOR_LEVEL: yup.string()
  .when('ALCADA_APROVACAO', (ALCADA_APROVACAO, sch) => {
    if(ALCADA_APROVACAO === 'D-3') return sch.oneOf(['D-3', 'D-2', 'D-1', 'DE']);
    if(ALCADA_APROVACAO === 'D-2') return sch.oneOf(['D-2', 'D-1', 'DE']);
    if(ALCADA_APROVACAO === 'D-1') return sch.oneOf(['D-1', 'DE']);
    })
  .required(),

  CENTRO_DE_CUSTOS: yup.string(),

  CNPJ_DE_FATURAMENTO: yup.string().required(),
  PERIODO_INICIO: yup.date().required(),
  PERIODO_FIM: yup.date().required(),
  CODIGO_DA_BASE: yup.string().required(),
  MOTIVO: yup.string().required(),
});

export default function BaseClosure(){
  const { register, handleSubmit, control, errors, setValue } = useForm<IRequests_AllFields>({
    resolver: yupResolver(schema)
  });
  const [gestorDaBase, setGestorDaBase] = useState<IEmployee>();
  const [approver, setApprover] = useState<IEmployee>();
  const [snackMessage, setSnackMessage] = useState<ISnack>({
    open: false,
    message: "",
    severity:'info'
  });
  const { updateContext } = useContext(Context);

  const handleGetGestorDaBase = value => getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
  .then(emp => {
    setGestorDaBase(emp);
    setValue("GESTOR_DA_BASE_ID", emp?emp.IAM_ACCESS_IDENTIFIER:"", {
      shouldDirty: true
    });
    setValue("GESTOR_DA_BASE_NOME", emp?emp.FULL_NAME:"", {
      shouldDirty: true
    });
    setValue("GESTOR_DA_BASE_EMAIL", emp?emp.WORK_EMAIL_ADDRESS:"", {
      shouldDirty: true
    });
    setValue("GESTOR_DA_BASE_EMPRESA_NOME", emp?emp.COMPANY_DESC:"", {
      shouldDirty: true
    });
  });

  const handleGetGestorDaBaseByEmail = value => getEmployee("WORK_EMAIL_ADDRESS", value.toLowerCase())
  .then(emp => {
    setGestorDaBase(emp);
    setValue("GESTOR_DA_BASE_ID", emp?emp.IAM_ACCESS_IDENTIFIER:"", {
      shouldDirty: true
    });
    setValue("GESTOR_DA_BASE_NOME", emp?emp.FULL_NAME:"", {
      shouldDirty: true
    });
    setValue("GESTOR_DA_BASE_EMAIL", emp?emp.WORK_EMAIL_ADDRESS:"", {
      shouldDirty: true
    });
    setValue("GESTOR_DA_BASE_EMPRESA_NOME", emp?emp.COMPANY_DESC:"", {
      shouldDirty: true
    });
  });

  const handleGetApprover = value => getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
  .then(emp => {
    setApprover(emp);
    setValue("APROVADOR_ID", emp?emp.IAM_ACCESS_IDENTIFIER:"", {
      shouldDirty: true
    });
    setValue("APROVADOR_NOME", emp?emp.FULL_NAME:"", {
      shouldDirty: true
    });
    setValue("APROVADOR_EMAIL", emp?emp.WORK_EMAIL_ADDRESS:"", {
      shouldDirty: true
    });
    setValue("APROVADOR_EMPRESA_NOME", emp?emp.COMPANY_DESC:"", {
      shouldDirty: true
    });
  });

  const handleGetApproverByEmail = value => getEmployee("WORK_EMAIL_ADDRESS", value.toLowerCase())
  .then(emp => {
    setApprover(emp);
    setValue("APROVADOR_ID", emp?emp.IAM_ACCESS_IDENTIFIER:"", {
      shouldDirty: true
    });
    setValue("APROVADOR_NOME", emp?emp.FULL_NAME:"", {
      shouldDirty: true
    });
    setValue("APROVADOR_EMAIL", emp?emp.WORK_EMAIL_ADDRESS:"", {
      shouldDirty: true
    });
    setValue("APROVADOR_EMPRESA_NOME", emp?emp.COMPANY_DESC:"", {
      shouldDirty: true
    });
  });

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
console.log(errors);

  return (
    <Paper>
      <HocDialog>
        <Typography variant='body2'>
          Confirme se não há pagamentos pendentes antes de solicitar o encerramento da base.
        </Typography>
      </HocDialog>
      <div style={{padding:"20px"}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} justify="space-between">
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <FormLabel id="Macroprocess" component="legend">Macroprocesso</FormLabel>
              <Controller
                as={
                  <Select disabled fullWidth>
                    <MenuItem value="Cartão combustível"> Cartão combustível </MenuItem>
                  </Select>
                }
                name="MACROPROCESSO"
                defaultValue="Cartão combustível"
                control={control}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <FormLabel id="Process" component="legend">Processo</FormLabel>
              <Controller
                as={
                  <Select disabled fullWidth>
                    <MenuItem value="Encerramento de base">Encerramento de base</MenuItem>
                  </Select>
                }
                id="Process"
                name="PROCESSO"
                defaultValue="Encerramento de base"
                control={control}
              />
            </Grid>


            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
              <TextField
                variant="outlined"
                type="search"
                name="GESTOR_DA_BASE_ID"
                label="Gestor da base: Matrícula"
                onBlur={ e=> handleGetGestorDaBase(e.target.value) }
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.GESTOR_DA_BASE_ID?true:false}
                helperText={errors.GESTOR_DA_BASE_ID && errors.GESTOR_DA_BASE_ID.message}
              />
            </Grid>

            <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
              <TextField fullWidth type="text" name="GESTOR_DA_BASE_EMAIL" label="Gestor da base: e-mail" variant="outlined"
                onBlur={ e=> handleGetGestorDaBaseByEmail(e.target.value) }
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.GESTOR_DA_BASE_EMAIL?true:false}
                helperText={errors.GESTOR_DA_BASE_EMAIL && errors.GESTOR_DA_BASE_EMAIL.message}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
              <TextField disabled fullWidth type="text" name="GESTOR_DA_BASE_NOME"
                label="Gestor da base: Nome" variant="outlined"
                value={gestorDaBase? gestorDaBase.FULL_NAME : ""}
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.GESTOR_DA_BASE_NOME?true:false}
                helperText={errors.GESTOR_DA_BASE_NOME && errors.GESTOR_DA_BASE_NOME.message}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
              <TextField fullWidth type="text" name="CODIGO_DA_BASE"
                label="Código da base" variant="outlined"
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.CODIGO_DA_BASE?true:false}
                helperText={errors.CODIGO_DA_BASE && errors.CODIGO_DA_BASE.message}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
              <TextField fullWidth type="text" name="CNPJ_DE_FATURAMENTO"
                label="CNPJ de faturamento" variant="outlined"
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.CNPJ_DE_FATURAMENTO?true:false}
                helperText={errors.CNPJ_DE_FATURAMENTO && errors.CNPJ_DE_FATURAMENTO.message}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
              <TextField required fullWidth type="date" name="PERIODO_INICIO" label="Último período de medição: Início"
              variant="outlined" InputLabelProps={{ shrink: true }} inputRef={register}
              error={errors.PERIODO_INICIO?true:false}
              helperText={errors.PERIODO_INICIO && errors.PERIODO_INICIO.message}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
              <TextField required fullWidth type="date" name="PERIODO_FIM" label="Último período de medição: Fim"
              variant="outlined" InputLabelProps={{ shrink: true }} inputRef={register}
              error={errors.PERIODO_FIM?true:false}
              helperText={errors.PERIODO_FIM && errors.PERIODO_FIM.message}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
              <TextField fullWidth type="search" name="APROVADOR_ID" variant="outlined" label="Aprovador: Matrícula"
                error={errors.APROVADOR_ID?true:false}
                helperText={errors.APROVADOR_ID && errors.APROVADOR_ID.message}
                InputLabelProps={{ shrink: true }}
                inputRef={register}
                onBlur={e=>handleGetApprover(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
              <TextField
                fullWidth
                type="text"
                name="APROVADOR_EMAIL"
                label="Aprovador: e-mail"
                variant="outlined"
                onBlur={ e=> handleGetApproverByEmail(e.target.value) }
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.APROVADOR_EMAIL?true:false}
                helperText={errors.APROVADOR_EMAIL && errors.APROVADOR_EMAIL.message}
              />
            </Grid>
            <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
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
            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
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

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                multiline
                rows={5}
                name="MOTIVO"
                label="Motivo do encerramento"
                inputRef={register}
                error={errors.MOTIVO?true:false}
                helperText={errors.MOTIVO && errors.MOTIVO.message}
              />
            </Grid>

            <Grid xs={12} sm={12} md={12} lg={12} xl={12} item justify="flex-end" alignItems="flex-end">
              <Button type="submit" style={{float:'right'}}
              variant="contained" color="primary"> Enviar </Button>
            </Grid>

          </Grid >

          <Input inputRef={register} readOnly type="hidden" name="GESTOR_DA_BASE_EMPRESA_COD" value={gestorDaBase && gestorDaBase.COMPANY_CODE } />
          <Input inputRef={register} readOnly type="hidden" name="GESTOR_DA_BASE_EMPRESA_NOME" value={gestorDaBase && gestorDaBase.COMPANY_DESC } />

          <Input inputRef={register} readOnly type="hidden" name="CENTRO_DE_CUSTOS" value={gestorDaBase && gestorDaBase.COST_CENTER_CODE } />

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
