import { CorporateOrIndividual, DocumentSubmissionOption } from "../../transactions/models/transactions.model";

export interface CreateExportationCommand {
    corporateOrIndividual: CorporateOrIndividual;
    corporateId: string | null;
    individualId: string | null;
    eForceReference: string;
}

export interface CreateExportationCommandResponse {
    exportationId: number;
    exportationReference: string;
}

export interface ExportationResponse {
    id: string;
    exportationReference: string;
    corporateId: string | null;
    individualId: string | null;
    corporateOrIndividual: CorporateOrIndividual;
    exportationCreatedDate: Date;
    customerName: string;
    exportationStatus: ExportationStatus;
    exportationApurementStatus: ExportationApurementStatus;
    exportationApurementDate: Date | null;
    deDetails: DEDetails;
    deFeeAmount: number;
    deFeeStatus: DEFeeStatus;
    deFeeCollectionDate: Date | null;
    deFeeCollectionMessage: string | null;
    exportationExceptionsCount: number;
    exportationExceptionsPendingCount: number;
    numberDaysSinceDomiciliation : number;
    incomingResponses: IncomingResponse[];
    incomingRetrocessionResponses: IncomingRetrocessionResponse[];
    referenceFactureDefinitive: string | null;
    amountFactureDefinitive: number | null;
    referenceBonForEmbarquement: string | null;
    amountBonForEmbarquement: number | null;
    dateBonForEmbarquement: Date | null;
}

export interface IncomingResponse {
    serialNumber: string;
    incomingDate: Date;
    incomingValueDate: Date;
    hasIncomingSwiftFilePath: boolean;
    incomingSwiftReference: string;
    currency: string;
    incomingAmount: number;
    incomingAccountNumber: string;
    incomingStatus: IncomingStatus;

}

export interface IncomingRetrocessionResponse {
  serialNumber: string;
  registrationDate: Date;
  currency: string;
  amountThatShouldBeRefund: number;
  refundReference: string;
  hasRefundSwiftFilePath: boolean;
  incomingRetrocessionStatus: IncomingRetrocessionStatus;
}

export enum IncomingRetrocessionStatus {
    Created = 0,
    Deleted = 1
}

export enum IncomingStatus {
    Received = 0,
    Deleted = 1
}

export enum ExportationStatus {
    ExportationDrafted = 0,
    ExportationInitiated = 1,
    ExportationCancelled = 2,
    ExportationCompleted = 3
}

export enum ExportationApurementStatus {
    WaitingApurement,
    NotApured,
    ApuredPartially,
    Apured
}

export enum DEFeeStatus
{
    PaymentNotProcessed,
    PaymentBeingProcessed,
    PaymentProcessed,
    PaymentFailed
}

export interface DEDetails {
  eForceReference: string;
  fileNumber: string;
  requestDate: Date | null;
  domiciliationReference: string;
  domiciliationDate: Date | null;
  provider: string;
  buyer: string;
  placeOfDestination: string;
  fobValueCfa: number;
  bankDEDomiciliationDate: Date | null;
  deadLineForRepatriationOfFunds: Date | null;
  exportationType: string | null;
  deEmissionDate: Date | null;
  deExpirationDate: Date | null;
  fullDomiciliationReference: string | null;
  goodOrServiceNature: string | null;
}

export interface GetExportationsQuery {
    exportationReference?: string;
    customerName?: string;
    startDate?: Date;
    endDate?: Date;
    pageNumber: number;
    pageSize: number;
}

export interface ExportationFileResponse {
    id: string;
    exportationId: string;
    documentId: string;
    documentName: string;
    documentOriginalName: string | null;
    documentSize: number;
    documentPath: string | null;
    exportationFileStatus: ExportationFileStatus;
    reviewNote: string | null;
    documentSubmissionOption: DocumentSubmissionOption;
    notifyClientOfReviewNote: boolean;
}

export interface ExportationFileHistoryResponse {
    id: string;
    exportationId: string;
    documentId: string;
    documentName: string;
    documentOriginalName: string | null;
    documentSize: number;
    documentPath: string | null;
    exportationFileStatus: ExportationFileStatus;
    reviewNote: string | null;
    documentSubmissionOption: DocumentSubmissionOption;
    notifyClientOfReviewNote: boolean;
    history: string | null;
    lastUpdatedDate: Date;
    lastUpdateBy: string;
}
export enum ExportationFileStatus {
    DocumentAwaited = 1,
    DocumentUploadedNotYetReview = 2,
    DocumentReviewOk = 3,
    DocumentReviewFailed = 4,
    DocumentNotProvided = 5,
    DocumentNewOrReplacementRequired = 6
}

export interface ExportationMessageResponse {
    id: string;
    exportationId: string;
    message: string;
    messageType: string;
    createdDate: Date;
    createdBy: string;
    exportationMessageType: ExportationMessageType;
}

export enum ExportationMessageType {
    ExportationRelated,
    ExportationFileRelated,
    ExportationExceptionRelated,
    ExportationSwiftFile,
    ApurementRelated,
    ProcessingDEPaymentRelated,
    IncomingRelated,
    IncomingRetrocessionRelated
}

export interface CreateExportationIncomingCommand {
    exportationId: number;
    corporateOrIndividual: CorporateOrIndividual;
    corporateId: string | null;
    individualId: string | null;
    accountNumber: string;
    valueDate : Date;
    amount: number;
    currency: string;
    swiftReference: string;
    swiftFile: File;
}

export interface CreateExportationIncomingRetrocessionCommand {
  exportationId: string;
  amountThatShouldBeRefund: number;
  refundReference: string;
  swiftFile: File;
}

export interface ReviewExportationFileCommand {
    exportationId: string;
    exportationFileId: string;
    exportationFileStatus: ExportationFileStatus;
    reviewerNote: string;
}

export interface RaiseExportationExceptionCommand {
    exportationId: string;
    exceptionDirectedTo: ExceptionDirectedTo;
    internalNote: string;
    clientNote: string;
    severity: Severity;
    exceptionResolverEmail: string[];
    exportationFileCausingException: string[];
    isExportationFileReviewNoteAdded: boolean;
}

export enum ExceptionDirectedTo {
  Client,
  Bank
}

export enum Severity {
  Low,
  Medium,
  High
}

export interface UpdateExportationExceptionCommand {
    exportationId: number;
    exportationExceptionId: string;

    internalNote: string;
    exceptionStatus: ExceptionStatus;
}
export interface UpdateExportationFactureDefinitiveCommand {
  exportationId: string;
  referenceFactureDefinitive: string;
  amountFactureDefinitive: number;
}

export interface UpdateExportationBonForEmbarquementCommand {
  exportationId: string;
  referenceBonForEmbarquement: string;
  amountBonForEmbarquement: number;
  dateBonForEmbarquement: Date;
}

export enum ExceptionStatus {
     Open,
    ApprovedWhileWaitingExpcetionResolution,
    Canceled,
    Resolved
}

export interface ExportationExceptionResponse {
    id: string;
    exportationId: string;
    exceptionSerialNumber: number;
    dateCreated: Date | null;
    exceptionResolver: string[];
    rm: string;
    cc: string;
    attachedEmail: string | null;
    internalNote: string | null;
    clientNote: string | null;
    severity: Severity;
    exceptionStatus: ExceptionStatus;
    exceptionDirectedTo: ExceptionDirectedTo;
    exportationFileCausingException: string[];
    isExportationFileReviewNoteAdded: boolean;
    exceptionRaiserName: string;
}
