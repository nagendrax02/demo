import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { EntityType } from 'common/types';
import { useEffect } from 'react';
import { setIsDataLoaded, setSource } from './documents.store';

interface IUseDocumentsProps {
  entityType: EntityType;
  entityTypeRepName?: string;
}

const entityDefaultSourceMap: Record<string, IOption> = {
  [EntityType.Lead]: { label: 'Attachments', value: 'attachment' },
  [EntityType.Opportunity]: { label: 'Opportunity', value: 'Opportunity' }
};

export const getDefaultSource = (entityType: EntityType, entityTypeRepName?: string): IOption => {
  let source = entityDefaultSourceMap?.[entityType];
  if (entityTypeRepName) {
    source = {
      ...source,
      label: source.label?.replace('Opportunity', entityTypeRepName)
    };
  }
  return source;
};

const useDocuments = (props: IUseDocumentsProps): void => {
  const { entityType, entityTypeRepName } = props;

  useEffect(() => {
    const defaultSource = getDefaultSource(entityType, entityTypeRepName);
    setSource(defaultSource);
    setIsDataLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType]);
};

export default useDocuments;
