import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth-guard';
import { CreateExportationComponent } from './create-exportation/create-exportation.component';
import { ViewExportationsComponent } from './view-exportations/view-exportations.component';
import { DocumentationExportationComponent } from './documentation-exportation/documentation-exportation.component';
import { ExportationDocumentationResolver } from './resolvers/exportation-documentation.resolver';

const routes: Routes = [
  {
    path: 'create-exportation',
    component: CreateExportationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'view-exportations',
    component: ViewExportationsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'documentation-exportation',
    component: DocumentationExportationComponent,
    resolve: {
      exportation: ExportationDocumentationResolver
    },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportationsRoutingModule { }
