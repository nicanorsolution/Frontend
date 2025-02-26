import { NgModule } from '@angular/core';
import { CustomerRoutingModule } from './customer-routing.module';
import { SharedModule } from '../../helpers/share.module';
import { CorporateComponent } from './corporate/corporate.component';
import { IndividualComponent } from './individual/individual.component';
import { CustomersService } from './services/customers.services';
import { RelationshipmanagerComponent } from './relationshipmanager/relationshipmanager.component';

@NgModule({
  declarations: [
    CorporateComponent,
    IndividualComponent,
    RelationshipmanagerComponent
  ],
  imports: [
    SharedModule,
    CustomerRoutingModule
  ],
  providers: [
    CustomersService
  ]
})
export class CustomerModule { }
