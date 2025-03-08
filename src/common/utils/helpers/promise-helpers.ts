import { IControllablePromise, IResolveReject } from './helpers.types';

const PREFIX = 'STORED_PROMISE_';

const createControllablePromise = (): IControllablePromise => {
  let appResolve: IResolveReject | null = null;
  let appReject: IResolveReject | null = null;

  const promise = new Promise((resolve, reject) => {
    appResolve = resolve;
    appReject = reject;
  });

  return {
    promise,
    resolve: appResolve,
    reject: appReject
  };
};

const createStoredPromise = <T>(key: string, promiseCallback: Promise<T>): void => {
  window[`${PREFIX}${key}`] = promiseCallback;
};

const getStoredPromise = <T>(key: string): Promise<T> => {
  return window[`${PREFIX}${key}`] as Promise<T>;
};

export { createControllablePromise, createStoredPromise, getStoredPromise };
