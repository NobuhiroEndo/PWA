import React from 'react';
import ReactDOM from 'react-dom/client';
import Notification from '@/app/components/Notification';
import NotFCMNotification from './components/NotFCMNotification';
import { checkNotification } from './utils/checkNotification';

// 'app-root' というIDを持つ要素を取得
const container = document.getElementById('app-root');

if (window.navigator.serviceWorker !== undefined) {
    window.navigator.serviceWorker.register('/serviceworker.js');
  }

if (container) {
    // React 18 の createRoot メソッドを使用してルートを作成
    const root = ReactDOM.createRoot(container);
    
    // Notification コンポーネントをレンダリング
    root.render(
        <React.StrictMode>
            {/* <Notification /> */}
            <NotFCMNotification />
        </React.StrictMode>
    );
} else {
    console.error('Element with ID "app-root" not found.');
}