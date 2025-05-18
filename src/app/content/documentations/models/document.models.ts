export interface DocumentQuery {
  documentName?: string;
  documentStatus?: DocumentStatus;
}

export interface DocumentResponse {
  documentId: string;
  documentNameFr: string;
  documentNameEn: string;
  documentStatus: DocumentStatus;
  documentSubmissionOption: DocumentSubmissionOption;
  documentOriginalRequired: boolean;
  documentControls: DocumentControl[];
  lastModifyBy: string;
  lastUpdatedDate: Date;
}
export interface CreateDocumentCommand {
  documentNameFr: string;
  documentNameEn: string;
  documentSubmissionOption: DocumentSubmissionOption;
  documentOriginalRequired: boolean;
}


export interface DocumentControl {
  documentControlId: string;
  documentControlName: string;
  documentControlDetail: string;
  documentControlType: DocumentControlType;
}

export interface DocumentControlRequest {
  documentControlName: string;
  documentControlDetail: string;
  documentControlType: DocumentControlType;
}

export enum DocumentControlType {
  Mandatory = 1,
  Depend = 2,
  Optional = 3
}

export enum DocumentStatus {
  Active = 1,
  Suspended = 2,
  Delete = 3
}

export enum DocumentSubmissionOption {
   SubmissionBeforeProcessing = 1,
    SubmissionAfterProcessing = 2,
    SubmissionForPartialApurement = 3,// mise en demeure lettre dechargé
    SubmissionForFailureToApurement = 4, // mise en demeure lettre dechargé
    DoNotMatters = 5
}
