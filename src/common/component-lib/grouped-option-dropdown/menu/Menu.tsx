import { lazy, useEffect, useState } from 'react';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import Icon from '@lsq/nextgen-preact/icon';
import {
  AugmentedGroupedOption,
  GroupConfig,
  ICreateNewOptionConfig,
  IGroupConfig,
  IGroupedOption
} from '../grouped-option-dropdown.types';
import { generateDefaultOptions, getGroupOrder } from '../utils';
import styles from './menu.module.css';
import { getNewOptionPlaceholder, handlePlaceholderClick } from './utils';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

export interface IMenu {
  searchText: string;
  options: IGroupedOption[];
  groupConfig: GroupConfig;
  onOptionSelect: (option: IGroupedOption) => void;
  selectedOpts: IGroupedOption[];
  isOptionLoading?: boolean;
  removeGrouping?: boolean;
  createNewOptionConfig?: ICreateNewOptionConfig;
}

const Menu = (props: IMenu): JSX.Element => {
  const {
    searchText,
    options,
    groupConfig,
    onOptionSelect,
    selectedOpts,
    isOptionLoading,
    removeGrouping,
    createNewOptionConfig
  } = props;

  const [enableEnterKeyListener, setEnableEnterKeyListener] = useState<boolean>(false);

  useEffect(() => {
    if (createNewOptionConfig && enableEnterKeyListener) {
      const handleEnterPress = (e): void => {
        if (e.key === 'Enter') {
          handlePlaceholderClick(searchText, createNewOptionConfig, onOptionSelect);
        }
      };
      window.addEventListener('keydown', handleEnterPress);

      return () => {
        window.removeEventListener('keydown', handleEnterPress);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableEnterKeyListener]);

  const handleOptionClick = (newOption: IGroupedOption): void => {
    if (!newOption?.disabled) {
      onOptionSelect(newOption);
    }
  };

  const getAugmentedOptions = (opts: IGroupedOption[]): AugmentedGroupedOption => {
    if (!opts?.length) {
      return generateDefaultOptions(groupConfig);
    }
    return opts.reduce((acc, opt) => {
      const key = opt.group;
      if (!acc[key]) {
        acc[key] = [];
      }
      if (selectedOpts.findIndex((selectedOpt) => selectedOpt?.value === opt?.value) < 0) {
        acc[key].push(opt);
      }
      return acc;
    }, {});
  };

  const augmentedOptions = getAugmentedOptions(options);

  const renderOptions = (data: IGroupedOption[]): JSX.Element[] => {
    return data.map((item) => {
      const content = (
        <div className={`${styles.option_content} option-content`}>
          <div className={`${styles.option_label} option-label`}>{item?.label}</div>
          <div className={`${styles.option_secondary_label} option-secondary-label`}>
            {item?.secondaryLabel}
          </div>
        </div>
      );

      const contentWithTooltip = (
        <Tooltip
          content={<div>{item?.menuTooltipMessage}</div>}
          placement={Placement.Vertical}
          trigger={[Trigger.Hover]}
          key={item.value}
          customStyle={{ display: 'flex', flexDirection: 'column', zIndex: 999999 }}>
          {content}
        </Tooltip>
      );

      return (
        <div
          className={`${styles.option} ${item?.disabled ? styles.option_disabled : ''}`}
          key={item.value}
          onClick={() => {
            handleOptionClick(item);
          }}>
          {item?.menuTooltipMessage ? contentWithTooltip : content}
        </div>
      );
    });
  };

  const getLoadingMessage = (): JSX.Element => {
    return <div className={styles.loading_message}>Fetching Values</div>;
  };

  const renderNoResults = (group: IGroupConfig, groupKey: string): JSX.Element => {
    if (group?.emptyGroupMessage) {
      return <div className={styles.empty_group_message}>{group?.emptyGroupMessage}</div>;
    }
    return <div className={styles.loading_message}>{`No ${groupKey} found`}</div>;
  };

  const getGroupHeader = (selectedGroup: IGroupConfig, group: string): JSX.Element => {
    if (!removeGrouping) {
      return (
        <div className={`${styles.group_header} ${selectedGroup?.customStyleClass}`}>
          {selectedGroup?.icon ? (
            <Icon name={selectedGroup?.icon} customStyleClass={styles.group_icon} />
          ) : null}
          {selectedGroup?.displayName ? selectedGroup?.displayName : group}
        </div>
      );
    }
    return <></>;
  };

  const getMenu = (): JSX.Element => {
    const groupOrder = getGroupOrder(groupConfig);
    return (
      <>
        {createNewOptionConfig
          ? getNewOptionPlaceholder({
              options,
              createNewOptionConfig,
              searchText,
              onOptionSelect,
              setEnableEnterKeyListener
            })
          : null}
        {groupOrder.map((group) => {
          const groupOptions = augmentedOptions?.[group] || [];
          const selectedGroup = groupConfig?.[group];
          if (selectedGroup && groupOptions && !selectedGroup?.hideGroup) {
            return (
              <div className={`group-dropdown ${styles.group}`} key={selectedGroup?.displayName}>
                {getGroupHeader(selectedGroup, group)}
                {groupOptions?.length
                  ? renderOptions(groupOptions)
                  : renderNoResults(selectedGroup, group)}
              </div>
            );
          }
        })}
      </>
    );
  };

  return (
    <div className={styles.menu_wrapper} data-testid="grouped-option-dropdown-menu">
      {isOptionLoading ? getLoadingMessage() : getMenu()}
    </div>
  );
};

Menu.defaultProps = {
  isOptionLoading: false,
  removeGrouping: false
};

export default Menu;
