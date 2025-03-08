import React, { ReactNode } from 'react';
import styles from './entity-details-accordian.module.css';
import Accordion from '@lsq/nextgen-preact/accordion';
import { getAccordianDeviceConfig } from '../../lead/utils';

interface IEntityDetailsAccordionProps {
  children: ReactNode;
  propertiesHeading?: string;
}

const EntityDetailsAccordion: React.FC<IEntityDetailsAccordionProps> = ({
  children,
  propertiesHeading
}) => {
  const deviceConfig = getAccordianDeviceConfig();

  return (
    <div className={styles.properties_section}>
      <div className={styles.properties}>
        <Accordion
          customStyle={styles.accordian_wrapper}
          name={propertiesHeading ?? 'Properties'}
          defaultState={deviceConfig.defaultState}
          arrowRotate={deviceConfig.arrowRotate}>
          {children as JSX.Element}
        </Accordion>
      </div>
    </div>
  );
};

EntityDetailsAccordion.defaultProps = {
  propertiesHeading: ''
};

export default EntityDetailsAccordion;
