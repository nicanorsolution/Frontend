import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../content/users/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const accessToken = this.authService.getStoreTokens();
    console.log('AuthGuard: Checking access token:', accessToken ? 'Token exists' : 'No token');

    if (accessToken) {
      // Check if user needs to reset password first
      const shouldShowResetPasswordPage = this.authService.redirectToResetPasswordPage();
      console.log('AuthGuard: Should show reset password page:', shouldShowResetPasswordPage);

      if (shouldShowResetPasswordPage) {
        console.log('AuthGuard: User needs to reset password, redirecting to reset-password page');
        this.router.navigate(['/reset-password']);
        return false;
      }

      const userRole = this.authService.getUserRole();
      const userType = this.authService.getUserType();

      const expectedRoles = next.data['roles'] as number[];
      const expectedUserTypes = next.data['userType'] as number[];

      console.log('AuthGuard: User role:', userRole, 'User type:', userType);
      console.log('AuthGuard: Expected roles:', expectedRoles, 'Expected userTypes:', expectedUserTypes);

      if (!expectedRoles || !expectedUserTypes) {
        // if no roles or userTypes are defined, allow access
        console.log('AuthGuard: No role/userType restrictions, allowing access');
        return true;
      }

      if (userRole === null || userType === null) {
        console.log('AuthGuard: User role or type is null, redirecting to login');
        this.router.navigate(['/login']);
        return false;
      }

      const hasRole = expectedRoles.includes(userRole);
      const hasUserType = expectedUserTypes.includes(userType);

      console.log('AuthGuard: Has role:', hasRole, 'Has userType:', hasUserType);

      if (hasRole && hasUserType) {
        console.log('AuthGuard: Access granted');
        return true;
      } else {
        console.log('AuthGuard: Access denied, redirecting to login');
        this.router.navigate(['/login']); // Or a 'not-authorized' page
        return false;
      }
    } else {
      console.log('AuthGuard: No access token, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}

