import * as React from 'react';
import { TextField, Select, MenuItem, FormLabel, Grid, Button, Input, Paper, Typography, Snackbar, makeStyles, Theme, createStyles, InputLabel, Backdrop, CircularProgress } from '@material-ui/core';
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
import { TestaCPF } from '../../../Utils/validaCPF';
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

  BENEFICIARIO_ID: yup.string().required(),
  BENEFICIARIO_NOME: yup.string().required(),
  BENEFICIARIO_EMAIL: yup.string().required(),
  BENEFICIARIO_EMPRESA_COD: yup.string(),
  BENEFICIARIO_EMPRESA_NOME: yup.string(),
  CPF: yup.string().test('validCPF','CPF inválido', (cpf)=>TestaCPF(cpf)).required(),


  ULTIMOS_DIGITOS_DO_CARTAO: yup.string()
    .length(4)
    .matches(/\d/, "Only numbers")
    .required(),

});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

export default function CardAndSystemUnlock() {
  const classes = useStyles();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const { register, handleSubmit, control, errors, setValue } = useForm<IRequests_AllFields>({
    resolver: yupResolver(schema)
  });
  const [employee, setEmployee] = useState<IEmployee>();
  const [snackMessage, setSnackMessage] = useState<ISnack>({
    open: false,
    message: "",
    severity:'info'
  });
  const { updateContext } = useContext(Context);
  const [fileInfos, setFileInfos] = useState<IAttachmentFileInfo[]>([]);

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
    setValue("BENEFICIARIO_EMPRESA_COD", emp?emp.COMPANY_CODE:"", {
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
    setValue("BENEFICIARIO_EMPRESA_COD", emp?emp.COMPANY_CODE:"", {
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

    function blob(e) {
      //Get the File Upload control id
      var fileCount = e.target.files.length;
      let filesToAdd = [];
      for (let i = 0; i < fileCount; i++) {
        let fileName = e.target.files[i].name;
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
        <Typography variant='body2'>
          O desbloqueio do cartão corporativo e do acesso ao sistema de viagens é realizado em até 48 horas úteis após a regularização das prestações de contas pendentes.
          <br/>
          Importante anexar arquivo no formulário com a tela do SAP Concur que comprove que não há pendencia de prestação de contas.
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
                  <MenuItem value="Desbloqueio do cartão e sistema">Desbloqueio do cartão e sistema</MenuItem>
                </Select>
              }
              id="Process"
              name="PROCESSO"
              defaultValue="Desbloqueio do cartão e sistema"
              rules={{ required: "Campo obrigatório" }}
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
              fullWidth
              type="text" name="BENEFICIARIO_NOME"
              label="Viajante: Nome" variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_NOME?true:false}
              helperText={errors.BENEFICIARIO_NOME && errors.BENEFICIARIO_NOME.message}
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
            <InputLabel> {"Anexo: Comprovantes da regularização das pendências"} </InputLabel>
            <br/>
            <input type="file" multiple onChange={e => blob(e)}/>
          </Grid>

          <Grid xs={12} sm={12} md={12} lg={12} xl={12} item justify="flex-end" alignItems="flex-end">
            <Button type="submit"
            variant="contained" color="primary" style={{float:'right'}}> Enviar </Button>
          </Grid>
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
