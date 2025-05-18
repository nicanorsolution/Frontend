import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateExportationCommand, CreateExportationIncomingCommand, ExceptionDirectedTo, ExportationApurementStatus, ExportationExceptionResponse, ExportationFileHistoryResponse, ExportationFileResponse, ExportationMessageResponse, ExportationResponse, GetExportationsQuery, RaiseExportationExceptionCommand, ReviewExportationFileCommand, UpdateExportationExceptionCommand } from '../models/exportation.models';
import { PaginatedList } from 'src/app/helpers/pagination';
import { DEService } from '../../de/services/de.services';
import { DEResponse } from '../../de/models/de.models';
import { TransactionService } from '../../transactions/services/transctions.service';
import { DocumentResponse } from '../../documentations/models/document.models';
import { ExceptionResolverContactResponse } from '../../transactions/models/transactions.model';

@Injectable({
    providedIn: 'root'
})
export class ExportationService {

    
    private readonly baseUrl = `${environment.apiUrl}/v1/api/exportations`;

    constructor(private http: HttpClient, private deService : DEService, private transactionService: TransactionService) {}

    createExportation(command: CreateExportationCommand): Observable<any> {
        return this.http.post(this.baseUrl, command);
    }

    deleteExportation(exportationId: string): Observable<void> {
     return this.http.delete<void>(`${this.baseUrl}/${exportationId}`);
    }

    submitExportation(exportationId : string) {
    return this.http.post<void>(`${this.baseUrl}/${exportationId}/submit`, null);

    }
   
    getExportations(query: GetExportationsQuery): Observable<PaginatedList<ExportationResponse>> {
        let params = new HttpParams()
            .set('pageNumber', query.pageNumber.toString())
            .set('pageSize', query.pageSize.toString());

        if (query.customerName) {
            params = params.set('customerName', query.customerName);
        }
        if (query.exportationReference) {
            params = params.set('exportationReference', query.exportationReference);
        }
        if (query.startDate) {
            params = params.set('start', query.startDate.toISOString());
        }
        if (query.endDate) {
            params = params.set('end', query.endDate.toISOString());
        }

        return this.http.get<PaginatedList<ExportationResponse>>(this.baseUrl, { params });        
    }

    getDEDetailsByEForceReference(eForceReference: string): Observable<DEResponse[]> {
        return this.deService.getDEs(1, 1, eForceReference).pipe(
            map((response) => {
                return response.items;
            })
        );
    }

    getExportationFiles(exportationId: string): Observable<ExportationFileResponse[]> {
        return this.http.get<ExportationFileResponse[]>(`${this.baseUrl}/${exportationId}/files`);
    }

    getDocumentControls(documentId: string):Observable<DocumentResponse>{
        return this.transactionService.getDocumentControls(documentId, undefined).pipe(
            map((response) => {
                return response;
            })
        );
    }

    uploadExportationFile(exportationId: string, documentId: string, file: File): Observable<void> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<void>(
        `${this.baseUrl}/${exportationId}/upload-file/${documentId}`,
        formData
        );
    }

    getExportationFileBlob(exportationId: string | undefined  , exportationFileId: string): Observable<Blob> {
        return this.http.get(
        `${this.baseUrl}/${exportationId}/file/${exportationFileId}`,
        { responseType: 'blob' }
        );
    }
  
    getExportationFileHistory(exportationId: string, exportationFileId: string): Observable<ExportationFileHistoryResponse[]> {
        return this.http.get<ExportationFileHistoryResponse[]>(`${this.baseUrl}/${exportationId}/file-history/${exportationFileId}`);
    }
    
    getExportationFileHistoryDownload(exportationId: string, transactionFileId: string, history: string|null): Observable<Blob> {
        return this.http.get(
          `${this.baseUrl}/${exportationId}/file/${transactionFileId}/history/${history}`,
          { responseType: 'blob' }
        );
    }
   downloadZipDocs(exportationId: string): Observable<Blob> {
        return this.http.get(
        `${this.baseUrl}/${exportationId}/document-zip`,
        { responseType: 'blob' }
        );
    }
  
    setExportationApurement(exportationId: string, exportationApurementStatus: ExportationApurementStatus): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/${exportationId}/apurement/${exportationApurementStatus}`, null);
    }

    deFeeCollection(exportationId : string) {
    return this.http.post<void>(`${this.baseUrl}/${exportationId}/de-fee`, null);

    }
    getExportationMessages(exportationId: string): Observable<ExportationMessageResponse[]> {
        return this.http.get<ExportationMessageResponse[]>(`${this.baseUrl}/${exportationId}/messages`);
    }

    createExportationIncoming(command: CreateExportationIncomingCommand): Observable<void> {
        const formData = new FormData();
        formData.append('exportationId', command.exportationId.toString());
        formData.append('corporateOrIndividual', command.corporateOrIndividual.toString());
        formData.append('corporateId', command.corporateId || '');
        formData.append('individualId', command.individualId || '');
        formData.append('accountNumber', command.accountNumber);
       
        formData.append('valueDate', command.valueDate.toString());
        formData.append('amount', command.amount.toString());
        formData.append('currency', command.currency);
        formData.append('swiftReference', command.swiftReference);
        formData.append('file', command.swiftFile);

        return this.http.post<void>(`${this.baseUrl}/incoming`, formData);
    }

    deleteExportationIncoming(exportationId: string, incomingId: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${exportationId}/incomings/${incomingId}`);
    }

    getExportationIncomingSwiftDownload(exportationId: string, incomingId: string): Observable<Blob> {
        return this.http.get(
            `${this.baseUrl}/${exportationId}/incoming/${incomingId}`,
            { responseType: 'blob' }
        );
    }

    reviewExportationFile(review : ReviewExportationFileCommand): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/file-review`, review);
    }

    raiseException(command: RaiseExportationExceptionCommand): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/exceptions`, command);
      }

    updateException(command: UpdateExportationExceptionCommand, file?: File): Observable<void> {
        const formData = new FormData();
        formData.append('command', JSON.stringify(command));
        if (file) {
          formData.append('file', file);
        }
            
        console.log('formData', formData);
    
        return this.http.put<void>(`${this.baseUrl}/exceptions`, formData);
      }
          
    getExportationExceptionResolverMail(exportationId: string | undefined, exceptionDirectedTo: ExceptionDirectedTo): Observable<ExceptionResolverContactResponse[]> {
        return this.http.get<ExceptionResolverContactResponse[]>(
          `${this.baseUrl}/${exportationId}/exception-directed-to/${exceptionDirectedTo}`
        );
      }

    getExportationExceptions(exportationId: string): Observable<ExportationExceptionResponse[]> {
        return this.http.get<ExportationExceptionResponse[]>(`${this.baseUrl}/${exportationId}/exceptions`);
    }

    getExceptionEmailAttachment(exportationId: string, exceptionId: string): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/${exportationId}/exception/${exceptionId}`, { responseType: 'blob' });
    }
}

