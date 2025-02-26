import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateReportCommand, ReportResponse } from '../models/reports.models';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly baseUrl = `${environment.apiUrl}/v1/api/reports`;

  constructor(private http: HttpClient) { }

  createReport(command: CreateReportCommand): Observable<any> {
    return this.http.post(this.baseUrl, command);
  }
  downloadReport(reportId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${reportId}/download`, { responseType: 'blob' });
  }
  getReports(): Observable<ReportResponse[]> {
    return this.http.get<ReportResponse[]>(this.baseUrl);
  }
}

