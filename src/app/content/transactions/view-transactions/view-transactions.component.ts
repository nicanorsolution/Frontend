import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TransactionService } from '../services/transctions.service';
import { TransactionResponse, TransactionStatus, ProcessingType, InitiationMethod, TransactionApurementStatus } from '../models/transactions.model';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-transactions',
  templateUrl: './view-transactions.component.html',
  styles: [`
    .status-pending { color: #999; }
    .status-success { color: #22C55E; }
    .status-danger { color: #DC2626; }
    .status-warn { color: #F59E0B; }
  `]
})
export class ViewTransactionsComponent implements OnInit {
  transactions: TransactionResponse[] = [];
  loading = false;
  searchForm!: FormGroup;

  totalRows = 0;
  pageSize = 10;
  pageNumber = 1;
  expandedRows: { [key: string]: boolean } = {};
  approvalHistoryDialog = false;
  selectedTransaction?: TransactionResponse;

  @ViewChild('dialog_operation_swal')
  private dialogOperationSwal!: SwalComponent;

  constructor(
    private transactionService: TransactionService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.searchForm = this.fb.group({
      transactionReference: [''],
      customerAccountName: [''],
      customerAccountNumber: [''],
      startDate: [null],
      endDate: [null]
    });
  }

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.loading = true;
    const query = {
      ...this.searchForm.value,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.transactionService.getTransactions(query).subscribe({
      next: (response) => {
        this.transactions = response.items;
        this.totalRows = response.totalCount;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.pageNumber = 1;
    this.loadTransactions();
  }

  onPageChange(page: number) {
    this.pageNumber = page;
    this.loadTransactions();
  }

  getStatusString(status: TransactionStatus): string {
    return TransactionStatus[status];
  }

  getProcessingTypeString(type: ProcessingType): string {
    return ProcessingType[type];
  }

  getInitiationMethodString(method: InitiationMethod): string {
    return InitiationMethod[method];
  }

  getApurementStatusString(status: TransactionApurementStatus): string {
    return TransactionApurementStatus[status];
  }

  colorStatus(status: TransactionStatus): string {
    switch (status) {
      case TransactionStatus.Drafted:
        return 'info';
      case TransactionStatus.Initiated:
        return 'info';
      case TransactionStatus.Verified:
        return 'warning';
      case TransactionStatus.TradeAuthorized:
      case TransactionStatus.TreasuryAuthorized:
      case TransactionStatus.TreasuryOperationAuthorized:
      case TransactionStatus.TradeOperationAuthorized:
        return 'success';
      case TransactionStatus.Cancelled:
        return 'danger';
      case TransactionStatus.SentForCorrection:
        return 'warning';
      default:
        return 'secondary';
    }
  }

  colorApurementStatus(status: TransactionApurementStatus): string {
    switch (status) {
      case TransactionApurementStatus.WaitingApurement:
        return 'warning';
      case TransactionApurementStatus.NotApured:
        return 'danger';
      case TransactionApurementStatus.Apured:
        return 'success';
      case TransactionApurementStatus.ApuredPartially:
        return 'success';
      default:
        return 'info';
    }
  }

  colorProcessingType(type: ProcessingType): string {
    switch (type) {
      case ProcessingType.Prefinancing:
        return 'warning';
      case ProcessingType.WeeklyFinancing:
        return 'info';
      case ProcessingType.OwnReservesFinancing:
        return 'success';
      case ProcessingType.Undefined:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  redirectToDocumentationPage(transaction: TransactionResponse) {
    this.router.navigate(['/admin/transaction/documentation-transaction'], {
      queryParams: {
        transactionId: transaction.id,
        transactionReference: transaction.transactionReference
      }
    });
  }

  ViewApprovalHistoryDialog(transaction: TransactionResponse) {
    this.selectedTransaction = transaction;
    this.approvalHistoryDialog = true;
  }

  getStatusSteps(): { label: string, status: string }[] {
    if (!this.selectedTransaction) return [];

    const steps = [
      { label: 'Drafted', status: 'pending' },
      { label: 'Initiated', status: 'pending' },
      { label: 'Verified', status: 'pending' },
      { label: 'Trade Authorized', status: 'pending' },
      { label: 'Treasury Authorized', status: 'pending' },
      { label: 'Treasury Operation', status: 'pending' },
      { label: 'Trade Operation', status: 'pending' }
    ];

    // Update steps based on transaction status
    const currentStatus = this.selectedTransaction.status;
    for (let i = 0; i <= currentStatus; i++) {
      if (i === TransactionStatus.Cancelled) {
        steps[i].status = 'danger';
        break;
      } else if (i === TransactionStatus.SentForCorrection) {
        steps[i].status = 'warn';
        break;
      } else {
        steps[i].status = 'success';
      }
    }

    return steps;
  }
}
