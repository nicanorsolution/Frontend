import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DEResponse, DEStatus, UpdateDEComplementaryInfoCommand, ExportationType } from '../models/de.models';
import { DEService } from '../services/de.services';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { UserRoleEnum, UserType } from 'src/app/helpers/UserRoleEnum';

@Component({
  selector: 'app-exportation-domiciliation',
  templateUrl: './exportation-domiciliation.component.html',
  styleUrls: ['./exportation-domiciliation.component.scss']
})
export class ExportationDomiciliationComponent implements OnInit {
  UserRoleEnum = UserRoleEnum;
  UserType = UserType;
  ExportationType = ExportationType;
  des: DEResponse[] = [];
  loading = false;
  totalRecords = 0;
  pageSize = 50;
  pageNumber = 1;
  expandedRows: { [key: string]: boolean } = {};

  // Dialog properties
  editComplementaryInfoDialog = false;
  selectedDE: DEResponse | null = null;
  editComplementaryInfoForm!: FormGroup;
  isSubmitting = false;

  exportationTypeOptions = [
    { label: 'Bien', value: ExportationType.Bien },
    { label: 'Service', value: ExportationType.Service }
  ];

  @ViewChild('dialog_operation_swal')
  private readonly dialogOperationSwal!: SwalComponent;

  searchForm!: FormGroup;

  constructor(
    private readonly deService: DEService,
    private readonly fb: FormBuilder
  ) {
    this.initializeSearchForm();
    this.initializeEditComplementaryInfoForm();
  }

  ngOnInit(): void {
    this.loadDEs();
  }

  private initializeSearchForm() {
    this.searchForm = this.fb.group({
      eForceReference: [''],
      clientName: [''],
      domiciliationReference: [''],
      startDate: [null],
      endDate: [null]
    });
  }

  loadDEs() {
    this.loading = true;
    const searchCriteria = this.searchForm.value;

    this.deService.getDEs(
      this.pageNumber,
      this.pageSize,
      searchCriteria.eForceReference,
      searchCriteria.clientName,
      searchCriteria.domiciliationReference,
      searchCriteria.startDate,
      searchCriteria.endDate
    ).subscribe({
      next: (response) => {
        console.log('DEService: DEs loaded:', response);
        this.des = response.items;
        this.totalRecords = response.totalCount;
        this.loading = false;

        console.log('DEs loaded:', this.des);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  resetSearch() {
    this.searchForm.reset();
    this.pageNumber = 1;
  }

  onSearch() {
    this.pageNumber = 1;
    this.loadDEs();
  }

  onPageChange(event: any) {
    this.pageNumber = event.first / event.rows + 1;
    this.pageSize = event.rows;
    this.loadDEs();
  }

  getDEStatusString(status: DEStatus): string {
    switch (status) {
      case DEStatus.NotUsedForCreatingExport:
        return 'Not Used';
      case DEStatus.UsedToCreateExport:
        return 'Used';
      default:
        return 'info';
    }
  }

  colorStatus(status: DEStatus): string {
    switch (status) {
      case DEStatus.NotUsedForCreatingExport:
        return 'danger';
      case DEStatus.UsedToCreateExport:
        return 'success';
      default:
        return 'info';
    }
  }

  handleFileInput(event: any) {
    const file = event.files[0];
    if (file) {
      this.deService.readDEImported(file).subscribe({
        next: () => {
          this.loadDEs();
          this.dialogOperationSwal.fire();
        },
        error: (error) => {
          console.error('Error reading file:', error);
          this.dialogOperationSwal.update({
            icon: 'error',
            title: `${error?.error?.title}`,
            text:  `${error?.error?.status} : ${error?.error?.detail}`,
          });
          this.dialogOperationSwal.fire();
        }
      });
    }
  }

  deleteDE(de: DEResponse) {
    this.deService.deleteDE(de.eForceReference).subscribe({
      next: () => {
        this.loadDEs();
        this.dialogOperationSwal.fire();
      },
      error: (error) => {
        console.error('Error deleting DE:', error);
        this.dialogOperationSwal.update({
          icon: 'error',
          title: `${error?.error?.title}`,
          text:  `${error?.error?.status} : ${error?.error?.detail}`,
        });
        this.dialogOperationSwal.fire();
      }
    });
  }

  private initializeEditComplementaryInfoForm() {
    this.editComplementaryInfoForm = this.fb.group({
      bankDEDomiciliationDate: [null, Validators.required],
      domiciliationValidityPeriodInDays: [30, [Validators.required, Validators.min(1), Validators.max(365)]],
      deEmissionDate: [null, Validators.required],
      deValidityPeriodInDays: [30, [Validators.required, Validators.min(1), Validators.max(365)]],
      exportationType: [ExportationType.Bien, Validators.required],
      goodOrServiceNature : [null, Validators.required],
    });
  }

  openEditComplementaryInfoDialog(de: DEResponse) {
    this.selectedDE = de;
    this.editComplementaryInfoForm.patchValue({
      bankDEDomiciliationDate: new Date(),
      deValidityPeriodInDays: 180,
      domiciliationValidityPeriodInDays : 150,
      exportationType: ExportationType.Bien
    });
    this.editComplementaryInfoDialog = true;
  }

  closeEditComplementaryInfoDialog() {
    this.editComplementaryInfoDialog = false;
    this.selectedDE = null;
    this.editComplementaryInfoForm.reset();
    this.isSubmitting = false;
  }

  submitEditComplementaryInfo() {
    if (this.editComplementaryInfoForm.valid && this.selectedDE) {
      this.isSubmitting = true;

      const command: UpdateDEComplementaryInfoCommand = {
        eForceReference: this.selectedDE.eForceReference,
        bankDEDomiciliationDate: this.editComplementaryInfoForm.value.bankDEDomiciliationDate,
        domiciliationValidityPeriodInDays : this.editComplementaryInfoForm.value.domiciliationValidityPeriodInDays,
        deEmissionDate: this.editComplementaryInfoForm.value.deEmissionDate,
        deValidityPeriodInDays: this.editComplementaryInfoForm.value.deValidityPeriodInDays,
        exportationType: this.editComplementaryInfoForm.value.exportationType,
        goodOrServiceNature : this.editComplementaryInfoForm.value.goodOrServiceNature
      };

      this.deService.updateDEComplementaryInfo(command).subscribe({
        next: () => {
          this.loadDEs();
          this.closeEditComplementaryInfoDialog();
          this.dialogOperationSwal.update({
            icon: 'success',
            title: 'Success',
            text: 'Complementary information updated successfully'
          });
          this.dialogOperationSwal.fire();
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error updating complementary info:', error);
          this.dialogOperationSwal.update({
            icon: 'error',
            title: `${error?.error?.title || 'Error'}`,
            text: `${error?.error?.status} : ${error?.error?.detail || 'Failed to update complementary information'}`,
          });
          this.dialogOperationSwal.fire();
        }
      });
    }
  }

  getExportationTypeString(exportationType: ExportationType): string {
    switch (exportationType) {
      case ExportationType.Bien:
        return 'Bien';
      case ExportationType.Service:
        return 'Service';
      default:
        return 'Unknown';
    }
  }
}
