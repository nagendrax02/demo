interface ISubscription<T> {
  [key: string]: {
    [uuid: string]: (data: T) => void;
  };
}

interface ISubscribeEvent {
  remove: () => void;
}

interface IExternalAppEventHandler<T> {
  subscriptions: ISubscription<T>;
  action: Record<string, T>;
  isListeningEvent: boolean;
  loadedScripts: Record<string, boolean>;
}

export type { ISubscribeEvent, IExternalAppEventHandler, ISubscription };
