import { DocumentSubmissionOption, ProcessingOption, ProvisionBeforeInitiationResponse, ProvisionTransferStatus, RoleToSendBackTransactionResponse, TransactionAmountLienStatus, TransactionApprovalFlowCommand, TransactionDecisionAction, TransactionDIStatus, TransactionExceptionHistoryResponse, TransactionMessageResponse, TransactionMessageType, TransactionProvisionStatus, TransactionProvisionTransferResponse, NostroAccountResponse, SetCorrespondingBankInfoRequest } from './../models/transactions.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {
  TransactionResponse,
  TransactionStatus,
  ProcessingType,
  InitiationMethod,
  TransactionApurementStatus,
  TransactionFileResponse,
  TransactionFileStatus,
  TransactionFileHardCopyStatus,
  Severity,
  ExceptionDirectedTo,
  RaiseTransactionExceptionCommand,
  ExceptionResolverContactResponse,
  ExceptionStatus,
  TransactionExceptionResponse,
  ReferenceMT,
  DIByClientResponse,
  TransactionFileHistoryResponse
} from '../models/transactions.model';
import { TransactionService } from '../services/transctions.service';
import { TransactionDocumentationData } from '../resolvers/transaction-documentation.resolver';
import { DocumentControl, DocumentControlType, DocumentResponse } from '../../documentations/models/document.models';
import { error } from 'console';
import { DIStatus, DIImputationResponse, ImputationStatus, ImputeDICommand } from '../../di/models/di.models';
import { UserRoles, UserType } from '../../users/user.models';
import { AuthService } from '../../users/auth.service';
import { ConfirmationService } from 'primeng/api';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-documentation-transaction',
  templateUrl: './documentation-transaction.component.html',
  styleUrls: ['./documentation-transaction.component.scss'],
  providers: [ConfirmationService]
})
export class DocumentationTransactionComponent implements OnInit {
  transaction?: TransactionResponse | null;
  TransactionStatus = TransactionStatus;
  UserRoles = UserRoles;
  loading = true;
  uploadDocumentsDialog = false;
  documents: TransactionFileResponse[] = [];
  selectedDocument?: TransactionFileResponse;
  documentControls?: DocumentControl[] = [];
  selectedControlsPerformed?: DocumentControl | null;
  fileBLob?: Blob | null = null;
  selectedControls: DocumentControl[] = [];
  reviewDialog = false;
  reviewForm: FormGroup;
  documentsReviewDialog = false;
  raiseExceptionDialog = false;
  exceptionForm: FormGroup;
  severityOptions = [
    { label: 'Low', value: Severity.Low },
    { label: 'Medium', value: Severity.Medium },
    { label: 'High', value: Severity.High }
  ];
  directedToOptions = [
    { label: 'Client', value: ExceptionDirectedTo.Client },
    { label: 'Bank', value: ExceptionDirectedTo.Bank }
  ];

  contactOfExceptionResolver: ExceptionResolverContactResponse[] = [];
  expandedRows: { [key: string]: boolean } = {};
  transactionExceptions: TransactionExceptionResponse[] = [];
  viewExceptionsDialog = false;
  updateExceptionDialog = false;
  updateExceptionForm: FormGroup;
  selectedException?: TransactionExceptionResponse;
  selectedFile?: File;

  exceptionStatusOptions = [
    { label: 'Open', value: ExceptionStatus.Open },
    { label: 'Approved While Waiting Resolution', value: ExceptionStatus.ApprovedWhileWaitingExpcetionResolution },
    { label: 'Canceled', value: ExceptionStatus.Canceled },
    { label: 'Resolved', value: ExceptionStatus.Resolved }
  ];

  uploadSwiftDialog = false;
  uploadSwiftForm: FormGroup;
  selectedSwiftFile?: File;

  mtTypeOptions = [
    { label: 'MT228', value: ReferenceMT.MT228 },
    { label: 'MT103', value: ReferenceMT.MT103 },
    { label: 'MT900', value: ReferenceMT.MT900 }
  ];
  ReferenceMT = ReferenceMT;
  diImputationDialog = false;
  clientDIs: DIByClientResponse[] = [];
  //selectedDI?: DIByClientResponse;
  selectedDIs: DIByClientResponse[] = [];
  diImputationsDialog = false;
  diImputations: DIImputationResponse[] = [];

  transactionMessages: TransactionMessageResponse[] = [];
  exceptionHistoryDialog = false;
  transactionExceptionHistory: TransactionExceptionHistoryResponse[] = [];
  documentHistoryDialog = false;
  documentHistory: TransactionFileHistoryResponse[] = [];

  processingOptionsDialog = false;
  processingOptionsDrop = [
    { label: 'Sent To Bank', value: ProcessingOption.SentToBank },
    { label: 'Sent To Beac', value: ProcessingOption.SentToBeac }
  ];

  apurementTransactionOptionDialog = false;
  apurementTransactionOption = [
    { label: 'Not Apured', value: TransactionApurementStatus.NotApured },
    { label: 'Apured', value: TransactionApurementStatus.Apured },
    { label: 'Apured Partially', value: TransactionApurementStatus.ApuredPartially }
  ];

  // Corresponding Bank (Nostro) Info
  correspondingBankDialog = false;
  nostroAccounts: NostroAccountResponse[] = [];
  selectedNostroAccount?: NostroAccountResponse | null;

  sendForCorrectionForm: FormGroup;

  panelNumber: number = 1;

  UserType : UserType | undefined;
  UserTypeEnum  = UserType;

