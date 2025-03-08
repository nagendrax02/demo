import { ReactNode } from 'react';
import useEntityDetailsNewRelic from '../../use-entityDetails-newRelic';

const PropertiesWrapper = ({
  children,
  newRelicEventName,
  canLogEvent
}: {
  newRelicEventName: string;
  children: JSX.Element;
  canLogEvent: boolean;
}): ReactNode => {
  useEntityDetailsNewRelic({ event: newRelicEventName, conditionToStop: canLogEvent });
  return children;
};

export default PropertiesWrapper;
