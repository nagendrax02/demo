import Badge from '@lsq/nextgen-preact/v2/badge';
import styles from './ticket-vcard-footer.module.css';
import HourGlass from 'assets/custom-icon/v2/HourGlass';
interface ITicketVcardFooterProperties {
  status: string;
  resolutionTime: string;
}
const TicketVcardFooter: React.FC<ITicketVcardFooterProperties> = ({
  resolutionTime,
  status
}: ITicketVcardFooterProperties) => {
  return (
    <div className={styles.vcard_footer}>
      <Badge size="md" status="neutral" type="semibold">
        {status}
      </Badge>
      <Badge size="md" status="pending">
        <div className={styles.resolution_time}>
          <HourGlass type="outline" className={styles.resolution_time_icon} />
          {resolutionTime}
        </div>
      </Badge>
    </div>
  );
};

export default TicketVcardFooter;
