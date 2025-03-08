import {
  IAugmentedAction,
  IEntityDetailsCoreData,
  IEntityRepresentationName
} from 'apps/entity-details/types/entity-data.types';
import { EntityType } from 'common/types';
import { getActions as getLeadActions } from 'apps/entity-details/utils/augment-entity-data/lead/vcard-action';
import { DEFAULT_ENTITY_IDS, DEFAULT_ENTITY_REP_NAMES } from 'common/constants';
import { IEntityIds } from 'apps/entity-details/types/entity-store.types';
import {
  ArrowRotateAngle,
  ArrowRotateDirection,
  DefaultState
} from '@lsq/nextgen-preact/accordion/accordion.types';
import { isMobileDevice } from 'common/utils/helpers';
import { getProfileName } from 'common/utils/helpers/helpers';
export const createEntityDetailsCoreData = (
  entity: {
    entityName?: string;
    entityType: EntityType;
    entityId: string;
  },
  entityRepName: IEntityRepresentationName
): IEntityDetailsCoreData => {
  const { entityName, entityType, entityId } = entity;
  return {
    entityDetailsType: entityType,
    entityIds: {
      ...DEFAULT_ENTITY_IDS,
      [entityType]: entityId
    },
    entityName: entityName,
    entityRepNames: {
      ...DEFAULT_ENTITY_REP_NAMES,
      [entityType]: entityRepName
    },
    prospectAutoId: ''
  };
};

export type GetActionsFunction<T> = (entityData: T) => unknown;

export const mapEntityTypeToGetActions = <T>(entityType: EntityType): GetActionsFunction<T> => {
  if (entityType === EntityType.Lead) {
    return getLeadActions as GetActionsFunction<T>;
  } else {
    throw new Error(`No getActions function defined for entity type: ${entityType}`);
  }
};

export const getAccordianDeviceConfig: () => {
  defaultState: DefaultState;
  arrowRotate: { angle: ArrowRotateAngle; direction: ArrowRotateDirection };
} = () => {
  const isMobile = isMobileDevice();

  return {
    defaultState: isMobile ? DefaultState.CLOSE : DefaultState.OPEN,
    arrowRotate: {
      angle: isMobile ? ArrowRotateAngle.Deg90 : ArrowRotateAngle.Deg180,
      direction: ArrowRotateDirection.ClockWise
    }
  };
};

export const getName = (record: Record<string, string | null>): string => {
  return record?.FirstName || record?.LastName
    ? `${record?.FirstName ?? ''} ${record?.LastName ?? ''}`?.trim()
    : 'No Name';
};
export const getInitials = (record: Record<string, string | null>): string => {
  return getProfileName(getName(record));
};

export const createEntityIds = (entityType: EntityType, entityId: string): IEntityIds => {
  return {
    ...DEFAULT_ENTITY_IDS,
    [entityType]: entityId
  };
};

export const addRenderAsIconForTypeButton = (
  augmentedAction: IAugmentedAction
): IAugmentedAction => {
  const updatedActions = augmentedAction.actions.map((action) => {
    if (action.type === 'Button') {
      return {
        ...action,
        renderAsIcon: false,
        toolTip: action.toolTip ?? action.title
      };
    }
    return action;
  });

  return {
    ...augmentedAction,
    actions: updatedActions
  };
};
