export interface CorporateLookupName {
  corporateId: string;
  name: string;
}
export interface IndividualLookupName {
  individualId: string;
  name: string;
}


export interface StandardTransferRateResponse {
  id: string;
  historyVersion: string;
  baseCurrency: string;
  quoteCurrency: string;
  baseSellRate: number;
  maximunSellRate: number;
  spreadInPercentage: number;
  commissionInPercentageForNonFinanceTransfer: number;
  commissionInPercentageForFinanceTransfer: number;
  baseBuyRate: number;
  transferRateDate: Date;
}

export interface SpecialPricingForIndividualResponse {
  id: string;
  individualId: string;
  individualName: string;
  individualNIU: string;
  baseCurrency: string;
  quoteCurrency: string;
  startDate: Date;
  endDate: Date;
  spreadInPercentage: number;
  commissionInPercentageForNonFinanceTransfer: number;
  commissionInPercentageForFinanceTransfer: number;
  lastUpdatedDate: Date;
  lastUpdateBy: string;
  isDeleted: boolean;
}

export interface SpecialPricingForCorporateResponse {
  id: string;
  corporateId: string;
  corporateName: string;
  corporateNUI: string;
  baseCurrency: string;
  quoteCurrency: string;
  startDate: Date;
  endDate: Date;
  spreadInPercentage: number;
  commissionInPercentageForNonFinanceTransfer: number;
  commissionInPercentageForFinanceTransfer: number;
  lastUpdatedDate: Date;
  lastUpdateBy: string;
  isDeleted: boolean;
}

export interface UpdateDailyTransferRateForCurrencyCommand {
  standardDailyTransferRateId: string;  // Guid maps to string in TypeScript
  baseSellRate: number;                 // decimal maps to number in TypeScript
  spreadInPercentage: number;
  commissionInPercentageForNonFinanceTransfer: number;
  commissionInPercentageForFinanceTransfer: number;
  baseBuyRate: number;
}

export interface CreateSpecialPricingForCorporateCommand {
  corporateId: string;
  baseCurrency: string;
  quoteCurrency: string;
  startDate: Date;
  endDate: Date;
  spreadInPercentage: number;
  commissionInPercentageForNonFinanceTransfer: number;
  commissionInPercentageForFinanceTransfer: number;
}

export interface DeleteSpecialPricingForCorporateCommand {
  corporateId: string;
}

export interface UpdateSpecialPricingForCorporateCommand {
  corporateId: string;
  specialRateId: string;
  startDate: Date;
  endDate: Date;
  spreadInPercentage: number;
  commissionInPercentageForNonFinanceTransfer: number;
  commissionInPercentageForFinanceTransfer: number;
}

export interface CreateSpecialPricingForIndividualCommand {
  individualId: string;
  baseCurrency: string;
  quoteCurrency: string;
  startDate: Date;
  endDate: Date;
  spreadInPercentage: number;
  commissionInPercentageForNonFinanceTransfer: number;
  commissionInPercentageForFinanceTransfer: number;
}

export interface DeleteSpecialPricingForIndividualCommand {
  individualId: string;
}

export interface UpdateSpecialPricingForIndividualCommand {
  individualId: string;
  specialRateId: string;
  startDate: Date;
  endDate: Date;
  spreadInPercentage: number;
  commissionInPercentageForNonFinanceTransfer: number;
  commissionInPercentageForFinanceTransfer: number;
}

