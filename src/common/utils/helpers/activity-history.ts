const MINUTE = 'minute';
const SECOND = 'second';
const HOUR = 'hour';

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;

export const noteParser = (str: string): { [key: string]: string } | null => {
  if (!str) return null;
  const result = str
    .replace('{keyvalueinfo}{', '')
    .replaceAll('{NEXT}', '{next}')
    .split('{next}')
    .reduce(
      (acc, item) => {
        const [key, value] = item.split('{=}');
        if (key) {
          acc[key] = value;
        }
        return acc;
      },
      {} as { [key: string]: string }
    );

  return result;
};

export const customActivityParser = (str: string): { [key: string]: string } | null => {
  if (!str) return null;
  const result = str.split('{next}').reduce(
    (acc, item) => {
      const [key, value] = item.split('{=}');
      if (key) {
        acc[key] = value;
      }
      return acc;
    },
    {} as { [key: string]: string }
  );

  return result;
};

const formatTimeMessage = (value: number, type: string): string => {
  const newValue = Math.floor(value);
  return `${newValue} ${type}${newValue === 1 ? '' : 's'}`;
};

export const convertSecondsToMinute = (seconds: number): string => {
  const hours = Math.floor(seconds / SECONDS_IN_HOUR);
  const minutes = Math.floor((seconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
  const remainingSeconds = seconds % SECONDS_IN_MINUTE;

  let result = '';

  if (hours > 0) {
    result += `${formatTimeMessage(hours, HOUR)} `;
  }

  if (minutes > 0) {
    result += `${formatTimeMessage(minutes, MINUTE)} `;
  }

  if (remainingSeconds > 0 || result === '') {
    result += formatTimeMessage(remainingSeconds, SECOND);
  }

  return result.trim();
};
