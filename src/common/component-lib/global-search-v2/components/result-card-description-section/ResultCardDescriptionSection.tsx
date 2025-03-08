import React from 'react';
import { IDescription } from '../../global-searchV2.types';
import styles from './result-card-description-section.module.css';
import { classNames } from 'common/utils/helpers/helpers';
import HighlightText from '../highlight-text';
import { truncateWithEllipses } from '../../utils/utils';

interface IResultCardDescriptionSectionProps {
  description: IDescription[];
  searchText: string;
  ownerName: IDescription;
}

const ResultCardDescriptionSection: React.FC<IResultCardDescriptionSectionProps> = ({
  description,
  searchText,
  ownerName
}) => {
  return (
    <div className={styles.description_section_wrapper}>
      <div className={styles.description_section}>
        {description.map((desc: IDescription, index) => (
          <div
            key={desc.value}
            className={classNames(
              styles.description_item_wrapper,
              'ng_p_1_m ',
              desc.value === 'NA' ? styles.not_available_text : ' '
            )}>
            {desc.customElement ? (
              desc.customElement
            ) : (
              <>
                {desc.icon ? <div className={styles.icon}>{desc.icon}</div> : null}
                <div
                  className={classNames(styles.description_item, 'ng_p_1_m ')}
                  title={desc.value}>
                  {HighlightText(
                    truncateWithEllipses(desc.value, 30),
                    searchText,
                    styles.highlighted_text
                  )}
                </div>
              </>
            )}
            {desc.value && index < description.length - 1 ? (
              <div className={styles.separator}>|</div>
            ) : null}
          </div>
        ))}
      </div>
      {ownerName.value ? (
        <div className={classNames(styles.user_name, 'ng_p_1_m ')} title={ownerName.value}>
          {ownerName.value}
        </div>
      ) : null}
    </div>
  );
};

export default ResultCardDescriptionSection;
