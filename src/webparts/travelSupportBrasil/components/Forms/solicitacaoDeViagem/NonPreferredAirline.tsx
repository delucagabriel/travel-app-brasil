import * as React from 'react';
import { TextField, Select, MenuItem, FormLabel, Grid,
  Button, Input, Paper, Snackbar, makeStyles, Theme, createStyles, InputLabel, Backdrop, Typography, CircularProgress } from '@material-ui/core';
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

  BENEFICIARIO_ID: yup.string(),
  BENEFICIARIO_NOME: yup.string().required(),
  BENEFICIARIO_EMAIL: yup.string().email().required(),
  BENEFICIARIO_EMPRESA_COD: yup.string(),
  BENEFICIARIO_EMPRESA_NOME: yup.string(),
  BENEFICIARIO_LEVEL: yup.string(),

  OS_AGENCIA: yup.string(),
  HORARIO: yup.string(),
  VALOR: yup.number(),
  DATA_DE_UTILIZACAO: yup.date().required(),

  MOTIVO: yup.string().required(),
  VIAGEM_ORIGEM: yup.string()
    .required('Origem é obrigatório'),
  VIAGEM_DESTINO: yup.string()
    .when('VIAGEM_ORIGEM', (VIAGEM_ORIGEM, schm)=>
      VIAGEM_ORIGEM && ['carajás', 'carajas', 'cks'].indexOf(VIAGEM_ORIGEM.toLowerCase()) < 0
      ? schm.matches(/carajás|carajas|Carajás|Carajas|CARAJÁS|CARAJAS|cks|CKS/, 'Origem ou Destino deve ser Carajás')
      : schm
    )
    .required('Destino é obrigatório'),
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

export default function NonPreferredAirline() {
  const { register, handleSubmit, control, errors, setValue } = useForm<IRequests_AllFields>({
    resolver: yupResolver(schema)
  });
  const [approver, setApprover] = useState<IEmployee>();
  const [employee, setEmployee] = useState<IEmployee>();
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
          A GOL é a única opção de voo comercial para Carajás negociada pela equipe de Suprimentos, além do Aerovale, que dever ser sempre a primeira escolha do empregado.
          <br/>As demais empresas aéreas poderão ser solicitadas apenas quando a Gol estiver indisponível. <br/>Precisamos como empresa aderir a este modelo de exclusividade nesta rota, pois o mesmo gera ganhos corporativos dentre eles a manutenção do voo com a GOL nesta localidade.
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
                  <MenuItem value="Cia aérea não preferencial">Cia aérea não preferencial</MenuItem>
                </Select>
              }
              id="Process"
              name="PROCESSO"
              defaultValue="Cia aérea não preferencial"
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
            <TextField disabled fullWidth type="text" name="BENEFICIARIO_NOME"
              label="Empregado: Nome" variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_NOME?true:false}
              helperText={errors.BENEFICIARIO_NOME && errors.BENEFICIARIO_NOME.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField
              type="text"
              name="OS_AGENCIA"
              variant="outlined"
              label="Nº do voo"
              InputLabelProps={{ shrink: true }}
              error={errors.OS_AGENCIA?true:false}
              helperText={errors.OS_AGENCIA && errors.OS_AGENCIA.message}
              inputRef={register}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField
              fullWidth
              type="date"
              name="DATA_DE_UTILIZACAO"
              variant="outlined"
              label="Data de embarque"
              InputLabelProps={{ shrink: true }}
              error={errors.DATA_DE_UTILIZACAO?true:false}
              helperText={errors.DATA_DE_UTILIZACAO && errors.DATA_DE_UTILIZACAO.message}
              inputRef={register}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField
              fullWidth
              type="time"
              name="HORARIO"
              variant="outlined"
              label="Horário"
              InputLabelProps={{ shrink: true }}
              error={errors.HORARIO?true:false}
              helperText={errors.HORARIO && errors.HORARIO.message}
              inputRef={register}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField
              fullWidth
              type="number"
              name="VALOR"
              variant="outlined"
              label="Valor da passagem"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: 1 }}
              error={errors.VALOR?true:false}
              helperText={errors.VALOR && errors.VALOR.message}
              inputRef={register}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField
              fullWidth
              type="text"
              name="VIAGEM_ORIGEM"
              variant="outlined"
              label="Origem"
              InputLabelProps={{ shrink: true }}
              error={errors.VIAGEM_ORIGEM?true:false}
              helperText={errors.VIAGEM_ORIGEM && errors.VIAGEM_ORIGEM.message}
              inputRef={register}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField
              fullWidth
              type="text"
              name="VIAGEM_DESTINO"
              variant="outlined"
              label="Destino"
              InputLabelProps={{ shrink: true }}
              error={errors.VIAGEM_DESTINO?true:false}
              helperText={errors.VIAGEM_DESTINO && errors.VIAGEM_DESTINO.message}
              inputRef={register}
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

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TextField
              fullWidth
              variant="outlined"
              type="text"
              multiline rows={4}
              name="MOTIVO"
              label="Justifique sua solicitação com o máximo de informações possíveis"
              inputRef={register}
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{float:'right'}}> Enviar </Button>
          </Grid>

          <Input inputRef={register} readOnly type="hidden" name="BENEFICIARIO_EMPRESA_COD"
            value={employee && employee.COMPANY_CODE }
          />
          <Input inputRef={register} readOnly type="hidden" name="BENEFICIARIO_EMPRESA_NOME"
            value={employee && employee.COMPANY_DESC } />

          <Input inputRef={register} readOnly type="hidden" name="BENEFICIARIO_LEVEL"
            value={employee && employee.APPROVAL_LEVEL_CODE } />

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
