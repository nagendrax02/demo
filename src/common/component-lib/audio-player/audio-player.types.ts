export interface IAudioPlayer {
  fileURL: string;
  enableDownload?: boolean;
}

export interface IAudioControls {
  isPlaying: boolean;
  handlePlay: () => void;
}

export interface IAudio {
  fileURL: string;
  audioRef: React.RefObject<HTMLAudioElement>;
  handleAudioEnd: () => void;
}

export interface IDownloadFile {
  enableDownload: boolean;
  fileURL: string;
  isLink?: boolean;
}

export interface IDuration {
  seconds: number;
  minutes: number;
}

export interface IDurations {
  currentTime: IDuration;
  duration: IDuration;
  disabled: boolean;
}

export interface IVolumeControl {
  audioRef: React.RefObject<HTMLAudioElement>;
  className: string;
  disabled: boolean;
}

export interface ISeekBar {
  audioSeekTime: number;
  duration: number | undefined;
  handleSeekBar: (event) => void;
  startTimer: (clearTimer?: boolean | undefined) => void;
  className: string;
  disabled: boolean;
}
