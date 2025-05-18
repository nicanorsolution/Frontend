import { NgModule } from '@angular/core';
import { SharedModule } from '../../helpers/share.module';
import { CreateExportationComponent } from './create-exportation/create-exportation.component';
import { DocumentationExportationComponent } from './documentation-exportation/documentation-exportation.component';
import { ViewExportationsComponent } from './view-exportations/view-exportations.component';
import { ExportationService } from './services/exportation.service';
import { ExportationsRoutingModule } from './exportations-routing.module';

@NgModule({
  declarations: [
    CreateExportationComponent,
    DocumentationExportationComponent,
    ViewExportationsComponent
  ],
  imports: [
    SharedModule,
    ExportationsRoutingModule
  ],
  providers: [
    ExportationService
  ]
})
export class ExportationsModule { }
