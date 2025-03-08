import React, { useCallback, useEffect, useRef, useState } from 'react';
import { classNames } from 'common/utils/helpers/helpers';
import { useOnClickOutside } from 'common/utils/use-on-click-outside/useOnClickOutside';
import styles from './controlled-tooltip.module.css';

interface IControlledTooltipProps {
  content: React.ReactNode;
  show: boolean;
  autoCloseInterval?: number;
  children: React.ReactNode;
  wrapperClassName?: string;
  className?: string;
  onClose?: () => void;
}

const ControlledTooltip: React.FC<IControlledTooltipProps> = (props) => {
  const { content, show, autoCloseInterval, children, wrapperClassName, className, onClose } =
    props;
  const tooltipWrapperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(show);

  const handleClose = useCallback((): void => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useOnClickOutside(tooltipWrapperRef, handleClose);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    setIsVisible(show);

    if (show && autoCloseInterval) {
      timer = setTimeout(handleClose, autoCloseInterval);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [show, autoCloseInterval, handleClose]);

  return (
    <div
      ref={tooltipWrapperRef}
      className={classNames(styles.controlled_tooltip_wrapper, wrapperClassName)}>
      {children}
      {isVisible ? (
        <div className={classNames(styles.controlled_tooltip, className)}>
          {content}
          <span className={styles.controlled_tooltip_arrow} />
        </div>
      ) : null}
    </div>
  );
};

ControlledTooltip.defaultProps = {
  autoCloseInterval: 3000,
  wrapperClassName: '',
  className: '',
  onClose: (): void => {}
};
export default ControlledTooltip;