    @ViewChild('dialog_operation_swal')
    private dialogOperationSwal!: SwalComponent;
  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private authService: AuthService,
    public confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      transactionFileStatus: [null, Validators.required],
      reviewerNote: ['', Validators.required]
    });
    this.exceptionForm = this.fb.group({
      exceptionDirectedTo: ['', Validators.required],
      internalNote: ['', Validators.required],
      clientNote: ['', Validators.required],
      severity: ['', Validators.required],
      exceptionResolverEmail: [[], [Validators.required]],
      transactionFileCausingException: [[], Validators.required],
      isTransactionFileReviewNoteAdded: [true, Validators.required]
    });
    this.updateExceptionForm = this.fb.group({
      internalNote: ['', Validators.required],
      exceptionStatus: ['', Validators.required]
    });
    this.uploadSwiftForm = this.fb.group({
      referenceMT: ['', Validators.required],
      reference: ['', Validators.required]
    });
    this.sendForCorrectionForm = this.fb.group({
       role: [null, Validators.required],
       comment: ['', Validators.required]
    });

   this.UserType = this.authService.getDecodedToken().UserType;
  }

  ngOnInit() {
    this.route.data.subscribe({
      next: (data) => {
        const resolvedData = data['transaction'] as TransactionDocumentationData;

        this.transaction = resolvedData.transaction;
        this.documents = resolvedData.documents;
        this.loading = false;
        console.log("🚀 => file: documentation-transaction.component.ts:42 => DocumentationTransactionComponent => ngOnInit => resolvedData:", resolvedData);
        this.panelNumber = this.getPanelClass();
      }
    });
  }


  getPanelClass() {
    console.log('UserRoles', this.authService.getDecodedToken());

    const roles = this.authService.getDecodedToken().UserRoles;

    console.log('UserRoles', roles );

    if (roles == UserRoles.TradeAuthorizer || roles == UserRoles.TradeDeskAuthorizer ||
      this.authService.getDecodedToken().UserRoles == UserRoles.Verifier)
    {
      console.log('panelNumber', 3);
      return 3;
    }
     else {
      console.log('panelNumber', 2);
      return 2;
    }
  }

  openProvisionVerificationDialog = false;
  provisionVerificationResponse : ProvisionBeforeInitiationResponse | null = null;
  verifyProvisionForTransaction(transaction: TransactionResponse): void {

    this.transactionService.verifyProvisionForTransaction(transaction.id)
      .subscribe({
        next: (response: ProvisionBeforeInitiationResponse) => {

          console.log("🚀 => verifyProvisionForTransaction => response:", response);
         this.provisionVerificationResponse = response;
         this.openProvisionVerificationDialog = true;

        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to check provision',
            icon: 'error'
          });
        }
      });

  }
  openUploadDocuments() {
    this.uploadDocumentsDialog = true;
  }

  onDocumentChange(event: any) {
    this.selectedDocument = event.value as TransactionFileResponse;

    console.log("🚀 => file: documentation-transaction.component.ts:55 => DocumentationTransactionComponent => onDocumentChange => selectedDocument:", this.selectedDocument);


    this.transactionService.getTransactionFileBlob(this.transaction?.id, this.selectedDocument.id)
      .subscribe({
        next: (blob: Blob) => {
          this.fileBLob = blob;
          console.log("🚀 => file: documentation-transaction.component.ts:63 => DocumentationTransactionComponent => onDocumentChange => blob:", blob);
        },
        error: (error) => {
          console.error('Error loading document:', error);
          this.fileBLob = null;
        }
      });

    this.transactionService.getDocumentControls(this.selectedDocument.documentId, this.selectedDocument.id)
      .subscribe(
        (response) => {
          this.documentControls = response.documentControls;
          console.log("🚀 => file: documentation-transaction.component.ts:76 => DocumentationTransactionComponent => .subscribe => response:", response);
        },
        (error) => {
          console.error('Error loading document controls:', error);
        }
      );
  }

  viewControlDetails(control : DocumentControl)
  {
     this.dialogOperationSwal.update({
          title: 'Control details',
          text: control.documentControlDetail,
          icon: 'info'
        });
        this.dialogOperationSwal.fire();
  }
  onControlPerformed(event: any) {

    console.log("🚀 => file: documentation-transaction.component.ts:98 => DocumentationTransactionComponent => onControlPerformed => event:", event);

    const control = event as DocumentControl;

    console.log("🚀 => file: documentation-transaction.component.ts:102 => DocumentationTransactionComponent => onControlPerformed => control:", control);


    if (event) {
      this.selectedControls.push(control);
    } else {
      this.selectedControls = this.selectedControls.filter(c => c.documentControlId !== control.documentControlId);
    }
    this.selectedControlsPerformed = event as DocumentControl;
  }

  isCheckDocumentEnabled(): boolean {
    if (!this.documentControls) return false;

    // Get all mandatory controls
    const mandatoryControls = this.documentControls.filter(
      c => c.documentControlType === DocumentControlType.Mandatory
    );

    if (mandatoryControls.length === 0) return false;

    // Check if all mandatory controls are selected
    const ismandatoryControlsCheck = mandatoryControls.every(mc =>
      this.selectedControls.some(sc => sc.documentControlId === mc.documentControlId)
    );

    const isDocumentPathProvided = this.selectedDocument?.documentPath ? this.selectedDocument.documentPath !== '' : false;

    return ismandatoryControlsCheck && isDocumentPathProvided;
  }

  getFileStatusLabel(status: TransactionFileStatus): string {
    return TransactionFileStatus[status];
  }

  getStatusSeverity(status: TransactionFileStatus): string {
    switch (status) {
      case TransactionFileStatus.DocumentReviewOk:
        return 'success';
      case TransactionFileStatus.DocumentReviewFailed:
        return 'danger';
      case TransactionFileStatus.DocumentUploadedNotYetReview:
      case TransactionFileStatus.DocumentNewOrReplacementRequired:
        return 'warning';
      default:
        return 'info';
    }
  }

  getDocumentControlType(status: DocumentControlType): string {
    return DocumentControlType[status];
  }

  colorDocumentControlType(status: DocumentControlType): string {
    switch (status) {
      case DocumentControlType.Mandatory:
        return 'danger';
      case DocumentControlType.Optional:
        return 'info';
      case DocumentControlType.Depend:
        return 'warning';
      default:
        return 'info';
    }
  }

  getStatusString(status: TransactionStatus): string {
    return TransactionStatus[status];
  }

  getProcessingTypeString(type: ProcessingType | undefined): string {
    if (!type) {
      return '';
    }
    return ProcessingType[type];
  }

  getInitiationMethodString(method: InitiationMethod): string {
    return InitiationMethod[method];
  }

  getApurementStatusString(status: TransactionApurementStatus): string {
    return TransactionApurementStatus[status];
  }

  getTranDIStatusString(status: TransactionDIStatus): string {
    return TransactionDIStatus[status];
  }
  getTranDIStatusColor(status: TransactionDIStatus): string {
     switch (status) {

       case TransactionDIStatus.NotImputed:
        return 'danger';
       case TransactionDIStatus.Imputed:
        return 'success';
      default:
        return 'info';
    }
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

  colorProcessingType(type: ProcessingType | undefined): string {
    if (!type) {
      return 'secondary';
    }
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
      case TransactionApurementStatus.NotApplicable:
        return 'info';
      default:
        return 'info';// Not
    }
  }

  documentReviewStatus = [
    { label: 'Review OK', value: TransactionFileStatus.DocumentReviewOk, code: TransactionFileStatus.DocumentReviewOk },
    { label: 'Review Failed', value: TransactionFileStatus.DocumentReviewFailed, code: TransactionFileStatus.DocumentReviewFailed },
    { label: 'Need Replacement', value: TransactionFileStatus.DocumentNewOrReplacementRequired, code: TransactionFileStatus.DocumentNewOrReplacementRequired }
  ];

  openReviewDialog() {
    this.reviewDialog = true;
    this.reviewForm.patchValue({
      transactionFileStatus: null, // Set default value
      reviewerNote: ''
    });
  }

  submitReview() {
    if (this.reviewForm.valid && this.selectedDocument && this.transaction) {
      const command = {
        transactionId: this.transaction.id,
        transactionFileId: this.selectedDocument.id,
        transactionFileStatus: this.reviewForm.get('transactionFileStatus')?.value,
        reviewerNote: this.reviewForm.get('reviewerNote')?.value
      };

      this.transactionService.reviewTransactionFile(command).subscribe({
        next: () => {
          this.reviewDialog = false;
          // Refresh document list
          if (this.transaction) {
            this.transactionService.getTransactionFiles(this.transaction.id)
              .subscribe(docs => this.documents = docs);
          }
          // Show success detail
          Swal.fire({
            title: 'Success',
            text: 'Document review submitted successfully',
            icon: 'success'
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to submit review',
            icon: 'error'
          });
        }
      });
    }
  }

  openDocumentsReviewSummary() {
    if (!this.transaction?.id) return;

    this.loading = true;
    this.transactionService.getTransactionFiles(this.transaction.id)
      .subscribe({
        next: (docs) => {
          this.documents = docs;
          this.documentsReviewDialog = true;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading documents:', error);
          this.loading = false;
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to load documents',
            icon: 'error'
          });
        }
      });
  }

