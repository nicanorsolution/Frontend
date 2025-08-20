import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { NavbarModule } from './shared/navbar/navbar.module';
import { FooterModule } from './shared/footer/footer.module';
import { SidebarModule } from './sidebar/sidebar.module';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthInterceptor } from './helpers/auth-interceptor';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { BnNgIdleService } from 'bn-ng-idle';
import { TagModule } from 'primeng/tag';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    ResetPasswordComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
   // SweetAlert2Module.forRoot(),

    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NavbarModule,
    FooterModule,
    SidebarModule,
    NgxPermissionsModule.forRoot(),
    NgxExtendedPdfViewerModule,
    TagModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    BnNgIdleService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line for ngx extent pdf
})
export class AppModule { }
