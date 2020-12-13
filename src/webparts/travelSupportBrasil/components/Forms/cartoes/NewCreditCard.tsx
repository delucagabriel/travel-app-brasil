import * as React from 'react';
import { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";
import * as cep from 'cep-promise';
import { TextField, Select, MenuItem, FormLabel, Button,
  Grid, Input, Paper, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Context } from '../../Context';
import { getEmployee } from '../../../services/EmployeesService';
import { newRequest } from '../../../services/RequestServices';
import { IEmployee } from '../../../Interfaces/IEmployee';
import { ISnack } from '../../../Interfaces/ISnack';
import { IRequest_NewCard } from '../../../Interfaces/Requests/IRequest_NewCard';
import { TestaCPF } from '../../../Utils/validaCPF';
import HocDialog from '../../HOC/HocDialog';
import { yup_pt_br } from '../../../Utils/yup_pt_br';
import { setLocale } from 'yup';
import { corporateCardConfig } from '../../../formConfigurations/corporateCards';

setLocale(yup_pt_br);

const schema: yup.ObjectSchema<IRequest_NewCard> = yup.object().shape({
  MACROPROCESSO: yup.string().required(),
  PROCESSO: yup.string().required(),
  ALCADA_APROVACAO: yup.string()
  .when('TIPO_LIMITE_VALOR', (TIPO_LIMITE_VALOR, sch) => {
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
  SLA: yup.number().default(72),
  AREA_RESOLVEDORA: yup.string().default("Bradesco"),
  WF_APROVACAO: yup.boolean().default(true),

  BENEFICIARIO_ID: yup.string().required(),
  BENEFICIARIO_NOME: yup.string().required(),
  BENEFICIARIO_EMPRESA_NOME: yup.string().required(),
  BENEFICIARIO_EMAIL: yup.string().email().notRequired(),
  BENEFICIARIO_EMPRESA_COD: yup.string().required(),
  BENEFICIARIO_LEVEL: yup.string().required(),
  TELEFONE: yup.string(),
  CPF: yup.string().test('validCPF','CPF inválido',(cpf)=>TestaCPF(cpf)).required(),
  CENTRO_DE_CUSTOS: yup.string().required(),
  END_CEP: yup.string().required(),
  END_LOGRADOURO: yup.string().required(),
  END_NUMERO: yup.number().required(),
  END_COMPLEMENTO: yup.string(),

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
    })
  .required(),

  TIPO_LIMITE_VALOR: yup.string().required(),
  VISA_INFINITE: yup.string().default("Visa Corporativo")
});

interface IAddress {
    cep: string;
    state:  string;
    city:  string;
    street:  string;
    neighborhood: string;
}



export default function NewCreditCard(){
  const { register, handleSubmit, control, errors, reset, getValues, watch, setValue } = useForm<IRequest_NewCard>({
    resolver: yupResolver(schema)
  });
  const [employee, setEmployee] = useState<IEmployee>();
  const [approver, setApprover] = useState<IEmployee>();
  const [address, setAddress] = useState<IAddress>();
  const [snackMessage, setSnackMessage] = useState<ISnack>({
    open: false,
    message: "",
    severity:'info'
  });
  const { updateContext } = useContext(Context);

  const watchVisaInfinite = watch("VISA_INFINITE");

  const handleGetAddress = value => {
    cep(value).then(res => setAddress(res));
  };

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

  const onSubmit = (data:IRequest_NewCard, e) => {
    newRequest(data)
      .then(res => {
        setSnackMessage({open:true, message: `Solicitação gravada com sucesso! ID::${res.data.ID}`, severity:"success"});
        updateContext();
      })
      .catch(()=> {
        setSnackMessage({open:true, message: "Falha ao tentar gravar a solicitação", severity:"error"});
      });
    e.target.reset();
  };
console.log(errors);
  return (
    <Paper>
        <HocDialog>
          <p>
            Alçadas de aprovação de acordo com a NFN-0018:<br/>
            {corporateCardConfig.tipo_cartao_valor.Tipo_I} - Aprovação DE-3<br/>
            {corporateCardConfig.tipo_cartao_valor.Tipo_II} - Aprovação DE-3<br/>
            {corporateCardConfig.tipo_cartao_valor.Tipo_II} - Aprovação DE-3<br/>
            {corporateCardConfig.tipo_cartao_valor.Tipo_IV} - Aprovação DE-3<br/>
            {corporateCardConfig.tipo_cartao_valor.Tipo_V} - Aprovação DE-2<br/>
            {corporateCardConfig.tipo_cartao_valor.Tipo_VI} - Aprovação DE-2<br/>
            {corporateCardConfig.tipo_cartao_valor.Tipo_VII} - Aprovação DE-1
          </p>
        </HocDialog>
        <div style={{padding:"20px"}}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} justify="space-between">
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
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
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <FormLabel id="Process" component="legend">Processo</FormLabel>
                <Controller
                  as={
                    <Select disabled fullWidth>
                      <MenuItem value="Emissão de cartão corporativo">Emissão de cartão corporativo</MenuItem>
                    </Select>
                  }
                  id="Process"
                  name="PROCESSO"
                  defaultValue="Emissão de cartão corporativo"
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

              <Grid item xs={12} sm={3} md={3} lg={3} xl={3} >
                <TextField fullWidth type="text" name="CPF"
                  label="Empregado: CPF" variant="outlined"
                  inputRef={register}
                  InputLabelProps={{ shrink: true }}
                  error={errors.CPF?true:false}
                  helperText={errors.CPF && errors.CPF.message}
                />
              </Grid>
              <Grid item xs={12} sm={3} md={3} lg={3} xl={3} >
                <TextField fullWidth type="tel" name="TELEFONE"
                  label="Empregado: Telefone" variant="outlined"
                  inputRef={register}
                  InputLabelProps={{ shrink: true }}
                  error={errors.TELEFONE?true:false}
                  helperText={errors.TELEFONE && errors.TELEFONE.message}
                />
              </Grid>


              <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
                <TextField disabled fullWidth type="text" name="BENEFICIARIO_NOME"
                  label="Empregado: Nome" variant="outlined"
                  inputRef={register}
                  InputLabelProps={{ shrink: true }}
                  error={errors.BENEFICIARIO_NOME?true:false}
                  helperText={errors.BENEFICIARIO_NOME && errors.BENEFICIARIO_NOME.message}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <FormLabel id="TIPO_LIMITE_VALOR" component="legend">Limite</FormLabel>
                <Controller
                  as={
                    watchVisaInfinite === 'Visa Infinite'
                    ?
                    <Select inputRef={register}>
                      <MenuItem value="Infinite I - R$ 100.000,00">Infinite I - R$ 100.000,00</MenuItem>
                      <MenuItem value="Infinite II - R$ 200.000,00">Infinite II - R$ 200.000,00</MenuItem>
                    </Select>
                    :
                    <Select inputRef={register}>
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
                  id="TIPO_LIMITE_VALOR"
                  name="TIPO_LIMITE_VALOR"
                  control={control}
                  error={errors.TIPO_LIMITE_VALOR?true:false}
                  helperText={errors.TIPO_LIMITE_VALOR && errors.TIPO_LIMITE_VALOR.message}
                />
              </Grid>
              { employee && (employee.APPROVAL_LEVEL_CODE === 'D-1' || employee.APPROVAL_LEVEL_CODE === 'DE') &&
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <FormLabel id="VISA_INFINITE" component="legend">Bandeira do cartão</FormLabel>
                  <Controller
                    as={
                      <Select inputRef={register}>
                        <MenuItem value="Visa Infinite">Visa Infinite</MenuItem>
                        <MenuItem value="Visa Corporativo">Visa Corporativo</MenuItem>
                      </Select>
                    }
                    id="VISA_INFINITE"
                    name="VISA_INFINITE"
                    defaultValue="Visa Corporativo"
                    control={control}
                    error={errors.VISA_INFINITE?true:false}
                    helperText={errors.VISA_INFINITE && errors.VISA_INFINITE.message}
                  />
                </Grid>
              }
              <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                <TextField fullWidth type="text" name="END_CEP"
                  label="CEP" variant="outlined"
                  inputRef={register}
                  onBlur={e => handleGetAddress(e.target.value)}
                  error={errors.END_CEP?true:false}
                  helperText={errors.END_CEP && errors.END_CEP.message}
                />
              </Grid>
              <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
                <TextField disabled fullWidth type="text" name="END_LOGRADOURO"
                  label="Endereço" variant="outlined"
                  value={address? `${address.street}, ${address.neighborhood}, ${address.city} - ${address.state}` : ""}
                  inputRef={register}
                  InputLabelProps={{ shrink: true }}
                  error={errors.END_LOGRADOURO?true:false}
                  helperText={errors.END_LOGRADOURO && errors.END_LOGRADOURO.message}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                <TextField fullWidth type="number" name="END_NUMERO"
                  label="Número" variant="outlined" inputProps={{ min: 1 }}
                  inputRef={register}
                  error={errors.END_NUMERO?true:false}
                  helperText={errors.END_NUMERO && errors.END_NUMERO.message}
                />
              </Grid>
              <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
                <TextField fullWidth type="text" name="END_COMPLEMENTO"
                  label="Complemento" variant="outlined"
                  inputRef={register}
                  error={errors.END_COMPLEMENTO?true:false}
                  helperText={errors.END_COMPLEMENTO && errors.END_COMPLEMENTO.message}
                />
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
        <Input inputRef={register} readOnly type="hidden" id="BENEFICIARIO_LEVEL" name="BENEFICIARIO_LEVEL" value={employee && employee.APPROVAL_LEVEL_CODE } />
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
