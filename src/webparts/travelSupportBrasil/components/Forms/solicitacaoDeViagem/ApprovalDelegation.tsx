import * as React from 'react';
import { TextField, Select, MenuItem, FormLabel, Grid, Button, Input, Paper, Snackbar, Backdrop, Typography, CircularProgress, makeStyles, Theme, createStyles, InputLabel } from '@material-ui/core';
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
import { yup_pt_br } from '../../../Utils/yup_pt_br';
import { setLocale } from 'yup';
import { IAttachmentFileInfo } from '@pnp/sp/attachments';
import { sp } from '@pnp/sp';

setLocale(yup_pt_br);


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
  DONO_DA_DESPESA_EMAIL: yup.string().required(),
  DONO_DA_DESPESA_EMPRESA_COD: yup.string(),
  DONO_DA_DESPESA_EMPRESA_NOME: yup.string().required(),
  DONO_DA_DESPESA_LEVEL: yup.string().required(),

  BENEFICIARIO_ID: yup.string().required(),
  BENEFICIARIO_NOME: yup.string().required(),
  BENEFICIARIO_EMAIL: yup.string().email().required(),
  BENEFICIARIO_EMPRESA_COD: yup.string().required(),
  BENEFICIARIO_EMPRESA_NOME: yup.string().required(),
  BENEFICIARIO_LEVEL: yup.string()
  .when('DONO_DA_DESPESA_LEVEL', (DONO_DA_DESPESA_LEVEL, sch) => {
    const msg = 'Delegação só pode ser feita para níveis acima ou 1 nível abaixo (mínimo: SUP)';
    if(DONO_DA_DESPESA_LEVEL === 'SUP') return sch.oneOf(['SUP', 'D-4', 'D-3', 'D-2', 'D-1', 'DE'], msg);
    if(DONO_DA_DESPESA_LEVEL === 'D-4') return sch.oneOf(['SUP', 'D-4', 'D-3', 'D-2', 'D-1', 'DE'], msg);
    if(DONO_DA_DESPESA_LEVEL === 'D-3') return sch.oneOf(['SUP', 'D-4', 'D-3', 'D-2', 'D-1', 'DE'], msg);
    if(DONO_DA_DESPESA_LEVEL === 'D-2') return sch.oneOf(['D-3', 'D-2', 'D-1', 'DE'], msg);
    if(DONO_DA_DESPESA_LEVEL === 'D-1') return sch.oneOf(['D-2', 'D-1', 'DE'], msg);
    if(DONO_DA_DESPESA_LEVEL === 'DE') return sch.oneOf(['DE', 'D-1'], msg);
  })
  .required(),

  TIPO_DE_DELEGACAO: yup.string().default('Aprovação de viagem'),
  PERIODO_INICIO: yup.date().min(new Date(), 'Data precisa ser posterior ao dia de hoje'),
  PERIODO_FIM: yup.date().min(new Date(), 'Data precisa ser posterior ao dia de hoje'),
  MOTIVO: yup.string().required()
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

