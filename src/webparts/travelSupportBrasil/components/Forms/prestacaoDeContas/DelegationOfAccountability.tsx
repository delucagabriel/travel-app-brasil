import * as React from 'react';
import { TextField, Select, MenuItem, FormLabel, Grid, Button, Input, Paper, Snackbar, Typography } from '@material-ui/core';
import { useState, useContext } from 'react';
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
  SLA: yup.number().default(48),
  AREA_RESOLVEDORA: yup.string().default("Viagens Corporativas"),
  ALCADA_APROVACAO: yup.string().default(""),
  WF_APROVACAO: yup.boolean().default(false),
  DATA_DE_APROVACAO: yup.date().default(new Date()),
  STATUS_APROVACAO: yup.string().default('Aprovado'),

  DONO_DA_DESPESA_ID: yup.string().required(),
  DONO_DA_DESPESA_NOME: yup.string().required(),
  DONO_DA_DESPESA_EMAIL: yup.string().email().required(),
  DONO_DA_DESPESA_EMPRESA_COD: yup.string(),
  DONO_DA_DESPESA_EMPRESA_NOME: yup.string().required(),
  DONO_DA_DESPESA_LEVEL: yup.string().required(),

  BENEFICIARIO_ID: yup.string().required(),
  BENEFICIARIO_NOME: yup.string().required(),
  BENEFICIARIO_EMAIL: yup.string().email().required(),
  BENEFICIARIO_EMPRESA_COD: yup.string(),
  BENEFICIARIO_EMPRESA_NOME: yup.string(),
  BENEFICIARIO_LEVEL: yup.string()
  .when(['DONO_DA_DESPESA_LEVEL', 'PROCESSO'], (DONO_DA_DESPESA_LEVEL, PROCESSO, sch) => {
    if(PROCESSO === 'Delegação da aprovação'){
      const msg = 'Delegação só pode ser feita para níveis acima ou 1 nível abaixo (mínimo: SUP)';
      if(DONO_DA_DESPESA_LEVEL === 'SUP') return sch.oneOf(['SUP', 'D-4', 'D-3', 'D-2', 'D-1', 'DE'], msg);
      if(DONO_DA_DESPESA_LEVEL === 'D-4') return sch.oneOf(['SUP', 'D-4', 'D-3', 'D-2', 'D-1', 'DE'], msg);
      if(DONO_DA_DESPESA_LEVEL === 'D-3') return sch.oneOf(['D-4', 'D-3', 'D-2', 'D-1', 'DE'], msg);
      if(DONO_DA_DESPESA_LEVEL === 'D-2') return sch.oneOf(['D-3', 'D-2', 'D-1', 'DE'], msg);
      if(DONO_DA_DESPESA_LEVEL === 'D-1') return sch.oneOf(['D-2', 'D-1', 'DE'], msg);
      if(DONO_DA_DESPESA_LEVEL === 'DE') return sch.oneOf(['DE', 'D-1'], msg);
    }
  })
  .required(),


  TIPO_DE_DELEGACAO: yup.string(),
  PERIODO_FIM: yup.date().min(new Date(), 'Data precisa ser posterior ao dia de hoje')
});

