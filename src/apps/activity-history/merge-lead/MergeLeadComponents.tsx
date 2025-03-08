import { Placement, Trigger } from '@lsq/nextgen-preact/tooltip/tooltip.types';
import Table from './render-table/Table';
import { IChildLeadData, IGenerateCFSFieldRowsData } from './merge-lead-types';
import styles from './merge-lead.module.css';
import { lazy, ReactNode, useEffect, useState } from 'react';
import Icon from '@lsq/nextgen-preact/icon';
import getCFSLeadData, { generateCFSFieldRows } from './merge-lead-cfs-helper';
import { getEntityId } from 'common/utils/helpers';
import { IAugmentedAttributeFields } from 'apps/entity-details/types/entity-data.types';
import withSuspense from '@lsq/nextgen-preact/suspense';

const Tooltip = withSuspense(lazy(() => import('@lsq/nextgen-preact/tooltip')));

interface IMergeLeadCFS {
  fieldPropertyData: IAugmentedAttributeFields;
  lead: IChildLeadData;
}

interface IMergeLeadCFSTooltip {
  fieldPropertyData: IAugmentedAttributeFields;
  lead: IChildLeadData;
}

interface ILeadColumnHeadingProps {
  leadColumnData: string | ReactNode;
}

const MergeLeadCFSTooltip = (props: IMergeLeadCFSTooltip): JSX.Element => {
  const { fieldPropertyData, lead } = props;
  const [tableData, setTableData] = useState<IGenerateCFSFieldRowsData | null>(null);

  async function handleAndPopulateCfsData(): Promise<void | null> {
    const response = await getCFSLeadData({
      leadId: getEntityId(),
      schemaName: fieldPropertyData.schemaName,
      customObjectProspectId: lead?.[fieldPropertyData.schemaName] ?? '',
      isChildLead: true
    });
    const tableDataToPopulate = generateCFSFieldRows({
      fieldPropertyData,
      lead,
      cfsFieldObj: response
    });

    setTableData(tableDataToPopulate);
  }

  useEffect(() => {
    handleAndPopulateCfsData();
  }, []);

  return (
    <Table
      sectionData={tableData?.sectionData ?? null}
      headerData={tableData?.headerData ?? null}
      isLoading={!tableData}></Table>
  );
};

const MergeLeadCFS = (props: IMergeLeadCFS): JSX.Element => {
  const { fieldPropertyData, lead } = props;
  const generateTooltipContent = (): JSX.Element | string => {
    return (
      <MergeLeadCFSTooltip fieldPropertyData={fieldPropertyData} lead={lead}></MergeLeadCFSTooltip>
    );
  };
  return (
    <Tooltip
      content={generateTooltipContent()}
      placement={Placement.Vertical}
      trigger={[Trigger.Click]}>
      <div className={`${styles.merge_lead_cfs_view_details}`}>View Details</div>
    </Tooltip>
  );
};

const LeadColumnHeading = (props: ILeadColumnHeadingProps): JSX.Element => {
  const { leadColumnData } = props;
  return (
    <div className={`${styles.lead_column_name}`}>
      <Icon name="person" customStyleClass={styles.merge_lead_icon}></Icon>
      <div> {leadColumnData} </div>
    </div>
  );
};

const PreviewNotAvailable = (): JSX.Element => {
  return <div className={`${styles.preview_not_available}`}> Preview not Available </div>;
};

export default MergeLeadCFS;
export { LeadColumnHeading, PreviewNotAvailable };
