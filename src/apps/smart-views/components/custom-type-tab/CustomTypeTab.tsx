import useSmartViewStore from '../../smartviews-store';
import { safeParseJson } from 'common/utils/helpers';
import { ICustomTypeInfo } from './custom-type-tab.types';
import { convertStringToCssStyleObj, getMailMergedTabUrl } from './utils';
import IFrame from 'common/component-lib/iframe';
import { useEffect, useRef, useState } from 'react';
import { handleOnMessage } from './on-message';
import Modal from '@lsq/nextgen-preact/modal';
import CustomTypeTabHeader from './CustomTypeTabHeader';
import smartViewStyles from '../../smartviews.module.css';

const CustomTypeTab = ({ tabId }: { tabId: string }): JSX.Element => {
  const { allTabIds, smartViewId, tabData } = useSmartViewStore((state) => ({
    allTabIds: state.allTabIds,
    smartViewId: state.smartViewId,
    tabData: state.rawTabData[tabId]
  }));

  const [gridConfig, setGridConfig] = useState({ url: '', spinner: true });
  const [popUpConfig, setPopUpConfig] = useState({
    open: false,
    url: '',
    styles: '',
    spinner: true
  });
  const gridIFrameRef = useRef<HTMLIFrameElement>(null);
  const popupIFrameRef = useRef<HTMLIFrameElement>(null);
  const customTypeInfo = safeParseJson<ICustomTypeInfo>(
    tabData?.TabConfiguration.CustomTypeInfo ?? ''
  );

  const handlePopUpAction = (url: string, open: boolean, styles: string): void => {
    setPopUpConfig((state) => ({ ...state, url, styles, open, spinner: true }));
  };

  const onMessage = (event: MessageEvent): void => {
    handleOnMessage({
      event,
      gridIFrameRef,
      popupIFrameRef,
      tabId,
      handlePopUpAction
    });
  };

  useEffect(() => {
    const fetchMailMergedUrl = async (): Promise<void> => {
      setGridConfig((state) => ({ ...state, spinner: true }));
      const gridData = safeParseJson<Record<string, string>>(customTypeInfo?.GridConfig ?? '');
      const url = await getMailMergedTabUrl(gridData?.URL ?? '', tabData.Id, smartViewId);
      setGridConfig((state) => ({ ...state, url }));
    };
    fetchMailMergedUrl();
    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabData.Id]);

  return (
    <>
      <CustomTypeTabHeader tabData={tabData} allTabIds={allTabIds} tabId={tabId} />
      <IFrame
        id={tabData?.Id}
        src={gridConfig.url}
        setShowSpinner={(show: boolean) => {
          setGridConfig((state) => {
            return { ...state, spinner: show };
          });
        }}
        showSpinner={gridConfig.spinner}
        customRef={gridIFrameRef}
        customStyleClass={smartViewStyles.custom_tab_grid_iframe}
      />
      {popUpConfig.open ? (
        <Modal show={popUpConfig.open} inlineStyle={convertStringToCssStyleObj(popUpConfig.styles)}>
          <IFrame
            id={`${tabData?.Id}-popup`}
            src={popUpConfig.url}
            setShowSpinner={(show: boolean) => {
              setPopUpConfig((state) => ({ ...state, spinner: show }));
            }}
            showSpinner={popUpConfig.spinner}
            customRef={popupIFrameRef}
          />
        </Modal>
      ) : null}
    </>
  );
};

export default CustomTypeTab;
