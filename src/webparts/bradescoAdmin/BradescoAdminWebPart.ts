import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'BradescoAdminWebPartStrings';
import BradescoAdmin from './components/BradescoAdmin';
import { IBradescoAdminProps } from './components/IBradescoAdminProps';
import { sp } from '@pnp/sp/presets/all';

export interface IBradescoAdminWebPartProps {
  description: string;
}


export default class BradescoAdminWebPart extends BaseClientSideWebPart<IBradescoAdminWebPartProps> {
  protected async onInit(): Promise<void> {

    const _ = await super.onInit();
    sp.setup({
      ie11: true,
      spfxContext: this.context
    });
  }


  public render(): void {
    const element: React.ReactElement<IBradescoAdminProps> = React.createElement(
      BradescoAdmin,
      {
        description: this.properties.description,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
