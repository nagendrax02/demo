import { create } from 'zustand';
import { Module } from './mip-header.types';

interface IMiPHeader {
  clickedAction: string | null;
  module: Module;
}

const initialState: IMiPHeader = {
  clickedAction: null,
  module: Module.INVALID
};

export const useMiPHeader = create<IMiPHeader>(() => ({
  ...initialState
}));

export const handleActionClick = (actionId: string | null): void => {
  useMiPHeader.setState(() => ({ clickedAction: actionId }));
};

export const setMiPHeaderModule = (module: Module): void => {
  useMiPHeader.setState(() => ({ module }));
};
export const onActionModalClose = (): void => {
  useMiPHeader.setState(() => ({ clickedAction: null }));
};
