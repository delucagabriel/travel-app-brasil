import * as React from 'react';
import { TextField, Select, MenuItem, FormLabel, Grid, Button, Input, Paper, Typography, Snackbar, makeStyles, Theme, createStyles, Backdrop, CircularProgress } from '@material-ui/core';
import { useState, useContext, useRef } from 'react';
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
import { IList } from '@pnp/sp/lists';
import { sp } from '@pnp/sp';
import { IAttachmentFileInfo } from '@pnp/sp/attachments';
import { yup_pt_br } from '../../../Utils/yup_pt_br';
import { setLocale } from 'yup';

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

  BENEFICIARIO_ID: yup.string(),
  BENEFICIARIO_NOME: yup.string().required(),
  VALOR: yup.number()
    .positive()
    .required('Preenchimento obrigatório')
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

export default function EmployeeRefund() {
  const classes = useStyles();
  const [openBackdrop, setOpenBackdrop] = useState(false);

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
  const [fileInfos, setFileInfos] = useState<IAttachmentFileInfo[]>([]);

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
        <Typography variant='h6'>
          Para pagamento de reembolso de empregados desligados, é necessário seguir o fluxo abaixo:
        </Typography>
        <Typography variant='body2'>
          1- O empregado desligado entrega ao último gestor os recibos para comprovação dos gastos;<br/>
          2- Os gestores (pai e avô) validam os recibos e os valores para que o empregado seja reembolsado ou descontado;<br/>
          3- O gestor preenche o formulário a seguir informando o valor apurado e aprovado para a validação da área de viagens;<br/>
          4- Após resposta do chamado, o gestor encaminha para a BP/RH, que atende a sua área,  o valor que deverá ser reembolsado;<br/>
          6- A BP/RH encaminha para o Núcleo RH/GE o e-mail do gestor contendo o valor para realização do cálculo da rescisão complementar.
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
                  <MenuItem value="Pagamento de reembolso (Empregado desligado)">{'Pagamento de reembolso (Empregado desligado)'}</MenuItem>
                </Select>
              }
              id="Process"
              name="PROCESSO"
              defaultValue="Pagamento de reembolso (Empregado desligado)"
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
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_EMAIL?true:false}
              helperText={errors.BENEFICIARIO_EMAIL && errors.BENEFICIARIO_EMAIL.message}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField fullWidth type="text" name="BENEFICIARIO_NOME"
              label="Empregado: Nome" variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_NOME?true:false}
              helperText={errors.BENEFICIARIO_NOME && errors.BENEFICIARIO_NOME.message}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField type="number" name="VALOR" label="Valor do reembolso"
              variant="outlined" inputProps={{ min: 1 }}
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.VALOR?true:false}
              helperText={errors.VALOR && errors.VALOR.message}

            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
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
