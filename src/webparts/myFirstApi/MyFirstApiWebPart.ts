import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';

import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

import styles from './MyFirstApiWebPart.module.scss';
import * as strings from 'MyFirstApiWebPartStrings';

export interface IMyFirstApiWebPartProps {
  description: string;
}

export default class MyFirstApiWebPart extends BaseClientSideWebPart<IMyFirstApiWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit();
  }

  public render(): void {
    this.context.msGraphClientFactory
    .getClient()
    .then((client: MSGraphClient): void => {
      // get information about the current user from the Microsoft Graph
      client
      .api('/me/messages')
      .top(5)
      .orderby("receivedDateTime desc")
      .get((error, messages: any, rawResponse?: any) => {

        this.domElement.innerHTML = `
        <div class="${ styles.myFirstApi}">
        <div class="${ styles.container}">
          <div class="${ styles.row}">
            <div class="${ styles.column}">
              <span class="${ styles.title}">Welcome to SharePoint!</span>
              <p class="${ styles.subTitle}">Use Microsoft Graph in SharePoint Framework.</p>
              <div id="spListContainer" />
            </div>
          </div>
        </div>
        </div>`;

        // List the latest emails based on what we got from the Graph
        this._renderEmailList(messages.value);

      });
    });
  }

  private _renderEmailList(messages: MicrosoftGraph.Message[]): void {
    let html: string = '';
    for (let index = 0; index < messages.length; index++) {
      html += `<p class="${styles.description}">Email ${index + 1} - ${escape(messages[index].subject)}</p>`;
    }

    // Add the emails to the placeholder
    const listContainer: Element = this.domElement.querySelector('#spListContainer');
    listContainer.innerHTML = html;
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;
    this.domElement.style.setProperty('--bodyText', semanticColors.bodyText);
    this.domElement.style.setProperty('--link', semanticColors.link);
    this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered);

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
