import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DEResponse } from '../models/de.models';
import { PaginatedList } from '../../../helpers/pagination';

@Injectable({
  providedIn: 'root'
})
export class DEService {
  private readonly baseUrl = `${environment.apiUrl}/v1/api/exportdomiciliation`;

  constructor(private http: HttpClient) {}

  getDEs(pageNumber: number, pageSize: number, eForceReference?: string, clientName?: string, domiciliationReference?: string,
         startDate?: Date, endDate?: Date): Observable<PaginatedList<DEResponse>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (eForceReference) params = params.set('eForceReference', eForceReference);
    if (clientName) params = params.set('clientName', clientName);
    if (domiciliationReference) params = params.set('domiciliationReference', domiciliationReference);
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());

    console.log('DEService: Fetching DEs with params:', params.toString());

    return this.http.get<PaginatedList<DEResponse>>(`${this.baseUrl}/des`, { params });
  }

  readDEImported(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(`${this.baseUrl}/read`, formData);
  }
}
