import { trackError } from 'common/utils/experience/utils/track-error';
/* eslint-disable complexity */
import Icon from '@lsq/nextgen-preact/icon';
import { IconVariant } from '@lsq/nextgen-preact/icon/icon.types';
import { ILeadRecord } from './global-search.types';
import styles from './global-search.module.css';
import SendEmail from '../send-email';
import { getUserId } from 'apps/entity-details/utils';
import { CallerSource } from 'common/utils/rest-client';
import { useEffect, useState } from 'react';
import { getName, getQuickAddActions } from './utils';
import { useLeadRepName } from 'apps/entity-details/entitydetail.store';
import MoreActions from 'apps/entity-details/components/vcard/actions/more-actions';
import {
  IActionMenuItem,
  IEntityDetailsCoreData
} from 'apps/entity-details/types/entity-data.types';
import { EntityType } from 'common/types';
import { DEFAULT_ENTITY_REP_NAMES, MOCK_ENTITY_DETAILS_CORE_DATA } from 'common/constants';

interface ILeadActions {
  lead: ILeadRecord;
}

const LeadActions = ({ lead }: ILeadActions): JSX.Element => {
  const [actions, setActions] = useState<IActionMenuItem[]>([]);
  const [showSendEmail, setShowSendEmail] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    getQuickAddActions().then((data) => {
      setActions(data);
    });
  }, []);
  const leadRepName = useLeadRepName();
  const handleCallAction = async (e): Promise<void> => {
    e?.stopPropagation();
    try {
      const module = await import('apps/external-app');
      module.triggerEntityClick2Call({
        fields: { ...lead },
        phoneNumber: lead?.Phone || '',
        schemaName: 'Phone'
      });
    } catch (error) {
      trackError(error);
    }
  };

  const openEmailModal = (e): void => {
    e?.stopPropagation();
    setShowSendEmail(true);
  };

  const coreData: IEntityDetailsCoreData = {
    ...MOCK_ENTITY_DETAILS_CORE_DATA,
    entityDetailsType: EntityType.Lead,
    entityIds: {
      ...MOCK_ENTITY_DETAILS_CORE_DATA.entityIds,
      lead: lead.ProspectID || ''
    },
    entityRepNames: {
      ...DEFAULT_ENTITY_REP_NAMES,
      lead: { ...leadRepName }
    }
  };

  const customButton = (): JSX.Element => (
    <Icon
      name="add_box"
      variant={IconVariant.Filled}
      customStyleClass={styles.action + ` ${isMenuOpen ? styles.visible : ''}`}
    />
  );

  return (
    <div className={styles.actions_container + ` ${isMenuOpen ? styles.visible : ''}`}>
      {lead.DoNotCall === '0' && lead.Phone !== null ? (
        <div onClick={handleCallAction}>
          <Icon
            customStyleClass={styles.action}
            name="call"
            variant={IconVariant.Filled}
            data-testid="call-icon"
            title={'Phone'}
          />
        </div>
      ) : null}
      {lead.DoNotEmail === '0' && lead.EmailAddress !== null ? (
        <div onClick={openEmailModal}>
          <Icon
            customStyleClass={styles.action}
            name="email"
            variant={IconVariant.Filled}
            data-testid="email-icon"
            title={'Email'}
          />
        </div>
      ) : null}
      <div>
        <MoreActions
          menuDimension={{ topOffset: 5 }}
          customButton={customButton}
          coreData={coreData}
          actions={actions}
          customConfig={{ ...lead, LeadId: lead?.ProspectID || '' }}
          setIsMenuOpen={setIsMenuOpen}
        />
      </div>
      {showSendEmail ? (
        <SendEmail
          show
          setShow={() => {
            setShowSendEmail(false);
          }}
          toLead={[
            {
              label: getName(lead),
              value: lead.ProspectID
            }
          ]}
          fromUserId={getUserId()}
          leadRepresentationName={leadRepName}
          callerSource={CallerSource.GlobalSearch}
          leadTypeInternalName={lead?.LeadType}
        />
      ) : null}
    </div>
  );
};

export default LeadActions;
