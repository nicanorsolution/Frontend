import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../content/users/user.service';
import { AuthService } from '../content/users/auth.service';
import { ChangePasswordCommand } from '../content/users/user.models';
import * as Forge from 'node-forge';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  private readonly publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbimc1HpnjVgL6EyUuufu9qzI9
aqHUUJOrS5mDUPyM5zkbzuiU8q7DBrN/qgyJ5wlrXPvr2HgnvYGBmREES6Si+odO
TIUI5g7VwX2DN3af4W30z1YE+RbaOFGOtOcF4ivwgqIQ6u5GhoBUvwXGQ5rwj2k2
B70i9Ku7K7hkcNbf/QIDAQAB
-----END PUBLIC KEY-----`;

  resetPasswordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  errorMessages = "";
  successMessage = "";
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;
  userId: string = '';

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log('ResetPasswordComponent: Component initialized');
    this.resetPasswordForm.valueChanges.subscribe(() => {
      this.errorMessages = "";
      this.successMessage = "";
    });

    // Get userId from token
    const decodedToken = this.authService.getDecodedToken();
    console.log('ResetPasswordComponent: Decoded token:', decodedToken);
    if (decodedToken && (decodedToken.UserId || decodedToken.nameid)) {
      this.userId = decodedToken.UserId || decodedToken.nameid;
      console.log('ResetPasswordComponent: User ID set to:', this.userId);
    } else {
      // If no valid token, redirect to login
      console.log('ResetPasswordComponent: No valid token, redirecting to login');
      this.route.navigate(['/login']);
    }
  }

  passwordStrengthValidator(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /\d+/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]+/.test(value);

    const isValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
    if (!isValid) {
      return { 'passwordStrength': { value: control.value } };
    }
    return null;
  }

  passwordMatchValidator(form: AbstractControl): {[key: string]: any} | null {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  togglePasswordVisibility(field: string) {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  resetPassword() {
    if (this.resetPasswordForm.invalid) {
      this.markFormGroupTouched();

      // Generate a more user-friendly error message
      const errors = [];
      if (this.resetPasswordForm.get('currentPassword')?.errors?.['required']) {
        errors.push('Current password is required');
      }
      if (this.resetPasswordForm.get('newPassword')?.errors?.['required']) {
        errors.push('New password is required');
      }
      if (this.resetPasswordForm.get('newPassword')?.errors?.['passwordStrength']) {
        errors.push('New password does not meet requirements');
      }
      if (this.resetPasswordForm.get('confirmPassword')?.errors?.['required']) {
        errors.push('Please confirm your password');
      }
      if (this.resetPasswordForm.errors?.['passwordMismatch']) {
        errors.push('Passwords do not match');
      }

      this.errorMessages = errors.length > 0 ? errors.join('. ') : "Please fix the form errors.";
      return;
    }

    if (!this.userId) {
      this.errorMessages = "User session invalid. Please login again.";
      return;
    }

    this.isSubmitting = true;
    this.errorMessages = "";

    const changePasswordCommand: ChangePasswordCommand = {
      userId: this.userId,
      currentPassword: this.encryptValue(this.resetPasswordForm.value.currentPassword),
      newPassword: this.encryptValue(this.resetPasswordForm.value.newPassword)
    };

    this.userService.ChangeUserPassword(changePasswordCommand).subscribe({
      next: (_response) => {
        this.isSubmitting = false;
        this.successMessage = "Password changed successfully! Redirecting to login...";

        // Clear the password reset flag by logging out and back in, or redirect immediately
        setTimeout(() => {
          this.route.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Password change error:', error);

        if (error.status === 400) {
          this.errorMessages = error.error?.message || "Current password is incorrect or new password doesn't meet requirements.";
        } else if (error.status === 401) {
          this.errorMessages = "Session expired. Please login again.";
          setTimeout(() => {
            this.authService.logout().subscribe();
            this.route.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessages = "Failed to change password. Please try again.";
        }
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.resetPasswordForm.controls).forEach(key => {
      const control = this.resetPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

/*   encryptValue(value: string): string {
    try {
      const publicKey = Forge.pki.publicKeyFromPem(this.publicKey);
      const encrypted = publicKey.encrypt(value, 'RSA-OAEP');
      return Forge.util.encode64(encrypted);
    } catch (error) {
      console.error('Encryption failed:', error);
      return value; // Fallback to plain text if encryption fails
    }
  } */
   encryptValue(value: string) {
      try {
        const rsa = Forge.pki.publicKeyFromPem(this.publicKey);
        return window.btoa(rsa.encrypt(value));
      } catch (error) {
        console.error('Encryption failed:', error);
        throw new Error('Failed to encrypt value');
      }
    }

  logout() {
    this.authService.logout().subscribe({
      complete: () => {
        this.route.navigate(['/login']);
      }
    });
  }

  getPasswordStrengthMessage(): string {
    const newPasswordControl = this.resetPasswordForm.get('newPassword');
    if (newPasswordControl?.hasError('passwordStrength') && newPasswordControl?.touched) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
    }
    return '';
  }
}
