import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../services/customers.services';
import {
  CorporateResponse,
  CreateCorporateCommand,
  AddBankAccountCommand,
  AddCorporateContactCommand,
  Position,
  CustomerType,
  CustomerInfoResponse,
  RemoveCorporateContactCommand,
  CustomerAccountInfo,
  RelationshipManagerResponse,
  CorporateStatus,
  MiseEnDemeureStatus,
  ADNAReportStatus
} from '../models/customer.models';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PaginatedList } from '../../../helpers/pagination';
import { AutoCompleteOnSelectEvent } from 'primeng/autocomplete';
import { ApiErrorResponse } from '../../../helpers/response-error';
import Swal from 'sweetalert2';
import { CorporateOrIndividual } from '../../transactions/models/transactions.model';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-corporate',
  templateUrl: './corporate.component.html'
})
export class CorporateComponent implements OnInit, OnDestroy {
  corporates: CorporateResponse[] = [];
  loading = false;
  corporateDialog = false;
  createCorporateForm!: FormGroup;
  isSubmitted = false;

  
  totalRows = 0;
  pageSize = 2;
  pageNumber = 1;
  expandedRows: { [key: string]: boolean } = {};

  @ViewChild('dialog_operation_swal')
  private dialogOperationSwal!: SwalComponent;

  positionOptions = Object.values(Position)
    .map(value => ({ label: value, value: value }));

  addBankAccountDialog = false;
  addContactDialog = false;
  selectedCorporate?: CorporateResponse;
  createBankAccountForm!: FormGroup;
  createContactForm!: FormGroup;

  filteredCustomers: CustomerInfoResponse[] = [];
  filteredAccounts: CustomerAccountInfo[] = [];

  assignManagerDialog = false;
  assignManagerForm!: FormGroup;
  filteredManagers: RelationshipManagerResponse[] = [];

  private refreshSubscription?: Subscription;
  private readonly POLLING_INTERVAL = 5000; // 5 seconds

  searchForm!: FormGroup;

  constructor(
    private customerService: CustomersService,
    private fb: FormBuilder
  ) {
    this.initializeForms();
  }

