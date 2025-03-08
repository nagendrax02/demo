import { ActivityBaseAttributeDataType } from 'common/types/entity/lead';
import { PhoneCallActivity } from '../../constants/constants';
import { IAugmentedSmartViewEntityMetadata } from '../common-utilities/common.types';

export const isPhoneCallActivity = (code?: string): boolean => {
  return (
    code === PhoneCallActivity.InboundPhoneCallActivity ||
    code === PhoneCallActivity.OutboundPhoneCallActivity
  );
};

export const isCallRecordingColumn = (
  schemaData?: IAugmentedSmartViewEntityMetadata,
  code?: string
): boolean => {
  return (
    !!schemaData?.schemaName &&
    schemaData.dataType === ActivityBaseAttributeDataType.MediaLink &&
    isPhoneCallActivity(code)
  );
};
