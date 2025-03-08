import { trackError } from 'common/utils/experience/utils/track-error';
import { useEffect, useRef, useState } from 'react';
import styles from './error-page.module.css';
import { IErrorPage } from './error-page.types';
import Spinner from '@lsq/nextgen-preact/spinner';
import { default as ErrorComponent } from 'common/component-lib/error';
import { ErrorMessages, getErrorConfig } from './utils';
import { endEntityDetailsLoadExperience } from 'common/utils/experience/utils/module-utils';

const ErrorPage = ({ error }: IErrorPage): JSX.Element => {
  const containerRef = useRef<HTMLElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  useEffect(() => {
    try {
      const dimensions = containerRef?.current?.getBoundingClientRect() as DOMRect;
      setContainerHeight(window.innerHeight - dimensions?.top || 0);
      endEntityDetailsLoadExperience();
    } catch (ex) {
      trackError('Error in setting the height in error page', ex);
    }
  }, []);

  const { title, description } = getErrorConfig(error);

  //When an unknown exception occurs, throw the received error to capture accurate error details as fatal.
  if (!title) {
    throw error;
  }

  return (
    <main
      className={styles.error_page_container}
      style={containerHeight ? { height: containerHeight } : {}}
      data-testid="entity-details-error-page-container"
      ref={containerRef}>
      <ErrorComponent
        icon={error?.message === ErrorMessages.permission ? 'lock' : 'info'}
        title={title}
        description={description}
        suspenseFallback={<Spinner />}
      />
    </main>
  );
};

export default ErrorPage;
