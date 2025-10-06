export interface CorporateResponse {
  id: string;
  name: string;
  niu: string;
  address: string;
  registrationNumber: string;
  clientFolderPath?: string;
  createdDate: Date;
  createdBy: string;
  lastUpdatedDate: Date;
  lastUpdatedBy: string;
  relationshipManagerId?: string;
  relationshipManagerName?: string;
  corporateStatus: CorporateStatus;
  bankAccounts: Account[];
  corporateContacts: CorporateContact[];
  miseEnDemeureStatusForExport: MiseEnDemeureStatus;
  miseEnDemeureStatusForImport: MiseEnDemeureStatus;
  adnaReportStatus: ADNAReportStatus;
}

export enum CorporateStatus {
  Active = 1,
  Suspended = 2,
  Delete = 3
}


export enum Position {
  MD = 'MD',
  CFO = 'CFO',
  Tresurer = 'Tresurer',
  Other = 'Other'
}

export interface CustomerInfoResponse {
  clientId? : string;
  name?: string;
  address?: string;
  niu?: string;
  phone?: string;
  email?: string;
  customerType: CustomerType;
}

export enum CustomerType {
  Individual = 'Individual',
  Corporate = 'Corporate'
}

export interface IndividualResponse {
  id: string;
  name: string;
  niu: string;
  address?: string;
  city?: string;
  email?: string;
  phone?: string;
  clientFolderPath?: string;
  createdDate: Date;
  createdBy: string;
  lastUpdatedDate: Date;
  lastUpdatedBy: string;
  relationshipManagerId?: string;
  relationshipManagerName?: string;
  individualStatus: IndividualStatus;
  bankAccount: Account;
  miseEnDemeureStatusForExport: MiseEnDemeureStatus;
  miseEnDemeureStatusForImport: MiseEnDemeureStatus;
  adnaReportStatus: ADNAReportStatus;
}

export interface RelationshipManagerResponse {
  id: string;
  name: string;
  email: string;
  relationshipManagerStatus: RelationshipManagerStatus;
  createdDate: Date;
  createdBy: string;
  lastUpdatedDate: Date;
  lastUpdatedBy: string;
}

export enum RelationshipManagerStatus {
  Active = 1,
  Suspended = 2,
  Delete = 3
}

export interface Account {
  branchCode: string;
  customerId: string;
  accountNumber: string;
  accountName: string;
}

export interface CorporateQuery {
  corporateId?:string | null;
  name?: string;
  niu?: string;
  pageNumber: number;
  pageSize: number;
}

export interface IndividualQuery {
  individualId ?:string | null;
  name?: string;
  niu?: string;
  pageNumber: number;
  pageSize: number;
}

export interface RelationshipManagerQuery {
  name?: string;
  relationshipManagerStatus?: RelationshipManagerStatus;
  pageNumber: number;
  pageSize: number;
}

export interface AddBankAccountCommand {
  corporateId: string;
  accountName: string;
  accountNumber: string;
  branch: string;
}
export interface AddCorporateContactCommand {
  corporateId: string;
  position: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  comment: string;
}

export interface AssignRelationshipManagerCommand {
  corporateId: string;
  relationshipManagerId: string;
}
export interface CreateCorporateCommand {
  corporateId: string;
  name: string;
  address: string;
  registrationNumber: string;
  niu: string;
}
export interface RemoveCorporateContactCommand {
  corporateId: string;
  corporateContactId: string;
}

export interface RemoveRelationshipManagerCommand {
  corporateId: string;
}

export interface UpdateCorporateCommand {
  corporateId: string;
}

export interface CorporateResponse {
  id: string;
  name: string;
  niu: string;
  address: string;
  registrationNumber: string;
  clientFolderPath?: string;
  createdDate: Date;
  createdBy: string;
  lastUpdatedDate: Date;
  lastUpdatedBy: string;
  relationshipManagerId?: string;
  bankAccounts: Account[];
  corporateContacts: CorporateContact[];
}

