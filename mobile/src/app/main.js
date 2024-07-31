import React from 'react';
import ReactDOM from 'react-dom/client';
import Notification from '@/app/components/Notification';

// 'app-root' というIDを持つ要素を取得
const container = document.getElementById('app-root');

if (container) {
    // React 18 の createRoot メソッドを使用してルートを作成
    const root = ReactDOM.createRoot(container);
    
    // Notification コンポーネントをレンダリング
    root.render(
        <React.StrictMode>
            <Notification />
        </React.StrictMode>
    );
} else {
    console.error('Element with ID "app-root" not found.');
}