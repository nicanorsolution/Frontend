import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ExportationService } from '../services/exportation.service';
import { ExportationResponse, ExportationStatus, ExportationApurementStatus, DEFeeStatus } from '../models/exportation.models';

@Component({
  selector: 'app-view-exportations',
  templateUrl: './view-exportations.component.html',
  styles: [`
    .status-pending { color: #999; }
    .status-success { color: #22C55E; }
    .status-danger { color: #DC2626; }
    .status-warn { color: #F59E0B; }
  `]
})
export class ViewExportationsComponent implements OnInit {
  exportations: ExportationResponse[] = [];
  loading = false;
  searchForm!: FormGroup;

  totalRows = 0;
  pageSize = 50;
  pageNumber = 1;
  expandedRows: { [key: string]: boolean } = {};

  approvalHistoryDialog = false;
  selectedExportation?: ExportationResponse;

  constructor(
    private exportationService: ExportationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.searchForm = this.fb.group({
      exportationReference: [''],
      customerName: [''],
      startDate: [null],
      endDate: [null]
    });
  }

  ngOnInit() {
    this.loadExportations();
  }

  loadExportations() {
    this.loading = true;
    const query = {
      ...this.searchForm.value,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.exportationService.getExportations(query).subscribe({
      next: (response) => {
        this.exportations = response.items;
        this.totalRows = response.totalCount;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading exportations:', error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.pageNumber = 1;
    this.loadExportations();
  }

  getStatusString(status: ExportationStatus): string {
    return ExportationStatus[status];
  }

  getApurementStatusString(status: ExportationApurementStatus): string {
    return ExportationApurementStatus[status];
  }

  getDEFeeStatusString(status: DEFeeStatus): string {
    return DEFeeStatus[status];
  }

  colorStatus(status: ExportationStatus): string {
    switch (status) {
      case ExportationStatus.ExportationDrafted:
        return 'info';
      case ExportationStatus.ExportationInitiated:
        return 'warning';
      case ExportationStatus.ExportationCompleted:
        return 'success';
      case ExportationStatus.ExportationCancelled:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  colorApurementStatus(status: ExportationApurementStatus): string {
    switch (status) {
      case ExportationApurementStatus.WaitingApurement:
        return 'warning';
      case ExportationApurementStatus.NotApured:
        return 'danger';
      case ExportationApurementStatus.Apured:
        return 'success';
      case ExportationApurementStatus.ApuredPartially:
        return 'warning';
      default:
        return 'info';
    }
  }

  colorDEFeeStatus(status: DEFeeStatus): string {
    switch (status) {
      case DEFeeStatus.PaymentProcessed:
        return 'success';
      case DEFeeStatus.PaymentBeingProcessed:
        return 'warning';
      case DEFeeStatus.PaymentFailed:
        return 'danger';
      case DEFeeStatus.PaymentNotProcessed:
        return 'info';
      default:
        return 'secondary';
    }
  }

  ViewApprovalHistoryDialog(exportation: ExportationResponse) {
    this.selectedExportation = exportation;
    this.approvalHistoryDialog = true;
  }

  redirectToExportationDocumentationPage(exportation: ExportationResponse) {
    this.router.navigate(['/admin/exportations/documentation-exportation'], {
      queryParams: {
        exportationId: exportation.id,
        exportationReference: exportation.exportationReference
      }
    });
  }

  getStatusSteps(): { label: string, status: string }[] {
    if (!this.selectedExportation) return [];

    const steps = [
      { label: 'Drafted', status: 'pending' },
      { label: 'Initiated', status: 'pending' },
      { label: 'Completed', status: 'pending' }
    ];

    // Update steps based on exportation status
    const currentStatus = this.selectedExportation.exportationStatus;
    for (let i = 0; i <= currentStatus; i++) {
      if (i === ExportationStatus.ExportationCancelled) {
        steps[i].status = 'danger';
        break;
      } else {
        steps[i].status = 'success';
      }
    }

    return steps;
  }
}
