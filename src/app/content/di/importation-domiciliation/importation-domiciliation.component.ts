import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DI, DIStatus, UpdateGoodsDescriptionCommand, DIAttestationGenerationResponse, TypeAttestation, DIAttestationGenerationStatus, DIImputationResponse, ImputationStatus, DIGoodsUnit } from '../models/di.models';
import { DIService } from '../services/di.services';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { UserRoleEnum, UserType } from 'src/app/helpers/UserRoleEnum';

@Component({
  selector: 'app-importation-domiciliation',
  templateUrl: './importation-domiciliation.component.html'
})
export class ImportationDomiciliationComponent implements OnInit {
  UserRoleEnum = UserRoleEnum;
  UserType = UserType;
  dis: DI[] = [];
  loading = false;
  totalRecords = 0;
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

  searchForm!: FormGroup;

  goodUnits: DIGoodsUnit[] = [];

  constructor(
    private diService: DIService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
    this.initializeSearchForm();
  }

  ngOnInit(): void {
    this.loadGoodUnits();
  }

  private loadGoodUnits() {
    this.diService.getDiGoodUnits().subscribe({
      next: (units) => {
        this.goodUnits = units;
      }
    });
  }

  private initializeSearchForm() {
    this.searchForm = this.fb.group({
      referenceDi: [''],
      clientName: [''],
      sgsReference: [''],
      startDate: [null],
      endDate: [null]
    });
  }

  private initializeForm() {
    this.updateDescriptionForm = this.fb.group({
      amountInCurrency : ['', Validators.required],
      currency : [''],
      goodsDescription: [''],
      goodQuantity: [null],
      goodsUnit: [null], // Changed to null to work better with dropdown
      valeurTotalInDevise: [null],
      billReference: [''],
      billExpiringDate: [null]
    });
  }

  loadDIs() {
    this.loading = true;
    const searchCriteria = this.searchForm.value;

    console.log(searchCriteria);

    this.diService.getDIs(
      this.pageNumber,
      this.pageSize,
      searchCriteria.referenceDi,
      searchCriteria.clientName,
      searchCriteria.sgsReference,
      searchCriteria.startDate,
      searchCriteria.endDate
    ).subscribe({
      next: (response) => {
        this.dis = response.items;
        this.totalRecords = response.totalCount;
        this.loading = false;
        console.log(response);
        console.log(this.totalRecords);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  resetSearch() {
    this.searchForm.reset();
    this.pageNumber = 1; // Reset to first page when searching
    //this.loadDIs();
  }

  onSearch() {
    this.pageNumber = 1; // Reset to first page when searching
    this.loadDIs();
  }

  onPageChange(event: any) {
    this.pageNumber = event.first / event.rows + 1;
    this.pageSize = event.rows;

    console.log(event);

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
      amountInCurrency: di.amountInCurrency,
      currency: di.currency,
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
