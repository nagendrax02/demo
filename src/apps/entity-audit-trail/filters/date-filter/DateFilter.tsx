import DateFilter, { IDateOption } from 'common/component-lib/date-filter';
import useAuditTrailStore from '../../entity-audit-trail.store';
import { setDateFilterSelectedValueInCache } from '../../utils/cache-data';

const AuditTrailDateFilter = (): JSX.Element => {
  const { filters, setDateFilterSelectedValue, setFetchCriteria } = useAuditTrailStore();

  const setDateFilter = (opt: IDateOption): void => {
    setDateFilterSelectedValue(opt);
    setDateFilterSelectedValueInCache(opt);
    setFetchCriteria({
      pageCountArray: [0],
      totalRecordCount: 0,
      pageNumber: 0
    });
  };

  return (
    <DateFilter
      selectedOption={filters?.dateFilter?.selectedValue}
      setSelectedOption={setDateFilter}
    />
  );
};

export default AuditTrailDateFilter;
