import clsx from 'clsx';
import { useMemo } from 'react';

interface Props {
  show: boolean;
  toggle: (show: boolean) => void;
}

export const MultiSearchQueries = ({ show, toggle }: Props) => {
  return useMemo(
    () => (
      <div>
        <label className="drawer-overlay" onClick={() => toggle(false)}></label>
        <div className={clsx('drawer right', show && 'show')}>
          <div className="content flex flex-col h-full">
            <label className="btn sm pill ghost compact absolute right-2 top-2" onClick={() => toggle(false)}>
              ✕
            </label>
            <h2 className="text-xl">Multi Search Queries</h2>
          </div>
        </div>
      </div>
    ),
    [show, toggle]
  );
};
