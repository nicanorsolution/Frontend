import { Component, Input, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transctions.service';
import { TransactionFileResponse, TransactionFileStatus, DocumentSubmissionOption, TransactionFileHardCopyStatus } from '../../models/transactions.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html'
})
export class UploadDocumentsComponent implements OnInit {
  @Input() transactionId?: string;

  documents: TransactionFileResponse[] = [];
  loading = true;

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    if (!this.transactionId) return;

    this.loading = true;
    this.transactionService.getTransactionFiles(this.transactionId)
      .subscribe({
        next: (response) => {
          this.documents = response;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading documents:', error);
          this.loading = false;
        }
      });
  }

  getFileStatusLabel(status: TransactionFileStatus): string {
    return TransactionFileStatus[status];
  }

  getSubmissionTypeLabel(type: DocumentSubmissionOption): string {
    return DocumentSubmissionOption[type];
  }

  colorSubmissionType(type: DocumentSubmissionOption): string {
    switch (type) {
      case DocumentSubmissionOption.SubmissionBeforeProcessing:
        return 'danger';
      case DocumentSubmissionOption.SubmissionAfterProcessing:
        return 'warning';
      default:
        return 'info';
    }
  }
  getHardCopyStatusLabel(status: TransactionFileHardCopyStatus): string {
    return TransactionFileHardCopyStatus[status];
  }

  colorFileStatus(status: TransactionFileStatus): string {
    switch (status) {
      case TransactionFileStatus.DocumentUploadedNotYetReview:
        return 'warning';
      case TransactionFileStatus.DocumentReviewOk:
        return 'success';
      case TransactionFileStatus.DocumentAwaited:
      case TransactionFileStatus.DocumentNotProvided:
      case TransactionFileStatus.DocumentNewOrReplacementRequired:
      case TransactionFileStatus.DocumentReviewFailed:
        return 'danger';
      default:
        return 'info';
    }
  }

  uploadDocument(document: TransactionFileResponse) {
    // Create file input element
    const fileInput = window.document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept ='.pdf'; // '.pdf,.doc,.docx,.xls,.xlsx'; // Add accepted file types

    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file && this.transactionId) {
        // Show loading state
        this.loading = true;

        this.transactionService.uploadTransactionFile(this.transactionId, document.documentId, file)
          .subscribe({
            next: () => {
              this.loading = false;
              // Reload documents list
              this.loadDocuments();
              // Show success message
              Swal.fire({
                title: 'Success',
                text: 'Document uploaded successfully',
                icon: 'success'
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
              this.loading = false;
              Swal.fire({
                title: 'Error',
                text: error?.error?.detail || 'Failed to upload document',
                icon: 'error'
              });
            }
          });
      }
    };

    // Trigger file selection
    fileInput.click();
  }
}
