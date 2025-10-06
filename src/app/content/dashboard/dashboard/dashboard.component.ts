import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { BankDashboardResponse, DashboardStats, ExchangeRateReport, RecentImportExportReport, RecentTransaction } from '../models/dashboard.models';
import { DashboardResolverData } from '../resolvers/dashboard.resolver';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    // Resolved data properties
    recentImportExports: RecentImportExportReport[] = [];
    bankDashboard: BankDashboardResponse | null = null;
    topCurrenciesExchangeRates: ExchangeRateReport[] = [];

    public lineChartData: ChartConfiguration<'line'>['data'] = {
        labels: [],
        datasets: [
            {
                data: [],
                label: 'Importation Volume',
                fill: true,
                tension: 0.5,
                borderColor: 'rgba(148,159,177,1)',
                backgroundColor: 'rgba(148,159,177,0.2)'
            },
             {
                data: [],
                label: 'Exportation Volume',
                fill: true,
                tension: 0.5,
                borderColor: 'rgb(42, 78, 76)',
                backgroundColor: 'rgba(170, 100, 79, 0.74)'
            }
        ]
    };

    public lineChartOptions: ChartConfiguration<'line'>['options'] = {
        responsive: true,
        plugins: {
            legend: { display: true }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };
     public documentStatusChartData: ChartData<'pie'> = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: ['#4BC0C0', '#FF6384', '#FFCE56']
        }]
    };



    public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'right'
            }
        }
    };

    public customerDistributionChartData: ChartData<'pie'> = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: ['#36A2EB', '#FF6384']
        }]
    };

   importationStatusChartData: ChartData<'pie'> = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: ['#238328ff', '#FF6384', '#FFCE56','#9b2a36ff','#5f5dd4ff','#941c7aff']
        }]
    };

    exportationStatusChartData: ChartData<'pie'> = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: ['#238328ff', '#FF6384', '#FFCE56']
        }]
    };

    importExportLineChartData: ChartConfiguration<'line'>['data'] = {
        labels: [],
        datasets: [
            {
                data: [],
                label: 'Importation Volume',
                fill: true,
                tension: 0.5,
                borderColor: 'rgba(148,159,177,1)',
                backgroundColor: 'rgba(148,159,177,0.2)'
            },
             {
                data: [],
                label: 'Exportation Volume',
                fill: true,
                tension: 0.5,
                borderColor: 'rgb(42, 78, 76)',
                backgroundColor: 'rgba(170, 100, 79, 0.74)'
            }
        ]
    };

    constructor(
        private readonly route: ActivatedRoute,
        private readonly dashboardService: DashboardService
    ) {}

    ngOnInit(): void {
        // Get resolved data from route
        const resolvedData: DashboardResolverData = this.route.snapshot.data['dashboardData'];

        console.log('Dashboard component received resolved data:', resolvedData);

        // Set resolved data to component properties
        this.bankDashboard = resolvedData.bankDashboard;

        // Process bank dashboard data if available
        if (this.bankDashboard) {
            this.processBankDashboardData(this.bankDashboard);
        }
    }

    private processBankDashboardData(response: BankDashboardResponse): void {
        // Importation Status
        this.importationStatusChartData.labels = response.importStatusReports.map(d => d.status);
        this.importationStatusChartData.datasets[0].data = response.importStatusReports.map(d => d.count);

        console.log('Processed importation status chart data:', this.importationStatusChartData);

        // Exportation Status
        this.exportationStatusChartData.labels = response.exportStatusReports.map(d => d.status);
        this.exportationStatusChartData.datasets[0].data = response.exportStatusReports.map(d => d.count);

        console.log('Processed exportation status chart data:', this.exportationStatusChartData);

        // Import/Export Line Chart
        console.log('ImportNumberByMonthReports:', response.importNumberByMonthReports);
        console.log('ExportNumberByMonthReports:', response.exportNumberByMonthReports);
       // if (response.importNumberByMonthReports?.length > 0 && response.exportNumberByMonthReports?.length > 0) {
        if (response.importNumberByMonthReports?.length > 0) {
            this.importExportLineChartData.labels = response.importNumberByMonthReports.map(d => d.month);
            this.importExportLineChartData.datasets[0].data = response.importNumberByMonthReports.map(d => d.value);
            this.importExportLineChartData.datasets[1].data = response.exportNumberByMonthReports.map(d => d.value);

            console.log('Processed import/export line chart data:', this.importExportLineChartData);
        }

        // Recent ImportExport
        this.recentImportExports = response.recentImportExportReports;

        // Top currencies
        this.topCurrenciesExchangeRates = response.exchangeRateReports;
        console.log('Processed currencies:', this.topCurrenciesExchangeRates);
    }

    getTransactionStatusSeverity(status: string): string {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'processing':
                return 'warning';
            case 'pending':
                return 'info';
            case 'failed':
            case 'rejected':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    getVariationClass(variation: number): string {
        return variation >= 0 ? 'up' : 'down';
    }

    getVariationIcon(variation: number): string {
        return variation >= 0 ? 'fa-caret-up' : 'fa-caret-down';
    }

    getFormattedVariation(variation: number): string {
        return Math.abs(variation).toFixed(2);
    }

    getLastUpdateDate(): string {
        if (this.topCurrenciesExchangeRates.length > 0) {
            const latestDate = this.topCurrenciesExchangeRates[0].date;
            return new Date(latestDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
        return new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}
