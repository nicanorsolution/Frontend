import { DIImputationResponse, ImputeDICommand } from './../../di/models/di.models';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreateTransactionCommand,
  RaiseTransactionExceptionCommand,
  UpdateTransactionExceptionCommand,
  GetTransactionQuery,
  TransactionResponse,
  TransactionFileResponse,
  ReviewTransactionFileCommand,
  TransactionExceptionResponse,
  ExceptionDirectedTo,
  ExceptionResolverContactResponse,
  ReferenceMT,
  TransactionMessageResponse,
  TransactionExceptionHistoryResponse,
  TransactionApprovalFlowCommand,
  TransactionFileHistoryResponse,
  ProcessingOption,
  TransactionApurementStatus,
  TransactionProvisionTransferResponse
} from '../models/transactions.model';
import { PaginatedList } from '../../../helpers/pagination';
import { DocumentResponse } from '../../documentations/models/document.models';
import { DIService } from '../../di/services/di.services';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
 


  private readonly baseUrl = `${environment.apiUrl}/v1/api/transactions`;

  constructor(private http: HttpClient, private diService : DIService) {}

  createTransaction(command: CreateTransactionCommand): Observable<any> {
    return this.http.post<any>(this.baseUrl, command);
  }

  deleteTransaction(transactionId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${transactionId}`);
  }

  submitTransaction(transactionId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${transactionId}/submit`, null);
  }

  approvalFlow(command: TransactionApprovalFlowCommand): Observable<void> {
    console.log('TransactionApprovalFlowCommand', command);  
    return this.http.post<void>(`${this.baseUrl}/flow`, command);
  }

  raiseException(command: RaiseTransactionExceptionCommand): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/exceptions`, command);
  }

  updateException(command: UpdateTransactionExceptionCommand, file?: File): Observable<void> {
    const formData = new FormData();
    formData.append('command', JSON.stringify(command));
    if (file) {
      formData.append('file', file);
    }

    console.log('formData', formData);

    return this.http.put<void>(`${this.baseUrl}/exceptions`, formData);
  }

  uploadTransactionSwift(transactionId: string, referenceMT: ReferenceMT, reference: string, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<void>(
      `${this.baseUrl}/${transactionId}/upload-swift/${referenceMT}/${reference}`,
      formData
    );
  }
  getTransasctionSwiftFile(transactionId: string, reference: ReferenceMT) {
    return this.http.get(`${this.baseUrl}/${transactionId}/swift/${reference}`, { responseType: 'blob' });
  }
  getTransactions(query: GetTransactionQuery): Observable<PaginatedList<TransactionResponse>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber.toString())
      .set('pageSize', query.pageSize.toString());

    if (query.transactionReference) {
      params = params.set('transactionReference', query.transactionReference);
    }
    if (query.customerAccountName) {
      params = params.set('customerAccountName', query.customerAccountName);
    }
    if (query.customerAccountNumber) {
      params = params.set('customerAccountNumber', query.customerAccountNumber);
    }
    if (query.startDate) {
      params = params.set('startDate', query.startDate.toISOString());
    }
    if (query.endDate) {
      params = params.set('endDate', query.endDate.toISOString());
    }

    return this.http.get<PaginatedList<TransactionResponse>>(this.baseUrl, { params });
  }

  getTransactionFiles(transactionId: string): Observable<TransactionFileResponse[]> {
    return this.http.get<TransactionFileResponse[]>(`${this.baseUrl}/${transactionId}`);
  }

  uploadTransactionFile(transactionId: string, documentId: string, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<void>(
      `${this.baseUrl}/${transactionId}/upload-file/${documentId}`,
      formData
    );
  }

  getTransactionFileBlob(transactionId: string | undefined  , transactionFileId: string): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/${transactionId}/file/${transactionFileId}`,
      { responseType: 'blob' }
    );
  }

  getDocumentControls(documentId: string | undefined, transactionFileId: string | undefined): Observable<DocumentResponse> {
    return this.http.get<DocumentResponse>(
      `${this.baseUrl}/documentControls/${documentId}`
    );
  }

  reviewTransactionFile(command: ReviewTransactionFileCommand): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/file-review`, command);
  }

  getTransactionFileHistory(transactionId: string, transactionFileId: string): Observable<TransactionFileHistoryResponse[]> {
    return this.http.get<TransactionFileHistoryResponse[]>(`${this.baseUrl}/${transactionId}/file-history/${transactionFileId}`);
  }

  getTransactionFileHistoryDownload(transactionId: string, transactionFileId: string, history: string): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/${transactionId}/file/${transactionFileId}/history/${history}`,
      { responseType: 'blob' }
    );
  }

  downloadZipDocs(transactionId: string): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/${transactionId}/document-zip`,
      { responseType: 'blob' }
    );
  }
  getTransactionExceptions(transactionId: string): Observable<TransactionExceptionResponse[]> {
    return this.http.get<TransactionExceptionResponse[]>(`${this.baseUrl}/${transactionId}/exception`);
  }
  getTransactionExceptionsHistory(transactionId: string, exceptionSerialNumber : number): Observable<TransactionExceptionHistoryResponse[]> {
    return this.http.get<TransactionExceptionHistoryResponse[]>(`${this.baseUrl}/${transactionId}/exception-history/` + exceptionSerialNumber);
  }

  getTransactionExceptionResolverMail(transactionId: string | undefined, exceptionDirectedTo: ExceptionDirectedTo): Observable<ExceptionResolverContactResponse[]> {
    return this.http.get<ExceptionResolverContactResponse[]>(
      `${this.baseUrl}/${transactionId}/exception-directed-to/${exceptionDirectedTo}`
    );
  }

  getTransactionDIs(transactionId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dis/${transactionId}`);
  }

  ImputeDI(command : ImputeDICommand) {
    return  this.diService.imputeDI(command);
  }

  reverseImputation(diId: string, imputationId: string): Observable<void> {
    console.log('diId', diId);
    return this.diService.reverseImputation(diId, imputationId);
  }


  getTransactionDIImputations(transactionId: string): Observable<DIImputationResponse[]> {
    //TODO use Diservice
    return this.http.get<DIImputationResponse[]>(`${this.baseUrl}/${transactionId}/imputations`);
  }

  getTransactionMessages(transactionId: string): Observable<TransactionMessageResponse[]> {
    return this.http.get<TransactionMessageResponse[]>(`${this.baseUrl}/${transactionId}/messages`);
  }

  setProcessingOption(transactionId: string, option: ProcessingOption): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${transactionId}/processing-option/${option}`, null);
  }

  setTransactionApurement(transactionId: string, transactionApurementStatus: TransactionApurementStatus): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${transactionId}/apurement/${transactionApurementStatus}`, null);
  }

  //
  provisionAccount(transactionId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${transactionId}/provision`, null);
  }

  retryProvisionAccount(transactionProvisionTransferId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${transactionProvisionTransferId}/provision-retry`, null);
  }

  getProvisionTransferts(transactionId: string): Observable<TransactionProvisionTransferResponse[]> {
    return this.http.get<TransactionProvisionTransferResponse[]>(`${this.baseUrl}/${transactionId}/provision-transferts`);
  }

   getExceptionEmailAttachment(transactionId: string, exceptionId: string): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/${transactionId}/exception/${exceptionId}`, { responseType: 'blob' });
  }
}

