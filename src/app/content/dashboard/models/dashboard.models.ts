export interface DashboardStats {
    totalActiveDocuments: number;
    totalCustomers: number;
    totalTransactions: number;
    totalPendingDocuments: number;
}

export interface TransactionTrend {
    month: string;
    value: number;
}

export interface DocumentStatusDistribution {
    status: string;
    count: number;
}

export interface CustomerDistribution {
    type: string;
    count: number;
}

export interface RecentTransaction {
    id: string;
    customerName: string;
    amount: number;
    type: string;
    status: string;
    date: Date;
}


// Dashboard

export interface DIDEReport {
  totalDIDE: number;
  totalDIDEInLast48Hours: number;
}

export interface CustomerReport {
  totalCustomers: number;
  totalCustomersInLastWeek: number;
}

export interface ImportsExportsReport {
  totalImports: number;
  totalExports: number;
  totalImportsIn48Hours: number;
}

export interface UsersReport {
  totalUsers: number;
  totalUsersPendingApproval: number;
}

export interface RecentImportExportReport {
  transactionId: string;
  transactionType: string;
  amount: string;
  currency: string;
  date: Date;
  status: string;
}

export interface ExchangeRateReport {
  currency: string;
  rate: string;
  variation: number;
  date: Date;
}

export interface ImportStatusReport {
  status: string;
  count: number;
}

export interface ExportStatusReport {
  status: string;
  count: number;
}

export interface ImportNumberByMonthReport {
  month: string;
  value: number;
}

export interface ExportNumberByMonthReport {
  month: string;
  value: number;
}

export interface BankDashboardResponse {
  dideReport: DIDEReport;
  customerReport: CustomerReport;
  importsExportsReport: ImportsExportsReport;
  usersReport: UsersReport;
  recentImportExportReports: RecentImportExportReport[];
  exchangeRateReports: ExchangeRateReport[];
  importStatusReports: ImportStatusReport[];
  exportStatusReports: ExportStatusReport[];
  importNumberByMonthReports: ImportNumberByMonthReport[];
  exportNumberByMonthReports: ExportNumberByMonthReport[];
}