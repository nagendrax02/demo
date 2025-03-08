import React from 'react';
import styles from './global-search-result-card-tags.module.css';
import { ITag } from '../../global-searchV2.types';
import ResultCardTag from '../result-card-tag';
import { classNames } from 'common/utils/helpers/helpers';

interface IGlobalSearchResultCardTagsProps {
  tags: ITag[];
}

const GlobalSearchResultCardTags: React.FC<IGlobalSearchResultCardTagsProps> = ({ tags }) => {
  return (
    <>
      {tags?.length > 0
        ? tags
            .filter((tag: ITag) => tag.value && tag.value !== 'false')
            .map((tag: ITag) => {
              return (
                <div
                  className={classNames(styles.tag, tag.className)}
                  key={tag.id ?? tag.attribute}>
                  <ResultCardTag tag={tag} />
                </div>
              );
            })
        : null}
    </>
  );
};

export default GlobalSearchResultCardTags;
