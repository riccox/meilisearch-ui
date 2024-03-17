import React from 'react';
import './index.css';

import { useRegisterSW } from 'virtual:pwa-register/react';

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div className="ReloadPrompt-container">
      {(offlineReady || needRefresh) && (
        <div className="ReloadPrompt-toast">
          <div className="ReloadPrompt-message">
            {offlineReady ? <span>应用已经可以离线工作了</span> : <span>新应用已经准备好了，点击按钮更新</span>}
          </div>
          {needRefresh && (
            <button className="ReloadPrompt-toast-button" onClick={() => updateServiceWorker(true)}>
              更新
            </button>
          )}
          <button className="ReloadPrompt-toast-button" onClick={() => close()}>
            关闭
          </button>
        </div>
      )}
    </div>
  );
}

export default ReloadPrompt;
