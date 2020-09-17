import * as React from 'react';
import { useContext } from 'react';
import { TextField, Select, MenuItem, Input, Button, Grid, InputLabel, Paper } from '@material-ui/core';
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers';
import { Context } from '../Context';
import { updateRequest } from '../../services/RequestServices';
import { IRequests } from '../../Interfaces/IRequests';

const schema = yup.object().shape({
  Id:yup.number()
  .integer()
  .positive()
  .required(),
  STATUS_ATENDIMENTO:yup.string().required(),
  DATA_DE_ATENDIMENTO: yup.date().default(new Date()),
  ATENDIMENTO_COMENTARIOS:yup.string().required()
});

export default function ServiceApproval({request, callbackParent}) {
  const { register, handleSubmit, control, errors } = useForm<IRequests>({
    resolver: yupResolver(schema)
  });

  const { updateContext } = useContext(Context);

  const onSubmit = (data:IRequests) => {
    updateRequest(data)
      .then(res => {
        callbackParent({dialogOpen:false, snack:{open:true, message: 'Atendimento efetuado com sucesso', severity:"success"}});
        updateContext();
      })
      .catch(error => {
        callbackParent({dialogOpen:false, snack:{open:true, message: "Falha na atualização", severity:"error"}});
      });
  };
  return (
    <Paper style={{padding:'15px'}} variant='outlined' square={true}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} >
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <InputLabel id="ServiceStatusLabel">Conclusão do atendimento</InputLabel>
            <Controller
              as={
                <Select fullWidth>
                  <MenuItem value="Atendido">Concluir</MenuItem>
                  <MenuItem value="Rejeitado">Rejeitar</MenuItem>
                </Select>
              }
              labelId='ServiceStatusLabel'
              name="STATUS_ATENDIMENTO"
              control={control}
              error={errors.STATUS_ATENDIMENTO?true:false}
              helperText={errors.STATUS_ATENDIMENTO && errors.STATUS_ATENDIMENTO.message}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField fullWidth type="text" required name="ATENDIMENTO_COMENTARIOS" variant="outlined"
              label="Service notes"
              inputRef={register}
              error={errors.ATENDIMENTO_COMENTARIOS?true:false}
              helperText={errors.ATENDIMENTO_COMENTARIOS && errors.ATENDIMENTO_COMENTARIOS.message}
              rows={4}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Button type="submit" variant="contained" color="primary" style={{float:'right'}}> Submit </Button>
          </Grid>
        </Grid>
        <Input inputRef={register} readOnly type="hidden" id="Id" name="Id" value={request && request.Id } />
      </form>
    </Paper>
  );
}
