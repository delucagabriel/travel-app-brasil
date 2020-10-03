import * as React from 'react';
import { DialogTitle, DialogContent, DialogContentText,
  ListItem, ListItemText, Grid, Divider } from '@material-ui/core';

export const CorporateCardDetails = ({requestDetails, children=null})=>{
  return(
    <>
      <DialogTitle id="alert-dialog-title">Request Details - ID: {requestDetails && requestDetails.Id}</DialogTitle>
      <DialogContent style={{width:'100%'}}>
        <DialogContentText id="alert-dialog-description">
          <Grid container spacing={2}>
            <Grid xs={12} sm={12} md={6} lg={6} xl={6} style={{padding:'10px'}}>
              <Grid container>
                  <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText
                        primaryTypographyProps={{color:"secondary"}}
                        primary="MACROPROCESSO"
                        secondary={requestDetails.MACROPROCESSO}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText
                        primaryTypographyProps={{color:"secondary"}}
                        primary="PROCESSO"
                        secondary={requestDetails.PROCESSO}/>
                    </Grid>
                  </ListItem>
                  <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText
                        primaryTypographyProps={{color:"secondary"}}
                        primary="EMPREGADO: MATRICULA"
                        secondary={requestDetails.BENEFICIARIO_ID}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText
                        primaryTypographyProps={{color:"secondary"}}
                        primary="EMPREGADO: NOME"
                        secondary={requestDetails.BENEFICIARIO_NOME}/>
                    </Grid>
                  </ListItem>
                  <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText
                        primaryTypographyProps={{color:"secondary"}}
                        primary="EMPREGADO: EMAIL" secondary={requestDetails.BENEFICIARIO_EMAIL}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText
                        primaryTypographyProps={{color:"secondary"}}
                        primary="EMPREGADO: EMPRESA" secondary={requestDetails.BENEFICIARIO_EMPRESA_NOME}/>
                    </Grid>
                  </ListItem>

                  { requestDetails.CPF &&
                  <>
                    <ListItem >
                      <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                        <ListItemText
                          primaryTypographyProps={{color:"secondary"}}
                          primary="CPF"
                          secondary={requestDetails.CPF}/>
                      </Grid>
                    </ListItem>
                    <ListItem >
                      <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                        <ListItemText
                          primaryTypographyProps={{color:"secondary"}}
                          primary="TELEFONE"
                          secondary={requestDetails.TELEFONE}/>
                      </Grid>
                    </ListItem>
                  </>
                  }

                  <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText
                        primaryTypographyProps={{color:"secondary"}}
                        primary="ÚLTIMOS DÍGITOS DO CARTÃO"
                        secondary={requestDetails.ULTIMOS_DIGITOS_CARTAO}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText
                        primaryTypographyProps={{color:"secondary"}}
                        primary="CENTRO DE CUSTOS"
                        secondary={requestDetails.CENTRO_DE_CUSTOS}/>
                    </Grid>
                  </ListItem>
                  <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText
                        primaryTypographyProps={{color:"secondary"}}
                        primary="CENTRO DE CUSTOS"
                        secondary={requestDetails.CENTRO_DE_CUSTOS}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText
                        primaryTypographyProps={{color:"secondary"}}
                        primary="LIMITE"
                        secondary={requestDetails.TIPO_LIMITE_VALOR}/>
                    </Grid>
                  </ListItem>
                  <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText
                        primaryTypographyProps={{color:"secondary"}}
                        primary="PERÍODO INÍCIO"
                        secondary={requestDetails.PERIODO_INICIO || requestDetails.Created}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText
                        primaryTypographyProps={{color:"secondary"}}
                        primary="PERÍODO FIM"
                        secondary={requestDetails.PERIODO_FIM}/>
                    </Grid>
                  </ListItem>
                  {
                  requestDetails.END_CEP &&
                  <>
                  <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText
                        primaryTypographyProps={{color:"secondary"}}
                        primary="ENDEREÇO: CEP"
                        secondary={requestDetails.END_CEP}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText
                        primaryTypographyProps={{color:"secondary"}}
                        primary="ENDEREÇO: NÚMERO"
                        secondary={requestDetails.END_NUMERO}/>
                    </Grid>
                  </ListItem>
                  <ListItem >
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText
                        primaryTypographyProps={{color:"secondary"}}
                        primary="ENDEREÇO: LOGRADOURO"
                        secondary={requestDetails.END_LOGRADOURO}/>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                      <ListItemText
                        primaryTypographyProps={{color:"secondary"}}
                        primary="ENDEREÇO: COMPLEMENTO"
                        secondary={requestDetails.END_COMPLEMENTO}/>
                    </Grid>
                  </ListItem>
                  </>
                  }

                  { requestDetails.ESTABELECIMENTO &&
                    <ListItem >
                      <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                        <ListItemText
                          primaryTypographyProps={{color:"secondary"}}
                          primary="ESTABELECIMENTO"
                          secondary={ requestDetails.ESTABELECIMENTO }/>
                      </Grid>
                      <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                        <ListItemText
                          primaryTypographyProps={{color:"secondary"}}
                          primary="DATA DE UTILIZAÇÃO"
                          secondary={requestDetails.DATA_DE_UTILIZACAO}/>
                      </Grid>
                    </ListItem>
                  }

                  { requestDetails.COD_RAMO_ATIVIDADE &&
                    <ListItem >
                      <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                        <ListItemText
                          primaryTypographyProps={{color:"secondary"}}
                          primary="CÓD. RAMO DE ATIVIDADE"
                          secondary={ requestDetails.COD_RAMO_ATIVIDADE }/>
                      </Grid>
                    </ListItem>
                  }

                  { requestDetails.VALOR &&
                    <ListItem >
                      <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                        <ListItemText
                          primaryTypographyProps={{color:"secondary"}}
                          primary="VALOR"
                          secondary={ requestDetails.VALOR }/>
                      </Grid>
                    </ListItem>
                  }

                  { requestDetails.MOTIVO &&
                    <ListItem >
                      <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
                        <ListItemText
                          primaryTypographyProps={{color:"secondary"}}
                          primary="MOTIVO"
                          secondary={requestDetails.MOTIVO}/>
                      </Grid>
                    </ListItem>
                  }


              </Grid>
            </Grid>

            <Divider orientation="vertical" flexItem variant='fullWidth'/>

            <Grid xs={12} sm={12} md={5} lg={5} xl={5} style={{padding:'10px'}}>
              <ListItem >
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="Author"
                    secondary={requestDetails.Author.Title}
                  />
                </Grid>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText
                    primaryTypographyProps={{color:"secondary"}}
                    primary="Created"
                    secondary={requestDetails.Created}
                  />
                </Grid>
              </ListItem>
              <ListItem >
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText
                    primaryTypographyProps={{color:"secondary"}}
                    primary="Editor"
                    secondary={requestDetails.Editor.Title}
                  />
                </Grid>
                <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                  <ListItemText
                    primaryTypographyProps={{color:"secondary"}}
                    primary="Last modified"
                    secondary={requestDetails.Modified}
                  />
                </Grid>
              </ListItem>
                <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
                  { children }
                </Grid>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </>
  );
};
