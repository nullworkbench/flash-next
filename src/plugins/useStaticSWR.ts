import useSWR, { Key, mutate, SWRResponse } from "swr";

// SWRを状態管理として使う
// @/stores/contexts.tsで様々なデータを扱うので、引数をData型とする
const useStaticSWR = <Data, Error>(
  key: Key,
  updateData?: Data,
  initialData?: Data
): SWRResponse<Data, Error> => {
  if (initialData) {
    // 初期データが入力されていればmutateで値のセット。初期データなのでrevalidateはfalse
    mutate(key, initialData, false);
  }
  if (updateData) {
    // データの更新
    mutate(key, updateData);
  }
  // データの更新があれば更新後の結果、なければ現在の値を返す
  return useSWR(key, null);
};

export default useStaticSWR;
