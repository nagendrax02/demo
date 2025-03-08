import { IOption } from '@lsq/nextgen-preact/dropdown/dropdown.types';
import { IAugmentedAHDetail } from './activity-history.types';
import { IDateOption } from 'src/common/component-lib/date-filter';
import { CallerSource } from 'common/utils/rest-client';
import { ISelectedLeadFilterOption } from '../components/filters/account-lead-filter/accountLeadFilter.types';

interface IActionModal {
  delete: boolean;
  cancel: boolean;
}

interface IActivityHistoryStore {
  isLoading: boolean;
  augmentedAHDetails: IAugmentedAHDetail[] | null;
  typeFilter: IOption[];
  dateFilter: IDateOption | undefined;
  setIsLoading: (loading: boolean) => void;
  setAugmentedAHDetails: (data: IAugmentedAHDetail[]) => void;
  setTypeFilter: (data: IOption[], isAccountLeadActivityHistoryTab?: boolean) => void;
  setDateFilter: (data: IDateOption) => void;
  clearFilters: (isAccountLeadActivityHistoryTab?: boolean) => void;
  reset: () => void;
  showModal: IActionModal;
  setShowModal: (actionType: string, visibility: boolean) => void;
  selectedIdToPerformAction: string;
  setSelectedIdToPerformAction: (id: string) => void;
  setSelectedDetails: (data: IAugmentedAHDetail | null) => void;
  selectedDetails: IAugmentedAHDetail | null;
  updateAHRecord: (data: IAugmentedAHDetail) => void;
  accountLeadSelectedOption: ISelectedLeadFilterOption[];
  setAccountLeadSelectedOption: (data: ISelectedLeadFilterOption[] | null) => void;
}

interface IActivityHistoryActionsStore {
  showModal: IActionModal;
  setShowModal: (actionType: string, visibility: boolean, actionCallerSource: CallerSource) => void;
  actionCallerSource: CallerSource;
  selectedIdToPerformAction: string;
  setSelectedIdToPerformAction: (id: string) => void;
  setSelectedDetails: (data: IAugmentedAHDetail | null) => void;
  selectedDetails: IAugmentedAHDetail | null;
}

export type { IActivityHistoryStore, IActionModal, IActivityHistoryActionsStore };
