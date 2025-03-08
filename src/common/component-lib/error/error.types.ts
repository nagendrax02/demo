interface IActionConfig {
  title: string;
  handleClick: () => void;
}

interface IError {
  icon: string;
  title: string;
  description: string | JSX.Element;
  actionConfig?: IActionConfig;
}
interface IActionButton {
  actionConfig: IActionConfig;
}

export type { IError, IActionButton };
