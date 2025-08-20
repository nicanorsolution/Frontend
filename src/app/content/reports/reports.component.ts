import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ReportService } from './services/reports.service';
import { CreateReportCommand, ReportFormat, ReportResponse, ReportStatus, ReportType } from './models/reports.models';
import { interval, Subscription } from 'rxjs';
import { UserType } from '../users/user.models';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit, OnDestroy {
  UserType = UserType;
  reports: ReportResponse[] = [];
  createReportForm!: FormGroup;
  reportDialog = false;
  isSubmitted = false;
  private refreshSubscription?: Subscription;

  @ViewChild('dialog_operation_swal')
  public readonly dialog_operation_swal!: SwalComponent;

  reportFormats = Object.entries(ReportFormat)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({ name: key, value: value }));

  reportTypes = Object.entries(ReportType)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({ name: key, value: value }));

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.createReportForm = this.formBuilder.group({
      reportName: ['', Validators.required],
      reportFormat: [null, Validators.required],
      reportType: [null, Validators.required],
      fromDate: [null],
      toDate: [null]
    });

    this.loadReports();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  private hasRunningReports(): boolean {
    return this.reports.some(report => report.reportStatus === ReportStatus.Running);
  }

  private startAutoRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }

    this.refreshSubscription = interval(5000).subscribe(() => {
      if (this.hasRunningReports()) {
        this.loadReports();
      } else {
        if (this.refreshSubscription) {
          this.refreshSubscription.unsubscribe();
          this.refreshSubscription = undefined;
        }
      }
    });
  }

  loadReports() {
    this.reportService.getReports().subscribe(
      (data) => {
        this.reports = data;
        if (this.hasRunningReports() && !this.refreshSubscription) {
          this.startAutoRefresh();
        }
      },
      (error) => {
        this.display_success_or_failed_operation("Failed to load reports", false);
      }
    );
  }

  openNewReportDialog() {
    this.reportDialog = true;
  }

  createReport() {
    if (this.createReportForm.invalid) return;

    this.isSubmitted = true;
    const request: CreateReportCommand = this.createReportForm.value;

    this.reportService.createReport(request).subscribe(
      (data) => {
        this.display_success_or_failed_operation("Report request submitted successfully", true);
        this.loadReports();
        this.isSubmitted = false;
        this.createReportForm.reset();
        this.reportDialog = false;
        this.startAutoRefresh();
      },
      (error) => {
        this.display_success_or_failed_operation("Failed to submit report request: " + error?.error?.detail, false);
        this.isSubmitted = false;
      }
    );
  }

  downloadReport(report: ReportResponse) {
    this.reportService.downloadReport(report.id).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.reportName}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        this.display_success_or_failed_operation("Failed to download report", false);
      }
    );
  }

  ReportStatus = ReportStatus;
  ReportFormat = ReportFormat;
  ReportType = ReportType;

  display_success_or_failed_operation(message: string, status: boolean) {
    this.dialog_operation_swal.icon = status ? "success" : "error";
    this.dialog_operation_swal.title = status ? "Success" : "Error";
    this.dialog_operation_swal.text = message;
    this.dialog_operation_swal.fire();
  }
}
