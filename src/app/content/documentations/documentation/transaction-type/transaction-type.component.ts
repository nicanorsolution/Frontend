import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentationService } from '../../services/documentation.service';
import { AppurementRequired, TransactionDirection, TransactionTypeResponse, TransactionTypeStatus } from '../../models/transaction-type.models';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DocumentResponse, DocumentStatus, DocumentSubmissionOption } from '../../models/document.models';
import { UserRoleEnum, UserType } from 'src/app/helpers/UserRoleEnum';

@Component({
  selector: 'app-transaction-type',
  templateUrl: './transaction-type.component.html'
})
export class TransactionTypeComponent implements OnInit {
  UserRoleEnum = UserRoleEnum;
  UserType = UserType;
  readonly TransactionTypeStatus = TransactionTypeStatus;
  transactionTypes: TransactionTypeResponse[] = [];
  transactionTypeDialog = false;
  createTransactionTypeForm: FormGroup;
  isSubmitted = false;
  totalRows = 0;
  documentsDialog = false;
  allDocuments: DocumentResponse[] = [];
  selectedDocuments: DocumentResponse[] = [];
  sourceDocuments: DocumentResponse[] = [];
  targetDocuments: DocumentResponse[] = [];
  selectedTransactionType?: TransactionTypeResponse;
  viewDocumentsDialog = false;
  transactionDocuments: DocumentResponse[] = [];
  expandedRows: { [key: string]: boolean } = {};
  transactionDirections = Object.values(TransactionDirection)
                               .filter(value => typeof value === 'number')
                               .map(value => ({ label: TransactionDirection[value as number], value: value }));

  appurementRequiredOptions = Object.values(AppurementRequired)
                                    .filter(value => typeof value === 'number')
                                    .map(value => ({ label: AppurementRequired[value as number], value: value }));

  @ViewChild('dialog_operation_swal')
  private dialogOperationSwal!: SwalComponent;

