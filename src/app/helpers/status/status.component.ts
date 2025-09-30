import { Component, Input } from '@angular/core';

export type StatusSeverity = 'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary';

@Component({
  selector: 'status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent {
  @Input() value: string = '';
  @Input() severity: StatusSeverity | string = 'primary';
  @Input() icon?: string;
  @Input() rounded: boolean = true;
  @Input() size: 'small' | 'normal' | 'large' = 'normal';

  constructor() { }

  get cssClasses(): string {
    // Normalize severity to ensure it's a valid StatusSeverity
    const normalizedSeverity = this.normalizeSeverity(this.severity);

    return [
      'status-tag',
      `status-${normalizedSeverity}`,
      `status-${this.size}`,
      this.rounded ? 'status-rounded' : '',
      this.icon ? 'status-with-icon' : ''
    ].filter(Boolean).join(' ');
  }

  private normalizeSeverity(severity: unknown): StatusSeverity {
    const validSeverities: StatusSeverity[] = ['success', 'info', 'warning', 'danger', 'primary', 'secondary'];
    if (typeof severity !== 'string') {
      return 'primary';
    }

    const key = severity.toLowerCase();

    // If it's already a valid severity, return it
    if (validSeverities.includes(key as StatusSeverity)) {
      return key as StatusSeverity;
    }

    // Handle common variations and mappings
    const severityMap: { [key: string]: StatusSeverity } = {
      'error': 'danger',
      'warn': 'warning',
      'information': 'info'
    };

    const mapped = severityMap[key];
    return mapped || 'primary';
  }
}
