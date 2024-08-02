const clickVisitSiteButton = () => {
  // ボタンが存在するかどうかを確認
  const button = document.querySelector('button#visit-site');
  if (button) {
    button.click();
  } else {
    console.log('「Visit Site」ボタンが見つかりません');
  }
};

const getVapidPublicKey = async () => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  console.log(`Fetching VAPID public key from: ${baseURL}/get_vapid_public_key/`);
  // 初回のアクセスでボタンが表示されているか確認
  clickVisitSiteButton();

  // 1秒待ってからAPIリクエストを送信
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const res = await fetch(`${baseURL}/get_vapid_public_key/`);
    if (!res.ok) {
      console.error('HTTPエラー:', res.status, res.statusText);
      throw new Error(`VAPID公開鍵取得失敗: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    console.log('JSON鍵:', json);
    return json.public_key;
  } catch (error) {
    console.error('Fetchエラー:', error);
    throw new Error("VAPID公開鍵取得に失敗しました");
  }
};

export { getVapidPublicKey };