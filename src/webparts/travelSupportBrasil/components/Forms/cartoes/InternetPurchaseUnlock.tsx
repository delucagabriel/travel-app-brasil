import * as React from 'react';
import { TextField, Select, MenuItem, FormLabel, Grid, Button, Input, Paper, Typography, Snackbar } from '@material-ui/core';
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
import { TestaCPF } from '../../../Utils/validaCPF';



const schema: yup.ObjectSchema<IRequests_AllFields> = yup.object().shape({
  MACROPROCESSO: yup.string().required(),
  PROCESSO: yup.string().required(),
  SLA: yup.number().default(48),
  AREA_RESOLVEDORA: yup.string().default("Bradesco"),
  ALCADA_APROVACAO: yup.string().default(""),
  WF_APROVACAO: yup.boolean().default(false),
  DATA_DE_APROVACAO: yup.date().default(new Date()),
  STATUS_APROVACAO: yup.string().default('Aprovado'),

  BENEFICIARIO_ID: yup.string().required(),
  BENEFICIARIO_NOME: yup.string().required(),
  BENEFICIARIO_EMAIL: yup.string().required(),
  BENEFICIARIO_EMPRESA_COD: yup.string().required(),
  BENEFICIARIO_EMPRESA_NOME: yup.string().required(),
  CPF: yup.string().test('validCPF','CPF inválido', (cpf)=>TestaCPF(cpf)).required(),

  VALOR: yup.number()
  .positive()
  .required(),
  COD_DO_RAMO_DE_ATIVIDADE: yup.string()
  .min(2)
  .required(),
  ESTABELECIMENTO: yup.string().min(10).required(),
  DATA_DE_UTILIZACAO: yup.date().required(),
  MOTIVO: yup.string()
  .min(50)
  .required()


});

export default function InternetPurchaseUnlock() {
  const { register, handleSubmit, control, errors, reset } = useForm<IRequests_AllFields>({
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
    .then(emp => setEmployee(emp));


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
        <p>
          Após a conclusão do chamado, o ramo de atividade ficará liberado para compra durante 8 dias corridos ou será bloqueado imediatamente após a transação. Caso você não saiba o código do ramo de atividade, é necessário que seja realizada uma tentativa de despesa no site do fornecedor para que o Banco identifique o ramo pela transação negada.
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
                  <MenuItem value="Cartão corporativo"> Cartão corporativo </MenuItem>
                </Select>
              }
              name="MACROPROCESSO"
              defaultValue="Cartão corporativo"
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
                  <MenuItem value="Liberar compra pela internet">Desbloq. compra online</MenuItem>
                </Select>
              }
              id="Process"
              name="PROCESSO"
              defaultValue="Liberar compra pela internet"
              control={control}
              error={errors.PROCESSO?true:false}
              helperText={errors.PROCESSO && errors.PROCESSO.message}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
            <TextField fullWidth type="text" name="BENEFICIARIO_ID" variant="outlined"
              label="Matrícula do empregado" onBlur={ e=> handleGetEmployee(e.target.value) }
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_ID?true:false}
              helperText={errors.BENEFICIARIO_ID && errors.BENEFICIARIO_ID.message}
            />
          </Grid>
          <Grid item xs={12} sm={5} md={5} lg={5} xl={5} >
            <TextField fullWidth type="text" name="CPF"
              label="Empregado: CPF" variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.CPF?true:false}
              helperText={errors.CPF && errors.CPF.message}
            />
          </Grid>
          <Grid item xs={12} sm={3} md={3} lg={3} xl={3} >
            <TextField fullWidth variant="outlined" type="text" name="ULTIMOS_DIGITOS_DO_CARTAO" label="Últimos 4 dígitos do cartão"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.ULTIMOS_DIGITOS_DO_CARTAO?true:false}
              helperText={errors.ULTIMOS_DIGITOS_DO_CARTAO && errors.ULTIMOS_DIGITOS_DO_CARTAO.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField disabled fullWidth type="text" name="BENEFICIARIO_NOME" label="Nome do empregado" variant="outlined"
              value={employee? employee.FULL_NAME: ""}
              inputRef={register}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_NOME?true:false}
              helperText={errors.BENEFICIARIO_NOME && errors.BENEFICIARIO_NOME.message}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField disabled fullWidth type="text" name="BENEFICIARIO_EMAIL" label="E-mail do empregado"
              variant="outlined"  value={employee ? employee.WORK_EMAIL_ADDRESS : "" }
              inputRef={register}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_EMAIL?true:false}
              helperText={errors.BENEFICIARIO_EMAIL && errors.BENEFICIARIO_EMAIL.message}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField fullWidth variant="outlined" type="number" name="VALOR" label="Valor da transação" inputRef={register}
              error={errors.VALOR?true:false}
              helperText={errors.VALOR && errors.VALOR.message}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
            <TextField fullWidth variant="outlined" type="text" name="COD_DO_RAMO_DE_ATIVIDADE" label="Cód. ramo de atividade" inputRef={register}
              error={errors.COD_DO_RAMO_DE_ATIVIDADE?true:false}
              helperText={errors.COD_DO_RAMO_DE_ATIVIDADE && errors.COD_DO_RAMO_DE_ATIVIDADE.message}
            />
          </Grid>

          <Grid item xs={12} sm={5} md={5} lg={5} xl={5} >
            <TextField fullWidth
              variant="outlined"
              type="date"
              name="DATA_DE_UTILIZACAO" label="Data de utilização"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.DATA_DE_UTILIZACAO?true:false}
              helperText={errors.DATA_DE_UTILIZACAO && errors.DATA_DE_UTILIZACAO.message}
            />
          </Grid>
          <Grid item xs={12} sm={7} md={7} lg={7} xl={7} >
            <TextField fullWidth variant="outlined" type="text" name="ESTABELECIMENTO" label="Estabelecimento" inputRef={register}
              error={errors.ESTABELECIMENTO?true:false}
              helperText={errors.ESTABELECIMENTO && errors.ESTABELECIMENTO.message}
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
