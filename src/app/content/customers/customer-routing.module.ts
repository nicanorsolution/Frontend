import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorporateComponent } from './corporate/corporate.component';
import { IndividualComponent } from './individual/individual.component';
import { AuthGuard } from 'src/app/helpers/auth-guard';
import { RelationshipmanagerComponent } from './relationshipmanager/relationshipmanager.component';

const routes: Routes = [
  {
    path: 'corporate',
    component: CorporateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'individual',
    component: IndividualComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rm',
    component: RelationshipmanagerComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
