import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { CustomerDistribution, DashboardStats, DocumentStatusDistribution, RecentTransaction, TransactionTrend } from '../models/dashboard.models';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
    
    stats!: DashboardStats;
    recentTransactions: RecentTransaction[] = [];

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
    };    public documentStatusChartData: ChartData<'pie'> = {
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

    constructor(private dashboardService: DashboardService) { }

    ngOnInit(): void {
        this.loadDashboardData();
    }

    private loadDashboardData(): void {
        // Load dashboard statistics
        this.dashboardService.getDashboardStats().subscribe(stats => {
            this.stats = stats;
        });

        // Load transaction trends for line chart
        this.dashboardService.getTransactionTrends().subscribe((trends: TransactionTrend[]) => {
            this.lineChartData.labels = trends.map(t => t.month);
            this.lineChartData.datasets[0].data = trends.map(t => t.value);
        });

         // Load transaction trends for line chart
        this.dashboardService.getExportationTrends().subscribe((trends: TransactionTrend[]) => {
            this.lineChartData.labels = trends.map(t => t.month);
            this.lineChartData.datasets[1].data = trends.map(t => t.value);
        });

        // Load document status distribution for pie chart
        this.dashboardService.getDocumentStatusDistribution().subscribe((distribution: DocumentStatusDistribution[]) => {
            this.documentStatusChartData.labels = distribution.map(d => d.status);
            this.documentStatusChartData.datasets[0].data = distribution.map(d => d.count);
        });

        // Load customer distribution for pie chart
        this.dashboardService.getCustomerDistribution().subscribe((distribution: CustomerDistribution[]) => {
            this.customerDistributionChartData.labels = distribution.map(d => d.type);
            this.customerDistributionChartData.datasets[0].data = distribution.map(d => d.count);
        });

        // Load recent transactions
        this.dashboardService.getRecentTransactions().subscribe(transactions => {
            this.recentTransactions = transactions;
        });
    }
}
