import { IAutomationTooltipDetails } from 'apps/activity-history/types';
import {
  IEntityDetailsCoreData,
  IEntityRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import { safeParseJson } from 'common/utils/helpers';
import { IAccount } from '../lead-audit.types';
import { EntityType } from 'common/types';

export const getAutomationToolTipDetails = (auditComment: string): IAutomationTooltipDetails => {
  try {
    const parsedComment = safeParseJson(auditComment) as Record<string, unknown>;
    const idAction = (parsedComment?.Id as string)?.split('_');

    return {
      Id: idAction ? idAction[0] : '',
      Action: idAction ? idAction[1] : ''
    };
  } catch (error) {
    return {
      Id: '',
      Action: ''
    };
  }
};

export const getNewValueWithRepName = (
  newValue?: string,
  leadRepName?: IEntityRepresentationName
): string => {
  let newValueWithRepName = '';

  if (newValue) {
    const newValueStr = newValue.toLowerCase();
    newValueWithRepName = newValueStr
      ?.replace('lead', leadRepName?.SingularName || 'Lead')
      .replace('leads', leadRepName?.PluralName || 'Leads');
  }

  return newValueWithRepName;
};

export const parseAccount = (account: string): IAccount => {
  const [name = '', id = ''] = account.split('{mxseperator}');
  return { name, id };
};

export const getAssignedRepName = (
  leadRepresentationName?: IEntityRepresentationName,
  entityDetailsCoreData?: IEntityDetailsCoreData,
  type?: EntityType
): string => {
  let leadRepName = leadRepresentationName?.SingularName || 'Lead';

  if (
    entityDetailsCoreData?.entityDetailsType === EntityType.Account &&
    type === EntityType.Account
  ) {
    leadRepName =
      entityDetailsCoreData?.entityRepNames?.account?.SingularName ||
      entityDetailsCoreData?.entityTypeRepName ||
      '';
  }
  return leadRepName;
};
