import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginRequest } from './user.models';
import { jwtDecode } from 'jwt-decode';

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
      return jwtDecode(token);
    }
    return null;
  }

  logout() {
    const accessToken =  localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : null;

    if(accessToken != null)
      return this.http.get<any>(`${this.apiUrl}/api/user/logout/` + accessToken).pipe(
        tap(response => {
          console.log('token response for login', response);
          this.removeStoreTokens();
        })
      );
    else
      return of({});
  }
}
