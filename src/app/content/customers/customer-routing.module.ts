import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorporateComponent } from './corporate/corporate.component';
import { IndividualComponent } from './individual/individual.component';
import { AuthGuard } from 'src/app/helpers/auth-guard';
import { RelationshipmanagerComponent } from './relationshipmanager/relationshipmanager.component';
import { UserRoleEnum, UserType } from 'src/app/helpers/UserRoleEnum';

const routes: Routes = [
  {
    path: 'corporate',
    component: CorporateComponent,
    canActivate: [AuthGuard],
            data: {
              roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
                      UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
                      UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
                      UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
              userType: [UserType.InternalUser]
            }
  },
  {
    path: 'individual',
    component: IndividualComponent,
    canActivate: [AuthGuard],
        data: {
          roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
                  UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
                  UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
                  UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
          userType: [UserType.InternalUser]
        }
  },
  {
    path: 'rm',
    component: RelationshipmanagerComponent,
    canActivate: [AuthGuard],
        data: {
          roles: [UserRoleEnum.Admin, UserRoleEnum.SuperAdmin, UserRoleEnum.TradeInitiator,
                  UserRoleEnum.Verifier, UserRoleEnum.TradeAuthorizer, UserRoleEnum.TreasuryAuthorizer,
                  UserRoleEnum.TreasuryOperationAuthorizer, UserRoleEnum.TradeOperationAuthorizer,
                  UserRoleEnum.TradeDeskAuthorizer, UserRoleEnum.ViewOnly],
          userType: [UserType.InternalUser]
        }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
