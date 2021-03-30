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
import HocDialog from '../../HOC/HocDialog';
import { TestaCPF } from '../../../Utils/validaCPF';
import { yup_pt_br } from '../../../Utils/yup_pt_br';
import { setLocale } from 'yup';
import { corporateCardConfig } from '../../../formConfigurations/corporateCards';
import { IRequests_AllFields } from '../../../Interfaces/Requests/IRequests';

setLocale(yup_pt_br);


const schema: yup.ObjectSchema<IRequests_AllFields> = yup.object().shape({
  MACROPROCESSO: yup.string().required(),
  PROCESSO: yup.string().required(),
  ALCADA_APROVACAO: yup.string()
  .when(['TIPO_LIMITE_VALOR', 'TIPO_DE_LIMITE'], (TIPO_LIMITE_VALOR, TIPO_DE_LIMITE, sch) => {

    if(TIPO_DE_LIMITE === 'Saque') return sch.default('D-2');

    if(
      [
        corporateCardConfig.tipo_cartao_valor.Tipo_I,
        corporateCardConfig.tipo_cartao_valor.Tipo_II,
        corporateCardConfig.tipo_cartao_valor.Tipo_III,
        corporateCardConfig.tipo_cartao_valor.Tipo_IV
      ].indexOf(TIPO_LIMITE_VALOR) >=0 ) return sch.default('D-3');

    if(
      [
        corporateCardConfig.tipo_cartao_valor.Tipo_V,
        corporateCardConfig.tipo_cartao_valor.Tipo_VI
      ].indexOf(TIPO_LIMITE_VALOR)>=0) return sch.default('D-2');

      if(TIPO_LIMITE_VALOR === corporateCardConfig.tipo_cartao_valor.Tipo_VII) return sch.default('D-1');
  }),
  SLA: yup.number().default(48),
  AREA_RESOLVEDORA: yup.string().default("Bradesco"),
  WF_APROVACAO: yup.boolean().default(true),

  APROVADOR_ID: yup.string().required(),
  APROVADOR_NOME: yup.string().required(),
  APROVADOR_EMAIL: yup.string().email().required(),
  APROVADOR_EMPRESA_COD: yup.string().required(),
  APROVADOR_EMPRESA_NOME: yup.string().required(),
  APROVADOR_LEVEL: yup.string()
  .when('ALCADA_APROVACAO', (ALCADA_APROVACAO, sch) => {
    if(ALCADA_APROVACAO === 'D-3') return sch.oneOf(['D-3', 'D-2', 'D-1', 'DE'], "Nível de aprovação mínimo é D-3");
    if(ALCADA_APROVACAO === 'D-2') return sch.oneOf(['D-2', 'D-1', 'DE'], "Nível de aprovação mínimo é DE-2");
    if(ALCADA_APROVACAO === 'D-1') return sch.oneOf(['D-1', 'DE'], "Nível de aprovação mínimo é DE-1");
    if(ALCADA_APROVACAO === 'DE') return sch.oneOf(['DE'], "Nível de aprovação mínimo é DE");
    })
  .required(),

  BENEFICIARIO_ID: yup.string().required(),
  BENEFICIARIO_NOME: yup.string().required(),
  BENEFICIARIO_EMAIL: yup.string().required(),
  BENEFICIARIO_EMPRESA_COD: yup.string().required(),
  BENEFICIARIO_EMPRESA_NOME: yup.string().required(),
  CENTRO_DE_CUSTOS: yup.string(),
  CPF: yup.string().test('validCPF','CPF inválido', (cpf)=>TestaCPF(cpf)).required(),
  TIPO_DE_LIMITE: yup.string().required(),
  TIPO_LIMITE_VALOR: yup.string(),
  NOVO_LIMITE: yup.number()
  .positive()
  .max(60000),
  VALIDADE_NOVO_LIMITE: yup.string()
  .when('TIPO_DE_LIMITE', (tipo, schm)=> tipo === 'Saque'? schm.default('90 dias'):schm.oneOf(['90 dias', 'Indeterminado']))
  .required(),
  ULTIMOS_DIGITOS_DO_CARTAO: yup.string()
  .length(4)
  .matches(/^[0-9]{4}/)
  .required(),
});

