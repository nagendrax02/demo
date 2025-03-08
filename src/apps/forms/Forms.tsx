import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import Iframe from 'common/component-lib/iframe';
import SideModal from '@lsq/nextgen-preact/side-modal';
import {
  IFormConfig,
  IFormDataToBePassed,
  IFormsConfiguration,
  IFormsConfigurationDataToBePassed
} from './forms.types';
import generateAuthStorageData from './form-data-transfer-helper';
import { IFunctionType } from './common.types';
import generateCallbackMapFromFormsData, { appendCallBackSetToFormData } from './callback-handler';
import { getEnvConfig, areArrayOfObjectsEqual, isMiP } from 'common/utils/helpers';
import { ENV_CONFIG } from 'common/constants';
import { AvailableTheme, useTheme } from '@lsq/nextgen-preact/v2/stylesmanager';
import { FORMS_MESSAGE_EVENT_TYPES, IDraft } from 'apps/forms/draft-menu/draft-config';
import { useDraftsStore } from 'apps/forms/draft-menu/drafts.store';
import { getItem, setItem, StorageKey } from 'common/utils/storage-manager';
import { getFormsRenderUrl, sendPostMessage } from './utils';
import { useSyncLocalStorage } from 'common/utils/use-sync-local-storage/use-sync-local-storage';
import { useFormRenderer } from './form-renderer/new-form-renderer-store';

export interface IForms {
  shouldShow: boolean;
  setShouldShow: React.Dispatch<React.SetStateAction<boolean>>;
  config: IFormsConfiguration | null;
}

interface IFormsProcessingData {
  isReady: boolean;
  isRequiredDataPassed: boolean;
}

const handleSaveAsDraft = (
  event: { data?: { drafts?: IDraft[] } },
  setDrafts?: React.Dispatch<React.SetStateAction<IDraft[]>>
): void => {
  const savedDrafts = (getItem(StorageKey.Drafts) as IDraft[]) ?? [];
  const drafts = Object.values(event?.data?.drafts ?? {});
  drafts.sort((a: IDraft, b: IDraft) => b.createdOn - a.createdOn);
  setItem(StorageKey.Drafts, drafts);
  if (setDrafts) {
    setDrafts(drafts);
  }
  if (!areArrayOfObjectsEqual(savedDrafts, drafts)) {
    useDraftsStore.getState().setTooltip(true);
  }
};

const handleReplaceDraft = (formIframeRef): void => {
  useDraftsStore.getState().setShowReplaceDraftModal(true, formIframeRef);
};

const handleClose = (formIframeRef: RefObject<HTMLIFrameElement | null | undefined>): void => {
  const formsRenderUrl = getFormsRenderUrl();
  const message = { type: FORMS_MESSAGE_EVENT_TYPES.SWLIT_MODAL_CLOSE };
  sendPostMessage(formIframeRef.current, message, Object.values([formsRenderUrl]));

  // reset the formsCount to 0, when the modal is closed
  useFormRenderer.getState().resetFormsCount();
};

export const getFormsIframeUrl = (): string => {
  if (getItem<number>(StorageKey.EnableFormsCloneUrl) === 1) {
    return `${getEnvConfig(ENV_CONFIG?.formsCloneRenderURL) as string}&isMiP=${isMiP()}`;
  }

  return `${getEnvConfig(ENV_CONFIG?.formsRenderURL) as string}&isMiP=${isMiP()}`;
};

