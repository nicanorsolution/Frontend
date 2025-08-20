import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../../helpers/auth-guard';
import { UserRoleEnum, UserType } from '../../helpers/UserRoleEnum';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
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
export class DashboardRoutingModule { } 
