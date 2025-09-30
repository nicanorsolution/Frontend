import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ExportationService } from '../services/exportation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ExportationResponse, ExportationFileResponse, ExportationStatus, ExportationApurementStatus, ExportationFileStatus, DEFeeStatus, ExportationFileHistoryResponse, CreateExportationIncomingCommand, IncomingStatus, Severity, ExceptionDirectedTo, RaiseExportationExceptionCommand, ExportationExceptionResponse, ExceptionStatus, ExportationMessageType, CreateExportationIncomingRetrocessionCommand, IncomingRetrocessionStatus, UpdateExportationFactureDefinitiveCommand, UpdateExportationBonForEmbarquementCommand } from '../models/exportation.models';
import { ComplemetaryInformationRequiredFor, DocumentControl, DocumentControlType, DocumentSubmissionOption } from '../../documentations/models/document.models';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from '../../users/auth.service';
import Swal from 'sweetalert2';
import { UserRoles, UserType } from '../../users/user.models';
import { ExportationDocumentationData } from '../resolvers/exportation-documentation.resolver';
import { SwiftParserService } from '../services/parse.service';  // Add this import
import { ExceptionResolverContactResponse } from '../../transactions/models/transactions.model';
import { UserRoleEnum } from 'src/app/helpers/UserRoleEnum';
import { DEResponse } from '../../de/models/de.models';

@Component({
  selector: 'app-documentation-exportation',
  templateUrl: './documentation-exportation.component.html',
  styleUrls: ['./documentation-exportation.component.scss'],
  providers: [ConfirmationService]
})
export class DocumentationExportationComponent implements OnInit {
  UserRoleEnum = UserRoleEnum;
  UserType = UserType;
  exportation?: ExportationResponse | null;
  loading = true;
  documents: ExportationFileResponse[] = [];
  selectedDocument?: ExportationFileResponse;
  documentControls?: DocumentControl[] = [];
  selectedControls: DocumentControl[] = [];
  ComplemetaryInformationRequiredFor = ComplemetaryInformationRequiredFor;
  selectedComplemetaryInformationRequiredFor: ComplemetaryInformationRequiredFor | null = null;
  fileBLob?: Blob | null = null;
  fileBase64?: string | null = null;
  pdfLoadingError?: string | null = null;
  downloadUrl?: string | null = null;
  reviewDialog = false;
  reviewForm: FormGroup;
  panelNumber: number = 1;
  documentsReviewDialog = false;
  documentHistoryDialog = false;
  UserRoles = UserRoles;
  expandedRows: { [key: string]: boolean } = {};
  uploadDocumentsDialog = false;
  selectedUploadDocument?: ExportationFileResponse;
  selectedFile?: File;

  // Add to existing properties
  documentHistory: ExportationFileHistoryResponse[] = [];

  // Add these properties
  apurementExportationOptionDialog = false;
  selectedApurementExportationOption: any;
  apurementExportationOption = [
    { label: 'Not Apured', value: ExportationApurementStatus.NotApured },
    { label: 'Apured', value: ExportationApurementStatus.Apured },
    { label: 'Apured Partially', value: ExportationApurementStatus.ApuredPartially }
  ];

  // Add new properties
  incomingDialog = false;
  incomingForm: FormGroup;
  selectedIncomingSwiftFile?: File;
  selectedIncomingData?: any;
  searchDEForm!: FormGroup;
  searchDEDialog = false;
  selectedDEDetails?: DEResponse;
  // Add near the top with other component properties

  // Incoming Retrocession state
  incomingRetrocessionDialog = false;
  incomingRetrocessionForm!: FormGroup;
  selectedIncomingRetrocessionSwiftFile?: File;

  // Update complementary info dialogs state
  updateFactureDefinitiveDialog = false;
  updateBonEmbarquementDialog = false;
  updateFactureDefinitiveForm!: FormGroup;
  updateBonEmbarquementForm!: FormGroup;


  documentReviewStatus = [
    { label: 'Review OK', value: ExportationFileStatus.DocumentReviewOk, code: ExportationFileStatus.DocumentReviewOk },
    { label: 'Review Failed', value: ExportationFileStatus.DocumentReviewFailed, code: ExportationFileStatus.DocumentReviewFailed },
    { label: 'Need Replacement', value: ExportationFileStatus.DocumentNewOrReplacementRequired, code: ExportationFileStatus.DocumentNewOrReplacementRequired }
  ];

  // Add near top with other component properties
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

  // Add after other component properties
  viewExceptionsDialog = false;
  updateExceptionDialog = false;
  updateExceptionForm: FormGroup;
  selectedException?: ExportationExceptionResponse;
  transactionExceptions: ExportationExceptionResponse[] = [];

