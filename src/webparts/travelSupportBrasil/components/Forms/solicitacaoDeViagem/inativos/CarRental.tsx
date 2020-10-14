// import * as React from 'react';
// import { TextField, Select, MenuItem, FormLabel, Grid, Button, Input, Paper, Typography, Snackbar, FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
// import { useState, useContext } from 'react';
// import { useForm, Controller } from "react-hook-form";
// import { Alert } from '@material-ui/lab';
// import * as yup from "yup";
// import { yupResolver } from '@hookform/resolvers';
// import { getEmployee } from '../../../services/EmployeesService';
// import { newRequest } from '../../../services/RequestServices';
// import { IEmployee } from '../../../Interfaces/IEmployee';
// import { IRequests_AllFields } from '../../../Interfaces/Requests/IRequests';
// import { ISnack } from '../../../Interfaces/ISnack';
// import { Context } from '../../Context';
// import HocDialog from '../../HOC/HocDialog';



// const schema: yup.ObjectSchema<IRequests_AllFields> = yup.object().shape({
//   MACROPROCESSO: yup.string().required(),
//   PROCESSO: yup.string().required(),
//   SLA: yup.number().default(24),
//   AREA_RESOLVEDORA: yup.string().default("Viagens Corporativas"),
//   ALCADA_APROVACAO: yup.string().default(""),
//   WF_APROVACAO: yup.boolean().default(false),
//   DATA_DE_APROVACAO: yup.date().default(new Date()),
//   STATUS_APROVACAO: yup.string().default('Aprovado'),

//   BENEFICIARIO_ID: yup.string().required(),
//   BENEFICIARIO_NOME: yup.string().required(),
//   BENEFICIARIO_EMAIL: yup.string().email().matches(/@vale|@itv|@ctss|@newsteel/).required(),
//   BENEFICIARIO_EMPRESA_COD: yup.string(),
//   BENEFICIARIO_EMPRESA_NOME: yup.string(),

//   MOTIVO: yup.string()
//   .min(50)
//   .required()
// });

// export default function CarRental() {
//   const { register, handleSubmit, control, errors, reset, setValue } = useForm<IRequests_AllFields>({
//     resolver: yupResolver(schema)
//   });
//   const [employee, setEmployee] = useState<IEmployee>();
//   const [snackMessage, setSnackMessage] = useState<ISnack>({
//     open: false,
//     message: "",
//     severity:'info'
//   });
//   const { updateContext } = useContext(Context);

//   console.log(errors);

//   const handleGetEmployee = value =>getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
//     .then(emp => {
//       setEmployee(emp);
//       setValue("BENEFICIARIO_NOME", emp?emp.FULL_NAME:"", {
//         shouldDirty: true
//       });
//       setValue("BENEFICIARIO_EMAIL", emp?emp.WORK_EMAIL_ADDRESS:"", {
//         shouldDirty: true
//       });
//     });

//   const onSubmit = (data:IRequests_AllFields, e) => {
//     newRequest(data)
//       .then(res => {
//         setSnackMessage({open:true, message: `Solicitação gravada com suceso! ID:${res.data.ID}`, severity:"success"});
//         updateContext();
//       })
//       .catch(error => {
//         setSnackMessage({open:true, message: "Falha ao tentar gravar a solicitação", severity:"error"});
//         console.log(error);
//       });
//     e.target.reset();
//   };

