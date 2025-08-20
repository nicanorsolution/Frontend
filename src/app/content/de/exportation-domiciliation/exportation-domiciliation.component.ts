import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DEResponse, DEStatus } from '../models/de.models';
import { DEService } from '../services/de.services';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { UserRoleEnum, UserType } from 'src/app/helpers/UserRoleEnum';

@Component({
  selector: 'app-exportation-domiciliation',
  templateUrl: './exportation-domiciliation.component.html'
})
export class ExportationDomiciliationComponent implements OnInit {
  UserRoleEnum = UserRoleEnum;
  UserType = UserType;
  des: DEResponse[] = [];
  loading = false;
  totalRecords = 0;
  pageSize = 50;
  pageNumber = 1;
  expandedRows: { [key: string]: boolean } = {};

  @ViewChild('dialog_operation_swal')
  private dialogOperationSwal!: SwalComponent;

  searchForm!: FormGroup;

  constructor(
    private deService: DEService,
    private fb: FormBuilder
  ) {
    this.initializeSearchForm();
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
    return DEStatus[status];
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
}
