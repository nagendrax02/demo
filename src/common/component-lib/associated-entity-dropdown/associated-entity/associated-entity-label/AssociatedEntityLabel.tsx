import Body from './Body';
import { IAssociatedEntityLabel } from './associated-entity-label.type';
import styles from './entity-label.module.css';
import Title from './Title';

const AssociatedEntityLabel = ({
  titleKeys,
  body,
  config,
  fallbackTitleKeys,
  showSelectedValueAsText
}: IAssociatedEntityLabel): JSX.Element => {
  return (
    <div className={`${styles?.wrapper} ${showSelectedValueAsText ? styles.wrapper_width : ''}`}>
      <Title titleKeys={titleKeys} config={config} fallbackTitleKeys={fallbackTitleKeys} />
      <Body body={body} config={config} />
    </div>
  );
};

export default AssociatedEntityLabel;
