import * as React from 'react';
import { TextField, Select, MenuItem, FormLabel, Grid, Button, Input, Paper, Snackbar, FormControl, RadioGroup, FormControlLabel, Radio, makeStyles, Theme, createStyles, InputLabel, Backdrop, Typography, CircularProgress } from '@material-ui/core';
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
  ALCADA_APROVACAO: yup.string().default("SUP"),
  WF_APROVACAO: yup.boolean().default(true),

  APROVADOR_ID: yup.string().required(),
  APROVADOR_NOME: yup.string().required(),
  APROVADOR_EMAIL: yup.string().email().required(),
  APROVADOR_EMPRESA_COD: yup.string(),
  APROVADOR_EMPRESA_NOME: yup.string(),
  APROVADOR_LEVEL: yup.string()
  .when('ALCADA_APROVACAO', (ALCADA_APROVACAO, sch) => {
    if(ALCADA_APROVACAO === 'SUP') return sch.notOneOf(['STAFF']);
    if(ALCADA_APROVACAO === 'D-4') return sch.notOneOf(['STAFF', 'SUP']);
    if(ALCADA_APROVACAO === 'D-3') return sch.oneOf(['D-3', 'D-2', 'D-1', 'DE']);
    if(ALCADA_APROVACAO === 'D-2') return sch.oneOf(['D-2', 'D-1', 'DE']);
    if(ALCADA_APROVACAO === 'D-1') return sch.oneOf(['D-1', 'DE']);
    })
  .required(),

  PERIODO_INICIO: yup.date().min(new Date()),
  PERIODO_FIM: yup.date()
    .when('PERIODO_INICIO', (PERIODO_INICIO, sch)=> {
      const dataInicio = new Date(PERIODO_INICIO);
      const dataMinima = new Date(dataInicio.getFullYear(),dataInicio.getMonth(), dataInicio.getDate() + 30); 
      return sch.min(dataMinima, 'Período precisa ser maior do que 30 dias')
    }),

  BENEFICIARIO_ID: yup.string().required(),
  BENEFICIARIO_NOME: yup.string().required(),
  BENEFICIARIO_EMAIL: yup.string().email().required(),
  BENEFICIARIO_EMPRESA_COD: yup.string(),
  BENEFICIARIO_EMPRESA_NOME: yup.string(),

  MOTIVO: yup.string()
    .required('Justificativa é necessária'),
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

export default function AirbnbHosting() {
  const { register, handleSubmit, control, errors, reset, setValue, watch } = useForm<IRequests_AllFields>({
    resolver: yupResolver(schema)
  });
  const [approver, setApprover] = useState<IEmployee>();
  const [empregado, setEmpregado] = useState<IEmployee>();
  const [snackMessage, setSnackMessage] = useState<ISnack>({
    open: false,
    message: "",
    severity:'info'
  });
  const { updateContext } = useContext(Context);
  const classes = useStyles();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [fileInfos, setFileInfos] = useState<IAttachmentFileInfo[]>([]);

  const handleGetEmpregado = value => getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
    .then(emp => {
      setEmpregado(emp);
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
      setEmpregado(emp);
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

    console.log(errors);

  return (
    <Paper>
      <HocDialog>
        <p>
        É permitida reserva em Airbnb exclusivamente para hospedagem acima de 30 dias consecutivos, sendo responsabilidade do empregado:
        <br/> • realização da reserva;
        <br/> • análise das condições comerciais acordadas no que se refere à política de cancelamento;
        <br/> • pagamento exclusivamente com cartão corporativo de viagens;
        <br/> • vistoria no imóvel na entrada e no término do período da locação;
        <br/> • solução de possíveis imprevistos diretamente com o responsável pelo imóvel através da plataforma do Airbnb;
        <br/> • comunicação ao Centro de Controle Corporativo da Vale informando o período e local da estadia;
        <br/> • preenchimento deste formulário anexando termo de responsabilidade assinado

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
                  <MenuItem value="Airbnb para hospedagem">Airbnb para hospedagem</MenuItem>
                </Select>
              }
              id="Process"
              name="PROCESSO"
              defaultValue="Airbnb para hospedagem"
              control={control}
              error={errors.PROCESSO?true:false}
              helperText={errors.PROCESSO && errors.PROCESSO.message}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
            <TextField type="text" name="BENEFICIARIO_ID" variant="outlined"
              fullWidth
              label="Viajante: Matrícula"
              onBlur={ e=> handleGetEmpregado(e.target.value) }
              InputLabelProps={{ shrink: true }}
              inputRef={register}
              error={errors.BENEFICIARIO_ID?true:false}
              helperText={errors.BENEFICIARIO_ID && errors.BENEFICIARIO_ID.message}
            />
          </Grid>
          
          <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
            <TextField fullWidth type="email" name="BENEFICIARIO_EMAIL" label="Viajante: E-mail"
              variant="outlined"
              inputRef={register}
              onBlur={ e=> handleGetEmployeeByEmail(e.target.value) }
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_EMAIL?true:false}
              helperText={errors.BENEFICIARIO_EMAIL && errors.BENEFICIARIO_EMAIL.message}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField fullWidth type="text" name="BENEFICIARIO_NOME" label="Viajante: Nome" variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_NOME?true:false}
              helperText={errors.BENEFICIARIO_NOME && errors.BENEFICIARIO_NOME.message}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField fullWidth variant="outlined" type="text"
            multiline rows={2}
            name="MOTIVO" label="Justificativa para utilização do Airbnb" inputRef={register}
              error={errors.MOTIVO?true:false}
              helperText={errors.MOTIVO && errors.MOTIVO.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField required fullWidth id="BeginDate" type="date" name="PERIODO_INICIO" label="Check In"
            variant="outlined" InputLabelProps={{ shrink: true }} inputRef={register}
            error={errors.PERIODO_INICIO?true:false}
            helperText={errors.PERIODO_INICIO && errors.PERIODO_INICIO.message}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField required fullWidth id="EndDate" type="date" name="PERIODO_FIM" label="Check Out"
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
            <InputLabel>
              Anexos
            </InputLabel>
            <br/>
            <input required type="file" multiple onChange={e => blob(e)}/>
          </Grid>

          <Grid xs={12} sm={12} md={12} lg={12} xl={12} item justify="flex-end" alignItems="flex-end">
            <Button type="submit"
            variant="contained" color="primary" style={{float:'right'}}> Enviar </Button>
          </Grid>

          <Input inputRef={register} readOnly type="hidden" name="BENEFICIARIO_EMPRESA_COD"
            value={empregado && empregado.COMPANY_CODE }
          />

          <Input inputRef={register} readOnly type="hidden" name="BENEFICIARIO_EMPRESA_NOME"
            value={empregado && empregado.COMPANY_DESC }/>

          <Input inputRef={register} readOnly type="hidden" name="APROVADOR_EMPRESA_COD"
            value={approver && approver.COMPANY_CODE }
          />

          <Input inputRef={register} readOnly type="hidden" name="APROVADOR_EMPRESA_NOME"
            value={approver && approver.COMPANY_DESC }
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
