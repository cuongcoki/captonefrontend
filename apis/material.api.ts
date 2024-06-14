// ** Axios client import
import { searchMaterial } from "@/types/material.type";
import axiosClient from "../auth/jwtService";

// ** Constants import
import { endPointConstant } from "@/constants/endpoint";
import { SearchResponse, SuccessResponse } from "@/types/util.type";
import { materialType } from "@/schema/material";

export const materialApi = {
  allProducts: (
    IsInProcessing?: any,
    PageIndex?: any,
    PageSize?: any,
    searchTerm?: string
  ) =>
    axiosClient.get(
      `${endPointConstant.BASE_URL}/products?IsInProcessing=${IsInProcessing}&PageIndex=${PageIndex}&PageSize=${PageSize}&searchTerm=${searchTerm}`
    ),

  searchMaterial: (requestBody: searchMaterial) =>
    axiosClient.get<SearchResponse<materialType[]>>(
      `${endPointConstant.BASE_URL}/material`,
      {
        params: requestBody,
      }
    ),
};