export interface CorporateContact {
  corporateContactId: string;
  corporateId?: string;
  position: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  comment?: string;
}


export interface CustomerInfoResponse {
  name?: string;
  address?: string;
  niu?: string;
  phone?: string;
  email?: string;
  customerType: CustomerType;
  registrationNumber?: string;
}



export interface IndividualResponse {
  id: string;
  name: string;
  niu: string;
  address?: string;
  city?: string;
  email?: string;
  phone?: string;
  clientFolderPath?: string;
  createdDate: Date;
  createdBy: string;
  lastUpdatedDate: Date;
  lastUpdatedBy: string;
  relationshipManagerId?: string;
  relationshipManagerName?: string;
  individualStatus: IndividualStatus;
  bankAccount: Account;
}
export enum IndividualStatus {
  Active = 1,
  Suspended = 2,
  Delete = 3
}

export interface RelationshipManagerResponse {
  id: string;
  name: string;
  email: string;
  relationshipManagerStatus: RelationshipManagerStatus;
  createdDate: Date;
  createdBy: string;
  lastUpdatedDate: Date;
  lastUpdatedBy: string;
}



export interface Account {
  branchCode: string;
  customerId: string;
  accountNumber: string;
  accountName: string;
}

export interface CorporateQuery {
  name?: string;
  niu?: string;
  pageNumber: number;
  pageSize: number;
}

export interface IndividualQuery {
  name?: string;
  niu?: string;
  pageNumber: number;
  pageSize: number;
}

export interface RelationshipManagerQuery {
  name?: string;
  pageNumber: number;
  pageSize: number;
}

export interface AddBankAccountCommand {
  corporateId: string;
  accountName: string;
  accountNumber: string;
  branch: string;
}
export interface AddCorporateContactCommand {
  corporateId: string;
  position: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  comment: string;
}

export interface AssignRelationshipManagerCommand {
  corporateId: string;
  relationshipManagerId: string;
}
export interface CreateCorporateCommand {
  corporateId: string;
  name: string;
  address: string;
  registrationNumber: string;
  niu: string;
}
export interface RemoveCorporateContactCommand {
  corporateId: string;
  corporateContactId: string;
}

export interface RemoveRelationshipManagerCommand {
  corporateId: string;
}

/* export interface UpdateCorporateCommand {
  corporateId: string;
  name: string;
  address: string;
  registrationNumber: string;
  niu: string;
} */

export interface ActivateRelationshipManagerCommand {
  relationshipManagerId: string;
}
export interface CreateRelationshipManagerCommand {
  name: string;
  email: string;
}
export interface UpdateRelationshipManagerInfoCommand {
  relationshipManagerId: string;
  name: string;
  email: string;
}

export interface CustomerAccountInfo {
  customerId: string;
  balance: number;
  accountNumber: string;
  accountName: string;
  branchId: string;
}

export interface RemoveCorporateAccountCommand {
  corporateId: string;
  accountNumber: string;
}


export interface ActivateIndividualCommand {
  individualId: string;
}
export interface AssignIndividualRelationshipManagerCommand {
  individualId: string;
  relationshipManagerId: string;
}

export interface CreateIndividualCommand {
  individualId: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  accountNumber: string;
  branch: string;
  niu: string;
}

export interface DeleteIndividualCommand {
  individualId: string;
}

export interface RemoveIndividualRelationshipManagerCommand {
  individualId: string;
}
export interface SuspendIndividualCommand {
  individualId: string;
}
export interface UpdateIndividualInfoCommand {
  individualId: string;
  name: string;
  address?: string;
  city?: string;
  email?: string;
  phone?: string;
  accountNumber: string;
  branch: string;
  niu: string;

}


export enum MiseEnDemeureStatus {
  No = 1,
  Yes = 2
}

export enum ADNAReportStatus {
  NotAvalaible = 1,
  Running = 2,
  Available = 3
}
