import { create } from 'zustand';
import { IEntityDetailStore, IEntityRepresentationConfig } from './types/entity-store.types';
import {
  IAugmentedEntity,
  IEntityDetailsCoreData,
  IEntityRepresentationName
} from './types/entity-data.types';

import { DEFAULT_REPRESENTATION_NAME } from './constants';
import { EntityType } from 'common/types';
import { DEFAULT_ENTITY_IDS, DEFAULT_ENTITY_REP_NAMES } from 'common/constants';

const initialState = {
  isLoading: true,
  isUpdating: true,
  error: null,
  augmentedEntityData: null,
  representationName: DEFAULT_REPRESENTATION_NAME,
  entityType: EntityType.Lead,
  isStarred: false,
  resetKey: Date.now(),
  coreData: {
    entityDetailsType: EntityType.Lead,
    entityIds: DEFAULT_ENTITY_IDS,
    entityRepNames: DEFAULT_ENTITY_REP_NAMES
  },
  vcardName: undefined,
  primaryContactLeadId: ''
};

const useEntityDetailStore = create<IEntityDetailStore>((set) => ({
  // state
  ...initialState,

  // setState
  setIsLoading: (loading: boolean): void => {
    set({ isLoading: loading });
  },
  setError: (error: Error | null): void => {
    set({ error: error });
  },
  setAugmentedEntityData: (data: IAugmentedEntity): void => {
    set({ augmentedEntityData: data });
  },

  setRepresentationName: (config: IEntityRepresentationConfig): void => {
    set({ representationName: config });
  },
  setEntityType: (data: EntityType): void => {
    set({ entityType: data });
  },

  setIsStarred: (data: boolean): void => {
    set({ isStarred: data });
  },

  setCoreData: (data: IEntityDetailsCoreData): void => {
    set({ coreData: data });
  },

  setVcardName: (data: string): void => {
    set({ vcardName: data });
  },

  // reset all states to initial values
  resetEntityDetailStore: (): void => {
    set({ ...initialState });
  }
}));

export const getLeadType = (): string | undefined => {
  return (
    useEntityDetailStore.getState().augmentedEntityData?.properties?.fields?.LeadType ?? undefined
  );
};

const useLeadRepName = (): IEntityRepresentationName =>
  useEntityDetailStore((state) => state?.representationName?.lead);

export default useEntityDetailStore;
export { useLeadRepName };

export const useSetAugmentedEntityData = (): ((data: IAugmentedEntity) => void) =>
  useEntityDetailStore((state) => state.setAugmentedEntityData);

export const useAugmentedEntityData = (): IAugmentedEntity =>
  useEntityDetailStore((state) => state.augmentedEntityData) as IAugmentedEntity;

export const reinitiateFetchLead = (): void => {
  useEntityDetailStore.setState({ resetKey: Date.now() });
};

export const setIsUpdating = (canStart: boolean): void => {
  useEntityDetailStore.setState(() => ({ isUpdating: canStart }));
};
