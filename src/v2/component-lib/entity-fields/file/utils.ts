import { trackError } from 'common/utils/experience/utils/track-error';
import { IEntityProperty } from 'common/types/entity/lead/metadata.types';
import { IFileInfo, fetchCFSFiles } from 'common/utils/files';
import { FileDataSource } from 'common/utils/files/files.type';
import { CallerSource } from 'common/utils/rest-client';
import { IActivityFields } from 'common/component-lib/modal/activity-details-modal/activity-details.types';

interface IAugmentedCFSFile {
  name: string;
  previewUrl: string;
}

const augmentedCFSFiles = ({
  data,
  name,
  value,
  preventDuplicateFiles
}: {
  data: IFileInfo | null;
  name: string;
  value: string;
  preventDuplicateFiles?: boolean;
}): IAugmentedCFSFile[] => {
  if (!data) {
    return [];
  }

  //API response contains duplicated files and last index of unique file is value?.length
  if (preventDuplicateFiles && value?.split(',')?.length) {
    return value?.split(',').map((file, index) => {
      return {
        name: `${name} - ${index + 1}`,
        previewUrl: data?.Files?.[index]?.FileUrl
      };
    });
  }
  return data?.Files?.map((file, index) => {
    return {
      name: `${name} - ${index + 1}`,
      previewUrl: file?.FileUrl
    };
  });
};

interface IGetFileData {
  leadId: string | undefined;
  entityId: string | undefined;
  property: IEntityProperty;
  callerSource: CallerSource;
  isActivity?: boolean;
  preventDuplicateFiles?: boolean;
}

// eslint-disable-next-line complexity, max-lines-per-function
const getFileData = async ({
  leadId,
  entityId,
  property,
  isActivity,
  callerSource,
  preventDuplicateFiles
}: IGetFileData): Promise<IAugmentedCFSFile[]> => {
  if (!property || !property?.parentSchemaName) {
    return [];
  }

  try {
    if (property?.isCFSField) {
      const response = await fetchCFSFiles(
        {
          leadId: leadId || entityId || null,
          documentsToFetch: [
            {
              EntityId: entityId || leadId || null,
              DataSource: FileDataSource.CFS,
              FieldSchema: property?.parentSchemaName?.replace('P_', ''),
              CFSSchema: property?.schemaName
            }
          ],
          entityId: isActivity ? entityId : null
        },
        callerSource
      );
      return augmentedCFSFiles({
        data: response,
        name: property?.customDisplayName || property?.name,
        value: property?.value,
        preventDuplicateFiles
      });
    }
    return [];
  } catch (error) {
    trackError(error);
    return [];
  }
};

// eslint-disable-next-line max-lines-per-function, complexity
const getCfsFiles = async ({
  activityId,
  leadId,
  entityId,
  property,
  cfsSchema,
  callerSource,
  preventDuplicateFiles
}: {
  activityId: string;
  leadId?: string;
  entityId?: string;
  cfsSchema?: string;
  property: IActivityFields;
  callerSource: CallerSource;
  preventDuplicateFiles?: boolean;
}): Promise<IAugmentedCFSFile[]> => {
  if (!(entityId || leadId) || !property?.Value) {
    return [];
  }

  try {
    const response = await fetchCFSFiles(
      {
        leadId: leadId || '',
        entityId: entityId || activityId,
        documentsToFetch: [
          {
            EntityId: activityId,
            DataSource: FileDataSource.CFS,
            FieldSchema: cfsSchema || '',
            CFSSchema: property.SchemaName
          }
        ]
      },
      callerSource
    );
    return augmentedCFSFiles({
      data: response,
      name: property.DisplayName,
      value: property?.Value,
      preventDuplicateFiles
    });
  } catch (error) {
    trackError(error);
    return [];
  }
};

export { getFileData, getCfsFiles };
export type { IAugmentedCFSFile };
