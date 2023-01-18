import { useAppStore, WarningPageData } from '@/src/store';
import { NavigateOptions, To, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export type NavigateFuncParams = [To, NavigateOptions?] | [number];
export type NavigateFunc = (params: [To, NavigateOptions?] | [number], opt?: any) => void;
export const useNavigatePreCheck = (
  pre: (params: NavigateFuncParams, opt?: any) => null | WarningPageData
): NavigateFunc => {
  const navigate = useNavigate();
  const setWarningPageData = useAppStore((state) => state.setWarningPageData);

  const ret: NavigateFunc = useCallback(
    (params: NavigateFuncParams, opt?: any) => {
      console.debug('useNavigatePreCheck', params);
      const preFuncRes = pre(params, opt);
      if (preFuncRes !== null) {
        setWarningPageData(preFuncRes);
        navigate('/warning');
      } else {
        // @ts-ignore
        navigate(...params);
      }
    },
    [navigate, pre, setWarningPageData]
  );

  return ret;
};
