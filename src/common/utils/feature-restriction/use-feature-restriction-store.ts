import { create } from 'zustand';
import { IRestrictionData } from 'common/utils/feature-restriction/feature-restriction.types';

export interface IFeatureRestrictionStore {
  isLoading: boolean;
  restrictionData: IRestrictionData;
  setIsLoading: (data: boolean) => void;
  setRestrictionData: (data: IRestrictionData) => void;
}
const initialState = {
  isLoading: true,
  restrictionData: {
    userActions: new Map(),
    userRestrictions: new Map()
  }
};

const useFeatureRestrictionStore = create<IFeatureRestrictionStore>((set) => ({
  // state
  ...initialState,

  // setState
  setIsLoading: (loading: boolean): void => {
    set({ isLoading: loading });
  },

  setRestrictionData: (data: IRestrictionData): void => {
    set({ restrictionData: data });
  }
}));

export default useFeatureRestrictionStore;
