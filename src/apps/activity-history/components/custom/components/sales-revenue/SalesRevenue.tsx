import { getRevenue, roundOffRevenue } from './utils';
import styles from './sales-revenue.module.css';

interface ISalesRevenue {
  note: string | undefined;
  isSalesCancelled: boolean;
}
const SalesRevenue = (props: ISalesRevenue): JSX.Element | null => {
  const { note, isSalesCancelled } = props;

  if (!note) {
    return null;
  }
  const revenue = getRevenue(note);

  if (!revenue) return null;

  const getRevenueContent = (): string => {
    const currencySymbol = revenue[0];
    const revenueAmount = Number(revenue.slice(1));
    if (revenueAmount >= 1000) {
      const newRevenueAmount = roundOffRevenue(revenueAmount);
      return `${currencySymbol}${newRevenueAmount}`;
    }
    return revenue;
  };

  const className = `${styles.sales_revenue} ${isSalesCancelled ? styles.cancelled : ''}`;

  return (
    <div className={className} dir="ltr">
      {getRevenueContent()}
    </div>
  );
};

export default SalesRevenue;
