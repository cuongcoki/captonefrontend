export type SuccessResponse<T> = {
  staus: number;
  message: string;
  isSuccess: boolean;
  data: T;
};
