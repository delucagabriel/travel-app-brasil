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

  ESTABELECIMENTO: yup.string(),
  DATA_DE_UTILIZACAO: yup.date(),
  VALOR: yup.number().required(),
  MOTIVO: yup.string()
  .min(50)
  .required()
});


export default function UnrecognizedExpense() {
  const { register, handleSubmit, control, errors, reset, setValue } = useForm<IRequests_AllFields>({
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
    .then(emp => {
      setEmployee(emp);
      setValue("BENEFICIARIO_NOME", emp?emp.FULL_NAME:"", {
        shouldDirty: true
      });
      setValue("BENEFICIARIO_EMAIL", emp?emp.WORK_EMAIL_ADDRESS:"", {
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

  return (
    <Paper>
      <HocDialog>
        <Typography variant='body2'>
          Caso identifique alguma despesa indevida no seu cartão corporativo de viagens ou de compras, entre em contato com a central de atendimento exclusiva do Bradesco, pelo telefone 0800 7231799. Em seguida, preste contas da despesa, classificando-a de como "despesa nã reconhecida" e anexando o e-mail do banco com a formalização da contestação.
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
                  <MenuItem value="Despesa não reconhecida">{"Despesa não reconhecida"}</MenuItem>
                </Select>
              }
              id="Process"
              name="PROCESSO"
              defaultValue="Despesa não reconhecida"
              control={control}
              error={errors.PROCESSO?true:false}
              helperText={errors.PROCESSO && errors.PROCESSO.message}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField type="text" name="BENEFICIARIO_ID" variant="outlined"
              label="Matrícula" onBlur={ e=> handleGetEmployee(e.target.value) }
              inputRef={register}
              error={errors.BENEFICIARIO_ID?true:false}
              helperText={errors.BENEFICIARIO_ID && errors.BENEFICIARIO_ID.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField fullWidth type="text" name="BENEFICIARIO_NOME" label="Nome do empregado" variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_NOME?true:false}
              helperText={errors.BENEFICIARIO_NOME && errors.BENEFICIARIO_NOME.message}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField fullWidth type="email" name="BENEFICIARIO_EMAIL" label="E-mail do empregado"
              variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_EMAIL?true:false}
              helperText={errors.BENEFICIARIO_EMAIL && errors.BENEFICIARIO_EMAIL.message}

            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField fullWidth type="text" name="ESTABELECIMENTO" label="Nome do estabelecimento"
              variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.ESTABELECIMENTO?true:false}
              helperText={errors.ESTABELECIMENTO && errors.ESTABELECIMENTO.message}

            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField fullWidth type="date" name="DATA_DE_UTILIZACAO" label="Data da transação"
              variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.DATA_DE_UTILIZACAO?true:false}
              helperText={errors.DATA_DE_UTILIZACAO && errors.DATA_DE_UTILIZACAO.message}

            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField fullWidth type="number" name="VALOR" label="Valor da transação"
              variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.VALOR?true:false}
              helperText={errors.VALOR && errors.VALOR.message}

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

