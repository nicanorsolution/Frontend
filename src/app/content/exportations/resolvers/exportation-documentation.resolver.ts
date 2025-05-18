import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { ExportationService } from '../services/exportation.service';
import { ExportationFileResponse, ExportationResponse } from '../models/exportation.models';
import { delay, map, switchMap, tap } from 'rxjs/operators';

export interface ExportationDocumentationData {
  exportation: ExportationResponse | null;
  documents: ExportationFileResponse[]; // Replace with your document type
}

@Injectable({
  providedIn: 'root'
})
export class ExportationDocumentationResolver implements Resolve<ExportationDocumentationData> {
  constructor(private exportationService: ExportationService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ExportationDocumentationData> {
    const exportationReference = route.queryParams['exportationReference'];
    console.log('Exportation Reference:', exportationReference);
    if (!exportationReference) {
      return of({ exportation: null, documents: [] });
    }
    return this.exportationService.getExportations({
      exportationReference: exportationReference,
      pageNumber: 1,
      pageSize: 1
    }).pipe(
      delay(100),
      tap(response => {
        console.log('Response from getExportations:', response);
      }),
      map(response => response.items.find(e => e.exportationReference === exportationReference) || null),
      switchMap(exportation => {
        if (!exportation) {
          return of({ exportation: null, documents: [] });
        }

        return forkJoin({
          exportation: of(exportation),
          documents: this.exportationService.getExportationFiles(exportation.id) 
        });
      }),
      tap(data => {
        console.log('Resolved Exportation Documentation Data:', data);
      })
    );
  }
}
