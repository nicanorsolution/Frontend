import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { UsersModule } from 'src/app/content/users/users.module';
import { DocumentationModule } from 'src/app/content/documentations/documentation.module';
import { TransferRatesModule } from 'src/app/content/transafer-rates/transfer-rates.module';
import { TransactionModule } from 'src/app/content/transactions/transaction-module';
import { ReportModule } from 'src/app/content/reports/reports.module';


@NgModule({
  imports: [

    RouterModule.forChild(AdminLayoutRoutes),
    DocumentationModule,
    TransferRatesModule,
    UsersModule,
    ReportModule,
  ],
  declarations: [
  ]
})

export class AdminLayoutModule {}
