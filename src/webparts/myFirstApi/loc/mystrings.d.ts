declare interface IMyFirstApiWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
}

declare module 'MyFirstApiWebPartStrings' {
  const strings: IMyFirstApiWebPartStrings;
  export = strings;
}
