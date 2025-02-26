import { Directive, Input, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appButtonVisibility]'
})
export class ButtonVisibilityDirective implements OnInit {
  @Input() itemStatus!: string;
  @Input() buttonAction!: string;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.toggleButtonVisibility();
  }

  toggleButtonVisibility() {
    const button = this.elementRef.nativeElement;

    switch (this.itemStatus) {
      case 'Created':
        this.showButton(button, this.buttonAction === 'approve' || this.buttonAction === 'cancel');
        break;
      case 'Canceled':
        this.showButton(button, false);
        break;
      case 'Pending':
        this.showButton(button, this.buttonAction === 'approve' || this.buttonAction === 'cancel');
        break;
      case 'Approved':
        this.showButton(button, this.buttonAction === 'update' || this.buttonAction === 'delete' );
        break;
      case 'Opened':
        this.showButton(button,this.buttonAction==='opened');
        break;
      case 'Locked':
        this.showButton(button,this.buttonAction==='locked');
        break;
      case 'PENDING_DUPLICATE':
        this.showButton(button,this.buttonAction==='approve' || this.buttonAction==='cancel');
        break;

      default:
        this.showButton(button, false);
        break;
    }
  }

  showButton(button: HTMLElement, show: boolean) {
    button.style.display = show ? 'inline-block' : 'none';
  }
}
