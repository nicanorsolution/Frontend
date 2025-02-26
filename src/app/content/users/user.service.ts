import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserResponse, UserApproveDeleteRequest, UserDeleteRequest, CreateUserCommand, RoleResponse, ChangeRolePermissionCommand, ApproveOrRejectChangeCommand } from './user.models';
import { PaginatedList } from 'src/app/helpers/pagination';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl = `${environment.apiUrl}/v1/api/users`;

  constructor(private http: HttpClient) { }

  createUser(request: CreateUserCommand): Observable<any> {
    return this.http.post(this.baseUrl + '/create', { ...request });
  }

  changeUserRole(request: ChangeRolePermissionCommand):Observable<any> {
    return this.http.post(this.baseUrl + '/change-roles-permissions', { ...request });
  }

  approvedRejectUserChange(request: ApproveOrRejectChangeCommand): Observable<any> {
    return this.http.post(this.baseUrl + '/approve-reject-change', { ...request });
  }

  DeleteUser(request: UserDeleteRequest): Observable<any> {
    return this.http.post(this.baseUrl + '/delete', { ...request });
  }

  approvedDeleteUser(request: UserApproveDeleteRequest): Observable<any> {
    return this.http.post(this.baseUrl + '/approve-delete', { ...request });
  }

  getUsers(userName: string , pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedList<UserResponse>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (userName) {
      params = params.append('userName', userName);
    }

    return this.http.get<PaginatedList<UserResponse>>(`${this.baseUrl}`, { params });
  }

  getRoles(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(`${this.baseUrl}/roles`);
  }
}
