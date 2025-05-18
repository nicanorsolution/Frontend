import { CorporateQuery, IndividualQuery } from './../../customers/models/customer.models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  SpecialPricingForCorporateResponse,
  SpecialPricingForIndividualResponse,
  StandardTransferRateResponse,
  UpdateDailyTransferRateForCurrencyCommand,
  CreateSpecialPricingForIndividualCommand,
  DeleteSpecialPricingForIndividualCommand,
  UpdateSpecialPricingForIndividualCommand,
  CreateSpecialPricingForCorporateCommand,
  DeleteSpecialPricingForCorporateCommand,
  UpdateSpecialPricingForCorporateCommand,
  CorporateLookupName,
  IndividualLookupName
} from '../models/transfer-rates.models';
import { CustomersService } from '../../customers/services/customers.services';

@Injectable({
  providedIn: 'root'
})
export class TransferRatesService {
  private readonly baseUrl = `${environment.apiUrl}/v1/api/transfer-rate`;

  constructor(private http: HttpClient, private customersService: CustomersService) {}

  lookupForCorporate(corporateName : string){
    const query = {
      name : corporateName,
      pageNumber : 1,
      pageSize : 10
    } as CorporateQuery;

    return this.customersService.getCorporates(query).pipe(
      map(x => x.items.map(y => ({ corporateId: y.id, name: y.name }) as CorporateLookupName))
    );
  }

  lookupForIndividual(individualName: string) {
    const query = {
      name: individualName,
      pageNumber: 1,
      pageSize: 10
    } as IndividualQuery;

    return this.customersService.getIndividuals(query).pipe(
      map(x => x.items.map(y => ({ individualId: y.id, name: y.name }) as IndividualLookupName))
    );
  }

  getSpecialPricingForCorporates(corporateId: string): Observable<SpecialPricingForCorporateResponse[]> {
    return this.http.get<SpecialPricingForCorporateResponse[]>(`${this.baseUrl}/corporates/${corporateId}/special-pricing`);
  }

  getSpecialPricingForIndividuals(individualId: string): Observable<SpecialPricingForIndividualResponse[]> {
    return this.http.get<SpecialPricingForIndividualResponse[]>(`${this.baseUrl}/individuals/${individualId}/special-pricing`);
  }

  getStandardTransferRate(): Observable<StandardTransferRateResponse[]> {
    return this.http.get<StandardTransferRateResponse[]>(`${this.baseUrl}/standard`);
  }

  updateDailyTransactionRate(standardDailyTransferRateId: string, command: UpdateDailyTransferRateForCurrencyCommand): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/daily-transaction-rate/${standardDailyTransferRateId}`, command);
  }

  createSpecialPricingForIndividual(command: CreateSpecialPricingForIndividualCommand): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/individual/special-pricing`, command);
  }

  deleteSpecialPricingForIndividual(individualId: string, rateId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/individual/special-pricing/${individualId}/${rateId}`);
  }

  updateSpecialPricingForIndividual(individualId: string, command: UpdateSpecialPricingForIndividualCommand): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/individual/special-pricing/${individualId}`, command);
  }

  createSpecialPricingForCorporate(command: CreateSpecialPricingForCorporateCommand): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/corporate/special-pricing`, command);
  }

  deleteSpecialPricingForCorporate(corporateId: string,rateId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/corporate/special-pricing/${corporateId}/${rateId}`);
  }

  updateSpecialPricingForCorporate(corporateId: string, command: UpdateSpecialPricingForCorporateCommand): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/corporate/special-pricing/${corporateId}`, command);
  }
}
