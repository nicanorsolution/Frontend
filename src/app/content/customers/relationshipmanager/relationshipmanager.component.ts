import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../services/customers.services';
import { RelationshipManagerResponse, RelationshipManagerStatus } from '../models/customer.models';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PaginatedList } from '../../../helpers/pagination';
import { UserRoleEnum, UserType } from 'src/app/helpers/UserRoleEnum';

@Component({
  selector: 'app-relationshipmanager',
  templateUrl: './relationshipmanager.component.html'
})
export class RelationshipmanagerComponent implements OnInit {
  UserRoleEnum = UserRoleEnum;
  UserType = UserType;
  managers: RelationshipManagerResponse[] = [];
  loading = false;
  managerDialog = false;
  createManagerForm!: FormGroup;
  isSubmitted = false;

  totalRows = 0;
  pageSize = 25;
  pageNumber = 1;
  expandedRows: { [key: string]: boolean } = {};
  searchText = '';
  @ViewChild('dialog_operation_swal')
  private dialogOperationSwal!: SwalComponent;

  editManagerDialog = false;
  selectedManager?: RelationshipManagerResponse;
  editManagerForm!: FormGroup;

  constructor(
    private customerService: CustomersService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.createManagerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.editManagerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.loadManagers();
  }

  searchManagers() {
    this.pageNumber = 1;
    this.loadManagers();
  }

  loadManagers() {
    this.loading = true;
    const query = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      name: this.searchText
    };

    this.customerService.getRelationshipManagers(query).subscribe({
      next: (response: PaginatedList<RelationshipManagerResponse>) => {
        this.managers = response.items;
        this.totalRows = response.totalCount;
        this.loading = false;
        console.log(response);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openAddManagerDialog() {
    this.managerDialog = true;
    this.createManagerForm.reset();
  }

  createManager() {
    if (this.createManagerForm.valid) {
          this.isSubmitted = true;
          const command = {
            name: this.createManagerForm.value.name,
            email: this.createManagerForm.value.email
          };

          this.customerService.createRelationshipManager(command).subscribe({
            next: () => {
              this.managerDialog = false;
              this.loadManagers();
              this.isSubmitted = false;
              this.dialogOperationSwal.update({
                title: 'Manager Created',
                text: 'Relationship Manager has been created successfully.',
                icon: 'success'

              });
              this.dialogOperationSwal.fire();
            },
            error: () => {
              this.isSubmitted = false;
            }
          });
    }
  }

  openEditManagerDialog(manager: RelationshipManagerResponse) {
    this.selectedManager = manager;
    this.editManagerDialog = true;
    this.editManagerForm.patchValue({
      name: manager.name,
      email: manager.email
    });
  }

  updateManager() {
    if (this.editManagerForm.valid && this.selectedManager) {
       this.isSubmitted = true;
          const command = {
            relationshipManagerId: this.selectedManager!.id,
            name: this.editManagerForm.value.name,
            email: this.editManagerForm.value.email
          };

          this.customerService.updateRelationshipManagerInfo(command).subscribe({
            next: () => {
              this.editManagerDialog = false;
              this.loadManagers();
              this.isSubmitted = false;
              this.dialogOperationSwal.update({
                title: 'Manager Updated',
                text: 'Relationship Manager has been updated successfully.',
                icon: 'success'
              });
              this.dialogOperationSwal.fire();
            },
            error: () => {
              this.isSubmitted = false;
            }
          });
    }
  }

  deleteManager(managerId: string) {

    this.dialogOperationSwal.update({
      title: 'Are you sure?',
      text: 'This action cannot be undone',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed'
    });

    this.dialogOperationSwal.fire().then((result) => {
      if (result.isConfirmed) {
        this.customerService.deleteRelationshipManager(managerId).subscribe({
          next: () => {
            this.loadManagers();
            this.dialogOperationSwal.update({
              title: 'Manager Deleted',
              text: 'Relationship Manager has been deleted successfully.',
              icon: 'success',
              showCancelButton: false,
              showConfirmButton : false,
              showCloseButton: true,
              closeButtonAriaLabel: 'Close'
            });
            this.dialogOperationSwal.fire();
          }
        });
      }
    });
  }

  activateManager(managerId: string) {
    this.dialogOperationSwal.fire().then((result) => {
      if (result.isConfirmed) {
        this.customerService.activateRelationshipManager(managerId).subscribe({
          next: () => {
            this.loadManagers();
          }
        });
      }
    });
  }

  suspendManager(managerId: string) {
    this.dialogOperationSwal.fire().then((result) => {
      if (result.isConfirmed) {
        this.customerService.suspendRelationshipManager(managerId).subscribe({
          next: () => {
            this.loadManagers();
          }
        });
      }
    });
  }

  onPageChange(event: any) {
    this.pageNumber = event.first / event.rows + 1;
    this.pageSize = event.rows;
    this.loadManagers();
  }

  getStatusString(status: RelationshipManagerStatus): string {
    return RelationshipManagerStatus[status];
  }

  colorStatus(status: RelationshipManagerStatus): string {
    switch (status) {
      case RelationshipManagerStatus.Active:
        return 'success';
      case RelationshipManagerStatus.Suspended:
        return 'warning';
      case RelationshipManagerStatus.Delete:
        return 'danger';
      default:
        return 'info';
    }
  }
}
