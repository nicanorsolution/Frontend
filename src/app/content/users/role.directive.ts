import { Directive, Input, Renderer2, ElementRef, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Directive({
  selector: '[appRole]'
})
export class RoleDirective implements OnInit {
  @Input('appRole') role: string[] = [];

  constructor(private authService: AuthService, private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const token = this.authService.getDecodedToken();


    if (token && token.UserRoles == this.role.find((r) => r == token.UserRoles)) {
      this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
    } else {
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
    }
    // this.el.nativeElement.style.display = 'none';

  }
}
