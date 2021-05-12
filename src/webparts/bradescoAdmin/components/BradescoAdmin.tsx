import * as React from 'react';
import { IBradescoAdminProps } from './IBradescoAdminProps';
import { Provider } from '../../travelSupportBrasil/components/Context';
import { ErroNavegador } from '../../travelSupportBrasil/components/ErroNavegador';
import { Routes } from './Routes';

export default class BradescoAdmin extends React.Component<IBradescoAdminProps, {}> {
  public render(): React.ReactElement<IBradescoAdminProps> {
    let sBrowser, sUsrAg = navigator.userAgent;
      
    if (sUsrAg.indexOf("Edge") > -1) {
      sBrowser = "Microsoft Edge";
    }
    else if(sUsrAg.indexOf("Chrome") > -1) {
        sBrowser = "Google Chrome";
    } 
    else if (sUsrAg.indexOf("Safari") > -1) {
        sBrowser = "Apple Safari";
    } 
    else if (sUsrAg.indexOf("Opera") > -1) {
        sBrowser = "Opera";
    } 
    else if (sUsrAg.indexOf("Firefox") > -1) {
        sBrowser = "Mozilla Firefox";
    } 
    else if (sUsrAg.indexOf(".NET") > -1) {
        sBrowser = "Microsoft Internet Explorer";
    }
    

    console.log(sBrowser);

  return (
    sBrowser === "Google Chrome"
    ? 
    <Provider>
      <Routes />
    </Provider>
    :
    <ErroNavegador navegador={sBrowser}/>);
  }
}
