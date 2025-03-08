import { subscribeExternalAppEvent } from 'apps/external-app/event-handler';
import { getSettingConfig, settingKeys } from 'common/utils/helpers';
import { CallerSource } from 'common/utils/rest-client';
import React, { useEffect } from 'react';
import { FORMS_MESSAGE_EVENT_TYPES } from '../draft-menu/draft-config';
import Forms from '../Forms';
import { IFormsConfiguration } from '../forms.types';
import { getFormsRenderUrl, sendPostMessage } from '../utils';
import { useFormRenderer } from './new-form-renderer-store';
import { debounce } from 'common/utils/helpers/helpers';

const NewFormRenderer = (): React.ReactNode => {
  const { formConfig, showModalForms, setShowModalForms } = useFormRenderer();

  useEffect(() => {
    formConfig?.OnShowFormChange?.(showModalForms);
  }, [formConfig, showModalForms]);

  useEffect(() => {
    const { remove } = subscribeExternalAppEvent(
      'external-app-forms',
      debounce(async (externalFormsConfig: IFormsConfiguration | null) => {
        if (!externalFormsConfig) return;

        const existingOnShowFormChange = externalFormsConfig.OnShowFormChange;
        externalFormsConfig.OnShowFormChange = (showForm): void => {
          existingOnShowFormChange?.(showForm);
          if (!showForm) {
            useFormRenderer.getState().setFormConfig(null);
          }
        };

        const formsCount = useFormRenderer.getState().formsCount;
        const formIframe = useFormRenderer.getState().formIframeRef;

        const isSaveAsDraftEnabled = await getSettingConfig(
          settingKeys.EnableDynamicFormsToSaveAsDrafts,
          CallerSource.MiPNavMenu
        );

        // If a form is already open and a second form is triggered to open on top of it (telephony can do it through setting ),
        // then send a message to the Forms MFE to save the current form as a draft and then open the new form.
        if (formsCount >= 1 && isSaveAsDraftEnabled === '1') {
          if (formIframe.current) {
            const formsRenderUrl = getFormsRenderUrl();
            const message = { type: FORMS_MESSAGE_EVENT_TYPES.AUTOMATICALY_SAVE_FORM };
            sendPostMessage(formIframe.current, message, Object.values([formsRenderUrl]));
            setTimeout(async () => {
              useFormRenderer.getState().setFormConfig(externalFormsConfig);
            }, 1000);
          }
        } else {
          useFormRenderer.getState().setFormConfig(externalFormsConfig);
        }
      }, 500)
    );

    return () => {
      remove();
    };
  }, []);

  return (
    <Forms config={formConfig} shouldShow={showModalForms} setShouldShow={setShowModalForms} />
  );
};

export default NewFormRenderer;
