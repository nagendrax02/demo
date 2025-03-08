import Modal, { ModalHeader, ModalBody, ModalFooter } from '@lsq/nextgen-preact/v2/modal';
import styles from './info.module.css';
import { getAdvancedSearchType, getLeadTypeName, getParsedAdvSearchElement } from './utils';
import { useEffect, useMemo, useState, lazy } from 'react';
import { getPurifiedContent } from 'common/utils/helpers';
import { Variant } from 'common/types';
import { getFormattedDateTime } from 'common/utils/date';
import {
  IPrimaryHeader,
  ITabSettings
} from 'apps/smart-views/components/smartview-tab/smartview-tab.types';
import { TabType } from 'apps/smart-views/constants/constants';
import { ILeadTypeConfiguration } from 'apps/smart-views/smartviews.types';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { classNames } from 'common/utils/helpers/helpers';
import HeaderIcon from '../header-icon';
import Badge from '@lsq/nextgen-preact/v2/badge';

const Button = withSuspense(
  lazy(() => import('@lsq/nextgen-preact/v2/button').then((module) => ({ default: module.Button })))
);

interface IInfoModal {
  primaryHeaderConfig: IPrimaryHeader;
  tabSettings: ITabSettings;
  tabType: TabType;
  entityCode: string;
  show: boolean;
  leadTypeConfiguration?: ILeadTypeConfiguration[];
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteClick: () => void;
  onEditClick: () => void;
  tabId: string;
}

const InfoModal = (props: IInfoModal): JSX.Element => {
  const {
    show,
    setShow,
    onDeleteClick,
    onEditClick,
    primaryHeaderConfig,
    tabSettings,
    tabType,
    entityCode,
    leadTypeConfiguration,
    tabId
  } = props;

  const [htmlContent, setHtmlContent] = useState<string>('');
  const advanceSearchEnglish = primaryHeaderConfig?.advancedSearchEnglish;
  const lastModifiedDate = primaryHeaderConfig?.modifiedOn;
  const lastModifiedBy = primaryHeaderConfig?.modifiedByName;

  const leadTypeName = useMemo(() => {
    return getLeadTypeName(leadTypeConfiguration);
  }, [leadTypeConfiguration]);

  const closeModal = (): void => {
    setShow(false);
  };

  const getTabInfo = (): JSX.Element => {
    return (
      <>
        <HeaderIcon tabId={tabId} type={tabType} entityCode={entityCode} />
        {leadTypeName ? (
          <div className={styles.lead_type_info}>
            <div className={styles.lead_type_name}>{leadTypeName} type</div>
          </div>
        ) : null}
      </>
    );
  };

  const getTitle = (): JSX.Element => {
    return (
      <div className={styles.modal_title}>
        <div className={styles.tab_info_container}>
          {leadTypeName ? (
            <Badge size="md" status="basic" customStyleClass={styles.badge}>
              {getTabInfo()}
            </Badge>
          ) : (
            getTabInfo()
          )}
        </div>
        <span className="ng_h_2_b">{primaryHeaderConfig?.title}</span>
      </div>
    );
  };

  const getDescription = (): JSX.Element => {
    return <div className="ng_p_1_m">{primaryHeaderConfig?.description}</div>;
  };

  useEffect(() => {
    (async (): Promise<void> => {
      let htmlString = primaryHeaderConfig?.tabInfoHTML;

      if (!htmlString) {
        const advancedSearchType = await getAdvancedSearchType(tabType, entityCode || '');
        htmlString = getParsedAdvSearchElement(advanceSearchEnglish, advancedSearchType);
      }
      const purifiedHTMLContent = await getPurifiedContent(htmlString);
      setHtmlContent(purifiedHTMLContent);
    })();
  }, []);

  const handleDeleteClick = (): void => {
    setShow(false);
    onDeleteClick();
  };

  const handleEditClick = (): void => {
    setShow(false);
    onEditClick();
  };

  const [formattedDate, time, timeMeridiem] = getFormattedDateTime({
    date: lastModifiedDate,
    timeFormat: 'hh:mm a'
  }).split(' ');

  return (
    <Modal show={show} customStyleClass={styles.modal}>
      <ModalHeader
        title={getTitle()}
        description={getDescription()}
        onClose={closeModal}
        customStyleClass={styles.title_container}
      />
      <ModalBody customStyleClass={styles.modal_body}>
        {htmlContent ? (
          <div
            className={styles.html_content_wrapper}
            dangerouslySetInnerHTML={{
              // eslint-disable-next-line @typescript-eslint/naming-convention
              __html: htmlContent
            }}
          />
        ) : (
          <div className={classNames(styles.html_content_wrapper, styles.no_config)}>
            Configurations not available
          </div>
        )}
      </ModalBody>
      <ModalFooter customStyleClass={styles.footer}>
        <>
          <div className={classNames(styles.tab_info, 'ng_p_1_r')}>
            Modified on{' '}
            <span className={styles.date_time}>
              {formattedDate}
              <span className={styles.separator}></span>
              {time} {timeMeridiem}
            </span>
            <div>
              by <span>{lastModifiedBy}</span>
            </div>
          </div>
          <div className={styles.button_footer}>
            {tabSettings?.allowDelete ? (
              <button className={styles.cancel_button} onClick={handleDeleteClick}>
                Delete View
              </button>
            ) : null}
            {tabSettings?.canEdit ? (
              <Button text="Edit View" onClick={handleEditClick} variant={Variant.Primary} />
            ) : null}
          </div>
        </>
      </ModalFooter>
    </Modal>
  );
};

InfoModal.defaultProps = {
  leadTypeConfiguration: undefined
};

export default InfoModal;
