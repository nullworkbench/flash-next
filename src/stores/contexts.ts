import useStaticSWR from "@/plugins/useStaticSWR";
import { SWRResponse } from "swr";

// staticSWRを使用してユーザー情報を状態管理
export const useUserInfo = (
  initialData?: User
): SWRResponse<User | null, Error> => {
  return useStaticSWR<User | null, Error>("userInfo", initialData);
};
