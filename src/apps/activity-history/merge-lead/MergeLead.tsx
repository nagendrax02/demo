import { useCallback, useEffect, useState } from 'react';
import { IChildLeadData, IHeaderData, ISectionData } from './merge-lead-types';
import {
  generateHeaderColumn,
  generateSectionColumn,
  getChildLeads,
  schemanameToAttributeMap
} from './merge-lead-helpers';
import Modal from '@lsq/nextgen-preact/modal';
import styles from './merge-lead.module.css';
import Table from './render-table';
import { getAugmentedAttributes } from 'apps/entity-attribute-details/augment-data/attributes';
import useEntityDetailStore, {
  useAugmentedEntityData,
  useLeadRepName
} from 'apps/entity-details/entitydetail.store';
import {
  IAugmentedAttributeFields,
  IAugmentedAttributes
} from 'apps/entity-details/types/entity-data.types';
import { ILeadAttribute, ILeadDetailsConfiguration, ISection } from 'common/types/entity/lead';
import { getLeadMetaDataCache } from 'common/utils/entity-data-manager/lead/cache-metadata';
import { getPersistedAuthConfig } from 'common/utils/authentication';

export interface IMergeLeadProps {
  prospectAuditId: string;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const MergeLead = ({ prospectAuditId, show, setShow }: IMergeLeadProps): JSX.Element | null => {
  const augmentedLeadData = useAugmentedEntityData();
  const [sectionData, setSectionData] = useState<ISectionData[] | null>(null);
  const [headerData, setHeaderData] = useState<IHeaderData | null>(null);
  const attributes = useEntityDetailStore((state) => state?.augmentedEntityData?.attributes);
  const leadRepName = useLeadRepName();
  const getEntityDetailsAttribute = useCallback(async (): Promise<
    IAugmentedAttributes[] | null
  > => {
    return new Promise((res) => {
      if (attributes) {
        const augmentedAttributes = getAugmentedAttributes({
          attributes: attributes?.detailsConfiguration as ILeadDetailsConfiguration,
          fields: attributes?.fields,
          metaData: attributes?.metadata
        });
        res(augmentedAttributes);
      }
    });
  }, [attributes]);

  const generateSectionDatas = useCallback(
    (
      childLeadData: IChildLeadData[],
      fieldPropertyMap: Map<string, IAugmentedAttributeFields>,
      leadMetadataMap: Record<string, ILeadAttribute>
    ): void => {
      const userRole = getPersistedAuthConfig()?.User?.Role || '';

      if (!augmentedLeadData?.attributes?.detailsConfiguration?.Sections?.length) return;
      const leadSectionData: ISectionData[] = [];
      for (const section of augmentedLeadData?.attributes?.detailsConfiguration
        ?.Sections as (ISection & {
        DispositionField: string;
      })[]) {
        const genSectionData = generateSectionColumn({
          section,
          childLeadData: childLeadData,
          fieldPropertyMap,
          leadMetadataMap,
          userRole
        });
        if (genSectionData) {
          leadSectionData.push(genSectionData);
        }
      }

      setSectionData(leadSectionData);
    },
    [augmentedLeadData]
  );

  const getMergeLeadData = async (): Promise<void> => {
    const augmentedAttributes = await getEntityDetailsAttribute();
    if (augmentedAttributes) {
      getChildLeads({
        prospectAuditId
      }).then(async (childLeadData) => {
        if (!childLeadData) return;
        const fieldPropertyMap = schemanameToAttributeMap(augmentedAttributes);
        const leadMetadataMap = (await getLeadMetaDataCache()) || {};
        generateSectionDatas(childLeadData, fieldPropertyMap, leadMetadataMap);
        const generatedHeaderData = generateHeaderColumn({
          childLeadData,
          leadRepName: leadRepName.SingularName ?? 'Lead'
        });
        setHeaderData(generatedHeaderData);
      });
    }
  };

  useEffect(() => {
    getMergeLeadData();
  }, [attributes]);

  return (
    <>
      <Modal show={show}>
        <Modal.Header
          title={`Merged with below ${leadRepName?.PluralName ?? 'Lead'}`}
          onClose={() => {
            setShow(false);
          }}
          customStyleClass={styles.merge_lead_header}></Modal.Header>
        <Modal.Body customStyleClass={`${styles.merge_lead_modal}`}>
          <div className={`${styles.merge_lead_table_container}`}>
            <Table
              headerData={headerData}
              sectionData={sectionData}
              width="100%"
              isLoading={!sectionData?.length}></Table>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MergeLead;
