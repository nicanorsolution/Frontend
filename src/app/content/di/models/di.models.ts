export interface ImputeDICommand {
  dIsToImpute: DIToImpute[];           // Guid maps to string in TypeScript
  amountToImpute: number; // decimal maps to number in TypeScript
  currency: string;
  transactionId: string;  // long maps to number in TypeScript
  transactionReference: string;

}

export interface DIToImpute {
  dIId: string;
  comment: string;
}

export interface UpdateGoodsDescriptionCommand {
  dIId: string;
  amountInCurrency: number;
  goodsDescription?: string;
  goodQuantity?: number;
  goodsUnit?: string;
  valeurTotalInDevise?: number;
  billReference?: string;
  billExpiringDate?: Date;
}

export interface DIGoodsUnit {
  diGoodsUnitId: number;
  diGoodsUnitName: string;
}


export interface DI {
  id: string;
  referenceDi: string;
  dateCreationDiInEforce?: Date;
  dateDomiciliationDiInBank?: Date;
  clientName?: string;
  clientNiu?: string;
  clientFolderPath?: string;
  domiciliationNumberInBank?: string;
  referenceSgs?: string;
  providerName?: string;
  providerAddress?: string;
  countryOfGoods?: string;
  transportationMode?: string;
  termeVente?: string;
  currency?: string;
  amountInCurrency?: number;
  amountInXaf?: number;
  soldeInCurrency?: number;
  diStatus: DIStatus;
  hasDataBeingModified: boolean;
  dateDiExpired?: Date;
  goodsDescription?: string;
  goodQuantity?: number;
  goodsUnit?: string;
  valeurTotalInDevise?: number;
  billReference?: string;
  billExpiringDate?: Date;
}

export enum DIStatus {
  NotUsed = 1,
  PartiallyUsed = 2,
  CompletelyUsed = 3
}

export interface DIImputationResponse {
  id: string;
  diId: string;
  referenceDI?: string;
  sgsReference?: string;
  transactionId?: string;
  transactionReference?: string;
  imputationAmount:number;
  imputationCurrency: string;
  imputationStatus: ImputationStatus;
  imputationDate : Date;
  comment: string;
}

export enum ImputationStatus {
  DIImputed,
  DIImputationReversed
}

export interface DIAttestationGenerationResponse {
  id: string;
  diId: string;
  emailToSend: string;
  referenceDI?: string;
  sgsReference?: string;
  referenceLetter?: string;
  typeAttestation: TypeAttestation;
  diAttestationGenerationStatus: DIAttestationGenerationStatus;
  dIStatus: DIStatus;
  dateGenerated?: Date;
  filePath?: string;
}

export enum TypeAttestation {
  ADNF ,
  ADFP,
  ADF
}

export enum DIAttestationGenerationStatus {
  Pending ,
  Generated,
  Failed
}
