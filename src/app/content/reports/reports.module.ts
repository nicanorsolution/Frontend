import { ReportRoutingModule } from './reports-routing.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../helpers/share.module';
import { ReportsComponent } from './reports.component';

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    SharedModule,
    ReportRoutingModule
  ],
  exports: [
    ReportsComponent
  ]
})
export class ReportModule { }
