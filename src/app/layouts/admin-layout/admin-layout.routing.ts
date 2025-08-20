import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth-guard';
import { UsersComponent } from 'src/app/content/users/users.component';
import { UserRoleEnum, UserType } from 'src/app/helpers/UserRoleEnum';

export const AdminLayoutRoutes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../content/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'customer',
    loadChildren: () => import('../../content/customers/customer.module').then(m => m.CustomerModule),

  },
  {
    path: 'documentation',
    loadChildren: () => import('../../content/documentations/documentation.module').then(m => m.DocumentationModule),

  },
  {
    path: 'rates',
    loadChildren: () => import('../../content/transafer-rates/transfer-rates.module').then(m => m.TransferRatesModule),

  },
  {
    path: 'di',
    loadChildren: () => import('../../content/di/di-module').then(m => m.DIModule),

  },
  {
    path: 'de',
    loadChildren: () => import('../../content/de/de.module').then(m => m.DEModule),

  },
  {
    path: 'exportations',
    loadChildren: () => import('../../content/exportations/exportations.module').then(m => m.ExportationsModule),

  },
  {
    path: 'transaction',
    loadChildren: () => import('../../content/transactions/transaction-module').then(m => m.TransactionModule),

  },
  { // since user to not load futher routes and end here we then setup access here
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
              UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
              UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
              UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
      userType: [UserType.InternalUser,UserType.ExternalUser]
    }
  },
  {
    path: 'reports',
    loadChildren: () => import('../../content/reports/reports.module').then(m => m.ReportModule),

  }
];


