import { useEffect, useState } from 'react';
import { CallerSource } from 'common/utils/rest-client';
import { EntityType } from 'common/types';
import { getConfig } from './utils/common';
import { ILeadTypeConfiguration } from 'apps/smart-views/smartviews.types';

const useBulkUpdateConfig = ({
  eventCode,
  callerSource,
  entityType,
  leadTypeConfiguration
}: {
  entityType: EntityType;
  callerSource: CallerSource;
  eventCode?: string;
  leadTypeConfiguration?: ILeadTypeConfiguration[];
}): { isLoading: boolean } => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);
      await getConfig({ entityType, callerSource, eventCode, leadTypeConfiguration });
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, eventCode]);

  return { isLoading: isLoading };
};

export default useBulkUpdateConfig;
