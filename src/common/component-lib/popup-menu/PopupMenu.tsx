import { trackError } from 'common/utils/experience/utils/track-error';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './popup.module.css';
import { handleMouseEvents, isMouseOut, sleep } from 'common/utils/helpers';

export interface IPopup {
  triggerSource: ({ showPopup, setShowPopup }) => React.ReactNode;
  popupContent: ({ showPopup, setShowPopup }) => React.ReactNode;
  popupDimension: { height: number; width: number };
  customPopStyle?: string;
  popupStyleConfig?: {
    doNotSelfPosition?: boolean;
    adjustHeight?: boolean;
  };
}

const PopupMenu = ({
  popupContent,
  triggerSource,
  popupDimension,
  customPopStyle,
  popupStyleConfig
}: IPopup): JSX.Element => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  const popupMounted = useRef(false);

  const handleMouseClick = useCallback((event: MouseEvent): void => {
    if (isMouseOut(event, elementRef?.current, popupRef?.current)) {
      setShowPopup(false);
    }
  }, []);

  useEffect(() => {
    return handleMouseEvents(showPopup, handleMouseClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPopup]);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        if (showPopup) {
          const module = await import('./popupStyle');
          const style = module.getPopupStyle({
            sourceElement: elementRef?.current,
            popupDimension,
            adjustHeight: popupStyleConfig?.adjustHeight || false,
            doNotSelfPosition: popupStyleConfig?.doNotSelfPosition || false
          });
          setPopupStyle(style);
        }
      } catch (error) {
        trackError(error);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPopup]);

  const toggleMenu = (show: boolean): void => {
    popupMounted.current = true;
    setShowPopup(show);
  };

  const onMouseLeave = async (event): Promise<void> => {
    await sleep(150);
    handleMouseClick(event);
  };
  return (
    <div
      className={styles.popup_wrapper}
      data-testid="popup-menu-wrapper"
      onMouseLeave={onMouseLeave}>
      <div
        onClick={() => {
          toggleMenu(true);
        }}
        data-testid="popup-menu-trigger-source"
        onMouseEnter={() => {
          toggleMenu(true);
        }}>
        <div ref={elementRef}>{triggerSource({ showPopup, setShowPopup })}</div>
      </div>

      {popupMounted.current && popupContent ? (
        <div
          ref={popupRef}
          className={`${styles.popup} ${customPopStyle} ${showPopup ? styles.show : ''}`}
          data-testid="popup-menu-popup-container"
          style={showPopup ? { ...popupStyle } : {}}>
          {popupContent({ showPopup, setShowPopup })}
        </div>
      ) : null}
    </div>
  );
};

PopupMenu.defaultProps = {
  customPopStyle: '',
  popupStyleConfig: undefined
};
export default PopupMenu;
