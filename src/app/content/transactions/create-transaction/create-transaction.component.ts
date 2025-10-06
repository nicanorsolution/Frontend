import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../services/transctions.service';
import { CorporateOrIndividual } from '../models/transactions.model';
import { CustomersService } from '../../customers/services/customers.services';
import { CorporateResponse, IndividualResponse, CustomerType, CorporateStatus, IndividualStatus } from '../../customers/models/customer.models';
import Swal from 'sweetalert2';
import { DocumentationService } from '../../documentations/services/documentation.service';
import { TransactionTypeResponse, TransactionTypeStatus } from '../../documentations/models/transaction-type.models';
import { DocumentResponse } from '../../documentations/models/document.models';
import { SwiftCodeService } from '../../transafer-rates/services/swiftcode.services';
import { AuthService } from '../../users/auth.service';
import { UserType } from '../../users/user.models';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html'
})
export class CreateTransactionComponent implements OnInit {
  createTransactionForm!: FormGroup;
  isSubmitting = false;
  corporateOrIndividualOptions = [
    { label: 'Corporate', value: CorporateOrIndividual.Corporate },
    { label: 'Individual', value: CorporateOrIndividual.Individual }
  ];
  selectCustomerDialog = false;
  searchCustomerForm!: FormGroup;
  filteredCustomers: any[] = [];
  selectedCustomer: any;
  customerAccounts: any[] = [];
  isSearching = false;
  transactionTypes: TransactionTypeResponse[] = [];
  viewDocumentsDialog = false;
  selectedTransactionType?: TransactionTypeResponse;
  transactionDocuments: DocumentResponse[] = [];
  currencies: string[] = [];
  filteredSwiftCodes: any[] = [];
  isSearchingSwift = false;

  userType: UserType | null = null;
  UserTypeEnum = UserType;
  userEntityId: string | null = null;
  userEntityName: string | null = null;

