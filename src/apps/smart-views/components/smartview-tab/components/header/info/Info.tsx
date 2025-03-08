import styles from './info.module.css';
import { lazy, useState } from 'react';
import InfoModal from './InfoModal';
import DeleteModal from './DeleteModal';
import ConfigureTab from 'apps/smart-views/components/external-components/configure-tab/ConfigureTab';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import {
  IPrimaryHeader,
  ITabSettings
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { TabType } from 'apps/smart-views/constants/constants';
import { ILeadTypeConfiguration } from 'apps/smart-views/smartviews.types';
import { logSVModuleUsage } from 'apps/smart-views/utils/utils';
import { SVUsageWorkArea } from 'common/utils/experience/experience-modules';
import { getActiveTab } from '../../../smartview-tab.store';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { ViewConfig } from 'assets/custom-icon/v2';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

export interface IInfo {
  primaryHeaderConfig: IPrimaryHeader;
  tabSettings: ITabSettings;
  tabType: TabType;
  entityCode: string;
  leadTypeConfiguration?: ILeadTypeConfiguration[];
  tabId: string;
}

const Info = (props: IInfo): JSX.Element => {
  const { primaryHeaderConfig, tabSettings, tabType, entityCode, leadTypeConfiguration, tabId } =
    props;
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleClick = (): void => {
    setShow(true);
    logSVModuleUsage(getActiveTab(), SVUsageWorkArea.TabInfo);
  };

  return (
    <>
      <div className={styles.info} onClick={handleClick}>
        <Tooltip
          content={'Tab Info'}
          wrapperClass={styles.tooltip}
          placement={Placement.Horizontal}
          trigger={[Trigger.Hover]}>
          <ViewConfig type="outline" className={styles.view_config_icon} />
        </Tooltip>
      </div>
      {show ? (
        <InfoModal
          tabSettings={tabSettings}
          tabType={tabType}
          entityCode={entityCode}
          primaryHeaderConfig={primaryHeaderConfig}
          leadTypeConfiguration={leadTypeConfiguration}
          show={show}
          setShow={setShow}
          onDeleteClick={() => {
            setShowDelete(true);
            logSVModuleUsage(getActiveTab(), SVUsageWorkArea.TabInfo, {
              subWorkArea: SVUsageWorkArea.Delete
            });
          }}
          onEditClick={() => {
            setShowEdit(true);
            logSVModuleUsage(getActiveTab(), SVUsageWorkArea.TabInfo, {
              subWorkArea: SVUsageWorkArea.Edit
            });
          }}
          tabId={tabId}
        />
      ) : null}
      {showDelete ? (
        <DeleteModal
          primaryHeaderConfig={primaryHeaderConfig}
          show={showDelete}
          setShow={setShowDelete}
        />
      ) : null}
      {showEdit ? (
        <ConfigureTab
          show={showEdit}
          onClose={() => {
            setShowEdit(false);
          }}
          isEdit
        />
      ) : null}
    </>
  );
};

Info.defaultProps = {
  leadTypeConfiguration: []
};

export default Info;
