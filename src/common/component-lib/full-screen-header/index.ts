import { lazy } from 'react';
import withSuspense from '@lsq/nextgen-preact/suspense';

const FullScreenHeader = withSuspense(lazy(() => import('./FullScreenHeader')));

export default FullScreenHeader;

import useFullScreenDetails, {
  setFullScreenType,
  setFullScreenShow,
  setFullScreenRecords,
  setFullScreenDeleteId,
  resetFullScreenDetails,
  setFullScreenEntityTypeCode,
  setFullScreenSelectedRecordId
} from './full-screen.store';

export {
  setFullScreenType,
  setFullScreenShow,
  useFullScreenDetails,
  setFullScreenRecords,
  setFullScreenDeleteId,
  resetFullScreenDetails,
  setFullScreenEntityTypeCode,
  setFullScreenSelectedRecordId
};
