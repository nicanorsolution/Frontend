import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth-guard';
import { StandardRatesComponent } from './standard-rates/standard-rates.component';
import { SpecialCorporateRatesComponent } from './special-corporate-rates/special-corporate-rates.component';
import { SpecialIndividualRatesComponent } from './special-individual-rates/special-individual-rates.component';
import { NgModule } from '@angular/core';
import { SwiftcodesComponent } from './swiftcodes/swiftcodes.component';

const routes: Routes = [
  {
    path: 'standard-rates',
    component: StandardRatesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'special-corporate-rates',
    component: SpecialCorporateRatesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'special-individu-rates',
    component: SpecialIndividualRatesComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'swiftcodes',
    component: SwiftcodesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRatesRoutingModule { }
