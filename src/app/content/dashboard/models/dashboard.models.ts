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
