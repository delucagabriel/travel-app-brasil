import * as React from 'react';
import { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";
import cep from 'cep-promise';
import { TextField, Select, MenuItem, FormLabel, Button,
  Grid, Input, Paper, Snackbar, Backdrop, Typography, CircularProgress, makeStyles, Theme, createStyles, InputLabel } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Context } from '../../Context';
import { getEmployee } from '../../../services/EmployeesService';
import { newRequest } from '../../../services/RequestServices';
import { IEmployee } from '../../../Interfaces/IEmployee';
import { ISnack } from '../../../Interfaces/ISnack';
import { IRequests_AllFields } from '../../../Interfaces/Requests/IRequests';
import { cnpjValidation } from '../../../Utils/validaCNPJ';
import { IAttachmentFileInfo } from '@pnp/sp/attachments';
import { sp } from '@pnp/sp';
import { yup_pt_br } from '../../../Utils/yup_pt_br';
import { setLocale } from 'yup';

setLocale(yup_pt_br);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

const schema: yup.ObjectSchema<IRequests_AllFields> = yup.object().shape({
  MACROPROCESSO: yup.string().required(),
  PROCESSO: yup.string().required(),
  ALCADA_APROVACAO: yup.string().default("D-3"),
  SLA: yup.number().default(48),
  AREA_RESOLVEDORA: yup.string().default("Viagens Corporativas"),
  WF_APROVACAO: yup.boolean().default(true),

  RESP_MEDICAO_ID: yup.string().required(),
  RESP_MEDICAO_NOME: yup.string().required(),
  RESP_MEDICAO_EMAIL: yup.string().required(),
  RESP_MEDICAO_EMPRESA_COD: yup.string().required(),
  RESP_MEDICAO_EMPRESA_NOME: yup.string().required(),

  GESTOR_DA_BASE_ID: yup.string().required(),
  GESTOR_DA_BASE_NOME: yup.string().required(),
  GESTOR_DA_BASE_EMPRESA_NOME: yup.string().required(),
  GESTOR_DA_BASE_EMPRESA_COD: yup.string().required(),
  GESTOR_DA_BASE_EMAIL: yup.string().email().notRequired(),

  APROVADOR_ID: yup.string().required(),
  APROVADOR_NOME: yup.string().required(),
  APROVADOR_EMAIL: yup.string().email().required(),
  APROVADOR_EMPRESA_COD: yup.string().required(),
  APROVADOR_EMPRESA_NOME: yup.string().required(),
  APROVADOR_LEVEL: yup.string()
  .when('ALCADA_APROVACAO', (ALCADA_APROVACAO, sch) => {
    if(ALCADA_APROVACAO === 'D-3') return sch.oneOf(['D-3', 'D-2', 'D-1', 'DE']);
    if(ALCADA_APROVACAO === 'D-2') return sch.oneOf(['D-2', 'D-1', 'DE']);
    if(ALCADA_APROVACAO === 'D-1') return sch.oneOf(['D-1', 'DE']);
    })
  .required(),

  CNPJ_DE_FATURAMENTO: yup.string().test('validaCNPJ','CNPJ inválido',(cnpj)=>cnpjValidation(cnpj)).required(),
  CENTRO_DE_CUSTOS: yup.string().required(),

  END_CEP: yup.string().required(),
  END_LOGRADOURO: yup.string().required(),
  END_NUMERO: yup.number().required(),
  END_COMPLEMENTO: yup.string().required(),

  QUANTIDADE_DE_CARTOES: yup.number().required(),
  NOVO_LIMITE: yup.number().required(),
  MOTIVO: yup.string().required(),
});

interface IAddress {
    cep: string;
    state:  string;
    city:  string;
    street:  string;
    neighborhood: string;
}

