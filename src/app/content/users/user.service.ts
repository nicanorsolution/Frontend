import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserResponse,  UserDeleteRequest, CreateUserCommand, RoleResponse, ChangeRolePermissionCommand, ApproveOrRejectChangeCommand, EntityIdLookupName, UserType } from './user.models';
import { PaginatedList } from 'src/app/helpers/pagination';
import { CustomersService } from '../customers/services/customers.services';
import { CorporateQuery, IndividualQuery } from '../customers/models/customer.models';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl = `${environment.apiUrl}/v1/api/users`;

  constructor(private http: HttpClient, private customersService: CustomersService) { }

  createUser(request: CreateUserCommand): Observable<any> {
    return this.http.post(this.baseUrl + '/create', { ...request });
  }

  changeUserRole(request: ChangeRolePermissionCommand):Observable<any> {
    return this.http.post(this.baseUrl + '/change-roles-permissions', { ...request });
  }

  approvedRejectUserChange(request: ApproveOrRejectChangeCommand): Observable<any> {

    return this.http.post(this.baseUrl + '/approve-reject-change-delete', { ...request });
  }

  DeleteUser(request: UserDeleteRequest): Observable<any> {
    return this.http.post(this.baseUrl + '/delete', { ...request });
  }


  getUsers(userName: string, pageNumber: number = 1, pageSize: number = 10, userType?: UserType): Observable<PaginatedList<UserResponse>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (userName) {
      params = params.append('userName', userName);
    }

    if (userType !== null && userType !== undefined) {
      params = params.append('userType', userType.toString());
    }

    return this.http.get<PaginatedList<UserResponse>>(`${this.baseUrl}`, { params });
  }

  getRoles(userType?: UserType): Observable<RoleResponse[]> {
    let params = new HttpParams();

    if (userType !== null && userType !== undefined) {
      params = params.set('userType', userType.toString());
    }

    return this.http.get<RoleResponse[]>(`${this.baseUrl}/roles`, { params });
  }

   lookupForCorporate(corporateName : string){
      const query = {
        name : corporateName,
        pageNumber : 1,
        pageSize : 10
      } as CorporateQuery;

      return this.customersService.getCorporates(query).pipe(
        map(x => x.items.map(y => ({ id: y.id, name: y.name }) as EntityIdLookupName))
      );
    }

    lookupForIndividual(individualName: string) {
      const query = {
        name: individualName,
        pageNumber: 1,
        pageSize: 10
      } as IndividualQuery;

      return this.customersService.getIndividuals(query).pipe(
        map(x => x.items.map(y => ({ id: y.id, name: y.name }) as EntityIdLookupName))
      );
    }

}
