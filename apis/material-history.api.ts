import { SearchMaterialHistoryBody } from "@/types/material-history.type";
import axiosClient from "../auth/jwtService";

import { endPointConstant } from "@/constants/endpoint";
import { materialHistoryType } from "@/schema/material";
import { SearchResponse } from "@/types/util.type";

export const materiaHistoryApi = {
  searchMaterial: (requestBody: SearchMaterialHistoryBody) =>
    axiosClient.get<SearchResponse<materialHistoryType[]>>(
      `${endPointConstant.BASE_URL}/material-history`,
      {
        params: requestBody,
      }
    ),
};
