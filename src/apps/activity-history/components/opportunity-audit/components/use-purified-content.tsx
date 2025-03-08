import { trackError } from 'common/utils/experience/utils/track-error';
import { useEffect, useState } from 'react';
import { getPurifiedContent } from 'common/utils/helpers';

const usePurifiedContent = (content: string | undefined, preserveLinkTarget?: boolean): string => {
  const [purifiedContent, setPurifiedContent] = useState('');

  useEffect(() => {
    const fetchPurifiedContent = async (): Promise<void> => {
      try {
        const purifiedValue = (await getPurifiedContent(
          content || '',
          preserveLinkTarget
        )) as string;
        setPurifiedContent(purifiedValue);
      } catch (error) {
        trackError('Failed to get purified content', error);
      }
    };
    fetchPurifiedContent();
  }, [content, preserveLinkTarget]);

  return purifiedContent;
};

export default usePurifiedContent;
