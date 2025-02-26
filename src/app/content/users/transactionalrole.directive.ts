import { UserRoles } from './user.models';
import { Directive, Input, Renderer2, ElementRef, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { TransactionStatus } from '../transactions/models/transactions.model';

@Directive({
  selector: '[appTransactionalRole]'
})
export class TransactionalRoleDirective implements OnInit {
 // @Input('appRole') role: string[] = [];
  @Input() roles: string[] = [];
//  @Input() allowedStatuses: TransactionStatus[] = [];
  @Input() currentStatus: TransactionStatus | undefined;

  UserRoles = UserRoles;

  constructor(private authService: AuthService, private el: ElementRef, private renderer: Renderer2) { }
  ngOnInit() {
    const token = this.authService.getDecodedToken();
    console.log('appTransactionalRole token', token);
    console.log('appTransactionalRole roles', this.roles);
/*
    if (token && token.UserRoles == this.roles.find((r) => r == token.UserRoles)) {
      this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
    } else {
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
    } */
    // this.el.nativeElement.style.display = 'none';
    // Check if user has any of the required roles
    const hasRole = token && token.UserRoles == this.roles.find((r) => r == token.UserRoles);

    // Check if current status is in allowed statuses
  //  const hasStatus = this.currentStatus ? this.allowedStatuses.includes(this.currentStatus) : false;

    let userCanAction = false;
    console.log('appTransactionalRole currentStatus', this.currentStatus);

    switch (this.currentStatus) {
      case TransactionStatus.Drafted:
        userCanAction = this.roles.find((r) => r == token.UserRoles) == UserRoles.TradeInitiator.toString();
        break;
      case TransactionStatus.SentForCorrection:
        userCanAction = this.roles.find((r) => r == token.UserRoles) == UserRoles.TradeInitiator.toString();
        break;
      case TransactionStatus.Initiated:
        userCanAction = this.roles.find((r) => r == token.UserRoles) == UserRoles.Verifier.toString();
        break;
      case TransactionStatus.Verified:
        userCanAction = this.roles.find((r) => r == token.UserRoles) == UserRoles.TradeAuthorizer.toString();
        break;
      case TransactionStatus.TradeAuthorized:
        userCanAction = this.roles.find((r) => r == token.UserRoles) == UserRoles.TreasuryAuthorizer.toString();
        break;
      case TransactionStatus.TreasuryAuthorized:
        userCanAction = this.roles.find((r) => r == token.UserRoles) == UserRoles.TreasuryOperationAuthorizer.toString()
                        || this.roles.find((r) => r == token.UserRoles) == UserRoles.TradeOperationAuthorizer.toString();
        break;
      case TransactionStatus.TreasuryOperationAuthorized:
        userCanAction = this.roles.find((r) => r == token.UserRoles) == UserRoles.TradeOperationAuthorizer.toString();
        break;
      case TransactionStatus.TradeOperationAuthorized:
        userCanAction = this.roles.find((r) => r == token.UserRoles) == UserRoles.TradeOperationAuthorizer.toString();
        break;
    }

    console.log('appTransactionalRole hasRole', hasRole);
    console.log('appTransactionalRole userCanAction', userCanAction);

    if (hasRole== true && userCanAction == true) {
      this.el.nativeElement.style.display = 'block';

    }
    else
    {
      this.el.nativeElement.style.display = 'none';
    }

  }

}
