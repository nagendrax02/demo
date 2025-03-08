import Icon from '@lsq/nextgen-preact/icon';
import styles from './row-detail.module.css';
import { getWidthFromParentGrid } from './utils';
import Shimmer from '@lsq/nextgen-preact/shimmer';

const getShimmer = (): JSX.Element => {
  return (
    <div>
      {Array.from({ length: 3 }, (val, index) => (
        <div key={index} className={styles.shimmer_wrapper}>
          <Shimmer width="45%" height="25px" className="shimmer" />
          <Shimmer width="45%" height="25px" className="shimmer" />
        </div>
      ))}
    </div>
  );
};

const getDetailsContent = (
  getContent: () => JSX.Element | null,
  detailsTitle: string,
  fallbackText: string
): JSX.Element => {
  const contentValue = getContent();
  return contentValue ? (
    <>
      {detailsTitle ? (
        <div className={styles.heading}>
          {detailsTitle} {contentValue}
        </div>
      ) : null}
    </>
  ) : (
    <div className={styles.no_details_wrapper}>
      <div className={styles.icon_text_wrapper}>
        <Icon name="description" customStyleClass={styles.no_details_icon} />
        <div className={styles.no_details_text}>{fallbackText}</div>
      </div>
    </div>
  );
};

const ExpandableRow = ({
  isLoading,
  tabId,
  getBody,
  getContent,
  detailsTitle,
  fallbackText
}: {
  getBody: () => JSX.Element | null;
  tabId: string;
  getContent: () => JSX.Element | null;
  detailsTitle: string;
  fallbackText: string;
  isLoading?: boolean;
}): JSX.Element => {
  return (
    <div
      className={styles.details_wrapper}
      style={{
        width: getWidthFromParentGrid(tabId || '')
      }}>
      <div className={styles.vcard_container}>{getBody()}</div>
      <div className={styles.activity_details_wrapper}>
        {isLoading ? getShimmer() : getDetailsContent(getContent, detailsTitle, fallbackText)}
      </div>
    </div>
  );
};

ExpandableRow.defaultProps = {
  isLoading: false
};

export default ExpandableRow;
