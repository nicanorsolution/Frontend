import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DashboardService } from '../services/dashboard.service';
import { BankDashboardResponse, DashboardStats, TransactionTrend, DocumentStatusDistribution, CustomerDistribution, RecentTransaction } from '../models/dashboard.models';

export interface DashboardResolverData {
  bankDashboard: BankDashboardResponse | null;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardResolver implements Resolve<DashboardResolverData> {

  constructor(private dashboardService: DashboardService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<DashboardResolverData> {

    // Fetch all dashboard data in parallel
    return forkJoin({
      bankDashboard: this.dashboardService.getBankDashboard().pipe(
        catchError(error => {
          console.error('Error fetching bank dashboard:', error);
          return of(null);
        })
      )

    }).pipe(
      map((data: DashboardResolverData) => {
        console.log('Dashboard resolver completed successfully:', data);
        return data;
      }),
      catchError(error => {
        console.error('Dashboard resolver failed:', error);
        // Return empty/default data structure on complete failure
        return of({
          bankDashboard: null
        });
      })
    );
  }
}
