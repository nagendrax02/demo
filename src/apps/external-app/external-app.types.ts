export interface IExternalApp {
  Mode: string;
  Url: string;
}

export enum ResourceLoadingMode {
  Script = 'Script'
}

export enum PanelState {
  Open,
  Close
}
