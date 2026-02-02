export interface IApiResponseWrapperType<ResultDataType = null> {
  message: string;
  data: ResultDataType;
  statusCode: number;
  date: Date;
}

export interface IApiPaginationResponseWrapperType<ResultDataType = unknown> {
  message: string;
  data: {
    items: ResultDataType[];
    totalCount: number;
    totalPage: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  statusCode: number;
  date: Date;
}

export interface IApiPaginationParams {
  page?: number;
  limit?: number;
}

export interface INextApiResponseWrapperType<ResultDataType = null> {
  success: boolean;
  message: string;
  data: ResultDataType;
}
