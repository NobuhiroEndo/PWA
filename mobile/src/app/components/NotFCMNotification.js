import React, { useState, useEffect } from "react";
import { subscribe } from "../utils/subscribe";

const NotFCMNotification = () => {
  
    const handleRequestToken = async () => {
      try {
        await subscribe();
        alert('プッシュ通知が正常に購読されました');
      } catch (error) {
        console.error('プッシュ通知の購読に失敗しました①', error);
        // alert('プッシュ通知の購読に失敗しました②');
      }
    };
  
    return (
      <div>
        <button onClick={handleRequestToken}>プッシュ通知を受け取る</button>
      </div>
    );
  };
  
  export default NotFCMNotification;