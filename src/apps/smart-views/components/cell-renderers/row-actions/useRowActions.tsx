import { useEffect, useState } from 'react';
import {
  getTabData,
  useActiveTab,
  useEntityManage,
  useRepName,
  useSmartViewRowActions,
  useTabType
} from '../../smartview-tab/smartview-tab.store';
import { IRecordType, IRowActionConfig } from '../../smartview-tab/smartview-tab.types';
import { getAugmentedRowActions } from 'apps/smart-views/utils/sv-process';
import { DEFAULT_ENTITY_REP_NAMES, MOCK_ENTITY_DETAILS_CORE_DATA } from 'common/constants';
import { getCustomConfig } from 'apps/smart-views/utils/utils';
import { EntityType } from 'common/types';
import { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import { IEntityDetailsCoreData } from 'apps/entity-details/types/entity-data.types';
import { excludeNameFromRecord, getFilteredAction } from '../utils';
import { getItem, StorageKey } from 'common/utils/storage-manager';

interface IUseRowActions {
  actions: IRowActionConfig | undefined;
  loading: boolean;
  actionHelpers: {
    coreData: IEntityDetailsCoreData;
    customConfig: Record<string, string>;
  };
}

// eslint-disable-next-line complexity
const useRowActions = ({ record }: { record: IRecordType }): IUseRowActions => {
  const initialActions = useSmartViewRowActions() || ({} as IRowActionConfig);
  const [loading, setLoading] = useState<boolean>(true);
  const [actions, setActions] = useState<IRowActionConfig | undefined>();
  const entityType = useTabType();
  const isManageTab = useEntityManage();
  const tabId = useActiveTab();
  const entityRepName = useRepName();
  const leadRepName = useLeadRepName();

  const isEssTenantEnabled =
    ((getItem(StorageKey.Setting) as Record<string, string | object>) || {})
      ?.EnableESSForLeadManagement === '1';

  // Name is subject name of task records. It is being sent as form config which impacts form name
  // but it is required for manage list tabs, hence keeping the name in record
  let augmentedRecord = record;
  if (excludeNameFromRecord(tabId)) {
    const { Name, ...otherParams } = record;
    augmentedRecord = otherParams;
  }

  const customConfig = getCustomConfig(augmentedRecord);

  const augmentRowActions = async (): Promise<void> => {
    const augmentedActions = await getAugmentedRowActions({
      record: customConfig,
      repName: leadRepName,
      rowActions: initialActions,
      entityType,
      tabId,
      isManageTab,
      isEssTenantEnabled
    });
    setActions(
      getFilteredAction({
        action: augmentedActions,
        record: customConfig,
        tabId,
        isHiddenList: getTabData?.(tabId)?.gridConfig?.fetchCriteria?.ShowHidden
      })
    );
    setLoading(false);
  };

  useEffect(() => {
    const promise = window[`PROCESS_${tabId}`] as Promise<void> | undefined;
    if (promise) {
      setLoading(true);
      promise.finally(() => {
        augmentRowActions();
        delete window[`PROCESS_${tabId}`];
      });
    } else {
      augmentRowActions();
    }
  }, [initialActions, leadRepName, tabId, record]);

  const coreData: IEntityDetailsCoreData = {
    ...MOCK_ENTITY_DETAILS_CORE_DATA,
    entityDetailsType: entityType,
    entityIds: {
      ...MOCK_ENTITY_DETAILS_CORE_DATA.entityIds,
      lead: record.ProspectId || record.P_ProspectID || '',
      opportunity: record?.O_mx_Custom_1 ? (record.RelatedActivityId as string) : '', //O_mx_Custom_1 is opportunity name, if O_mx_Custom_1's value is there then use RelatedActivityId for opportunityId
      [entityType]: record?.id,
      EntityTypeId: getTabData(tabId)?.entityCode ?? '',
      relatedEntityTypeId: getTabData(tabId)?.relatedEntityCode
    },
    entityRepNames: {
      ...DEFAULT_ENTITY_REP_NAMES,
      [entityType]: { ...entityRepName }
    },
    eventCode: Number(record.ActivityEvent || '-1'),
    leadType:
      record?.P_LeadType ??
      record?.LeadType ??
      getTabData(tabId)?.leadTypeConfiguration?.[0]?.LeadTypeInternalName ??
      ''
  };

  if (entityType === EntityType.Task) {
    coreData.entityRepNames = {
      ...coreData.entityRepNames,
      [EntityType.Lead]: leadRepName
    };
  }

  if (entityType === EntityType.Lists) {
    coreData.entityRepNames = {
      ...coreData.entityRepNames,
      [EntityType.Lead]: entityRepName
    };
  }

  return { actions, loading, actionHelpers: { coreData, customConfig } };
};

export default useRowActions;
