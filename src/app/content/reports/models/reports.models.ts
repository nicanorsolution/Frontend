
export interface CreateReportCommand {
  reportName: string;
  reportFormat: ReportFormat;
  reportType: ReportType;
  currency: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface ReportResponse {
  id: string;
  reportName: string;
  reportFrom?: Date;
  reportTo?: Date;
  reportFormat: ReportFormat;
  reportPath: string;
  reportStatus: ReportStatus;
  reportType: ReportType;
  reportMessage?: string;
  reportDateRequested?: Date;
  reportDateGenerated?: Date;
}


export enum ReportStatus {
  Running,
  Success,
  Failed
}

export enum ReportFormat {
  Excel
}

export enum ReportType {
  TransactionsReport,
  DISSummariesReport,
  DIImputaionReport,
  DFXReport,
  TurnAroundTimeReport
}