export default function ApprovalDelegation() {
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
  const classes = useStyles();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [fileInfos, setFileInfos] = useState<IAttachmentFileInfo[]>([]);


  console.log(errors);

  const handleGetDelegado = value =>getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
  .then(emp => {
    setDelegado(emp);
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
    setValue("BENEFICIARIO_LEVEL", emp?emp.APPROVAL_LEVEL_CODE:"", {
      shouldDirty: true
    });
  });

  const handleGetDelegadoByEmail = value =>getEmployee("WORK_EMAIL_ADDRESS", value.toLowerCase())
  .then(emp => {
    setDelegado(emp);
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
    setValue("BENEFICIARIO_LEVEL", emp?emp.APPROVAL_LEVEL_CODE:"", {
      shouldDirty: true
    });
  });

const handleGetDelegante = value => getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
.then(emp => {
  setDelegante(emp);
  setValue("DONO_DA_DESPESA_ID", emp?emp.IAM_ACCESS_IDENTIFIER:"", {
    shouldDirty: true
  });
  setValue("DONO_DA_DESPESA_NOME", emp?emp.FULL_NAME:"", {
    shouldDirty: true
  });
  setValue("DONO_DA_DESPESA_EMAIL", emp?emp.WORK_EMAIL_ADDRESS:"", {
    shouldDirty: true
  });
  setValue("DONO_DA_DESPESA_EMPRESA_NOME", emp?emp.COMPANY_DESC:"", {
    shouldDirty: true
  });
  setValue("DONO_DA_DESPESA_LEVEL", emp?emp.APPROVAL_LEVEL_CODE:"", {
    shouldDirty: true
  });
});

const handleGetDeleganteByEmail = value => getEmployee("WORK_EMAIL_ADDRESS", value.toLowerCase())
.then(emp => {
  setDelegante(emp);
  setValue("DONO_DA_DESPESA_ID", emp?emp.IAM_ACCESS_IDENTIFIER:"", {
    shouldDirty: true
  });
  setValue("DONO_DA_DESPESA_NOME", emp?emp.FULL_NAME:"", {
    shouldDirty: true
  });
  setValue("DONO_DA_DESPESA_EMAIL", emp?emp.WORK_EMAIL_ADDRESS:"", {
    shouldDirty: true
  });
  setValue("DONO_DA_DESPESA_EMPRESA_NOME", emp?emp.COMPANY_DESC:"", {
    shouldDirty: true
  });
  setValue("DONO_DA_DESPESA_LEVEL", emp?emp.APPROVAL_LEVEL_CODE:"", {
    shouldDirty: true
  });
});


const onSubmit = (data:IRequests_AllFields, e) => {
  newRequest(data)
    .then(result => {
      setOpenBackdrop(true);
      return result;
    })
    .then(result =>
      uploadListAttachments(result.data.ID)
        .then(()=> result)
        .catch(error => {
          alert(error);
          return result;
        })
    )
    .then(res => {
      setOpenBackdrop(false);
      setSnackMessage({open:true, message: `Solicitação gravada com sucesso! ID:${res.data.ID}`, severity:"success"});
      updateContext();
    })
    .catch(error => {
      setOpenBackdrop(false);
      setSnackMessage({open:true, message: "Falha ao tentar gravar a solicitação", severity:"error"});
      console.log(error);
    });
  e.target.reset();
};

function blob(e) {
  //Get the File Upload control id
  var fileCount = e.target.files.length;
  console.log(fileCount);
  let filesToAdd = [];
  for (let i = 0; i < fileCount; i++) {
    let fileName = e.target.files[i].name;
    console.log(fileName);
    let file = e.target.files[i];
    let reader = new FileReader();
    reader.onload = (fileToConvert => (readerEvent) =>
      filesToAdd.push({
        "name": fileToConvert.name,
        "content": readerEvent.target.result
      }))(file);
    reader.readAsArrayBuffer(file);
  }//End of for loop
  setFileInfos(filesToAdd);
}

function uploadListAttachments(id) {
  var item = sp.web.lists.getByTitle("SOLICITACOES").items.getById(id);
  return item.attachmentFiles.addMultiple(fileInfos);
}


  return (
    <Paper>
      <HocDialog>
        <p>
          A delegação deve ser realizada pelo aprovador, no Sistema de Viagens, antes da sua ausência. <br/>
          Em caso de dúvidas sobre como realizar a delegação, consulte o passo a passo disponível na intranet, em Institucional e serviços > Viagens > Solicitação de viagem >  Aprovação das solicitações de viagens. <br/>
          Caso o gestor tenha se ausentado antes de realizar a delegação, preencha este formulário.
        </p>
      </HocDialog>
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
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
            <TextField type="text" name="DONO_DA_DESPESA_ID" variant="outlined"
              label="Matrícula do delegante"
              onBlur={ e=> handleGetDelegante(e.target.value) }
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.DONO_DA_DESPESA_ID?true:false}
              helperText={errors.DONO_DA_DESPESA_ID && errors.DONO_DA_DESPESA_ID.message}
            />
          </Grid>

          <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
            <TextField fullWidth type="email" name="DONO_DA_DESPESA_EMAIL" label="E-mail do delegante"
              variant="outlined"
              onBlur={ e=> handleGetDeleganteByEmail(e.target.value) }
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.DONO_DA_DESPESA_EMAIL?true:false}
              helperText={errors.DONO_DA_DESPESA_EMAIL && errors.DONO_DA_DESPESA_EMAIL.message}
            />
          </Grid>

          <Grid item xs={12} sm={10} md={10} lg={10} xl={10} >
            <TextField disabled fullWidth type="text" name="DONO_DA_DESPESA_NOME" label="Nome do delegante" variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.DONO_DA_DESPESA_NOME?true:false}
              helperText={errors.DONO_DA_DESPESA_NOME && errors.DONO_DA_DESPESA_NOME.message}
              value={delegante ? delegante.FULL_NAME : ""}
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

          <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
            <TextField type="text" name="BENEFICIARIO_ID" variant="outlined"
              label="Matrícula do delegado"
              InputLabelProps={{ shrink: true }}
              onBlur={ e=> handleGetDelegado(e.target.value) }
              inputRef={register}
              error={errors.BENEFICIARIO_ID?true:false}
              helperText={errors.BENEFICIARIO_ID && errors.BENEFICIARIO_ID.message}
            />
          </Grid>

          <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
            <TextField fullWidth type="email" name="BENEFICIARIO_EMAIL" label="E-mail do delegado"
              variant="outlined"
              inputRef={register}
              onBlur={ e=> handleGetDelegadoByEmail(e.target.value) }
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_EMAIL?true:false}
              helperText={errors.BENEFICIARIO_EMAIL && errors.BENEFICIARIO_EMAIL.message}
            />
          </Grid>

          <Grid item xs={12} sm={10} md={10} lg={10} xl={10} >
            <TextField disabled fullWidth type="text" name="BENEFICIARIO_NOME" label="Nome do delegado" variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_NOME?true:false}
              helperText={errors.BENEFICIARIO_NOME && errors.BENEFICIARIO_NOME.message}
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

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField fullWidth id="FromDate" type="date" name="PERIODO_INICIO" label="Período da delegação (Início)"
            variant="outlined" InputLabelProps={{ shrink: true }} inputRef={register}
            error={errors.PERIODO_INICIO?true:false}
            helperText={errors.PERIODO_INICIO && errors.PERIODO_INICIO.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField fullWidth id="EndDate" type="date" name="PERIODO_FIM" label="Período da delegação (Fim)"
            variant="outlined" InputLabelProps={{ shrink: true }} inputRef={register}
            error={errors.PERIODO_FIM?true:false}
            helperText={errors.PERIODO_FIM && errors.PERIODO_FIM.message}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField fullWidth variant="outlined" type="text"
            multiline rows={5}
            name="MOTIVO" label="Justificativa" inputRef={register}
              error={errors.MOTIVO?true:false}
              helperText={errors.MOTIVO && errors.MOTIVO.message}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <InputLabel>
              Anexos
            </InputLabel>
            <br/>
            <input type="file" multiple onChange={e => blob(e)}/>
          </Grid>

          <Grid xs={12} sm={12} md={12} lg={12} xl={12} item justify="flex-end" alignItems="flex-end">
            <Button type="submit"
            variant="contained" color="primary" style={{float:'right'}}> Enviar </Button>
          </Grid>

          <Input inputRef={register} readOnly type="hidden" id="BENEFICIARIO_EMPRESA_COD" name="BENEFICIARIO_EMPRESA_COD"
          hidden
            value={delegado && delegado.COMPANY_CODE }
          />
          <Input inputRef={register} readOnly
            type="hidden"
            id="BENEFICIARIO_EMPRESA_NOME"
            name="BENEFICIARIO_EMPRESA_NOME"
            hidden
            value={delegado && delegado.COMPANY_DESC } />

          <Input inputRef={register} readOnly type="hidden" id="DONO_DA_DESPESA_EMPRESA_COD" name="DONO_DA_DESPESA_EMPRESA_COD"
            value={delegante && delegante.COMPANY_CODE }
            hidden
          />
          <Input inputRef={register} readOnly
            hidden
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
      <div>
        <Backdrop className={classes.backdrop} open={openBackdrop}>
          <Typography variant='h4'> Aguarde, estamos salvando as informações... </Typography>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </Paper>

  );
}
