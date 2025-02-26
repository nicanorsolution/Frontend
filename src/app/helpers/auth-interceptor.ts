import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { switchMap, catchError, filter, take } from 'rxjs/operators';
import { AuthService } from '../content/users/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip token handling for login and refresh endpoints
    if (this.isAuthEndpoint(request.url)) {
      return next.handle(request);
    }

    const authHeaders = this.authService.getAuthHeaders();
    const clonedRequest = request.clone({ setHeaders: authHeaders });

    return next.handle(clonedRequest).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          return next.handle(this.addToken(request));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.logout().subscribe();
          this.router.navigate(['/login']);
          return throwError(err);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(() => next.handle(this.addToken(request)))
    );
  }

  private addToken(request: HttpRequest<any>) {
    const authHeaders = this.authService.getAuthHeaders();
    return request.clone({ setHeaders: authHeaders });
  }

  private isAuthEndpoint(url: string): boolean {
    return url.includes('/api/user/login') ||
           url.includes('/api/user/refresh-token') ||
           url.includes('/api/user/logout');
  }
}
