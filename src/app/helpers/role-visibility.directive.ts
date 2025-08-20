import { Directive, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../content/users/auth.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appRoleVisibility]'
})
export class RoleVisibilityDirective implements OnInit, OnDestroy {
  @Input() requiredRoles: number[] = [];
  @Input() requiredUserTypes: number[] = [];
  @Input() hideMode: boolean = false; // If true, hides element when user has access, shows when no access

  private authSubscription?: Subscription;

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.checkVisibility();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private checkVisibility() {
    const userRole = this.authService.getUserRole();
    const userType = this.authService.getUserType();

    // If no restrictions are specified, show the element
    if ((!this.requiredRoles || this.requiredRoles.length === 0) && 
        (!this.requiredUserTypes || this.requiredUserTypes.length === 0)) {
      this.setElementVisibility(true);
      return;
    }

    // If user is not authenticated, hide the element
    if (userRole === null || userType === null) {
      this.setElementVisibility(false);
      return;
    }

    // Check if user has required role
    const hasRequiredRole = this.requiredRoles.length === 0 || this.requiredRoles.includes(userRole);
    
    // Check if user has required user type
    const hasRequiredUserType = this.requiredUserTypes.length === 0 || this.requiredUserTypes.includes(userType);

    // User must have both required role AND required user type
    const hasAccess = hasRequiredRole && hasRequiredUserType;

    // Apply hideMode logic
    const shouldShow = this.hideMode ? !hasAccess : hasAccess;

    this.setElementVisibility(shouldShow);
  }

  private setElementVisibility(show: boolean) {
    const element = this.elementRef.nativeElement;
    if (show) {
      element.style.display = '';
      element.style.visibility = 'visible';
    } else {
      element.style.display = 'none';
      element.style.visibility = 'hidden';
    }
  }
}
