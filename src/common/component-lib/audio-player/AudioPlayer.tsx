import { trackError } from 'common/utils/experience/utils/track-error';
import { useRef, useState, useEffect, useCallback } from 'react';
import Spinner from '@lsq/nextgen-preact/spinner';
import Audio from './components/Audio';
import AudioControls from './components/AudioControls';
import DownloadFile from './components/DownloadFile';
import Durations from './components/Durations';
import SeekBar from './components/SeekBar';
import VolumeControl from './components/VolumeControl';
import { IAudioPlayer } from './audio-player.types';
import {
  getAudioTimeInMinuteAndSeconds,
  getAudioDuration,
  getTotalDuration,
  isValidRecordingURL,
  shouldEnableDownload
} from './utils';
import styles from './audio-player.module.css';
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import InvalidAudioInfo from './components/invalid-audio-info/InvalidAudioInfo';
import { AudioNetworkState, AudioReadyState } from './constants';

// eslint-disable-next-line max-lines-per-function
const AudioPlayer = ({ fileURL, enableDownload }: IAudioPlayer): JSX.Element => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const [isPlaying, setIsPlaying] = useState(false);

  const [duration, setDuration] = useState({ seconds: 0, minutes: 0 });
  const [currentTime, setCurrentTime] = useState({ seconds: 0, minutes: 0 });
  const [audioSeekTime, setAudioSeekTime] = useState(0);
  const [errorInAudio, setErrorInAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioPlayerInitialised, setAudioPlayerInitialised] = useState(false);

  const startTimer = (clearTimer?: boolean): void => {
    try {
      const audioRefCurrent = audioRef.current;
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setAudioSeekTime(audioRefCurrent?.currentTime || 0);
        const audioDuration = Math.ceil(audioRef.current?.currentTime ?? 0);
        setCurrentTime(getAudioTimeInMinuteAndSeconds(audioDuration));
      }, 1000);

      if (!isPlaying && clearTimer) {
        clearInterval(intervalRef.current);
      }
    } catch (error) {
      trackError('failed to start timer', error);
    }
  };

  const audioInit = useCallback(() => {
    try {
      const audioRefCurrent = audioRef.current;
      if (audioRefCurrent && !duration.seconds) {
        audioRefCurrent.onloadeddata = (): void => {
          setDuration(getAudioDuration(audioRef));
          setIsLoading(false);
        };
        audioRefCurrent.ontimeupdate = (): void => {
          setAudioSeekTime(audioRefCurrent.currentTime);
        };
        audioRefCurrent.onstalled = (): void => {
          const audioReadyState = audioRef?.current && audioRef?.current?.readyState;
          const audioNetworkState = audioRef?.current && audioRef?.current?.networkState;
          if (
            audioReadyState === AudioReadyState.HaveMetadata &&
            audioNetworkState === AudioNetworkState.Loading
          ) {
            setErrorInAudio(true);
          }
        };
      }
    } catch (error) {
      trackError('failed to initialize the audio', error);
    }
  }, [duration.seconds]);

  useEffect(() => {
    setErrorInAudio(false);
    setTimeout(() => {
      setIsPlaying(false);
      const totalDuration = getAudioDuration(audioRef);
      setDuration(totalDuration);
    }, 1000);
    setIsPlaying(false);
    setCurrentTime({ seconds: 0, minutes: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileURL]);

  const handleErrorState = (error: unknown, action: string): void => {
    setErrorInAudio(true);
    setIsLoading(false);
    trackError(`failed to ${action} the audio`, error);
  };

  const handleTogglePlay = (audioRefCurrent: HTMLAudioElement | null): void => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      audioRefCurrent?.pause();
      setIsPlaying(false);
    } else {
      audioRefCurrent?.play();
      startTimer();
      setIsPlaying(true);
    }
  };

  const handlePlay = async (): Promise<void> => {
    try {
      setErrorInAudio(false);
      setIsLoading(true);
      const audioRefCurrent = audioRef.current;
      if (!audioPlayerInitialised) {
        audioRefCurrent?.load();
        audioInit();
      }
      const isValidURL = await isValidRecordingURL(fileURL);
      if (!isValidURL) {
        setErrorInAudio(true);
        setIsLoading(false);
        setDuration({ seconds: 0, minutes: 0 });
        return;
      }
      setIsLoading(
        (audioRef.current && audioRef.current.readyState <= AudioReadyState.HaveCurrentData) ??
          false
      );
      setAudioPlayerInitialised(true);
      handleTogglePlay(audioRefCurrent);
    } catch (error) {
      handleErrorState(error, isPlaying ? 'play' : 'pause');
    }
  };

  const handleAudioEnd = (): void => {
    if (isPlaying) {
      try {
        setIsPlaying(false);
        setAudioSeekTime(0);
        setCurrentTime({ seconds: 0, minutes: 0 });
        clearInterval(intervalRef.current);
        const audioRefCurrent = audioRef.current;
        if (audioRefCurrent) {
          audioRefCurrent.currentTime = 0;
        }
      } catch (error) {
        trackError('failed to handle audio end', error);
      }
    }
  };

  const handleSeekBar = (event: React.ChangeEvent<HTMLInputElement>): void => {
    try {
      const { value } = event.target;
      const numberValue = Number(value);
      const audioRefCurrent = audioRef.current;
      if (audioRefCurrent) {
        clearInterval(intervalRef.current);
        audioRefCurrent.currentTime = numberValue;
        setAudioSeekTime(audioRefCurrent.currentTime);
        setCurrentTime(getAudioTimeInMinuteAndSeconds(numberValue));
      }
    } catch (error) {
      trackError('failed to handle seek bar', error);
    }
  };

  const trackDuration = (audioRef.current && audioRef.current?.duration) || 0;

  const totalDuration = getTotalDuration(audioSeekTime, trackDuration) as number;

  const getClassNames = (valueControls?: boolean): string => {
    let classNames = '';
    if (isLoading) classNames = `${classNames} loading`;
    if (valueControls && enableDownload) classNames = `${classNames} download-enabled`;
    if (!valueControls && (isPlaying || totalDuration > 0))
      classNames = `${classNames} seek-bar-active`;
    return classNames;
  };
  const handleRetry = (): void => {
    handlePlay();
  };
  const renderAudioControls = (): JSX.Element => {
    if (isLoading) {
      return <Spinner />;
    }
    if (errorInAudio) {
      return (
        <Icon
          name="refresh"
          variant={IconVariant.Filled}
          onClick={handleRetry}
          customStyleClass={styles.retry_icon}
        />
      );
    }
    return <AudioControls isPlaying={isPlaying} handlePlay={handlePlay} />;
  };

  const renderAudioPlayerContent = (): JSX.Element => {
    if (fileURL) {
      return (
        <div className={`${styles.audio_player_container}`}>
          {renderAudioControls()}
          <Durations currentTime={currentTime} duration={duration} disabled={errorInAudio} />
          <SeekBar
            disabled={errorInAudio || isLoading}
            audioSeekTime={audioSeekTime}
            duration={audioRef.current?.duration}
            handleSeekBar={handleSeekBar}
            startTimer={startTimer}
            className={getClassNames()}
          />
          <VolumeControl
            audioRef={audioRef}
            className={getClassNames(true)}
            disabled={errorInAudio}
          />
          <DownloadFile
            fileURL={fileURL}
            enableDownload={shouldEnableDownload(fileURL, enableDownload as boolean)}
          />
          <Audio fileURL={fileURL} audioRef={audioRef} handleAudioEnd={handleAudioEnd} />
        </div>
      );
    }
    return (
      <div className={styles.audio_player_container}>
        <div className={styles.invalid_audio_wrapper}>
          <InvalidAudioInfo />
          <DownloadFile
            fileURL={fileURL}
            enableDownload={shouldEnableDownload(fileURL, enableDownload as boolean)}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderAudioPlayerContent()}
      {errorInAudio ? <InvalidAudioInfo /> : null}
    </div>
  );
};

export default AudioPlayer;
