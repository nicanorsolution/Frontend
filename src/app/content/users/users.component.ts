import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { TableLazyLoadEvent } from 'primeng/table';
import { Utility } from 'src/app/helpers/utilities-methods.class';
import { UserResponse, UserType, RoleResponse, CreateUserCommand } from './user.models';
import { UserService } from './user.service';
import { CheckerDecision } from 'src/app/helpers/checker-decision';
import { error } from 'console';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  users: UserResponse[] = [];
  createUserForm!: FormGroup;
  searchForm!: FormGroup;
  isSubmitted = false;
  totalRows: number = 0;
  currentPage: number = 1;
  pageSize: number = 15;

  @ViewChild('dialog_operation_swal')
  public readonly dialog_operation_swal!: SwalComponent;

  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {

    this.createUserForm = this.formBuilder.group({
      userName: [null,[ Validators.required, Validators.email]],
      role: [null, Validators.required]
    });

    this.searchForm = this.formBuilder.group({
      searchTerm: ['']
    });

    this.loadRoles();
    this.getUser();
  }
  roles: RoleResponse[] = [];
  userTypes = Object.entries(UserType)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({ name: key, value: value }));

  userDialog = false;
  openAddUserDialog() {
    this.userDialog = true;
  }
  createUser() {
    if (this.createUserForm.invalid) return;

    this.isSubmitted = true;
    const formValues = this.createUserForm.value;

    const request: CreateUserCommand = {
      email: formValues.userName,
      roles: [formValues.role.roleId],
      userType: UserType.InternalUser,
      permissions: [], // Add if needed
      password: 'NoNeedForInternalUser!'
    };

    this.userService.createUser(request).subscribe(
      (data) => {
        this.display_success_or_failed_operation("User created successfully", true);
        this.getUser();
        this.isSubmitted = false;
        this.createUserForm.reset();
        this.userDialog = false;
      },
      (error) => {
        this.display_success_or_failed_operation("Failed to create user: " + error?.error?.detail, false);
        this.isSubmitted = false;
      }
    );
  }

  loadRoles() {
    this.userService.getRoles().subscribe(
      (data) => {
        this.roles = data;
      },
      (error) => {
        this.display_success_or_failed_operation("Failed to load roles", false);
      }
    );
  }

  CheckerDecision = CheckerDecision;

  checkerDecision(user: UserResponse, checkerDecision: CheckerDecision) {
    this.userService.approvedDeleteUser({ userId: user.id, action: checkerDecision })
      .subscribe(
        (data) => {
          console.log(data);
          this.display_success_or_failed_operation(checkerDecision == 1 ? "Request was  successfully approved" : "Request was  successfully canceled", true);
          //   this.merchantDialog=false;

          this.getUser();

        },
        (error) => {
          console.error(error);
          this.display_success_or_failed_operation("You cannot approve or reject a request you created ", false);

        }
      );
  }
  deleteUser(user: UserResponse) {
    this.userService.DeleteUser({ userId: user.id })
      .subscribe(
        (data) => {
          this.display_success_or_failed_operation("Request successfully deleted", true);
        },
        (error) => {
          this.display_success_or_failed_operation("Request failed", false);

        }
      )
  }


  getUser(reset: boolean = false) {
    if (reset) {
      this.currentPage = 1;
    }

    const searchTerm = this.searchForm?.get('searchTerm')?.value || '';

    this.userService.getUsers(searchTerm, this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.users = data.items;
        this.totalRows = data.totalCount;
      },
      (error) => {
        this.display_success_or_failed_operation("Failed to load users", false);
      }
    );
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.getUser();
  }

  searchUsers() {
    this.getUser(true);
  }

  colorStatus(status: string) {
    return Utility.colorStatus(status);
  }

  display_success_or_failed_operation(message: string, status: boolean) {
    this.dialog_operation_swal.icon = status == true ? "success" : "error";
    this.dialog_operation_swal.title = status == true ? "Success" : "Error";
    this.dialog_operation_swal.text = message;
    this.dialog_operation_swal.fire();
  }

  getRoleName(roleId: number): string {
    const role = this.roles.find(r => r.roleId === roleId);
    return role ? role.roleName : 'Unknown Role';
  }

}