  private initializeForms() {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });

    this.createCorporateForm = this.fb.group({
      corporateId: [''], // Add this new control
      name: ['', Validators.required],
      niu: ['', Validators.required],
      address: ['', Validators.required],
      registrationNumber: ['', Validators.required]
    });

    this.createBankAccountForm = this.fb.group({
      accountNumber: ['', Validators.required],
      accountName: ['', Validators.required],
      branch: ['', Validators.required]
    });

    this.createContactForm = this.fb.group({
      position: ['', Validators.required],
      contactName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: [''],
      comment: ['']
    });

    this.assignManagerForm = this.fb.group({
      relationshipManager: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCorporates();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  private stopPolling(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = undefined;
    }
  }

  private hasRunningReports(): boolean {
    return this.corporates.some(corporate => corporate.adnaReportStatus === ADNAReportStatus.Running);
  }

  private startAutoRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }

    this.refreshSubscription = interval(this.POLLING_INTERVAL).subscribe(() => {
      if (this.hasRunningReports()) {
        this.loadCorporates();
      } else {
        this.stopPolling();
      }
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

  searchCorporates(){
    const searchTerm = this.searchForm.get('searchTerm')?.value;
    this.loadCorporates(searchTerm);
  }
  
  loadCorporates(name?: string, niu?: string) {
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

    this.customerService.getCorporates(query).subscribe({
      next: (response: PaginatedList<CorporateResponse>) => {
        this.corporates = response.items;
        this.totalRows = response.totalCount;
        this.loading = false;
        
        // Start auto-refresh if there are running reports
        if (this.hasRunningReports() && !this.refreshSubscription) {
          this.startAutoRefresh();
        }
      },
      error: (error) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  openAddCorporateDialog() {
    this.corporateDialog = true;
    this.createCorporateForm.reset();
  }

  createCorporate() {
    if (this.createCorporateForm.valid) {
      this.isSubmitted = true;
      const formValue = this.createCorporateForm.value;
      const command: CreateCorporateCommand = {
        corporateId: formValue.corporateId?.clientId || '',
        name: formValue.name,
        niu: formValue.niu,
        address: formValue.address,
        registrationNumber: formValue.registrationNumber
      };
      this.customerService.createCorporate(command).subscribe({
        next: () => {
          this.corporateDialog = false;
          this.loadCorporates();
          this.isSubmitted = false;
        },
        error: (error) => {
          this.isSubmitted = false;
          this.handleError(error);
        }
      });
    }
  }

  // Update onPageChange method to handle pagination events from PrimeNG
  onPageChange(event: any) {
   
    this.pageNumber = event.first / event.rows + 1;
    this.pageSize = event.rows;
    console.log(event);

    const searchTerm = this.searchForm.get('searchTerm')?.value;
    if (searchTerm) {
      this.loadCorporates(searchTerm);
    } else {
      this.loadCorporates();
    }
  }

  openAddBankAccountDialog(corporate: CorporateResponse) {
    this.selectedCorporate = corporate;
    this.addBankAccountDialog = true;
    this.createBankAccountForm.reset();
  }

  openAddContactDialog(corporate: CorporateResponse) {
    this.selectedCorporate = corporate;
    this.addContactDialog = true;
    this.createContactForm.reset();
  }

  openAssignManagerDialog(corporate: CorporateResponse) {
    this.selectedCorporate = corporate;
    this.assignManagerDialog = true;
    this.assignManagerForm.reset();
  }

  addBankAccount() {
    if (this.createBankAccountForm.valid && this.selectedCorporate) {
      const command: AddBankAccountCommand = {
        accountNumber: this.createBankAccountForm.value.accountNumber.accountNumber,
        accountName: this.createBankAccountForm.value.accountName,
        branch: this.createBankAccountForm.value.branch,
        corporateId: this.selectedCorporate.id
      };
      this.customerService.addBankAccount(command).subscribe({
        next: () => {
          this.addBankAccountDialog = false;
          this.loadCorporates();
        },
        error: (error) => {

          console.log("🚀 => file: corporate.component.ts:189 => CorporateComponent => this.customerService.addBankAccount => error:", error?.error);


          this.handleError(error);
        }
      });
    }
  }

  addContact() {
    if (this.createContactForm.valid && this.selectedCorporate) {
      const command: AddCorporateContactCommand = {
        ...this.createContactForm.value,
        corporateId: this.selectedCorporate.id
      };

      this.customerService.addCorporateContact(command).subscribe({
        next: () => {
          this.addContactDialog = false;
          this.loadCorporates();
          this.selectedCorporate = undefined;
          this.dialogOperationSwal.fire(); // Show success message
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  assignManager() {
    if (this.assignManagerForm.valid && this.selectedCorporate) {
      const command = {
        corporateId: this.selectedCorporate.id,
        relationshipManagerId: this.assignManagerForm.value.relationshipManager.id
      };

      this.customerService.assignRelationshipManager(command).subscribe({
        next: () => {
          this.assignManagerDialog = false;
          this.loadCorporates();

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

  removeContact(corporateId: string, corporateContactId: string) {
    const command: RemoveCorporateContactCommand = {
      corporateId,
      corporateContactId
    };
    console.log(command);
    this.customerService.removeCorporateContact(command).subscribe({
      next: () => {
        this.loadCorporates();
        this.dialogOperationSwal.fire(); // Show success message
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  removeBankAccount(corporateId: string, accountNumber: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.removeBankAccount(corporateId, accountNumber).subscribe({
          next: () => {
            this.loadCorporates();
            this.dialogOperationSwal.fire();
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      }
    });
  }

  searchCustomer(event: { query: string }) {
    if (event.query) {
      this.customerService.getCustomerAccountInfo(event.query, CustomerType.Corporate)
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

  onCustomerSelect(event:AutoCompleteOnSelectEvent) {

  const customer = event.value as CustomerInfoResponse;

  if (customer) {
    if (customer) {
      this.createCorporateForm.patchValue({
        name: customer.name,
        niu: customer.niu,
        address: customer.address,
      });
    }
  }
}

  clearCustomerSelection() {
    this.createCorporateForm.patchValue({
      name: '',
      niu: '',
      address: '',
    });
  }

  searchAccount(event: { query: string }) {
    if (event.query) {
      this.customerService.getCustomerAccountByNumber(event.query, this.selectedCorporate?.id)
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

  searchManagers(event: { query: string }) {
    const query = {
      name: event.query,
      pageNumber: 1,
      pageSize: 10
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

  onAccountSelect(event: { value: CustomerAccountInfo }) {
    if (event.value) {
      this.createBankAccountForm.patchValue({
        accountName: event.value.accountName,
        branch: event.value.branchId
      });
    }
  }

  clearAccountSelection() {
    this.createBankAccountForm.patchValue({
      accountName: '',
      branch: ''
    });
  }
  corporateStatus = CorporateStatus;
  getStatusString(status: CorporateStatus): string {
    switch (status) {
      case CorporateStatus.Active:
        return 'Active';
      case CorporateStatus.Suspended:
        return 'Suspended';
      case CorporateStatus.Delete:
        return 'Deleted';
      default:
        return 'Unknown';
    }
  }

  colorStatus(status: CorporateStatus): string {
    switch (status) {
      case CorporateStatus.Active:
        return 'success';
      case CorporateStatus.Suspended:
        return 'danger';
      case CorporateStatus.Delete:
        return 'warning';
      default:
        return 'secondary';
    }
  }

  //miseEnDemeureStatus = MiseEnDemeureStatus;
  getMiseEndemeureStatusString(status: MiseEnDemeureStatus): string {
    switch (status) {
      case MiseEnDemeureStatus.No:
        return 'No';
      case MiseEnDemeureStatus.Yes:
        return 'Yes';
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

  requestADNA(corporate: CorporateResponse) {
    this.customerService.requestCorporateAnda(corporate.id).subscribe({
      next: () => {
        this.loadCorporates();
        this.dialogOperationSwal.update({
          
          title: 'Request Successful',
          text: 'The ADNA request has been sent successfully.'
        })
        this.dialogOperationSwal.fire();
       // this.startAutoRefresh(); // Use startAutoRefresh instead of startPolling
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  confirmDeleteCorporate(corporate: CorporateResponse) {
    this.dialogOperationSwal.update({
      title: 'Are you sure?',
      text: `This will delete corporate ${corporate.name}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    });
    
    this.dialogOperationSwal.fire().then((result) => {
      if (result.isConfirmed) {
        this.deleteCorporate(corporate.id);
      }
    });
  }
  
  deleteCorporate(corporateId: string) {
    this.customerService.deleteCorporate(corporateId).subscribe({
      next: () => {
        this.loadCorporates();
        this.dialogOperationSwal.update({
          title: 'Success',
          text: 'Corporate deleted successfully',
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

  ADNAReportStatus = ADNAReportStatus;
  downloadADNA(corporate: CorporateResponse) {

    this.customerService.getCustomerAndaAttestation(CorporateOrIndividual.Corporate,corporate.id).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${corporate.name}-anda.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.handleError(error);
      }
    });

  }
}
