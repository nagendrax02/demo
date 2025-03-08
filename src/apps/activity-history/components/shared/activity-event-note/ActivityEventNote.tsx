/* eslint-disable complexity */
import { IAugmentedAHDetail } from 'apps/activity-history/types';
import styles from './activity-event-note.module.css';
import { replaceURLInStringWithAnchorTag } from './utils/url';
import { useEffect, useRef, useState } from 'react';
import usePurifiedContent from '../../opportunity-audit/components/use-purified-content';
import { handleLineBreaksForNonHTML } from './utils/html';
import { ACTIVITY } from 'apps/activity-history/constants';

export interface IActivityEventNote {
  data: IAugmentedAHDetail;
}

const doNotShowNoteActivities = {
  [ACTIVITY.FORM_SAVED_AS_DRAFT_ON_PORTAL]: 1,
  [ACTIVITY.REGISTER_ON_PORTAL]: 1,
  [ACTIVITY.SALES]: 1,
  [ACTIVITY.PRIVACY_COOKIE_CONSENT]: 1,
  [ACTIVITY.DATA_PROTECTION_REQUEST]: 1
};

const MAX_LINES_COUNT = 3;
const DEFAULT_LINE_HEIGHT = 20;

const ActivityEventNote = ({ data }: IActivityEventNote): JSX.Element | null => {
  const { AdditionalDetails } = data;
  const noteRef = useRef<HTMLDivElement>(null);
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const [toggleReadMore, setToggleReadMore] = useState(false);
  const note = handleLineBreaksForNonHTML(
    replaceURLInStringWithAnchorTag(AdditionalDetails?.ActivityEvent_Note || data?.ActivityNote)
  );
  const purifiedContent = usePurifiedContent(note, true);

  const handleToggleReadMore = (): void => {
    setToggleReadMore((prev) => !prev);
  };

  const getReadMoreElement = (): JSX.Element => {
    return (
      <div className={styles.read} onClick={handleToggleReadMore}>
        {toggleReadMore ? 'Read More' : 'Read Less'}
      </div>
    );
  };

  useEffect(() => {
    if (noteRef.current) {
      setTimeout(() => {
        const paraHeight = noteRef?.current?.clientHeight || 0;
        if (paraHeight > DEFAULT_LINE_HEIGHT * MAX_LINES_COUNT) {
          setIsTextOverflowing(true);
          setToggleReadMore(true);
        }
      }, 100);
    }
  }, []);

  if (!note) {
    return null;
  }

  if (doNotShowNoteActivities[data?.ActivityEvent || '']) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div
        ref={noteRef}
        className={`${styles.note} ${
          isTextOverflowing && toggleReadMore ? styles.collapse_text : ''
        }`}
        dangerouslySetInnerHTML={{
          /* eslint-disable @typescript-eslint/naming-convention */
          __html: purifiedContent
        }}
      />
      {isTextOverflowing ? getReadMoreElement() : null}
    </div>
  );
};

export default ActivityEventNote;
