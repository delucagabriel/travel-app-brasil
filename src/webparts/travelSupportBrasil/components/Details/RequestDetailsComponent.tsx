import * as React from 'react';
import { DialogTitle, DialogContent, DialogContentText,
  ListItem, ListItemText, Grid, Divider, Button } from '@material-ui/core';

export const RequestDetailsComponent = ({requestDetails, children=null})=>{
  return(
    <>
      <DialogTitle id="alert-dialog-title">Detalhes da solicitação - ID: {requestDetails && requestDetails.Id} { children } </DialogTitle>
      <DialogContent style={{width:'100%'}}>
        <DialogContentText id="alert-dialog-description">
          <Grid container spacing={2}>
            <Grid xs={12} sm={12} md={5} lg={5} xl={5} style={{padding:'10px'}}>
              <Grid container>
                {
                  requestDetails.Macroprocess &&
                  <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="Macroprocess" secondary={requestDetails.Macroprocess}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="Process" secondary={requestDetails.Process}/>
                    </Grid>
                  </ListItem>
                }
                {
                  requestDetails.Status &&
                  <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="Card Type" secondary={requestDetails.CardType}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="Status" secondary={requestDetails.Status}/>
                    </Grid>
                  </ListItem>
                }
                <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="Approval Status" secondary={requestDetails.ApprovalStatus}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="Approval Notes" secondary={requestDetails.ApprovalNotes}/>
                    </Grid>
                </ListItem>
                <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="Service Status" secondary={requestDetails.ServiceStatus}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="Service Notes" secondary={requestDetails.ServiceNotes}/>
                    </Grid>
                </ListItem>
                <ListItem >
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="Employee Name" secondary={requestDetails.EmployeeName}/>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="Phone Number" secondary={requestDetails.PhoneNumber}/>
                  </Grid>
                </ListItem>
                <ListItem >
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="Company Code" secondary={requestDetails.CompanyCode}/>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="Company Name" secondary={requestDetails.CompanyName}/>
                  </Grid>
                </ListItem>
                {
                  requestDetails.ApproverEmail &&
                  <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                        <ListItemText primaryTypographyProps={{color:"secondary"}}
                        primary="Approver E-mail" secondary={requestDetails.ApproverEmail}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="Approver Level" secondary={requestDetails.ApproverLevel}/>
                    </Grid>
                  </ListItem>
                }
                <ListItem >
                {
                  requestDetails.NewLimit &&
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                  primary="Limit" secondary={requestDetails.NewLimit}/>
                  </Grid>
                }
                {
                  requestDetails.CostCenter &&
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                  primary="Cost Center" secondary={requestDetails.CostCenter}/>
                  </Grid>
                }
                </ListItem>
                <ListItem >
                {
                  requestDetails.Last4Digits &&
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="Last 4 Digits" secondary={requestDetails.Last4Digits}
                    />
                  </Grid>
                }
                {
                  requestDetails.Reason &&
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}} primary="Reason" secondary={requestDetails.Reason}/>
                  </Grid>
                }
                </ListItem>
                {
                  requestDetails.Location &&
                  <ListItem >
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="Location" secondary={requestDetails.Location}
                    />
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="Accepted Term" secondary={String(requestDetails.AcceptedTerm).toUpperCase()}
                    />
                  </Grid>
                </ListItem>
                }
                {
                  requestDetails.TravelDate &&
                  <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    </Grid>
                  </ListItem>
                }
              </Grid>
            </Grid>

            <Divider orientation="vertical" flexItem variant='fullWidth'/>

            <Grid xs={12} sm={12} md={6} lg={6} xl={6} style={{padding:'10px'}}>
              <ListItem >
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="Criado por"
                    secondary={requestDetails.Author.EMail}
                  />
                </Grid>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="Criado em"
                    secondary={requestDetails.Created}
                  />
                </Grid>
              </ListItem>
              <ListItem >
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="Modificado por"
                    secondary={requestDetails.Editor.EMail}
                  />
                </Grid>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="Modificado em"
                    secondary={requestDetails.Modified}
                  />
                </Grid>
              </ListItem>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </>
  );
};
