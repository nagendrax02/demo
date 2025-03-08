import { trackError } from 'common/utils/experience/utils/track-error';
import { IAugmentedAttributeFields } from 'apps/entity-details/types/entity-data.types';
import { CallerSource, Module, httpPost } from 'common/utils/rest-client';
import {
  IChildLeadData,
  IGenerateCFSFieldRowsData,
  IHeaderData,
  IRowData,
  ISectionData
} from './merge-lead-types';
import { renderCellBasedOnFieldRenderType } from './merge-lead-field-renderer';
import { API_ROUTES } from 'common/constants';
import { MERGE_LEAD_CFS_TOOLTIP_PREVIEW } from './constants';
import { DataType } from 'common/types/entity/lead';

interface IGetCFSLeadData {
  customObjectProspectId: string;
  isChildLead: boolean;
  leadId: string;
  schemaName: string;
}

interface IHandleCFSFieldRender {
  fieldPropertyData: IAugmentedAttributeFields;
  lead: IChildLeadData;
  cfsFieldObj: Record<string, string> | null;
}

async function getCFSLeadData({
  customObjectProspectId,
  leadId,
  schemaName,
  isChildLead
}: IGetCFSLeadData): Promise<Record<string, string> | null> {
  try {
    if (!leadId || !schemaName || !customObjectProspectId) {
      return null;
    } else {
      const response: Record<string, string> = await httpPost({
        path: API_ROUTES.customFieldData,
        module: Module.Marvin,
        body: {
          CustomObjectProspectId: customObjectProspectId,
          LeadId: leadId,
          SchemaName: schemaName,
          IsChildLead: isChildLead
        },
        callerSource: CallerSource.ActivityHistory
      });
      return response;
    }
  } catch (err) {
    trackError(err);
    return null;
  }
}

function generateHeaderData(): IHeaderData {
  const headerData: IHeaderData = {
    row: {
      columns: [
        { dataToShow: 'Field', className: MERGE_LEAD_CFS_TOOLTIP_PREVIEW },
        { dataToShow: 'Value', className: MERGE_LEAD_CFS_TOOLTIP_PREVIEW }
      ]
    }
  };
  return headerData;
}

function generateCFSFieldRows({
  fieldPropertyData,
  lead,
  cfsFieldObj
}: IHandleCFSFieldRender): IGenerateCFSFieldRowsData | null {
  if (!cfsFieldObj) return null;
  if (fieldPropertyData?.dataType === DataType.CustomObject) {
    const headerData: IHeaderData = generateHeaderData();
    const rows: IRowData[] = [];
    if (fieldPropertyData?.cfsFields?.length) {
      fieldPropertyData.cfsFields.forEach((cfsField) => {
        const augmentedCfsField = { ...cfsField };
        augmentedCfsField.value = cfsFieldObj[cfsField?.id] ?? augmentedCfsField.value;
        const row: IRowData = {
          columns: [
            { dataToShow: cfsField.name, className: MERGE_LEAD_CFS_TOOLTIP_PREVIEW },
            {
              dataToShow: renderCellBasedOnFieldRenderType({
                fieldPropertyData: augmentedCfsField,
                lead
              }),
              className: MERGE_LEAD_CFS_TOOLTIP_PREVIEW
            }
          ]
        };
        rows.push(row);
      });
    }
    const sectionData: ISectionData = {
      rows
    };
    return {
      headerData,
      sectionData: [sectionData]
    };
  }
  return null;
}

export default getCFSLeadData;

export { generateCFSFieldRows };
