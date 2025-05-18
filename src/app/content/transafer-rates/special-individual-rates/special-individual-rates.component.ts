import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransferRatesService } from '../services/transfer-rates.services';
import {
  IndividualLookupName,
  CreateSpecialPricingForIndividualCommand,
  SpecialPricingForIndividualResponse
} from '../models/transfer-rates.models';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SwiftCodeService } from '../services/swiftcode.services';

@Component({
  selector: 'app-special-individual-rates',
  templateUrl: './special-individual-rates.component.html'
})
export class SpecialIndividualRatesComponent implements OnInit {
  @ViewChild('dialog_operation_swal') dialogOperationSwal!: SwalComponent;

  searchForm!: FormGroup;
  createSpecialRateForm!: FormGroup;
  specialRateDialog = false;
  isSubmitted = false;
  loading = false;
  isUpdateMode = false;

  filteredIndividuals: IndividualLookupName[] = [];
  selectedIndividual: IndividualLookupName | null = null;
  specialRates: SpecialPricingForIndividualResponse[] = [];

  currencies: string[] = [];
  expandedRows: { [key: string]: boolean } = {};
  updateRateDialog = false;
  selectedRate: SpecialPricingForIndividualResponse | null = null;

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
      individualName: ['', Validators.required]
    });

    this.createSpecialRateForm = this.formBuilder.group({
      individualId: ['', Validators.required],
      baseCurrency: [{ value: 'XAF', disabled: true }, Validators.required],
      quoteCurrency: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      spreadInPercentage: ['', [Validators.required, Validators.min(0)]],
      commissionInPercentageForNonFinanceTransfer: ['', [Validators.required, Validators.min(0)]],
      commissionInPercentageForFinanceTransfer: ['', [Validators.required, Validators.min(0)]]
    });
  }

  searchIndividual(event: any): void {
    this.transferRatesService.lookupForIndividual(event.query)
      .subscribe(data => this.filteredIndividuals = data);
  }

  onIndividualSelect(event: any): void {
    this.selectedIndividual = event.value;
  }

  clearIndividualSelection(): void {
    this.selectedIndividual = null;
    this.specialRates = [];
  }

  searchSpecialRates(): void {
    if (!this.selectedIndividual) return;
    this.loading = true;
    this.transferRatesService.getSpecialPricingForIndividuals(this.selectedIndividual.individualId)
      .subscribe({
        next: (data) => {
          this.specialRates = data;
          this.loading = false;

          console.log('searchSpecialRates', this.selectedIndividual, this.specialRates);
        },
        error: () => this.loading = false
      });
  }

  getCurrencies(): void {
    this.swiftCodeService.getCurrencies()
      .subscribe(data => this.currencies = data);
  }

  openCreateSpecialRateDialog(): void {
    this.isUpdateMode = false;
    this.createSpecialRateForm.reset({
      baseCurrency: 'XAF',
      quoteCurrency: 'EUR'
    });

    this.createSpecialRateForm.get('individualId')?.enable();
    this.createSpecialRateForm.get('quoteCurrency')?.enable();
    this.specialRateDialog = true;
  }

  createSpecialRate(): void {
    if (this.createSpecialRateForm.invalid) return;

    this.isSubmitted = true;
    const formValue = this.createSpecialRateForm.value;

    const command: CreateSpecialPricingForIndividualCommand = {
      individualId: formValue.individualId.individualId,
      baseCurrency: 'XAF',
      quoteCurrency: formValue.quoteCurrency,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      spreadInPercentage: formValue.spreadInPercentage,
      commissionInPercentageForNonFinanceTransfer: formValue.commissionInPercentageForNonFinanceTransfer,
      commissionInPercentageForFinanceTransfer: formValue.commissionInPercentageForFinanceTransfer
    };
    
    console.log('Creating special rate with command:', command);

this.transferRatesService.createSpecialPricingForIndividual(command)
      .subscribe({
        next: () => {
          this.isSubmitted = false;
          this.specialRateDialog = false;

          this.dialogOperationSwal.update({
          title: 'Success',
          text: 'Special rate updated successfully',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'OK'
          });

          this.dialogOperationSwal.fire();

          if (this.selectedIndividual) {
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

  deleteRate(rate: SpecialPricingForIndividualResponse): void {
    this.dialogOperationSwal.update({
      title: 'Are you sure?',
      text: `Do you want to delete the special rate for ${rate.individualName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, keep it'
    });

    this.dialogOperationSwal.fire().then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.transferRatesService.deleteSpecialPricingForIndividual(rate.individualId, rate.id)
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
              if (this.selectedIndividual) {
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

  openUpdateRateDialog(rate: SpecialPricingForIndividualResponse): void {
    this.isUpdateMode = true;
    this.selectedRate = rate;
    this.createSpecialRateForm.patchValue({
      individualId: { individualId: rate.individualId, name: rate.individualName },
      baseCurrency: 'XAF',
      quoteCurrency: rate.quoteCurrency,
      startDate: new Date(rate.startDate),
      endDate: new Date(rate.endDate),
      spreadInPercentage: rate.spreadInPercentage,
      commissionInPercentageForNonFinanceTransfer: rate.commissionInPercentageForNonFinanceTransfer,
      commissionInPercentageForFinanceTransfer: rate.commissionInPercentageForFinanceTransfer
    });
    this.specialRateDialog = true;

    this.createSpecialRateForm.get('individualId')?.disable();
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
      individualId: this.selectedRate.individualId,
      specialRateId: this.selectedRate.id,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      spreadInPercentage: formValue.spreadInPercentage,
      commissionInPercentageForNonFinanceTransfer: formValue.commissionInPercentageForNonFinanceTransfer,
      commissionInPercentageForFinanceTransfer: formValue.commissionInPercentageForFinanceTransfer
    };

    console.log('update', command);

    this.transferRatesService.updateSpecialPricingForIndividual(this.selectedRate.individualId, command)
      .subscribe({
        next: () => {
          this.isSubmitted = false;
          this.updateRateDialog = false;
          this.specialRateDialog = false;
           this.dialogOperationSwal.update({
           title: 'Success',
            text: 'Special rate updated successfully',
            icon: 'success',
           confirmButtonText: 'OK'
          });
          this.dialogOperationSwal.fire();
          if (this.selectedIndividual) {
            this.searchSpecialRates();
          }
        },
        error: (err : any) => {
          this.isSubmitted = false;

           console.log(err);

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
