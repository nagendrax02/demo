import { useReducer, DispatchWithoutAction } from 'react';

type UseToggleReturn = [boolean, DispatchWithoutAction];

const useToggle = (initialValue: boolean = false): UseToggleReturn =>
  useReducer((prevState: boolean) => !prevState, initialValue);

export default useToggle;
