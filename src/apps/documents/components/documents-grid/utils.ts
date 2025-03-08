import { trackError } from 'common/utils/experience/utils/track-error';
import { IFileInfo } from 'common/utils/files';
import { getBulkDownloadConfig, getCFSBulkDownloadConfig } from '../../utils';
import { IEntityIds } from '../../../entity-details/types/entity-store.types';
import { INotification } from '@lsq/nextgen-preact/notification/notification.types';
import { IDocument } from '../../documents.types';
import { IFiles } from 'common/utils/files/files.type';

interface IGetSegregatedDocuments {
  cfsDocuments: IDocument[];
  normalDocuments: IDocument[];
}

const getSegregatedDocuments = (selectedDocuments: IDocument[]): IGetSegregatedDocuments => {
  const cfsDocuments: IDocument[] = [];
  const normalDocuments: IDocument[] = [];

  selectedDocuments?.forEach((doc) => {
    if (doc?.ChildProspectDetailsDocumentsList?.length) {
      cfsDocuments?.push(doc);
    } else {
      normalDocuments?.push(doc);
    }
  });

  return {
    cfsDocuments,
    normalDocuments
  };
};

interface IGetBulkDocumentPromise {
  cfsDocuments: IDocument[];
  normalDocuments: IDocument[];
  entityIds: IEntityIds;
  showAlert?: (notification: INotification) => void;
}

const getBulkDocumentPromise = ({
  cfsDocuments,
  normalDocuments,
  entityIds,
  showAlert
}: IGetBulkDocumentPromise): Promise<IFileInfo | undefined>[] => {
  const promises: Promise<IFileInfo | undefined>[] = [];

  try {
    if (cfsDocuments?.length) {
      const cfsPromise = getCFSBulkDownloadConfig(
        Object.values(cfsDocuments),
        entityIds?.lead,
        entityIds?.opportunity
      );
      promises?.push(cfsPromise);
    }
    if (normalDocuments?.length) {
      const normalDocPromise = getBulkDownloadConfig({
        records: Object.values(normalDocuments),
        entityId: entityIds?.lead,
        showAlert,
        opportunityId: entityIds?.opportunity
      });
      promises?.push(normalDocPromise);
    }
  } catch (err) {
    trackError(err);
  }

  return promises;
};

interface IGetSegregatedPreSignedDocuments {
  preSignedDocuments: IDocument[];
  nonPreSignedDocuments: IDocument[];
}

export const isPreSignedUrl = (urlString: string): boolean => {
  try {
    const urlObj = new URL(urlString);
    const params = new URLSearchParams(urlObj?.search);
    return params.has('X-Amz-Expires') && params.has('X-Amz-Security-Token');
  } catch (err) {
    trackError(err);
    return false;
  }
};

const getSegregatedPreSignedDocuments = (docs: IDocument[]): IGetSegregatedPreSignedDocuments => {
  const preSignedDocuments: IDocument[] = [];
  const nonPreSignedDocuments: IDocument[] = [];

  docs?.forEach((doc) => {
    if (doc?.AttachmentFileURL && isPreSignedUrl(doc?.AttachmentFileURL)) {
      preSignedDocuments?.push(doc);
    } else {
      nonPreSignedDocuments?.push(doc);
    }
  });

  return {
    preSignedDocuments,
    nonPreSignedDocuments
  };
};

const getAugmentedPreSignedDocuments = (preSignedDocuments: IDocument[]): IFiles[] => {
  const augmentedPreSignedDocs: IFiles[] = preSignedDocuments?.map((doc) => {
    return { ...doc, FileName: doc?.AttachmentName, FileUrl: doc?.AttachmentFileURL };
  });

  return augmentedPreSignedDocs;
};

interface IGetDocumentFileData {
  selectedDocuments: IDocument[];
  entityIds: IEntityIds;
  showAlert?: (notification: INotification) => void;
}

export const getDocumentFileData = async ({
  selectedDocuments,
  entityIds,
  showAlert
}: IGetDocumentFileData): Promise<IFileInfo | undefined> => {
  const { cfsDocuments, normalDocuments } = getSegregatedDocuments(selectedDocuments);

  const { preSignedDocuments, nonPreSignedDocuments } =
    getSegregatedPreSignedDocuments(normalDocuments);

  const documentPromise = getBulkDocumentPromise({
    cfsDocuments,
    normalDocuments: nonPreSignedDocuments,
    showAlert,
    entityIds
  });

  const [cfsFiles, normalFiles] = await Promise.all(documentPromise);

  const augmentedPreSignedDocuments = getAugmentedPreSignedDocuments(preSignedDocuments);

  const fileData: IFileInfo = {
    Files: [
      ...(cfsFiles?.Files || []),
      ...(normalFiles?.Files || []),
      ...augmentedPreSignedDocuments
    ],
    ZipFolderName: cfsFiles?.ZipFolderName || normalFiles?.ZipFolderName || ''
  };

  return fileData;
};
