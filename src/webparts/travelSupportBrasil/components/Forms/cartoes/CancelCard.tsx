import * as React from 'react';
import { TextField, Select, MenuItem, FormLabel, Grid, Button, Input, Paper, Typography, Snackbar } from '@material-ui/core';
import { useState, useContext } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Alert } from '@material-ui/lab';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers';
import { getEmployee } from '../../../services/EmployeesService';
import { newRequest } from '../../../services/RequestServices';
import { IEmployee } from '../../../Interfaces/IEmployee';
import { IRequest_CancelCard } from '../../../Interfaces/Requests/IRequest_CancelCard';
import { ISnack } from '../../../Interfaces/ISnack';
import { Context } from '../../Context';
import { TestaCPF } from '../../../Utils/validaCPF';


const schema: yup.ObjectSchema<IRequest_CancelCard> = yup.object().shape({
  MACROPROCESSO: yup.string().required(),
  PROCESSO: yup.string().required(),
  SLA: yup.number().default(48),
  AREA_RESOLVEDORA: yup.string().default("Bradesco"),
  ALCADA_APROVACAO: yup.string().default(""),

  BENEFICIARIO_ID: yup.string().required(),
  BENEFICIARIO_NOME: yup.string().required(),
  BENEFICIARIO_EMAIL: yup.string().required(),
  BENEFICIARIO_EMPRESA_COD: yup.string().required(),
  BENEFICIARIO_EMPRESA_NOME: yup.string().required(),
  CPF: yup.string().test('validCPF','CPF inválido', (cpf)=>TestaCPF(cpf)).required(),


  ULTIMOS_DIGITOS_DO_CARTAO: yup.string()
    .length(4)
    .matches(/\d/, "Only numbers")
    .required(),
  MOTIVO: yup.string()
    .min(10)
    .required(),
  WF_APROVACAO: yup.boolean().default(false),
  DATA_DE_APROVACAO: yup.date().default(new Date()),
  STATUS_APROVACAO: yup.string().default('Aprovado')

});

export default function CancelCard() {
  const { register, handleSubmit, control, errors, reset } = useForm<IRequest_CancelCard>({
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


  const onSubmit = (data:IRequest_CancelCard, e) => {
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
      <div style={{padding:"20px"}}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} justify="space-between">
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <FormLabel id="Macroprocesso" component="legend">Macroprocesso</FormLabel>
            <Controller
              as={
                <Select disabled fullWidth>
                  <MenuItem value="Cartão corporativo"> Cartão corporativo </MenuItem>
                </Select>
              }
              name="MACROPROCESSO"
              defaultValue="Cartão corporativo"
              rules={{ required: "Campo obrigatório" }}
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
                  <MenuItem value="Cancelar cartão">Cancelar cartão</MenuItem>
                </Select>
              }
              id="Process"
              name="PROCESSO"
              defaultValue="Cancelar cartão"
              rules={{ required: "Campo obrigatório" }}
              control={control}
              error={errors.PROCESSO?true:false}
              helperText={errors.PROCESSO && errors.PROCESSO.message}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField type="text" required name="BENEFICIARIO_ID" variant="outlined"
              label="Matrícula do empregado" onBlur={ e=> handleGetEmployee(e.target.value) }
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_ID?true:false}
              helperText={errors.BENEFICIARIO_ID && errors.BENEFICIARIO_ID.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField disabled fullWidth type="text" name="BENEFICIARIO_NOME" label="Nome do empregado" variant="outlined"
              value={employee? employee.FULL_NAME: ""}
              inputRef={register}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_NOME?true:false}
              helperText={errors.BENEFICIARIO_NOME && errors.BENEFICIARIO_NOME.message}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField disabled fullWidth type="text" name="BENEFICIARIO_EMAIL" label="E-mail do empregado"
              variant="outlined"  value={employee ? employee.WORK_EMAIL_ADDRESS : "" }
              inputRef={register}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_EMAIL?true:false}
              helperText={errors.BENEFICIARIO_EMAIL && errors.BENEFICIARIO_EMAIL.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField fullWidth type="text" name="CPF"
              label="Empregado: CPF" variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.CPF?true:false}
              helperText={errors.CPF && errors.CPF.message}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField fullWidth variant="outlined" type="text" required name="ULTIMOS_DIGITOS_DO_CARTAO" label="Últimos 4 dígitos"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.ULTIMOS_DIGITOS_DO_CARTAO?true:false}
              helperText={errors.ULTIMOS_DIGITOS_DO_CARTAO && errors.ULTIMOS_DIGITOS_DO_CARTAO.message}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField fullWidth multiline
              rows={3}
              variant="outlined"
              type="text"
              name="MOTIVO"
              label="Motivo"
              inputRef={register}
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
