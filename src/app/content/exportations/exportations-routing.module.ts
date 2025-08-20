import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth-guard';
import { CreateExportationComponent } from './create-exportation/create-exportation.component';
import { ViewExportationsComponent } from './view-exportations/view-exportations.component';
import { DocumentationExportationComponent } from './documentation-exportation/documentation-exportation.component';
import { ExportationDocumentationResolver } from './resolvers/exportation-documentation.resolver';
import { UserRoleEnum, UserType } from 'src/app/helpers/UserRoleEnum';

const routes: Routes = [
  {
    path: 'create-exportation',
    component: CreateExportationComponent,
    canActivate: [AuthGuard],
     data: {
          roles: [UserRoleEnum.TradeInitiator],
          userType: [UserType.InternalUser, UserType.ExternalUser]
        }
  },
  {
    path: 'view-exportations',
    component: ViewExportationsComponent,
    canActivate: [AuthGuard],
     data: {
      roles: [UserRoleEnum.TradeInitiator, UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
              UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
              UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
              UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
      userType: [UserType.InternalUser, UserType.ExternalUser]
    }
  },
  {
    path: 'documentation-exportation',
    component: DocumentationExportationComponent,
    resolve: {
      exportation: ExportationDocumentationResolver
    },
    canActivate: [AuthGuard],
     data: {
      roles: [UserRoleEnum.TradeInitiator, UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
              UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
              UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
              UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
      userType: [UserType.InternalUser, UserType.ExternalUser]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportationsRoutingModule { }
