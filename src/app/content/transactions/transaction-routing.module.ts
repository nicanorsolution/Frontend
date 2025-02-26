import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth-guard';
import { NgModule } from '@angular/core';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { ViewTransactionsComponent } from './view-transactions/view-transactions.component';
import { DocumentationTransactionComponent } from './documentation-transaction/documentation-transaction.component';
import { TransactionDocumentationResolver } from './resolvers/transaction-documentation.resolver';

const routes: Routes = [
  {
    path: 'create-transaction',
    component: CreateTransactionComponent,
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'view-transaction',
    component: ViewTransactionsComponent,
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'documentation-transaction',
    component: DocumentationTransactionComponent,
    resolve: {
      transaction: TransactionDocumentationResolver
    },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
