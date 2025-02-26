import { NgModule } from '@angular/core';
import { SharedModule } from '../../helpers/share.module';
import { DIRoutingModule } from './di-routing.module';
import { DIService } from './services/di.services';
import { ImportationDomiciliationComponent } from './importation-domiciliation/importation-domiciliation.component';

@NgModule({
  declarations: [
    ImportationDomiciliationComponent
  ],
  imports: [
    SharedModule,
    DIRoutingModule
  ],
  providers: [
   DIService
  ]
})
export class DIModule { }
