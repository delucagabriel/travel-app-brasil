import * as React from 'react';
import { ITravelSupportBrasilProps } from './ITravelSupportBrasilProps';
import { Routes } from './Routes';

import "./globalStyles.module.scss";
import { Provider } from './Context';

export default class TravelSupportBrasil extends React.Component<ITravelSupportBrasilProps, {}> {
  public constructor(context: ITravelSupportBrasilProps){
    super(context);
  }

  public render(): React.ReactElement<ITravelSupportBrasilProps> {
    return (
    <Provider>
      <Routes />
    </Provider>);
  }
}
