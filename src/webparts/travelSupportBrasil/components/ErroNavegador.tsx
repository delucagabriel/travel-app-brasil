import * as React from 'react';

export const ErroNavegador = ({navegador}) => {
  return(
      <>
        <p style={{textAlign: "center"}}>&nbsp;</p>
        <p style={{textAlign: "center"}}>Olá, tudo bem?</p>
        <p style={{textAlign: "center"}}>Vi que você está utilizando o navegador: <strong>{ navegador }</strong> &nbsp;</p>
        <p style={{textAlign: "center"}}>
            Nossa ferramenta utiliza tecnologias modernas que não funcionam neste navegador. <br/> 
            Por favor, utilize o navegador <em><span style={{color: "#ff0000"}}><strong>Google Chrome</strong></span></em>.
        </p>
        <p>&nbsp;</p>
        <p><img style={{display: "block", marginLeft: "auto", marginRight: "auto"}} 
            src="http://intranet.valepub.net/pt/Documents/tecnologia-da-informacao/equipamentos-e-softwares/google-chrome/images/logo-chrome.svg" 
            alt="Chrome" width="275" height="70" /></p>
        <p style={{textAlign: "center"}}>
            <a target="_blank" href="http://intranet.valepub.net/pt/Documents/tecnologia-da-informacao/equipamentos-e-softwares/google-chrome/docs/Guia%20de%20Altera%C3%A7%C3%A3o%20de%20Navegador%20Padr%C3%A3o%20(PT%20-%20November,%202020).pdf"> Como colocar o Chrome como navegador padrão? </a>
        </p>
        <p style={{textAlign: "center"}}>&nbsp;</p>
        <p style={{textAlign: "center"}}>Desculpe o transtorno e conte com o nosso apoio.</p>
        <h2 style={{textAlign: "center"}}><strong>Viagens Corporativas&nbsp;</strong></h2>
      </>
  );
 

};