  // External user account selection
  selectAccountDialog = false;
  externalCustomer: CorporateResponse | IndividualResponse | null = null;
  externalCustomerAccounts: any[] = [];
  selectedExternalAccount: any = null;
  isLoadingExternalCustomer = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private customersService: CustomersService,
    private documentationService: DocumentationService,
    private swiftCodeService: SwiftCodeService,
    private authService : AuthService
  ) {}

  ngOnInit() {
    this.createTransactionForm = this.fb.group({
      corporateOrIndividual: ['', Validators.required],
      corporateId: [''],
      individualId: [''],
      customerName: ['', Validators.required], // Replace customerID with customerName
      customerAccount: ['', Validators.required],
      transactionAmount: ['', [Validators.required, Validators.min(1)]],
      transactionCurrency: ['', Validators.required],
      transactionTypeId: ['', Validators.required],
      beneficiaryAccount: ['', Validators.required],
      beneficiaryAccountName: ['', Validators.required],
      bankSwift: ['', Validators.required],
      bankName: ['', Validators.required],
      bankAddress: ['', Validators.required],
      paymentDetails: ['', Validators.required]
    });

    this.searchCustomerForm = this.fb.group({
      customerType: ['', Validators.required],
      searchTerm: [''],
      selectedAccount: ['']
    });

    this.searchCustomerForm.get('customerType')?.valueChanges.subscribe(() => {
      this.filteredCustomers = [];
      this.selectedCustomer = null;
      this.customerAccounts = [];
      this.searchCustomerForm.patchValue({ searchTerm: '', selectedAccount: '' });
    });

    // Load active transaction types
    this.loadTransactionTypes();
    this.loadCurrencies();

    this.userType = this.authService.getDecodedToken()?.UserType || null;
    this.userEntityId = this.authService.getDecodedToken()?.EntityIdMapTo || null;
    console.log(this.userType, this.userEntityId, this.authService.getDecodedToken());
  }

  loadTransactionTypes() {
    this.documentationService.getTransactionTypes({
      transactionTypeStatus: TransactionTypeStatus.Active
    }).subscribe({
      next: (response) => {
        this.transactionTypes = response;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  loadCurrencies() {
    this.swiftCodeService.getCurrencies().subscribe({
      next: (response) => {
        this.currencies = response;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  openSelectCustomerDialog() {
    this.selectCustomerDialog = true;
    this.searchCustomerForm.reset();
    this.filteredCustomers = [];
    this.selectedCustomer = null;
    this.customerAccounts = [];
  }

  openSelectAccountDialog() {
    if (!this.userEntityId) {
      Swal.fire({
        title: 'Error',
        text: 'User entity ID not found',
        icon: 'error'
      });
      return;
    }

    this.selectAccountDialog = true;
    this.isLoadingExternalCustomer = true;
    this.externalCustomer = null;
    this.externalCustomerAccounts = [];
    this.selectedExternalAccount = null;

    // Fetch customer data based on user type (assuming ExternalUser is Corporate by default)
    // You can adjust this logic based on your actual user type determination
    this.customersService.getCorporates({
      corporateId: this.userEntityId,
      name: '',
      pageNumber: 1,
      pageSize: 100
    }).subscribe({
      next: (response) => {
        const customer = response.items.find(c => c.id === this.userEntityId);
        if (customer) {
          this.externalCustomer = customer;
          this.externalCustomerAccounts = customer.bankAccounts || [];
          this.isLoadingExternalCustomer = false;

          if (this.externalCustomerAccounts.length === 0) {
            Swal.fire({
              title: 'No Accounts',
              text: 'No bank accounts found for this corporate',
              icon: 'info'
            });
            this.selectAccountDialog = false;
          }
        } else {
          // Try searching as individual
          this.customersService.getIndividuals({
            individualId: this.userEntityId,
            name: '',
            pageNumber: 1,
            pageSize: 100
          }).subscribe({
            next: (indResponse) => {
              const individual = indResponse.items.find(i => i.id === this.userEntityId);
              if (individual) {
                this.externalCustomer = individual;
                this.externalCustomerAccounts = individual.bankAccount ? [individual.bankAccount] : [];
                this.isLoadingExternalCustomer = false;

                if (this.externalCustomerAccounts.length === 0) {
                  Swal.fire({
                    title: 'No Accounts',
                    text: 'No bank account found for this individual',
                    icon: 'info'
                  });
                  this.selectAccountDialog = false;
                }
              } else {
                this.isLoadingExternalCustomer = false;
                this.selectAccountDialog = false;
                Swal.fire({
                  title: 'Error',
                  text: 'Customer not found',
                  icon: 'error'
                });
              }
            },
            error: (error) => {
              this.isLoadingExternalCustomer = false;
              this.selectAccountDialog = false;
              this.handleError(error);
            }
          });
        }
      },
      error: (error) => {
        this.isLoadingExternalCustomer = false;
        this.selectAccountDialog = false;
        this.handleError(error);
      }
    });
  }

  confirmExternalAccountSelection() {
    if (!this.selectedExternalAccount || !this.externalCustomer) return;

    const isCorporate = 'bankAccounts' in this.externalCustomer;

    this.createTransactionForm.patchValue({
      corporateOrIndividual: isCorporate
        ? CorporateOrIndividual.Corporate
        : CorporateOrIndividual.Individual,
      corporateId: isCorporate ? this.externalCustomer.id : '',
      individualId: !isCorporate ? this.externalCustomer.id : '',
      customerName: this.externalCustomer.name,
      customerAccount: this.selectedExternalAccount.accountNumber
    });

    this.selectAccountDialog = false;
  }

  searchCustomer(event: { query: string }) {
    if (!event.query.trim() || this.isSearching) return;

    this.isSearching = true;
    const customerType = this.searchCustomerForm.get('customerType')?.value;

    if (customerType === CustomerType.Corporate) {
      this.customersService.getCorporates({
        name: event.query,
        pageNumber: 1,
        pageSize: 10
      }).subscribe({
        next: (response) => {
          this.filteredCustomers = response.items.filter(c => c.corporateStatus === CorporateStatus.Active);
          this.isSearching = false;
        },
        error: (error) => {
          this.handleError(error);
          this.isSearching = false;
        }
      });
    }
    else {
      this.customersService.getIndividuals({
        name: event.query,
        pageNumber: 1,
        pageSize: 10
      }).subscribe({
        next: (response) => {
          this.filteredCustomers = response.items.filter(i => i.individualStatus === IndividualStatus.Active);
          this.isSearching = false;
        },
        error: (error) => {
          this.handleError(error);
          this.isSearching = false;
        }
      });
    }
  }

  onCustomerSelect(event: any) {
    this.selectedCustomer = event.value;

    console.log("🚀 => file: create-transaction.component.ts:114 => CreateTransactionComponent => onCustomerSelect => selectedCustomer:", this.selectedCustomer);


    this.customerAccounts = this.selectedCustomer?.bankAccounts ||
                          (this.selectedCustomer?.bankAccount ? [this.selectedCustomer.bankAccount] : []);
  }

  confirmCustomerSelection() {
    const selectedAccount = this.searchCustomerForm.get('selectedAccount')?.value;
    if (!selectedAccount) return;

    const customerType = this.searchCustomerForm.get('customerType')?.value;
    const isCustomerCorporate = customerType === CustomerType.Corporate;

    this.createTransactionForm.patchValue({
      corporateOrIndividual: isCustomerCorporate ?
        CorporateOrIndividual.Corporate : CorporateOrIndividual.Individual,
      corporateId: isCustomerCorporate ? this.selectedCustomer.id : '',
      individualId: !isCustomerCorporate ? this.selectedCustomer.id : '',
      customerName: this.selectedCustomer.name,
      customerAccount: selectedAccount.accountNumber
    });

    this.selectCustomerDialog = false;
  }

  openViewTransactionDocumentsDialog() {
    const selectedTypeId = this.createTransactionForm.get('transactionTypeId')?.value;
    if (!selectedTypeId) {
      Swal.fire({
        title: 'Warning',
        text: 'Please select a transaction type first',
        icon: 'warning'
      });
      return;
    }

    this.selectedTransactionType = this.transactionTypes.find(t => t.transactionTypeId === selectedTypeId);
    if (this.selectedTransactionType?.documentsRequestedList) {
      this.documentationService.getDocuments()
        .subscribe({
          next: (documents) => {
            this.transactionDocuments = documents.filter(doc =>
              this.selectedTransactionType?.documentsRequestedList.includes(doc.documentId)
            );
            this.viewDocumentsDialog = true;
          },
          error: (error) => {
            this.handleError(error);
          }
        });
    }
  }

  getControlTypeLabel(controlType: number): string {
    switch (controlType) {
      case 1: return 'Mandatory';
      case 2: return 'Dependent';
      case 3: return 'Optional';
      default: return 'Unknown';
    }
  }

  getSubmissionOptionLabel(option: number): string {
    switch (option) {
      case 1: return 'Before Processing';
      case 2: return 'After Processing';
      case 3: return 'Not Important';
      default: return 'Unknown';
    }
  }

  colorSubmissionOption(option: number): string {
    switch (option) {
      case 1: return 'danger';
      case 2: return 'warning';
      case 3: return 'success';
      default: return 'info';
    }
  }
  private handleError(error: any) {
    Swal.fire({
      title: 'Error',
      text: error?.error?.detail || 'An error occurred',
      icon: 'error'
    });
  }

  onSubmit() {
    if (this.createTransactionForm.valid) {
      this.isSubmitting = true;
      this.transactionService.createTransaction(this.createTransactionForm.value)
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            Swal.fire({
              title: 'Success',
              text: `Transaction created with ID: ${response.transactionId}`,
              icon: 'success'
            });
            this.createTransactionForm.reset();
          },
          error: (error) => {
            this.isSubmitting = false;
            Swal.fire({
              title: 'Error',
              text: error?.error?.detail || 'Failed to create transaction',
              icon: 'error'
            });
          }
        });
    }
  }

  searchSwiftCode(event: { query: string }) {
    if (!event.query.trim() || this.isSearchingSwift) return;

    this.isSearchingSwift = true;
    this.swiftCodeService.getSwiftCodes(event.query).subscribe({
      next: (response) => {
        this.filteredSwiftCodes = response.items;
        this.isSearchingSwift = false;
      },
      error: (error) => {
        this.handleError(error);
        this.isSearchingSwift = false;
      }
    });
  }

  onSwiftCodeSelect(event: any) {
    const selectedBank = event.value;
    this.createTransactionForm.patchValue({
      bankSwift: selectedBank.swiftCodeId,
      bankName: selectedBank.bankName,
      bankAddress: selectedBank.bankAddress + ', ' + selectedBank.bankCountry
    });
  }

  clearBankDetails() {
    this.createTransactionForm.patchValue({
      bankSwift: '',
      bankName: '',
      bankAddress: ''
    });
  }
}
