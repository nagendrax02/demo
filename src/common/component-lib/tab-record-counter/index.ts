import { lazy } from 'react';
import { RecordType } from './constants';
import useTabRecordCounter from './use-tab-record-counter';
import withSuspense from '@lsq/nextgen-preact/suspense';

const TabRecordCounter = withSuspense(lazy(() => import('./TabRecordCounter')));

export { RecordType, useTabRecordCounter };

export default TabRecordCounter;
