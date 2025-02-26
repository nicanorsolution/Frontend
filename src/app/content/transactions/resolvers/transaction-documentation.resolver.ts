import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { TransactionService } from '../services/transctions.service';
import { TransactionResponse, TransactionFileResponse } from '../models/transactions.model';
import { delay, map, switchMap } from 'rxjs/operators';

export interface TransactionDocumentationData {
  transaction: TransactionResponse | null;
  documents: TransactionFileResponse[];
}

@Injectable({
  providedIn: 'root'
})
export class TransactionDocumentationResolver implements Resolve<TransactionDocumentationData> {
  constructor(private transactionService: TransactionService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<TransactionDocumentationData> {
    const transactionReference = route.queryParams['transactionReference'];

    return this.transactionService.getTransactions({
      transactionReference: transactionReference,
      pageNumber: 1,
      pageSize: 1
    }).pipe(
      delay(100),
      map(response => response.items.find(t => t.transactionReference === transactionReference) || null),
      switchMap(transaction => {
        if (!transaction) {
          return of({ transaction: null, documents: [] });
        }

        return forkJoin({
          transaction: of(transaction),
          documents: this.transactionService.getTransactionFiles(transaction.id)
        });
      })
    );
  }
}
