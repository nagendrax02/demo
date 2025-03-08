import { trackError } from 'common/utils/experience/utils/track-error';
import { CONSTANTS } from '../../constants';
import styles from './email-fields.module.css';
import { userDataManager } from 'common/utils/entity-data-manager';
import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import useSendEmailStore from '../../send-email.store';
import { CallerSource } from 'src/common/utils/rest-client';
import { getAdditionalUserData } from '../../utils/fetch-config';
import withSuspense from '@lsq/nextgen-preact/suspense';
import { lazy } from 'react';
import { classNames } from 'common/utils/helpers/helpers';

const Dropdown = withSuspense(lazy(() => import('@lsq/nextgen-preact/dropdown')));

const ReplyTo = ({ callerSource }: { callerSource: CallerSource }): JSX.Element => {
  const { fields, setFields, options, setOptions, fieldError, emailConfig } = useSendEmailStore();

  const fetchOptions = async (searchText: string = ''): Promise<IOption[]> => {
    const opts: IOption[] = [];
    try {
      const response = await userDataManager.getDropdownOptions({
        searchText: searchText,
        callerSource,
        additionalData: getAdditionalUserData(fields, emailConfig?.settings)
      });
      if (response) {
        response.forEach((user) => {
          if (user?.value) {
            const label =
              user?.value === 'LeadOwner'
                ? `${emailConfig?.leadRepresentationName?.SingularName || 'Lead'} Owner`
                : (user?.label as string);
            opts.push({
              label: label,
              value: user?.value as string
            });
          }
        });
      }
    } catch (err) {
      trackError(err);
    }

    return opts;
  };

  const handleFromUserSelect = (user: IOption[]): void => {
    if (user?.length) {
      if (options.matchFromAndReplyTo && user[0] !== fields.from) {
        setOptions({ matchFromAndReplyTo: false });
      }
      setFields({ replyTo: user[0] });
    } else {
      setFields({ replyTo: undefined });
      setOptions({ matchFromAndReplyTo: false });
    }
  };

  return (
    <div className={styles.field}>
      <div className={`${styles.field_name}`}>{CONSTANTS.REPLY_TO}</div>
      <div>
        <Dropdown
          fetchOptions={fetchOptions}
          selectedValues={[fields.replyTo as IOption]}
          setSelectedValues={handleFromUserSelect}
          customStyleClass={classNames(
            styles.field_value,
            styles.dropdown_value,
            fieldError?.ReplyTo ? styles.input_error : '',
            styles.icon_wrapper
          )}
          showCheckIcon
          hideClearButton={!fields.replyTo}
          placeHolderText=" "
        />
        {fieldError?.ReplyTo ? (
          <div className={styles.field_error}>{fieldError?.ReplyTo}</div>
        ) : null}
      </div>
    </div>
  );
};

export default ReplyTo;
