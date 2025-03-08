import Badge from '@lsq/nextgen-preact/v2/badge';
import { ITag } from '../../global-searchV2.types';
import { capitalizeWords } from '../../utils/utils';
import { classNames } from 'common/utils/helpers/helpers';
import styles from './result-card-tag.module.css';

interface IResultCardTagProps {
  tag: ITag;
}

const ResultCardTag: React.FC<IResultCardTagProps> = ({ tag }: IResultCardTagProps) => {
  switch (tag.type) {
    case 'icon':
      return <>{tag.icon}</>;

    case 'badge':
      return (
        <div title={capitalizeWords(tag.value)}>
          <Badge status={tag.status} size="sm">
            <div className={classNames(tag.className ?? '', styles.tag_wrapper)}>
              {capitalizeWords(tag.value)}
            </div>
          </Badge>
        </div>
      );

    default:
      return null;
  }
};

export default ResultCardTag;
