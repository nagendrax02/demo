import DocumentGrid from './components/documents-grid';
import { useEffect } from 'react';
import useDocumentStore, { fetchDocuments } from './documents.store';
import Filters from './components/Filters';
import { IEntityIds, IEntityRepNames } from '../entity-details/types/entity-store.types';
import { EntityType } from 'common/types';
import useDocuments from './use-documents';

export interface IDocumentProps {
  getData: () => {
    entityType: EntityType;
    entityIds: IEntityIds;
    entityRepNames: IEntityRepNames;
    entityTypeRepName?: string;
  };
}

const Documents = (props: IDocumentProps): JSX.Element => {
  const { getData } = props;
  const { entityType, entityIds, entityRepNames, entityTypeRepName } = getData();
  useDocuments({
    entityType: entityType,
    entityTypeRepName: entityTypeRepName
  });
  const source = useDocumentStore((state) => state.source);
  const fileTypeFilter = useDocumentStore((state) => state.fileTypeFilter);
  const isDataLoaded = useDocumentStore((state) => state.isDataLoaded);

  useEffect(() => {
    if (isDataLoaded) {
      (async (): Promise<void> => {
        await fetchDocuments({ source, entityRepNames, entityIds, entityType, fileTypeFilter });
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, fileTypeFilter, isDataLoaded]);

  return (
    <div>
      <Filters
        entityType={entityType}
        entityRepNames={entityRepNames}
        entityTypeRepName={entityTypeRepName}
      />
      <DocumentGrid entityIds={entityIds} />
    </div>
  );
};

export default Documents;
