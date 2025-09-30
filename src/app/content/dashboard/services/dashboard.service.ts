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
}
