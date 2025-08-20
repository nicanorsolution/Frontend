import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { TableLazyLoadEvent } from 'primeng/table';
import { Utility } from 'src/app/helpers/utilities-methods.class';
import { UserResponse, UserType, RoleResponse, CreateUserCommand, UserRoles } from './user.models';
import { UserService } from './user.service';
import { CheckerDecision } from 'src/app/helpers/checker-decision';
import { error } from 'console';
import { Observable, of } from 'rxjs';
import { UserRoleEnum } from 'src/app/helpers/UserRoleEnum';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

   UserRoleEnum = UserRoleEnum
   UserType = UserType;
  users: UserResponse[] = [];
  createUserForm!: FormGroup;
  searchForm!: FormGroup;
  isSubmitted = false;
  totalRows: number = 0;
  currentPage: number = 1;
  pageSize: number = 15;
  expandedRows: { [key: string]: boolean } = {};

  // New properties for external user handling
  selectedUserType: UserType = UserType.InternalUser;
  entityMappingType: 'corporate' | 'individual' | null = null;
  corporateOptions: any[] = [];
  individualOptions: any[] = [];

  UserRoles = UserRoles;

  @ViewChild('dialog_operation_swal')
  public readonly dialog_operation_swal!: SwalComponent;

  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {

    this.createUserForm = this.formBuilder.group({
      userName: [null, [Validators.required, Validators.email]],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      phone: [null, Validators.required],
      userType: [UserType.InternalUser, Validators.required],
      role: [null, Validators.required],
      entityMappingType: [null],
      corporateOrIndividualId: [null]
    });

    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
      userType: [null]
    });

    this.loadRoles(UserType.InternalUser); // Load default roles for internal user
    this.getUser();
    this.expandedRows = {};
  }
  roles: RoleResponse[] = [];
  userTypes = Object.entries(UserType)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({ name: key, value: value }));

  userDialog = false;
  openAddUserDialog() {
    this.userDialog = true;
    this.resetForm();
  }
  createUser() {
    if (this.createUserForm.invalid) return;

    this.isSubmitted = true;
    const formValues = this.createUserForm.value;

    const request: CreateUserCommand = {
      email: formValues.userName,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      phone: formValues.phone,
      roles: [formValues.role.roleId],
      userType: formValues.userType,
      permissions: []
    };

    // Add corporate or individual ID for external users
    if (formValues.userType === UserType.ExternalUser && formValues.corporateOrIndividualId) {
      request.corporateOrIndividualId = formValues.corporateOrIndividualId.id;
    }

    this.userService.createUser(request).subscribe(
      (data) => {
        this.display_success_or_failed_operation("User created successfully", true);
        this.getUser();
        this.isSubmitted = false;
        this.createUserForm.reset();
        this.userDialog = false;
        this.resetForm();
      },
      (error) => {
        this.display_success_or_failed_operation("Failed to create user: " + error?.error?.detail, false);
        this.isSubmitted = false;
      }
    );
  }

  loadRoles(userType: UserType) {
    this.userService.getRoles(userType).subscribe(
      (data) => {
        this.roles = data;
        // Reset role selection when roles change
        this.createUserForm.patchValue({ role: null });
      },
      (error) => {
        this.display_success_or_failed_operation("Failed to load roles", false);
      }
    );
  }

  CheckerDecision = CheckerDecision;

  checkerDecision(user: UserResponse, checkerDecision: CheckerDecision) {

    console.log("checkerDecision", user, checkerDecision);

    this.userService.approvedRejectUserChange({ userId: user.id, checkerDecision: checkerDecision })
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

  lockUser(user: UserResponse) {
    this.userService.LockUser(user.id)
      .subscribe(
        (data) => {
          this.display_success_or_failed_operation("User successfully locked", true);
          this.getUser();
        },
        (error) => {
          this.display_success_or_failed_operation("Failed to lock user", false);
        }
      );
  }
  unlockUser(user: UserResponse) {
    this.userService.UnlockUser(user.id)
      .subscribe(
        (data) => {
          this.display_success_or_failed_operation("User successfully unlocked", true);
          this.getUser();
        },
        (error) => {
          this.display_success_or_failed_operation("Failed to unlock user", false);
        }
      );
  }
  resetUserPassword(user: UserResponse) {
    this.userService.ResetUserPassword(user.id)
      .subscribe(
        (data) => {
          this.display_success_or_failed_operation("User password reset successfully", true);
          this.getUser();
        },
        (error) => {
          this.display_success_or_failed_operation("Failed to reset user password", false);
        }
      );
  }

  getUser(reset: boolean = false) {
    if (reset) {
      this.currentPage = 1;
    }

    const searchTerm = this.searchForm?.get('searchTerm')?.value || '';
    const userType = this.searchForm?.get('userType')?.value || null;

    this.userService.getUsers(searchTerm, this.currentPage, this.pageSize, userType).subscribe(
      (data) => {
        this.users = [...data.items]; // Create new array reference for change detection
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

  getUserTypeName(userType: UserType): string {
    return userType === UserType.InternalUser ? 'Internal User' : 'External User';
  }

//  UserType = UserType;

  onUserTypeChange() {
    this.selectedUserType = this.createUserForm.get('userType')?.value;

    // Load roles based on selected user type
    this.loadRoles(this.selectedUserType);

    // Reset entity mapping fields when user type changes
    this.createUserForm.patchValue({
      entityMappingType: null,
      corporateOrIndividualId: null,
      role: null // Reset role selection as well
    });
    this.entityMappingType = null;
    this.corporateOptions = [];
    this.individualOptions = [];

    // Update validators based on user type
    const entityMappingControl = this.createUserForm.get('entityMappingType');
    const corporateOrIndividualControl = this.createUserForm.get('corporateOrIndividualId');

    if (this.selectedUserType === UserType.ExternalUser) {
      entityMappingControl?.setValidators([Validators.required]);
      corporateOrIndividualControl?.setValidators([Validators.required]);
    } else {
      entityMappingControl?.clearValidators();
      corporateOrIndividualControl?.clearValidators();
    }

    entityMappingControl?.updateValueAndValidity();
    corporateOrIndividualControl?.updateValueAndValidity();
  }

  onEntityMappingTypeChange() {
    this.entityMappingType = this.createUserForm.get('entityMappingType')?.value;
    this.createUserForm.patchValue({ corporateOrIndividualId: null });
    this.corporateOptions = [];
    this.individualOptions = [];
  }

  searchCorporate(event: any) {
    const query = event.query;
    if (query && query.length >= 2) {
      this.userService.lookupForCorporate(query).subscribe(
        (data) => {
          this.corporateOptions = data;
        },
        (error) => {
          console.error('Error searching corporates:', error);
        }
      );
    }
  }

  searchIndividual(event: any) {
    const query = event.query;
    if (query && query.length >= 2) {
      this.userService.lookupForIndividual(query).subscribe(
        (data) => {
          this.individualOptions = data;
        },
        (error) => {
          console.error('Error searching individuals:', error);
        }
      );
    }
  }

  resetForm() {
    this.selectedUserType = UserType.InternalUser;
    this.entityMappingType = null;
    this.corporateOptions = [];
    this.individualOptions = [];
    this.createUserForm.patchValue({
      userType: UserType.InternalUser,
      entityMappingType: null,
      corporateOrIndividualId: null
    });
    // Load roles for internal user when resetting
    this.loadRoles(UserType.InternalUser);
  }

}


