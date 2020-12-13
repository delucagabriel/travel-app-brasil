import * as React from 'react';
import { useContext } from 'react';
import { TextField, Select, MenuItem, Input, Button, Grid, InputLabel, Paper } from '@material-ui/core';
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers';
import { Context } from '../Context';
import { updateRequest } from '../../services/RequestServices';
import { yup_pt_br } from '../../Utils/yup_pt_br';
import { setLocale } from 'yup';
import { IRequest_RequestApproval } from '../../Interfaces/Requests/IRequest_RequestApproval';

setLocale(yup_pt_br);

const schema = yup.object().shape({
  Id:yup.number()
  .integer()
  .positive()
  .required(),
  STATUS_APROVACAO:yup.string().required(),
  DATA_DE_APROVACAO: yup.date().default(new Date()),
  APROVACAO_COMENTARIOS:yup.string(),
  APROVADOR_ID: yup.string().required(),
  APROVADOR_NOME: yup.string().required(),
  APROVADOR_EMAIL: yup.string().required(),
  APROVADOR_LEVEL: yup.string().required(),
  APROVADOR_EMPRESA_COD: yup.string().required(),
  APROVADOR_EMPRESA_NOME: yup.string().required(),
});

export default function RequestApproval({request, callbackParent}) {
  const { register, handleSubmit, control, errors } = useForm<IRequest_RequestApproval>({
    resolver: yupResolver(schema)
  });
  console.log(errors);

  const { updateContext, employeeInfos } = useContext(Context);

  const onSubmit = (data:IRequest_RequestApproval) => {
    updateRequest(data)
      .then(() => {
        callbackParent({dialogOpen:false, snack:{open:true, message: 'Solicitação aprovada com sucesso', severity:"success"}});
        updateContext();
      })
      .catch(() => {
        callbackParent({dialogOpen:false, snack:{open:true, message: "Falha na aprovação", severity:"error"}});
      });
  };
  return (
    <Paper style={{padding:'15px'}} variant='outlined' square={true}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container justify="space-between" spacing={2} >
          <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
            <InputLabel id="ServiceStatusLabel">Aprovação da solicitação</InputLabel>
            <Controller
              as={
                <Select fullWidth>
                  <MenuItem value="Aprovado">Aprovar</MenuItem>
                  <MenuItem value="Rejeitado">Rejeitar</MenuItem>
                </Select>
              }
              labelId='ServiceStatusLabel'
              name="STATUS_APROVACAO"
              control={control}
              error={errors.STATUS_APROVACAO?true:false}
              helperText={errors.STATUS_APROVACAO && errors.STATUS_APROVACAO.message}
            />
          </Grid>
          <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
            <TextField fullWidth type="text" name="APROVACAO_COMENTARIOS" variant="outlined"
              label="Observações do aprovador"
              inputRef={register}
              error={errors.APROVACAO_COMENTARIOS?true:false}
              helperText={errors.APROVACAO_COMENTARIOS && errors.APROVACAO_COMENTARIOS.message}
              rows={4}
            />
          </Grid>
          <Grid item xs={12} sm={1} md={1} lg={1} xl={1}>
          <Button type="submit" variant="contained" color="primary"> Enviar </Button>
          </Grid>
        </Grid>
        <Input inputRef={register} readOnly type="hidden" name="Id" value={request && request.Id } />
        <Input inputRef={register} readOnly type="hidden" name="APROVADOR_ID" value={employeeInfos && employeeInfos.IAM_ACCESS_IDENTIFIER } />
        <Input inputRef={register} readOnly type="hidden" name="APROVADOR_NOME" value={employeeInfos && employeeInfos.FULL_NAME } />
        <Input inputRef={register} readOnly type="hidden" name="APROVADOR_EMAIL" value={employeeInfos && employeeInfos.Email } />
        <Input inputRef={register} readOnly type="hidden" name="APROVADOR_LEVEL" value={employeeInfos && employeeInfos.APPROVAL_LEVEL_CODE } />
        <Input inputRef={register} readOnly type="hidden" name="APROVADOR_EMPRESA_COD" value={employeeInfos && employeeInfos.COMPANY_CODE } />
        <Input inputRef={register} readOnly type="hidden" name="APROVADOR_EMPRESA_NOME" value={employeeInfos && employeeInfos.COMPANY_DESC } />
      </form>
    </Paper>
  );
}
