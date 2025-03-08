import { Ref } from 'react';
import styles from './content.module.css';

interface IContent {
  children: JSX.Element;
  customStyleClass?: string;
  contentRef?: Ref<HTMLDivElement> | null;
}

const Content = (props: IContent): JSX.Element => {
  const { children, customStyleClass, contentRef } = props;

  return (
    <div
      ref={contentRef}
      className={`${styles.content} ${customStyleClass}`}
      data-testid="tab-content">
      {children}
    </div>
  );
};

Content.defaultProps = {
  unmountOnExit: false,
  customStyleClass: '',
  contentRef: null
};

export default Content;
