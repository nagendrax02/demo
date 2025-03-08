import { getPurifiedContent } from 'common/utils/helpers';
import { INotesItem } from '../../notes.types';
import styles from './notes-timeline.module.css';
import { useEffect, useState } from 'react';
import MetaDataInfo from './MetaDataInfo';
import { Attachment } from './Attachment';

interface IBody {
  data: INotesItem;
  entityId: string;
}

const Body = (props: IBody): JSX.Element => {
  const { data, entityId } = props;
  const [htmlContent, setHtmlContent] = useState('');

  const noteContent = data?.Note || data?.Description;

  useEffect(() => {
    (async (): Promise<void> => {
      setHtmlContent(await getPurifiedContent(noteContent || '', true));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className={styles.notes_body}>
      <span
        data-testid="note-content"
        dangerouslySetInnerHTML={{
          // eslint-disable-next-line @typescript-eslint/naming-convention
          __html: htmlContent
        }}
      />
      <Attachment notesItem={data} entityId={entityId} />
      <MetaDataInfo notesItem={data} />
    </div>
  );
};

export default Body;
