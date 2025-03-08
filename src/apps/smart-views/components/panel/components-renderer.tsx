import React, { Dispatch, SetStateAction } from 'react';
import styles from './sv-panel.module.css';
import actionContainerStyles from '../../smartviews.module.css';
import MaxTabToolTip from './MaxTabToolTip';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { Theme } from 'common/types';
import Tooltip from '@lsq/nextgen-preact/tooltip';
import { PanelHeader } from '@lsq/nextgen-preact/panel';
import { PanelOrientation, PanelState } from '../../constants/constants';
import { IToggleProps, ICollapseProps } from '@lsq/nextgen-preact/panel/panel.types';
import { IDragItems } from '@lsq/nextgen-preact/draggable-list/draggableList.types';
import SVTabItem from './components/tab-item/SVTabItem';
import { ITabResponse } from '../../smartviews.types';
import { AddIcon, LeftPanelCollapse, MoveToLeft } from 'assets/custom-icon/v2';
import { classNames } from 'common/utils/helpers/helpers';
import { cachePanelOrientation } from '../../utils/utils';
import PanelToggleInfoToolTip from './PanelToggleInfoTooltip';
import { ExpandTooltipStyles, ToggleInfoToolTipCustomStyles } from './utils';
interface IAddIconComponentProps {
  isLeftPanel: boolean;
  setShowAddTabModal: (showAddTabModal: boolean) => void;
}

function renderAddComponents(
  allTabIds: string[],
  maxAllowedTabs: number
): {
  AddIconComponent: React.FC<IAddIconComponentProps>;
  MaxTabToolTipComponent: React.FC<{ children: React.ReactElement; isLeftOriented: boolean }>;
  isMaxLimitExceeded: boolean;
} {
  const isMaxLimitExceeded = allTabIds?.length >= maxAllowedTabs;

  const MaxTabToolTipComponent: React.FC<{
    children: React.ReactElement;
    isLeftOriented: boolean;
  }> = ({ children, isLeftOriented }) => {
    return (
      <Tooltip
        content={<MaxTabToolTip maxAllowedTabs={maxAllowedTabs} />}
        placement={isLeftOriented ? Placement.Vertical : Placement.Horizontal}
        trigger={isMaxLimitExceeded ? [Trigger.Hover] : []}
        theme={Theme.Dark}>
        {children}
      </Tooltip>
    );
  };

  MaxTabToolTipComponent.displayName = 'MaxTabToolTipComponent';

  const AddNewTabToolTipComponent: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    return (
      <Tooltip
        content={
          <div className={styles.expand_menue_tooltip}>
            <span className={classNames('ng_v2_style', 'ng_p_1_sb')}>Add New Tab</span>
          </div>
        }
        trigger={!isMaxLimitExceeded ? [Trigger.Hover] : []}
        placement={Placement.Vertical}
        theme={Theme.Dark}
        customStyle={{ padding: '0px' }}>
        {children}
      </Tooltip>
    );
  };

  const AddIconComponent: React.FC<IAddIconComponentProps> = ({
    isLeftPanel,
    setShowAddTabModal
  }) => {
    const AddIconButton: React.FC = () => {
      const getAddIconClass = (): string => {
        if (isMaxLimitExceeded) return styles.sv_add_icon_disabled;
        if (isLeftPanel) return styles.sv_add_icon_left;
        return styles.sv_add_icon_top;
      };
      return (
        <MaxTabToolTipComponent isLeftOriented={isLeftPanel}>
          <AddNewTabToolTipComponent>
            <button
              className={classNames(
                styles.button_reset,
                isLeftPanel ? actionContainerStyles.action_container : ''
              )}
              onClick={() => {
                if (!isMaxLimitExceeded) setShowAddTabModal(true);
              }}>
              <AddIcon
                type="outline"
                className={classNames(styles.sv_add_icon, getAddIconClass())}
              />
            </button>
          </AddNewTabToolTipComponent>
        </MaxTabToolTipComponent>
      );
    };

    if (isLeftPanel) {
      return <AddIconButton />;
    } else {
      return (
        <div
          className={classNames(
            styles.sv_add_icon_container_top,
            isMaxLimitExceeded ? styles.sv_add_icon_disabled_container : ''
          )}
          onClick={() => {
            if (!isMaxLimitExceeded) setShowAddTabModal(true);
          }}>
          <AddIconButton />
        </div>
      );
    }
  };

  AddIconComponent.displayName = 'AddIconComponent';

  return {
    AddIconComponent,
    MaxTabToolTipComponent,
    isMaxLimitExceeded
  };
}

const ExpandMenueTooltip: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return (
    <Tooltip
      content={
        <div className={styles.expand_menue_tooltip}>
          <span className={classNames('ng_v2_style', 'ng_p_1_sb')}>Expand Menu</span>
        </div>
      }
      trigger={[Trigger.Hover]}
      placement={Placement.Horizontal}
      theme={Theme.Dark}
      customStyle={ExpandTooltipStyles}>
      {children}
    </Tooltip>
  );
};

