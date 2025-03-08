import styles from './ticket-channel-icon-renderer.module.css';
import { classNames } from 'common/utils/helpers/helpers';
import { CallChannel, EmailChannel, NoChannel } from 'assets/custom-icon/v2';
import { FacebookIcon, GoogleIcon, InstagramIcon } from 'src/assets/social-media-icon/v2';
interface ITicketChannelIconRenderer {
  channel: string | null;
  customClassName?: string;
}

const TicketChannelIconRenderer: React.FC<ITicketChannelIconRenderer> = ({
  channel,
  customClassName
}: ITicketChannelIconRenderer) => {
  switch (channel?.toLowerCase()) {
    case 'instagram':
      return (
        <InstagramIcon type="filled" className={classNames(styles.channel_icon, customClassName)} />
      );
    case 'facebook':
      return (
        <FacebookIcon type="filled" className={classNames(styles.channel_icon, customClassName)} />
      );
    case 'google_review':
      return (
        <GoogleIcon type="filled" className={classNames(styles.channel_icon, customClassName)} />
      );
    case 'call':
      return (
        <CallChannel type="filled" className={classNames(styles.call_icon, customClassName)} />
      );
    case 'email':
      return (
        <EmailChannel
          type="filled"
          className={classNames(styles.channel_icon, styles.email_icon, customClassName)}
        />
      );
    default:
      return (
        <NoChannel
          type="outline"
          className={classNames(styles.channel_icon, styles.default_icon, customClassName)}
        />
      );
  }
};

export default TicketChannelIconRenderer;
