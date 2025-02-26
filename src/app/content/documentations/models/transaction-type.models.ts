
export interface TransactionTypeQuery {
  transactionTypeStatus?: TransactionTypeStatus;
}

export interface TransactionTypeResponse {
  transactionTypeId: string;
  transactionTypeNameFr: string;
  transactionTypeNameEn: string;
  transactionTypeStatus: TransactionTypeStatus;
  transactionDirection: TransactionDirection;
  appurementRequired: AppurementRequired;
  documentsRequestedList: string[];
  lastModifyBy: string;
  lastUpdatedDate: Date;
}

export enum TransactionTypeStatus {
  Active = 1,
  Suspended = 2,
  Delete = 3
}

export interface CreateTransactionTypeCommand {
  transactionTypeNameFr: string;
  transactionTypeNameEn: string;
  transactionDirection: TransactionDirection;
  appurementRequired: AppurementRequired;
}

export enum TransactionDirection {
  Importation = 1,
  Exportation = 2
}

export enum AppurementRequired {
  No = 1,
  Yes = 2
}
