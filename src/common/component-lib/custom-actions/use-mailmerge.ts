import { trackError } from 'common/utils/experience/utils/track-error';
import { useEffect, useState } from 'react';
import { IConfig } from './cutom-actions.types';
import { safeParseJson } from 'common/utils/helpers';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { ERROR_MSG } from 'common/utils/rest-client/constant';
import { getMailMergedData } from './utils';
import { CallerSource } from 'common/utils/rest-client';

interface IMailMerge {
  loading: boolean;
  mailMergeContent: Record<string, string>;
}

export const useMailMerge = ({
  config,
  callerSource
}: {
  config: IConfig;
  callerSource: CallerSource;
}): IMailMerge => {
  const [mailMergeContent, setMailMergeContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const { showAlert } = useNotification();

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        setLoading(true);
        const content: string = await getMailMergedData(config, callerSource);
        let parsedContent = safeParseJson(content) as Record<string, string>;
        if (typeof parsedContent === 'string') {
          parsedContent = safeParseJson(parsedContent) as Record<string, string>;
        }
        const { configData, configURL } = parsedContent;
        setMailMergeContent({ configData, configURL });
      } catch (error) {
        showAlert({ type: Type.ERROR, message: ERROR_MSG.generic });
        trackError(error);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(config)]);

  return { mailMergeContent, loading };
};
