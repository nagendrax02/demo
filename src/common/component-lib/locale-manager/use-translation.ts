import { trackError } from 'common/utils/experience/utils/track-error';
import { useState, useEffect } from 'react';
import { IUseTranslation, IUseTranslationProps } from './locale.types';
import { useLanguageStore } from './store/language.store';
import { getTranslatedText } from './utils';

const useTranslation = (props: IUseTranslationProps): IUseTranslation => {
  const { translationFile } = props;
  const { language } = useLanguageStore();
  const [isLoading, setIsLoading] = useState(true);
  const [translation, setTranslation] = useState<Record<string, string>>();

  const translate = (key: string, replacementKeys?: Record<string, string>): string => {
    return isLoading ? '' : getTranslatedText((translation || {})[key] || key, replacementKeys);
  };

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        if (language && translationFile[language]) {
          const data = (await translationFile[language]()) as { default: Record<string, string> };
          setTranslation(data?.default);
        }
        setIsLoading(false);
      } catch (error) {
        trackError(error);
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return { translate };
};

export default useTranslation;
