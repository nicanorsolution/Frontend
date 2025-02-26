import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SwiftCodeResponse } from '../models/swift-codes.models';
import { PaginatedList } from '../../../helpers/pagination';

@Injectable({
  providedIn: 'root'
})
export class SwiftCodeService {
  private readonly baseUrl = `${environment.apiUrl}/v1/api/referencedata`;

  constructor(private http: HttpClient) {}

  getSwiftCodes(swiftCode?: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedList<SwiftCodeResponse>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (swiftCode) {
      params = params.set('swiftCode', swiftCode);
    }

    return this.http.get<PaginatedList<SwiftCodeResponse>>(`${this.baseUrl}/swiftcodes`, { params });
  }

  getCurrencies(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/currencies`);
  }
}
