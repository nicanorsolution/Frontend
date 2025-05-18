import { NgModule } from '@angular/core';
import { SharedModule } from '../../helpers/share.module';
import { DERoutingModule } from './de-routing.module';
import { DEService } from './services/de.services';
import { ExportationDomiciliationComponent } from './exportation-domiciliation/exportation-domiciliation.component';

@NgModule({
  declarations: [
    ExportationDomiciliationComponent
  ],
  imports: [
    SharedModule,
    DERoutingModule
  ],
  providers: [
   DEService
  ]
})
export class DEModule { }
