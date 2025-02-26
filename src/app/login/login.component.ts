import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../content/users/user.service';
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

  constructor(private route: Router, private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessages = "";
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {

  //  this.route.navigate(['/admin/transaction/view-transaction']);

    if (this.loginForm.invalid) {
      this.errorMessages = "All Fields are required";
      return;
    }
    // initiator@ubagroup.com
    //
    this.authService.loginAppUser({
      userName: this.encryptValue(this.loginForm.value.email),
      password: this.encryptValue( this.loginForm.value.password),
      otp: this.loginForm.value.token
    }).subscribe((res) => {
      console.log('login success then renavigate', res);
      this.route.navigate(['/admin/transaction/view-transaction']);

    }, (error) => {
      this.errorMessages = "Invalid Username or password or token";
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
