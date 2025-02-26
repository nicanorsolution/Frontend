
export class Utility {
 static formatDate(to: Date): any {
   // Format the date as yyyy-MM-dd
   const day = String(to.getDate()).padStart(2, '0');
   const month = String(to.getMonth() + 1).padStart(2, '0'); // Months are zero-based
   const year = to.getFullYear();

   return `${year}-${month}-${day}`;
  }

 
 static actionDone(item: string, action: string): string {
   switch (action) {
        case 'CreationAction':
            return item+ ' was created but need to be approved';
         case 'ModificationToUpdateAction':
            return item+ ' was modified and sent for approval';
        case 'ModificationToDeleteAction':
            return item+ ' sent for deletion';
        default:
            return 'No pending action';
   }
 }

 static  colorStatus(status: string) :string {
    switch (status) {
        case 'Approved':
            return 'success';
        case 'ACCEPTED':
              return 'success';
        case 'Created':
            return 'warning';
        case 'Pending':
              return 'warning';
        case 'Canceled':
            return 'danger';
        case 'Opened':
           return 'success';
        case 'Locked':
           return 'danger';
        case 'Yes':
          return 'success';
        case 'No':
          return 'danger';
          case 'Current':
            return 'success';
          case 'History':
            return 'danger';
        case 'PENDING':
          return 'warning';
        case 'Success':
          return 'success';
        case 'Failed':
          return 'danger';
       case 'Deleted':
            return 'danger';
        case 'SUCCESS':
            return 'success';
       case 'BANK_ACCEPTED':
              return 'success';
        case 'CANCELLED':
            return 'danger';
        case 'CANCELED':
              return 'danger';
         case 'REJECTED':
                return 'danger';
         case 'AMBIGUOUS':
                return 'warning';
         case 'Ambiguous':
                  return 'warning';
         case 'Paid':
                    return 'success';
                    case 'ReceivedFailed':
                      return 'danger';
         default:
            return 'info';

    }
  }
}

export class SwitchConstants {
  static readonly GIMAC = "GIMAC";
  static readonly INTERNAL = "INTERNAL";
  static readonly SYSTAC = "SYSTAC";
  static readonly SYGMA = "SYGMA";
  static readonly NOSWITCH = "NOSWITCH";


  static getCorrespondingSwitch(paymentMethodId: string): string {
      switch (paymentMethodId) {
          case PaymentMethodSeed.BILL_PAYMENT_GIMAC:
          case PaymentMethodSeed.CARDLESS_WITHDRAWAL:
          case PaymentMethodSeed.DFT_MOBILE_GIMAC:
          case PaymentMethodSeed.MERCHANT_PAYMENT_GIMAC:
          case PaymentMethodSeed.DFT_BANK_GIMAC:
          case PaymentMethodSeed.TOPUP_MOBILE:
          case PaymentMethodSeed.CBFT_REMITTANCE_OUT:
              return SwitchConstants.GIMAC;

          case PaymentMethodSeed.DFT_BANK_SYSTAC:
              return SwitchConstants.SYSTAC;

          case PaymentMethodSeed.MERCHANT_PAYMENT_INTERNAL:
          case PaymentMethodSeed.BKT:
          case PaymentMethodSeed.CHEQUE:
          case PaymentMethodSeed.CASH_AT_BANK_COUNTER:
              return SwitchConstants.INTERNAL;

          default:
              return SwitchConstants.NOSWITCH;
      }
  }
}


export enum PaymentMethodSeed {
  BILL_PAYMENT_GIMAC = "BILL_PAYMENT_GIMAC",
  DFT_BANK_SYSTAC = "DFT_BANK_SYSTAC",
  CARDLESS_WITHDRAWAL = "CARDLESS_WITHDRAWAL",
  CBFT_REMITTANCE_OUT = "CBFT_REMITTANCE_OUT",
  DFT_MOBILE_GIMAC = "DFT_MOBILE_GIMAC",
  MERCHANT_PAYMENT_GIMAC = "MERCHANT_PAYMENT_GIMAC",
  DFT_BANK_GIMAC = "DFT_BANK_GIMAC",
  TOPUP_MOBILE = "TOPUP_MOBILE",
  MERCHANT_PAYMENT_INTERNAL = "MERCHANT_PAYMENT_INTERNAL",
  BKT = "BKT",
  CHEQUE = "CHEQUE",
  CASH_AT_BANK_COUNTER = "CASH_AT_BANK_COUNTER",
  // Add other payment method seeds as needed
}

export enum RolePermissions {
  ChannelUserRole = "channel_user_role",
  SuperAdministratorRole = "super_administrator_role",
  AdministratorRole = "administrator_role",
  OperationRole = "operation_role",
  AuditControlRole = "audit_control_role",
}


export class DateFormater {
  static addDaysAndFormat(date: Date, daysToAdd: number): string {
    // Create a new Date object to avoid mutating the original date
    const newDate = new Date(date);
    // Add the specified number of days
    newDate.setDate(newDate.getDate() + daysToAdd);

    // Format the date as dd-mm-yyyy
    const day = String(newDate.getDate()).padStart(2, '0');
    const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = newDate.getFullYear();

    return `${year}-${month}-${day}`;

}

/* // Example usage:
const currentDate = new Date();
const daysToAdd = 5;
const formattedDate = addDaysAndFormat(currentDate, daysToAdd);
console.log(formattedDate); // Output: dd-mm-yyyy format */

}
0
