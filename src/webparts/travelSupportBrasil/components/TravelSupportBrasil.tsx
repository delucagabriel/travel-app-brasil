import * as React from 'react';
import { ITravelSupportBrasilProps } from './ITravelSupportBrasilProps';
import { ErroNavegador } from "./ErroNavegador";
import { Provider } from './Context';
import { Routes } from './Routes';


export default class TravelSupportBrasil extends React.Component<ITravelSupportBrasilProps, {}> {
  public constructor(context: ITravelSupportBrasilProps){
    super(context);
  }


  public render(): React.ReactElement<ITravelSupportBrasilProps> {
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
