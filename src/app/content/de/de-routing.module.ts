import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth-guard';
import { NgModule } from '@angular/core';
import { ExportationDomiciliationComponent } from './exportation-domiciliation/exportation-domiciliation.component';

const routes: Routes = [
  {
    path: 'de',
    component: ExportationDomiciliationComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DERoutingModule { }
