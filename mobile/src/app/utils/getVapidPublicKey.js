const getVapidPublicKey = async () => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  console.log(`Fetching VAPID public key from: ${baseURL}/get_vapid_public_key/`);
  
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