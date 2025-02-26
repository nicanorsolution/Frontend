import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ImputeDICommand,
  UpdateGoodsDescriptionCommand,
  DIAttestationGenerationResponse,
  DIImputationResponse,
  DI
} from '../models/di.models';
import { PaginatedList } from '../../../helpers/pagination';

@Injectable({
  providedIn: 'root'
})
export class DIService {
  private readonly baseUrl = `${environment.apiUrl}/v1/api/importdomiciliation`;

  constructor(private http: HttpClient) {}

  imputeDI(command: ImputeDICommand): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/impute`, command);
  }

  readDIImported(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(`${this.baseUrl}/read`, formData);
  }

  requestDIAttestation(diId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${diId}/attestation`, {});
  }

  reverseImputation(diId: string, imputationId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${diId}/imputation/${imputationId}/reverse`, {});
  }

  updateGoodsDescription(command: UpdateGoodsDescriptionCommand): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/goodsdescription`, command);
  }

  getDIAttestations(diId: string): Observable<DIAttestationGenerationResponse[]> {
    return this.http.get<DIAttestationGenerationResponse[]>(`${this.baseUrl}/dis/${diId}/attestations`);
  }
  downloadDIAttestation(diId: string, attestationGenerationId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/dis/${diId}/attestations-download/${attestationGenerationId}`, {
      responseType: 'blob'
    });
  }
  getDIImputations(diId: string): Observable<DIImputationResponse[]> {
    return this.http.get<DIImputationResponse[]>(`${this.baseUrl}/dis/${diId}/imputations`);
  }

  getDIs(pageNumber: number, pageSize: number): Observable<PaginatedList<DI>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedList<DI>>(`${this.baseUrl}/dis`, { params });
  }
}
