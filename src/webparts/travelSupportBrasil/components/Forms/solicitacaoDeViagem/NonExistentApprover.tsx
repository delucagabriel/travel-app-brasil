import * as React from 'react';
import { TextField, Select, MenuItem, FormLabel, Grid, Button, Input, Paper, Typography, Snackbar, FormControl, RadioGroup, FormControlLabel, Radio, makeStyles, Theme, createStyles, Backdrop, CircularProgress, InputLabel } from '@material-ui/core';
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
  SLA: yup.number().default(24),
  AREA_RESOLVEDORA: yup.string().default("Viagens Corporativas"),
  ALCADA_APROVACAO: yup.string().default(""),
  WF_APROVACAO: yup.boolean().default(false),
  DATA_DE_APROVACAO: yup.date().default(new Date()),
  STATUS_APROVACAO: yup.string().default('Aprovado'),

  SOLICITANTE_ID: yup.string().required(),
  SOLICITANTE_NOME: yup.string().required(),
  SOLICITANTE_EMAIL: yup.string().email().required(),
  SOLICITANTE_EMPRESA_COD: yup.string(),
  SOLICITANTE_EMPRESA_NOME: yup.string(),

  BENEFICIARIO_ID: yup.string().required(),
  BENEFICIARIO_NOME: yup.string().required(),
  BENEFICIARIO_EMAIL: yup.string().email().required(),
  BENEFICIARIO_EMPRESA_COD: yup.string(),
  BENEFICIARIO_EMPRESA_NOME: yup.string(),

  MOTIVO: yup.string()
  .required()
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

export default function NonExistentApprover() {
  const classes = useStyles();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [fileInfos, setFileInfos] = useState<IAttachmentFileInfo[]>([]);

  const { register, handleSubmit, control, errors, reset, setValue } = useForm<IRequests_AllFields>({
    resolver: yupResolver(schema)
  });
  const [employee, setEmployee] = useState<IEmployee>();
  const [requester, setRequester] = useState<IEmployee>();
  const [snackMessage, setSnackMessage] = useState<ISnack>({
    open: false,
    message: "",
    severity:'info'
  });
  const { updateContext } = useContext(Context);

  console.log(errors);

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

  const handleGetRequester = value => getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
  .then(emp => {
    setRequester(emp);
    setValue("SOLICITANTE_ID", emp?emp.IAM_ACCESS_IDENTIFIER:"", {
      shouldDirty: true
    });
    setValue("SOLICITANTE_NOME", emp?emp.FULL_NAME:"", {
      shouldDirty: true
    });
    setValue("SOLICITANTE_EMAIL", emp?emp.WORK_EMAIL_ADDRESS:"", {
      shouldDirty: true
    });
    setValue("SOLICITANTE_EMPRESA_NOME", emp?emp.COMPANY_DESC:"", {
      shouldDirty: true
    });
  });

  const handleGetRequesterByEmail = value => getEmployee("WORK_EMAIL_ADDRESS", value.toLowerCase())
  .then(emp => {
    setRequester(emp);
    setValue("SOLICITANTE_ID", emp?emp.IAM_ACCESS_IDENTIFIER:"", {
      shouldDirty: true
    });
    setValue("SOLICITANTE_NOME", emp?emp.FULL_NAME:"", {
      shouldDirty: true
    });
    setValue("SOLICITANTE_EMAIL", emp?emp.WORK_EMAIL_ADDRESS:"", {
      shouldDirty: true
    });
    setValue("SOLICITANTE_EMPRESA_NOME", emp?emp.COMPANY_DESC:"", {
      shouldDirty: true
    });
  });

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

  return (
    <Paper>
      <HocDialog>
        <p>
          Conforme Norma de Serviços Gerais-NFN-0018 as viagens nacionais devem ser aprovadas pelo superior imediato (cargo mínimo de Supervisor) e as viagens internacionais pelo DE-1 (cargo mínimo de Gerente Executivo). Caso o aprovador não esteja cadastrado ou incorreto no sistema de viagens, consulte sua estrutura com a equipe de RH.
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
                  <MenuItem value="Aprovador inexistente ou incorreto">Aprovador inexistente ou incorreto</MenuItem>
                </Select>
              }
              id="Process"
              name="PROCESSO"
              defaultValue="Aprovador inexistente ou incorreto"
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
              label="Viajante: Matrícula"
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
              label="Viajante: e-mail"
              variant="outlined"
              inputRef={register}
              onBlur={ e=> handleGetEmployeeByEmail(e.target.value) }
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_EMAIL?true:false}
              helperText={errors.BENEFICIARIO_EMAIL && errors.BENEFICIARIO_EMAIL.message}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField disabled fullWidth type="text" name="BENEFICIARIO_NOME"
              label="Viajante: Nome" variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_NOME?true:false}
              helperText={errors.BENEFICIARIO_NOME && errors.BENEFICIARIO_NOME.message}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
            <TextField
              fullWidth
              variant="outlined"
              type="search"
              name="SOLICITANTE_ID"
              label="Aprovador: Matrícula"
              onBlur={ e=> handleGetRequester(e.target.value) }
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.SOLICITANTE_ID?true:false}
              helperText={errors.SOLICITANTE_ID && errors.SOLICITANTE_ID.message}
            />
          </Grid>

          <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
            <TextField
              fullWidth
              type="text"
              name="SOLICITANTE_EMAIL"
              label="Aprovador: e-mail"
              variant="outlined"
              inputRef={register}
              onBlur={ e=> handleGetRequesterByEmail(e.target.value) }
              InputLabelProps={{ shrink: true }}
              error={errors.SOLICITANTE_EMAIL?true:false}
              helperText={errors.SOLICITANTE_EMAIL && errors.SOLICITANTE_EMAIL.message}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField disabled fullWidth type="text" name="SOLICITANTE_NOME"
              label="Aprovador: Nome" variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.SOLICITANTE_NOME?true:false}
              helperText={errors.SOLICITANTE_NOME && errors.SOLICITANTE_NOME.message}
            />
          </Grid>

          <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
            <FormControl component="fieldset" error={errors.NACIONAL_INTERNACIONAL?true:false}>
            <FormLabel component="legend">Tipo de viagem</FormLabel>
            <RadioGroup aria-label="NACIONAL_INTERNACIONAL" name="NACIONAL_INTERNACIONAL"
            row>
              <FormControlLabel value="Nacional" control={<Radio inputRef={register}/>} label="Nacional" />
              <FormControlLabel value="Internacional" control={<Radio inputRef={register}/>} label="Internacional" />
            </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField fullWidth variant="outlined" type="text"
            multiline rows={5}
            name="MOTIVO" label="Descrição detalhada do problema" inputRef={register}
              error={errors.MOTIVO?true:false}
              helperText={errors.MOTIVO && errors.MOTIVO.message}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <InputLabel>
              Anexe no formulário o e-mail com a indicação da equipe RH para inclusão do gestor no sistema.
            </InputLabel>
            <br/>
            <input type="file" multiple onChange={e => blob(e)}/>
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
        <Input inputRef={register} readOnly type="hidden" id="SOLICITANTE_EMPRESA_COD" name="SOLICITANTE_EMPRESA_COD"
            value={employee && employee.COMPANY_CODE }
          />
          <Input inputRef={register} readOnly type="hidden" id="SOLICITANTE_EMPRESA_NOME" name="SOLICITANTE_EMPRESA_NOME"
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
      <div>
        <Backdrop className={classes.backdrop} open={openBackdrop}>
          <Typography variant='h4'> Aguarde, estamos salvando as informações... </Typography>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </Paper>

  );
}