  constructor(
    private documentationService: DocumentationService,
    private fb: FormBuilder
  ) {
    this.createTransactionTypeForm = this.fb.group({
      transactionTypeNameFr: ['', Validators.required],
      transactionTypeNameEn: ['', Validators.required],
      transactionDirection: ['', Validators.required],
      appurementRequired: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadTransactionTypes();
    this.loadAllDocuments();
    this.expandedRows = {};
  }

  loadTransactionTypes() {
    this.documentationService.getTransactionTypes().subscribe(data => {
      this.transactionTypes = data;
      this.totalRows = data.length;
    });
  }

  loadAllDocuments() {
    this.documentationService.getDocuments().subscribe(documents => {
      this.allDocuments = documents;
    });
  }

  openAddTransactionTypeDialog() {
    this.transactionTypeDialog = true;
    this.createTransactionTypeForm.reset();
  }

  openDocumentsDialog(transactionType: TransactionTypeResponse) {

    this.loadAllDocuments();

    this.selectedTransactionType = transactionType;

    this.sourceDocuments = this.allDocuments.filter(doc =>
      !transactionType.documentsRequestedList.includes(doc?.documentId)
      && doc.documentStatus === DocumentStatus.Active
    );

    this.targetDocuments = this.allDocuments.filter(doc =>
      transactionType.documentsRequestedList.includes(doc?.documentId)
    );

    this.documentsDialog = true;
  }

  openViewTransactionDocumentsListDialog(transactionType: TransactionTypeResponse) {

    this.loadAllDocuments();

    this.selectedTransactionType = transactionType;

    console.log('transactionType:', transactionType);
    console.log('allDocuments:', this.allDocuments);

    this.transactionDocuments = this.allDocuments.filter(doc =>
      transactionType.documentsRequestedList.includes(doc.documentId)
    );

    console.log('transactionDocuments:', this.transactionDocuments);
    this.viewDocumentsDialog = true;
  }

  onDocumentsSubmit() {
    if (this.selectedTransactionType) {
      const documentIds = this.targetDocuments.map(doc => doc.documentId);
      this.documentationService.setTransactionTypeDocuments(this.selectedTransactionType.transactionTypeId, documentIds)
        .subscribe({
          next: () => {
            this.documentsDialog = false;
            this.loadTransactionTypes(); // Refresh the list
          },
          error: (err) => {
               this.dialogOperationSwal.update({
              icon: 'error',
              title: 'Error',
              text: err?.error?.detail
            });
            this.dialogOperationSwal.fire();

            console.error('Error updating documents:', err);
            // Handle error (maybe show an error message)
          }
        });
    }
  }

  createTransactionType() {
    if (this.createTransactionTypeForm.valid) {
      this.isSubmitted = true;
      const command = this.createTransactionTypeForm.value;
      this.documentationService.createTransactionType(command)
        .subscribe({
          next: () => {
            this.isSubmitted = false;
            this.transactionTypeDialog = false;
            this.createTransactionTypeForm.reset();
            this.loadTransactionTypes(); // Refresh the list
          },
          error: (err) => {
            this.isSubmitted = false;
            console.error('Error creating transaction type:', err);
            // Handle error (maybe show an error message)
          }
        });
    }
  }

  colorStatus(status: TransactionTypeStatus): string {
    switch (status) {
      case TransactionTypeStatus.Active:
        return 'success';
      case TransactionTypeStatus.Suspended:
        return 'warning';
      case TransactionTypeStatus.Delete:
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusString(status: TransactionTypeStatus): string {
    return TransactionTypeStatus[status];
  }
  getSubmissionOptionString(status: DocumentSubmissionOption): string {
   switch (status) {
      case DocumentSubmissionOption.SubmissionBeforeProcessing:
        return 'Submission Before Processing';
      case DocumentSubmissionOption.SubmissionAfterProcessing:
        return 'Submission After Processing';
      case DocumentSubmissionOption.DoNotMatters:
        return 'Do Not Matter';
      default:
        return 'Unknown';
    }
  }

  colorSubmissionOption(status: DocumentSubmissionOption): string {
    switch (status) {
      case DocumentSubmissionOption.SubmissionBeforeProcessing:
        return 'danger';
      case DocumentSubmissionOption.SubmissionAfterProcessing:
        return 'warning';
      default:
        return 'info';
    }
  }

  colorAppurement(status : AppurementRequired)
  {
    switch(status) {
      case AppurementRequired.Yes:
        return 'success';
      case AppurementRequired.No:
        return 'danger';
      default:
        return 'info';
    }
  }
  colorDirection(status : TransactionDirection )
  {

    switch(status) {
      case TransactionDirection.Exportation:
        return 'info';
      case TransactionDirection.Importation:
        return 'success';
      default:
        return 'info';
    }
  }

   colorDocumentStatus(status: DocumentStatus): string {
    switch (status) {
      case DocumentStatus.Active:
        return 'success';
      case DocumentStatus.Suspended:
        return 'warning';
      case DocumentStatus.Delete:
        return 'danger';
      default:
        return 'info';
    }
  }

  getDocumentStatusString(direction: DocumentStatus): string {
    return DocumentStatus[direction];
  }

  getTransactionDirectionString(direction: TransactionDirection): string {
    return TransactionDirection[direction];
  }

  getAppurementRequiredString(appurement: AppurementRequired): string {
    return AppurementRequired[appurement];
  }

  deleteTransactionType(transactionTypeId: string) {
    this.dialogOperationSwal.fire().then((result) => {
      if (result.isConfirmed) {
        this.documentationService.deleteTransactionType(transactionTypeId).subscribe({
          next: () => {
            this.loadTransactionTypes(); // Refresh the list
          },
          error: (err) => {
            this.dialogOperationSwal.update({
              icon: 'error',
              title: 'Error',
              text: err?.error?.detail
            });
            this.dialogOperationSwal.fire();
            console.error('Error deleting transaction type:', err);
          }
        });
      }
    });
  }
}
