import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginatedList } from '../../../helpers/pagination';
import {
  CorporateResponse,
  IndividualResponse,
  RelationshipManagerResponse,
  CustomerInfoResponse,
  CustomerType,
  CorporateQuery,
  IndividualQuery,
  RelationshipManagerQuery,
  AddBankAccountCommand,
  AddCorporateContactCommand,
  AssignRelationshipManagerCommand,
  CreateCorporateCommand,
  RemoveCorporateContactCommand,
  RemoveRelationshipManagerCommand,
  UpdateCorporateCommand,
  CreateRelationshipManagerCommand,
  UpdateRelationshipManagerInfoCommand,
  CustomerAccountInfo,
  RemoveCorporateAccountCommand,
  CreateIndividualCommand,
  UpdateIndividualInfoCommand
} from '../models/customer.models';
import { CorporateOrIndividual } from '../../transactions/models/transactions.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private readonly baseUrl = `${environment.apiUrl}/v1/api/customers`;

  constructor(private http: HttpClient) {}

  //* Corporate
  createCorporate(command: CreateCorporateCommand): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/corporate`,
      command
    );
  }

  getCorporates(query: CorporateQuery): Observable<PaginatedList<CorporateResponse>> {
    let params = new HttpParams()
      .append('pageNumber', query.pageNumber.toString())
      .append('pageSize', query.pageSize.toString());

    if (query.name) {
      params = params.append('name', query.name);
    }
    if (query.niu) {
      params = params.append('niu', query.niu);
    }

    return this.http.get<PaginatedList<CorporateResponse>>(`${this.baseUrl}/corporates`, { params });
  }

  addBankAccount(command: AddBankAccountCommand): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/corporate/add-bank-account`,
      command
    );
  }

  removeBankAccount(corporateId: string, accountNumber: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/corporate/${corporateId}/remove-bank-account/${accountNumber}`
    );
  }

  addCorporateContact(command: AddCorporateContactCommand): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/corporate/add-contact`,
      command
    );
  }

  removeCorporateContact(command: RemoveCorporateContactCommand): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/corporate/`+command.corporateId +`/contact/`+command.corporateContactId
    );
  }

  assignRelationshipManager(command: AssignRelationshipManagerCommand): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/corporate/assign-relationship-manager`,
      command
    );
  }

  updateCorporate(command: UpdateCorporateCommand): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/corporate`,
      command
    );
  }

  deleteCorporate(corporateId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/corporate/${corporateId}`
    );
  }


   //* RM
  getRelationshipManagers(query: RelationshipManagerQuery): Observable<PaginatedList<RelationshipManagerResponse>> {
    let params = new HttpParams()
      .append('pageNumber', query.pageNumber.toString())
      .append('pageSize', query.pageSize.toString());

    if (query.name) {
      params = params.append('name', query.name);
    }
    if (query.relationshipManagerStatus) {
      params = params.append('relationshipManagerStatus', query.relationshipManagerStatus.toString());
    }

    return this.http.get<PaginatedList<RelationshipManagerResponse>>(`${this.baseUrl}/relationship-managers`, { params });
  }

  activateRelationshipManager(relationshipManagerId: string): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/relationship-manager/${relationshipManagerId}/activate`,
      {}
    );
  }

  createRelationshipManager(command: CreateRelationshipManagerCommand): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/relationship-manager`,
      command
    );
  }

  deleteRelationshipManager(relationshipManagerId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/relationship-manager/${relationshipManagerId}`
    );
  }

  suspendRelationshipManager(relationshipManagerId: string): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/relationship-manager/${relationshipManagerId}/suspend`,
      {}
    );
  }

  updateRelationshipManagerInfo(command: UpdateRelationshipManagerInfoCommand): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/relationship-manager`,
      command
    );
  }

  //* Account data
  getCustomerAccountInfo(clientId: string, customerType: CustomerType): Observable<CustomerInfoResponse> {
    return this.http.get<CustomerInfoResponse>(
      `${this.baseUrl}/clientId/${clientId}/customertype/${customerType}`
    );
  }

  getCustomerAccountByNumber(accountNumber: string, customerId : string | undefined): Observable<CustomerAccountInfo> {
    console.log(accountNumber, customerId);
    return this.http.get<CustomerAccountInfo>(
      `${this.baseUrl}/account-number/${accountNumber}/${customerId}`
    );
  }

  //* Individual
  getIndividuals(query: IndividualQuery): Observable<PaginatedList<IndividualResponse>> {
    let params = new HttpParams()
      .append('pageNumber', query.pageNumber.toString())
      .append('pageSize', query.pageSize.toString());

    if (query.name) {
      params = params.append('name', query.name);
    }
    if (query.niu) {
      params = params.append('niu', query.niu);
    }

    return this.http.get<PaginatedList<IndividualResponse>>(`${this.baseUrl}/individuals`, { params });
  }

  removeRelationshipManager(command: RemoveRelationshipManagerCommand): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/corporate/remove-relationship-manager`,
      { body: command }
    );
  }

  createIndividual(command: CreateIndividualCommand): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/individual`,
      command
    );
  }

  activateIndividual(individualId: string): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/individual/${individualId}/activate`,
      {}
    );
  }

  assignIndividualManager(individualId: string, relationshipManagerId: string): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/individual/${individualId}/relationship-manager/${relationshipManagerId}`,
      {}
    );
  }

  deleteIndividual(individualId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/individual/${individualId}`
    );
  }

  removeIndividualManager(individualId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/individual/${individualId}/relationship-manager`
    );
  }

  suspendIndividual(individualId: string): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/individual/${individualId}/suspend`,
      {}
    );
  }

  updateIndividualInfo(command: UpdateIndividualInfoCommand): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/individual`,
      command
    );
  }

  //* ANDA
  requestIndividualAnda(individualId: string): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/individual/${individualId}/anda`,
      {}
    );
  }

  requestCorporateAnda(corporateId: string): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/corporate/${corporateId}/anda`,
      {}
    );
  }

  getCustomerAndaAttestation(customerType: CorporateOrIndividual, customerId: string): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/${customerType}/anda/${customerId}`,
      { responseType: 'blob' }
    );
  }
}
