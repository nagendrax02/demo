import { getAudioTimeInMinuteAndSeconds, getAudioDuration, getTotalDuration } from '../utils';

describe('audio-player utils', () => {
  describe('getAudioTimeInMinuteAndSeconds', () => {
    it('Should convert 125 seconds to 2 minutes and  5 seconds', () => {
      // Act
      const result = getAudioTimeInMinuteAndSeconds(125);

      // Assert
      expect(result).toEqual({ minutes: 2, seconds: 5 });
    });

    it('Should handle zero duration', () => {
      // Act
      const result = getAudioTimeInMinuteAndSeconds(0);

      // Assert
      expect(result).toEqual({ minutes: 0, seconds: 0 });
    });
  });

  describe('getAudioDuration', () => {
    it('Should retrieve audio duration from audio element', () => {
      // Arrange
      const mockAudioRef = {
        current: {
          duration: 245
        }
      };

      // Act
      const result = getAudioDuration(mockAudioRef as any);

      // Assert
      expect(result).toEqual({ minutes: 4, seconds: 5 });
    });

    it('Should return zero duration if audio element is not present', () => {
      // Arrange
      const mockAudioRef = { current: null };

      // Act
      const result = getAudioDuration(mockAudioRef);

      // Assert
      expect(result).toEqual({ minutes: 0, seconds: 0 });
    });
  });

  describe('getTotalDuration', () => {
    it('Should calculate total duration percentage correctly', () => {
      // Act
      const result = getTotalDuration(30, 120);

      // Assert
      expect(result).toBe(25);
    });
  });
});
