import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { FieldsetModule } from 'primeng/fieldset';
import { DividerModule } from 'primeng/divider';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TabViewModule } from 'primeng/tabview';
import { PickListModule } from 'primeng/picklist';
import { FileUploadModule } from 'primeng/fileupload';
import { StepsModule } from 'primeng/steps';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {CheckboxModule} from 'primeng/checkbox';
import { RoleDirective } from '../content/users/role.directive';
import { NumberWithCommasPipe } from './number-with-commas-pipe';
import { FileSizePipe } from './pipes/file-size.pipe';
import { ListboxModule } from 'primeng/listbox';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MultiSelectModule } from 'primeng/multiselect';
import { EditorModule } from 'primeng/editor';
import {  ConfirmDialogModule } from 'primeng/confirmdialog';

import { PermissionDirective } from '../content/users/permission.direction';
import { RoleAdminDirective } from '../content/users/admin.action.directive';
import { TransactionalRoleDirective } from '../content/users/transactionalrole.directive';
import { RoleVisibilityDirective } from './role-visibility.directive';
import { StatusComponent } from './status/status.component';

@NgModule({
  declarations: [
    RoleDirective,
    PermissionDirective,
    RoleAdminDirective,
    TransactionalRoleDirective,
    RoleVisibilityDirective,
    NumberWithCommasPipe,
    FileSizePipe,
    StatusComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    FieldsetModule,
    DividerModule,
    PickListModule,
    AutoCompleteModule,
    CalendarModule,
    InputNumberModule,
    InputMaskModule,
    TabViewModule,
    FileUploadModule,
    StepsModule,
    MessagesModule,
    MessageModule,
    SweetAlert2Module.forRoot(),
    ProgressSpinnerModule,
    ListboxModule,
    NgxExtendedPdfViewerModule,
    CheckboxModule,
    MultiSelectModule,
    EditorModule,

    ConfirmDialogModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    FieldsetModule,
    DividerModule,
    PickListModule,
    AutoCompleteModule,
    CalendarModule,
    InputNumberModule,
    InputMaskModule,
    TabViewModule,
    FileUploadModule,
    StepsModule,
    MessagesModule,
    MessageModule,
    SweetAlert2Module,
    RoleDirective,
    PermissionDirective,
    RoleAdminDirective,
    TransactionalRoleDirective,
    RoleVisibilityDirective,
    NumberWithCommasPipe,
    FileSizePipe,
    StatusComponent,
    ProgressSpinnerModule,
    ListboxModule,
    NgxExtendedPdfViewerModule,
    CheckboxModule,
    MultiSelectModule,
    EditorModule,

    ConfirmDialogModule
  ]
})
export class SharedModule { }
