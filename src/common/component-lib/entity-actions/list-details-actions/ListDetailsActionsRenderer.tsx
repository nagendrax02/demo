import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';
import { useSmartViewTab } from 'apps/smart-views/components/smartview-tab/smartview-tab.store';
import HandleAction from 'apps/entity-details/components/vcard/actions/handle-action/HandleAction';
import { useEffect, useState } from 'react';
import { IActionMenuItem, IButtonAction } from 'apps/entity-details/types/entity-data.types';
import { EntityType } from 'common/types';
import { getListId, getListType } from 'common/utils/helpers/helpers';
import { IEntityIds } from 'apps/entity-details/types/entity-store.types';
import { DEFAULT_REPRESENTATION_NAME } from 'apps/entity-details/constants';

const ListDetailsActionsRenderer = ({
  tabId,
  selectedAction
}: {
  tabId: string;
  selectedAction: IMenuItem | null;
}): JSX.Element => {
  const [actionClicked, setActionClicked] = useState<IMenuItem>();
  const tabData = useSmartViewTab(tabId);

  const coreData = {
    tabId: tabId,
    entityDetailsType: EntityType.Lists,
    entityIds: {
      [EntityType.Lead]: '',
      [EntityType.Account]: '',
      [EntityType.Opportunity]: '',
      [EntityType.Activity]: '',
      [EntityType.Task]: '',
      [EntityType.AccountActivity]: '',
      [EntityType.Lists]: getListId(),
      [EntityType.Ticket]: ''
    } as IEntityIds,
    entityRepNames: {
      ...DEFAULT_REPRESENTATION_NAME,
      [EntityType.Lead]: tabData?.representationName,
      [EntityType.Lists]: tabData?.representationName
    },
    leadType: tabData?.leadTypeConfiguration?.[0]?.LeadTypeInternalName
  };

  const customConfig = {
    ListType: getListType() as string,
    id: getListId() as string,
    Name: tabData?.headerConfig?.primary?.title,
    type: '6' //scheduled email type
  };

  useEffect(() => {
    setActionClicked(selectedAction as IMenuItem | undefined);
  }, [selectedAction]);

  return (
    <>
      {actionClicked ? (
        <HandleAction
          action={{
            ...selectedAction,
            id: selectedAction?.id ?? (selectedAction?.value as string),
            title: selectedAction?.label as string
          }}
          setActionClicked={
            setActionClicked as React.Dispatch<
              React.SetStateAction<IActionMenuItem | IButtonAction | null>
            >
          }
          coreData={coreData}
          customConfig={customConfig}
        />
      ) : null}
    </>
  );
};

export default ListDetailsActionsRenderer;
