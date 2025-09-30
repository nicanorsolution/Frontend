import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../services/customers.services';
import { IndividualResponse, CustomerType, CustomerInfoResponse, CreateIndividualCommand, CustomerAccountInfo, IndividualStatus, ADNAReportStatus, MiseEnDemeureStatus, RelationshipManagerResponse, RelationshipManagerStatus, UpdateIndividualInfoCommand } from '../models/customer.models';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PaginatedList } from '../../../helpers/pagination';
import { AutoCompleteOnSelectEvent } from 'primeng/autocomplete';
import Swal from 'sweetalert2';
import { CorporateOrIndividual } from '../../transactions/models/transactions.model';
import { UserType } from '../../users/user.models';
import { UserRoleEnum } from 'src/app/helpers/UserRoleEnum';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html'
})
export class IndividualComponent implements OnInit {
  UserRoleEnum = UserRoleEnum;
  UserType = UserType;
  individuals: IndividualResponse[] = [];
  loading = false;
  individualDialog = false;
  createIndividualForm!: FormGroup;
  isSubmitted = false;
  assignManagerDialog = false;
  assignManagerForm!: FormGroup;
  filteredManagers: RelationshipManagerResponse[] = [];

  selectedIndividual!: IndividualResponse;
  totalRows = 0;
  pageSize = 2;
  pageNumber = 1;
  expandedRows: { [key: string]: boolean } = {};

  @ViewChild('dialog_operation_swal')
  private dialogOperationSwal!: SwalComponent;

  filteredCustomers: CustomerInfoResponse[] = [];
  canSearchAccount = false;
  filteredAccounts: CustomerAccountInfo[] = [];

  individualStatus = IndividualStatus;
  searchForm!: FormGroup;

  constructor(
    private customerService: CustomersService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
    this.createIndividualForm = this.fb.group({
      individualId: ['', Validators.required],
      name: ['', Validators.required],
      niu: ['', Validators.required],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      accountNumber: ['', Validators.required],
      branch: ['', Validators.required]
    });
    this.assignManagerForm = this.fb.group({
      relationshipManager: ['', Validators.required]
    });
  }

