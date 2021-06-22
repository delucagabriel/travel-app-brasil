import * as React from 'react';
import { useContext } from 'react';
import { Input, IconButton } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers';
import { Context } from '../Context';
import { updateRequest } from '../../services/RequestServices';
import { yup_pt_br } from '../../Utils/yup_pt_br';
import { setLocale } from 'yup';
import { IRequests_AllFields } from '../../Interfaces/Requests/IRequests';

setLocale(yup_pt_br);


const schema = yup.object().shape({
  Id:yup.number()
  .integer()
  .positive()
  .required(),
  STATUS_ATENDIMENTO:yup.string().required(),
  STATUS_APROVACAO:yup.string().required(),
});

export default function CancelRequest({request, callbackParent}) {
  const { register, handleSubmit, errors } = useForm<IRequests_AllFields>({
    resolver: yupResolver(schema)
  });
  
  const { updateContext } = useContext(Context);
 
  const onSubmit = (data:IRequests_AllFields, e) => {
    updateRequest(data)
      .then(result => {
        return result;
      })
      .then(() => {
        callbackParent({dialogOpen:false, snack:{open:true, message: 'Solicitação cancelada com sucesso', severity:"success"}});
        updateContext();
      })
      .catch(error => {
        callbackParent({dialogOpen:false, snack:{open:true, message: "Falha ao cancelar", severity:"error"}});
      });
  };
 
  console.log(errors);

  return (
      <div style={{display:"inline"}} title="Cancelar solicitação">
        <form onSubmit={handleSubmit(onSubmit)} style={{display:"inline"}}>
            <Input inputRef={register} readOnly type="hidden" id="Id" name="Id" value={request && request.Id } />
            <Input inputRef={register} readOnly type="hidden" name="STATUS_APROVACAO" value="Cancelado" />
            <Input inputRef={register} readOnly type="hidden" name="STATUS_ATENDIMENTO" value="Cancelado" />
            <IconButton color="default" type="submit"> <DeleteForeverIcon /> </IconButton>
        </form>
      </div>
    );
}