import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth-guard';
import { NgModule } from '@angular/core';
import { ExportationDomiciliationComponent } from './exportation-domiciliation/exportation-domiciliation.component';
import { UserRoleEnum, UserType } from 'src/app/helpers/UserRoleEnum';

const routes: Routes = [
  {
    path: 'de',
    component: ExportationDomiciliationComponent,
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
export class DERoutingModule { }
