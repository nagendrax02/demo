import React from 'react';
import GlobalSearchResultCardTags from '../global-search-result-card-tags';
import { IHeading } from '../../global-searchV2.types';
import HighlightText from '../highlight-text';
import styles from './result-card-heading-section.module.css';
import Tooltip from '@lsq/nextgen-preact/tooltip';
import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import { Theme } from 'common/types';
import { classNames } from 'common/utils/helpers/helpers';

interface IResultCardHeadingSectionProps {
  heading: IHeading;
  searchText: string;
}

const ResultCardHeadingSection: React.FC<IResultCardHeadingSectionProps> = ({
  heading,
  searchText
}) => {
  return (
    <div className={styles.heading_section}>
      <div className={styles.heading}>
        <Tooltip
          content={heading.iconTooltipText}
          placement={Placement.Vertical}
          trigger={[Trigger.Hover]}
          theme={Theme.Dark}>
          <div className={styles.icon_wrapper}>{heading.icon}</div>
        </Tooltip>
        <div className={styles.info_wrapper}>
          <div className={classNames(styles.name, 'ng_sh_sb')} title={heading.value}>
            {HighlightText(heading.value, searchText, styles.highlighted_text)}
          </div>
          <div className={styles.tags_wrapper}>
            <GlobalSearchResultCardTags tags={heading.tags} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCardHeadingSection;
