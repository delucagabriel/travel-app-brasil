import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from "yup";
import { useState, useContext } from 'react';
import { getEmployee } from '../services/EmployeesService';
import { newRequest } from '../services/RequestServices';
import { IEmployee } from '../Interfaces/IEmployee';
import { TextField, Select, MenuItem, FormLabel, Button,
  Grid, Input, Paper, Typography,
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Snackbar } from '@material-ui/core';
import { Alert, AlertProps } from '@material-ui/lab';
import { Context } from '../Utils/Context';




interface ISnack extends AlertProps {
  open: boolean;
  message: string;
}

interface IFormInputs {
  Macroprocess:string;
  Process:string;
  CardType:string;
  BeneficiaryID:string;
  NewLimit:number;
  TravelDate:Date;
  EmployeeName:string;
  PhoneNumber:number;
  Approver:string;
  ApproverName:string;
  ApproverLevel:string;
  CostCenter:string;
  CompanyCode:number;
  CompanyName:string;
  Location:string;
  AcceptedTerm: boolean;
  ApprovalWorkflow:boolean;
}

const schema = yup.object().shape({
  Macroprocess: yup.string().required(),
  Process: yup.string().required(),
  CardType: yup.string().required(),
  BeneficiaryID: yup.string().required(),
  EmployeeName: yup.string().required(),
  PhoneNumber: yup.string().required(),
  Approver: yup.string().required(),
  ApproverName: yup.string().required(),
  ApproverLevel: yup.string().required().notOneOf(['STAFF','SUP', 'D-4'], 'Minimum level equal to D-3'),
  CostCenter: yup.string().required(),
  CompanyName: yup.string().required(),
  Location: yup.string().required(),
  NewLimit: yup.number()
    .positive()
    .min(5000)
    .max(100000)
    .required(),
  CompanyCode: yup.string()
    .required(),
  TravelDate: yup.date().required(),
  AcceptedTerm: yup.boolean().required(),
  ApprovalWorkflow: yup.boolean().default(true),
  ApproverEmail: yup.string().email().required()

});

