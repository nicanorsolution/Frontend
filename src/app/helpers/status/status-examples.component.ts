import { Component } from '@angular/core';
import { StatusSeverity } from './status.component';

@Component({
  selector: 'app-status-examples',
  template: `
    <div class="status-examples">
      <h3>Status Component Examples</h3>

      <div class="example-group">
        <h4>Basic Status Tags</h4>
        <div class="examples-row">
          <status value="Draft" severity="secondary"></status>
          <status value="Published" severity="success"></status>
          <status value="Pending" severity="warning"></status>
          <status value="Rejected" severity="danger"></status>
          <status value="Active" severity="primary"></status>
        </div>
      </div>

      <div class="example-group">
        <h4>Business Status Examples</h4>
        <div class="examples-row">
          <status value="Approved" severity="success"></status>
          <status value="Under Review" severity="info"></status>
          <status value="Needs Attention" severity="warning"></status>
          <status value="Blocked" severity="danger"></status>
        </div>
      </div>

      <div class="example-group">
        <h4>Different Sizes</h4>
        <div class="examples-row">
          <status value="Small" severity="primary" size="small"></status>
          <status value="Normal" severity="success" size="normal"></status>
          <status value="Large" severity="info" size="large"></status>
        </div>
      </div>

      <div class="example-group">
        <h4>Dynamic Status Example</h4>
        <div class="examples-row">
          <status [value]="dynamicStatus.text" [severity]="dynamicStatus.severity"></status>
          <button (click)="changeDynamicStatus()">Change Status</button>
        </div>
      </div>

      <div class="example-group">
        <h4>Table Usage Preview</h4>
        <div class="table-preview">
          <div class="table-row">
            <span>Document 1</span>
            <status value="Published" severity="success"></status>
          </div>
          <div class="table-row">
            <span>Document 2</span>
            <status value="Draft" severity="secondary"></status>
          </div>
          <div class="table-row">
            <span>Document 3</span>
            <status value="Pending" severity="warning"></status>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .status-examples {
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f9fafb;
      min-height: 100vh;
    }

    .example-group {
      margin-bottom: 2.5rem;
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .example-group h4 {
      margin-bottom: 1rem;
      color: #374151;
      font-size: 1rem;
      font-weight: 600;
    }

    .examples-row {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .table-preview {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
    }

    .table-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .table-row:nth-child(even) {
      background-color: #f9fafb;
    }

    button {
      padding: 0.5rem 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background 0.2s;
      font-size: 0.875rem;
      font-weight: 500;
    }

    button:hover {
      background: #2563eb;
    }

    h3 {
      margin-bottom: 2rem;
      color: #111827;
      font-size: 1.5rem;
      font-weight: 700;
    }
  `]
})
export class StatusExamplesComponent {
  dynamicStatus = {
    text: 'Pending',
    severity: 'warning' as StatusSeverity
  };

  private readonly statusOptions = [
    { text: 'Pending', severity: 'warning' as StatusSeverity },
    { text: 'Approved', severity: 'success' as StatusSeverity },
    { text: 'Rejected', severity: 'danger' as StatusSeverity },
    { text: 'Processing', severity: 'info' as StatusSeverity }
  ];

  private currentIndex = 0;

  changeDynamicStatus() {
    this.currentIndex = (this.currentIndex + 1) % this.statusOptions.length;
    this.dynamicStatus = { ...this.statusOptions[this.currentIndex] };
  }
}
