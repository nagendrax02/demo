interface IIFrame {
  src: string;
  height?: string;
  width?: string;
  className?: string;
  onLoad?: (onLoadConfig: IOnLoad) => void;
}

export interface IOnLoad {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export default IIFrame;
