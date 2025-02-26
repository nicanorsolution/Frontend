import { NgModule } from '@angular/core';
import { DocumentationRoutingModule } from './documentation-routing.module';
import { SharedModule } from '../../helpers/share.module';
import { DocumentComponent } from './documentation/document/document.component';
import { TransactionTypeComponent } from './documentation/transaction-type/transaction-type.component';

@NgModule({
  declarations: [
    DocumentComponent,
    TransactionTypeComponent,
  ],
  imports: [
    SharedModule,
    DocumentationRoutingModule
  ],
  exports: [
    DocumentComponent,
    TransactionTypeComponent,
  ]
})
export class DocumentationModule { }
