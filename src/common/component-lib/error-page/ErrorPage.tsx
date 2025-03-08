import { ReactNode } from 'react';
import { classNames } from 'common/utils/helpers/helpers';
import styles from './error-page.module.css';
import { Variant } from './error-page.types';

interface IErrorPage {
  variant: Variant;
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  customStyleClass?: string;
}

const ErrorPage = (props: IErrorPage): JSX.Element => {
  const { variant, icon, title, children, customStyleClass } = props;
  return (
    <div
      className={classNames(
        styles.container,
        variant === 'empty' ? styles.empty_variant : styles.error_variant,
        customStyleClass
      )}>
      <div className={classNames('icon', styles.icon)}>{icon}</div>
      <div className={classNames('body', styles.body)}>
        <div className={classNames('title', 'ng_h_1_b', 'ng_v2_style', styles.title)} title={title}>
          {title}
        </div>
        <div className={classNames('content', 'ng_sh_sb', 'ng_v2_style', styles.content)}>
          {children}
        </div>
      </div>
    </div>
  );
};

ErrorPage.defaultProps = {
  children: undefined,
  customStyleClass: undefined
};

export default ErrorPage;
