export interface ICustomMenu {
  Id: string;
  AppConfig: {
    Title: string;
    AppURL: {
      URL: string;
      Method: string;
    };
    HelpURL: string;
    VideoURL: string;
    Description: string;
    IframeAttributes: string;
  };
  MenuConfig: {
    Text: string;
  };
  customId: string;
  parentId: string;
}

interface IApplicationMenu {
  Menu: ICustomMenu[];
  Id: string;
}

export interface ICustomMenuResponse {
  ApplicationMenus: IApplicationMenu[];
  DefaultIframeAttributes: string;
}
