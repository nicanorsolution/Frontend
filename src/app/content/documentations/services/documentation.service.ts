import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  DocumentControlRequest,
  DocumentQuery,
  DocumentResponse,
  DocumentStatus
} from '../models/document.models';
import {
  TransactionTypeQuery,
  TransactionTypeResponse,
  TransactionTypeStatus,
  CreateTransactionTypeCommand
} from '../models/transaction-type.models';

@Injectable({
  providedIn: 'root'
})
export class DocumentationService {
  private readonly baseUrl = `${environment.apiUrl}/v1/api/documentation`;
  constructor(private http: HttpClient) {}

  getTransactionTypes(query?: TransactionTypeQuery): Observable<TransactionTypeResponse[]> {
    let params = new HttpParams();

    if (query?.transactionTypeStatus) {
      params = params.append('status', query.transactionTypeStatus.toString());
    }

    return this.http.get<TransactionTypeResponse[]>(
      `${this.baseUrl}/transactiontypes`,
      { params }
    );
  }


  getDocuments(query?: DocumentQuery): Observable<DocumentResponse[]> {
    let params = new HttpParams();

    if (query?.documentName) {
      params = params.append('documentName', query.documentName);
    }

    if (query?.documentStatus) {
      params = params.append('documentStatus', query.documentStatus.toString());
    }

    return this.http.get<DocumentResponse[]>(
      `${this.baseUrl}/documents`,
      { params }
    );
  }

  setTransactionTypeDocuments(id: string, documents: string[]): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/transactiontypes/${id}/documents`,
      documents
    );
  }

  createTransactionType(command: CreateTransactionTypeCommand): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/transactiontypes`,
      command
    );
  }

  addDocumentControl(documentId: string, control: DocumentControlRequest): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/document/${documentId}/controls`,
      control
    );
  }

  removeDocumentControl(documentId: string, controlId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/document/${documentId}/controls/${controlId}`
    );
  }
}
