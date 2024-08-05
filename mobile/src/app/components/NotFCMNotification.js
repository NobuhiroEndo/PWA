// components/NotFCMNotification.js
import React from 'react';
import { subscribe } from "../utils/subscribe";
import useAuth from '../hooks/useAuth'; 

const NotFCMNotification = () => {
    const { authToken } = useAuth();

    console.log('おーすとーくん：',authToken)

    const handleRequestToken = async () => {
      try {
        if (authToken) {
            await subscribe(authToken);
            alert('プッシュ通知が正常に購読されました');
        } else {
            console.error('認証トークンが見つかりません');
        }
      } catch (error) {
        console.error('プッシュ通知の購読に失敗しました①', error);
      }
    };

    return (
      <div>
        <button onClick={handleRequestToken}>プッシュ通知を受け取る</button>
      </div>
    );
};

export default NotFCMNotification;