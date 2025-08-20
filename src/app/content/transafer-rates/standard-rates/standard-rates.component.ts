import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransferRatesService } from '../services/transfer-rates.services';
import { StandardTransferRateResponse } from '../models/transfer-rates.models';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { UserRoleEnum } from 'src/app/helpers/UserRoleEnum';

@Component({
  selector: 'app-standard-rates',
  templateUrl: './standard-rates.component.html'
})
export class StandardRatesComponent implements OnInit {

  UserRoleEnum = UserRoleEnum;
  rates : StandardTransferRateResponse[] = [];
  loading = false;
  expandedRows: { [key: string]: boolean } = {};
  editStandardRateDialog = false;
  selectedRate?: StandardTransferRateResponse;
  editStandardRateForm!: FormGroup;
  isSubmitted = false;

  @ViewChild('dialog_operation_swal')
  private dialogOperationSwal!: SwalComponent;

  constructor(
    private transferRatesService: TransferRatesService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.loadRates();
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

  loadRates() {
    this.loading = true;
    this.transferRatesService.getStandardTransferRate().subscribe({
      next: (response) => {
        this.rates = response;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  isCurrentRate(transferDate: Date): boolean {
    const today = new Date();
    const rateDate = new Date(transferDate);
    return today.toDateString() === rateDate.toDateString();
  }

  private initializeForm() {
    this.editStandardRateForm = this.fb.group({
      baseSellRate: ['', [Validators.required, Validators.min(0)]],
      spreadInPercentage: ['', [Validators.required, Validators.min(0)]],
      commissionInPercentageForNonFinanceTransfer: ['', [Validators.required, Validators.min(0)]],
      commissionInPercentageForFinanceTransfer: ['', [Validators.required, Validators.min(0)]],
      baseBuyRate: ['', [Validators.required, Validators.min(0)]]
    });
  }

  openEditStandardRateDialog(rate: StandardTransferRateResponse) {
    this.selectedRate = rate;
    this.editStandardRateDialog = true;
    this.editStandardRateForm.patchValue({
      baseSellRate: rate.baseSellRate,
      spreadInPercentage: rate.spreadInPercentage,
      commissionInPercentageForNonFinanceTransfer: rate.commissionInPercentageForNonFinanceTransfer,
      commissionInPercentageForFinanceTransfer: rate.commissionInPercentageForFinanceTransfer,
      baseBuyRate: rate.baseBuyRate
    });
  }

  updateStandardRate() {
    if (this.editStandardRateForm.valid && this.selectedRate) {
      this.isSubmitted = true;
      const command = {
        standardDailyTransferRateId: this.selectedRate.id,
        ...this.editStandardRateForm.value
      };

      this.transferRatesService.updateDailyTransactionRate(this.selectedRate.id, command).subscribe({
        next: () => {
          this.editStandardRateDialog = false;
          this.loadRates();
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
}
