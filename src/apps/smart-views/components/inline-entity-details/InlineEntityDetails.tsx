import { trackError } from 'common/utils/experience/utils/track-error';
import { useEffect, useState } from 'react';
import { IInlineEntityDetailsProps } from './inline-entity-details.types';
import styles from './inline-entity-details.module.css';
import { getShimmerFields } from './utils';
import { IEntityProperty } from 'common/types/entity/lead/metadata.types';
import { Value } from '../../../entity-details/components/properties';
import { CallerSource } from 'common/utils/rest-client';
import { useIsGridUpdated } from '../smartview-tab/smartview-tab.store';
import { getWidthFromParentGrid } from '../cell-renderers/row-details/utils';

const InlineEntityDetails = (props: IInlineEntityDetailsProps): JSX.Element => {
  const { title, fetchData, customStyleClass, tabId } = props;

  const [data, setData] = useState<IEntityProperty[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isGridUpdated = useIsGridUpdated();

  useEffect(() => {
    (async (): Promise<void> => {
      if (isGridUpdated) {
        try {
          const response = await fetchData();
          setData(response);
        } catch (err) {
          trackError(err);
        }
      }
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGridUpdated]);

  const getFields = (): JSX.Element[] => {
    if (isLoading) {
      return getShimmerFields();
    }
    return data?.map((content) => {
      return (
        <div className={styles.field} key={content?.value}>
          <div className={styles.field_name}>{content?.name}</div>
          <div className={styles.field_value}>
            <Value property={content} fields={{}} callerSource={CallerSource.SmartViews} />
          </div>
        </div>
      );
    });
  };

  return (
    <div
      className={`${styles.container} ${customStyleClass}`}
      style={{
        width: getWidthFromParentGrid(tabId || '')
      }}>
      <div className={styles.title}>{title}</div>
      <div className={styles.field_wrapper}>{getFields()}</div>
    </div>
  );
};

export default InlineEntityDetails;