getDocumentSubmissionStatusLabel(status: DocumentSubmissionOption): string {
    return DocumentSubmissionOption[status];
  }


  colorDocumentSubmissionStatus(status: DocumentSubmissionOption): string {
    switch (status) {
      case DocumentSubmissionOption.SubmissionBeforeProcessing:
        return 'warning';
      case DocumentSubmissionOption.SubmissionAfterProcessing:
        return 'info';
      default:
        return 'secondary';
    }
  }

  openRaiseExceptionDialog() {
    this.raiseExceptionDialog = true;
    this.exceptionForm.reset();
  }

  getContactOfExceptionResolver() {
    const to = this.exceptionForm.get("exceptionDirectedTo")?.value as ExceptionDirectedTo;

    this.contactOfExceptionResolver = [];

    this.transactionService.getTransactionExceptionResolverMail(this.transaction?.id, to)
      .subscribe({
        next: (response) => { this.contactOfExceptionResolver = response },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to get resolver exception',
            icon: 'error'
          });
        }
      });
  }

  submitException() {
    if (this.exceptionForm.valid && this.transaction) {
      const command: RaiseTransactionExceptionCommand = {
        transactionId: this.transaction.id,
        ...this.exceptionForm.value
      };

      this.transactionService.raiseException(command).subscribe({
        next: () => {
          this.raiseExceptionDialog = false;
          Swal.fire({
            title: 'Success',
            text: 'Exception raised successfully',
            icon: 'success'
          }).then(() => {
            window.location.reload();
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to raise exception',
            icon: 'error'
          });
        }
      });
    }
  }

  openViewExceptionsDialog() {
    if (!this.transaction?.id) return;

    this.loading = true;
    this.transactionService.getTransactionExceptions(this.transaction.id)
      .subscribe({
        next: (exceptions) => {
          this.transactionExceptions = exceptions;
          this.viewExceptionsDialog = true;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading exceptions:', error);
          this.loading = false;
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to load exceptions',
            icon: 'error'
          });
        }
      });
  }

  getExceptionStatusLabel(status: ExceptionStatus): string {
    return ExceptionStatus[status];
  }

  getExceptionDirectedToLabel(directedTo: ExceptionDirectedTo): string {
    return ExceptionDirectedTo[directedTo];
  }

  getExceptionSeverityToLabel(severity: Severity): string {
    return Severity[severity];
  }
  colorExceptionSeverity(severity: Severity): string {
    switch (severity) {
      case Severity.Low:
        return 'warning';
      case Severity.Medium:
        return 'warning';
      case Severity.High:
        return 'danger';
      default:
        return 'secondary';
    }
  }
  colorExceptionStatus(status: ExceptionStatus): string {
    switch (status) {
      case ExceptionStatus.Open:
        return 'warning';
      case ExceptionStatus.Resolved:
        return 'success';
      case ExceptionStatus.ApprovedWhileWaitingExpcetionResolution:
        return 'info';
      case ExceptionStatus.Canceled:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getDocumentName(docId: string): string {

    return this.documents?.find(d => d.id === docId)?.documentName || docId;

  }

  openUpdateExceptionDialog(exception: TransactionExceptionResponse) {
    this.selectedException = exception;
    this.updateExceptionForm.patchValue({
      internalNote: exception.internalNote,
      exceptionStatus: exception.exceptionStatus
    });
    this.updateExceptionDialog = true;
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  submitUpdateException() {
    if (this.updateExceptionForm.valid && this.selectedException && this.transaction) {
      const command = {
        transactionId: this.transaction.id,
        transactionExceptionId: this.selectedException.id,
        ...this.updateExceptionForm.value
      };

      this.transactionService.updateException(command, this.selectedFile).subscribe({
        next: () => {
          this.updateExceptionDialog = false;
          this.selectedFile = undefined;
          // Refresh exceptions list
          this.transactionService.getTransactionExceptions(this.transaction!.id)
            .subscribe(exceptions => this.transactionExceptions = exceptions);

          Swal.fire({
            title: 'Success',
            text: 'Exception updated successfully',
            icon: 'success'
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to update exception',
            icon: 'error'
          });
        }
      });
    }
  }


  openExceptionsHistoryDialog(exception: TransactionExceptionResponse) {
    this.exceptionHistoryDialog = true;
    if (this.transaction) {
      this.transactionService.getTransactionExceptionsHistory(this.transaction.id, exception.exceptionSerialNumber)
        .subscribe({
          next: (history) => {
            this.transactionExceptionHistory = history;
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: error?.error?.detail || 'Failed to load exception history',
              icon: 'error'
            });
          }
        });
    }
  }

  openUploadSwiftDialog() {
    this.uploadSwiftDialog = true;
    this.uploadSwiftForm.reset();
    this.selectedSwiftFile = undefined;
  }

  onSwiftFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedSwiftFile = event.target.files[0];
    }
  }
  downloadSwift(reference: ReferenceMT) {

    if (this.transaction) {
      this.transactionService.getTransasctionSwiftFile(this.transaction.id, reference)
        .subscribe({
          next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `swift-${reference}` + this.getFileExtension(blob);
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: error?.error?.detail || 'Failed to download Swift file',
              icon: 'error'
            });
          }
        });
    }

  }
    downloadTransactionDebitAdvice() {

    if (this.transaction) {
      this.transactionService.getTransactionDebitAdviceFile(this.transaction.id)
        .subscribe({
          next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `debit-advice-${this.transaction?.transactionReference}` + this.getFileExtension(blob);
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: error?.error?.detail || 'Failed to download debit advice file',
              icon: 'error'
            });
          }
        });
    }

  }
  downloadZipDocs()
  {
    if (this.transaction) {
      this.transactionService.downloadZipDocs(this.transaction.id)
        .subscribe({
          next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Docs-${this.transaction?.transactionReference}.zip`;
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: (error) => {
            console.log(error);

            Swal.fire({
              title: 'Error',
              text: error?.error?.detail || 'Failed to download zip file',
              icon: 'error'
            });
          }
        });
    }

  }

  downloadAttachedEmail(exception : TransactionExceptionResponse){
    if (exception.attachedEmail) {
         this.transactionService.getExceptionEmailAttachment(exception.transactionId, exception.id)
           .subscribe({
             next: (blob : Blob) => {
               // Get file extension from content type
               const contentType = blob.type;
               let extension = 'txt';

               if (contentType.includes('eml')) {
                 extension = 'eml';
               } else if (contentType.includes('pdf')) {
                 extension = 'pdf';
               } else if (contentType.includes('doc')) {
                 extension = 'doc';
               } else if (contentType.includes('docx')) {
                 extension = 'docx';
               } else if (contentType === 'application/octet-stream') {
                 // Try to get extension from original filename if available
                 const disposition = exception.attachedEmail;
                 if (disposition) {
                 const match = disposition.match(/\.([0-9a-z]+)$/i);
                 if (match) {
                   extension = match[1];
                 }
                 }
               }

               const url = window.URL.createObjectURL(blob);
               const a = document.createElement('a');
               a.href = url;
               a.download = `attachment-${exception.id}.${extension}`;
               a.click();
               window.URL.revokeObjectURL(url);
             },
             error: (error : any) => {
               Swal.fire({
                 title: 'Error',
                 text: error?.error?.detail || 'Failed to download attachment',
                 icon: 'error'
               });
             }
           });
       }
  }
  // Get the file extension from the MIME type or default to .txt
  getFileExtension(blob: Blob) {
    const mimeType = blob.type;
    switch (mimeType) {
      case 'text/plain': return '.txt';
      case 'application/pdf': return '.pdf';
      case 'application/msword': return '.doc';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return '.docx';
      default: return '.txt';
    }
  };
  submitSwiftUpload() {
    if (this.uploadSwiftForm.valid && this.selectedSwiftFile && this.transaction) {
      const { referenceMT, reference } = this.uploadSwiftForm.value;

      this.transactionService.uploadTransactionSwift(
        this.transaction.id,
        referenceMT,
        reference,
        this.selectedSwiftFile
      ).subscribe({
        next: () => {
          this.uploadSwiftDialog = false;
          this.selectedSwiftFile = undefined;
          this.uploadSwiftForm.reset();

          window.location.reload();
          Swal.fire({
            title: 'Success',
            text: 'Swift file uploaded successfully',
            icon: 'success'
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to upload Swift file',
            icon: 'error'
          });
        }
      });
    }
  }

  generateBookingMemo() {
    if (!this.transaction) return;
    this.transactionService.generateBookingMemo(this.transaction.id).subscribe({
      next: (blob) => {
       /// console.log(blob);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `booking-memo-${this.transaction?.id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error',
          text: error?.error?.detail || 'Failed to generate booking memo',
          icon: 'error'
        });
      }
    });
  }

  uploadTransactionDebitAdviceFile() {
    if (!this.transaction) return;

    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx';
    fileInput.style.display = 'none';

    // Handle file selection
    fileInput.onchange = (e: any) => {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];

        // Upload the file
        this.transactionService.uploadTransactionDebitAdviceFile(this.transaction!.id, file)
          .subscribe({
            next: () => {
              Swal.fire({
                title: 'Success',
                text: 'Debit advice file uploaded successfully',
                icon: 'success'
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
             // console.log(error);
              Swal.fire({
                title: 'Error',
                text: error?.error?.detail || 'Failed to upload debit advice file',
                icon: 'error'
              });
            }
          });
      }
    };

    // Trigger file selection
    fileInput.click();
  }

  cancelTransactionDebitAdvice() {
    if (!this.transaction) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the debit advice file?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.transactionService.cancelTransactionDebitAdvice(this.transaction!.id)
          .subscribe({
            next: () => {
              Swal.fire({
                title: 'Success',
                text: 'Debit advice file deleted successfully',
                icon: 'success'
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
              Swal.fire({
                title: 'Error',
                text: error?.error?.detail || 'Failed to delete debit advice file',
                icon: 'error'
              });
            }
          });
      }
    });
  }

  openDIImputationDialog() {
    if (!this.transaction?.id) return;

    this.diImputationDialog = true;
    this.selectedDIs = [];

    this.transactionService.getTransactionDIs(this.transaction.id).subscribe({
      next: (response) => {
        this.clientDIs = response;
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error?.error?.detail || 'Failed to load DIs',
          icon: 'error'
        });
      }
    });
  }

  onDIsSelect(event: any) {
    this.selectedDIs = event.value;
  }
  onDIsFilter(event : any){
    let diRef = event.originalEvent.data;

    if (diRef && diRef.trim() !== '' && diRef.length >= 3) {

    }
  }

  getDIStatusString(status: DIStatus): string {
    return DIStatus[status];
  }

  colorDIStatus(status: DIStatus): string {
    switch (status) {
      case DIStatus.NotUsed:
        return 'success';
      case DIStatus.PartiallyUsed:
        return 'warning';
      case DIStatus.CompletelyUsed:
        return 'danger';
      default:
        return 'info';
    }
  }

  ImputationStatus = ImputationStatus;
  getDIImputationStatusString(status: ImputationStatus): string {
    return ImputationStatus[status];
  }

  colorDISImputationtatus(status: ImputationStatus): string {
    switch (status) {
      case ImputationStatus.DIImputed:
        return 'success';
      case ImputationStatus.DIImputationReversed:
        return 'danger';
      default:
        return 'info';
    }
  }
  imputeDI() {
    if (!this.selectedDIs?.length || !this.transaction) return;

    const command: ImputeDICommand = {
      dIsToImpute: this.selectedDIs.map(di => ({
        dIId: di.diId,
        comment: di.comment
      })),
      amountToImpute: this.transaction.transactionAmount,
      currency: this.transaction.transactionCurrency,
      transactionId: this.transaction.id,
      transactionReference: this.transaction.transactionReference
    };

    // Check if all selected DIs have a comment
    if (this.selectedDIs.some(di => !di.comment)) {
      Swal.fire({
        title: 'Error',
        text: 'Please provide a comment for all selected DIs',
        icon: 'error'
      });
      return;
    }

    this.transactionService.ImputeDI(command).subscribe({
      next: () => {
        this.diImputationDialog = false;
        Swal.fire({
          title: 'Success',
          text: 'DI imputation completed successfully',
          icon: 'success'
        });
         window.location.reload();
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error?.error?.detail || 'Failed to impute DI',
          icon: 'error'
        });
      }
    });
  }

  openDIImputationsDialog() {
    if (!this.transaction?.id) return;

    this.diImputationsDialog = true;
    this.transactionService.getTransactionDIImputations(this.transaction.id).subscribe({
      next: (response) => {
        this.diImputations = response;
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error?.error?.detail || 'Failed to load DI Imputations',
          icon: 'error'
        });
      }
    });
  }

  reverseImputation(imputation: DIImputationResponse) {

    console.log("🚀 => DocumentationTransactionComponent => reverseImputation => imputation:", imputation);

    this.transactionService.reverseImputation(imputation.diId, imputation.id).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success',
          text: 'DI Imputation reversed successfully',
          icon: 'success'
        });
        this.openDIImputationsDialog(); // Refresh the list
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error?.error?.detail || 'Failed to reverse DI Imputation',
          icon: 'error'
        });
      }
    });
  }
  getTransctionMessages() {
    if (!this.transaction?.id) return;

    this.transactionService.getTransactionMessages(this.transaction.id).subscribe({
      next: (response) => {
        this.transactionMessages = response;
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error?.error?.detail || 'Failed to load transaction messages',
          icon: 'error'
        });
      }
    });
  }

  getTransctionMessageType(status: TransactionMessageType): string {
    switch (status) {
      case TransactionMessageType.TransactionRelated:
        return 'Transaction';
      case TransactionMessageType.TransctionFileRelated:
        return 'Document';
      case TransactionMessageType.DIImputationRelated:
        return 'DI Imputation';
      case TransactionMessageType.TransactionExceptionRelated:
        return 'Exception';
      case TransactionMessageType.TransactionSwiftFile:
        return 'Swift';
      case TransactionMessageType.ApurementRelated:
        return 'Apurement';
      case TransactionMessageType.ProcessingOptionRelated:
        return 'Processing Option';
      default:
        return 'Unknown';
    }
  }

  getTransactionMessageTypeName(messageType: string) {
    //Document Status
    // Return document status based on transaction file status string
    switch (messageType) {
      //Transactions
      case 'Drafted':
        return 'Drafted';
      case 'Initiated':
        return 'Initiated';
      case 'Verified':
        return 'Verified';
      case 'TradeAuthorized':
        return 'Trade Authorized';
      case 'TreasuryAuthorized':
        return 'Treasury Authorized';
      case 'TreasuryOperationAuthorized':
        return 'Treasury Operation Authorized';
      case 'TradeOperationAuthorized':
        return 'Trade Operation Authorized';
      case 'Cancelled':
        return 'Cancelled';
      case 'SentForCorrection':
        return 'Sent For Correction';
      //DOcument
      case 'DocumentAwaited':
        return 'Awaited';
      case 'DocumentUploadedNotYetReview':
        return 'Uploaded Not Reviewed';
      case 'DocumentReviewOk':
        return 'Review OK';
      case 'DocumentReviewFailed':
        return 'Review Failed';
      case 'DocumentNotProvided':
        return 'Not Provided';
      case 'DocumentNewOrReplacementRequired':
        return 'Replacement Required';
      //DI Imputation
      case 'DIImputed':
        return 'Imputed';
      case 'DIImputationReversed':
        return 'Reversed';
      //Exceptions
      case 'Open':
        return 'Raised';
      case 'Resolved':
        return 'Resolved';
      case 'ExceptionApprovedWhileWaitingResolution':
        return 'Approved While Waiting Resolution';
      case 'Canceled':
        return 'Canceled';
      //Swift
      case 'SwiftFileUploaded':
        return 'Uploaded';
      //Apurement
      case 'WaitingApurement':
        return 'Waiting Apurement';
      case 'NotApured':
        return 'Not Apured';
      case 'Apured':
        return 'Apured';
      case 'ApuredPartially':
        return 'Apured Partially';

      //processing
      case 'SentToBeac':
        return 'Sent To Central Bank';
      case 'SentToBank':
        return 'Sent To Bank';
      default:
        return 'Unknown';
    }

  }

  getTransactionMessageTypeColor(messageType: string) {
    // Return severity color based on transaction file status string
    switch (messageType) {
      //Transaction
      case 'Drafted':
        return 'info';
      case 'Initiated':
        return 'info';
      case 'Verified':
        return 'warning';
      case 'TradeAuthorized':
      case 'TreasuryAuthorized':
      case 'TreasuryOperationAuthorized':
      case 'TradeOperationAuthorized':
        return 'warning';
      case 'Cancelled':
        return 'danger';
      case 'SentForCorrection':
        return 'warning';
      //DOcument
      case 'DocumentReviewOk':
        return 'success';
      case 'DocumentReviewFailed':
      case 'DocumentNotProvided':
        return 'danger';
      case 'DocumentUploadedNotYetReview':
      case 'DocumentNewOrReplacementRequired':
        return 'warning';
      case 'DocumentAwaited':
        return 'warning';
      //DI Imputation
      case 'DIImputed':
        return 'success';
      case 'DIImputationReversed':
        return 'danger';
      //Exceptions
      case 'Open':
        return 'warning';
      case 'Resolved':
        return 'success';
      case 'ExceptionApprovedWhileWaitingResolution':
        return 'info';
      case 'Canceled':
        return 'danger';
      //Swift
      case 'SwiftFileUploaded':
        return 'success';
      //Apurement
      case 'WaitingApurement':
        return 'warning';
      case 'NotApured':
        return 'danger';
      case 'Apured':
        return 'success';
      case 'ApuredPartially':
        return 'success';
      // processing
      case 'SentToBank':
        return 'info';
      case 'SentToBeac':
        return 'info';
      default:
        return 'info';
    }
  }


  submitTransaction() {
    if (!this.transaction) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to submit this transaction?',
      header: 'Submit Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.transactionService.submitTransaction(this.transaction!.id)
          .subscribe({
            next: () => {
              this.loading = false;
              Swal.fire({
                title: 'Success',
                text: 'Transaction submitted successfully',
                icon: 'success'
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
              this.loading = false;
              Swal.fire({
                title: 'Error',
                text: error?.error?.detail || 'Failed to submit transaction',
                icon: 'error'
              });
            }
          });
      }
    });
  }

  deleteTransaction() {
    if (!this.transaction) return;

    this.confirmationService.confirm({
      message: 'This action cannot be undone. Are you sure you want to delete this transaction?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.loading = true;
        this.transactionService.deleteTransaction(this.transaction!.id)
          .subscribe({
            next: () => {
              this.loading = false;
              Swal.fire({
                title: 'Success',
                text: 'Transaction deleted successfully',
                icon: 'success'
              }).then(() => {
                window.history.back();
              });
            },
            error: (error) => {
              this.loading = false;
              Swal.fire({
                title: 'Error',
                text: error?.error?.detail || 'Failed to delete transaction',
                icon: 'error'
              });
            }
          });
      }
    });
  }

  trackDocument() {
    if (!this.selectedDocument || !this.transaction) return;

    this.documentHistoryDialog = true;
    this.transactionService.getTransactionFileHistory(this.transaction.id, this.selectedDocument.id)
      .subscribe({
        next: (history) => {
          this.documentHistory = history;
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to load document history',
            icon: 'error'
          });
          this.documentHistoryDialog = false;
        }
      });
  }

  getDocumentHistoryStatus(status: TransactionFileStatus): string {
    return this.getFileStatusLabel(status);
  }

  colorDocumentHistoryStatus(status: TransactionFileStatus): string {
    return this.getStatusSeverity(status);
  }

  downloadHistoryDocument(transactionId :string, transactionFileid : string, history : string, docName : string){

    this.transactionService.getTransactionFileHistoryDownload(transactionId, transactionFileid,history)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `doc-${docName}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to download  file',
            icon: 'error'
          });
        }
      });
  }

  selectedProcessingOption : any;
  openProcessingOptionsDialog() {
    this.processingOptionsDialog = true;
  }
  selectedApurementTransactionOption : any;
  openApurementTransactionOptionDialog(){
    this.apurementTransactionOptionDialog = true;
  }

  openCorrespondingBankInfoDialog(){
    if(!this.transaction) return;
    // Load nostro accounts based on transaction currency if available
    const currency = this.transaction.transactionCurrency;
    this.transactionService.getNostroAccounts(currency)
      .subscribe({
        next: (accounts) => {
          this.nostroAccounts = accounts;
          this.correspondingBankDialog = true;
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to load corresponding bank accounts',
            icon: 'error'
          });
        }
      });
  }

  getCorrespondingBankBic(): string {
    if(this.transaction && this.transaction.correspondingBankBic !=='' && this.transaction.correspondingBankBic !== null){
      return this.transaction.correspondingBankBic +' ' + this.transaction.correspondingBankAccountNumber + ' ' + this.transaction.correspondingBankAccountName;
    }
    else
      return 'Not Set';
  }
 getCorrespondingBankBicColor(): string {
    if(this.transaction && this.transaction.correspondingBankBic !=='' && this.transaction.correspondingBankBic !== null){
      return 'success';
    }
    else
      return 'danger';
  }
  submitCorrespondingBankInfo(){
    if(!this.transaction || !this.selectedNostroAccount) return;

    const request: SetCorrespondingBankInfoRequest = {
      transactionId: this.transaction.id,
      accountNumber: this.selectedNostroAccount.accountNumber
    };

    this.transactionService.setTransactionCorrespondingBankInfo(request)
      .subscribe({
        next: () => {
          this.correspondingBankDialog = false;
          Swal.fire({
            title: 'Success',
            text: 'Corresponding bank info updated successfully',
            icon: 'success'
          }).then(()=> window.location.reload());
        },
        error: (error) => {
          console.log(error);
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to update corresponding bank info',
            icon: 'error'
          });
        }
      });
  }

  submitProcessingOption(){
    if (!this.selectedProcessingOption || !this.transaction) return;
    console.log("🚀 submitProcessingOption => this.selectedProcessingOption", this.selectedProcessingOption);


    //TODO  uncomment this
    this.transactionService.setProcessingOption(this.transaction.id, this.selectedProcessingOption)
      .subscribe({
        next: () => {
          this.processingOptionsDialog = false;
          Swal.fire({
            title: 'Success',
            text: 'Processing option updated successfully',
            icon: 'success'
          })
            .then(() => {
              window.location.reload();
            });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to update processing option',
            icon: 'error'
          });
        }
      });
  }

  submitApurementTransactionOption(){
    if (!this.selectedApurementTransactionOption || !this.transaction) return;

    console.log("🚀 submitApurementTransactionOption => this.selectedApurementTransactionOption", this.selectedApurementTransactionOption);


    //TODO  uncomment this

    this.transactionService.setTransactionApurement(this.transaction.id, this.selectedApurementTransactionOption)
      .subscribe({
        next: () => {
          this.apurementTransactionOptionDialog = false;
          Swal.fire({
            title: 'Success',
            text: 'Apurement option updated successfully',
            icon: 'success'
          }).then(() => {
            window.location.reload();
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to update apurement option',
            icon: 'error'
          });
        }
      });
  }

  TransactionDecisionAction = TransactionDecisionAction;
  approvalFlow(transactionDecisionAction: TransactionDecisionAction){

    if (!this.transaction) return;

    const command = {
      transactionId: this.transaction.id,
      transactionDecisionAction: transactionDecisionAction
     } as TransactionApprovalFlowCommand;

     console.log(command);

    this.confirmationService.confirm({
      message: 'Are you sure you want to approve this transaction?',
      header: 'Approve Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.transactionService.approvalFlow(command)
          .subscribe({
            next: () => {
              this.loading = false;
              Swal.fire({
                title: 'Success',
                text: 'Transaction approved successfully',
                icon: 'success'
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
              this.loading = false;
              Swal.fire({
                title: 'Error',
                text: error?.error?.detail || 'Failed to approve transaction',
                icon: 'error'
              });
            }
          });
      }
    });
  }

  openSendForCorrectionDialog = false;
  optionSendForCorrection: RoleToSendBackTransactionResponse[] = [];
  openSendForCorrection() {

    if (!this.transaction) return;

    this.transactionService.getRolesToSendBackTransaction(this.transaction.id)
      .subscribe({
        next: (response : RoleToSendBackTransactionResponse[]) => {
          this.optionSendForCorrection = response;
          this.openSendForCorrectionDialog = true;
        },
        error: (error : any) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to load send for correction options',
            icon: 'error'
          });
        }
      });

  }

  sendForCorrection() {
    if (!this.transaction) return;

    if (!this.sendForCorrectionForm.valid) return;

    const command = {
      transactionId: this.transaction.id,
      transactionDecisionAction: TransactionDecisionAction.SendForCorrection,
      userRoleToSendTo: this.sendForCorrectionForm.get('role')?.value,
      comment: this.sendForCorrectionForm.get('comment')?.value
     } as TransactionApprovalFlowCommand;


     this.transactionService.approvalFlow(command)
       .subscribe({
         next: () => {
           Swal.fire({
             title: 'Success',
             text: 'Transaction sent for correction successfully',
             icon: 'success'
           }).then(() => {
             window.location.reload();
           });
         },
         error: (error) => {
           Swal.fire({
             title: 'Error',
             text: error?.error?.detail || 'Failed to send transaction for correction',
             icon: 'error'
           });
         }
       });
  }

  provisionAccount() {

    if (!this.transaction) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to approve this provision?',
      header: 'Provision Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.transactionService.provisionAccount(this.transaction?.id!)
          .subscribe({
            next: () => {
              this.loading = false;
              Swal.fire({
                title: 'Success',
                text: 'Provision request sent successfully',
                icon: 'success'
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error: unknown) => {
              this.loading = false;
              Swal.fire({
                title: 'Error',
                text: (error as any)?.error?.detail || 'Failed to sent provision request',
                icon: 'error'
              });
            }
          });
      }
    });
  }

  retryProvisionAccount(transactionProvisionTransferId: string) {

    this.confirmationService.confirm({
      message: 'Are you sure you want to retry this provision?',
      header: 'Provision Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.transactionService.retryProvisionAccount(transactionProvisionTransferId)
          .subscribe({
            next: () => {
              this.loading = false;
              Swal.fire({
                title: 'Success',
                text: 'Provision request sent successfully',
                icon: 'success'
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error: any) => {
              this.loading = false;
              Swal.fire({
                title: 'Error',
                text: (error as any)?.error?.detail || 'Failed to sent provision request',
                icon: 'error'
              });
            }
          });
      }
    });
  }

  transactionProvisionTransferResponse: TransactionProvisionTransferResponse[] =[];
  provisionTransfertsDialog = false;

  getProvisionTransferStatusColor(status : ProvisionTransferStatus)
  {
    switch (status) {
      case ProvisionTransferStatus.Created:
        return 'warning';
      case ProvisionTransferStatus.Retry:
        return 'warning';
      case ProvisionTransferStatus.Processed:
        return 'success';
      case ProvisionTransferStatus.Failed:
        return 'danger';
      default:
        return 'info';
    }
  }

  getProvisionTransferStatusString(status: ProvisionTransferStatus) {
    switch (status) {
      case ProvisionTransferStatus.Created:
        return 'Created';
      case ProvisionTransferStatus.Retry:
        return 'Retry';
      case ProvisionTransferStatus.Processed:
        return 'Processed';
      case ProvisionTransferStatus.Failed:
        return 'Failed';
      default:
        return 'info';
    }
  }

  getTransactionProvisionStatusColor(status: TransactionProvisionStatus) {
    switch (status) {
      case TransactionProvisionStatus.NotProcessed:
        return 'warning';
      case TransactionProvisionStatus.BeingProcessed:
        return 'info';
      case TransactionProvisionStatus.Processed:
        return 'success';
      case TransactionProvisionStatus.Failed:
        return 'danger';
      default:
        return 'info';
    }
  }
  getTransactionProvisionStatusString(status: TransactionProvisionStatus) {
    switch (status) {
      case TransactionProvisionStatus.BeingProcessed:
        return 'Being Processed';
      case TransactionProvisionStatus.NotProcessed:
        return 'Not Processed';
      case TransactionProvisionStatus.Processed:
        return 'Processed';
      case TransactionProvisionStatus.Failed:
        return 'Failed';
      default:
        return 'info';
    }
  }


  getProvisionTransfertsDialog()
  {
    if(!this.transaction?.id) return;

    this.transactionService.getProvisionTransferts(this.transaction.id)
      .subscribe({
        next: (response: TransactionProvisionTransferResponse[]) => {
          this.transactionProvisionTransferResponse = response;
          this.provisionTransfertsDialog = true;
        },
        error: (error: any) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to load provision transfers',
            icon: 'error'
          });
        }
      });
  }

  TransactionAmountLienStatus = TransactionAmountLienStatus;
  setTransactionAmountLienStatus(){
    if (!this.transaction) return;

    let transStatus =  this.transaction.transactionAmountLienStatus == TransactionAmountLienStatus.AmountNotLien ?
                          TransactionAmountLienStatus.AmountLien : TransactionAmountLienStatus.AmountNotLien;

    this.confirmationService.confirm({
      message: 'Are you sure you want to update the transaction amount lien status?',
      header: 'Update Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
      this.transactionService.setTransactionAmountLienStatus(this.transaction!.id, transStatus)
        .subscribe({
        next: () => {
          Swal.fire({
          title: 'Success',
          text: 'Transaction amount lien status updated successfully',
          icon: 'success'
          }).then(() => {
          window.location.reload();
          });
        },
        error: (error) => {
          Swal.fire({
          title: 'Error',
          text: error?.error?.detail || 'Failed to update transaction amount lien status',
          icon: 'error'
          });
        }
        });
      }
    });

  }

  getTransactionAmountLienStatusString(transactionAmountLienStatus: TransactionAmountLienStatus){
     return  TransactionAmountLienStatus[transactionAmountLienStatus];
  }

  getTransactionAmountLienStatusColor(transactionAmountLienStatus : TransactionAmountLienStatus){
    switch (transactionAmountLienStatus) {
      case TransactionAmountLienStatus.AmountNotLien:
        return 'danger';
      case TransactionAmountLienStatus.AmountLien:
        return 'success';
      default:
        return 'info';
    }
  }
}

