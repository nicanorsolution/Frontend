import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginRequest, UserType } from './user.models';
import { jwtDecode } from 'jwt-decode';
import { UserRoleEnum } from 'src/app/helpers/UserRoleEnum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  loginAppUser(request: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/v1/api/users/login`, request).pipe(
      tap(response => {
        console.log('token response for login', response);
        this.storeTokens(response.accessToken, response.refreshToken);
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');
    return this.http.post<any>(`${this.apiUrl}/api/users/refresh-token`, { refreshToken: refreshToken, accessToken : accessToken }).pipe(
      tap(response => {
        this.storeTokens(response.accessToken, response.refreshToken);
      })
    );
  }

  private storeTokens(accessToken: string, refreshToken : string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  public getStoreTokens() {
   return  localStorage.getItem('accessToken') == undefined ? null : localStorage.getItem('accessToken');
       // localStorage.setItem('refreshToken', refreshToken);
  }
  private removeStoreTokens() {
     localStorage.removeItem('accessToken');
     localStorage.removeItem('refreshToken');
    // localStorage.setItem('refreshToken', refreshToken);
  }

  getAuthHeaders() {
    const accessToken =  this.getStoreTokens();
    return { Authorization: `Bearer ${accessToken}` };
  }

  getDecodedToken(): any {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        return jwtDecode(token);
      } catch (e) {
        console.error('Failed to decode token', e);
        return null;
      }
    }
    return null;
  }

  getUserRole(): number | null {
    const decodedToken = this.getDecodedToken();
    console.log('AuthService: Decoded token:', decodedToken);
    return decodedToken ? parseInt(decodedToken.UserRoles, 10) : null;
  }

  getUserType(): number | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? parseInt(decodedToken.UserType, 10) : null;
  }

  redirectToResetPasswordPage(): boolean {
    const decodedToken = this.getDecodedToken();
    console.log('AuthService: Decoded token for password reset:', decodedToken);
    return decodedToken?.PwdRst === 'True';
  }
  logout() {
    const accessToken =  localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : null;
    const refreshToken =  localStorage.getItem('refreshToken') ? localStorage.getItem('refreshToken') : null;
    console.log('Logging out user with access token:', accessToken);

    const logoutcommand = {
      accessToken: accessToken,
      refreshToken: refreshToken
    }

    if(accessToken != null)
      return this.http.post<any>(`${this.apiUrl}/v1/api/users/logout`, logoutcommand).pipe(
        tap(response => {
          console.log('token response for logout', response);
          this.removeStoreTokens();
        })
      );
    else
      return of({});
  }
}
