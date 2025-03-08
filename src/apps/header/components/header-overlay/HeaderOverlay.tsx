import { useEffect, useState } from 'react';
import useHeaderStore, { showHeaderOverlay } from 'apps/header/header.store';
import styles from './header-overlay.module.css';
import { subscribeExternalAppEvent } from 'apps/external-app/event-handler';
import { MODAL_STATE_CHANGED } from 'apps/header/constants';

const HeaderOverlay = (): React.ReactNode => {
  const showOverlay = useHeaderStore((state) => state.showOverlay);
  const headerOpactiy: string = '--header-opactiy';
  const defaultOpacity = 0.5;
  const [opacity, setOpacity] = useState(defaultOpacity);

  useEffect(() => {
    subscribeExternalAppEvent(
      'lsq-marvin-broadcast-message',
      ({ data }: { data: Record<string, unknown> }) => {
        const message = data?.data as Record<string, unknown>;
        if (message?.event === MODAL_STATE_CHANGED) {
          const { backdropOpacity, modalState } = (message?.payload || {}) as Record<
            string,
            number
          >;
          if (modalState === 1) {
            showHeaderOverlay(true);
            setOpacity(backdropOpacity || defaultOpacity);
          } else {
            showHeaderOverlay(false);
            setOpacity(defaultOpacity);
          }
        }
      }
    );
  }, []);

  return showOverlay ? (
    <div style={{ [headerOpactiy]: opacity }} className={styles.header_overlay}></div>
  ) : null;
};

export default HeaderOverlay;
