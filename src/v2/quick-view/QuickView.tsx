import { ReactNode, useEffect, useState } from 'react';
import NextGenQuickView from '@lsq/nextgen-preact/quick-view';
import { trackError } from 'common/utils/experience';
import { quickViewAugmenter } from './augmentation';
import { IQuickView } from './augmentation/augmentation.types';
import { IQuickViewCard } from '@lsq/nextgen-preact/quick-view/quick-view.types';
import { useNotification } from '@lsq/nextgen-preact/notification';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import { getErrorConfig } from './utils';

const QuickView = (props: IQuickView): ReactNode => {
  const { entityId, entityType, entityTypeCode, entityRecord, actionsConfig, showPlaceHolder } =
    props;

  const [quickViewConfig, setQuickViewConfig] = useState<IQuickViewCard>({} as IQuickViewCard);
  const [refreshQuickView, setRefreshQuickView] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { showAlert } = useNotification();

  useEffect(() => {
    (async (): Promise<void> => {
      if (!entityId) {
        return;
      }
      setError(false);
      setIsLoading(true);
      try {
        const augmentedData = await quickViewAugmenter({
          entityId,
          entityType,
          entityTypeCode,
          entityRecord,
          actionsConfig,
          setRefreshQuickView
        });
        setQuickViewConfig(augmentedData);
        setIsLoading(false);
      } catch (e) {
        showAlert({
          type: Type.ERROR,
          message: getErrorConfig(e)
        });
        setError(true);
        trackError(error);
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId, entityType, showPlaceHolder]);

  useEffect(() => {
    const updateQuickView = async (): Promise<void> => {
      try {
        if (!entityId) {
          return;
        }
        const augmentedData = await quickViewAugmenter({
          entityId,
          entityType,
          entityTypeCode,
          entityRecord,
          actionsConfig,
          setRefreshQuickView
        });
        setQuickViewConfig(augmentedData);
        setError(false);
      } catch (e) {
        showAlert({
          type: Type.ERROR,
          message: getErrorConfig(e)
        });
        setError(true);
        trackError(e);
      }
    };

    updateQuickView();
  }, [refreshQuickView]);

  if (error) {
    return null;
  }
  return (
    <NextGenQuickView
      vcardConfig={quickViewConfig?.vcardConfig || {}}
      isLoading={isLoading}
      showPlaceHolder={showPlaceHolder ?? false}
      tabs={quickViewConfig?.tabs || []}
      colorSchema={quickViewConfig?.colorSchema}
      quickViewActions={quickViewConfig?.quickViewActions || []}
    />
  );
};

export default QuickView;