//   return (
//     <Paper>
//       <HocDialog>
//         <p>
//           O pagamento dos serviços prestados pelas locadoras é efetuado diretamente pelo empregado, em um cartão de crédito, no momento da entrega do veículo.<br/>
//           É obrigatória a contratação do seguro na locadora com cobertura para danos causados ao carro alugado e terceiros. <br/>
//           O empregado deve ter ciência das regras estabelecidas no contrato de locação. Em caso de cobrança indevida, acione a locadora contratada.
//         </p>
//       </HocDialog>
//       <div style={{padding:"20px"}}>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Grid container spacing={3} justify="space-between">
//           <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
//             <FormLabel id="Macroprocesso" component="legend">Macroprocesso</FormLabel>
//             <Controller
//               as={
//                 <Select disabled fullWidth>
//                   <MenuItem value="Solicitação de viagem"> Solicitação de viagem </MenuItem>
//                 </Select>
//               }
//               name="MACROPROCESSO"
//               defaultValue="Solicitação de viagem"
//               control={control}
//               error={errors.MACROPROCESSO?true:false}
//               helperText={errors.MACROPROCESSO && errors.MACROPROCESSO.message}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
//             <FormLabel id="PROCESSO" component="legend">Processo</FormLabel>
//             <Controller
//               as={
//                 <Select disabled fullWidth>
//                   <MenuItem value="Locação de veículo">Locação de veículo</MenuItem>
//                 </Select>
//               }
//               id="Process"
//               name="PROCESSO"
//               defaultValue="Locação de veículo"
//               control={control}
//               error={errors.PROCESSO?true:false}
//               helperText={errors.PROCESSO && errors.PROCESSO.message}
//             />
//           </Grid>

//           <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
//             <TextField type="text" name="BENEFICIARIO_ID" variant="outlined"
//               label="Matrícula" onBlur={ e=> handleGetEmployee(e.target.value) }
//               inputRef={register}
//               error={errors.BENEFICIARIO_ID?true:false}
//               helperText={errors.BENEFICIARIO_ID && errors.BENEFICIARIO_ID.message}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
//             <TextField disabled fullWidth type="text" name="BENEFICIARIO_NOME" label="Nome do empregado" variant="outlined"
//               inputRef={register}
//               InputLabelProps={{ shrink: true }}
//               error={errors.BENEFICIARIO_NOME?true:false}
//               helperText={errors.BENEFICIARIO_NOME && errors.BENEFICIARIO_NOME.message}
//               value={employee ? employee.FULL_NAME : ""}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
//             <TextField disabled fullWidth type="email" name="BENEFICIARIO_EMAIL" label="E-mail do empregado"
//               variant="outlined"
//               inputRef={register}
//               InputLabelProps={{ shrink: true }}
//               error={errors.BENEFICIARIO_EMAIL?true:false}
//               helperText={errors.BENEFICIARIO_EMAIL && errors.BENEFICIARIO_EMAIL.message}
//               value={employee ? employee.WORK_EMAIL_ADDRESS : ""}
//             />
//           </Grid>
//           <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
//             <TextField fullWidth variant="outlined" type="text"
//             multiline rows={5}
//             name="MOTIVO" label="Descrição detalhada do problema" inputRef={register}
//               error={errors.MOTIVO?true:false}
//               helperText={errors.MOTIVO && errors.MOTIVO.message}
//             />
//           </Grid>

//           <Grid xs={12} sm={12} md={12} lg={12} xl={12} item justify="flex-end" alignItems="flex-end">
//             <Button type="submit"
//             variant="contained" color="primary" style={{float:'right'}}> Enviar </Button>
//           </Grid>

//           <Input inputRef={register} readOnly type="hidden" id="BENEFICIARIO_EMPRESA_COD" name="BENEFICIARIO_EMPRESA_COD"
//             value={employee && employee.COMPANY_CODE }
//           />
//           <Input inputRef={register} readOnly type="hidden" id="BENEFICIARIO_EMPRESA_NOME" name="BENEFICIARIO_EMPRESA_NOME"
//             value={employee && employee.COMPANY_DESC } />
//         </Grid >
//       </form>

//       <Snackbar
//         anchorOrigin={{ vertical:'top', horizontal:'right' }}
//         open={snackMessage.open}
//         onClose={()=>setSnackMessage({...snackMessage, open:false})}
//         key={'top' + 'right'}
//       >
//         <Alert onClose={()=>setSnackMessage({...snackMessage, open:false})} severity={snackMessage.severity}>
//           {snackMessage.message}
//         </Alert>
//       </Snackbar>

//       </div>
//     </Paper>

//   );
// }
