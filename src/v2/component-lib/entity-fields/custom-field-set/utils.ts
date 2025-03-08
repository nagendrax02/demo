import { trackError } from 'common/utils/experience/utils/track-error';
import { IEntityProperty, RenderType, DataType } from 'common/types/entity/lead/metadata.types';
import { API_ROUTES, MASKED_TEXT } from 'common/constants';
import { INotification } from '@lsq/nextgen-preact/notification/notification.types';
import { CallerSource, httpPost, Module } from 'common/utils/rest-client';
import { downloadFiles } from 'common/utils/files';
import { ICustomObjectAttribute } from 'common/types/entity/lead';

type AugmentedFileList = {
  EntityId: string;
  FieldSchema: string;
  CFSSchema: string;
  DataSource: number;
};

type FetchCFSFilesDownloadDetails = {
  Files: {
    FileUrl: string;
    FileName: string;
  }[];
  ZipFolderName: string;
};

interface IFetchCFSFilesDownloadDetails {
  leadId: string;
  filesList: {
    EntityId: string;
    DataSource: number;
    FieldSchema: string;
    CFSSchema: string;
  }[];
  opportunityId?: string;
  getAllCFSDataOfActivity?: boolean;
}

export const fetchCFSFilesDownloadDetails = async (
  data: IFetchCFSFilesDownloadDetails
): Promise<FetchCFSFilesDownloadDetails | null> => {
  const { leadId, filesList, opportunityId, getAllCFSDataOfActivity } = data;
  try {
    let response: FetchCFSFilesDownloadDetails | null = null;
    if (opportunityId) {
      response = (await httpPost({
        path: API_ROUTES.getFileUrl,
        module: Module.Marvin,
        body: {
          LeadId: leadId,
          EntityId: opportunityId,
          DocumentsToFetch: filesList,
          GetAllCFSDataOfActivity: getAllCFSDataOfActivity || false
        },
        callerSource: CallerSource.LeadDetailsProperties
      })) as FetchCFSFilesDownloadDetails;
    } else {
      response = (await httpPost({
        path: API_ROUTES.getFileUrl,
        module: Module.Marvin,
        body: {
          LeadId: leadId,
          DocumentsToFetch: filesList,
          GetAllCFSDataOfActivity: getAllCFSDataOfActivity || false
        },
        callerSource: CallerSource.OpportunityDetailsProperties
      })) as FetchCFSFilesDownloadDetails;
    }
    return response;
  } catch (error) {
    trackError(error);
    return null;
  }
};

export const getAugmentedFileList = ({
  cfsFieldsData,
  fieldSchema,
  leadId,
  opportunityId
}: {
  cfsFieldsData: ICustomObjectAttribute[];
  fieldSchema: string;
  leadId: string;
  opportunityId: string | undefined;
}): AugmentedFileList[] | null => {
  const files = cfsFieldsData.filter((cfsFieldItem) => {
    return cfsFieldItem.DataType === 'File';
  });

  if (files && files.length) {
    return files.map((file) => {
      return {
        EntityId: opportunityId || leadId,
        FieldSchema: fieldSchema,
        CFSSchema: file.SchemaName,
        DataSource: 6
      };
    });
  }
  return null;
};

export const handleDownloadCFSFiles = async ({
  cfsFieldsData,
  schemaName,
  leadId,
  opportunityId,
  showAlert
}: {
  cfsFieldsData: ICustomObjectAttribute[];
  schemaName: string;
  leadId: string;
  opportunityId?: string;
  showAlert: (notification: INotification) => void;
}): Promise<void> => {
  try {
    const filesList = getAugmentedFileList({
      cfsFieldsData,
      fieldSchema: schemaName,
      leadId,
      opportunityId
    });
    if (filesList && filesList?.length) {
      const fileInfo = await fetchCFSFilesDownloadDetails({ leadId, filesList, opportunityId });
      if (fileInfo) {
        await downloadFiles(fileInfo, showAlert);
      }
    }
  } catch (error) {
    trackError(error);
  }
};

export const isContainsFiles = (
  cfsFieldsData: ICustomObjectAttribute[],
  cfsFieldsLookup: Record<string, string | number | boolean>
): string => {
  const files = cfsFieldsData.filter((cfsFieldItem) => {
    return cfsFieldItem.DataType === 'File';
  });

  if (files && files.length) {
    let concatAllFilenames = '';
    files.forEach((fileItem) => {
      const fileValues = fileItem && cfsFieldsLookup && cfsFieldsLookup?.[fileItem.SchemaName];
      if (fileValues !== 'xxxxx' && fileValues) {
        concatAllFilenames += fileValues;
      }
    });
    return concatAllFilenames;
  }
  return '';
};

const getCFSRenderType = (
  type: string,
  fieldValue: string | number | boolean,
  isAssociatedLeadProperty?: boolean
): RenderType => {
  if (fieldValue === MASKED_TEXT) {
    return RenderType.Text;
  }

  const renderTypeMap: Record<string, RenderType> = {
    File: RenderType.File,
    Lead: RenderType.Lead,
    DateTime: RenderType.DateTime,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    String_TextContent_CMS: RenderType.HTML,
    Date: RenderType.Date,
    ActiveUsers: RenderType.UserName
  };
  if (type === RenderType.ActiveUsers && !isAssociatedLeadProperty) return RenderType.Text;

  return renderTypeMap?.[type] || RenderType.Text;
};

export const getAugmentedCfsFields = ({
  field,
  value,
  parentSchemaName,
  leadId,
  opportunityId,
  isAssociatedLeadProperty
}: {
  field: ICustomObjectAttribute;
  value: string | number | boolean;
  parentSchemaName: string;
  leadId?: string;
  opportunityId?: string;
  isAssociatedLeadProperty?: boolean;
}): IEntityProperty => {
  return {
    id: field?.DisplayName,
    name: field?.DisplayName,
    value: value ? `${value}` : '',
    fieldRenderType: getCFSRenderType(
      field?.RenderType || field?.DataType,
      value,
      isAssociatedLeadProperty
    ),
    schemaName: field?.SchemaName,
    dataType: field?.DataType as string as DataType,
    isCFSField: true,
    parentSchemaName: parentSchemaName,
    entityId: !isAssociatedLeadProperty ? opportunityId : undefined,
    isActivity: !!opportunityId && !isAssociatedLeadProperty,
    leadId: leadId
  };
};
