import { EntityType } from 'common/types';
import { create } from 'zustand';
import { IRecordType } from 'apps/smart-views/components/smartview-tab/smartview-tab.types';

export interface IFullScreenDetails {
  showFullScreen: boolean;
  selectedRecordId: string;
  type: EntityType;
  records: IRecordType[];
  fullScreenEntityTypeCode: string;
  fullScreenTitle: string;
  deletedRecordId: string[];
  isFullScreenLoading: boolean;
}

const useFullScreenDetails = create<IFullScreenDetails>(() => {
  return {
    showFullScreen: false,
    selectedRecordId: '',
    type: EntityType.Lead,
    records: [],
    fullScreenEntityTypeCode: '',
    fullScreenTitle: '',
    deletedRecordId: [],
    isFullScreenLoading: true
  };
});

export const setFullScreenShow = (show: boolean): void => {
  useFullScreenDetails.setState(() => ({ showFullScreen: show }));
};

export const setFullScreenDeleteId = (id: string): void => {
  useFullScreenDetails.setState(() => ({
    deletedRecordId: [...useFullScreenDetails.getState().deletedRecordId, id]
  }));
};

export const setFullScreenLoading = (loading: boolean): void => {
  useFullScreenDetails.setState(() => ({ isFullScreenLoading: loading }));
};

export const setFullScreenSelectedRecordId = (id: string): void => {
  useFullScreenDetails.setState(() => ({ selectedRecordId: id }));
};

export const setFullScreenType = (type: EntityType): void => {
  useFullScreenDetails.setState(() => ({ type: type }));
};

export const setFullScreenRecords = (records: IRecordType[]): void => {
  useFullScreenDetails.setState(() => ({ records: records }));
};

export const setFullScreenEntityTypeCode = (fullScreenEntityTypeCode: string): void => {
  useFullScreenDetails.setState(() => ({ fullScreenEntityTypeCode: fullScreenEntityTypeCode }));
};

export const setFullScreenTitle = (fullScreenTitle: string): void => {
  useFullScreenDetails.setState(() => ({ fullScreenTitle: fullScreenTitle }));
};

export const getFullScreenSelectedRecordId = (): string => {
  return useFullScreenDetails.getState().selectedRecordId;
};

export const getFullScreenEntityTypeCode = (): string => {
  return useFullScreenDetails.getState().fullScreenEntityTypeCode;
};

export const getIsFullScreenEnabled = (): boolean => {
  return useFullScreenDetails.getState().showFullScreen;
};

export const getFullScreenTabType = (): EntityType => {
  return useFullScreenDetails.getState().type;
};

export const getFullScreenTitle = (): string => {
  return useFullScreenDetails.getState().fullScreenTitle;
};

export const resetFullScreenDetails = (): void => {
  useFullScreenDetails.setState(() => ({
    showFullScreen: false,
    selectedRecordId: '',
    type: EntityType.Lead,
    showNavigation: true,
    fullScreenEntityTypeCode: '',
    records: [],
    fullScreenTitle: '',
    deletedRecordId: [],
    isFullScreenLoading: false
  }));
};

export default useFullScreenDetails;
