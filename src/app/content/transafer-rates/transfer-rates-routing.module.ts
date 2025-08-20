import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth-guard';
import { StandardRatesComponent } from './standard-rates/standard-rates.component';
import { SpecialCorporateRatesComponent } from './special-corporate-rates/special-corporate-rates.component';
import { SpecialIndividualRatesComponent } from './special-individual-rates/special-individual-rates.component';
import { NgModule } from '@angular/core';
import { SwiftcodesComponent } from './swiftcodes/swiftcodes.component';
import { UserRoleEnum, UserType } from 'src/app/helpers/UserRoleEnum';

const routes: Routes = [
  {
    path: 'standard-rates',
    component: StandardRatesComponent,
    canActivate: [AuthGuard],
     data: {
          roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
                  UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
                  UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
                  UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
          userType: [UserType.InternalUser, UserType.ExternalUser]
        }
  },
  {
    path: 'special-corporate-rates',
    component: SpecialCorporateRatesComponent,
    canActivate: [AuthGuard],
     data: {
      roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
              UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
              UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
              UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
      userType: [UserType.InternalUser]
    }
  },
  {
    path: 'special-individual-rates',
    component: SpecialIndividualRatesComponent,
    canActivate: [AuthGuard],
     data: {
      roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
              UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
              UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
              UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
      userType: [UserType.InternalUser]
    }
  },

  {
    path: 'swiftcodes',
    component: SwiftcodesComponent,
    canActivate: [AuthGuard],
     data: {
      roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
              UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
              UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
              UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
      userType: [UserType.InternalUser]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRatesRoutingModule { }
