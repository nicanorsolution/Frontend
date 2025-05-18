import { Injectable } from '@angular/core';


interface SwiftTransactionDetails {
    transactionReference: string;
    amount: number;
    currency: string;
    valueDate: Date;
    beneficiaryAccount?: string;
    beneficiaryNameAddress?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class SwiftParserService {

    constructor() {}
   parseSwiftMessage(fileContent: string): SwiftTransactionDetails {
        const details: SwiftTransactionDetails = {
            transactionReference: '',
            amount: 0,
            currency: '',
            valueDate: new Date()
        };

        const lines = fileContent.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Process main transaction details
            this.processTransactionReference(line, details);
            this.processAmountCurrencyDate(line, details);

            // Process beneficiary details when F59 field is found
            if (line.trim().startsWith('F59:')) {
                const beneficiaryResult = this.processBeneficiaryDetails(lines, i);
                details.beneficiaryAccount = beneficiaryResult.account;
                details.beneficiaryNameAddress = beneficiaryResult.nameAddress;
                i = beneficiaryResult.newIndex; // Skip processed lines
            }
        }

        return details;
    }

    private processTransactionReference(line: string, details: SwiftTransactionDetails): void {
        const refMatch = line.match(/Transaction Reference:\s+(\S+)/);
        if (refMatch) {
            details.transactionReference = refMatch[1];
        }
    }

    private processAmountCurrencyDate(line: string, details: SwiftTransactionDetails): void {
        const amountMatch = line.match(/Amount:\s+([\d,]+)\s+Currency:\s+(\w{3})\s+Value Date:\s+(\d{2}\/\d{2}\/\d{2})/);
        if (amountMatch) {
            details.amount = parseFloat(amountMatch[1].replace(',', '.'));
            details.currency = amountMatch[2];
            const [day, month, year] = amountMatch[3].split('/');
            details.valueDate = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
        }
    }

    private processBeneficiaryDetails(lines: string[], startIndex: number): 
        { account: string, nameAddress: string[], newIndex: number } {
        let account = '';
        const nameAddress: string[] = [];
        let section: 'account' | 'nameAddress' | null = null;

        for (let i = startIndex + 1; i < lines.length; i++) {
            const trimmedLine = lines[i].trim();

            // Stop processing if we hit another SWIFT field
            if (trimmedLine.startsWith('F') && /\d+:/.test(trimmedLine)) break;

            if (trimmedLine.startsWith('Account:')) {
                section = 'account';
            } else if (trimmedLine.startsWith('Name and Address:')) {
                section = 'nameAddress';
            } else if (section === 'account') {
                // Extract account number after optional slash
                const accountMatch = trimmedLine.match(/\/(\d+)/);
                if (accountMatch) account = accountMatch[1];
                section = null;
            } else if (section === 'nameAddress' && trimmedLine) {
                nameAddress.push(trimmedLine);
            }
        }

        return { 
            account, 
            nameAddress,
            newIndex: startIndex + nameAddress.length + 5 // Estimated line skip
        };
    }
}