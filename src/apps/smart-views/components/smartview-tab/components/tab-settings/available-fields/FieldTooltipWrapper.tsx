import TooltipWrapper from './TooltipWrapper';
import { HeaderAction } from 'apps/smart-views/constants/constants';
import { IAvailableField } from 'apps/smart-views/augment-tab-data/common-utilities/common.types';
import { IEntityExportConfig } from '../tab-settings.types';
import { IMenuItem } from 'common/component-lib/action-wrapper/action-wrapper.types';

interface IFieldTooltipWrapper {
  children: React.ReactElement;
  metadata: IAvailableField;
  entityExportConfig?: IEntityExportConfig;
  selectedAction: IMenuItem | null;
  maxAllowedSelection: number;
  selectedFields: IAvailableField[];
}

const FieldTooltipWrapper = (props: IFieldTooltipWrapper): JSX.Element => {
  const {
    children,
    metadata,
    entityExportConfig,
    selectedAction,
    maxAllowedSelection,
    selectedFields
  } = props;

  const maxSelectionLimitReached = selectedFields?.length >= maxAllowedSelection;

  const canShowTooltip = (): boolean => {
    if (metadata?.isRestricted) {
      return true;
    } else if (maxSelectionLimitReached && !metadata?.isSelected) {
      return true;
    }
    return false;
  };

  const getTooltipMessage = (): string => {
    if (metadata?.isRestricted) {
      return (
        entityExportConfig?.restrictionMessage ??
        `You don't have permission to view this ${
          selectedAction?.value === HeaderAction.SelectColumns ? 'column' : 'field'
        }`
      );
    } else if (maxSelectionLimitReached) {
      return 'You’ve reached the selection limit';
    }

    return '';
  };

  return (
    <TooltipWrapper
      key={metadata?.schemaName}
      message={getTooltipMessage()}
      showTooltip={canShowTooltip()}>
      {children}
    </TooltipWrapper>
  );
};

export default FieldTooltipWrapper;
