import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../content/users/auth.service';
import * as Forge from 'node-forge';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private readonly publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbimc1HpnjVgL6EyUuufu9qzI9
aqHUUJOrS5mDUPyM5zkbzuiU8q7DBrN/qgyJ5wlrXPvr2HgnvYGBmREES6Si+odO
TIUI5g7VwX2DN3af4W30z1YE+RbaOFGOtOcF4ivwgqIQ6u5GhoBUvwXGQ5rwj2k2
B70i9Ku7K7hkcNbf/QIDAQAB
-----END PUBLIC KEY-----`;
  loginForm: FormGroup = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    token: ['', Validators.required]
  });

  errorMessages = "";
  showPassword = false;
  isLoading = false;

  constructor(private readonly route: Router, private readonly fb: FormBuilder, private readonly authService: AuthService) { }

  ngOnInit() {
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessages = "";
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.loginForm.invalid) {
      this.errorMessages = "All Fields are required";
      return;
    }

    this.isLoading = true;
    this.authService.loginAppUser({
      userName: this.encryptValue(this.loginForm.value.email),
      password: this.encryptValue( this.loginForm.value.password),
      otp: this.loginForm.value.token
    }).subscribe({
      next: (res) => {
        console.log('login success then renavigate', res);
        this.isLoading = false;
        // Use setTimeout to ensure token is stored before navigation
       /*  setTimeout(() => {
          // Check if user needs to reset password
          const shouldResetPassword = this.authService.redirectToResetPasswordPage();
          console.log('LoginComponent: Should reset password:', shouldResetPassword);
          if (shouldResetPassword) {
            console.log('User needs to reset password, redirecting to reset-password page');
            this.route.navigate(['/reset-password']);
          } else {
            console.log('User does not need to reset password, redirecting to dashboard');
            this.route.navigate(['/admin/dashboard']);
          }
        }, 10000); */
         // Check if user needs to reset password
          const shouldResetPassword = this.authService.redirectToResetPasswordPage();
          console.log('LoginComponent: Should reset password:', shouldResetPassword);
          if (shouldResetPassword) {
            console.log('User needs to reset password, redirecting to reset-password page');
            this.route.navigate(['/reset-password']);
          } else {
            console.log('User does not need to reset password, redirecting to dashboard');
            this.route.navigate(['/admin/dashboard']);
          }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessages = "Invalid Username or password or token";
      }
    });
  }

  encryptValue(value: string) {
    try {
      const rsa = Forge.pki.publicKeyFromPem(this.publicKey);
      return window.btoa(rsa.encrypt(value));
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt value');
    }
  }
}
