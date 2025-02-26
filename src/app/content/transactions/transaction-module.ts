import { NgModule } from '@angular/core';
import { SharedModule } from '../../helpers/share.module';
import { TransactionService } from './services/transctions.service';
import { TransactionRoutingModule } from './transaction-routing.module';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { ViewTransactionsComponent } from './view-transactions/view-transactions.component';
import { DocumentationTransactionComponent } from './documentation-transaction/documentation-transaction.component';
import { UploadDocumentsComponent } from './documentation-transaction/upload-documents/upload-documents.component';

@NgModule({
  declarations: [
    CreateTransactionComponent,
    ViewTransactionsComponent,
    DocumentationTransactionComponent,
    UploadDocumentsComponent
  ],
  imports: [
    SharedModule,
    TransactionRoutingModule
  ],
  providers: [
   TransactionService
  ]
  ,
    exports: [
      CreateTransactionComponent,
      ViewTransactionsComponent,
      DocumentationTransactionComponent,
      UploadDocumentsComponent
    ]
})
export class TransactionModule { }
