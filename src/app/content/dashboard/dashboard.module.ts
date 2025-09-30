import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoadingComponent } from './dashboard/loading.component';
import { DashboardResolver } from './resolvers/dashboard.resolver';
import { NgChartsModule } from 'ng2-charts';
import { SharedModule } from 'src/app/helpers/share.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgChartsModule,
    DashboardRoutingModule
  ],
  providers: [
    DashboardResolver
  ],
  exports: [
    DashboardComponent,
    LoadingComponent
  ]
})
export class DashboardModule { }

