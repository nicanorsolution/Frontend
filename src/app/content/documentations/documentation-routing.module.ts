import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentComponent } from './documentation/document/document.component';
import { TransactionTypeComponent } from './documentation/transaction-type/transaction-type.component';
import { AuthGuard } from 'src/app/helpers/auth-guard';
import { UserRoleEnum, UserType } from 'src/app/helpers/UserRoleEnum';

const routes: Routes = [

    {
    path: 'document',
    component: DocumentComponent,
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
    path: 'transaction-type',
    component: TransactionTypeComponent,
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
export class DocumentationRoutingModule { }
