import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransferRatesService } from '../services/transfer-rates.services';
import {
  CorporateLookupName,
  CreateSpecialPricingForCorporateCommand,
  SpecialPricingForCorporateResponse
} from '../models/transfer-rates.models';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SwiftCodeService } from '../services/swiftcode.services';

@Component({
  selector: 'app-special-corporate-rates',
  templateUrl: './special-corporate-rates.component.html'
})
export class SpecialCorporateRatesComponent implements OnInit {
  @ViewChild('dialog_operation_swal') dialogOperationSwal!: SwalComponent;

  searchForm!: FormGroup;
  createSpecialRateForm!: FormGroup;
  specialRateDialog = false;
  isSubmitted = false;
  loading = false;

  filteredCorporates: CorporateLookupName[] = [];
  selectedCorporate: CorporateLookupName | null = null;
  specialRates: SpecialPricingForCorporateResponse[] = [];

  currencies: string[] = []; // Add other currencies as needed

  expandedRows: { [key: string]: boolean } = {};
 
  selectedRate: SpecialPricingForCorporateResponse | null = null;
  isUpdateMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private transferRatesService: TransferRatesService,
    private swiftCodeService: SwiftCodeService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.getCurrencies();
  }


  private initializeForms(): void {

    this.searchForm = this.formBuilder.group({
      corporateName: ['', Validators.required]
    });

    this.createSpecialRateForm = this.formBuilder.group({
      corporateId: ['', Validators.required],
      baseCurrency: [{ value: 'XAF', disabled: true }, Validators.required],
      quoteCurrency: [, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      spreadInPercentage: ['', [Validators.required, Validators.min(0)]],
      commissionInPercentageForNonFinanceTransfer: ['', [Validators.required, Validators.min(0)]],
      commissionInPercentageForFinanceTransfer: ['', [Validators.required, Validators.min(0)]]
    });
  }

  searchCorporate(event: any): void {
    this.transferRatesService.lookupForCorporate(event.query)
      .subscribe(data => this.filteredCorporates = data);
  }

  onCorporateSelect(event: any): void {
    this.selectedCorporate = event.value;
  }

  clearCorporateSelection(): void {
    this.selectedCorporate = null;
    this.specialRates = [];
  }

  searchSpecialRates(): void {
    if (!this.selectedCorporate) return;
    console.log('searchSpecialRates', this.selectedCorporate);
    this.loading = true;
    this.transferRatesService.getSpecialPricingForCorporates(this.selectedCorporate.corporateId)
      .subscribe({
        next: (data) => {
          this.specialRates = data;
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  openCreateSpecialRateDialog(): void {
    this.isUpdateMode = false;
    this.createSpecialRateForm.reset({
      baseCurrency: 'XAF',
      quoteCurrency: 'EUR'
    });

    //enable the corporateId field and quoteCurrency field if disabled
    this.createSpecialRateForm.get('corporateId')?.enable();
    this.createSpecialRateForm.get('quoteCurrency')?.enable();
    this.specialRateDialog = true;
  }

  getCurrencies(): void {
    this.swiftCodeService.getCurrencies()
      .subscribe(data => this.currencies = data);
  }
  createSpecialRate(): void {
    if (this.createSpecialRateForm.invalid) return;

    this.isSubmitted = true;
    const formValue = this.createSpecialRateForm.value;

    const command: CreateSpecialPricingForCorporateCommand = {
      corporateId: formValue.corporateId.corporateId,
      baseCurrency: 'XAF',
      quoteCurrency: formValue.quoteCurrency,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      spreadInPercentage: formValue.spreadInPercentage,
      commissionInPercentageForNonFinanceTransfer: formValue.commissionInPercentageForNonFinanceTransfer,
      commissionInPercentageForFinanceTransfer: formValue.commissionInPercentageForFinanceTransfer
    };

    console.log('createSpecialRate', command);

    this.transferRatesService.createSpecialPricingForCorporate(command)
      .subscribe({
        next: () => {
          this.isSubmitted = false;
          this.specialRateDialog = false;

            this.dialogOperationSwal.update({
           title: 'Success',
            text: 'Special rate updated successfully',
            icon: 'success',
           confirmButtonText: 'OK'
          });
          this.dialogOperationSwal.fire();

          if (this.selectedCorporate) {
            this.searchSpecialRates();
          }
        },
        error: (err : any) => {
          this.isSubmitted = false;

           this.dialogOperationSwal.update({
           title: 'Error',
           text: `${err?.error?.status}: ${err?.error?.detail}`,
           icon: 'error',
           confirmButtonText: 'OK'
          });

          this.dialogOperationSwal.fire();
        }
      });
  }

  deleteRate(rate: SpecialPricingForCorporateResponse): void {
    this.dialogOperationSwal.update({
      title: 'Are you sure?',
      text: `Do you want to delete the special rate for ${rate.corporateName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, keep it'
    });

    this.dialogOperationSwal.fire().then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.transferRatesService.deleteSpecialPricingForCorporate(rate.corporateId, rate.id)
          .subscribe({
            next: () => {
              this.dialogOperationSwal.update({
                title: 'Success',
                text: 'Special rate deleted successfully',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
              });
              this.dialogOperationSwal.fire();
              if (this.selectedCorporate) {
                this.searchSpecialRates();
              }
            },
            error: (err) => {
              this.dialogOperationSwal.update({
                title: 'Error',
                text: `${err?.error?.status}: ${err?.error?.detail}`,
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'OK'
              });
              this.dialogOperationSwal.fire();
            },
            complete: () => {
              this.loading = false;
            }
          });
      }
    });
  }

  openUpdateRateDialog(rate: SpecialPricingForCorporateResponse): void {
    this.isUpdateMode = true;
    this.selectedRate = rate;
    this.createSpecialRateForm.patchValue({
      corporateId: { corporateId: rate.corporateId, name: rate.corporateName },
      baseCurrency: 'XAF',
      quoteCurrency: rate.quoteCurrency,
      startDate: new Date(rate.startDate),
      endDate: new Date(rate.endDate),
      spreadInPercentage: rate.spreadInPercentage,
      commissionInPercentageForNonFinanceTransfer: rate.commissionInPercentageForNonFinanceTransfer,
      commissionInPercentageForFinanceTransfer: rate.commissionInPercentageForFinanceTransfer
    });
    this.specialRateDialog = true;

    //disable the corporateId field and quoteCurrency field
    this.createSpecialRateForm.get('corporateId')?.disable();
    this.createSpecialRateForm.get('quoteCurrency')?.disable();
  }

  onDialogSubmit(): void {
    if (this.isUpdateMode) {
      this.updateSpecialRate();
    } else {
      this.createSpecialRate();
    }
  }

  updateSpecialRate(): void {
    if (this.createSpecialRateForm.invalid || !this.selectedRate) return;

    this.isSubmitted = true;
    const formValue = this.createSpecialRateForm.value;
    const command = {
      corporateId: this.selectedRate.corporateId,
      specialRateId: this.selectedRate.id,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      spreadInPercentage: formValue.spreadInPercentage,
      commissionInPercentageForNonFinanceTransfer: formValue.commissionInPercentageForNonFinanceTransfer,
      commissionInPercentageForFinanceTransfer: formValue.commissionInPercentageForFinanceTransfer
    };

    this.transferRatesService.updateSpecialPricingForCorporate(this.selectedRate.corporateId, command)
      .subscribe({
        next: () => {
          this.isSubmitted = false;
          this.specialRateDialog = false;

          this.dialogOperationSwal.update({
           title: 'Success',
           text: 'Special rate updated successfully',
          confirmButtonText: 'OK',
           icon: 'success',
          });

          this.dialogOperationSwal.fire();

          if (this.selectedCorporate) {
            this.searchSpecialRates();
          }
        },
        error: (err : any) => {
           this.isSubmitted = false;

           this.dialogOperationSwal.update({
           title: 'Error',
           text: `${err?.error?.status}: ${err?.error?.detail}`,
           icon: 'error',
           confirmButtonText: 'OK'
          });

          this.dialogOperationSwal.fire();
           }
      });
  }
}
