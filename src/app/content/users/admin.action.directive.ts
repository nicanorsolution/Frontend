import { UserRoles } from './user.models';
import { Directive, Input, Renderer2, ElementRef, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Directive({
  selector: '[appAdminRole]'
})
export class RoleAdminDirective implements OnInit {
  @Input('Roles') roles: string[] = [];

  constructor(private authService: AuthService,
    private el: ElementRef,
    private renderer: Renderer2) { }

  ngOnInit() {
    // Get user token
    const token = this.authService.getDecodedToken();
    console.log('appAdminRole token', token);

    // Find if user has any of the required roles
    const userHasRole = this.roles.includes(token.UserRoles);

    console.log('appAdminRole userHasRole', userHasRole);

    // Hide element if user DOESN'T have the required role
    if (!userHasRole) {
      // Use renderer instead of direct style manipulation
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
      // Also add !important to ensure style is applied
      this.renderer.setAttribute(this.el.nativeElement, 'style', 'display: none !important');
    }
  }
}
