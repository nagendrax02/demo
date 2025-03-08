import { trackError } from 'common/utils/experience/utils/track-error';
import Icon from '@lsq/nextgen-preact/icon';
import ActionButton from './action-button';
import styles from './error.module.css';
import { IError } from './error.types';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { useState, useEffect, useRef } from 'react';

const Error = (props: IError): JSX.Element => {
  const { description, icon, title, actionConfig } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  useEffect(() => {
    try {
      const dimensions = containerRef?.current?.getBoundingClientRect() as DOMRect;
      setContainerHeight(window.innerHeight - dimensions?.top || 0);
    } catch (ex) {
      trackError(ex);
    }
  }, []);

  return (
    <div
      className={styles.wrapper}
      style={containerHeight ? { height: containerHeight } : {}}
      ref={containerRef}>
      <div>
        <div className={styles.icon} data-testid="error-icon">
          <Icon name={icon} customStyleClass={styles.icon_styles} variant={IconVariant.TwoTone} />
        </div>

        <div className={styles.title} data-testid="error-title">
          {title}
        </div>

        <div className={styles.description} data-testid="error-description">
          {description}
        </div>

        {actionConfig ? <ActionButton actionConfig={actionConfig} /> : null}
      </div>
    </div>
  );
};

export default Error;
