import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BankDashboardResponse, CustomerDistribution, DashboardStats, DocumentStatusDistribution, RecentTransaction, TransactionTrend } from '../models/dashboard.models';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private readonly baseUrl = `${environment.apiUrl}/v1/api/reports`;

    constructor(private http: HttpClient) { }

    getBankDashboard(): Observable<BankDashboardResponse> {
        return this.http.get<BankDashboardResponse>(`${this.baseUrl}/dashboard-for-bank`);
    }



    getDashboardStats(): Observable<DashboardStats> {
        // Simulated API response
        const stats: DashboardStats = {
            totalActiveDocuments: 245,
            totalCustomers: 1283,
            totalTransactions: 3567,
            totalPendingDocuments: 42
        };
        return of(stats);
    }

    getTransactionTrends(): Observable<TransactionTrend[]> {
        // Simulated API response for the last 6 months
        const trends: TransactionTrend[] = [
            { month: 'November', value: 2500000 },
            { month: 'December', value: 3200000 },
            { month: 'January', value: 2800000 },
            { month: 'February', value: 3800000 },
            { month: 'March', value: 4200000 },
            { month: 'April', value: 3900000 }
        ];
        return of(trends);
    }

      getExportationTrends(): Observable<TransactionTrend[]> {
        // Simulated API response for the last 6 months
        const trends: TransactionTrend[] = [
            { month: 'November', value: 500000 },
            { month: 'December', value: 5200000 },
            { month: 'January', value: 800000 },
            { month: 'February', value: 800000 },
            { month: 'March', value: 200000 },
            { month: 'April', value: 9500000 }
        ];
        return of(trends);
    }

    getDocumentStatusDistribution(): Observable<DocumentStatusDistribution[]> {
        // Simulated API response
        const distribution: DocumentStatusDistribution[] = [
            { status: 'Active', count: 245 },
            { status: 'Suspended', count: 32 },
            { status: 'Deleted', count: 18 }
        ];
        return of(distribution);
    }

    getCustomerDistribution(): Observable<CustomerDistribution[]> {
        // Simulated API response
        const distribution: CustomerDistribution[] = [
            { type: 'Corporate', count: 823 },
            { type: 'Individual', count: 460 }
        ];
        return of(distribution);
    }

    getRecentTransactions(): Observable<RecentTransaction[]> {
        // Simulated API response
        const transactions: RecentTransaction[] = [
            {
                id: 'TRX001',
                customerName: 'Tech Solutions Ltd',
                amount: 250000,
                type: 'Import',
                status: 'Completed',
                date: new Date('2025-04-28')
            },
            {
                id: 'TRX002',
                customerName: 'Global Exports Inc',
                amount: 180000,
                type: 'Export',
                status: 'Pending',
                date: new Date('2025-04-27')
            },
            {
                id: 'TRX003',
                customerName: 'Smart Electronics',
                amount: 320000,
                type: 'Import',
                status: 'Processing',
                date: new Date('2025-04-26')
            },
            {
                id: 'TRX004',
                customerName: 'Fresh Foods Ltd',
                amount: 150000,
                type: 'Export',
                status: 'Completed',
                date: new Date('2025-04-25')
            }
        ];
        return of(transactions);
    }
}