export default function NewCreditCard(){
  const { register, handleSubmit, control, errors, reset, getValues } = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  });
  const [employee, setEmployee] = useState<IEmployee>();
  const [approver, setApprover] = useState<IEmployee>();
  const [cardType, setCardType] = useState('');
  const [open, setOpen] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [acceptedTerm, setAcceptedTerm] = useState(false);
  const [snackMessage, setSnackMessage] = useState<ISnack>({
    open: false,
    message: "",
    severity:'info'
  });
  const { updateContext } = useContext(Context);

  const handleAccept = ()=>{
    setAcceptedTerm(true);
    setOpen(false);
    setSubmitDisabled(false);
  };

  const handleOpenTerm = ()=> {
    setOpen(true);
    setCardType(getValues('CardType'));
  };

  const handleGetEmployee = value =>getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
  .then(emp => setEmployee(emp));

  const handleGetApprover = value =>getEmployee("IAM_ACCESS_IDENTIFIER", value.toUpperCase())
  .then(emp => setApprover(emp));

  const onSubmit = (data:IFormInputs, e) => {
    newRequest(data)
      .then(res => {
        setSnackMessage({open:true, message: `Request successfully recorded under ID:${res.data.ID}`, severity:"success"});
        updateContext();
      })
      .catch(()=> {
        setSnackMessage({open:true, message: "Request failed", severity:"error"});
      });
    e.target.reset();
    setSubmitDisabled(true);
  };

  const Term = ({cardTypeTerm}) => {
    const tenantName = '/teams/travel_support/Shared Documents';
    const TCard = {linkName:`${tenantName}/TCARD_DOC.pdf`, Title:'Travel Card'};
    const PCard = {linkName:`${tenantName}/PCARD_DOC.pdf`, Title:'Purchase Card'};
    let linkTerm = cardTypeTerm === 'TCard'?TCard:PCard;

    return <Button variant="contained" color="secondary" onClick={()=> window.open(linkTerm.linkName)}> {`Term of ${linkTerm.Title}`} </Button>;
  };


  return (
    <Paper>
        <div style={{padding:"20px"}}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} justify="space-between">
              <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                <FormLabel id="Macroprocess" component="legend">Macroprocess</FormLabel>
                <Controller
                  as={
                    <Select disabled fullWidth>
                      <MenuItem value="Corporate Card"> Corporate Card </MenuItem>
                    </Select>
                  }
                  name="Macroprocess"
                  defaultValue="Corporate Card"
                  rules={{ required: "this is required" }}
                  control={control}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                <FormLabel id="Process" component="legend">Process</FormLabel>
                <Controller
                  as={
                    <Select disabled fullWidth>
                      <MenuItem value="New Card">New Card</MenuItem>
                    </Select>
                  }
                  id="Process"
                  name="Process"
                  defaultValue="New Card"
                  rules={{ required: "this is required" }}
                  control={control}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                <FormLabel id="CardTypeLabel" component="legend">Card Type</FormLabel>
                <Controller
                  as={
                    <Select fullWidth >
                      <MenuItem value="TCard">TCard</MenuItem>
                      <MenuItem value="PCard">PCard</MenuItem>
                    </Select>
                  }
                  name="CardType"
                  defaultValue="TCard"
                  control={control}
                  error={errors.CardType?true:false}
                  helperText={errors.CardType && errors.CardType.message}

                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                <TextField
                  fullWidth
                  variant="outlined"
                  type="search"
                  name="BeneficiaryID"
                  label="Beneficiary ID"
                  onBlur={ e=> handleGetEmployee(e.target.value) }
                  inputRef={register}
                  error={errors.BeneficiaryID?true:false}
                  helperText={errors.BeneficiaryID && errors.BeneficiaryID.message}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                <TextField
                  fullWidth
                  variant="outlined" type="number" name="NewLimit" label="Limit"
                  inputRef={register}
                  error={errors.NewLimit?true:false}
                  helperText={errors.NewLimit && errors.NewLimit.message}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4} xl={4} >
                <TextField
                  fullWidth
                  label="Travel date"
                  variant="outlined"
                  id="TravelDate"
                  type="date"
                  name="TravelDate"
                  inputRef={register}
                  InputLabelProps={{ shrink: true }}
                  error={errors.TravelDate?true:false}
                  helperText={errors.TravelDate && errors.TravelDate.message}
                />
              </Grid>
              <Grid item xs={12} sm={7} md={7} lg={7} xl={7} >
                <TextField
                  variant="outlined"
                  disabled
                  fullWidth
                  defaultValue=" "
                  type="text"
                  name="EmployeeName"
                  label="Employee name"
                  value={employee && employee.FULL_NAME }
                  inputRef={register}
                  error={errors.EmployeeName?true:false}
                  helperText={errors.EmployeeName && errors.EmployeeName.message}
                />
              </Grid>


              <Grid item xs={12} sm={5} md={5} lg={5} xl={5} >
                <TextField
                  variant="outlined"
                  fullWidth
                  type="text"
                  name="PhoneNumber"
                  label="Phone number"
                  inputRef={register}
                  error={errors.PhoneNumber?true:false}
                  helperText={errors.PhoneNumber && errors.PhoneNumber.message}
                />
              </Grid>


              <Grid item xs={12} sm={4} md={3} lg={4} xl={4} >
                <TextField
                  required
                  fullWidth
                  variant="outlined"
                  type="search"
                  name="Approver"
                  label="Approver ID"
                  onBlur={e=>handleGetApprover(e.target.value)}
                  inputRef={register}
                  error={errors.Approver?true:false}
                  helperText={errors.Approver && errors.Approver.message}
                />
              </Grid>


              <Grid item xs={12} sm={5} md={5} lg={5} xl={5} >
              <TextField
                  variant="outlined"
                  disabled
                  fullWidth
                  defaultValue=" "
                  type="text"
                  name="ApproverName"
                  label="Approver name"
                  value={approver && approver.FULL_NAME}
                  inputRef={register}
                  error={errors.ApproverName?true:false}
                  helperText={errors.ApproverName && errors.ApproverName.message}
                />
              </Grid>

              <Grid item xs={12} sm={3} md={3} lg={3} xl={3} >
                <TextField
                  variant="outlined"
                  disabled
                  fullWidth
                  type="text"
                  name="ApproverLevel"
                  label="Approver Level"
                  value={approver && approver.APPROVAL_LEVEL_CODE}
                  InputLabelProps={{ shrink: true }}
                  inputRef={register}
                  error={errors.ApproverLevel?true:false}
                  helperText={errors.ApproverLevel && errors.ApproverLevel.message}
                />
              </Grid>
              <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} justify="space-between">
                <Button variant="outlined" color="secondary" onClick={handleOpenTerm}>
                  Open Term
                </Button>
                <Button disabled={submitDisabled} type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
              <Dialog
                  open={open}
                  onClose={()=>setOpen(false)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">Statement of responsability</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <Typography>
                        <Term cardTypeTerm={cardType} />
                        <p>
                          As an employee of Vale Canada Limited or any subsidiary thereof (collectively, "the Company"), I understand that, by accepting this term, I agree with everything described in the membership document.
                        </p>
                      </Typography>
                    </DialogContentText>
                    <DialogActions>
                      <Button variant="contained" color='primary' onClick={handleAccept}>Accept Term</Button>
                    </DialogActions>
                  </DialogContent>
                </Dialog>

              <Input inputRef={register} readOnly type="hidden" id="AcceptedTerm" name="AcceptedTerm" value={acceptedTerm}/>
              <Input inputRef={register} readOnly type="hidden" id="EmployeeEmail" name="EmployeeEmail" value={employee && employee.WORK_EMAIL_ADDRESS } />
              <Input inputRef={register} readOnly type="hidden" id="CostCenter" name="CostCenter" value={employee && employee.COST_CENTER_CODE } />
              <Input inputRef={register} readOnly type="hidden" id="CompanyCode" name="CompanyCode" value={employee && employee.COMPANY_CODE } />
              <Input inputRef={register} readOnly type="hidden" id="CompanyName" name="CompanyName" value={employee && employee.COMPANY_DESC } />
              <Input inputRef={register} readOnly type="hidden" id="Location" name="Location" value={employee && employee.BUSINESS_UNIT + " - " + employee.FACILITY_DESCRIPTION } />
              <Input inputRef={register} readOnly type="hidden" id="ApproverEmail" name="ApproverEmail" value={approver && approver.WORK_EMAIL_ADDRESS } />

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
