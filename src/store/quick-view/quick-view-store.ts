import { ReactNode } from 'react';
import { create } from 'zustand';

interface IQuickViewStore {
  component: ReactNode;
}

export const useQuickView = create<IQuickViewStore>(() => ({
  component: null
}));

export const setQuickViewContent = (component: ReactNode): void => {
  useQuickView.setState(() => ({
    component
  }));
};
