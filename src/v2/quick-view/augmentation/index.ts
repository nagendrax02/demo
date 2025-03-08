import { IQuickViewCard } from '@lsq/nextgen-preact/quick-view/quick-view.types';
import { EntityType } from 'common/types';
import { IGetAugmentedData } from './augmentation.types';

const taskAugmenter = async (): Promise<(data: IGetAugmentedData) => Promise<IQuickViewCard>> => {
  const augmentModule = await import('./task/augmentation');
  return augmentModule.getTaskAugmentedData;
};

const leadAugmenter = async (): Promise<(data: IGetAugmentedData) => Promise<IQuickViewCard>> => {
  const augmentModule = await import('./lead/augmentation');
  return augmentModule.getleadAugmentedData;
};

const ticketAugmenter = async (): Promise<(data: IGetAugmentedData) => Promise<IQuickViewCard>> => {
  const augmentModule = await import('./ticket/augmentation');
  return augmentModule.getTicketAugmentedData;
};
export const quickViewAugmenter = async (data: IGetAugmentedData): Promise<IQuickViewCard> => {
  const AugmenterMap: Record<
    string,
    () => Promise<(data: IGetAugmentedData) => Promise<IQuickViewCard>>
  > = {
    [EntityType.Task]: taskAugmenter,
    [EntityType.Lead]: leadAugmenter,
    [EntityType.Ticket]: ticketAugmenter
  };

  const augmenter = await AugmenterMap[data.entityType]?.();
  const augmentedData = await augmenter(data);

  return augmentedData;
};