export default function DelegationOfAccountability() {
  const { register, handleSubmit, control, errors, reset, setValue } = useForm<IRequests_AllFields>({
    resolver: yupResolver(schema)
  });
  const [delegante, setDelegante] = useState<IEmployee>();
  const [delegado, setDelegado] = useState<IEmployee>();
  const [snackMessage, setSnackMessage] = useState<ISnack>({
    open: false,
    message: "",
    severity:'info'
  });
  const { updateContext } = useContext(Context);

  console.log(errors);

  const handleGetDelegado = value =>getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
    .then(emp => setDelegado(emp));

  const handleGetDelegante = value =>getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
    .then(emp => setDelegante(emp));

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
        <Typography variant='h6'>
          Delegação da aprovação da prestação de contas:
        </Typography>
        <Typography variant='body2'>
          Antes de sair de férias, o próprio gestor deve realizar a delegação no SAP Concur. Para mais informações, consulte o tutorial disponível na intranet.<br/>
          Caso ele tenha se ausentado sem fazer a delegação, preencha o formulário a seguir. De acordo com a NFN-0018, a delegação de aprovação é permitida para outro gestor de mesmo nível, superior ou um nível abaixo.
        </Typography>
        <br/>

        <Typography variant='h6'>
          Delegação da prestação de contas:
        </Typography>
        <Typography variant='body2'>
          Em caso de ausência, o empregado deve delegar previamente a atividade de prestação de contas a outro empregado, diretamente no sistema. Para isso, na página inicial do Concur, clique em Perfil > Configurações de Perfil > Delegados de Despesas > Adicionar. Pesquise o empregado para quem será atribuída a permissão de prestação de contas, clique sobre o nome para adicionar, marque as opções que o delegado poderá executar e clique em salvar. <br/>
          Caso o empregado não tenha acesso a computador, preencha o formulário a seguir.
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
                <Select fullWidth>
                  <MenuItem value="Delegação da aprovação">Delegação da aprovação</MenuItem>
                  <MenuItem value="Delegação da prestação de contas">Delegação da prestação de contas</MenuItem>
                </Select>
              }
              id="Process"
              name="PROCESSO"
              defaultValue=""
              control={control}
              error={errors.PROCESSO?true:false}
              helperText={errors.PROCESSO && errors.PROCESSO.message}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField type="text" name="DONO_DA_DESPESA_ID" variant="outlined"
              label="Matrícula do delegante" onBlur={ e=> handleGetDelegante(e.target.value) }
              inputRef={register}
              error={errors.DONO_DA_DESPESA_ID?true:false}
              helperText={errors.DONO_DA_DESPESA_ID && errors.DONO_DA_DESPESA_ID.message}
            />
          </Grid>

          <Grid item xs={12} sm={5} md={5} lg={5} xl={5} >
            <TextField disabled fullWidth type="text" name="DONO_DA_DESPESA_NOME" label="Nome do delegante" variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.DONO_DA_DESPESA_NOME?true:false}
              helperText={errors.DONO_DA_DESPESA_NOME && errors.DONO_DA_DESPESA_NOME.message}
              value={delegante ? delegante.FULL_NAME : ""}
            />
          </Grid>
          <Grid item xs={12} sm={5} md={5} lg={5} xl={5} >
            <TextField disabled fullWidth type="email" name="DONO_DA_DESPESA_EMAIL" label="E-mail do delegante"
              variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.DONO_DA_DESPESA_EMAIL?true:false}
              helperText={errors.DONO_DA_DESPESA_EMAIL && errors.DONO_DA_DESPESA_EMAIL.message}
              value={delegante ? delegante.WORK_EMAIL_ADDRESS : ""}
            />
          </Grid>
          <Grid item xs={12} sm={2} md={2} lg={2} xl={2} >
            <TextField disabled fullWidth type="text" name="DONO_DA_DESPESA_LEVEL" label="Nível do delegante"
              variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.DONO_DA_DESPESA_LEVEL?true:false}
              helperText={errors.DONO_DA_DESPESA_LEVEL && errors.DONO_DA_DESPESA_LEVEL.message}
              value={delegante ? delegante.APPROVAL_LEVEL_CODE : ""}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField type="text" name="BENEFICIARIO_ID" variant="outlined"
              label="Matrícula do delegado" onBlur={ e=> handleGetDelegado(e.target.value) }
              inputRef={register}
              error={errors.BENEFICIARIO_ID?true:false}
              helperText={errors.BENEFICIARIO_ID && errors.BENEFICIARIO_ID.message}
            />
          </Grid>

          <Grid item xs={12} sm={5} md={5} lg={5} xl={5} >
            <TextField disabled fullWidth type="text" name="BENEFICIARIO_NOME" label="Nome do delegado" variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_NOME?true:false}
              helperText={errors.BENEFICIARIO_NOME && errors.BENEFICIARIO_NOME.message}
              value={delegado ? delegado.FULL_NAME : ""}
            />
          </Grid>
          <Grid item xs={12} sm={5} md={5} lg={5} xl={5} >
            <TextField disabled fullWidth type="email" name="BENEFICIARIO_EMAIL" label="E-mail do delegado"
              variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_EMAIL?true:false}
              helperText={errors.BENEFICIARIO_EMAIL && errors.BENEFICIARIO_EMAIL.message}
              value={delegado ? delegado.WORK_EMAIL_ADDRESS : ""}
            />
          </Grid>
          <Grid item xs={12} sm={2} md={2} lg={2} xl={2} >
            <TextField disabled fullWidth type="text" name="BENEFICIARIO_LEVEL" label="Nível do delegado"
              variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_LEVEL?true:false}
              helperText={errors.BENEFICIARIO_LEVEL && errors.BENEFICIARIO_LEVEL.message}
              value={delegado ? delegado.APPROVAL_LEVEL_CODE : ""}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField id="EndDate" type="date" name="PERIODO_FIM" label="Período da delegação (Fim)"
            variant="outlined" InputLabelProps={{ shrink: true }} inputRef={register}
            error={errors.PERIODO_FIM?true:false}
            helperText={errors.PERIODO_FIM && errors.PERIODO_FIM.message}
            />
          </Grid>

          <Grid xs={12} sm={12} md={12} lg={12} xl={12} item justify="flex-end" alignItems="flex-end">
            <Button type="submit"
            variant="contained" color="primary" style={{float:'right'}}> Enviar </Button>
          </Grid>

          <Input inputRef={register} readOnly type="hidden" id="BENEFICIARIO_EMPRESA_COD" name="BENEFICIARIO_EMPRESA_COD"
            value={delegado && delegado.COMPANY_CODE }
          />
          <Input inputRef={register} readOnly type="hidden" id="BENEFICIARIO_EMPRESA_NOME" name="BENEFICIARIO_EMPRESA_NOME"
            value={delegado && delegado.COMPANY_DESC } />

          <Input inputRef={register} readOnly type="hidden" id="DONO_DA_DESPESA_EMPRESA_COD" name="DONO_DA_DESPESA_EMPRESA_COD"
            value={delegante && delegante.COMPANY_CODE }
          />
          <Input inputRef={register} readOnly
            type="hidden"
            id="DONO_DA_DESPESA_EMPRESA_NOME" name="DONO_DA_DESPESA_EMPRESA_NOME"
            value={delegante && delegante.COMPANY_DESC }
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
