import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth-guard';
import { NgModule } from '@angular/core';
import { ImportationDomiciliationComponent } from './importation-domiciliation/importation-domiciliation.component';

const routes: Routes = [
  {
    path: 'di',
    component: ImportationDomiciliationComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DIRoutingModule { }