function renderPanelContents({
  isLeftOriented,
  panelOrientation = PanelOrientation.Left,
  setPanelOrientation,
  toggleState,
  setToggleState,
  showToggleInfo,
  setShowToggleInfo
}: {
  isLeftOriented?: boolean;
  panelOrientation?: PanelOrientation;
  setPanelOrientation?: Dispatch<SetStateAction<PanelOrientation>>;
  toggleState?: PanelState;
  setToggleState?: (panelState: PanelState) => void;
  showToggleInfo?: boolean;
  setShowToggleInfo?: (showToggleInfo: boolean) => void;
}): {
  SVPanelHeader: React.FC<{
    children: React.ReactElement;
  }>;
  SVCollapseState: React.FC;
  selectPanelContainerStyles: () => string;
} {
  const toggleOrientation = (): void => {
    if (setPanelOrientation) {
      if (panelOrientation === PanelOrientation.Left) {
        cachePanelOrientation(PanelOrientation.Top);
        setPanelOrientation(PanelOrientation.Top);
      } else {
        cachePanelOrientation(PanelOrientation.Left);
        setPanelOrientation(PanelOrientation.Left);
      }
    }
  };

  const handlePanelState = (): void => {
    if (setToggleState) {
      if (toggleState === PanelState.Open) {
        setToggleState(PanelState.Close);
      } else {
        setToggleState(PanelState.Open);
      }
    }
  };

  const selectPanelContainerStyles = (): string => {
    if (isLeftOriented) {
      if (toggleState === PanelState.Open) {
        return styles.sv_panel_container;
      }
      return styles.sv_collapse_panel_container;
    } else {
      return styles.sv_panel_container_top;
    }
  };

  const getCollapseProps = (): ICollapseProps => {
    return {
      isCollapsible: !!isLeftOriented,
      onPanelCollapse: handlePanelState,
      customCollapseIconStyles: actionContainerStyles.action_container
    };
  };

  const getToggleProps = (): IToggleProps => {
    let toggleProps: IToggleProps = {
      isToggleable: true,
      onPanelToggle: toggleOrientation,
      customToggleIconStyles: !isLeftOriented
        ? styles.sv_toggle_icon_container_top
        : actionContainerStyles.action_container
    };
    if (!isLeftOriented) {
      toggleProps = {
        ...toggleProps,
        toggleIcon: <MoveToLeft type="outline" className={styles.move_to_left} />,
        showTooltip: false
      };
    }
    return toggleProps;
  };

  const LeftPanelInfoTooltip: React.FC<{
    children: React.ReactElement;
  }> = ({ children }) => {
    return (
      <Tooltip
        content={<PanelToggleInfoToolTip setShowToggleInfo={setShowToggleInfo} />}
        placement={Placement.Horizontal}
        trigger={[]}
        customStyle={showToggleInfo ? ToggleInfoToolTipCustomStyles : {}}>
        {children}
      </Tooltip>
    );
  };

  const SVPanelHeader: React.FC<{
    children: React.ReactElement;
  }> = ({ children }) => {
    if (isLeftOriented) {
      return (
        <PanelHeader
          title={'Smart Views'}
          customStyleClass={styles.sv_header_container}
          headerTextClass={styles.sv_header_title}
          collapseProps={getCollapseProps()}
          toggleProps={getToggleProps()}>
          {children}
        </PanelHeader>
      );
    } else {
      return (
        <LeftPanelInfoTooltip>
          <PanelHeader
            customStyleClass={styles.sv_header_container_top}
            headerTextClass={styles.sv_header_title}
            collapseProps={getCollapseProps()}
            toggleProps={getToggleProps()}>
            {null}
          </PanelHeader>
        </LeftPanelInfoTooltip>
      );
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePanelState();
    }
  };

  const SVCollapseState: React.FC = () => {
    return (
      <button
        className={styles.sv_collapse_container}
        onClick={handlePanelState}
        onKeyDown={handleKeyDown}>
        <ExpandMenueTooltip>
          <div className={styles.sv_collapse_wrapper}>
            <LeftPanelCollapse type="outline" className={styles.left_panel_collapse} />
          </div>
        </ExpandMenueTooltip>
      </button>
    );
  };

  return { SVPanelHeader, SVCollapseState, selectPanelContainerStyles };
}

function renderTabContent(
  tabs: { visibleTabs: string[]; overflowTabs: string[] },
  rawTabData: Record<string, ITabResponse>,
  setShowMoreOptions: (showMoreOptions: boolean) => void
): {
  getTabList: () => IDragItems[];
  getOverflowTabList: () => IDragItems[];
} {
  const { visibleTabs, overflowTabs } = tabs;

  const getTabList = (): IDragItems[] => {
    const tabList: IDragItems[] = [];
    visibleTabs?.forEach((id) => {
      if (rawTabData?.[id]) {
        tabList.push({
          id,
          element: <SVTabItem key={id} id={id} setShowMoreOptions={setShowMoreOptions} />
        });
      }
    });
    return tabList;
  };

  const getOverflowTabList = (): IDragItems[] => {
    const tabList: IDragItems[] = [];
    overflowTabs?.forEach((id) => {
      if (rawTabData?.[id]) {
        tabList.push({
          id,
          element: (
            <SVTabItem key={id} id={id} setShowMoreOptions={setShowMoreOptions} overflowTab />
          )
        });
      }
    });
    return tabList;
  };

  return { getTabList, getOverflowTabList };
}

export { renderAddComponents, renderPanelContents, renderTabContent, ExpandMenueTooltip };
