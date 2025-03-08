import { ExceptionType } from 'common/constants';
import { Type } from '@lsq/nextgen-preact/notification/notification.types';
import styles from './wildcard.module.css';
import { showNotification } from '@lsq/nextgen-preact/notification';

interface IGetWildCardRestriction {
  type: string;
  message: string;
}

const handleWildCardRestriction = (errorResponse: IGetWildCardRestriction): void => {
  if (
    (errorResponse.type != ExceptionType.MXWildcardAPIRateLimitExceededException &&
      errorResponse.type != ExceptionType.MXActivityAggregateException) ||
    !errorResponse.message
  )
    return;
  const message = '  about wildcard searches.';

  showNotification({
    type: Type.ERROR,
    message: (
      <div>
        {errorResponse.message}
        <br></br>
        <a
          href="https://help.leadsquared.com/wildcard-search-limitations/"
          target="blank"
          className={styles.link}>
          Learn more
        </a>
        {message}
      </div>
    )
  });
};

export default handleWildCardRestriction;
