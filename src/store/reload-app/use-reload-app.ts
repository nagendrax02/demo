import { create } from 'zustand';

interface IUseReloadApp {
  reloadAppKey: string;
}

export const useReloadApp = create<IUseReloadApp>(() => ({
  reloadAppKey: ''
}));

export const reloadApp = (canReload = true): void => {
  if (!canReload) return;
  useReloadApp.setState(() => ({
    reloadAppKey: Date.now()?.toString()
  }));
};
