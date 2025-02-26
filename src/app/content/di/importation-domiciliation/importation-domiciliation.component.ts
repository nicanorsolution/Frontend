import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DI, DIStatus, UpdateGoodsDescriptionCommand, DIAttestationGenerationResponse, TypeAttestation, DIAttestationGenerationStatus, DIImputationResponse, ImputationStatus } from '../models/di.models';
import { DIService } from '../services/di.services';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-importation-domiciliation',
  templateUrl: './importation-domiciliation.component.html'
})
export class ImportationDomiciliationComponent implements OnInit {
  dis: DI[] = [];
  loading = false;
  totalRows = 0;
  pageSize = 10;
  pageNumber = 1;
  expandedRows: { [key: string]: boolean } = {};

  @ViewChild('dialog_operation_swal')
  private dialogOperationSwal!: SwalComponent;

  updateDescriptionDialog = false;
  selectedDI?: DI;
  updateDescriptionForm!: FormGroup;
  isSubmitted = false;
  attestationsDialog = false;
  attestations: DIAttestationGenerationResponse[] = [];

  imputationsDialog = false;
  imputations: DIImputationResponse[] = [];

  constructor(
    private diService: DIService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.loadDIs();
  }

  private initializeForm() {
    this.updateDescriptionForm = this.fb.group({
      goodsDescription: [''],
      goodQuantity: [null],
      goodsUnit: [''],
      valeurTotalInDevise: [null],
      billReference: [''],
      billExpiringDate: [null]
    });
  }

  loadDIs() {
    this.loading = true;
    this.diService.getDIs(this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        this.dis = response.items;
        this.totalRows = response.totalCount;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onPageChange(page: number) {
    this.pageNumber = page;
    this.loadDIs();
  }

  getDIStatusString(status: DIStatus): string {
    return DIStatus[status];
  }

  colorStatus(status: DIStatus): string {
    switch (status) {
      case DIStatus.NotUsed:
        return 'info';
      case DIStatus.PartiallyUsed:
        return 'warning';
      case DIStatus.CompletelyUsed:
        return 'success';
      default:
        return 'info';
    }
  }

  handleFileInput(event: any) {
    const file = event.files[0];
    if (file) {
      this.diService.readDIImported(file).subscribe({
        next: () => {
          this.loadDIs();
          this.dialogOperationSwal.fire();
        }
      });
    }
  }

  requestDIAttestation(diId: string) {
    this.diService.requestDIAttestation(diId).subscribe({
      next: () => {
        this.loadDIs();
        this.dialogOperationSwal.fire();
      },
      error: () => {
        this.dialogOperationSwal.fire();
      }
    });
  }

  viewDIAttestations(diId: string) {
    this.attestationsDialog = true;
    this.diService.getDIAttestations(diId).subscribe({
      next: (response) => {
        this.attestations = response;
      }
    });
  }

  viewImputations(diId: string) {
    this.imputationsDialog = true;
    this.diService.getDIImputations(diId).subscribe({
      next: (response) => {
        this.imputations = response;
      }
    });
  }

  getAttestationTypeString(type: TypeAttestation): string {
    return TypeAttestation[type];
  }

  getAttestationStatusString(status: DIAttestationGenerationStatus): string {
    return DIAttestationGenerationStatus[status];
  }

  getImputationStatusString(status: ImputationStatus): string {
    return ImputationStatus[status];
  }

  downloadAttestation(attestation: DIAttestationGenerationResponse) {

    this.diService.downloadDIAttestation(attestation.diId, attestation.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = attestation.referenceLetter + '_attestation.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });

  }

  openUpdateDescriptionDialog(di: DI) {
    this.selectedDI = di;
    this.updateDescriptionDialog = true;
    this.updateDescriptionForm.patchValue({
      goodsDescription: di.goodsDescription,
      goodQuantity: di.goodQuantity,
      goodsUnit: di.goodsUnit,
      valeurTotalInDevise: di.valeurTotalInDevise,
      billReference: di.billReference,
      billExpiringDate: di.billExpiringDate
    });
  }

  updateDescription() {
    if (this.updateDescriptionForm.valid && this.selectedDI) {
      this.isSubmitted = true;
      const command: UpdateGoodsDescriptionCommand = {
        dIId: this.selectedDI.id,
        ...this.updateDescriptionForm.value
      };

      this.diService.updateGoodsDescription(command).subscribe({
        next: () => {
          this.updateDescriptionDialog = false;
          this.loadDIs();
          this.isSubmitted = false;
          this.dialogOperationSwal.fire();
        },
        error: () => {
          this.isSubmitted = false;
        }
      });
    }
  }
}
