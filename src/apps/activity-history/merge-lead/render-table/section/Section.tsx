import { ISectionData } from '../../merge-lead-types';
import Accordion from '@lsq/nextgen-preact/accordion';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState
} from '@lsq/nextgen-preact/accordion/accordion.types';
import { useState } from 'react';
import styles from './section.module.css';
import commonStyles from '../common.module.css';

interface ISection {
  sectionData: ISectionData;
  maxColumn?: number;
}

const Section = ({ sectionData, maxColumn }: ISection): JSX.Element => {
  const [isSectionExpanded, setIsSectoonExpanded] = useState(true);

  const handleAccordionToggle = (isShow: boolean): void => {
    if (isSectionExpanded !== isShow) {
      setIsSectoonExpanded(isShow);
    }
  };

  const generateRowsToRender = (): JSX.Element[] => {
    return sectionData?.rows?.map?.((row) => {
      return (
        <tr key={`row-${Math.random()}`} className={`table_row`}>
          {row?.columns?.map?.((column) => {
            return (
              <td
                key={`column-${Math.random()}`}
                className={`table_columns ${styles.table_column_check} ${commonStyles.common_table_column} ${column?.className}`}>
                {column?.dataToShow}
              </td>
            );
          })}
        </tr>
      );
    });
  };

  return (
    <>
      {sectionData?.header ? (
        <tr className={`${styles.section_header}`}>
          <th className={`${styles.section_accordion_container}`}>
            <Accordion
              name={sectionData.header as string}
              defaultState={DefaultState.OPEN}
              arrowRotate={{
                angle: ArrowRotateAngle.Deg180,
                direction: ArrowRotateDirection.ClockWise
              }}
              handleShow={handleAccordionToggle}
              customHeaderStyle={`${styles.table_section_accordion}`}>
              <></>
            </Accordion>
          </th>
          {Array.from(Array((maxColumn ?? 1) - 1).keys()).map(() => {
            return (
              <>
                <th key={Math.random()} className={`${styles.section_accordion_container}`}></th>
              </>
            );
          })}
        </tr>
      ) : null}

      {isSectionExpanded ? generateRowsToRender() : null}
    </>
  );
};

export default Section;
