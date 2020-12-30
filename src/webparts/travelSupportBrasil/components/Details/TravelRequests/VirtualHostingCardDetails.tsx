import * as React from 'react';
import { ListItem, ListItemText, Grid, DialogTitle, DialogContent, DialogContentText, Divider, Link } from '@material-ui/core';
import { sp } from '@pnp/sp';
import { IAttachmentInfo } from '@pnp/sp/attachments';
import { useEffect, useState } from 'react';

export const VirtualHostingCardDetails = ({requestDetails, children=null})=>{
  const [attachments, setAttachments] = useState<IAttachmentInfo[]>([]);
    useEffect(()=>{
      sp.web.lists.getByTitle('SOLICITACOES')
        .items.getById(requestDetails.Id)
        .attachmentFiles()
        .then(res => (setAttachments(res)));
    },[]);
  return(
    <>
      <DialogTitle id="alert-dialog-title">Detalhes da solicitação - ID: {requestDetails && requestDetails.Id} { children } </DialogTitle>
      <DialogContent style={{width:'100%'}}>
        <DialogContentText id="alert-dialog-description">
          <Grid container spacing={2}>
            <Grid xs={12} sm={12} md={6} lg={6} xl={6} style={{padding:'10px'}}>
              <Grid container>
                <ListItem >
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="SOLICITANTE: MATRICULA" secondary={requestDetails.SOLICITANTE_ID}/>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="SOLICITANTE: NOME" secondary={requestDetails.SOLICITANTE_NOME}/>
                  </Grid>
                </ListItem>
                <ListItem >
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="SOLICITANTE: EMAIL" secondary={requestDetails.SOLICITANTE_EMAIL}/>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="SOLICITANTE: EMPRESA" secondary={requestDetails.SOLICITANTE_EMPRESA_NOME}/>
                  </Grid>
                </ListItem>

                <ListItem >
                  <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="TIPO DE VIAJANTE" secondary={requestDetails.TIPO_DE_VIAJANTE}/>
                  </Grid>
                </ListItem>

                <ListItem >
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="VIAJANTE: MATRICULA" secondary={requestDetails.BENEFICIARIO_ID}/>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="VIAJANTE: NOME" secondary={requestDetails.BENEFICIARIO_NOME}/>
                  </Grid>
                </ListItem>
                <ListItem >
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="VIAJANTE: EMAIL" secondary={requestDetails.BENEFICIARIO_EMAIL}/>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="VIAJANTE: EMPRESA" secondary={requestDetails.BENEFICIARIO_EMPRESA_NOME}/>
                  </Grid>
                </ListItem>
                <ListItem >
                  <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="VIAJANTE: LEVEL" secondary={requestDetails.BENEFICIARIO_LEVEL}/>
                  </Grid>
                </ListItem>

                <ListItem >
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="VIAJANTE: DOC. IDENTIFICAÇÃO" secondary={requestDetails.BENEFICIARIO_DOC_IDENTIF}/>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="VIAJANTE: NACIONALIDADE" secondary={requestDetails.BENEFICIARIO_NACIONALIDADE}/>
                  </Grid>
                </ListItem>
                <ListItem >
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="VIAJANTE: NASCIMENTO" secondary={requestDetails.BENEFICIARIO_NASCIMENTO}/>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="VIAJANTE: TELEFONE" secondary={requestDetails.TELEFONE}/>
                  </Grid>
                </ListItem>

                <ListItem >
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="ESTABELECIMENTO" secondary={requestDetails.ESTABELECIMENTO}/>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="END_LOGRADOURO" secondary={requestDetails.END_LOGRADOURO}/>
                  </Grid>
                </ListItem>

                <ListItem >
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="PERÍODO INÍCIO" secondary={requestDetails.PERIODO_INICIO}/>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="PERÍODO FIM" secondary={requestDetails.PERIODO_FIM}/>
                  </Grid>
                </ListItem>

                <ListItem >
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="MOTIVO DA VIAGEM" secondary={requestDetails.MOTIVO_DA_VIAGEM}/>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="OBS. PARA SOLICITAÇÃO" secondary={requestDetails.OBS_PARA_SOLICITACAO}/>
                  </Grid>
                </ListItem>

                <ListItem >
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="CENTRO DE CUSTOS" secondary={requestDetails.CENTRO_DE_CUSTOS}/>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                      primary="ACOMPANHANTES" secondary={requestDetails.ACOMPANHANTES}/>
                  </Grid>
                </ListItem>

                <ListItem >
                  <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="MOTIVO" secondary={requestDetails.MOTIVO && requestDetails.MOTIVO && requestDetails.MOTIVO.replace(/(&nbsp;|<([^>]+)>)/ig, '')}/>
                  </Grid>
                </ListItem>

                <ListItem >
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="APROVADOR: MATRICULA" secondary={requestDetails.SOLICITANTE_ID}/>
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
                  <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="APROVADOR: LEVEL" secondary={requestDetails.APROVADOR_LEVEL}/>
                  </Grid>
                </ListItem>
                <ListItem >
                  <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
                    <ListItemText primaryTypographyProps={{color:"secondary"}}
                    primary="Anexos"/>
                    { attachments.map( attachment =>
                        <>
                          <Link
                            href={ attachment.ServerRelativeUrl }
                            target="_blank"
                            rel="noopener"
                            component="a"
                            variant="body2"
                            color='primary'
                            underline='none'
                          >
                            { attachment.FileName }
                          </Link> <br/>
                        </>
                      ) }
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
