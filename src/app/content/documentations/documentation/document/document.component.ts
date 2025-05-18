import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentationService } from '../../services/documentation.service';
import { DocumentResponse, DocumentStatus, DocumentSubmissionOption,  DocumentControl, DocumentControlType, CreateDocumentCommand } from '../../models/document.models';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html'
})
export class DocumentComponent implements OnInit {
  readonly DocumentStatus = DocumentStatus;
  
  documents: DocumentResponse[] = [];
  documentDialog = false;
  createDocumentForm: FormGroup;
  isSubmitted = false;

  totalRows = 0;
  expandedRows: { [key: string]: boolean } = {};

  @ViewChild('dialog_operation_swal')
  private dialogOperationSwal!: SwalComponent;

  submissionOptions = Object.values(DocumentSubmissionOption)
    .filter(value => typeof value === 'number')
    .map(value => ({ label: DocumentSubmissionOption[value as number], value: value }));


  documentControlsDialog = false;
  selectedDocumentControls: DocumentControl[] = [];

  addControlDialog = false;
  selectedDocument?: DocumentResponse;
  createControlForm: FormGroup;

  controlTypeOptions = Object.values(DocumentControlType)
    .filter(value => typeof value === 'number')
    .map(value => ({ label: DocumentControlType[value as number], value: value }));

  constructor(
    private documentationService: DocumentationService,
    private fb: FormBuilder
  ) {
    this.createDocumentForm = this.fb.group({
      documentNameFr: ['', Validators.required],
      documentNameEn: ['', Validators.required],
      documentSubmissionOption: ['', Validators.required],
      documentOriginalRequired: [false]
    });

    this.createControlForm = this.fb.group({
      documentControlName: ['', Validators.required],
      documentControlDetail: ['', Validators.required],
      documentControlType: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadDocuments();
    this.expandedRows = {};
  }

  loadDocuments() {
    this.documentationService.getDocuments().subscribe(data => {
      this.documents = [...data]; // Create a new array reference
      this.totalRows = data.length;
    });
  }

  openAddDocumentDialog() {
    this.documentDialog = true;
    this.createDocumentForm.reset();
  }

  createDocument() {
    if (this.createDocumentForm.valid) {
      this.isSubmitted = true;
      const command = this.createDocumentForm.value as CreateDocumentCommand;
      
      command.documentOriginalRequired = false; // finally i did need

      this.documentationService.createDocument(command).subscribe({
        next: () => {
          this.isSubmitted = false;
          this.documentDialog = false;
          this.createDocumentForm.reset();
          this.loadDocuments();
        },
        error: (err) => {
          this.isSubmitted = false;
          console.error('Error creating document:', err);
        }
      });
    }
  }

  deleteDocument(documentId: string) {
    this.dialogOperationSwal.fire().then((result) => {
      if (result.isConfirmed) {
        this.documentationService.deleteDocument(documentId).subscribe({
          next: () => {
            this.loadDocuments();
          },
          error: (err) => {
            console.error('Error deleting document:', err);
          }
        });
      }
    });
  }

  statusOfDocumentBeingControls: DocumentStatus = DocumentStatus.Active; // for initialization purpose only

  openDocumentControlsDialog(document: DocumentResponse) {
    console.log(document);
    this.selectedDocument = document;  
    this.selectedDocumentControls = document.documentControls;
    this.statusOfDocumentBeingControls = document.documentStatus;
    this.documentControlsDialog = true;
  }

  openAddControlDialog(document: DocumentResponse) {
    this.selectedDocument = document;
    this.addControlDialog = true;
    this.createControlForm.reset();
  }

  addDocumentControl() {
    if (this.createControlForm.valid && this.selectedDocument) {
      const control = this.createControlForm.value;
      this.documentationService.addDocumentControl(this.selectedDocument.documentId, control)
        .subscribe({
          next: () => {
            this.addControlDialog = false;
            this.loadDocuments(); // Refresh the list
          },
          error: (err) => {
            this.dialogOperationSwal.update({
              icon: 'error',
              title: 'Error',
              text: err?.error?.detail
            });
            this.dialogOperationSwal.fire();
            console.error('Error adding control:', err);
          }
        });
    }
  }

  removeDocumentControl(documentId: string, controlId: string) {
    this.dialogOperationSwal.fire().then((result) => {
      if (result.isConfirmed) {
        this.documentationService.removeDocumentControl(documentId, controlId)
          .subscribe({
            next: () => {
              this.loadDocuments(); // Refresh the list
              this.documentControlsDialog = false
            },
            error: (err) => {
              console.error('Error removing control:', err);
            }
          });
      }
    });
  }

  getDocumentControlTypeString(type: DocumentControlType): string {
    return DocumentControlType[type];
  }

  getControlTypeSeverity(type: DocumentControlType): string {
    switch (type) {
      case DocumentControlType.Mandatory:
        return 'danger';
      case DocumentControlType.Depend:
        return 'warning';
      case DocumentControlType.Optional:
        return 'success';
      default:
        return 'info';
    }
  }

  colorStatus(status: DocumentStatus): string {
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
  getStatusString(status: DocumentStatus): string {
    return DocumentStatus[status];
  }

  getSubmissionOptionString(option: DocumentSubmissionOption): string {
    switch(option)
    {
      case DocumentSubmissionOption.SubmissionAfterProcessing:
        return 'Submission After Processing';
      case DocumentSubmissionOption.SubmissionBeforeProcessing:
        return 'Submission Before Processing';
      case DocumentSubmissionOption.SubmissionForPartialApurement:
        return 'Submission For Partial Apurement';
      case DocumentSubmissionOption.SubmissionForFailureToApurement:
        return 'Submission For Failure To Apurement';   
      case DocumentSubmissionOption.DoNotMatters:
        return 'Do not matter';   
    }
  }


}
