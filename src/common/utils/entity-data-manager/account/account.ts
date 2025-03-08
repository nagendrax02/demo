import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable max-lines-per-function */
import { IAccount } from 'common/types';

import { CallerSource } from '../../rest-client';

import {
  EntityDetailsEvents,
  getExperienceKey,
  startExperienceEvent,
  ExperienceModule,
  ExperienceType,
  endExperienceEvent
} from 'common/utils/experience';
import { endEntityDetailsLoadExperience } from '../../experience/utils/module-utils';

import { fetchDetails } from './details';

import { fetchLeadMetaData } from '../lead/metadata';

import { fetchAccountMetaData } from './metadata';

const fetchData = async (): Promise<IAccount> => {
  const experienceConfig = getExperienceKey();
  startExperienceEvent({
    module: ExperienceModule.AccountDetails,
    experience: ExperienceType.Load,
    event: EntityDetailsEvents.FetchApi,
    key: experienceConfig.key
  });
  try {
    const details = await fetchDetails(CallerSource.AccountDetails);
    const [accountMetaData, leadMetaData] = await Promise.all([
      fetchAccountMetaData(details?.AccountTypeId, CallerSource.AccountDetails),
      fetchLeadMetaData(CallerSource.LeadDetails)
    ]);

    endExperienceEvent({
      module: ExperienceModule.AccountDetails,
      experience: ExperienceType.Load,
      event: EntityDetailsEvents.FetchApi,
      key: experienceConfig.key
    });

    return {
      details,
      metaData: {
        Fields: Object.values(accountMetaData?.metaData) || [],
        AccountRepresentationConfig: accountMetaData?.representationName,
        LeadRepresentationConfig: leadMetaData?.representationName
      }
    } as IAccount;
  } catch (error) {
    trackError(error);
    endExperienceEvent({
      module: ExperienceModule.AccountDetails,
      experience: ExperienceType.Load,
      event: EntityDetailsEvents.FetchApi,
      key: experienceConfig.key,
      hasException: true
    });
    endEntityDetailsLoadExperience();
    throw error;
  }
};

export { fetchData };
