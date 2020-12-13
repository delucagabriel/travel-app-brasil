import * as React from 'react';
import { ListItem, ListItemText, Grid, DialogTitle, DialogContent, DialogContentText, Divider } from '@material-ui/core';

export const NewCreditCardDetails = ({requestDetails, children=null})=>{
  return(
    <>
      <DialogTitle id="alert-dialog-title">Detalhes da solicitação - ID: {requestDetails && requestDetails.Id} { children }</DialogTitle>
      <DialogContent style={{width:'100%'}}>
        <DialogContentText id="alert-dialog-description">
          <Grid container spacing={2}>
            <Grid xs={12} sm={12} md={6} lg={6} xl={6} style={{padding:'10px'}}>
              <Grid container>
                  <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="PORTADOR: MATRICULA" secondary={requestDetails.BENEFICIARIO_ID}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="PORTADOR: NOME" secondary={requestDetails.BENEFICIARIO_NOME}/>
                    </Grid>
                  </ListItem>
                  <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="PORTADOR: EMAIL" secondary={requestDetails.BENEFICIARIO_EMAIL}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="PORTADOR: EMPRESA" secondary={requestDetails.BENEFICIARIO_EMPRESA_NOME}/>
                    </Grid>
                  </ListItem>

                  <ListItem >
                    <Grid xs={12} sm={6} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="CPF" secondary={requestDetails.CPF}/>
                    </Grid>
                    <Grid xs={12} sm={6} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="TELEFONE" secondary={requestDetails.TELEFONE}/>
                    </Grid>
                  </ListItem>

                  <ListItem >
                    { requestDetails.TIPO_DE_LIMITE === 'Saque'
                      ?<Grid xs={12} sm={6} md={6} lg={6} xl={6}>
                        <ListItemText primaryTypographyProps={{color:"secondary"}}
                        primary="NOVO LIMITE" secondary={requestDetails.NOVO_LIMITE}/>
                      </Grid>
                      :<Grid xs={12} sm={6} md={6} lg={6} xl={6}>
                        <ListItemText primaryTypographyProps={{color:"secondary"}}
                        primary="NOVO LIMITE" secondary={requestDetails.TIPO_LIMITE_VALOR}/>
                      </Grid>
                    }
                  </ListItem>

                  <ListItem >
                    <Grid xs={12} sm={6} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="CEP" secondary={requestDetails.END_CEP}/>
                    </Grid>
                    <Grid xs={12} sm={6} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="LOGRADOURO" secondary={requestDetails.END_LOGRADOURO}/>
                    </Grid>
                  </ListItem>

                  <ListItem >
                    <Grid xs={12} sm={6} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="NÚMERO" secondary={requestDetails.END_NUMERO}/>
                    </Grid>
                    <Grid xs={12} sm={6} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="COMPLEMENTO" secondary={requestDetails.END_COMPLEMENTO}/>
                    </Grid>
                  </ListItem>

                  <ListItem >
                    <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="MOTIVO" secondary={requestDetails.MOTIVO && requestDetails.MOTIVO.replace(/(&nbsp;|<([^>]+)>)/ig, '')}/>
                    </Grid>
                  </ListItem>

                  <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="APROVADOR: MATRICULA" secondary={requestDetails.APROVADOR_ID}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="APROVADOR: NOME" secondary={requestDetails.APROVADOR_NOME}/>
                    </Grid>
                  </ListItem>
                  <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="APROVADOR: EMAIL" secondary={requestDetails.APROVADOR_EMAIL}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="APROVADOR: EMPRESA" secondary={requestDetails.APROVADOR_EMPRESA_NOME}/>
                    </Grid>
                  </ListItem>
                  <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="APROVADOR: LEVEL" secondary={requestDetails.APROVADOR_LEVEL}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="CENTRO DE CUSTOS" secondary={requestDetails.CENTRO_DE_CUSTOS}/>
                    </Grid>
                  </ListItem>
              </Grid>
            </Grid>

            <Divider orientation="vertical" flexItem variant='fullWidth'/>

            <Grid xs={12} sm={12} md={5} lg={5} xl={5} style={{padding:'10px'}}>
              <ListItem >
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                  primary="MACROPROCESSO" secondary={requestDetails.MACROPROCESSO}/>
                </Grid>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                  primary="PROCESSO" secondary={requestDetails.PROCESSO}/>
                </Grid>
              </ListItem>
              <ListItem >
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                  primary="WORKFLOW DE APROVAÇÃO?" secondary={requestDetails.WF_APROVACAO?'Sim':'Não'}/>
                </Grid>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                  primary="ALÇADA NECESSÁRIA" secondary={requestDetails.ALCADA_APROVACAO}/>
                </Grid>
              </ListItem>
              <ListItem >
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                  primary="SLA" secondary={requestDetails.SLA}/>
                </Grid>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                  primary="ÁREA RESOLVEDORA" secondary={requestDetails.AREA_RESOLVEDORA}/>
                </Grid>
              </ListItem>
              <ListItem >
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                  primary="STATUS DA APROVAÇÃO" secondary={requestDetails.STATUS_APROVACAO}/>
                </Grid>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                  primary="DATA DA APROVAÇÃO" secondary={requestDetails.DATA_DE_APROVACAO}/>
                </Grid>
              </ListItem>
              <ListItem >
                <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                  primary="COMENTÁRIOS DO APROVADOR" secondary={requestDetails.APROVACAO_COMENTARIOS && requestDetails.APROVACAO_COMENTARIOS.replace(/(&nbsp;|<([^>]+)>)/ig, '')}/>
                </Grid>
              </ListItem>
              <ListItem >
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                  primary="STATUS DE ATENDIMENTO" secondary={requestDetails.STATUS_ATENDIMENTO}/>
                </Grid>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                  primary="DATA DO ATENDIMENTO" secondary={requestDetails.DATA_DE_ATENDIMENTO}/>
                </Grid>
              </ListItem>
              <ListItem >
                <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                  primary="COMENTÁRIOS DO ATENDIMENTO" secondary={requestDetails.ATENDIMENTO_COMENTARIOS && requestDetails.ATENDIMENTO_COMENTARIOS.replace(/(&nbsp;|<([^>]+)>)/ig, '')}/>
                </Grid>
              </ListItem>

              <ListItem >
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="Author"
                    secondary={requestDetails.Author.Title}
                  />
                </Grid>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="Created"
                    secondary={requestDetails.Created}
                  />
                </Grid>
              </ListItem>
              <ListItem >
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="Editor"
                    secondary={requestDetails.Editor.Title}
                  />
                </Grid>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="Last modified"
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
