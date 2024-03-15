import { useAppStore, WarningPageData } from '@/store';
import { useNavigate, UseNavigateResult } from '@tanstack/react-router';
import { useCallback } from 'react';

export type NavigateFuncParams = Parameters<UseNavigateResult<string>>[0];
export type NavigateFunc = (params: NavigateFuncParams, opt?: any) => void;

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
        navigate({ to: '/warning' });
      } else {
        navigate(params ?? {});
      }
    },
    [navigate, pre, setWarningPageData]
  );

  return ret;
};
