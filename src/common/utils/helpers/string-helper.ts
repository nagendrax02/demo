import { trackError } from 'common/utils/experience/utils/track-error';
interface IDOMPurify {
  sanitize: (value: string, config: Record<string, unknown>) => string;
}

const getPurifiedContent = async (
  value: string,
  preserveLinkTarget?: boolean,
  disableOpenInNewTab?: boolean
): Promise<string> => {
  try {
    const module = (await import('dompurify')).default as IDOMPurify;
    let sanitizedValue = module?.sanitize(
      value,
      preserveLinkTarget ? { ADD_ATTR: ['target'] } : {}
    );
    if (!preserveLinkTarget && !disableOpenInNewTab) {
      sanitizedValue = sanitizedValue?.replace(/<a /g, '<a target="_blank" ') as string;
    }
    return sanitizedValue;
  } catch (error) {
    trackError(error);
  }
  return '';
};

const extractHTMLContent = (htmlContent: string): string => {
  try {
    const span = document?.createElement('span');
    span.innerHTML = htmlContent;
    return span?.textContent || span?.innerText || '';
  } catch (error) {
    trackError(error);
  }
  return '';
};

export { getPurifiedContent, extractHTMLContent };
