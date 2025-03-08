import { ISocialMediaConfig, SocialMediaSchema } from 'apps/entity-details/types/entity-data.types';
import styles from './social-media.module.css';
import { getUrl } from '../link/utils';
import { facebook, googlePlus, linkedIn, skype, twitter } from 'assets/social-media-icon';

export interface ISocialMedia {
  schemaName?: string;
  link?: string;
  config?: ISocialMediaConfig;
}

const SocialMedia = (props: ISocialMedia): JSX.Element => {
  const { schemaName, link, config } = props;

  const renderBySchemaName = {
    [SocialMediaSchema.FaceBookId]: <img data-testid="facebook" src={facebook} />,
    [SocialMediaSchema.GooglePlusId]: <img data-testid="google" src={googlePlus} />,
    [SocialMediaSchema.LinkedInId]: <img data-testid="linkedin" src={linkedIn} />,
    [SocialMediaSchema.SkypeId]: <img data-testid="skype" src={skype} />,
    [SocialMediaSchema.TwitterId]: <img data-testid="twitter" src={twitter} />
  };

  return (
    <div data-testid="social-media">
      {link ? (
        <a className={styles.button} href={getUrl(link)} target="_self">
          <div className={styles.icon_wrapper}>
            {config?.renderIcon && schemaName && renderBySchemaName[schemaName.toLocaleLowerCase()]
              ? renderBySchemaName[schemaName.toLocaleLowerCase()]
              : null}
            {config?.renderLink ? (
              <div className={`${styles.link_style} social-media-link`} title={link}>
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
