import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth-guard';
import { NgModule } from '@angular/core';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { ViewTransactionsComponent } from './view-transactions/view-transactions.component';
import { DocumentationTransactionComponent } from './documentation-transaction/documentation-transaction.component';
import { TransactionDocumentationResolver } from './resolvers/transaction-documentation.resolver';
import { UserRoleEnum, UserType } from '../../helpers/UserRoleEnum';

const routes: Routes = [
  {
    path: 'create-transaction',
    component: CreateTransactionComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [UserRoleEnum.TradeInitiator], // Only TradeInitiator can create transactions
      userType: [UserType.InternalUser, UserType.ExternalUser]
    }
  },
  {
    path: 'view-transaction',
    component: ViewTransactionsComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
              UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
              UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
              UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly], // All roles can view
      userType: [UserType.InternalUser, UserType.ExternalUser]
    }
  },
  {
    path: 'documentation-transaction',
    component: DocumentationTransactionComponent,
    resolve: {
      transaction: TransactionDocumentationResolver
    },
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
export class TransactionRoutingModule { }
