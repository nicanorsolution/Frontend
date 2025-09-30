export interface DEResponse {
  eForceReference: string;
  corporateId?: string;
  individualId?: string;
  corporateOrIndividual?: string;
  fileNumber: string;
  requestDate: Date;
  domiciliationReference: string;
  fullDomiciliationReference: string;
  goodOrServiceNature?: string;
  domiciliationDate: Date;
  bankDEDomiciliationDate?: Date;
  domiciliationValidityPeriodDays: number;
  deadLineForRepatriationOfFunds?: Date;
  deEmissionDate?: Date;
  deValidityPeriodDays: number;
  deExpirationDate?: Date;
  hasDEExpired: boolean;
  exportationType?: string;
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
export interface UpdateDEComplementaryInfoCommand {
  eForceReference: string;
  bankDEDomiciliationDate: Date;
  domiciliationValidityPeriodInDays: number;
  deEmissionDate: Date;
  deValidityPeriodInDays: number;
  exportationType: ExportationType;
  goodOrServiceNature?: string;
}

export enum ExportationType
{
    Bien = 1,
    Service = 2
}
