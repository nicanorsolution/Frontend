import { DIStatus } from "../../di/models/di.models";

export interface CreateTransactionCommand {
  corporateOrIndividual: CorporateOrIndividual;
  corporateId?: string;
  individualId?: string;
  customerAccount: string;
  transactionAmount: number;
  transactionCurrency: string;
  transactionTypeId: string;
  beneficiaryAccount: string;
  beneficiaryAccountName: string;
  bankSwift: string;
  bankName: string;
  bankAddress: string;
  paymentDetails: string;
}

export interface RaiseTransactionExceptionCommand {
  transactionId: string;
  exceptionDirectedTo: ExceptionDirectedTo;
  exceptionResolverEmail: string[];
  internalNote: string;
  clientNote: string;
  severity: Severity;

  // this is picked from the list of transaction files reviewed ,
  // if the transaction file is not reviewed then it should not be included in the list
  transactionFileCausingException: string[];
  isTransactionFileReviewNoteAdded: boolean;
}
export interface TransactionExceptionResponse {
  id: string;
  transactionId: string;
  exceptionSerialNumber: number;
  dateCreated : Date;
  exceptionResolver: string[];
  rm: string;
  cc: string;
  attachedEmail: string;
  internalNote: string;
  clientNote: string;
  severity: Severity;
  exceptionStatus: ExceptionStatus;
  exceptionDirectedTo: ExceptionDirectedTo;
  transactionFileCausingException: string[];
  isTransactionFileReviewNoteAdded: boolean;
}

export interface TransactionExceptionHistoryResponse {
  id: string;
  transactionId: string;
  lastUpdatedDate?: Date;
  lastUpdatedBy?: string;
  attachedEmail?: string;
  internalNote?: string;
  exceptionStatus: ExceptionStatus;
}


export interface ExceptionResolverContactResponse {
  email: string;
  contactName: string;
  contactPosition : string;
}
export interface UpdateTransactionExceptionCommand {
  transactionId: string;
  transactionExceptionId: string;
  internalNote: string;
  exceptionStatus: ExceptionStatus;
}

export interface ReviewTransactionFileCommand {
  transactionId: string;
  transactionFileId: string;
  transactionFileStatus: TransactionFileStatus;
  reviewerNote: string;
}
export enum ExceptionStatus {
  Open,
  ApprovedWhileWaitingExpcetionResolution,
  Canceled,
  Resolved
}
export enum Severity {
  Low,
  Medium,
  High
}

export enum ExceptionDirectedTo {
  Client,
  Bank
}
export enum CorporateOrIndividual {
  Corporate ,
  Individual
}


export enum TransactionApurementStatus {
  WaitingApurement,
  NotApured,
  Apured,
  ApuredPartially,
  NotApplicable
}
export enum ReferenceMT {
  MT228 ,
  MT103 ,
  MT900
}

export interface GetTransactionQuery {
  transactionReference?: string;
  customerAccountName?: string;
  customerAccountNumber?: string;
  startDate?: Date;
  endDate?: Date;
  pageNumber: number;
  pageSize: number;
}

export interface TransactionResponse {
  id: string;
  transactionReference: string;
  corporateId?: string;
  individualId?: string;
  corporateOrIndividual: CorporateOrIndividual;
  transactionDate: Date;
  customerAccountName: string;
  customerAccountNumber: string;
  transactionAmount: number;
  transactionCurrency: string;
  transactionAmountLocalCurrency: number;
  transactionAmountToLienLocalCurrency: number;
  transactionTypeName?: string;
  status: TransactionStatus;
  processingType?: ProcessingType;
  initiationMethod: InitiationMethod;
  beneficiaryAccountNumber: string;
  beneficiaryAccountName: string;
  bankSwift: string;
  bankName: string;
  bankAddress: string;
  paymentDetails: string;
  transactionExceptionsCount: number;
  transactionExceptionsPendingCount: number;
  processingDate?: Date;
  transactionApurementStatus: TransactionApurementStatus;
  transactionDIStatus : TransactionDIStatus;
  transactionProvisionStatus : TransactionProvisionStatus;
  referenceMT228?: string;
  referenceMT103?: string;
  referenceMT900?: string;
  referenceMT228File?: string;
  referenceMT103File?: string;
  referenceMT900File?: string;
  historyVersion  : string;
  isSpecialPricing: boolean;
  rate: number;
  rateDate?: Date;
  spreadInPercentage: number;
  principalAmountInBaseCurrency: number;
  financialCommissionInPercentage: number;
  financialCommission: number;
  financialCommissionTax: number;
  nonFinancialCommissionInPercentage: number;
  nonFinancialCommission: number;
  nonFinancialCommissionTax: number;
  amountToLienLocalCurrency: number;
  isDebitAdviceFound : boolean;
  transactionAmountLienStatus: TransactionAmountLienStatus;
  correctionComment?: string;
  correctionDate?: Date;
  correctionUserName?: string;
  isCorrected?: boolean;
  correspondingBankBic?: string ;
  correspondingBankAccountNumber?: string;
  correspondingBankAccountName?: string;
}


export interface TransactionFileResponse {
  id: string;
  documentId :string;
  transactionId: string;
  documentName: string;
  documentOriginalName : string;
  documentSize: number;
  documentPath: string | null;
  transactionFileStatus: TransactionFileStatus;
  reviewNote: string | null;
  documentSubmissionOption: DocumentSubmissionOption;
  notifyClientOfReviewNote: boolean;
  transactionFileHardCopyStatus: TransactionFileHardCopyStatus;
  hardCopyReceivedDate: Date | null;
  hardCopyLastFollowupDate: Date | null;
  hardCopyFollowupCount: number;
}

