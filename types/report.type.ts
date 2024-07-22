import { SearchResponse } from "@/types/util.type";

export type ReportParams = {
  searchParams: {
    PageIndex: number;
    ReportType: string;
  };
};

export type ReportManagerParams = {
  searchParams: {
    PageIndex: number;
    ReportType: string;
    UserId: string;
    Status: string;
    StartDate: string;
    EndDate: string;
    CompanyId: string;
  };
};

export type GetReportsBody = {
  UserId: string;
  Status: string;
  ReportType: string;
  Description: string;
  StartDate: string;
  CompanyId: string;
  EndDate: string;
  PageIndex: number;
  PageSize: number;
};

export type ReportType = {
  id: string;
  avatar: string;
  userId: string;
  fullName: string;
  description: string;
  status: number;
  statusName: string;
  statusDesscription: string;
  reportType: number;
  reportTypeName: string;
  reportTypeDescription: string;
  replyMessage: string;
  companyId: string;
  createdDate: string;
};

export type GetReportsResponse = SearchResponse<ReportType[]>;

export type CreateReportBody = {
  description: string;
  reportType: number;
};

export type UpdateReportBody = {
  id: string;
  replyMessage: string;
  status: number;
};
