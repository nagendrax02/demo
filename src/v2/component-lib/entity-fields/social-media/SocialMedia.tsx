import { ISocialMediaConfig, SocialMediaSchema } from 'apps/entity-details/types/entity-data.types';
import styles from './social-media.module.css';
import { getUrl } from '../link/utils';
import commonStyle from '../common-style.module.css';
import { FacebookIcon, GooglePlus, LinkedIn, Skype, Twitter } from 'assets/social-media-icon/v2';
import { classNames } from 'common/utils/helpers/helpers';

export interface ISocialMedia {
  schemaName?: string;
  link?: string;
  config?: ISocialMediaConfig;
}

const SocialMedia = (props: ISocialMedia): JSX.Element => {
  const { schemaName, link, config } = props;

  const renderBySchemaName = {
    [SocialMediaSchema.FaceBookId]: (
      <FacebookIcon dataTestId="facebook" type="filled" className={styles.icon} />
    ),
    [SocialMediaSchema.GooglePlusId]: <GooglePlus dataTestId="google" className={styles.icon} />,
    [SocialMediaSchema.LinkedInId]: <LinkedIn dataTestId="linkedin" className={styles.icon} />,
    [SocialMediaSchema.SkypeId]: <Skype dataTestId="skype" className={styles.icon} />,
    [SocialMediaSchema.TwitterId]: <Twitter dataTestId="twitter" className={styles.icon} />
  };

  return (
    <div data-testid="social-media">
      {link ? (
        <a
          className={classNames(styles.button, commonStyle.hyper_link)}
          href={getUrl(link)}
          target="_self">
          <div className={styles.icon_wrapper}>
            {config?.renderIcon && schemaName && renderBySchemaName[schemaName.toLocaleLowerCase()]
              ? renderBySchemaName[schemaName.toLocaleLowerCase()]
              : null}
            {config?.renderLink ? (
              <div className={`${styles.link_text} social-media-link`} title={link}>
                {link}
              </div>
            ) : null}
          </div>
        </a>
      ) : (
        <></>
      )}
    </div>
  );
};

SocialMedia.defaultProps = {
  schemaName: '',
  link: '',
  config: {
    renderIcon: false,
    renderLink: true
  }
};

export default SocialMedia;
