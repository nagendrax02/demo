import { useEffect, useState } from 'react';
import { getDictionary } from '../../body/utils';
import { PAGE_TITLE, PAGE_URL } from '../../constants';
import { getPurifiedContent } from 'common/utils/helpers';

export interface ICustomWebEvent {
  activityName: string;
  additionalDetails: Record<string, string>;
}

const CustomWebEvent = (props: ICustomWebEvent): JSX.Element => {
  const { activityName, additionalDetails } = props;

  const content = getDictionary(additionalDetails?.ActivityEvent_Note || '');

  const [link, setLink] = useState<string>('');

  const hasNotes = content?.Notes || '';

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
          performed on page{' '}
          <a
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
        {' '}
        <span>
          Web Event {`"${activityName}"`} {getLink()} {hasNotes ? ' : ' : '.'}
        </span>
        {hasNotes && content?.Notes ? <span>{content.Notes}</span> : null}
      </div>
    </div>
  );
};

export default CustomWebEvent;
