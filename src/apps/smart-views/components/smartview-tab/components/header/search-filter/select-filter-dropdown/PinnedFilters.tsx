import { classNames } from 'common/utils/helpers/helpers';
import styles from './select-filter-dropdown.module.css';
import { DropdownItem } from '@lsq/nextgen-preact/v2/dropdown/base-dropdown';
import { IconButton } from '@lsq/nextgen-preact/v2/button';
import Pin from 'assets/custom-icon/Pin';
import { IFilterConfig } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import Tooltip from '@lsq/nextgen-preact/tooltip';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { Theme } from '@lsq/nextgen-preact/common/common.types';

interface IPinnedFilters {
  filters: string[];
  bySchemaName: IFilterConfig;
  onPinClick: (filter: string, isPinned: boolean) => void;
  onOptionClick: (filter: string) => void;
}

const PinnedFilters = (props: IPinnedFilters): JSX.Element => {
  const { filters, bySchemaName, onOptionClick, onPinClick } = props;

  function getTooltipContent(schemaName: string): string {
    if (!bySchemaName[schemaName].disablePinAction) {
      return '';
    }

    return bySchemaName[schemaName].disablePinActionTooltip ?? '';
  }

  return (
    <>
      <DropdownItem className={classNames('ng_p_2_sb', styles.section_header)} disabled>
        Pinned filters {filters.length}/5
      </DropdownItem>
      {filters?.map((filter) => (
        <DropdownItem
          key={filter}
          title={bySchemaName[filter].label}
          onSelect={() => {
            onOptionClick(filter);
          }}>
          <span className={styles.filter_option}>{bySchemaName[filter].label}</span>
          <Tooltip
            content={getTooltipContent(filter)}
            placement={Placement.Horizontal}
            theme={Theme.Dark}
            trigger={[Trigger.Hover]}>
            <IconButton
              icon={<Pin type="filled" />}
              onClick={(event) => {
                event.stopPropagation();
                onPinClick(filter, false);
              }}
              variant="tertiary-gray"
              size="xs"
              disabled={bySchemaName[filter].disablePinAction}
              customStyleClass={bySchemaName[filter].disablePinAction ? '' : styles.pin_filled}
              title=""
            />
          </Tooltip>
        </DropdownItem>
      ))}
      {filters?.length === 0 ? (
        <div className={styles.pin_description_container}>
          <div className={classNames('ng_p_2_m ', styles.pin_description)}>
            <IconButton
              icon={<Pin type="outline" />}
              onClick={() => {}}
              variant="tertiary-gray"
              size="xs"
              customStyleClass={styles.pin_description_icon}
            />
            <div>Pin most frequently used filters to always see them on top.</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PinnedFilters;
