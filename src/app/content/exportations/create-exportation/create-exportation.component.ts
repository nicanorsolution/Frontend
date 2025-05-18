import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from '../../customers/services/customers.services';
import { CustomerType } from '../../customers/models/customer.models';
import { ExportationService } from '../services/exportation.service';
import { CorporateOrIndividual } from '../../transactions/models/transactions.model';
import { DEResponse } from '../../de/models/de.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-exportation',
  templateUrl: './create-exportation.component.html',
  styles: []
})
export class CreateExportationComponent implements OnInit {
  createExportationForm!: FormGroup;
  selectCustomerDialog = false;
  searchCustomerForm!: FormGroup;
  searchDEDialog = false;
  searchDEForm!: FormGroup;
  filteredCustomers: any[] = [];
  selectedCustomer: any;
  isSearching = false;
  selectedDEDetails?: DEResponse;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private exportationService: ExportationService
  ) {}

  ngOnInit() {
    this.createExportationForm = this.fb.group({
      corporateOrIndividual: ['', Validators.required],
      corporateId: [''],
      individualId: [''],
      customerName: ['', Validators.required],
      customerNiu: ['', Validators.required],
      customerAddress: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      eForceReference: ['', Validators.required],
      fileNumber: ['', Validators.required],
      requestDate: ['', Validators.required],
      domiciliationReference: ['', Validators.required],
      domiciliationDate: ['', Validators.required],
      provider: ['', Validators.required],
      buyer: ['', Validators.required],
      placeOfDestination: ['', Validators.required],
      bank: ['', Validators.required],
      fobValueCfa: ['', Validators.required]
    });

    this.searchCustomerForm = this.fb.group({
      customerType: ['', Validators.required],
      searchTerm: ['']
    });

    this.searchDEForm = this.fb.group({
      eForceReference: ['', Validators.required]
    });

    this.searchCustomerForm.get('customerType')?.valueChanges.subscribe(() => {
      this.filteredCustomers = [];
      this.selectedCustomer = null;
      this.searchCustomerForm.patchValue({ searchTerm: '' });
    });
  }

  openSelectCustomerDialog() {
    this.selectCustomerDialog = true;
    this.searchCustomerForm.reset();
    this.filteredCustomers = [];
    this.selectedCustomer = null;
  }

  openSearchDEDialog() {
    this.searchDEDialog = true;
    this.searchDEForm.reset();
    this.selectedDEDetails = undefined;
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
          this.filteredCustomers = response.items;
          this.isSearching = false;
        },
        error: (error) => {
          this.handleError(error);
          this.isSearching = false;
        }
      });
    } else {
      this.customersService.getIndividuals({
        name: event.query,
        pageNumber: 1,
        pageSize: 10
      }).subscribe({
        next: (response) => {
          this.filteredCustomers = response.items;
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
  }

  confirmCustomerSelection() {
    if (!this.selectedCustomer) return;

    const customerType = this.searchCustomerForm.get('customerType')?.value;
    const isCustomerCorporate = customerType === CustomerType.Corporate;

    this.createExportationForm.patchValue({
      corporateOrIndividual: isCustomerCorporate ? 
        CorporateOrIndividual.Corporate : CorporateOrIndividual.Individual,
      corporateId: isCustomerCorporate ? this.selectedCustomer.id : '',
      individualId: !isCustomerCorporate ? this.selectedCustomer.id : '',
      customerName: this.selectedCustomer.name,
      customerNiu: this.selectedCustomer.niu,
      customerAddress: this.selectedCustomer.address,
      registrationNumber: this.selectedCustomer.registrationNumber
    });

    this.selectCustomerDialog = false;
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
        this.handleError(error);
      }
    });
  }

  confirmDESelection() {
    if (!this.selectedDEDetails) return;

    this.createExportationForm.patchValue({
      eForceReference: this.selectedDEDetails.eForceReference,
      fileNumber: this.selectedDEDetails.fileNumber,
      requestDate: this.selectedDEDetails.requestDate,
      domiciliationReference: this.selectedDEDetails.domiciliationReference,
      domiciliationDate: this.selectedDEDetails.domiciliationDate,
      provider: this.selectedDEDetails.provider,
      buyer: this.selectedDEDetails.buyer,
      placeOfDestination: this.selectedDEDetails.placeOfDestination,
      bank: this.selectedDEDetails.bank,
      fobValueCfa: this.selectedDEDetails.fobValueCfa
    });

    this.searchDEDialog = false;
  }

  onSubmit() {
    if (this.createExportationForm.valid) {
      this.isSubmitting = true;
      this.exportationService.createExportation(this.createExportationForm.value)
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            Swal.fire({
              title: 'Success',
              text: `Exportation created with reference: ${response.exportationReference}`,
              icon: 'success'
            });
            this.createExportationForm.reset();
          },
          error: (error) => {
            this.isSubmitting = false;
            this.handleError(error);
          }
        });
    }
  }

  private handleError(error: any) {
    Swal.fire({
      title: 'Error',
      text: error?.error?.detail || 'An error occurred',
      icon: 'error'
    });
  }
}