export default function LimitChange() {
  const { register, handleSubmit, control, errors, setValue } = useForm<IRequests_AllFields>({
    resolver: yupResolver(schema)
  });
  const [employee, setEmployee] = useState<IEmployee>();
  const [approver, setApprover] = useState<IEmployee>();
  const [snackMessage, setSnackMessage] = useState<ISnack>({
    open: false,
    message: "",
    severity:'info'
  });
  const [tipoAlteracao, setTipoAlteracao] = useState('Crédito');
  const { updateContext } = useContext(Context);

  const handleGetEmployee = value => getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
  .then(emp => {
    setEmployee(emp);
    setValue("BENEFICIARIO_ID", emp?emp.IAM_ACCESS_IDENTIFIER:"", {
      shouldDirty: true
    });
    setValue("BENEFICIARIO_NOME", emp?emp.FULL_NAME:"", {
      shouldDirty: true
    });
    setValue("BENEFICIARIO_EMAIL", emp?emp.WORK_EMAIL_ADDRESS:"", {
      shouldDirty: true
    });
    setValue("BENEFICIARIO_EMPRESA_NOME", emp?emp.COMPANY_DESC:"", {
      shouldDirty: true
    });
    setValue("BENEFICIARIO_NACIONALIDADE", emp?emp.FACILITY_COUNTRY:"", {
      shouldDirty: true
    });
    setValue("CENTRO_DE_CUSTOS", emp?emp.COST_CENTER_CODE:"", {
      shouldDirty: true
    });
  });

  const handleGetEmployeeByEmail = value => getEmployee("WORK_EMAIL_ADDRESS", value.toLowerCase())
  .then(emp => {
    setEmployee(emp);
    setValue("BENEFICIARIO_ID", emp?emp.IAM_ACCESS_IDENTIFIER:"", {
      shouldDirty: true
    });
    setValue("BENEFICIARIO_NOME", emp?emp.FULL_NAME:"", {
      shouldDirty: true
    });
    setValue("BENEFICIARIO_EMAIL", emp?emp.WORK_EMAIL_ADDRESS:"", {
      shouldDirty: true
    });
    setValue("BENEFICIARIO_EMPRESA_NOME", emp?emp.COMPANY_DESC:"", {
      shouldDirty: true
    });
    setValue("BENEFICIARIO_NACIONALIDADE", emp?emp.FACILITY_COUNTRY:"", {
      shouldDirty: true
    });
    setValue("CENTRO_DE_CUSTOS", emp?emp.COST_CENTER_CODE:"", {
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
      });
      e.target.reset();
  };
  return (
    <Paper>
      <HocDialog>
        <p>
          Limite de saque:<br/>
          O limite mensal de saque conforme NFN-0018 é de R$ 800 e este limite poderá se alterado provisoriamente mediante de acordo de um DE-2. O novo limite ficará disponível por um prazo máximo de 90 dias.
        </p>

        <p>
          Limite de crédito:<br/>
          O novo limite poderá ser alterado  por tempo indeterminado ou ficar disponível pelo prazo de 90 dias.
        </p>
      </HocDialog>
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
                  <MenuItem value="Alteração de limite">Alteração de limite</MenuItem>
                </Select>
              }
              id="Process"
              name="PROCESSO"
              defaultValue="Alteração de limite"
              control={control}
              error={errors.PROCESSO?true:false}
              helperText={errors.PROCESSO && errors.PROCESSO.message}
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
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_ID?true:false}
              helperText={errors.BENEFICIARIO_ID && errors.BENEFICIARIO_ID.message}
            />
          </Grid>
          <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
            <TextField
              fullWidth
              type="text"
              name="BENEFICIARIO_EMAIL"
              label="Empregado: e-mail"
              variant="outlined"
              inputRef={register}
              onBlur={ e=> handleGetEmployeeByEmail(e.target.value) }
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_EMAIL?true:false}
              helperText={errors.BENEFICIARIO_EMAIL && errors.BENEFICIARIO_EMAIL.message}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
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

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Tipo de limite</FormLabel>
            <RadioGroup
              row
              aria-label="TIPO_DE_LIMITE"
              name="TIPO_DE_LIMITE"
              onChange={e=>setTipoAlteracao(e.target.value)}
            >
              <FormControlLabel value="Crédito" control={<Radio inputRef={register}/>} label="Crédito" />
              <FormControlLabel value="Saque" control={<Radio inputRef={register}/>} label="Saque" />
            </RadioGroup>
          </FormControl>
          </Grid>
          <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
            <TextField
              fullWidth
              type="text"
              name="CPF"
              label="Empregado: CPF"
              variant="outlined"
              inputRef={register}
              error={errors.CPF?true:false}
              helperText={errors.CPF && errors.CPF.message}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
            <TextField
              fullWidth
              variant="outlined"
              type="text"
              required
              name="ULTIMOS_DIGITOS_DO_CARTAO"
              label="Últimos 4 dígitos do cartão"
              InputLabelProps={{ shrink: true }}
              inputRef={register}
              error={errors.ULTIMOS_DIGITOS_DO_CARTAO?true:false}
              helperText={errors.ULTIMOS_DIGITOS_DO_CARTAO && errors.ULTIMOS_DIGITOS_DO_CARTAO.message}
            />
          </Grid>

          { tipoAlteracao === 'Crédito'
            ?
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <FormLabel id="TIPO_LIMITE_VALOR" component="legend" required>Novo limite</FormLabel>
                <Controller
                  as={
                    <Select fullWidth inputRef={register}>
                      <MenuItem value={corporateCardConfig.tipo_cartao_valor.Tipo_I}>
                        {corporateCardConfig.tipo_cartao_valor.Tipo_I}
                      </MenuItem>
                      <MenuItem value={corporateCardConfig.tipo_cartao_valor.Tipo_II}>
                        {corporateCardConfig.tipo_cartao_valor.Tipo_II}
                      </MenuItem>
                      <MenuItem value={corporateCardConfig.tipo_cartao_valor.Tipo_III}>
                        {corporateCardConfig.tipo_cartao_valor.Tipo_III}
                      </MenuItem>
                      <MenuItem value={corporateCardConfig.tipo_cartao_valor.Tipo_IV}>
                        {corporateCardConfig.tipo_cartao_valor.Tipo_IV}
                      </MenuItem>
                      <MenuItem value={corporateCardConfig.tipo_cartao_valor.Tipo_V}>
                        {corporateCardConfig.tipo_cartao_valor.Tipo_V}
                      </MenuItem>
                      <MenuItem value={corporateCardConfig.tipo_cartao_valor.Tipo_VI}>
                        {corporateCardConfig.tipo_cartao_valor.Tipo_VI}
                      </MenuItem>
                      <MenuItem value={corporateCardConfig.tipo_cartao_valor.Tipo_VII}>
                        {corporateCardConfig.tipo_cartao_valor.Tipo_VII}
                      </MenuItem>
                    </Select>
                  }
                  required
                  id="TIPO_LIMITE_VALOR"
                  name="TIPO_LIMITE_VALOR"
                  defaultValue="Tipo I"
                  control={control}
                  error={errors.TIPO_LIMITE_VALOR?true:false}
                  helperText={errors.TIPO_LIMITE_VALOR && errors.TIPO_LIMITE_VALOR.message}
                />
              </Grid>
            :
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
                <TextField
                  fullWidth
                  variant="outlined"
                  type="number"
                  required
                  name="NOVO_LIMITE"
                  label="Novo limite"
                  inputProps={{ min: 1 }}
                  InputLabelProps={{ shrink: true }}
                  inputRef={register}
                  error={errors.NOVO_LIMITE?true:false}
                  helperText={errors.NOVO_LIMITE && errors.NOVO_LIMITE.message}
                />
              </Grid>
          }
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          { tipoAlteracao === 'Crédito' && <>
              <FormLabel id="TIPO_LIMITE_VALOR" component="legend" required>Período do novo limite</FormLabel>
              <Controller
                as={
                  <Select fullWidth inputRef={register}>
                    <MenuItem value='90 dias'>90 dias</MenuItem>
                    <MenuItem value='Indeterminado'>Indeterminado</MenuItem>
                  </Select>
                }
                id="EndDate"
                name="VALIDADE_NOVO_LIMITE"
                defaultValue="90 dias"
                control={control}
                error={errors.VALIDADE_NOVO_LIMITE?true:false}
                helperText={errors.VALIDADE_NOVO_LIMITE && errors.VALIDADE_NOVO_LIMITE.message}
              /></>
          }
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
            <TextField
              fullWidth
              type="search"
              name="APROVADOR_ID"
              variant="outlined"
              label="Aprovador: Matrícula"
              InputLabelProps={{ shrink: true }}
              error={errors.APROVADOR_ID?true:false}
              helperText={errors.APROVADOR_ID && errors.APROVADOR_ID.message}
              inputRef={register}
              onBlur={e=>handleGetApprover(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
            <TextField
              fullWidth
              type="search"
              name="APROVADOR_EMAIL"
              variant="outlined"
              label="Aprovador: E-mail"
              InputLabelProps={{ shrink: true }}
              error={errors.APROVADOR_EMAIL?true:false}
              helperText={errors.APROVADOR_EMAIL && errors.APROVADOR_EMAIL.message}
              inputRef={register}
              onBlur={e=>handleGetApproverByEmail(e.target.value)}
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
          <Grid xs={12} sm={12} md={12} lg={12} xl={12} item justify="flex-end" alignItems="flex-end">
            <Button type="submit" style={{float:'right'}}
            variant="contained" color="primary"> Enviar </Button>
          </Grid>
        </Grid >

        <Input inputRef={register} readOnly type="hidden" id="BENEFICIARIO_EMPRESA_COD" name="BENEFICIARIO_EMPRESA_COD" value={employee && employee.COMPANY_CODE } />
        <Input inputRef={register} readOnly type="hidden" id="BENEFICIARIO_EMPRESA_NOME" name="BENEFICIARIO_EMPRESA_NOME" value={employee && employee.COMPANY_DESC } />
        <Input inputRef={register} readOnly type="hidden" id="CENTRO_DE_CUSTOS" name="CENTRO_DE_CUSTOS" value={employee && employee.COST_CENTER_CODE } />

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
