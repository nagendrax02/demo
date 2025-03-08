import React from 'react';
import { useBulkUpdate } from '../bulk-update.store';
import BulkUpdateQueue from './BulkUpdateQueue';
import PartialSuccess from './PartialSuccess';

const SuccessMessage = (): JSX.Element | null => {
  const isAsyncRequest = useBulkUpdate((state) => state.isAsyncRequest);
  const partialSuccessMessage = useBulkUpdate((state) => state.partialSuccess);

  if (isAsyncRequest) return <BulkUpdateQueue />;
  if (partialSuccessMessage?.showCount) return <PartialSuccess />;
  return null;
};

export default SuccessMessage;
