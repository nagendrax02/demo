import styles from '../../documents.module.css';
import { IDocument } from '../../documents.types';
import { bulkActions, documentsColDefs, gridKey } from '../../constants';
import useDocumentStore from '../../documents.store';
import DocumentsExpandable from './expandable';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Suspense } from 'react';
import { IEntityIds } from 'apps/entity-details/types/entity-store.types';
import { getAugmentedRecords } from 'apps/documents/utils';
import { getDocumentFileData } from './utils';
import Grid, { GridShimmer } from '@lsq/nextgen-preact/grid';
import { getCurrentTheme } from '@lsq/nextgen-preact/v2/stylesmanager';

interface IDocumentGrid {
  entityIds: IEntityIds;
}

const DocumentGrid = (props: IDocumentGrid): JSX.Element => {
  const { entityIds } = props;
  const {
    source,
    search,
    isLoading,
    records = [],
    searchedRecords = []
  } = useDocumentStore((state) => state);
  const { showAlert } = useNotification();
  const handleBulkActions = async (key, selectedDocuments): Promise<void> => {
    const fileInfo = await getDocumentFileData({
      selectedDocuments: Object.values(selectedDocuments) as IDocument[],
      entityIds,
      showAlert
    });

    if (fileInfo) {
      import('common/utils/files/download').then(async ({ downloadFiles }) => {
        await downloadFiles({ Files: fileInfo.Files, ZipFolderName: entityIds?.lead }, showAlert);
      });
    }
  };

  const getIsCFSTypeDocument = (): boolean => {
    if (entityIds?.opportunity) {
      return true;
    }
    return source?.value !== 'attachment';
  };

  const getExpandableRow = ({
    item,
    selectedItems
  }: {
    item: IDocument;
    selectedItems: Record<string, IDocument>;
  }): JSX.Element => {
    return (
      <DocumentsExpandable record={item} entityIds={entityIds} selectedItems={selectedItems} />
    );
  };

  const augmentedDocuments = getAugmentedRecords(search ? searchedRecords : records, entityIds);

  return (
    <div className={styles.grid_container}>
      {isLoading ? (
        <GridShimmer rows={10} columns={4} />
      ) : (
        <Suspense fallback={<GridShimmer rows={10} columns={4} />}>
          <Grid<IDocument>
            enableSelection
            gridKey={gridKey}
            expandableConfig={{
              isExpandedByDefault: true,
              childKey: getIsCFSTypeDocument() ? 'ChildProspectDetailsDocumentsList' : undefined,
              expandableComponent: getIsCFSTypeDocument() ? getExpandableRow : undefined
            }}
            bulkActions={bulkActions}
            columnDefs={documentsColDefs}
            handleBulkActions={handleBulkActions}
            records={augmentedDocuments}
            theme={getCurrentTheme()}
          />
        </Suspense>
      )}
    </div>
  );
};

export default DocumentGrid;
