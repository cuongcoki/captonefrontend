export type SuccessResponse<T> = {
  staus: number;
  message: string;
  isSuccess: boolean;
  data: T;
};

type Search<T> = {
  currentPage: number;
  totalPages: number;
  data: T;
};

export type SearchResponse<T> = SuccessResponse<Search<T>>;
