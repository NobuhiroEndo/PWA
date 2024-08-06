import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

// 'app-root' というIDを持つ要素を取得
const container = document.getElementById('app-root');

if (window.navigator.serviceWorker !== undefined) {
    window.navigator.serviceWorker.register('/firebase-messaging-sw.js');
}

if (container) {
    // React 18 の createRoot メソッドを使用してルートを作成
    const root = ReactDOM.createRoot(container);
    
    // App コンポーネントをレンダリング
    root.render(<App />);
} else {
    console.error('Element with ID "app-root" not found.');
}