  private handleError(error: any) {
    if (error?.error?.detail) {
      Swal.fire({
        title: 'Error',
        text: `${error?.error?.status}: ${error?.error?.detail}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'An unexpected error occurred',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  ngOnInit() {
    this.loadIndividuals();
  }

  searchIndividuals() {
    const searchTerm = this.searchForm.get('searchTerm')?.value;
    this.loadIndividuals(searchTerm);
  }

  loadIndividuals(name?: string, niu?: string) {
    if (name || niu) {
      this.pageNumber = 1; // Reset to first page when searching
    }

    this.loading = true;
    const query = {
      name,
      niu,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.customerService.getIndividuals(query).subscribe({
      next: (response: PaginatedList<IndividualResponse>) => {
        this.individuals = response.items;
        this.totalRows = response.totalCount;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  openAddIndividualDialog() {
    this.individualDialog = true;
    this.createIndividualForm.reset();
  }

 /*  openEditIndividualDialog(individual: IndividualResponse) {

    this.individualDialog = true;
    this.isSubmitted = false;
    this.createIndividualForm.patchValue({
      individualId: individual.id,
      name: individual.name,
      niu: individual.niu,
      address: individual.address,
      email: individual.email,
      phone: individual.phone,
      accountNumber: individual.bankAccount?.accountNumber,
      branch: individual.bankAccount?.branchCode
    });
  } */

  suspendIndividual(id: string) {
    this.customerService.suspendIndividual(id).subscribe({
      next: () => {
        this.loadIndividuals();
        this.dialogOperationSwal.fire();
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  activateIndividual(id: string) {
    this.customerService.activateIndividual(id).subscribe({
      next: () => {
        this.loadIndividuals();
        this.dialogOperationSwal.fire();
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  confirmDeleteIndividual(individual: IndividualResponse) {
    this.dialogOperationSwal.update({
      title: 'Are you sure?',
      text: `This will delete individual ${individual.name}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    });

    this.dialogOperationSwal.fire().then((result) => {
      if (result.isConfirmed) {
        this.deleteIndividual(individual.id);
      }
    });
  }

  deleteIndividual(individualId: string) {
    this.customerService.deleteIndividual(individualId).subscribe({
      next: () => {
        this.loadIndividuals();
        this.dialogOperationSwal.update({
          title: 'Success',
          text: 'Individual deleted successfully',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'OK'
        });
        this.dialogOperationSwal.fire();
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  onPageChange(event: any) {
    this.pageNumber = event.first / event.rows + 1;
    this.pageSize = event.rows;

    const searchTerm = this.searchForm.get('searchTerm')?.value;
    if (searchTerm) {
      this.loadIndividuals(searchTerm);
    } else {
      this.loadIndividuals();
    }
  }

  searchCustomer(event: { query: string }) {
    if (event.query) {
      this.customerService.getCustomerAccountInfo(event.query, CustomerType.Individual)
        .subscribe({
          next: (response) => {
            if (response) {
              this.filteredCustomers = [response];
            } else {
              this.filteredCustomers = [];
            }
          },
          error: (error) => {
            this.filteredCustomers = [];
            this.handleError(error);
          }
        });
    }
  }

  onCustomerSelect(event: AutoCompleteOnSelectEvent) {
    const customer = event.value as CustomerInfoResponse;
    if (customer) {
      this.createIndividualForm.patchValue({
        name: customer.name,
        niu: customer.niu,
        address: customer.address,
        email: customer.email,
        phone: customer.phone,
        individualId: customer.clientId,
      });
      this.canSearchAccount = true; // Enable account search after customer selection
    }
  }

  searchAccount(event: { query: string }) {
    if (event.query && this.canSearchAccount) {
      this.customerService.getCustomerAccountByNumber(event.query, this.selectedIndividual?.id)
        .subscribe({
          next: (response) => {
            if (response) {
              this.filteredAccounts = [response];
            } else {
              this.filteredAccounts = [];
            }
          },
          error: (error) => {
            this.filteredAccounts = [];
            this.handleError(error);
          }
        });
    }
  }

  onAccountSelect(event: { value: CustomerAccountInfo }) {
    if (event.value) {
      this.createIndividualForm.patchValue({
        accountNumber: event.value.accountNumber,
        branch: event.value.branchId
      });
    }
  }

  clearCustomerSelection() {
    this.createIndividualForm.patchValue({
      name: '',
      niu: '',
      address: '',
      accountNumber: '',
      branch: ''
    });
    this.canSearchAccount = false;
  }

  clearAccountSelection() {
    this.createIndividualForm.patchValue({
      accountNumber: '',
      branch: ''
    });
  }

  createIndividual() {
    if (this.createIndividualForm.valid) {
      this.isSubmitted = true;
      const formValue = this.createIndividualForm.value;

        const command: CreateIndividualCommand = {
          individualId: formValue.individualId || '',
          name: formValue.name,
          niu: formValue.niu,
          address: formValue.address,
          email: formValue.email,
          phone: formValue.phone,
          accountNumber: formValue.accountNumber.accountNumber || formValue.accountNumber,
          branch: formValue.branch
        };

        console.log('Creating individual with command:', command);

        this.customerService.createIndividual(command).subscribe({
          next: () => {
            this.individualDialog = false;
            this.loadIndividuals();
            this.isSubmitted = false;
            this.dialogOperationSwal.fire();
          },
          error: (error) => {
            this.isSubmitted = false;
            this.handleError(error);
          }
        });
      }

  }

  updateIndividual(individual : IndividualResponse) {

    this.customerService.updateIndividualInfo({individualId : individual.id} as UpdateIndividualInfoCommand).subscribe({
      next: () => {
        this.loadIndividuals();
        this.dialogOperationSwal.update({
          title: 'Success',
          text: 'Individual updated successfully!',
          icon: 'success'
        });
        this.dialogOperationSwal.fire();
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

    getStatusString(status: IndividualStatus): string {
      switch (status) {
        case IndividualStatus.Active:
          return 'Active';
        case IndividualStatus.Suspended:
          return 'Suspended';
        case IndividualStatus.Delete:
          return 'Deleted';
        default:
          return 'Unknown';
      }
    }

    colorStatus(status: IndividualStatus): string {
      switch (status) {
        case IndividualStatus.Active:
          return 'success';
        case IndividualStatus.Suspended:
          return 'danger';
        case IndividualStatus.Delete:
          return 'warning';
        default:
          return 'secondary';
      }
    }
      getMiseEndemeureStatusString(status: MiseEnDemeureStatus): string {
        switch (status) {
          case MiseEnDemeureStatus.No:
            return 'No';
          case MiseEnDemeureStatus.Yes:
            return 'Yes';
          default:
            return 'Unknown';
        }
      }
      colorMiseEnDemeureStatus(status: MiseEnDemeureStatus): string {
        switch (status) {
          case MiseEnDemeureStatus.No:
            return 'success';
          case MiseEnDemeureStatus.Yes:
            return 'danger';
        }
      }

      getadnaReportStatusString(status: ADNAReportStatus): string {
        switch (status) {
          case ADNAReportStatus.Available:
            return 'Available';
          case ADNAReportStatus.NotAvalaible:
            return 'Not Available';
          case ADNAReportStatus.Running:
            return 'Running';
          default:
            return 'Unknown';
        }
      }

      coloradnaReportStatus(status: ADNAReportStatus): string {
        switch (status) {
          case ADNAReportStatus.Available:
            return 'success';
          case ADNAReportStatus.NotAvalaible:
            return 'danger';
          case ADNAReportStatus.Running:
            return 'warning';
          default:
            return 'secondary';
        }
      }

  requestADNA(corporate: IndividualResponse) {
        this.customerService.requestIndividualAnda(corporate.id).subscribe({
          next: () => {
            this.loadIndividuals();
            this.dialogOperationSwal.fire();
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      }

      ADNAReportStatus = ADNAReportStatus;
      downloadADNA(individuel: IndividualResponse) {

        this.customerService.getCustomerAndaAttestation(CorporateOrIndividual.Individual,individuel.id).subscribe({
          next: (response) => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${individuel.name}-anda.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: (error) => {
            this.handleError(error);
          }
        });

      }

      openAssignManagerDialog(individual: IndividualResponse) {
        this.selectedIndividual = individual;
        this.assignManagerDialog = true;
        this.assignManagerForm.reset();
      }

      searchManagers(event: { query: string }) {
        const query = {
          name: event.query,
          relationshipManagerStatus: RelationshipManagerStatus.Active,
          pageNumber: 1,
          pageSize: 15
        };

        this.customerService.getRelationshipManagers(query).subscribe({
          next: (response) => {
            this.filteredManagers = response.items;
          },
          error: (error) => {
            this.filteredManagers = [];
            this.handleError(error);
          }
        });
      }

      assignManager() {
        if (this.assignManagerForm.valid && this.selectedIndividual) {
          const relationshipManager = this.assignManagerForm.value.relationshipManager;

          this.customerService.assignIndividualManager(
            this.selectedIndividual.id,
            relationshipManager.id
          ).subscribe({
            next: () => {
              this.assignManagerDialog = false;
              this.loadIndividuals();
              this.dialogOperationSwal.update({
                title: 'Success',
                text: 'Relationship Manager assigned successfully!',
                icon: 'success'
              });
              this.dialogOperationSwal.fire();
            },
            error: (error) => {
              this.handleError(error);
            }
          });
        }
      }
}