  exceptionStatusOptions = [
    { label: 'Open', value: ExceptionStatus.Open },
    { label: 'Approved While Waiting Resolution', value: ExceptionStatus.ApprovedWhileWaitingExpcetionResolution },
    { label: 'Canceled', value: ExceptionStatus.Canceled },
    { label: 'Resolved', value: ExceptionStatus.Resolved }
  ];

  @ViewChild('dialog_operation_swal')
  private dialogOperationSwal!: SwalComponent;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly exportationService: ExportationService,
    private readonly swiftParserService: SwiftParserService,
    private readonly fb: FormBuilder,
    public confirmationService: ConfirmationService,
    private readonly cdr: ChangeDetectorRef  // Add this
  ) {
    this.reviewForm = this.fb.group({
      exportationFileStatus: [null, Validators.required], // Changed from transactionFileStatus
      reviewerNote: ['', Validators.required]
    });

    // Initialize incoming form
    this.incomingForm = this.fb.group({
      exportationId: [''],
      corporateOrIndividual: [''],
      corporateId: [''],
      individualId: [''],
      accountNumber: [''],
      amount: [''],
      currency: [''],
      swiftReference: [''],
      beneficiaryNameAddress: [''],
      valueDate: [''] // Add this line
    });

    // Initialize exceptionForm
    this.exceptionForm = this.fb.group({
      exceptionDirectedTo: ['', Validators.required],
      internalNote: ['', Validators.required],
      clientNote: ['', Validators.required],
      severity: ['', Validators.required],
      exceptionResolverEmail: [[], [Validators.required]],
      exportationFileCausingException: [[], Validators.required],
      isExportationFileReviewNoteAdded: [true, Validators.required]
    });

    // Initialize update exception form
    this.updateExceptionForm = this.fb.group({
      internalNote: ['', Validators.required],
      exceptionStatus: ['', Validators.required]
    });

    // Initialize incoming retrocession form (no parser involved)
    this.incomingRetrocessionForm = this.fb.group({
      refundReference: ['', Validators.required],
      amountThatShouldBeRefund: [null, [Validators.required, Validators.min(0.01)]]
    });

    // Initialize complementary info forms
    this.updateFactureDefinitiveForm = this.fb.group({
      referenceFactureDefinitive: ['', Validators.required],
      amountFactureDefinitive: [null, [Validators.required, Validators.min(0.01)]]
    });

    this.updateBonEmbarquementForm = this.fb.group({
      referenceBonForEmbarquement: ['', Validators.required],
      amountBonForEmbarquement: [null, [Validators.required, Validators.min(0.01)]],
      dateBonForEmbarquement: [null, Validators.required]
    });
  }

  ngOnInit() {
      this.route.data.subscribe({
         next: (data) => {
           const resolvedData = data['exportation'] as ExportationDocumentationData;

           this.exportation = resolvedData.exportation;
           this.documents = resolvedData.documents;
           this.loading = false;
           console.log("🚀 => ngOnInit => resolvedData:", resolvedData);
           this.panelNumber = this.getPanelClass();
         }
       });

      this.searchDEForm = this.fb.group({
        eForceReference: ['', Validators.required]
      });
  }

  // ========== Update Facture Definitive / Bon pour Embarquement ==========
  openUpdateFactureDefinitiveDialog(): void {
    if (!this.exportation) return;
    this.updateFactureDefinitiveForm.reset();
    this.updateFactureDefinitiveForm.patchValue({
      referenceFactureDefinitive: this.exportation.referenceFactureDefinitive || '',
      amountFactureDefinitive: this.exportation.amountFactureDefinitive ?? null
    });
    this.updateFactureDefinitiveDialog = true;
  }

  submitUpdateFactureDefinitive(): void {
    if (!this.exportation || this.updateFactureDefinitiveForm.invalid) return;
    const command: UpdateExportationFactureDefinitiveCommand = {
      exportationId: this.exportation.id,
      referenceFactureDefinitive: this.updateFactureDefinitiveForm.value.referenceFactureDefinitive,
      amountFactureDefinitive: this.updateFactureDefinitiveForm.value.amountFactureDefinitive
    };
    this.exportationService.updateExportationFactureDefinitive(command).subscribe({
      next: () => {
        this.updateFactureDefinitiveDialog = false;
        Swal.fire({
          title: 'Success',
          text: 'Facture définitive updated successfully',
          icon: 'success'
        }).then(() => window.location.reload());
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error?.error?.detail || 'Failed to update Facture définitive',
          icon: 'error'
        });
      }
    });
  }

  openUpdateBonEmbarquementDialog(): void {
    if (!this.exportation) return;
    this.updateBonEmbarquementForm.reset();
    this.updateBonEmbarquementForm.patchValue({
      referenceBonForEmbarquement: this.exportation.referenceBonForEmbarquement || '',
      amountBonForEmbarquement: this.exportation.amountBonForEmbarquement ?? null,
      dateBonForEmbarquement: this.exportation.dateBonForEmbarquement ? new Date(this.exportation.dateBonForEmbarquement) : null
    });
    this.updateBonEmbarquementDialog = true;
  }

  submitUpdateBonEmbarquement(): void {
    if (!this.exportation || this.updateBonEmbarquementForm.invalid) return;
    const command: UpdateExportationBonForEmbarquementCommand = {
      exportationId: this.exportation.id,
      referenceBonForEmbarquement: this.updateBonEmbarquementForm.value.referenceBonForEmbarquement,
      amountBonForEmbarquement: this.updateBonEmbarquementForm.value.amountBonForEmbarquement,
      dateBonForEmbarquement: this.updateBonEmbarquementForm.value.dateBonForEmbarquement
    };
    this.exportationService.updateExportationBonForEmbarquement(command).subscribe({
      next: () => {
        this.updateBonEmbarquementDialog = false;
        Swal.fire({
          title: 'Success',
          text: 'Bon pour embarquement updated successfully',
          icon: 'success'
        }).then(() => window.location.reload());
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error?.error?.detail || 'Failed to update Bon pour embarquement',
          icon: 'error'
        });
      }
    });
  }

  // ========== Incoming Retrocession handlers ==========
  openIncomingRetrocessionDialog(): void {
    this.incomingRetrocessionForm.reset();
    this.selectedIncomingRetrocessionSwiftFile = undefined;
    this.incomingRetrocessionDialog = true;
  }

  onIncomingRetrocessionSwiftSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.selectedIncomingRetrocessionSwiftFile = input.files[0];
    } else {
      this.selectedIncomingRetrocessionSwiftFile = undefined;
    }
  }

  submitIncomingRetrocessionRegistration(): void {
    if (!this.exportation) return;
    if (!this.incomingRetrocessionForm.valid || !this.selectedIncomingRetrocessionSwiftFile) return;

    const command: CreateExportationIncomingRetrocessionCommand = {
      exportationId: this.exportation.id,
      amountThatShouldBeRefund: this.incomingRetrocessionForm.value.amountThatShouldBeRefund,
      refundReference: this.incomingRetrocessionForm.value.refundReference,
      swiftFile: this.selectedIncomingRetrocessionSwiftFile
    };

    this.exportationService.createExportationIncomingRetrocession(command).subscribe({
      next: () => {
        this.incomingRetrocessionDialog = false;
        this.selectedIncomingRetrocessionSwiftFile = undefined;
        // Optionally refresh list from backend if needed
        if (this.exportation) {
          this.exportationService.getExportationMessages(this.exportation.id).subscribe({
            next: () => {
               Swal.fire({
                title: 'Success',
                text: 'Incoming retrocession created successfully',
                icon: 'success'
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
                Swal.fire({
                  title: 'Error',
                  text: 'Failed to create incoming retrocession ' + (error?.error?.detail || ''),
                  icon: 'error'
                });
            }
          });
        }
      },
      error: (error) => {
        console.error('Error creating incoming retrocession:', error);
      }
    });
  }

  // downloadIncomingRetrocessionSwift implementation moved below (single definition retained)

  deleteIncomingRetrocession(exportationId: string, serialNumber: string): void {
    this.exportationService
      .deleteExportationIncomingRetrocession(exportationId, serialNumber)
      .subscribe({
        next: () => {
          Swal.fire({
                title: 'Success',
                text: 'Incoming retrocession deleted successfully',
                icon: 'success'
              }).then(() => {
                window.location.reload();
              });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to delete incoming retrocession ' + (error?.error?.detail || ''),
            icon: 'error'
          });
        }
      });
  }

  getIncomingRetrocessionStatusString(status: IncomingRetrocessionStatus): string {
    switch (status) {
      case IncomingRetrocessionStatus.Created:
        return 'Created';
      case IncomingRetrocessionStatus.Deleted:
        return 'Deleted';
      default:
        return 'Unknown';
    }
  }

  colorIncomingRetrocessionStatus(status: IncomingRetrocessionStatus): string {
    switch (status) {
      case IncomingRetrocessionStatus.Created:
        return 'success';
      case IncomingRetrocessionStatus.Deleted:
        return 'danger';
      default:
        return 'info';
    }
  }

    getPanelClass() {
      console.log('UserRoles', this.authService.getDecodedToken());

      const roles = this.authService.getDecodedToken().UserRoles;

      console.log('UserRoles', roles );

      if (roles == UserRoles.TradeDeskAuthorizer)
      {
        console.log('panelNumber', 3);
        return 3;
      }
       else {
        console.log('panelNumber', 2);
        return 2;
      }
    }

  onDocumentChange(event: any) {
    this.selectedDocument = event.value as ExportationFileResponse;
    if (this.selectedDocument) {
      // Load document
      this.exportationService.getExportationFileBlob(this.selectedDocument.exportationId, this.selectedDocument.id)
      .subscribe({
        next: (blob: Blob) => {
          this.fileBLob = blob;
          this.pdfLoadingError = null;
          // Create download URL for fallback
          this.downloadUrl = URL.createObjectURL(blob);

          this.blobToBase64(blob).then(base64 => {
            this.fileBase64 = base64;

          }).catch(error => {
            console.error('Error converting blob to base64:', error);
            this.pdfLoadingError = 'Failed to convert document for display';
          });
        },
        error: (error) => {
          console.error('Error loading document:', error);
          this.fileBLob = null;
          this.fileBase64 = null;
          this.pdfLoadingError = 'Failed to load document from server';
        }
      });
      // Load document controls
      console.log('Loading document controls for document ID:', this.selectedDocument);

      this.exportationService.getDocumentControls(this.selectedDocument.documentId)
        .subscribe({
          next: (response) => {
            this.documentControls = response.documentControls;
            this.selectedComplemetaryInformationRequiredFor = response.complemetaryInformationRequiredFor;
          },
          error: (error) => {
            console.error('Error loading document controls:', error);
          }
        });
    }
  }

  blobToBase64(blob : Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
          const dataUrl = reader.result as string;
          const base64 = dataUrl.split(',')[1];
          resolve(base64);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read blob as data URL'));
      };
      reader.readAsDataURL(blob);
    });
  }

  onPdfLoaded(event: any): void {
    console.log('PDF loaded successfully:', event);
    this.pdfLoadingError = null;
  }

  onPdfLoadingFailed(event: any): void {
    console.error('PDF loading failed:', event);
    this.pdfLoadingError = 'Unable to display PDF document. Please check your internet connection and try again.';
  }

  getStatusString(status: ExportationStatus): string {
    return ExportationStatus[status];
  }

  getApurementStatusString(status: ExportationApurementStatus): string {
    return ExportationApurementStatus[status];
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
        return 'info';
    }
  }

  trackDocument() {
    if (!this.selectedDocument || !this.exportation) return;

    this.documentHistoryDialog = true;
    this.exportationService.getExportationFileHistory(this.exportation.id, this.selectedDocument.id)
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

  getDocumentHistoryStatus(status: ExportationFileStatus): string {
    return this.getFileStatusLabel(status);
  }

  colorDocumentHistoryStatus(status: ExportationFileStatus): string {
    return this.getStatusSeverity(status);
  }

  downloadHistoryDocument(exportationId: string, exportationFileId: string, history: string | null, docName: string) {
    this.exportationService.getExportationFileHistoryDownload(exportationId, exportationFileId, history)
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
            text: error?.error?.detail || 'Failed to download file',
            icon: 'error'
          });
        }
      });
  }

  ExportationStatus = ExportationStatus;
  submitExportation() {
    if (!this.exportation) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to submit this exportation?',
      header: 'Submit Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.exportationService.submitExportation(this.exportation!.id)
          .subscribe({
            next: () => {
              this.loading = false;
              Swal.fire({
                title: 'Success',
                text: 'Exportation submitted successfully',
                icon: 'success'
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
              this.loading = false;
              Swal.fire({
                title: 'Error',
                text: error?.error?.detail || 'Failed to submit exportation',
                icon: 'error'
              });
            }
          });
      }
    });
  }

  deleteExportation() {
    if (!this.exportation) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this exportation?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.exportationService.deleteExportation(this.exportation!.id)
          .subscribe({
            next: () => {
              this.loading = false;
              Swal.fire({
                title: 'Success',
                text: 'Exportation deleted successfully',
                icon: 'success'
              }).then(() => {
                window.history.back();
              });
            },
            error: (error) => {
              this.loading = false;
              Swal.fire({
                title: 'Error',
                text: error?.error?.detail || 'Failed to delete exportation',
                icon: 'error'
              });
            }
          });
      }
    });
  }

  isCheckDocumentEnabled(): boolean {
    if (!this.documentControls) return false;

    const mandatoryControls = this.documentControls.filter(
      c => c.documentControlType === DocumentControlType.Mandatory
    );

    if (mandatoryControls.length === 0) return false;

    const isMandatoryControlsCheck = mandatoryControls.every(mc =>
      this.selectedControls.some(sc => sc.documentControlId === mc.documentControlId)
    );

    const isDocumentPathProvided = this.selectedDocument?.documentPath ? this.selectedDocument.documentPath !== '' : false;

    return isMandatoryControlsCheck && isDocumentPathProvided;
  }

  clearBonEmbarquement() {
    if (!this.exportation) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to clear Bon pour Embarquement?',
      header: 'Confirm Clear',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.exportationService.clearExportationBonForEmbarquement(this.exportation!.id)
          .subscribe({
            next: () => {
              Swal.fire({
                title: 'Cleared',
                text: 'Bon pour Embarquement cleared successfully',
                icon: 'success'
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
              Swal.fire({
                title: 'Error',
                text: error?.error?.detail || 'Failed to clear Bon pour Embarquement',
                icon: 'error'
              });
            }
          });
      }
    });
  }

  clearFactureDefinitive() {
    if (!this.exportation) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to clear Facture Définitive?',
      header: 'Confirm Clear',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.exportationService.clearExportationFactureDefinitive(this.exportation!.id)
          .subscribe({
            next: () => {
              Swal.fire({
                title: 'Cleared',
                text: 'Facture Définitive cleared successfully',
                icon: 'success'
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
              Swal.fire({
                title: 'Error',
                text: error?.error?.detail || 'Failed to clear Facture Définitive',
                icon: 'error'
              });
            }
          });
      }
    });
  }

  getFileStatusLabel(status: ExportationFileStatus): string {
    return ExportationFileStatus[status];
  }

  getStatusSeverity(status: ExportationFileStatus): string {
    switch (status) {
      case ExportationFileStatus.DocumentReviewOk:
        return 'success';
      case ExportationFileStatus.DocumentReviewFailed:
        return 'danger';
      case ExportationFileStatus.DocumentUploadedNotYetReview:
      case ExportationFileStatus.DocumentNewOrReplacementRequired:
        return 'warning';
      default:
        return 'info';
    }
  }
  getDocumentSubmissionStatusLabel(status: DocumentSubmissionOption): string {
    return DocumentSubmissionOption[status];
  }

  getDocumentSubmissionSeverity(status: DocumentSubmissionOption): string {
    switch (status) {
      case DocumentSubmissionOption.SubmissionAfterProcessing:
        return 'success';
      case DocumentSubmissionOption.SubmissionBeforeProcessing:
        return 'danger';
      default:
        return 'info';
    }
  }

  viewControlDetails(control: DocumentControl) {
    this.dialogOperationSwal.update({
      title: 'Control details',
      text: control.documentControlDetail,
      icon: 'info'
    });
    this.dialogOperationSwal.fire();
  }

  onControlPerformed(event: any) {
    const control = event as DocumentControl;
    if (event) {
      this.selectedControls.push(control);
    } else {
      this.selectedControls = this.selectedControls.filter(c => c.documentControlId !== control.documentControlId);
    }
  }

  downloadZipDocs() {
        if (this.exportation) {
          this.exportationService.downloadZipDocs(this.exportation.id)
            .subscribe({
              next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Docs-${this.exportation?.deDetails.eForceReference}.zip`;
                a.click();
                window.URL.revokeObjectURL(url);
              },
              error: (error) => {
                console.error('Error downloading Zip file:', error);
                Swal.fire({
                  title: 'Error',
                  text: error?.error?.detail || 'Failed to download Zip file',
                  icon: 'error'
                });
              }
            });
        }
  }
  openReviewDialog() {
    this.reviewDialog = true;
    this.reviewForm.patchValue({
      exportationFileStatus: null,
      reviewerNote: ''
    });
  }

  submitReview() {
    if (this.reviewForm.valid && this.selectedDocument && this.exportation) {
      const command = {
        exportationId: this.exportation.id,
        exportationFileId: this.selectedDocument.id,
        exportationFileStatus: this.reviewForm.get('exportationFileStatus')?.value,
        reviewerNote: this.reviewForm.get('reviewerNote')?.value
      };

      this.exportationService.reviewExportationFile(command).subscribe({
        next: () => {
          this.reviewDialog = false;
          // Refresh document list
          if (this.exportation) {
            this.exportationService.getExportationFiles(this.exportation.id)
              .subscribe(docs => this.documents = docs);
          }
          // Show success message
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

  openDocumentsReviewSummary(){
     if (!this.exportation?.id) return;

        this.loading = true;
        this.exportationService.getExportationFiles(this.exportation.id)
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

  getDEFeeStatusString(status: DEFeeStatus): string {
    return DEFeeStatus[status];
  }

  colorDEFeeStatus(status: DEFeeStatus): string {
    switch (status) {
      case DEFeeStatus.PaymentNotProcessed:
        return 'warning';
      case DEFeeStatus.PaymentBeingProcessed:
        return 'info';
      case DEFeeStatus.PaymentProcessed:
        return 'success';
      case DEFeeStatus.PaymentFailed:
        return 'danger';
      default:
        return 'info';
    }
  }

  openUploadDocumentsDialog() {
    this.uploadDocumentsDialog = true;
    this.selectedUploadDocument = undefined;
    this.selectedFile = undefined;
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  selectDocumentForUpload(doc: ExportationFileResponse) {
    this.selectedUploadDocument = doc;
  }

  uploadDocument() {
    if (!this.selectedUploadDocument || !this.selectedFile || !this.exportation) return;

    this.loading = true;
    this.exportationService.uploadExportationFile(
      this.exportation.id,
      this.selectedUploadDocument.documentId,
      this.selectedFile
    ).subscribe({
      next: () => {
        this.loading = false;
        // Refresh document list
        if (this.exportation) {
          this.exportationService.getExportationFiles(this.exportation.id)
            .subscribe(docs => this.documents = docs);
        }
        // Reset selection
        this.selectedUploadDocument = undefined;
        this.selectedFile = undefined;
        this.uploadDocumentsDialog = false;

        Swal.fire({
          title: 'Success',
          text: 'Document uploaded successfully',
          icon: 'success'
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

  openApurementExportationOptionDialog() {
    this.apurementExportationOptionDialog = true;
  }

  submitApurementExportationOption() {
    if (!this.selectedApurementExportationOption || !this.exportation) return;

    console.log("🚀 submitApurementExportationOption => this.selectedApurementExportationOption", this.selectedApurementExportationOption);

    this.exportationService.setExportationApurement(this.exportation.id, this.selectedApurementExportationOption)
      .subscribe({
        next: () => {
          this.apurementExportationOptionDialog = false;
          Swal.fire({
            title: 'Success',
            text: 'Apurement status updated successfully',
            icon: 'success'
          }).then(() => {
            window.location.reload();
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to update apurement status',
            icon: 'error'
          });
        }
      });
  }

  openSearchDEDialog() {
    this.searchDEDialog = true;
    this.searchDEForm.reset();
    this.selectedDEDetails = undefined;
  }

  searchDE() {
      const eForceRef = this.searchDEForm.get('eForceReference')?.value;
      if (!eForceRef) return;

      this.exportationService.getDEDetailsByEForceReference(eForceRef).subscribe({
        next: (response) => {
          if (response && response.length > 0) {
            this.selectedDEDetails = response[0];
          } else {
            Swal.fire({
              title: 'Not Found',
              text: 'No DE found with the provided reference',
              icon: 'info'
            });
          }
        },
        error: (error) => {
            Swal.fire({
                title: 'Error',
                text: error?.error?.detail || 'An error occurred',
                icon: 'error'
              });
        }
      });
  }

  matchDESelection(){
     console.log("🚀 matchDESelection => this.selectedDEDetails", this.selectedDEDetails);
     console.log("🚀 matchDESelection => this.exportation", this.exportation);
     if (!this.selectedDEDetails) return;
     if (!this.exportation) return;

     this.exportationService.matchDEWithExportation(this.exportation?.id ,this.selectedDEDetails.eForceReference)
         .subscribe({
            next: () => {
              this.searchDEDialog = false;
              Swal.fire({
                title: 'Success',
                text: 'DE matched successfully',
                icon: 'success'
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
              Swal.fire({
                title: 'Error',
                text: error?.error?.detail || 'Failed to match DE',
                icon: 'error'
              });
            }
         });
  }
  unmatchDE(){
    if (!this.exportation) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to unmatch the DE from this exportation?',
      header: 'Unmatch Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.exportationService.unMatchDEWithExportation(this.exportation!.id)
          .subscribe({
            next: () => {
              this.loading = false;
              Swal.fire({
                title: 'Success',
                text: 'DE unmatched successfully',
                icon: 'success'
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
              this.loading = false;
              Swal.fire({
                title: 'Error',
                text: error?.error?.detail || 'Failed to unmatch DE',
                icon: 'error'
              });
            }
          });
      }
    });
  }
  collectDeFee(exportationId: string) {
    if (!this.exportation) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to process the DE fee collection?',
      header: 'Confirm DE Fee Collection',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.exportationService.deFeeCollection(exportationId)
          .subscribe({
            next: () => {
              this.loading = false;
              Swal.fire({
                title: 'Success',
                text: 'DE fee collection being processed ',
                icon: 'success'
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
              this.loading = false;
              Swal.fire({
                title: 'Error',
                text: error?.error?.detail || 'Failed to process DE fee collection',
                icon: 'error'
              });
            }
          });
      }
    });
  }

  incomingRegistrationDialog(exportation: ExportationResponse) {
    this.incomingDialog = true;
    this.selectedIncomingSwiftFile = undefined;
    this.selectedIncomingData = undefined;

    // Pre-fill exportation details
    this.incomingForm.patchValue({
      exportationId: exportation.id,
      corporateOrIndividual: exportation.corporateOrIndividual,
      corporateId: exportation.corporateId,
      individualId: exportation.individualId
    });
  }

  onIncomingSwiftSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedIncomingSwiftFile = file;

      // Read and parse the file
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const content = e.target.result;
        const details = this.swiftParserService.parseSwiftMessage(content);

        // Update form with parsed data including valueDate
        this.incomingForm.patchValue({
          accountNumber: details.beneficiaryAccount || '',
          amount: details.amount || '',
          currency: details.currency || '',
          swiftReference: details.transactionReference || '',
          beneficiaryNameAddress:'\n' + (details.beneficiaryNameAddress ? details.beneficiaryNameAddress.join('\n') : ''),
          valueDate: details.valueDate.toLocaleDateString()
        });
      };

      reader.readAsText(file);
    }
  }

  submitIncomingRegistration() {
    if (!this.selectedIncomingSwiftFile || !this.incomingForm.valid) return;

    const command: CreateExportationIncomingCommand = {
      ...this.incomingForm.value,
      swiftFile: this.selectedIncomingSwiftFile
    };

    this.exportationService.createExportationIncoming(command)
      .subscribe({
        next: () => {
          this.incomingDialog = false;
          Swal.fire({
            title: 'Success',
            text: 'Incoming registration completed successfully',
            icon: 'success'
          }).then(() => {
            window.location.reload();
          });
        },
        error: (error) => {

          console.log("🚀 submitIncomingRegistration => error", error);

          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to register incoming',
            icon: 'error'
          });
        }
      });
  }

  getIncomingStatusString(status: IncomingStatus): string {
    return IncomingStatus[status];
  }

  colorIncomingStatus(status: IncomingStatus): string {
    switch (status) {
      case IncomingStatus.Received:
        return 'success';
      case IncomingStatus.Deleted:
        return 'danger';
      default:
        return 'info';
    }
  }

  deleteIncoming(exportationId: string, incomingId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this incoming response?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.exportationService.deleteExportationIncoming(exportationId, incomingId)
          .subscribe({
            next: () => {
              Swal.fire({
                title: 'Success',
                text: 'Incoming response deleted successfully',
                icon: 'success'
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
              Swal.fire({
                title: 'Error',
                text: error?.error?.detail || 'Failed to delete incoming response',
                icon: 'error'
              });
            }
          });
      }
    });
  }

  downloadIncomingSwift(exportationId: string, incomingId: string) {
    this.exportationService.getExportationIncomingSwiftDownload(exportationId, incomingId)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `swift-${incomingId}.txt`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to download swift file',
            icon: 'error'
          });
        }
      });
  }

   downloadIncomingRetrocessionSwift(exportationId: string, incomingRetrocessionId: string) {
    this.exportationService.getExportationIncomingRetrocessionSwiftDownload(exportationId, incomingRetrocessionId)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `swift-${incomingRetrocessionId}.txt`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to download swift file',
            icon: 'error'
          });
        }
      });
  }

  openRaiseExceptionDialog() {
    this.raiseExceptionDialog = true;
    this.exceptionForm.reset();
  }
  openViewExceptionsDialog(){
    if (!this.exportation?.id) return;

    this.loading = true;
    this.exportationService.getExportationExceptions(this.exportation.id)
      .subscribe({
        next: (exceptions) => {
          this.transactionExceptions = exceptions;
          this.viewExceptionsDialog = true;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to load exceptions',
            icon: 'error'
          });
        }
      });
  }
  getContactOfExceptionResolver() {
    const to = this.exceptionForm.get("exceptionDirectedTo")?.value as ExceptionDirectedTo;
    this.contactOfExceptionResolver = [];

    this.exportationService.getExportationExceptionResolverMail(this.exportation?.id, to)
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
    if (this.exceptionForm.valid && this.exportation) {
      const command: RaiseExportationExceptionCommand = {
        exportationId: this.exportation.id,
        ...this.exceptionForm.value
      };

      console.log("🚀 submitException => command", command);

      this.exportationService.raiseException(command).subscribe({
        next: () => {
          this.raiseExceptionDialog = false;
          Swal.fire({
            title: 'Success',
            text: 'Exception raised successfully',
            icon: 'success'
          });

          window.location.reload();
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

  @ViewChild('internalNoteEditorForUpdateExceptionStatus') internalNoteEditorForUpdateExceptionStatus: any;
  openUpdateExceptionDialog(exception: ExportationExceptionResponse) {
    this.selectedException = exception;
    console.log("🚀 openUpdateExceptionDialog => exception", exception);

    // Show the dialog first
    this.updateExceptionDialog = true;

    // Reset and set initial values
    this.updateExceptionForm.patchValue({
      internalNote: '',  // Start with empty value
      exceptionStatus: exception.exceptionStatus
    });

    // Wait for dialog and editor to render completely
    setTimeout(() => {
      if (this.internalNoteEditorForUpdateExceptionStatus && exception.internalNote) {
        // Method 1: Try setting the value directly on the editor
        try {
          if (this.internalNoteEditorForUpdateExceptionStatus.getQuill) {
            const quill = this.internalNoteEditorForUpdateExceptionStatus.getQuill();
            quill.root.innerHTML = exception.internalNote;
          }
        } catch (error) {
          console.log('Direct Quill method failed, trying form control method');
        }

        // Method 2: Set via form control
      /*   const internalNoteControl = this.updateExceptionForm.get('internalNote');
        if (internalNoteControl) {
          internalNoteControl.setValue(exception.internalNote);
          internalNoteControl.updateValueAndValidity();
        } */

        // Force change detection
        this.cdr.detectChanges();
      }
    }, 500);
  }

  submitUpdateException() {
    if (this.updateExceptionForm.valid && this.selectedException && this.exportation) {
      const command = {
        exportationId: this.exportation.id,
        exportationExceptionId: this.selectedException.id,
        ...this.updateExceptionForm.value
      };

      this.exportationService.updateException(command, this.selectedFile).subscribe({
        next: () => {
          this.updateExceptionDialog = false;
          this.selectedFile = undefined;
          // Refresh exceptions list
          if (this.exportation) {
            this.exportationService.getExportationExceptions(this.exportation.id)
              .subscribe(exceptions => this.transactionExceptions = exceptions);
          }

          Swal.fire({
            title: 'Success',
            text: 'Exception updated successfully',
            icon: 'success'
          });
        },
        error: (error) => {
          console.log("🚀 submitUpdateException => error", error);
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to update exception',
            icon: 'error'
          });
        }
      });
    }
  }
  downloadAttachedEmail(exception: ExportationExceptionResponse) {
    if (exception.attachedEmail) {
      this.exportationService.getExceptionEmailAttachment(exception.exportationId, exception.id)
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

  exportationMessages: any[] = [];
  getExportationMessages(){
      if (!this.exportation?.id) return;

      this.exportationService.getExportationMessages(this.exportation.id).subscribe({
        next: (response) => {
          this.exportationMessages = response;
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error?.error?.detail || 'Failed to load exportation messages',
            icon: 'error'
          });
        }
      });
    }

     getExportationMessageType(status: ExportationMessageType): string {
       switch (status) {
         case ExportationMessageType.ExportationRelated:
           return 'Exportation';
         case ExportationMessageType.ExportationFileRelated:
           return 'Document';
         case ExportationMessageType.ProcessingDEPaymentRelated:
           return 'DE Payment';
         case ExportationMessageType.ExportationExceptionRelated:
           return 'Exception';
         case ExportationMessageType.ExportationSwiftFile:
           return 'Swift';
         case ExportationMessageType.ApurementRelated:
           return 'Apurement';
         case ExportationMessageType.IncomingRelated:
           return 'Incoming';
         case ExportationMessageType.IncomingRetrocessionRelated:
           return 'Incoming Retrocession';
         default:
           return 'Unknown';
       }
     }

    getExportationMessageTypeName(messageType: string) {
    //Document Status
    // Return document status based on transaction file status string
    switch (messageType) {
      //Transactions
      case 'ExportationDrafted':
        return 'Drafted';
      case 'ExportationInitiated':
        return 'Exportation Initiated';
      case 'ExportationCancelled':
        return 'Exportation Cancelled';
      case 'ExportationCompleted':
        return 'Exportation Completed';
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

      //incoming
      case 'Received':
        return 'Received';
      case 'Deleted':
        return 'Deleted';
        //De fees
      case 'PaymentNotProcessed':
        return 'Payment Not Processed';
      case 'PaymentBeingProcessed':
        return 'Payment Being Processed';
      case 'PaymentProcessed':
        return 'Payment Processed';
      case 'PaymentFailed':
        return 'Payment Failed';
      default:
        return 'Unknown';
    }

  }

  getExportationMessageTypeColor(messageType: string) {
    // Return severity color based on transaction file status string
    switch (messageType) {
      //Exportation
      case 'ExportationDrafted':
        return 'info';
      case 'ExportationInitiated':
        return 'info';
      case 'ExportationCancelled':
        return 'danger';
      case 'ExportationCompleted':
        return 'success';
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
      //DE Payement
      case 'PaymentBeingProcessed':
        return 'info';
      case 'PaymentNotProcessed':
        return 'warning';
      case 'PaymentProcessed':
        return 'success';
      case 'PaymentFailed':
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
      // incoming
      case 'Received':
        return 'success';
      case 'Deleted':
        return 'danger';

      default:
        return 'info';
    }
  }
}
