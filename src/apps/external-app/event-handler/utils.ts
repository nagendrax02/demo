import { ISubscription } from './event-handler.type';

export const getKey = (): string => {
  if (typeof crypto?.randomUUID !== 'function') {
    return Date.now()?.toString();
  }
  return crypto?.randomUUID();
};

export const removeKey = <T>(
  subscription: ISubscription<T>,
  eventName: string,
  uid: string
): ISubscription<T> => {
  delete subscription?.[eventName]?.[uid];
  return subscription;
};
