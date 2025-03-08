let mainTimeoutId: NodeJS.Timeout | undefined;
let shortTimeoutId: NodeJS.Timeout | string | undefined;

export const startTimer = (
  updateMinutes: React.Dispatch<React.SetStateAction<number>>,
  minutes: number,
  updateText: React.Dispatch<React.SetStateAction<string>>
): void => {
  if (mainTimeoutId) {
    clearTimeout(mainTimeoutId);
  }
  if (!shortTimeoutId) {
    shortTimeoutId = setTimeout(() => {
      shortTimeoutId = 'completed';
      updateText('less than a minute ago');
      if (mainTimeoutId) {
        clearTimeout(mainTimeoutId);
      }
      mainTimeoutId = setTimeout(() => {
        updateMinutes((prevMinute) => prevMinute + 1);
        updateText(`${minutes + 1} min(s) ago`);
      }, 40000);
    }, 20000);
  } else {
    if (minutes > 0) updateText(`${minutes} min(s) ago`);
    mainTimeoutId = setTimeout(() => {
      updateMinutes((prevMinute) => prevMinute + 1);
      updateText(`${minutes + 1} min(s) ago`);
    }, 60000);
  }
};

export const restartTimer = (
  updateMinutes: React.Dispatch<React.SetStateAction<number>>,
  minutes: number,
  updateText: React.Dispatch<React.SetStateAction<string>>
): void => {
  if (shortTimeoutId && shortTimeoutId !== 'completed') {
    clearTimeout(shortTimeoutId as NodeJS.Timeout);
  }
  shortTimeoutId = undefined;
  updateMinutes(0);
  updateText('just now');
  startTimer(updateMinutes, minutes, updateText);
};