export default function BaseCreation(){
  const classes = useStyles();
  const { register, handleSubmit, control, errors, setValue } = useForm<IRequests_AllFields>({
    resolver: yupResolver(schema)
  });
  const [gestorDaBase, setGestorDaBase] = useState<IEmployee>();
  const [respMedicao, setRespMedicao] = useState<IEmployee>();
  const [approver, setApprover] = useState<IEmployee>();
  const [address, setAddress] = useState<IAddress>();
  const [snackMessage, setSnackMessage] = useState<ISnack>({
    open: false,
    message: "",
    severity:'info'
  });
  const { updateContext } = useContext(Context);
  const [fileInfos, setFileInfos] = useState<IAttachmentFileInfo[]>([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [noAttachmentError, setNoAttachmentError] = useState(false);


  const handleGetAddress = value => {
    cep(value).then(res => setAddress(res));
  };

  const handleGetGestorDaBase = value => getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
  .then(emp => {
    setGestorDaBase(emp);
    setValue("GESTOR_DA_BASE_ID", emp?emp.IAM_ACCESS_IDENTIFIER:"", {
      shouldDirty: true
    });
    setValue("GESTOR_DA_BASE_NOME", emp?emp.FULL_NAME:"", {
      shouldDirty: true
    });
    setValue("GESTOR_DA_BASE_EMAIL", emp?emp.WORK_EMAIL_ADDRESS:"", {
      shouldDirty: true
    });
    setValue("GESTOR_DA_BASE_EMPRESA_NOME", emp?emp.COMPANY_DESC:"", {
      shouldDirty: true
    });
    setValue("CENTRO_DE_CUSTOS", emp?emp.COST_CENTER_CODE:"", {
      shouldDirty: true
    });
  });

  const handleGetGestorDaBaseByEmail = value => getEmployee("WORK_EMAIL_ADDRESS", value.toLowerCase())
  .then(emp => {
    setGestorDaBase(emp);
    setValue("GESTOR_DA_BASE_ID", emp?emp.IAM_ACCESS_IDENTIFIER:"", {
      shouldDirty: true
    });
    setValue("GESTOR_DA_BASE_NOME", emp?emp.FULL_NAME:"", {
      shouldDirty: true
    });
    setValue("GESTOR_DA_BASE_EMAIL", emp?emp.WORK_EMAIL_ADDRESS:"", {
      shouldDirty: true
    });
    setValue("GESTOR_DA_BASE_EMPRESA_NOME", emp?emp.COMPANY_DESC:"", {
      shouldDirty: true
    });
    setValue("CENTRO_DE_CUSTOS", emp?emp.COST_CENTER_CODE:"", {
      shouldDirty: true
    });
  });

  const handleGetRespMedicao = value => getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
  .then(emp => {
    setRespMedicao(emp);
    setValue("RESP_MEDICAO_ID", emp?emp.IAM_ACCESS_IDENTIFIER:"", {
      shouldDirty: true
    });
    setValue("RESP_MEDICAO_NOME", emp?emp.FULL_NAME:"", {
      shouldDirty: true
    });
    setValue("RESP_MEDICAO_EMAIL", emp?emp.WORK_EMAIL_ADDRESS:"", {
      shouldDirty: true
    });
    setValue("RESP_MEDICAO_EMPRESA_NOME", emp?emp.COMPANY_DESC:"", {
      shouldDirty: true
    });
  });

  const handleGetRespMedicaoByEmail = value => getEmployee("WORK_EMAIL_ADDRESS", value.toLowerCase())
  .then(emp => {
    setRespMedicao(emp);
    setValue("RESP_MEDICAO_ID", emp?emp.IAM_ACCESS_IDENTIFIER:"", {
      shouldDirty: true
    });
    setValue("RESP_MEDICAO_NOME", emp?emp.FULL_NAME:"", {
      shouldDirty: true
    });
    setValue("RESP_MEDICAO_EMAIL", emp?emp.WORK_EMAIL_ADDRESS:"", {
      shouldDirty: true
    });
    setValue("RESP_MEDICAO_EMPRESA_NOME", emp?emp.COMPANY_DESC:"", {
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
    if(fileInfos.length > 0){
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
      setNoAttachmentError(false);
    }
    else {
      setNoAttachmentError(true);
    }
  };
console.log(errors);

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
      <div style={{padding:"20px"}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} justify="space-between">
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <FormLabel id="Macroprocess" component="legend">Macroprocesso</FormLabel>
              <Controller
                as={
                  <Select disabled fullWidth>
                    <MenuItem value="Cartão combustível"> Cartão combustível </MenuItem>
                  </Select>
                }
                name="MACROPROCESSO"
                defaultValue="Cartão combustível"
                control={control}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <FormLabel id="Process" component="legend">Processo</FormLabel>
              <Controller
                as={
                  <Select disabled fullWidth>
                    <MenuItem value="Criação de base para emissão do cartão">Criação de base para emissão do cartão</MenuItem>
                  </Select>
                }
                id="Process"
                name="PROCESSO"
                defaultValue="Criação de base para emissão do cartão"
                control={control}
              />
            </Grid>


            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
              <TextField
                variant="outlined"
                type="search"
                name="GESTOR_DA_BASE_ID"
                label="Gestor da base: Matrícula"
                onBlur={ e=> handleGetGestorDaBase(e.target.value) }
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.GESTOR_DA_BASE_ID?true:false}
                helperText={errors.GESTOR_DA_BASE_ID && errors.GESTOR_DA_BASE_ID.message}
              />
            </Grid>

            <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
              <TextField fullWidth type="text" name="GESTOR_DA_BASE_EMAIL" label="Gestor da base: e-mail" variant="outlined"
                onBlur={ e=> handleGetGestorDaBaseByEmail(e.target.value) }
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.GESTOR_DA_BASE_EMAIL?true:false}
                helperText={errors.GESTOR_DA_BASE_EMAIL && errors.GESTOR_DA_BASE_EMAIL.message}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
              <TextField disabled fullWidth type="text" name="GESTOR_DA_BASE_NOME"
                label="Gestor da base: Nome" variant="outlined"
                value={gestorDaBase? gestorDaBase.FULL_NAME : ""}
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.GESTOR_DA_BASE_NOME?true:false}
                helperText={errors.GESTOR_DA_BASE_NOME && errors.GESTOR_DA_BASE_NOME.message}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
              <TextField
                variant="outlined"
                type="search"
                name="RESP_MEDICAO_ID"
                label="Responsável pela medição: Matrícula"
                onBlur={ e=> handleGetRespMedicao(e.target.value) }
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.RESP_MEDICAO_ID?true:false}
                helperText={errors.RESP_MEDICAO_ID && errors.RESP_MEDICAO_ID.message}
              />
            </Grid>

            <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
              <TextField
                fullWidth
                type="text"
                name="RESP_MEDICAO_EMAIL"
                label="Responsável pela medição: e-mail"
                variant="outlined"
                onBlur={ e=> handleGetRespMedicaoByEmail(e.target.value) }
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.RESP_MEDICAO_EMAIL?true:false}
                helperText={errors.RESP_MEDICAO_EMAIL && errors.RESP_MEDICAO_EMAIL.message}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
              <TextField
                disabled
                fullWidth
                type="text"
                name="RESP_MEDICAO_NOME"
                label="Responsável pela medição: Nome"
                variant="outlined"
                value={respMedicao? respMedicao.FULL_NAME : ""}
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.RESP_MEDICAO_NOME?true:false}
                helperText={errors.RESP_MEDICAO_NOME && errors.RESP_MEDICAO_NOME.message}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
              <TextField
                type="text"
                name="CNPJ_DE_FATURAMENTO"
                label="CNPJ de faturamento"
                variant="outlined"
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.CNPJ_DE_FATURAMENTO?true:false}
                helperText={errors.CNPJ_DE_FATURAMENTO && errors.CNPJ_DE_FATURAMENTO.message}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
              <TextField
                fullWidth
                type="number"
                name="NOVO_LIMITE"
                label="Limite mensal de utilização (Média em R$)"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                inputRef={register}
                inputProps={{ min: 1 }}
                error={errors.NOVO_LIMITE?true:false}
                helperText={errors.NOVO_LIMITE && errors.NOVO_LIMITE.message}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
              <TextField
                fullWidth
                type="number"
                name="QUANTIDADE_DE_CARTOES"
                InputLabelProps={{ shrink: true }}
                label="Quantidade de cartões"
                variant="outlined"
                inputRef={register}
                inputProps={{ min: 1 }}
                error={errors.QUANTIDADE_DE_CARTOES?true:false}
                helperText={errors.QUANTIDADE_DE_CARTOES && errors.QUANTIDADE_DE_CARTOES.message}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
              <TextField fullWidth type="text" name="END_CEP"
                label="CEP" variant="outlined"
                inputRef={register}
                onBlur={e => handleGetAddress(e.target.value)}
                error={errors.END_CEP?true:false}
                helperText={errors.END_CEP && errors.END_CEP.message}
              />
            </Grid>
            <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
              <TextField disabled fullWidth type="text" name="END_LOGRADOURO"
                label="Endereço de entrega na Vale" variant="outlined"
                value={address? `${address.street}, ${address.neighborhood}, ${address.city} - ${address.state}` : ""}
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                error={errors.END_LOGRADOURO?true:false}
                helperText={errors.END_LOGRADOURO && errors.END_LOGRADOURO.message}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
              <TextField fullWidth type="number" name="END_NUMERO"
                label="Número" variant="outlined" inputProps={{ min: 1 }}
                inputRef={register}
                error={errors.END_NUMERO?true:false}
                helperText={errors.END_NUMERO && errors.END_NUMERO.message}
              />
            </Grid>
            <Grid item xs={12} sm={8} md={8} lg={8} xl={8} >
              <TextField fullWidth type="text" name="END_COMPLEMENTO"
                label="Complemento e Recebedor" variant="outlined"
                inputRef={register}
                error={errors.END_COMPLEMENTO?true:false}
                helperText={errors.END_COMPLEMENTO && errors.END_COMPLEMENTO.message}
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
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                multiline
                rows={5}
                name="MOTIVO"
                label="Justificativa para criação da base e qual área operacional será atendida"
                inputRef={register}
                error={errors.MOTIVO?true:false}
                helperText={errors.MOTIVO && errors.MOTIVO.message}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
              <InputLabel> Anexo dos dados cadastrais para abertura do código </InputLabel>
              <input type="file" multiple onChange={e => blob(e)}/>
              {noAttachmentError && <InputLabel error={true}> Insira os documentos necessários </InputLabel> }
            </Grid>
            <Grid xs={12} sm={12} md={12} lg={12} xl={12} item justify="flex-end" alignItems="flex-end">
              <Button type="submit" style={{float:'right'}}
              variant="contained" color="primary"> Enviar </Button>
            </Grid>

          </Grid >

          <Input inputRef={register} readOnly type="hidden" name="GESTOR_DA_BASE_EMPRESA_COD" value={gestorDaBase && gestorDaBase.COMPANY_CODE } />
          <Input inputRef={register} readOnly type="hidden" name="GESTOR_DA_BASE_EMPRESA_NOME" value={gestorDaBase && gestorDaBase.COMPANY_DESC } />

          <Input inputRef={register} readOnly type="hidden" name="CENTRO_DE_CUSTOS" value={gestorDaBase && gestorDaBase.COST_CENTER_CODE } />

          <Input inputRef={register} readOnly type="hidden" name="RESP_MEDICAO_EMPRESA_COD" value={respMedicao && respMedicao.COMPANY_CODE } />
          <Input inputRef={register} readOnly type="hidden" name="RESP_MEDICAO_EMPRESA_NOME" value={respMedicao && respMedicao.COMPANY_DESC } />

          <Input inputRef={register} readOnly type="hidden" id="APROVADOR_EMPRESA_COD" name="APROVADOR_EMPRESA_COD" value={approver && approver.COMPANY_CODE } />
          <Input inputRef={register} readOnly type="hidden" id="APROVADOR_EMPRESA_NOME" name="APROVADOR_EMPRESA_NOME" value={approver && approver.COMPANY_DESC } />
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