// eslint-disable-next-line max-lines-per-function
const Forms = (props: IForms): JSX.Element => {
  const { shouldShow, setShouldShow, config } = props;
  const { theme } = useTheme();
  const [iframeLoader, setIframeLoader] = useState(true);
  const callBackMapRef = useRef<Map<string, IFunctionType>>();
  const formIframeRef = useRef<HTMLIFrameElement | null>(null);
  const formProcessingData = useRef<IFormsProcessingData>({
    isReady: false,
    isRequiredDataPassed: false
  });
  const [, setDrafts] = useSyncLocalStorage<IDraft[]>(StorageKey.Drafts, []);

  // eslint-disable-next-line complexity
  const handleFormWhenLoaded = useCallback((): void => {
    try {
      const storageData = generateAuthStorageData();
      if (!storageData) {
        throw new Error('Authentication token information not available');
      }
      const formData: IFormsConfigurationDataToBePassed = {
        ...config,
        Config: config?.Config ?? {},
        SetShowModal: (value) => {
          setShouldShow(value);
          if (!value) useFormRenderer.getState().resetFormsCount();
        },
        ShowForm: (formsConfig: IFormConfig) => {
          if (config)
            useFormRenderer.getState().setFormConfig({
              ...config,
              Config: formsConfig,
              OnShowFormChange: (show) => {
                if (!show) {
                  useFormRenderer.getState().setFormConfig(null);
                }
              }
            });
        }
      };
      const callbackMapEvaluated = generateCallbackMapFromFormsData({
        formDataToBePassed: formData
      });

      appendCallBackSetToFormData({
        formDataToBePassed: formData,
        callBackMap: callbackMapEvaluated ?? new Map<string, IFunctionType>()
      });

      if (callbackMapEvaluated) {
        callBackMapRef.current = callbackMapEvaluated;
      }
      const message: IFormDataToBePassed = {
        storageData,
        formData,
        state: formProcessingData.current.isRequiredDataPassed
          ? 'onFormConfigChange'
          : 'initialLoad',
        themeConfig: (theme?.mode as AvailableTheme) || AvailableTheme.Default
      };
      if (formIframeRef?.current?.contentWindow) {
        const formsRenderUrl = getFormsRenderUrl();
        sendPostMessage(formIframeRef.current, message, Object.values([formsRenderUrl]));
      }
      if (formProcessingData.current) {
        useFormRenderer.getState().setFormsRef(formIframeRef);
        formProcessingData.current.isRequiredDataPassed = true;
      }
    } catch (err) {
      console.log(err, 'error in processing');
    }
  }, [config, setShouldShow, theme?.mode]);

  const handleFormReadyMessageFromIframe = useCallback(
    (event): void => {
      if (event.data.isFormReady) {
        formProcessingData.current.isReady = true;
        if (
          config?.Config &&
          formProcessingData?.current?.isReady &&
          formIframeRef.current &&
          !formProcessingData?.current?.isRequiredDataPassed
        ) {
          handleFormWhenLoaded();
        }
      }
    },
    [config?.Config, handleFormWhenLoaded]
  );

  const handleIFrameMessagesToTriggerCallbacks = (event): void => {
    if (event.data.callbackTriggerId && callBackMapRef?.current) {
      if (callBackMapRef.current.has(event?.data?.callbackTriggerId)) {
        callBackMapRef.current.get(event?.data?.callbackTriggerId)?.(
          ...(event?.data?.arguments as unknown[])
        );
      }
    }
  };

  const handleMessageFromIframe = useCallback(
    (event): void => {
      switch (event.data.type) {
        case FORMS_MESSAGE_EVENT_TYPES.SAVE_AS_DRAFT: {
          handleSaveAsDraft(event);
          break;
        }
        case FORMS_MESSAGE_EVENT_TYPES.SAVE_AS_DRAFT_FORCED: {
          handleSaveAsDraft(event, setDrafts);
          break;
        }
        case FORMS_MESSAGE_EVENT_TYPES.REPLACE_DRAFT: {
          handleReplaceDraft(formIframeRef);
          break;
        }
        default: {
          handleFormReadyMessageFromIframe(event);
          handleIFrameMessagesToTriggerCallbacks(event);
        }
      }
    },
    [handleFormReadyMessageFromIframe, setDrafts]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessageFromIframe);
    return () => {
      window.removeEventListener('message', handleMessageFromIframe);
    };
  }, [handleMessageFromIframe]);

  useEffect(() => {
    if (config?.Config) {
      handleFormWhenLoaded();
    }
  }, [config?.Config, handleFormWhenLoaded]);

  return (
    <div data-testid="forms-container">
      <SideModal
        unMountOnExit={false}
        show={shouldShow}
        setShow={setShouldShow}
        onClose={() => {
          handleClose(formIframeRef);
        }}>
        <SideModal.Body>
          <Iframe
            src={getFormsIframeUrl()}
            width={'100%'}
            height={'100%'}
            customRef={formIframeRef}
            id="iframe-form"
            title="forms-iframe"
            setShowSpinner={setIframeLoader}
            showSpinner={iframeLoader}
          />
        </SideModal.Body>
      </SideModal>
    </div>
  );
};

Forms.defaultProps = {
  onShowFormChange: undefined
};

export default Forms;
