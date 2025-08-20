import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth-guard';
import { NgModule } from '@angular/core';
import { ImportationDomiciliationComponent } from './importation-domiciliation/importation-domiciliation.component';
import { UserRoleEnum, UserType } from 'src/app/helpers/UserRoleEnum';

const routes: Routes = [
  {
    path: 'di',
    component: ImportationDomiciliationComponent,
    canActivate: [AuthGuard],
      data: {
           roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
                      UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
                      UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
                      UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
           userType: [UserType.InternalUser, UserType.ExternalUser]
        }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DIRoutingModule { }
