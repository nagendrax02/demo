import { trackError } from 'common/utils/experience/utils/track-error';
import { Module, httpGet } from 'common/utils/rest-client';
import { onActionModalClose } from '../mip-header.store';
import { useNotificationStore } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { clearStorage } from 'common/utils/storage-manager';
import { getInvokerModule } from '../utils';
import { IOnSubmitConfig } from '../mip-feedback/MiPFeedback.types';
import {
  ExperienceType,
  getExperienceId,
  getExperienceKey,
  logExperienceEvent
} from 'common/utils/experience';
import { EVENT_TYPE, PAGE_ACTION } from 'common/utils/experience/constant';
import { getUUId } from 'src/common/utils/helpers/helpers';

interface ISwitchBackResponse {
  Status: string;
}

export const logEvent = async ({
  experience,
  submittedFeedback,
  switchedBack,
  event
}: {
  submittedFeedback: IOnSubmitConfig;
  experience: string;
  event: string;
  switchedBack: boolean;
}): Promise<void> => {
  const experienceConfig = getExperienceKey();
  const log = {
    ...(submittedFeedback || {}),
    module: submittedFeedback?.module,
    reason: submittedFeedback?.reason,
    workArea: submittedFeedback?.workArea,
    feedback: submittedFeedback?.feedbackDescription,
    experience: experience,
    event: event,
    switchedBack: `${switchedBack}`,
    experienceId:
      getExperienceId({
        module: experienceConfig.module,
        experience: ExperienceType.Load,
        key: experienceConfig.key
      }) || getUUId(),
    isExperience: 0,
    hasError: 0
  };

  logExperienceEvent({
    log,
    actionName: PAGE_ACTION.MIP_ADOPTION,
    type: EVENT_TYPE
  });
};

export const handleSwitchBack = async (module: string): Promise<void> => {
  try {
    const response: ISwitchBackResponse = await httpGet({
      path: `/MIP/SwitchBack?module=${module}&canEnable=false`,
      module: Module.Marvin,
      callerSource: getInvokerModule(module)
    });

    if (response.Status === 'Success') {
      onActionModalClose();
      clearStorage();
      self.location.reload();
    } else {
      useNotificationStore
        ?.getState()
        ?.setNotification({ type: Type.ERROR, message: 'Failed to Switch back' });
    }
  } catch (error) {
    useNotificationStore
      ?.getState()
      ?.setNotification({ type: Type.ERROR, message: 'Failed to Switch back' });
    trackError(error);
  }
};
