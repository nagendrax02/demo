import { getCurrentTheme } from '@lsq/nextgen-preact/v2/stylesmanager';
import NextGenTimeline from '@lsq/nextgen-preact/timeline';
import { ITimeline } from '@lsq/nextgen-preact/timeline/timeline.types';

const Timeline = <T extends object>(props: Omit<ITimeline<T>, 'currentTheme'>): JSX.Element => {
  return <NextGenTimeline {...props} currentTheme={getCurrentTheme()} />;
};

export default Timeline;
