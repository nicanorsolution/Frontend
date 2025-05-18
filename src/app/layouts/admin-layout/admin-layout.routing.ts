import { TransactionModule } from './../../content/transactions/transaction-module';
import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth-guard';
import { UsersComponent } from 'src/app/content/users/users.component';
import { ReportsComponent } from 'src/app/content/reports/reports.component';

export const AdminLayoutRoutes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../content/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'customer',
    loadChildren: () => import('../../content/customers/customer.module').then(m => m.CustomerModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'documentation',
    loadChildren: () => import('../../content/documentations/documentation.module').then(m => m.DocumentationModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'rates',
    loadChildren: () => import('../../content/transafer-rates/transfer-rates.module').then(m => m.TransferRatesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'di',
    loadChildren: () => import('../../content/di/di-module').then(m => m.DIModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'de',
    loadChildren: () => import('../../content/de/de.module').then(m => m.DEModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'exportations',
    loadChildren: () => import('../../content/exportations/exportations.module').then(m => m.ExportationsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'transaction',
    loadChildren: () => import('../../content/transactions/transaction-module').then(m => m.TransactionModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reports',
    loadChildren: () => import('../../content/reports/reports.module').then(m => m.ReportModule),

    canActivate: [AuthGuard]
  }
];


