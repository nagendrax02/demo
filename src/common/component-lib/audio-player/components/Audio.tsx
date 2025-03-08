import { IAudio } from '../audio-player.types';

const Audio = ({ fileURL, audioRef, handleAudioEnd }: IAudio): JSX.Element => {
  return (
    <audio
      className="audio-element"
      ref={audioRef}
      onEnded={handleAudioEnd}
      preload="metadata"
      data-testid="audio-element">
      <track kind="captions" />
      <source src={fileURL} type="audio/mpeg" />
      <source src={fileURL} type="audio/ogg" />
      <source src={fileURL} type="audio/wav" />
      <source src={fileURL} type="audio/aac" data-testid="audio-source" />
    </audio>
  );
};

export default Audio;
