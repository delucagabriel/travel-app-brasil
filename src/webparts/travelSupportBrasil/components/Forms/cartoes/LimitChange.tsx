import * as React from 'react';
import { useState, useContext } from 'react';
import { TextField, Select, MenuItem, FormLabel, Button, Grid, Input, Paper, Snackbar, FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";
import { Context } from '../../Context';
import { getEmployee } from '../../../services/EmployeesService';
import { newRequest } from '../../../services/RequestServices';
import { IEmployee } from '../../../Interfaces/IEmployee';
import { ISnack } from '../../../Interfaces/ISnack';
import { IRequest_LimitChange } from '../../../Interfaces/Requests/IRequest_LimitChange';

const schema: yup.ObjectSchema<IRequest_LimitChange> = yup.object().shape({
  MACROPROCESSO: yup.string().required(),
  PROCESSO: yup.string().required(),
  ALCADA_APROVACAO: yup.string()
  .when('TIPO_LIMITE_VALOR', (TIPO_LIMITE_VALOR, sch) => {
    if(['Tipo I', 'Tipo II', 'Tipo III', 'Tipo IV'].indexOf(TIPO_LIMITE_VALOR) >=0 ) return sch.default('D-3');
    if(['Tipo V', 'Tipo VI'].indexOf(TIPO_LIMITE_VALOR)>=0) return sch.default('D-2');
    if(TIPO_LIMITE_VALOR === 'Tipo VII') return sch.default('D-1');
  }),
  SLA: yup.number().default(48),
  AREA_RESOLVEDORA: yup.string().default("Bradesco"),

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

  BENEFICIARIO_ID: yup.string().required(),
  BENEFICIARIO_NOME: yup.string().required(),
  BENEFICIARIO_EMAIL: yup.string().required(),
  BENEFICIARIO_EMPRESA_COD: yup.string().required(),
  BENEFICIARIO_EMPRESA_NOME: yup.string().required(),
  CENTRO_DE_CUSTOS: yup.string(),

  TIPO_DE_LIMITE: yup.string().required(),
  TIPO_LIMITE_VALOR: yup.string().required(),
  PERIODO_FIM: yup.date().required(),
  WF_APROVACAO: yup.boolean().default(true),
  ULTIMOS_DIGITOS_DO_CARTAO: yup.string()
  .length(4)
  .matches(/^[0-9]{4}/)
  .required(),
});

export default function LimitChange() {
  const { register, handleSubmit, control, errors, reset } = useForm<IRequest_LimitChange>({
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

  console.log(errors, schema);

  const handleGetEmployee = value =>getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
  .then(emp => setEmployee(emp));

  const handleGetApprover = value =>getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
  .then(emp => setApprover(emp));

  const onSubmit = (data:IRequest_LimitChange, e) => {
    newRequest(data)
      .then(res => {
        setSnackMessage({open:true, message: `Solicitação gravada com suceso! ID:${res.data.ID}`, severity:"success"});
        updateContext();
      })
      .catch(error => {
        setSnackMessage({open:true, message: "Falha ao tentar gravar a solicitação", severity:"error"});
      });
      e.target.reset();
  };
  return (
    <Paper>
      <div style={{padding:"20px"}}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} justify="space-between">
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <FormLabel id="MACROPROCESSO" component="legend">Macroprocesso</FormLabel>
            <Controller
              as={
                <Select disabled fullWidth>
                  <MenuItem value="Cartão corporativo"> Cartão corporativo </MenuItem>
                </Select>
              }
              name="MACROPROCESSO"
              defaultValue="Cartão corporativo"
              control={control}
              error={errors.MACROPROCESSO?true:false}
              helperText={errors.MACROPROCESSO && errors.MACROPROCESSO.message}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <FormLabel id="PROCESSO" component="legend">Processo</FormLabel>
            <Controller
              as={
                <Select disabled fullWidth>
                  <MenuItem value="Alterar limite">Alterar limite</MenuItem>
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
              label="Matrícula" onBlur={ e=> handleGetEmployee(e.target.value) }
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

          <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Tipo de limite</FormLabel>
            <RadioGroup aria-label="TIPO_DE_LIMITE" name="TIPO_DE_LIMITE" row>
              <FormControlLabel value="Crédito" control={<Radio inputRef={register}/>} label="Crédito" />
              <FormControlLabel value="Saque" control={<Radio inputRef={register}/>} label="Saque" />
            </RadioGroup>
          </FormControl>
          </Grid>
          <Grid item xs={12} sm={5} md={5} lg={5} xl={5} >
            <TextField fullWidth variant="outlined" type="text" required name="ULTIMOS_DIGITOS_DO_CARTAO" label="Últimos 4 dígitos do cartão"
              inputRef={register}
              error={errors.ULTIMOS_DIGITOS_DO_CARTAO?true:false}
              helperText={errors.ULTIMOS_DIGITOS_DO_CARTAO && errors.ULTIMOS_DIGITOS_DO_CARTAO.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <FormLabel id="TIPO_LIMITE_VALOR" component="legend">Novo limite</FormLabel>
            <Controller
              as={
                <Select fullWidth inputRef={register}>
                  <MenuItem value="Tipo I">Tipo I - R$ 1.000,00</MenuItem>
                  <MenuItem value="Tipo II">Tipo II - R$ 2.5000,00</MenuItem>
                  <MenuItem value="Tipo III">Tipo III - R$ 5.000,00</MenuItem>
                  <MenuItem value="Tipo IV">Tipo IV - R$ 10.000,00</MenuItem>
                  <MenuItem value="Tipo V">Tipo V - R$ 20.000,00</MenuItem>
                  <MenuItem value="Tipo VI">Tipo VI - R$ 30.000,00</MenuItem>
                  <MenuItem value="Tipo VII">Tipo VII - R$ 60.000,00</MenuItem>
                </Select>
              }
              id="TIPO_LIMITE_VALOR"
              name="TIPO_LIMITE_VALOR"
              defaultValue="Tipo I"
              control={control}
              error={errors.TIPO_LIMITE_VALOR?true:false}
              helperText={errors.TIPO_LIMITE_VALOR && errors.TIPO_LIMITE_VALOR.message}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField fullWidth id="EndDate" type="date" name="PERIODO_FIM" label="Vencimento do novo limite"
            variant="outlined" InputLabelProps={{ shrink: true }} inputRef={register}
            error={errors.PERIODO_FIM?true:false}
            helperText={errors.PERIODO_FIM && errors.PERIODO_FIM.message}
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
              label="Nome do aprovador"
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
              label="Nível do aprovador"
              value={approver && approver.APPROVAL_LEVEL_CODE}
              InputLabelProps={{ shrink: true }}
              inputRef={register}
              error={errors.APROVADOR_LEVEL?true:false}
              helperText={errors.APROVADOR_LEVEL && errors.APROVADOR_LEVEL.message}
            />
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={12} xl={12} item justify="flex-end" alignItems="flex-end">
            <Button type="submit" style={{float:'right'}}
            variant="contained" color="primary"> Enviar </Button>
          </Grid>
        </Grid >

        <Input inputRef={register} readOnly type="hidden" id="BENEFICIARIO_EMPRESA_COD" name="BENEFICIARIO_EMPRESA_COD" value={employee && employee.COMPANY_CODE } />
        <Input inputRef={register} readOnly type="hidden" id="BENEFICIARIO_EMPRESA_NOME" name="BENEFICIARIO_EMPRESA_NOME" value={employee && employee.COMPANY_DESC } />
        <Input inputRef={register} readOnly type="hidden" id="CENTRO_DE_CUSTOS" name="CENTRO_DE_CUSTOS" value={employee && employee.COST_CENTER_CODE } />

        <Input inputRef={register} readOnly type="hidden" id="APROVADOR_EMAIL" name="APROVADOR_EMAIL" value={approver && approver.WORK_EMAIL_ADDRESS } />
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
