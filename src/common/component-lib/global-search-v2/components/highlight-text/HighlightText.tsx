import React from 'react';
import { escapeRegExp } from '../../utils/utils';
import styles from './highlight-text.module.css';

const HighlightText = (text: string, query: string, highlightClass?: string): React.ReactNode[] => {
  if (!query) return [text];

  const escapedQuery = escapeRegExp(query);
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part) =>
    regex.test(part) ? (
      <span key={part} className={highlightClass ?? styles.hightlight_text}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

export default HighlightText;
