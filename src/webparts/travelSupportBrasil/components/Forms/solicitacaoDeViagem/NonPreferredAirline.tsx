import * as React from 'react';
import { TextField, Select, MenuItem, FormLabel, Grid, Button, Input, Paper, Typography, Snackbar, FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { useState, useContext } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Alert } from '@material-ui/lab';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers';
import { getEmployee } from '../../../services/EmployeesService';
import { newRequest, getRequestById } from '../../../services/RequestServices';
import { IEmployee } from '../../../Interfaces/IEmployee';
import { IRequests_AllFields } from '../../../Interfaces/Requests/IRequests';
import { ISnack } from '../../../Interfaces/ISnack';
import { Context } from '../../Context';
import { IRequest_NewCard } from '../../../Interfaces/Requests/IRequest_NewCard';

// MOTIVO_DA_VIAGEM
// Emerg. ambien/legal/oper/medica
// Falecimento
// Trat. Médico fora de domicílio
// Viagem de benefício



const schema: yup.ObjectSchema<IRequests_AllFields> = yup.object().shape({
  MACROPROCESSO: yup.string().required(),
  PROCESSO: yup.string().required(),
  SLA: yup.number().default(48),
  AREA_RESOLVEDORA: yup.string().default("Viagens Corporativas"),
  ALCADA_APROVACAO: yup.string().default("SUP"),
  WF_APROVACAO: yup.boolean().default(true),

  APROVADOR_ID: yup.string().required(),
  APROVADOR_NOME: yup.string().required(),
  APROVADOR_EMAIL: yup.string().email().required(),
  APROVADOR_EMPRESA_COD: yup.string().required(),
  APROVADOR_EMPRESA_NOME: yup.string().required(),
  APROVADOR_LEVEL: yup.string()
  .when('ALCADA_APROVACAO', (ALCADA_APROVACAO, sch) => {
    if(ALCADA_APROVACAO === 'SUP') return sch.notOneOf(['STAFF']);
    if(ALCADA_APROVACAO === 'D-4') return sch.notOneOf(['STAFF', 'SUP']);
    if(ALCADA_APROVACAO === 'D-3') return sch.oneOf(['D-3', 'D-2', 'D-1', 'DE']);
    if(ALCADA_APROVACAO === 'D-2') return sch.oneOf(['D-2', 'D-1', 'DE']);
    if(ALCADA_APROVACAO === 'D-1') return sch.oneOf(['D-1', 'DE']);
    })
  .required(),

  SOLICITANTE_ID: yup.string().required(),
  SOLICITANTE_NOME: yup.string().required(),
  SOLICITANTE_EMAIL: yup.string().email().required(),
  SOLICITANTE_EMPRESA_COD: yup.string(),
  SOLICITANTE_EMPRESA_NOME: yup.string().required(),

  BENEFICIARIO_ID: yup.string().required(),
  BENEFICIARIO_NOME: yup.string().required(),
  BENEFICIARIO_EMAIL: yup.string().email().required(),
  BENEFICIARIO_EMPRESA_COD: yup.string(),
  BENEFICIARIO_EMPRESA_NOME: yup.string(),

  ID_SOLICITACAO_CARTAO: yup.number().required(),
  TIPO_SOLICITACAO_CARTAO: yup.string().equals(['Novo cartão']),
  PORTADOR_SOLIC_CARTAO: yup.string(),
  CENTRO_DE_CUSTOS: yup.string().required(),
  ACOMPANHANTES: yup.string(),
  PERIODO_INICIO: yup.date().min(new Date()),
  PERIODO_FIM: yup.date().min(new Date()),
  MOTIVO: yup.string()
  .min(20)
  .required(),
  MOTIVO_DA_VIAGEM: yup.string()
  .min(20)
  .required(),
  OBS_PARA_SOLICITACAO: yup.string(),
});

