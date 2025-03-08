import { ILeadDetails } from './detail.types';

type ICachedLeadDetails = Omit<ILeadDetails, 'Fields'>;

export type { ICachedLeadDetails };
