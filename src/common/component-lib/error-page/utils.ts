import { trackError } from 'common/utils/experience';

export const getMailSubjectMessage = (): string => {
  return encodeURIComponent('Marvin | Error | Unhandled Exception Occurred');
};

export const getMailBodyMessage = (componentStack?: string): string => {
  try {
    const encodedMessage = encodeURIComponent(
      `Hi Team,\nPlease find the below Details\n ${componentStack ?? ''}`
    );

    return encodedMessage?.length < 1900
      ? encodedMessage
      : encodedMessage.slice(0, 1900).concat('...');
  } catch (error) {
    trackError(error);
  }
  return '';
};
