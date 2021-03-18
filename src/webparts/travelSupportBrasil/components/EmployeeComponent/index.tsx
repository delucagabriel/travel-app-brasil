import * as React from 'react';
import { useState } from 'react';
import { TextField, Grid } from '@material-ui/core';
import { IEmployee } from '../../Interfaces/IEmployee';
import { getEmployee } from '../../services/EmployeesService';

export default function EmployeeComponent(register, errors){
  const [employee, setEmployee] = useState<IEmployee>();

  const handleGetEmployee = value => getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
  .then(emp => {
    setEmployee(emp);
  });

  const handleGetEmployeeByEmail = value => getEmployee("WORK_EMAIL_ADDRESS", value.toLowerCase())
  .then(emp => {
    setEmployee(emp);
  });

  return (
    <>
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

      <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
        <TextField fullWidth type="text" name="CPF"
          label="Empregado: CPF" variant="outlined"
          inputRef={register}
          InputLabelProps={{ shrink: true }}
          error={errors.CPF?true:false}
          helperText={errors.CPF && errors.CPF.message}
        />
      </Grid>
      <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
        <TextField fullWidth type="tel" name="TELEFONE"
          label="Empregado: Telefone" variant="outlined"
          inputRef={register}
          InputLabelProps={{ shrink: true }}
          error={errors.TELEFONE?true:false}
          helperText={errors.TELEFONE && errors.TELEFONE.message}
        />
      </Grid>
      <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
        <TextField fullWidth type="date" name="BENEFICIARIO_NASCIMENTO"
          label="Empregado: Data de nascimento" variant="outlined"
          inputRef={register}
          InputLabelProps={{ shrink: true }}
          error={errors.BENEFICIARIO_NASCIMENTO?true:false}
          helperText={errors.BENEFICIARIO_NASCIMENTO && errors.BENEFICIARIO_NASCIMENTO.message}
        />
      </Grid>
    </>
  );
}
