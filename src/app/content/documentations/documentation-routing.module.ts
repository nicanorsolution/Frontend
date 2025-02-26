import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentComponent } from './documentation/document/document.component';
import { TransactionTypeComponent } from './documentation/transaction-type/transaction-type.component';
import { AuthGuard } from 'src/app/helpers/auth-guard';

const routes: Routes = [

    {
    path: 'document',
    component: DocumentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'transaction-type',
    component: TransactionTypeComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentationRoutingModule { }
