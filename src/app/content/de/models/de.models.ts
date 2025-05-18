export interface DEResponse {
    eForceReference: string;
    corporateId?: string;
    individualId?: string;
    corporateOrIndividual?: string;
    fileNumber: string;
    requestDate: Date;
    domiciliationReference: string;
    domiciliationDate: Date;
    provider: string;
    buyer: string;
    placeOfDestination: string;
    bank: string;
    fobValueCfa: number;
    deStatus: DEStatus;
    hasDataBeingModified: boolean;
    message?: string;
    clientNameFromBook?: string;
    createdBy: string;
    createdDate: Date;
}

export enum DEStatus {
    NotUsedForCreatingExport = 1,
    UsedToCreateExport = 2
}