export default function NonPreferredAirline() {
  const { register, handleSubmit, control, errors, reset, setValue } = useForm<IRequests_AllFields>({
    resolver: yupResolver(schema)
  });
  const [requisicaoCartao, setRequisicaoCartao] = useState<IRequest_NewCard>();
  const [aprovador, setAprovador] = useState<IEmployee>();
  const [solicitante, setSolicitante] = useState<IEmployee>();
  const [empregado, setEmpregado] = useState<IEmployee>();
  const [snackMessage, setSnackMessage] = useState<ISnack>({
    open: false,
    message: "",
    severity:'info'
  });
  const { updateContext } = useContext(Context);

  console.log(errors);

  const handleGetEmpregado = value => getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
    .then(emp => setEmpregado(emp));

  const handleGetAprovador = value => getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
    .then(emp => setAprovador(emp));

  const handleGetSolicitante = value => getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
    .then(emp => setSolicitante(emp));

  const handleGetRequest = id => getRequestById(id)
    .then(req => setRequisicaoCartao(req));

  const onSubmit = (data:IRequests_AllFields, e) => {
    newRequest(data)
      .then(res => {
        setSnackMessage({open:true, message: `Solicitação gravada com suceso! ID:${res.data.ID}`, severity:"success"});
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
                  <MenuItem value="Solicitação de viagem"> Solicitação de viagem </MenuItem>
                </Select>
              }
              name="MACROPROCESSO"
              defaultValue="Solicitação de viagem"
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
                  <MenuItem value="Delegação da aprovação da viagem">Delegação da aprovação da viagem</MenuItem>
                </Select>
              }
              id="Process"
              name="PROCESSO"
              defaultValue="Delegação da aprovação da viagem"
              control={control}
              error={errors.PROCESSO?true:false}
              helperText={errors.PROCESSO && errors.PROCESSO.message}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField type="text" name="ID_SOLICITACAO_CARTAO" variant="outlined"
              label="ID: solicitação do cartão" onBlur={ e=> handleGetRequest(e.target.value) }
              inputRef={register}
              error={errors.ID_SOLICITACAO_CARTAO?true:false}
              helperText={errors.ID_SOLICITACAO_CARTAO && errors.ID_SOLICITACAO_CARTAO.message}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField disabled fullWidth type="text" name="TIPO_SOLICITACAO_CARTAO" label="Solicitação: Tipo" variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.TIPO_SOLICITACAO_CARTAO?true:false}
              helperText={errors.TIPO_SOLICITACAO_CARTAO && errors.TIPO_SOLICITACAO_CARTAO.message}
              value={requisicaoCartao ? requisicaoCartao.PROCESSO : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField disabled fullWidth type="email" name="PORTADOR_SOLIC_CARTAO" label="Portador"
              variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.PORTADOR_SOLIC_CARTAO?true:false}
              helperText={errors.PORTADOR_SOLIC_CARTAO && errors.PORTADOR_SOLIC_CARTAO.message}
              value={requisicaoCartao ? requisicaoCartao.BENEFICIARIO_NOME : ""}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField type="text" name="SOLICITANTE_ID" variant="outlined"
              label="Matrícula do empregado" onBlur={ e=> handleGetEmpregado(e.target.value) }
              inputRef={register}
              error={errors.SOLICITANTE_ID?true:false}
              helperText={errors.SOLICITANTE_ID && errors.SOLICITANTE_ID.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField disabled fullWidth type="text" name="SOLICITANTE_NOME" label="Nome do delegado" variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.SOLICITANTE_NOME?true:false}
              helperText={errors.SOLICITANTE_NOME && errors.SOLICITANTE_NOME.message}
              value={empregado ? empregado.FULL_NAME : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField disabled fullWidth type="email" name="SOLICITANTE_EMAIL" label="E-mail do delegado"
              variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.SOLICITANTE_EMAIL?true:false}
              helperText={errors.SOLICITANTE_EMAIL && errors.SOLICITANTE_EMAIL.message}
              value={empregado ? empregado.WORK_EMAIL_ADDRESS : ""}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField type="text" name="BENEFICIARIO_ID" variant="outlined"
              label="Matrícula do empregado" onBlur={ e=> handleGetEmpregado(e.target.value) }
              inputRef={register}
              error={errors.BENEFICIARIO_ID?true:false}
              helperText={errors.BENEFICIARIO_ID && errors.BENEFICIARIO_ID.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField disabled fullWidth type="text" name="BENEFICIARIO_NOME" label="Nome do empregado" variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_NOME?true:false}
              helperText={errors.BENEFICIARIO_NOME && errors.BENEFICIARIO_NOME.message}
              value={empregado ? empregado.FULL_NAME : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField disabled fullWidth type="email" name="BENEFICIARIO_EMAIL" label="E-mail do empregado"
              variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_EMAIL?true:false}
              helperText={errors.BENEFICIARIO_EMAIL && errors.BENEFICIARIO_EMAIL.message}
              value={empregado ? empregado.WORK_EMAIL_ADDRESS : ""}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField id="BeginDate" type="date" name="PERIODO_INICIO" label="Check In"
            variant="outlined" InputLabelProps={{ shrink: true }} inputRef={register}
            error={errors.PERIODO_INICIO?true:false}
            helperText={errors.PERIODO_INICIO && errors.PERIODO_INICIO.message}
            >Vencimento</TextField>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField id="EndDate" type="date" name="PERIODO_FIM" label="Check Out"
            variant="outlined" InputLabelProps={{ shrink: true }} inputRef={register}
            error={errors.PERIODO_FIM?true:false}
            helperText={errors.PERIODO_FIM && errors.PERIODO_FIM.message}
            >Vencimento</TextField>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField fullWidth variant="outlined" type="text"
            multiline rows={5}
            name="MOTIVO" label="justificativa da solicitação de delegação" inputRef={register}
              error={errors.MOTIVO?true:false}
              helperText={errors.MOTIVO && errors.MOTIVO.message}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                <TextField fullWidth type="search" name="APROVADOR_ID" variant="outlined" label="Aprovador: Matrícula"
                  error={errors.APROVADOR_ID?true:false}
                  helperText={errors.APROVADOR_ID && errors.APROVADOR_ID.message}
                  inputRef={register}
                  onBlur={e=>handleGetAprovador(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={5} md={5} lg={5} xl={5} >
                <TextField
                  disabled
                  fullWidth
                  type="text"
                  name="APROVADOR_NOME"
                  label="Aprovador: Nome"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={aprovador ? aprovador.FULL_NAME : "" }
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
                  value={aprovador && aprovador.APPROVAL_LEVEL_CODE}
                  InputLabelProps={{ shrink: true }}
                  inputRef={register}
                  error={errors.APROVADOR_LEVEL?true:false}
                  helperText={errors.APROVADOR_LEVEL && errors.APROVADOR_LEVEL.message}
                />
              </Grid>

          <Grid xs={12} sm={12} md={12} lg={12} xl={12} item justify="flex-end" alignItems="flex-end">
            <Button type="submit"
            variant="contained" color="primary" style={{float:'right'}}> Enviar </Button>
          </Grid>

          <Input inputRef={register} readOnly type="hidden" name="BENEFICIARIO_EMPRESA_COD"
            value={empregado && empregado.COMPANY_CODE }
          />
          <Input inputRef={register} readOnly type="hidden" name="BENEFICIARIO_EMPRESA_NOME"
            value={empregado && empregado.COMPANY_DESC } />

          <Input inputRef={register} readOnly type="hidden" name="SOLICITANTE_EMPRESA_COD"
            value={solicitante && solicitante.COMPANY_CODE }
          />
          <Input inputRef={register} readOnly type="hidden" name="SOLICITANTE_EMPRESA_NOME"
            value={solicitante && solicitante.COMPANY_DESC }
          />
          <Input inputRef={register} readOnly type="hidden" name="APROVADOR_EMPRESA_COD"
            value={aprovador && aprovador.COMPANY_CODE }
          />
          <Input inputRef={register} readOnly type="hidden" name="APROVADOR_EMPRESA_NOME"
            value={aprovador && aprovador.COMPANY_DESC }
          />
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
