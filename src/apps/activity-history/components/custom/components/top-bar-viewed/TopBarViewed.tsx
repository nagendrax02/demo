import { useEffect, useState } from 'react';
import { getDictionary } from '../../body/utils';
import { getPurifiedContent } from 'common/utils/helpers';
import { PAGE_TITLE, PAGE_URL } from '../../constants';
import styles from './top-bar-viewed.module.css';

export interface ITopBarViewed {
  activityName: string;
  additionalDetails: Record<string, string>;
}

const TopBarViewed = (props: ITopBarViewed): JSX.Element => {
  const { activityName, additionalDetails } = props;

  const content = getDictionary(additionalDetails?.ActivityEvent_Note || '');

  const [link, setLink] = useState<string>('');

  useEffect(() => {
    (async function getParsedLink(): Promise<void> {
      const parsedLink = await getPurifiedContent(content?.PageTitle);
      setLink(parsedLink);
    })();
  }, []);

  const getLink = (): JSX.Element | null => {
    if (content[PAGE_TITLE] && content[PAGE_URL]) {
      return (
        <span>
          {' '}
          on page{' '}
          <a
            className={styles.link_hover}
            target="_blank"
            href={content?.PageURL}
            dangerouslySetInnerHTML={{
              // eslint-disable-next-line @typescript-eslint/naming-convention
              __html: link
            }}
            rel="noopener"
          />
        </span>
      );
    }
    return null;
  };

  return (
    <div>
      <div>
        <span>
          {activityName} ({content?.WebWidgetName ? content.WebWidgetName : null})
        </span>
        {getLink()}
      </div>
    </div>
  );
};

export default TopBarViewed;