export interface TransactionProvisionTransferResponse {
  id: string;
  transactionReference: string;
  provisionAccountNumber: string;
  provisionAccountName: string;
  provisionType: string;
  amount: number;
  dateCreated: Date;
  provisionTransferStatus: ProvisionTransferStatus;
  dateProcessed?: Date;
  errorMessage?: string;
}

export interface ProvisionBeforeInitiationResponse {
  financialOutcome?: FinancialOutcome;
  balance?: number;
  currency?: string;
}

export interface FinancialOutcome {
  historyVersion?: string;
  isSpecialPricing?: boolean;
  rate?: number;
  rateDate?: Date;
  spreadInPercentage?: number;
  principalAmountInBaseCurrency?: number;
  financialCommissionInPercentage?: number;
  financialCommission?: number;
  financialCommissionTax?: number;
  nonFinancialCommissionInPercentage?: number;
  nonFinancialCommission?: number;
  nonFinancialCommissionTax?: number;
  amountToLienLocalCurrency?: number;
}


export enum ProvisionTransferStatus {
  Created,
  Processed,
  Failed,
  Retry
}

export interface TransactionApprovalFlowCommand {
  transactionId: string;
  transactionDecisionAction: TransactionDecisionAction;
  userRoleToSendTo?: number; //UserRoleToSendTo
  comment?: string;
}

export enum TransactionFileStatus {
  DocumentAwaited = 1,
  DocumentUploadedNotYetReview = 2,
  DocumentReviewOk = 3,
  DocumentReviewFailed = 4,
  DocumentNotProvided = 5,
  DocumentNewOrReplacementRequired = 6
}


export enum DocumentSubmissionOption {
  SubmissionBeforeProcessing = 1,
  SubmissionAfterProcessing = 2,
  DoNotMatters = 3,
}

export enum TransactionFileHardCopyStatus {
  NotRequired,
  Pending,
  Received
}

export enum TransactionStatus {
  Drafted = 0,
  Initiated = 1,
  Verified = 2,
  TradeAuthorized = 3,
  TreasuryAuthorized = 4,
  TreasuryOperationAuthorized = 5,
  TradeOperationAuthorized = 6,
  Cancelled = 7,
  SentForCorrection = 8
}
export enum TransactionDIStatus {
  NotImputed,
  Imputed
}
export enum TransactionDecisionAction {
  Approve = 1,
  Reject = 2,
  SendForCorrection = 3
}

export enum ProcessingOption {
  SentToBeac = 1,
  SentToBank = 2
}

export enum ProcessingType {
  Prefinancing = 1,
  WeeklyFinancing = 2,
  OwnReservesFinancing = 3,
  Undefined = 4
}
export interface SetCorrespondingBankInfoRequest {
  transactionId: string;
  accountNumber: string;
}
export interface NostroAccountResponse {
  nostroAccountId: number;
  accountNumber: string;
  accountName: string;
  currency: string;
  bankBic: string;
  nostroPurpose: NostroPurpose;
}
export enum NostroPurpose {
  ForPaymentBaseOnPrefinanceReserve = 1,
  ForPaymentBaseOnOurReserve = 2,
  ForBoth = 3
}
export enum InitiationMethod {
  Manual = 1,
  Api = 2
}
export interface DIByClientResponse {
  diId: string;
  diAmount: number | null;
  diCurrency: string;
  diStatus: DIStatus;
  referenceDi: string;
  domiciliationNumberInBank: string | null;
  referenceSgs: string | null;
  providerName: string | null;
  dateCreationDiInEforce?: Date;
  hasDataBeingModified: boolean;
  diComplementaryInfoIsUpdated : boolean;
  soldeInCurrency?: number;

  // this added to the response to be used in actual imputation
  // since each imputation need a comment
  comment: string;
}

export interface TransactionMessageResponse {
  id: string;
  transactionId: string;
  message: string;
  messageType: string;
  createdDate: Date;
  createdBy: string;
  transactionMessageType: TransactionMessageType
}
export enum TransactionMessageType {
  TransactionRelated,
  TransctionFileRelated ,
  DIImputationRelated ,
  TransactionExceptionRelated ,
  TransactionSwiftFile ,
  ApurementRelated,
  ProcessingOptionRelated
}

export interface TransactionFileHistoryResponse {
  id: string;
  transactionId: string;
  documentId: string;
  documentName: string;
  documentOriginalName?: string;
  documentSize: number;
  documentPath?: string;
  transactionFileStatus: TransactionFileStatus;
  reviewNote?: string;
  documentSubmissionOption: DocumentSubmissionOption;
  notifyClientOfReviewNote: boolean;
  transactionFileHardCopyStatus: TransactionFileHardCopyStatus;
  hardCopyReceivedDate?: Date;
  hardCopyLastFollowupDate?: Date;
  hardCopyFollowupCount: number;
  history: string;
  lastUpdatedDate? : Date;
  lastUpdateBy : string;
}

export  enum TransactionProvisionStatus
{
    NotProcessed,
    BeingProcessed,
    Processed,
    Failed
}

export enum TransactionAmountLienStatus {
  AmountNotLien,
  AmountLien
}

export interface RoleToSendBackTransactionResponse {
  role: number;
  roleName: string;
}
