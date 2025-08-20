import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../content/users/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordGuard implements CanActivate {

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const accessToken = this.authService.getStoreTokens();
    console.log('ResetPasswordGuard: Checking access token:', accessToken ? 'Token exists' : 'No token');

    if (!accessToken) {
      console.log('ResetPasswordGuard: No access token, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }

    const shouldShowResetPasswordPage = this.authService.redirectToResetPasswordPage();
    console.log('ResetPasswordGuard: Should show reset password page:', shouldShowResetPasswordPage);

    if (shouldShowResetPasswordPage) {
      console.log('ResetPasswordGuard: User needs to reset password, allowing access to reset-password page');
      return true;
    } else {
      console.log('ResetPasswordGuard: User does not need to reset password, redirecting to dashboard');
      this.router.navigate(['/admin/dashboard']);
      return false;
    }
  }
}
