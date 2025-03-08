import { classNames } from 'common/utils/helpers/helpers';
import styles from './select-filter-dropdown.module.css';
import { DropdownItem } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown';
import { IconButton } from '@lsq/nextgen-preact/v2/button';
import Pin from 'assets/custom-icon/Pin';
import { IFilterConfig } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import Tooltip from '@lsq/nextgen-preact/tooltip';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { Theme } from '@lsq/nextgen-preact/common/common.types';

interface IOtherFilters {
  filters: string[];
  bySchemaName: IFilterConfig;
  onPinClick: (filter: string, isPinned: boolean) => void;
  onOptionClick: (filter: string) => void;
  disablePinAction: boolean;
}

const OtherFilters = (props: IOtherFilters): JSX.Element => {
  const { filters, bySchemaName, onPinClick, onOptionClick, disablePinAction } = props;

  function getTooltipContent(schemaName: string): string {
    if (!bySchemaName[schemaName].disablePinAction) {
      return disablePinAction ? 'You’ve reached the pinning limit' : '';
    }

    return bySchemaName[schemaName].disablePinActionTooltip ?? '';
  }

  return (
    <>
      <DropdownItem className={classNames('ng_p_2_sb', styles.section_header)} disabled>
        Other Filters
      </DropdownItem>
      {filters?.map((filter) => (
        <DropdownItem
          key={filter}
          onSelect={() => {
            onOptionClick(filter);
          }}
          title={bySchemaName[filter].label}
          className={styles.filter_item}>
          <span className={styles.filter_option}>{bySchemaName[filter].label}</span>
          <Tooltip
            content={getTooltipContent(filter)}
            placement={Placement.Horizontal}
            theme={Theme.Dark}
            trigger={[Trigger.Hover]}>
            <IconButton
              icon={<Pin type="outline" />}
              onClick={(event) => {
                event.stopPropagation();
                onPinClick(filter, true);
              }}
              variant="tertiary-gray"
              size="xs"
              customStyleClass={
                disablePinAction || bySchemaName[filter].disablePinAction
                  ? styles.pin_outline_disable
                  : styles.pin_outline
              }
              disabled={disablePinAction}
              title=""
            />
          </Tooltip>
        </DropdownItem>
      ))}
    </>
  );
};

export default OtherFilters;
