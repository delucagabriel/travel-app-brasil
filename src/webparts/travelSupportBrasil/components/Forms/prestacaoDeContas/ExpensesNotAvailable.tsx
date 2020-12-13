import * as React from 'react';
import { TextField, Select, MenuItem, FormLabel, Grid, Button, Input, Paper, Typography, Snackbar, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { useState, useContext, useEffect } from 'react';
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

setLocale(yup_pt_br);

const schema: yup.ObjectSchema<IRequests_AllFields> = yup.object().shape({
  MACROPROCESSO: yup.string().required(),
  PROCESSO: yup.string().required(),
  SLA: yup.number().default(72),
  AREA_RESOLVEDORA: yup.string().default("Viagens Corporativas"),
  ALCADA_APROVACAO: yup.string().default(""),

  BENEFICIARIO_ID: yup.string().required(),
  BENEFICIARIO_NOME: yup.string().required(),
  BENEFICIARIO_EMAIL: yup.string().required(),
  BENEFICIARIO_EMPRESA_COD: yup.string().required(),
  BENEFICIARIO_EMPRESA_NOME: yup.string().required(),

  ULTIMOS_DIGITOS_DO_CARTAO: yup.string()
    .length(4)
    .matches(/\d/, "Somente números")
    .required(),
  DESPESAS_INDISPONIVEIS: yup.string().required(),

  WF_APROVACAO: yup.boolean().default(false),
  DATA_DE_APROVACAO: yup.date().default(new Date()),
  STATUS_APROVACAO: yup.string().default('Aprovado')

});

interface IExpense {
  estabelecimento: string;
  dataDaTransacao: string;
  valorDaTransacao: number;
}


export default function ExpensesNotAvailable() {

  const { register, handleSubmit, control, errors, setValue } = useForm<IRequests_AllFields>({
    resolver: yupResolver(schema)
  });
  const [employee, setEmployee] = useState<IEmployee>();
  const [expense, setExpense] = useState<IExpense>();
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [snackMessage, setSnackMessage] = useState<ISnack>({
    open: false,
    message: "",
    severity:'info'
  });
  const { updateContext } = useContext(Context);

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

  const handleInsertExpense= (event)=> {
    event.preventDefault();
    if (expense) setExpenses([...expenses, expense]);
  };

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
    setExpenses([]);
  };

  useEffect(()=>{

  }, [expenses]);

  return (
    <Paper>
      <HocDialog>
        <Typography variant='body2'>
          O prazo para disponibilização das despesas no Concur é de até 5 dias úteis após a transação. Após esse prazo, preencher o formulário a seguir com os dados de cada despesa não disponível para prestação de contas.
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
                  <MenuItem value="Despesas não disponíveis">Despesas não disponíveis</MenuItem>
                </Select>
              }
              id="Process"
              name="PROCESSO"
              defaultValue="Despesas não disponíveis"
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
            <TextField disabled fullWidth type="text" name="BENEFICIARIO_NOME"
              label="Empregado: Nome" variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              error={errors.BENEFICIARIO_NOME?true:false}
              helperText={errors.BENEFICIARIO_NOME && errors.BENEFICIARIO_NOME.message}
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
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} ></Grid>


            <Grid item xs={12} sm={5} md={5} lg={5} xl={5} >
              <TextField fullWidth variant="outlined" type="text" label="Estabelecimento"
                InputLabelProps={{ shrink: true }}
                onBlur={event => setExpense({...expense, estabelecimento: event.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
              <TextField fullWidth variant="outlined" type="date" label="Data da transação"
                InputLabelProps={{ shrink: true }}
                onBlur={event => setExpense({...expense, dataDaTransacao: event.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={3} lg={3} xl={3} >
              <TextField fullWidth variant="outlined" type="number" label="Valor da transação"
                InputLabelProps={{ shrink: true }} inputProps={{ min: 1 }}
                onBlur={event => setExpense({...expense, valorDaTransacao: Number(event.target.value)})}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
              <Button
                size='small'
                onClick={e => handleInsertExpense(e)}
                variant="contained"
                color="secondary"
                style={{float:'right'}}
              > Adicionar despesa</Button>
            </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <TableContainer>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Estabelecimento</TableCell>
                    <TableCell align="center">Data da transação</TableCell>
                    <TableCell align="center">Valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((row, key) => (
                    <TableRow key={key}>
                      <TableCell align="center">{row && row.estabelecimento}</TableCell>
                      <TableCell align="center">{row && row.dataDaTransacao}</TableCell>
                      <TableCell align="center">{row && row.valorDaTransacao}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
            <div style={{ minHeight: '50px'}} />
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

          <Input
            inputRef={register}
            readOnly
            type="hidden"
            name="DESPESAS_INDISPONIVEIS"
            value={expenses &&
              expenses.map(despesa => `[ Estabelecimento: ${despesa.estabelecimento} | Data da transação: ${despesa.dataDaTransacao} | Valor da transação: ${despesa.valorDaTransacao} ]`).join(';')
            } />

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
