import * as React from 'react';
import { TextField, Select, MenuItem, Input, Button, Grid, InputLabel, Paper } from '@material-ui/core';
import { useContext } from 'react';
import { useForm, Controller } from "react-hook-form";
import { updateRequest } from '../services/RequestServices';
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";
import { Context } from '../Utils/Context';

interface IFormInputs {
  Id:number;
  ServiceStatus:string;
  AttendedAt: Date;
  ServiceNotes:string;
}

const schema = yup.object().shape({
  Id:yup.number()
  .integer()
  .positive()
  .required(),
  ServiceStatus:yup.string().required(),
  AttendedAt: yup.date().required(),
  ServiceNotes:yup.string().required()
});

export default function ServiceApproval({request, callbackParent}) {
  const { register, handleSubmit, control, errors } = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  });

  const { updateContext } = useContext(Context);

  const onSubmit = (data:IFormInputs) => {
    updateRequest(data)
      .then(res => {
        callbackParent({dialogOpen:false, snack:{open:true, message: 'Service successfully attended', severity:"success"}});
        updateContext();
      })
      .catch(error => {
        callbackParent({dialogOpen:false, snack:{open:true, message: "Request failed", severity:"error"}});
      });
  };
  return (
    <Paper style={{padding:'15px'}} variant='outlined' square={true}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} >
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <InputLabel id="ServiceStatusLabel">Service Conclusion</InputLabel>
            <Controller
              as={
                <Select fullWidth>
                  <MenuItem value="Attended">Accept</MenuItem>
                  <MenuItem value="Rejected">Reject</MenuItem>
                </Select>
              }
              labelId='ServiceStatusLabel'
              name="ServiceStatus"
              control={control}
              error={errors.ServiceStatus?true:false}
              helperText={errors.ServiceStatus && errors.ServiceStatus.message}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField fullWidth type="text" required name="ServiceNotes" variant="outlined"
              label="Service notes"
              inputRef={register}
              error={errors.ServiceNotes?true:false}
              helperText={errors.ServiceNotes && errors.ServiceNotes.message}
              rows={4}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Button type="submit" variant="contained" color="primary" style={{float:'right'}}> Submit </Button>
          </Grid>
        </Grid>
        <Input inputRef={register} readOnly type="hidden" id="AttendedAt" name="AttendedAt" value={new Date() } />
        <Input inputRef={register} readOnly type="hidden" id="Id" name="Id" value={request && request.Id } />
      </form>
    </Paper>
  );
}
